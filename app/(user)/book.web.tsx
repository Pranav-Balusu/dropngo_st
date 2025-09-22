import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { X as CloseIcon } from 'lucide-react-native';
import { getCurrentPricing } from '@/services/pricingService';
import { supabase } from '@/lib/supabase';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import BookingForm from '@/components/BookingForm';

// --- CORRECTED Pricing config type (removed 'self-service') ---
type PricingConfig = {
  pickup: { small: number; medium: number; large: number; 'extra-large': number };
  basePickupFee: number;
  perKmFee: number;
};
type LuggageState = { small: number; medium: number; large: number; 'extra-large': number };

const containerStyle = { width: '100%', height: '100%' };

export default function BookingScreen() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [pickupLocation, setPickupLocation] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [deliveryCoords, setDeliveryCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [luggage, setLuggage] = useState<LuggageState>({ small: 0, medium: 0, large: 0, 'extra-large': 0 });
  const [duration, setDuration] = useState(1);
  const [pricing, setPricing] = useState<PricingConfig | null>(null);
  const [loading, setLoading] = useState(true); // --- CORRECTED: Start in loading state
  const [insurance, setInsurance] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 19.076, lng: 72.8777 });
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number }>({ lat: 19.076, lng: 72.8777 });
  const [locationType, setLocationType] = useState<'pickup' | 'delivery' | null>(null);
  const [luggagePhotos, setLuggagePhotos] = useState<string[]>([]);
  const [photoUploading, setPhotoUploading] = useState(false);

  // --- ADDED useEffect to load data on screen mount ---
  useEffect(() => {
    getCurrentUser();
    loadPricing();
  }, []);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUser(user);
    }
  };

  const loadPricing = async () => {
    try {
      const currentPricing = await getCurrentPricing();
      setPricing(currentPricing);
    } catch (error) {
      console.error('Error loading pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const { isLoaded } = useJsApiLoader({
    // ===================================================================
    // IMPORTANT: REPLACE WITH YOUR ACTUAL GOOGLE MAPS API KEY
    // ===================================================================
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
  });

  const calculateTotal = (currentPricing: PricingConfig | null) => {
    if (!currentPricing) return 0;
    let storageCost = 0;
    Object.keys(luggage).forEach((size) => {
      storageCost += luggage[size as keyof LuggageState] * duration * currentPricing.pickup[size as keyof PricingConfig['pickup']];
    });
    const deliveryDistance = 15;
    const deliveryCost = (currentPricing.basePickupFee || 0) + (deliveryDistance * (currentPricing.perKmFee || 0));
    let total = storageCost + deliveryCost;
    if (insurance) total += 50;
    return total;
  };

  const openMap = (type: 'pickup' | 'delivery') => {
    setLocationType(type);
    setMarkerPosition(mapCenter);
    setMapModalVisible(true);
  };

  const handleMapConfirm = async () => {
    const address = `Lat: ${markerPosition.lat.toFixed(5)}, Lng: ${markerPosition.lng.toFixed(5)}`;
    if (locationType === 'pickup') {
      setPickupLocation(address);
      setPickupCoords(markerPosition);
    } else if (locationType === 'delivery') {
      setDeliveryLocation(address);
      setDeliveryCoords(markerPosition);
    }
    setMapModalVisible(false);
  };

  const pickLuggagePhoto = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setLuggagePhotos((prev) => [...prev, url]);
      }
    };
    input.click();
  };

  const removePhoto = (idx: number) => {
    setLuggagePhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleBook = async () => {
    if (!pickupLocation || !deliveryLocation || Object.values(luggage).every(count => count === 0)) {
      Alert.alert('Error', 'Please provide pickup/delivery locations and luggage details.');
      return;
    }
    if (luggagePhotos.length === 0) {
      Alert.alert('Error', 'Please upload at least one luggage photo.');
      return;
    }
    const total = calculateTotal(pricing);
    const bookingId = `DN${Date.now().toString().slice(-6)}`;
    Alert.alert(
      'Booking Confirmed',
      `Total: ₹${total.toFixed(2)}\nBooking ID: ${bookingId}`,
      [
        { text: 'OK', onPress: () => router.push('/(user)/track') }
      ]
    );
  };

  if (loading) {
     return (
      <SafeAreaView style={styles.container}>
         <View style={styles.header}>
          <Text style={styles.headerTitle}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <BookingForm
        pickupLocation={pickupLocation}
        deliveryLocation={deliveryLocation}
        setLuggage={setLuggage}
        luggage={luggage}
        duration={duration}
        setDuration={setDuration}
        insurance={insurance}
        setInsurance={setInsurance}
        openMap={openMap}
        luggagePhotos={luggagePhotos}
        removePhoto={removePhoto}
        pickLuggagePhoto={pickLuggagePhoto}
        photoUploading={photoUploading}
        calculateTotal={calculateTotal}
        pricing={pricing}
        handleBook={handleBook}
      />

      <Modal
        animationType="slide"
        transparent={false}
        visible={mapModalVisible}
        onRequestClose={() => setMapModalVisible(false)}
      >
        <SafeAreaView style={styles.mapContainer}>
          <View style={styles.mapHeader}>
            <TouchableOpacity onPress={() => setMapModalVisible(false)} style={styles.closeMapButton}>
              <CloseIcon size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.mapTitle}>Select {locationType === 'pickup' ? 'Pickup' : 'Delivery'} Location</Text>
          </View>
          <View style={styles.mapWrapper}>
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={14}
                onClick={e => setMarkerPosition({ lat: e.latLng?.lat() || markerPosition.lat, lng: e.latLng?.lng() || markerPosition.lng })}
              >
                <Marker position={markerPosition} />
              </GoogleMap>
            ) : <Text>Loading Map...</Text>}
          </View>
          <View style={styles.mapControls}>
            <TouchableOpacity style={styles.confirmMapButton} onPress={handleMapConfirm}>
              <Text style={styles.confirmMapText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: '#3B82F6'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    position: 'relative',
    zIndex: 10,
    backgroundColor: '#FFFFFF',
  },
  closeMapButton: {
    position: 'absolute',
    left: 16,
    top: 16,
    zIndex: 1,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    flex: 1,
  },
  mapWrapper: {
    flex: 1,
  },
  mapControls: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  confirmMapButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmMapText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});