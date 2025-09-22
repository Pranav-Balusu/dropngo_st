import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  MapPin,
  Plus,
  Minus,
  Camera,
  Upload,
  Clock,
  Shield,
  X,
  ArrowRight,
} from 'lucide-react-native';

// Define types for props for better code quality and autocompletion
type LuggageState = {
  small: number;
  medium: number;
  large: number;
  'extra-large': number;
};

type PricingConfig = {
  pickup: { small: number; medium: number; large: number; 'extra-large': number };
  basePickupFee: number;
  perKmFee: number;
} | null;

interface BookingFormProps {
  pickupLocation: string;
  deliveryLocation: string;
  luggage: LuggageState;
  setLuggage: React.Dispatch<React.SetStateAction<LuggageState>>;
  duration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  insurance: boolean;
  setInsurance: React.Dispatch<React.SetStateAction<boolean>>;
  openMap: (type: 'pickup' | 'delivery') => void;
  luggagePhotos: string[];
  removePhoto: (index: number) => void;
  pickLuggagePhoto: () => void;
  photoUploading: boolean;
  calculateTotal: (pricing: PricingConfig) => number;
  pricing: PricingConfig;
  handleBook: () => void;
}

const bagSizes = [
  { id: 'small', name: 'Small Bag', description: 'Backpack, handbag', icon: '🎒' },
  { id: 'medium', name: 'Medium Suitcase', description: 'Cabin size (15-25kg)', icon: '🧳' },
  { id: 'large', name: 'Large Suitcase', description: 'Check-in size (25-35kg)', icon: '🧳' },
  { id: 'extra-large', name: 'Extra Large', description: 'Oversized (35kg+)', icon: '🧳' },
];

export default function BookingForm({
  pickupLocation,
  deliveryLocation,
  luggage,
  setLuggage,
  duration,
  setDuration,
  insurance,
  setInsurance,
  openMap,
  luggagePhotos,
  removePhoto,
  pickLuggagePhoto,
  photoUploading,
  calculateTotal,
  pricing,
  handleBook,
}: BookingFormProps) {

  const total = calculateTotal(pricing);
  const totalItems = Object.values(luggage).reduce((sum, count) => sum + count, 0);

  const updateQuantity = (itemId: keyof LuggageState, change: number) => {
    setLuggage(prev => ({
      ...prev,
      [itemId]: Math.max(0, prev[itemId] + change),
    }));
  };

  const isBookingDisabled = !pickupLocation || !deliveryLocation || totalItems === 0 || luggagePhotos.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#3B82F6', '#1E40AF']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Book a Delivery</Text>
        <Text style={styles.headerSubtitle}>Enter your details to get a quote</Text>
      </LinearGradient>
      
      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Locations</Text>
          <TouchableOpacity style={styles.locationInputContainer} onPress={() => openMap('pickup')}>
            <MapPin size={20} color="#6B7280" />
            <Text style={[styles.locationInput, !pickupLocation && styles.placeholderText]}>
              {pickupLocation || 'Select Pickup Location'}
            </Text>
            <ArrowRight size={16} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.locationInputContainer} onPress={() => openMap('delivery')}>
            <MapPin size={20} color="#6B7280" />
            <Text style={[styles.locationInput, !deliveryLocation && styles.placeholderText]}>
              {deliveryLocation || 'Select Delivery Location'}
            </Text>
            <ArrowRight size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Luggage Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Your Luggage</Text>
          <View style={styles.luggageContainer}>
            {bagSizes.map((item) => (
              <View key={item.id} style={[
                styles.luggageItem,
                luggage[item.id as keyof LuggageState] > 0 && styles.luggageItemSelected
              ]}>
                <View style={styles.luggageInfo}>
                  <Text style={styles.luggageIcon}>{item.icon}</Text>
                  <View style={styles.luggageDetails}>
                    <Text style={styles.luggageName}>{item.name}</Text>
                    <Text style={styles.luggageDescription}>{item.description}</Text>
                  </View>
                </View>
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={[styles.quantityButton, luggage[item.id as keyof LuggageState] === 0 && styles.quantityButtonDisabled]}
                    onPress={() => updateQuantity(item.id as keyof LuggageState, -1)}
                    disabled={luggage[item.id as keyof LuggageState] === 0}
                  >
                    <Minus size={16} color={luggage[item.id as keyof LuggageState] === 0 ? '#ccc' : '#3B82F6'} />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{luggage[item.id as keyof LuggageState]}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id as keyof LuggageState, 1)}
                  >
                    <Plus size={16} color="#3B82F6" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Duration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Storage Duration</Text>
          <View style={styles.durationContainer}>
            <Clock size={20} color="#6B7280" />
            <TextInput
              style={styles.durationInput}
              value={String(duration)}
              onChangeText={(text) => setDuration(Number(text.replace(/[^0-9]/g, '')) || 1)}
              keyboardType="numeric"
            />
            <Text style={styles.durationText}>hours</Text>
          </View>
        </View>

        {/* Photo Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Luggage Photos</Text>
          <TouchableOpacity style={styles.cameraButton} onPress={pickLuggagePhoto}>
            <Camera size={24} color="#3B82F6" />
            <Text style={styles.cameraButtonText}>Take & Upload Photo</Text>
          </TouchableOpacity>
          {photoUploading && <ActivityIndicator style={{ marginTop: 10 }} size="small" color="#3B82F6" />}
          {luggagePhotos.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
              {luggagePhotos.map((photo, index) => (
                <View key={index} style={styles.photoContainer}>
                  <Image source={{ uri: photo }} style={styles.photo} />
                  <TouchableOpacity style={styles.removePhotoButton} onPress={() => removePhoto(index)}>
                    <X size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Add-ons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add-ons</Text>
          <View style={styles.switchContainer}>
            <View style={styles.switchInfo}>
              <Shield size={20} color="#6B7280" />
              <Text style={styles.switchLabel}>Luggage Insurance (₹50)</Text>
            </View>
            <Switch
              value={insurance}
              onValueChange={setInsurance}
              trackColor={{ false: '#E5E7EB', true: '#BFDBFE' }}
              thumbColor={insurance ? '#3B82F6' : '#F9FAFB'}
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total Amount</Text>
          <Text style={styles.priceValue}>₹{total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity 
            style={[styles.confirmButton, isBookingDisabled && styles.disabledButton]} 
            onPress={handleBook}
            disabled={isBookingDisabled}
        >
          <Text style={styles.confirmButtonText}>Confirm Booking</Text>
        </TouchableOpacity>
      </View>
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
  formContainer: {
    flex: 1,
    padding: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    gap: 12,
  },
  locationInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  luggageContainer: {
    gap: 12,
  },
  luggageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  luggageItemSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  luggageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  luggageIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  luggageDetails: {
    flex: 1,
  },
  luggageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  luggageDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  quantityButtonDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    minWidth: 20,
    textAlign: 'center',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  durationInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  durationText: {
    fontSize: 16,
    color: '#6B7280',
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
  },
  cameraButtonText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
  photosContainer: {
    marginTop: 16,
  },
  photoContainer: {
    marginRight: 12,
    position: 'relative',
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  removePhotoButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  switchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: '#111827',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  confirmButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
});