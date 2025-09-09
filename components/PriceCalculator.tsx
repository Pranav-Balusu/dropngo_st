import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  Image,
} from 'react-native';
import { X, MapPin, Package, Plus, Minus, Camera, Clock, Upload, Navigation } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

interface LuggageItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

interface PriceCalculatorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (total: number, details: any) => void;
}

export default function PriceCalculator({ visible, onClose, onSelect }: PriceCalculatorProps) {
  const [selectedService, setSelectedService] = useState<'self-service' | 'pickup' | null>(null);
  const [pickupLocation, setPickupLocation] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [storageHours, setStorageHours] = useState('1');
  const [luggageItems, setLuggageItems] = useState<LuggageItem[]>([]);
  const [luggagePhotos, setLuggagePhotos] = useState<string[]>([]);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  
  const pricing = {
    'self-service': {
      small: 3.5,
      medium: 4.5,
      large: 7.0,
      'extra-large': 9.0,
    },
    pickup: {
      small: 3.0,
      medium: 5.0,
      large: 7.0,
      'extra-large': 9.0,
    },
  };

  const bagSizes = [
    { id: 'small', name: 'Small Bag', description: 'Backpack, small bag (up to 15kg)', icon: '🎒' },
    { id: 'medium', name: 'Medium Suitcase', description: 'Medium suitcase (15-25kg)', icon: '🧳' },
    { id: 'large', name: 'Large Suitcase', description: 'Large suitcase (25-35kg)', icon: '🧳' },
    { id: 'extra-large', name: 'Extra Large', description: 'Extra large suitcase (35kg+)', icon: '🧳' },
  ];

  const popularLocations = [
    'Mumbai Central Station',
    'Mumbai Airport Terminal 1',
    'Mumbai Airport Terminal 2',
    'Bandra Station',
    'Andheri Station',
    'Dadar Station',
    'Churchgate Station',
    'CST Station',
  ];

  useEffect(() => {
    getCurrentLocation();
    if (selectedService) {
      const items = bagSizes.map(size => ({
        id: size.id,
        name: size.name,
        description: size.description,
        price: pricing[selectedService][size.id as keyof typeof pricing['self-service']],
        quantity: 0,
      }));
      setLuggageItems(items);
    }
  }, [selectedService]);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for better service');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
      
      // Reverse geocoding to get address
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      if (address.length > 0) {
        const currentAddress = `${address[0].name || ''} ${address[0].street || ''}, ${address[0].city || ''}`.trim();
        if (!pickupLocation) {
          setPickupLocation(currentAddress);
        }
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const updateQuantity = (itemId: string, change: number) => {
    setLuggageItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, quantity: Math.max(0, item.quantity + change) }
        : item
    ));
  };

  const takeLuggagePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Camera permission is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setLuggagePhotos(prev => [...prev, result.assets[0].uri]);
    }
  };

  const uploadFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Gallery permission is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setLuggagePhotos(prev => [...prev, result.assets[0].uri]);
    }
  };

  const calculateStoragePrice = () => {
    const hours = parseInt(storageHours) || 1;
    return luggageItems.reduce((total, item) => {
      return total + (item.price * item.quantity * hours);
    }, 0);
  };

  const calculateDeliveryPrice = () => {
    if (!selectedService) return 0;
    
    const totalItems = getTotalItems();
    const baseDeliveryFee = 20;
    const perItemFee = 5;
    
    if (selectedService === 'self-service') {
      // Self-service: only delivery charge if different location
      if (deliveryLocation && deliveryLocation !== pickupLocation) {
        return baseDeliveryFee + (perItemFee * totalItems);
      }
      return 0;
    }
    
    if (selectedService === 'pickup') {
      // Pickup service: pickup + delivery charges
      return (baseDeliveryFee * 2) + (perItemFee * totalItems);
    }
    
    return 0;
  };

  const getTotalItems = () => {
    return luggageItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getSelectedItems = () => {
    return luggageItems.filter(item => item.quantity > 0);
  };

  const getPriceBreakdown = () => {
    const storagePrice = calculateStoragePrice();
    const deliveryPrice = calculateDeliveryPrice();
    const hours = parseInt(storageHours) || 1;
    
    return {
      storage: storagePrice,
      delivery: deliveryPrice,
      total: storagePrice + deliveryPrice,
      hours: hours,
      items: getSelectedItems(),
    };
  };

  const handleConfirm = () => {
    const totalItems = getTotalItems();
    const selectedItems = getSelectedItems();
    
    if (!selectedService) {
      Alert.alert('Error', 'Please select service type');
      return;
    }

    if (totalItems === 0) {
      Alert.alert('Error', 'Please select at least one luggage item');
      return;
    }

    if (!pickupLocation.trim()) {
      Alert.alert('Error', 'Please enter pickup location');
      return;
    }

    if (selectedService === 'pickup' && !deliveryLocation.trim()) {
      Alert.alert('Error', 'Please enter delivery location for pickup service');
      return;
    }

    if (luggagePhotos.length === 0) {
      Alert.alert('Error', 'Please upload at least one photo of your luggage for verification');
      return;
    }

    const breakdown = getPriceBreakdown();
    const details = {
      serviceType: selectedService,
      pickupLocation,
      deliveryLocation: selectedService === 'pickup' ? deliveryLocation : (deliveryLocation || pickupLocation),
      storageHours: parseInt(storageHours),
      luggageItems: selectedItems,
      luggagePhotos,
      totalItems,
      breakdown,
      currentLocation,
    };

    onSelect(breakdown.total, details);
    onClose();
  };

  const reset = () => {
    setSelectedService(null);
    setPickupLocation('');
    setDeliveryLocation('');
    setStorageHours('1');
    setLuggageItems([]);
    setLuggagePhotos([]);
  };

  useEffect(() => {
    if (!visible) {
      reset();
    }
  }, [visible]);

  const breakdown = getPriceBreakdown();
  const totalItems = getTotalItems();
  const selectedItems = getSelectedItems();

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Book Storage & Delivery</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Service Type Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Service Type</Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.serviceOption,
                  selectedService === 'self-service' && styles.selectedOption,
                ]}
                onPress={() => setSelectedService('self-service')}
              >
                <Package size={24} color={selectedService === 'self-service' ? '#3B82F6' : '#666'} />
                <View style={styles.optionContent}>
                  <Text style={[
                    styles.optionTitle,
                    selectedService === 'self-service' && styles.selectedOptionText,
                  ]}>
                    Self Service
                  </Text>
                  <Text style={styles.optionDescription}>
                    Drop off and pick up yourself
                  </Text>
                  <Text style={styles.optionPrice}>From ₹35/hour</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.serviceOption,
                  selectedService === 'pickup' && styles.selectedOption,
                ]}
                onPress={() => setSelectedService('pickup')}
              >
                <MapPin size={24} color={selectedService === 'pickup' ? '#3B82F6' : '#666'} />
                <View style={styles.optionContent}>
                  <Text style={[
                    styles.optionTitle,
                    selectedService === 'pickup' && styles.selectedOptionText,
                  ]}>
                    Pickup & Delivery
                  </Text>
                  <Text style={styles.optionDescription}>
                    We pick up and deliver for you
                  </Text>
                  <Text style={styles.optionPrice}>From ₹30/hour + delivery</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Location Selection */}
          {selectedService && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Locations</Text>
              
              <Text style={styles.inputLabel}>Pickup Location *</Text>
              <View style={styles.locationInputContainer}>
                <TextInput
                  style={styles.locationInput}
                  placeholder="Enter pickup location"
                  value={pickupLocation}
                  onChangeText={setPickupLocation}
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity onPress={getCurrentLocation} style={styles.locationButton}>
                  <Navigation size={16} color="#3B82F6" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.popularText}>Popular locations:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popularLocations}>
                {popularLocations.map((location, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.popularLocationChip}
                    onPress={() => setPickupLocation(location)}
                  >
                    <Text style={styles.popularLocationText}>{location}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {selectedService === 'pickup' && (
                <>
                  <Text style={styles.inputLabel}>Delivery Location *</Text>
                  <TextInput
                    style={styles.locationInput}
                    placeholder="Enter delivery location"
                    value={deliveryLocation}
                    onChangeText={setDeliveryLocation}
                    placeholderTextColor="#9CA3AF"
                  />
                </>
              )}

              {selectedService === 'self-service' && (
                <>
                  <Text style={styles.inputLabel}>Delivery Location (Optional)</Text>
                  <TextInput
                    style={styles.locationInput}
                    placeholder="Same as pickup location (no extra charge)"
                    value={deliveryLocation}
                    onChangeText={setDeliveryLocation}
                    placeholderTextColor="#9CA3AF"
                  />
                  <Text style={styles.helperText}>
                    Leave empty to return to pickup location (no delivery charge)
                  </Text>
                </>
              )}
            </View>
          )}

          {/* Storage Duration */}
          {selectedService && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Storage Duration</Text>
              <View style={styles.durationContainer}>
                <Clock size={20} color="#666" />
                <TextInput
                  style={styles.durationInput}
                  placeholder="Hours"
                  value={storageHours}
                  onChangeText={setStorageHours}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
                <Text style={styles.durationText}>hours</Text>
              </View>
              <Text style={styles.helperText}>
                Minimum 1 hour, maximum 168 hours (7 days)
              </Text>
            </View>
          )}

          {/* Multiple Luggage Selection */}
          {selectedService && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Your Luggage</Text>
              <Text style={styles.sectionSubtitle}>Choose quantity for each type (Multiple selections allowed)</Text>
              <View style={styles.luggageContainer}>
                {luggageItems.map((item) => (
                  <View key={item.id} style={[
                    styles.luggageItem,
                    item.quantity > 0 && styles.luggageItemSelected
                  ]}>
                    <View style={styles.luggageInfo}>
                      <View style={styles.luggageHeader}>
                        <Text style={styles.luggageIcon}>
                          {bagSizes.find(bag => bag.id === item.id)?.icon}
                        </Text>
                        <View style={styles.luggageDetails}>
                          <Text style={styles.luggageName}>{item.name}</Text>
                          <Text style={styles.luggageDescription}>{item.description}</Text>
                          <Text style={styles.luggagePrice}>₹{item.price}/hour</Text>
                        </View>
                      </View>
                      {item.quantity > 0 && (
                        <Text style={styles.itemTotal}>
                          Subtotal: ₹{(item.price * item.quantity * parseInt(storageHours || '1')).toFixed(0)}
                        </Text>
                      )}
                    </View>
                    <View style={styles.quantityControls}>
                      <TouchableOpacity
                        style={[styles.quantityButton, item.quantity === 0 && styles.quantityButtonDisabled]}
                        onPress={() => updateQuantity(item.id, -1)}
                        disabled={item.quantity === 0}
                      >
                        <Minus size={16} color={item.quantity === 0 ? '#ccc' : '#3B82F6'} />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.id, 1)}
                      >
                        <Plus size={16} color="#3B82F6" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
              {totalItems > 0 && (
                <View style={styles.selectionSummary}>
                  <Text style={styles.totalItemsText}>Total Items Selected: {totalItems}</Text>
                  <Text style={styles.selectedItemsList}>
                    {selectedItems.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Luggage Photos */}
          {selectedService && totalItems > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Luggage Photos *</Text>
              <Text style={styles.sectionSubtitle}>Upload photos for verification during pickup/delivery</Text>
              
              <View style={styles.photoActions}>
                <TouchableOpacity style={styles.photoButton} onPress={takeLuggagePhoto}>
                  <Camera size={20} color="#3B82F6" />
                  <Text style={styles.photoButtonText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.photoButton} onPress={uploadFromGallery}>
                  <Upload size={20} color="#3B82F6" />
                  <Text style={styles.photoButtonText}>Upload</Text>
                </TouchableOpacity>
              </View>

              {luggagePhotos.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
                  {luggagePhotos.map((photo, index) => (
                    <View key={index} style={styles.photoContainer}>
                      <Image source={{ uri: photo }} style={styles.photo} />
                      <TouchableOpacity
                        style={styles.removePhotoButton}
                        onPress={() => setLuggagePhotos(prev => prev.filter((_, i) => i !== index))}
                      >
                        <X size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          )}

          {/* Price Breakdown */}
          {totalItems > 0 && pickupLocation && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price Breakdown</Text>
              <View style={styles.breakdownContainer}>
                <Text style={styles.breakdownHeader}>Storage Charges:</Text>
                {selectedItems.map((item) => (
                  <View key={item.id} style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>
                      {item.name} × {item.quantity} × {breakdown.hours}h:
                    </Text>
                    <Text style={styles.breakdownValue}>₹{(item.price * item.quantity * breakdown.hours).toFixed(0)}</Text>
                  </View>
                ))}
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Storage Subtotal:</Text>
                  <Text style={styles.breakdownValue}>₹{breakdown.storage.toFixed(0)}</Text>
                </View>
                {breakdown.delivery > 0 && (
                  <>
                    <Text style={styles.breakdownHeader}>Service Charges:</Text>
                    <View style={styles.breakdownRow}>
                      <Text style={styles.breakdownLabel}>
                        {selectedService === 'pickup' ? 'Pickup & Delivery:' : 'Delivery Fee:'}
                      </Text>
                      <Text style={styles.breakdownValue}>₹{breakdown.delivery.toFixed(0)}</Text>
                    </View>
                  </>
                )}
                <View style={[styles.breakdownRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total Amount:</Text>
                  <Text style={styles.totalValue}>₹{breakdown.total.toFixed(0)}</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Confirm Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              (!selectedService || totalItems === 0 || !pickupLocation || 
               (selectedService === 'pickup' && !deliveryLocation) || luggagePhotos.length === 0) && 
              styles.disabledButton,
            ]}
            onPress={handleConfirm}
            disabled={
              !selectedService || totalItems === 0 || !pickupLocation || 
              (selectedService === 'pickup' && !deliveryLocation) || luggagePhotos.length === 0
            }
          >
            <Text style={styles.confirmButtonText}>
              Confirm Booking {breakdown.total > 0 ? `- ₹${breakdown.total.toFixed(0)}` : ''}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  optionsContainer: {
    gap: 12,
  },
  serviceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#eee',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  selectedOption: {
    borderColor: '#3B82F6',
    backgroundColor: '#f0f8ff',
  },
  optionContent: {
    marginLeft: 12,
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  selectedOptionText: {
    color: '#3B82F6',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  optionPrice: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  locationInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  locationButton: {
    padding: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
  },
  popularText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  popularLocations: {
    marginBottom: 16,
  },
  popularLocationChip: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  popularLocationText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  durationInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  durationText: {
    fontSize: 16,
    color: '#666',
  },
  luggageContainer: {
    gap: 12,
  },
  luggageItem: {
    padding: 16,
    borderWidth: 2,
    borderColor: '#eee',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  luggageItemSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#f0f8ff',
  },
  luggageInfo: {
    marginBottom: 12,
  },
  luggageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
    color: '#333',
    marginBottom: 4,
  },
  luggageDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  luggagePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  itemTotal: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    textAlign: 'right',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  quantityButtonDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ccc',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    minWidth: 30,
    textAlign: 'center',
  },
  selectionSummary: {
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  totalItemsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    textAlign: 'center',
    marginBottom: 4,
  },
  selectedItemsList: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  photoActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  photoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f8ff',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  photoButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  photosContainer: {
    marginTop: 12,
  },
  photoContainer: {
    marginRight: 12,
    position: 'relative',
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#dc2626',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakdownContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
  },
  breakdownHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  totalRow: {
    borderTopWidth: 2,
    borderTopColor: '#3B82F6',
    marginTop: 12,
    paddingTop: 12,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3B82F6',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  confirmButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});