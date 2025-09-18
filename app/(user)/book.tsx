import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TextInput,
  Switch,
  Modal,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { getCurrentPricing } from '@/services/pricingService';
import { 
  Package, 
  MapPin,
  Clock,
  Square,
  ChevronsRight,
  Plus,
  Minus,
  X as CloseIcon,
} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';



// Define the PricingConfig type
type PricingConfig = {
  'self-service': {
    small: number;
    medium: number;
    large: number;
    'extra-large': number;
  };
  pickup: {
    small: number;
    medium: number;
    large: number;
    'extra-large': number;
  };
  basePickupFee: number;
  perKmFee: number;
};

// Define a type for the luggage state
type LuggageState = {
  small: number;
  medium: number;
  large: number;
  'extra-large': number;
};

// Define the LocationType for map coordinates
type LocationType = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export default function BookingScreen() {
  const [currentUser, setCurrentUser] = useState(null);
  const [pickupLocation, setPickupLocation] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
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

  useEffect(() => {
    getCurrentUser();
    loadPricing();
  }, []);

  const openMapPicker = (type: 'pickup' | 'delivery') => {
    setLocationType(type);
    setMapModalVisible(true);
  };

  const handleMapSelect = (coordinate) => {
  // Reverse geocode here if needed
    if (locationType === 'pickup') setPickupLocation(`${coordinate.latitude},${coordinate.longitude}`);
    else setDeliveryLocation(`${coordinate.latitude},${coordinate.longitude}`);
    setMapModalVisible(false);
  };

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

  const luggageSizes = [
    { key: 'small', label: 'Small', description: 'Up to 15 kg' },
    { key: 'medium', label: 'Medium', description: 'Up to 25 kg' },
    { key: 'large', label: 'Large', description: 'Up to 35 kg' },
    { key: 'extra-large', label: 'Extra Large', description: 'Over 35 kg' },
  ];

  const calculateTotal = () => {
    if (!pricing) return 0;

    let storageCost = 0;
    Object.keys(luggage).forEach((size) => {
      storageCost += luggage[size as keyof LuggageState] * duration * pricing.pickup[size as keyof PricingConfig['pickup']];
    });

    const deliveryDistance = 15; // Placeholder for a dynamic distance calculation
    const deliveryCost = (pricing.basePickupFee || 0) + (deliveryDistance * (pricing.perKmFee || 0));

    let total = storageCost + deliveryCost;
    if (insurance) {
      total += 50;
    }

    return total;
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

    const total = calculateTotal();
    const bookingDetails = {
        pickupLocation,
        deliveryLocation,
        luggage,
        duration,
        insurance,
        total,
        serviceType: 'pickup',
    };

    try {
      // Simulate booking process
      const bookingId = `DN${Date.now().toString().slice(-6)}`;
      
      Alert.alert(
        'Booking Confirmed',
        `Total: ₹${total.toFixed(2)}\nBooking ID: ${bookingId}`,
        [
          { text: 'OK', onPress: () => router.push('/(user)/track') }
        ]
      );
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Error', 'Failed to create booking. Please try again.');
    }
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
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
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

      const fullAddress = address[0] ? `${address[0].name}, ${address[0].city}` : 'Selected Location';
      
      if (locationType === 'pickup') {
        setPickupLocation(fullAddress);
      } else if (locationType === 'delivery') {
        setDeliveryLocation(fullAddress);
      }
    }
    setMapModalVisible(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#3B82F6', '#1E40AF']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Loading...</Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#3B82F6', '#1E40AF']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Book Luggage Service</Text>
        <Text style={styles.headerSubtitle}>Pickup & Delivery</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          <View style={styles.locationContainer}>
            <TouchableOpacity onPress={() => openMap('pickup')} style={styles.locationButton}>
              <View style={styles.locationInput}>
                <MapPin size={20} color="#3B82F6" />
                <Text style={styles.input}>
                  {pickupLocation || 'Select Pickup Location'}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.locationSeparator}>
              <ChevronsRight size={20} color="#6B7280" />
            </View>
            <TouchableOpacity onPress={() => openMap('delivery')} style={styles.locationButton}>
              <View style={styles.locationInput}>
                <MapPin size={20} color="#F97316" />
                <Text style={styles.input}>
                  {deliveryLocation || 'Select Delivery Location'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Clock size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Duration in hours"
              value={duration.toString()}
              onChangeText={(text) => setDuration(parseInt(text) || 0)}
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Luggage Details</Text>
          <View style={styles.luggageGrid}>
            {luggageSizes.map((size) => (
              <View key={size.key} style={styles.luggageItem}>
                <View style={styles.luggageItemHeader}>
                  <Square size={24} color="#6B7280" />
                  <View>
                    <Text style={styles.luggageLabel}>{size.label}</Text>
                    <Text style={styles.luggageDescription}>{size.description}</Text>
                  </View>
                </View>
                <View style={styles.luggageCounter}>
                  <TouchableOpacity onPress={() => setLuggage(prev => ({ ...prev, [size.key]: Math.max(0, prev[size.key as keyof LuggageState] - 1) }))}>
                    <Minus size={24} color="#6B7280" />
                  </TouchableOpacity>
                  <Text style={styles.luggageCount}>{luggage[size.key as keyof LuggageState]}</Text>
                  <TouchableOpacity onPress={() => setLuggage(prev => ({ ...prev, [size.key]: prev[size.key as keyof LuggageState] + 1 }))}>
                    <Plus size={24} color="#3B82F6" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Booking Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Luggage:</Text>
              <Text style={styles.summaryValue}>
                {Object.keys(luggage)
                  .filter(key => luggage[key as keyof LuggageState] > 0)
                  .map(key => `${luggage[key as keyof LuggageState]} ${key} `)
                  .join(', ')}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Storage Fees ({duration} hrs):</Text>
              <Text style={styles.summaryValue}>₹{(calculateTotal() - ((pricing?.basePickupFee || 0) + (15 * (pricing?.perKmFee || 0))) - (insurance ? 50 : 0)).toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Pickup & Delivery Fees:</Text>
              <Text style={styles.summaryValue}>₹{((pricing?.basePickupFee || 0) + (15 * (pricing?.perKmFee || 0))).toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Insurance (optional):</Text>
              <Switch
                value={insurance}
                onValueChange={setInsurance}
                trackColor={{ false: '#E5E7EB', true: '#DBEAFE' }}
                thumbColor={insurance ? '#3B82F6' : '#9CA3AF'}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Amount:</Text>
              <Text style={styles.summaryAmount}>₹{calculateTotal().toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.bookButton} onPress={handleBook}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Map Selection Modal */}
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
    </SafeAreaView>
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E5E7EB',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  locationContainer: {
    marginBottom: 16,
  },
  locationButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  locationSeparator: {
    alignItems: 'center',
    marginVertical: 8,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  luggageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  luggageItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  luggageItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  luggageLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  luggageDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  luggageCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  luggageCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    minWidth: 24,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  bookButton: {
    backgroundColor: '#F97316',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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