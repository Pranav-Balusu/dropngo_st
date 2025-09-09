import * as Location from 'expo-location';
import { supabase } from '@/lib/supabase';

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  timestamp: string;
}

export interface PorterLocation extends LocationData {
  porterId: string;
  bookingId?: string;
  status: 'available' | 'pickup-pending' | 'in-transit' | 'at-delivery';
}

// Get current user location
export const getCurrentLocation = async (): Promise<LocationData | null> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Location permission not granted');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    // Reverse geocoding to get address
    const address = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    const addressString = address.length > 0 
      ? `${address[0].name || ''} ${address[0].street || ''}, ${address[0].city || ''}`.trim()
      : '';

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      address: addressString,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    return null;
  }
};

// Update porter location in real-time
export const updatePorterLocation = async (
  porterId: string, 
  location: LocationData,
  bookingId?: string,
  status: PorterLocation['status'] = 'available'
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('porter_locations')
      .upsert({
        porter_id: porterId,
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address,
        booking_id: bookingId,
        status,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'porter_id'
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error updating porter location:', error);
    throw error;
  }
};

// Get porter location for tracking
export const getPorterLocation = async (porterId: string): Promise<PorterLocation | null> => {
  try {
    const { data, error } = await supabase
      .from('porter_locations')
      .select('*')
      .eq('porter_id', porterId)
      .single();

    if (error) throw error;

    return {
      porterId: data.porter_id,
      latitude: data.latitude,
      longitude: data.longitude,
      address: data.address,
      bookingId: data.booking_id,
      status: data.status,
      timestamp: data.updated_at,
    };
  } catch (error) {
    console.error('Error getting porter location:', error);
    return null;
  }
};

// Subscribe to real-time porter location updates
export const subscribeToPorterLocation = (
  porterId: string,
  callback: (location: PorterLocation) => void
) => {
  const subscription = supabase
    .channel(`porter-location-${porterId}`)
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'porter_locations',
        filter: `porter_id=eq.${porterId}`
      }, 
      (payload) => {
        const data = payload.new as any;
        callback({
          porterId: data.porter_id,
          latitude: data.latitude,
          longitude: data.longitude,
          address: data.address,
          bookingId: data.booking_id,
          status: data.status,
          timestamp: data.updated_at,
        });
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
};

// Calculate distance between two points
export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in kilometers
  return d;
};

// Get nearby porters based on location
export const getNearbyPorters = async (
  userLocation: LocationData,
  radiusKm: number = 10
): Promise<PorterLocation[]> => {
  try {
    const { data, error } = await supabase
      .from('porter_locations')
      .select(`
        *,
        porter_profiles!inner(
          user_id,
          is_available,
          vehicle_type,
          users!inner(name, phone, rating)
        )
      `)
      .eq('status', 'available')
      .eq('porter_profiles.is_available', true);

    if (error) throw error;

    // Filter by distance
    const nearbyPorters = data
      .map(porter => ({
        porterId: porter.porter_id,
        latitude: porter.latitude,
        longitude: porter.longitude,
        address: porter.address,
        status: porter.status,
        timestamp: porter.updated_at,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          porter.latitude,
          porter.longitude
        ),
        porterInfo: porter.porter_profiles,
      }))
      .filter(porter => porter.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);

    return nearbyPorters;
  } catch (error) {
    console.error('Error getting nearby porters:', error);
    return [];
  }
};

// Geocode address to coordinates
export const geocodeAddress = async (address: string): Promise<LocationData | null> => {
  try {
    const results = await Location.geocodeAsync(address);
    if (results.length > 0) {
      return {
        latitude: results[0].latitude,
        longitude: results[0].longitude,
        address,
        timestamp: new Date().toISOString(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

// Start background location tracking for porters
export const startLocationTracking = async (porterId: string, bookingId?: string) => {
  try {
    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Background location permission not granted');
    }

    await Location.startLocationUpdatesAsync('porterLocationTask', {
      accuracy: Location.Accuracy.High,
      timeInterval: 10000, // Update every 10 seconds
      distanceInterval: 10, // Update every 10 meters
      foregroundService: {
        notificationTitle: 'DropNGo Porter',
        notificationBody: 'Tracking location for delivery',
      },
    });
  } catch (error) {
    console.error('Error starting location tracking:', error);
    throw error;
  }
};

// Stop background location tracking
export const stopLocationTracking = async () => {
  try {
    await Location.stopLocationUpdatesAsync('porterLocationTask');
  } catch (error) {
    console.error('Error stopping location tracking:', error);
  }
};