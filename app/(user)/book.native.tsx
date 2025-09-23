import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { X as CloseIcon } from 'lucide-react-native';
import BookingForm from '@/components/BookingForm';
import { getCurrentPricing } from '@/services/pricingService';
import { router } from 'expo-router';

const MapView = require('react-native-maps').default;
const Marker = require('react-native-maps').Marker;

type PricingConfig = {
  pickup: {
    small: number;
    medium: number;
    large: number;
    'extra-large': number;
  };
  basePickupFee: number;
  perKmFee: number;
};

type LuggageState = {
  small: number;
  medium: number;
  large: number;
  'extra-large': number;
};

type LocationType = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export default function BookingScreen() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [pickupLocation, setPickupLocation] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [pickupCoords, setPickupCoords] = useState<{lat: number, lng: number} | null>(null);
  const [deliveryCoords, setDeliveryCoords] = useState<{lat: number, lng: number} | null>(null);
  const [luggage, setLuggage] = useState<LuggageState>({
    small: 0,
    medium: 0,
    large: 0,
    'extra-large': 0,
  });
  const [duration, setDuration] = useState(1);
  const [pricing, setPricing] = useState<PricingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [insurance, setInsurance] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [mapRegion, setMapRegion] = useState<LocationType | null>(null);
  const [locationType, setLocationType] = useState<'pickup' | 'delivery' | null>(null);
  const [luggagePhotos, setLuggagePhotos] = useState<string[]>([]);
  const [photoUploading, setPhotoUploading] = useState(false);

  useEffect(() => {
    getCurrentUser();
    loadPricing();
  }, []);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      setCurrentUser(userData);
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

  const calculateTotal = (currentPricing: PricingConfig | null) => {
    if (!currentPricing) return 0;
    let storageCost = 0;
    Object.keys(luggage).forEach((size) => {
      storageCost += luggage[size as keyof LuggageState] * duration * currentPricing.pickup[size as keyof PricingConfig['pickup']];
    });
    const deliveryDistance = 15; // Example distance
    const deliveryCost = (currentPricing.basePickupFee || 0) + (deliveryDistance * (currentPricing.perKmFee || 0));
    let total = storageCost + deliveryCost;
    if (insurance) total += 50;
    return total;
  };

  const openMap = async (type: 'pickup' | 'delivery') => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    setLocationType(type);
    setMapModalVisible(true);
  };

  const handleMapConfirm = async () => {
    if (mapRegion) {
      const address = await Location.reverseGeocodeAsync({
        latitude: mapRegion.latitude,
        longitude: mapRegion.longitude,
      });
      const fullAddress = address[0]
        ? `${address[0].name || ''}, ${address[0].city || ''}, ${address[0].region || ''}`.replace(/^, /, '')
        : 'Selected Location';
      if (locationType === 'pickup') {
        setPickupLocation(fullAddress);
        setPickupCoords({ lat: mapRegion.latitude, lng: mapRegion.longitude });
      } else if (locationType === 'delivery') {
        setDeliveryLocation(fullAddress);
        setDeliveryCoords({ lat: mapRegion.latitude, lng: mapRegion.longitude });
      }
    }
    setMapModalVisible(false);
  };

  const pickLuggagePhoto = async () => {
    setPhotoUploading(true);
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setLuggagePhotos((prev) => [...prev, result.assets[0].uri]);
    }
    setPhotoUploading(false);
  };

  const removePhoto = (idx: number) => {
    setLuggagePhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleBook = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'Please login to continue');
      return;
    }
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
          {mapRegion && (
            <MapView
              style={styles.map}
              initialRegion={mapRegion}
              onRegionChangeComplete={setMapRegion}
            >
              <Marker
                coordinate={{ latitude: mapRegion.latitude, longitude: mapRegion.longitude }}
              />
            </MapView>
          )}
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
    paddingTop: 60,
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
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    backgroundColor: '#F9FAFB',
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    position: 'relative',
  },
  closeMapButton: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    flex: 1,
  },
  map: {
    flex: 1,
    width: '100%',
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