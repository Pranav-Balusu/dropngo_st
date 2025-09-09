import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { X, Navigation, Phone, MessageCircle, MapPin, Truck } from 'lucide-react-native';

interface LiveTrackingMapProps {
  visible: boolean;
  onClose: () => void;
  booking: {
    id: string;
    porter: {
      name: string;
      phone: string;
      currentLocation: {
        latitude: number;
        longitude: number;
      };
    };
    pickupLocation: {
      latitude: number;
      longitude: number;
      address: string;
    };
    deliveryLocation: {
      latitude: number;
      longitude: number;
      address: string;
    };
    status: string;
  };
}

const { width, height } = Dimensions.get('window');

export default function LiveTrackingMap({ visible, onClose, booking }: LiveTrackingMapProps) {
  const [userLocation, setUserLocation] = useState<any>(null);
  const [porterLocation, setPorterLocation] = useState(booking.porter.currentLocation);
  const [region, setRegion] = useState({
    latitude: booking.porter.currentLocation.latitude,
    longitude: booking.porter.currentLocation.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    getCurrentLocation();
    const locationInterval = setInterval(updatePorterLocation, 10000); // Update every 10 seconds

    return () => clearInterval(locationInterval);
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for tracking');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const updatePorterLocation = () => {
    // Simulate porter movement (in real app, this would come from backend)
    const newLat = porterLocation.latitude + (Math.random() - 0.5) * 0.001;
    const newLng = porterLocation.longitude + (Math.random() - 0.5) * 0.001;
    
    setPorterLocation({
      latitude: newLat,
      longitude: newLng,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pickup-pending': return '#F97316';
      case 'in-transit': return '#3B82F6';
      case 'ready-for-delivery': return '#059669';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pickup-pending': return 'Porter heading to pickup';
      case 'in-transit': return 'Porter en route to delivery';
      case 'ready-for-delivery': return 'Porter at delivery location';
      default: return 'Tracking porter';
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in kilometers
    return d.toFixed(1);
  };

  const getRouteCoordinates = () => {
    if (booking.status === 'pickup-pending') {
      return [porterLocation, booking.pickupLocation];
    } else {
      return [porterLocation, booking.deliveryLocation];
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Live Tracking</Text>
            <Text style={styles.bookingId}>#{booking.id}</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {/* Porter Location */}
          <Marker
            coordinate={porterLocation}
            title={booking.porter.name}
            description="Your Porter"
            pinColor={getStatusColor(booking.status)}
          >
            <View style={[styles.porterMarker, { backgroundColor: getStatusColor(booking.status) }]}>
              <Truck size={20} color="#FFFFFF" />
            </View>
          </Marker>

          {/* Pickup Location */}
          <Marker
            coordinate={booking.pickupLocation}
            title="Pickup Location"
            description={booking.pickupLocation.address}
            pinColor="#3B82F6"
          >
            <View style={[styles.locationMarker, { backgroundColor: '#3B82F6' }]}>
              <MapPin size={16} color="#FFFFFF" />
            </View>
          </Marker>

          {/* Delivery Location */}
          <Marker
            coordinate={booking.deliveryLocation}
            title="Delivery Location"
            description={booking.deliveryLocation.address}
            pinColor="#059669"
          >
            <View style={[styles.locationMarker, { backgroundColor: '#059669' }]}>
              <MapPin size={16} color="#FFFFFF" />
            </View>
          </Marker>

          {/* Route Line */}
          <Polyline
            coordinates={getRouteCoordinates()}
            strokeColor={getStatusColor(booking.status)}
            strokeWidth={3}
            lineDashPattern={[5, 5]}
          />
        </MapView>

        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(booking.status) }]} />
            <Text style={styles.statusText}>{getStatusText(booking.status)}</Text>
          </View>
          
          <View style={styles.porterInfo}>
            <View style={styles.porterDetails}>
              <Text style={styles.porterName}>{booking.porter.name}</Text>
              <Text style={styles.porterPhone}>{booking.porter.phone}</Text>
              {userLocation && (
                <Text style={styles.distance}>
                  Distance: {calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    porterLocation.latitude,
                    porterLocation.longitude
                  )} km away
                </Text>
              )}
            </View>
            
            <View style={styles.porterActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Phone size={20} color="#3B82F6" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MessageCircle size={20} color="#3B82F6" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.locationInfo}>
          <View style={styles.locationItem}>
            <View style={[styles.locationDot, { backgroundColor: '#3B82F6' }]} />
            <View style={styles.locationDetails}>
              <Text style={styles.locationLabel}>Pickup</Text>
              <Text style={styles.locationAddress}>{booking.pickupLocation.address}</Text>
            </View>
          </View>
          
          <View style={styles.locationItem}>
            <View style={[styles.locationDot, { backgroundColor: '#059669' }]} />
            <View style={styles.locationDetails}>
              <Text style={styles.locationLabel}>Delivery</Text>
              <Text style={styles.locationAddress}>{booking.deliveryLocation.address}</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bookingId: {
    fontSize: 14,
    color: '#E5E7EB',
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  map: {
    flex: 1,
  },
  porterMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  locationMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  porterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  porterDetails: {
    flex: 1,
  },
  porterName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  porterPhone: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  distance: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    marginTop: 4,
  },
  porterActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  locationDetails: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 14,
    color: '#111827',
  },
});