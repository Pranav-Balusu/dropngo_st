import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { 
  MapPin, 
  Clock, 
  Shield, 
  Star,
  ArrowRight,
  Camera,
  Lock,
  Wifi,
  Eye,
  Navigation,
  Package
} from 'lucide-react-native';
import PriceCalculator from '@/components/PriceCalculator';

export default function UserHomeScreen() {
  const [calculatorVisible, setCalculatorVisible] = useState(false);
  const [userLocation, setUserLocation] = useState('Varanasi Railway Station');

  const nearbyCloakrooms = [
    {
      id: 'CR001',
      name: 'Varanasi Junction Cloak room',
      distance: '0.2 km',
      rating: 4.8,
      reviews: 156,
      price: 'From ₹35/hour',
      image: 'https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg',
      features: ['CCTV Monitored', '24/7 Security', 'Smart Lockers', 'Insurance'],
      availableLockers: 23,
      totalLockers: 50,
      location: 'Platform 1 Exit, Varanasi Junction',
    },
    {
      id: 'CR002', 
      name: 'Dashashwamedh Ghat Storage',
      distance: '1.5 km',
      rating: 4.6,
      reviews: 89,
      price: 'From ₹35/hour',
      image: 'https://images.pexels.com/photos/2034851/pexels-photo-2034851.jpeg',
      features: ['CCTV Monitored', 'Climate Control', 'Smart Lockers', 'WiFi'],
      availableLockers: 15,
      totalLockers: 30,
      location: 'Near Dashashwamedh Ghat, Varanasi',
    },
    {
      id: 'CR003',
      name: 'Kashi Vishwanath Storage Hub',
      distance: '2.1 km', 
      rating: 4.9,
      reviews: 234,
      price: 'From ₹35/hour',
      image: 'https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg',
      features: ['CCTV Monitored', '24/7 Security', 'Smart Lockers', 'Insurance', 'Climate Control'],
      availableLockers: 8,
      totalLockers: 40,
      location: 'Temple Complex Area, Varanasi',
    },
  ];

  const recentBookings = [
    {
      id: 'DN001',
      status: 'delivered',
      location: 'Railway Station → Airport',
      date: '2025-01-15',
      price: '₹180',
    },
    {
      id: 'DN002',
      status: 'in-storage',
      location: 'Dashashwamedh Ghat Hub',
      date: '2025-01-14',
      price: '₹120',
    },
  ];

  const handlePriceSelection = (total: number, details: any) => {
    const bookingId = `DN${Date.now().toString().slice(-6)}`;
    Alert.alert(
      'Booking Confirmed',
      `Total: ₹${total.toFixed(2)}\nBooking ID: ${bookingId}\nItems: ${details.totalItems}\nService: ${details.serviceType}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Track Booking', onPress: () => router.push('/(user)/track') }
      ]
    );
  };

  const handleCloakroomSelect = (cloakroom: any) => {
    Alert.alert(
      'Select Cloakroom',
      `${cloakroom.name}\n${cloakroom.location}\n\nAvailable Lockers: ${cloakroom.availableLockers}/${cloakroom.totalLockers}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Book Now', onPress: () => setCalculatorVisible(true) }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#3B82F6', '#1E40AF']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Welcome to DropNGo!</Text>
            <Text style={styles.location}>📍 {userLocation}</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Package size={24} color="#FFFFFF" />
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Total Bookings</Text>
              </View>
              <View style={styles.statCard}>
                <Star size={24} color="#FFFFFF" />
                <Text style={styles.statNumber}>4.8</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <View style={styles.statCard}>
                <Clock size={24} color="#FFFFFF" />
                <Text style={styles.statNumber}>48h</Text>
                <Text style={styles.statLabel}>Time Saved</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.cloakroomsSection}>
            <Text style={styles.sectionTitle}>Nearby Cloakrooms</Text>
            {nearbyCloakrooms.map((cloakroom) => (
              <TouchableOpacity 
                key={cloakroom.id} 
                style={styles.cloakroomCard}
                onPress={() => handleCloakroomSelect(cloakroom)}
              >
                <Image source={{ uri: cloakroom.image }} style={styles.cloakroomImage} />
                <View style={styles.cloakroomInfo}>
                  <View style={styles.cloakroomHeader}>
                    <Text style={styles.cloakroomName}>{cloakroom.name}</Text>
                    <View style={styles.distanceContainer}>
                      <Navigation size={12} color="#3B82F6" />
                      <Text style={styles.distance}>{cloakroom.distance}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.cloakroomLocation}>{cloakroom.location}</Text>
                  
                  <View style={styles.cloakroomMeta}>
                    <View style={styles.ratingContainer}>
                      <Star size={12} color="#F59E0B" />
                      <Text style={styles.rating}>{cloakroom.rating}</Text>
                      <Text style={styles.reviews}>({cloakroom.reviews})</Text>
                    </View>
                    <Text style={styles.price}>{cloakroom.price}</Text>
                  </View>

                  <View style={styles.availabilityContainer}>
                    <View style={styles.lockersInfo}>
                      <Lock size={12} color="#059669" />
                      <Text style={styles.lockersText}>
                        {cloakroom.availableLockers} of {cloakroom.totalLockers} lockers available
                      </Text>
                    </View>
                  </View>

                  <View style={styles.featuresContainer}>
                    {cloakroom.features.slice(0, 3).map((feature, index) => (
                      <View key={index} style={styles.featureTag}>
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                    {cloakroom.features.length > 3 && (
                      <Text style={styles.moreFeatures}>+{cloakroom.features.length - 3} more</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.calculatorButton}
            onPress={() => setCalculatorVisible(true)}
          >
            <LinearGradient
              colors={['#F97316', '#EA580C']}
              style={styles.calculatorGradient}
            >
              <Package size={24} color="#FFFFFF" />
              <Text style={styles.calculatorText}>Calculate Price & Book</Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Why Choose DropNGo?</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Shield size={20} color="#059669" />
                <Text style={styles.featureText}>100% Secure Storage</Text>
              </View>
              <View style={styles.featureItem}>
                <MapPin size={20} color="#059669" />
                <Text style={styles.featureText}>Real-time Tracking</Text>
              </View>
              <View style={styles.featureItem}>
                <Clock size={20} color="#059669" />
                <Text style={styles.featureText}>24/7 Service</Text>
              </View>
              <View style={styles.featureItem}>
                <Star size={20} color="#059669" />
                <Text style={styles.featureText}>Verified Porters</Text>
              </View>
              <View style={styles.featureItem}>
                <Camera size={20} color="#059669" />
                <Text style={styles.featureText}>Photo Verification</Text>
              </View>
              <View style={styles.featureItem}>
                <Eye size={20} color="#059669" />
                <Text style={styles.featureText}>CCTV Monitored</Text>
              </View>
            </View>
          </View>

          {recentBookings.length > 0 && (
            <View style={styles.recentSection}>
              <Text style={styles.sectionTitle}>Recent Bookings</Text>
              {recentBookings.map((booking) => (
                <TouchableOpacity key={booking.id} style={styles.bookingCard}>
                  <View style={styles.bookingHeader}>
                    <Text style={styles.bookingId}>#{booking.id}</Text>
                    <View style={[
                      styles.statusBadge,
                      booking.status === 'delivered' ? styles.statusDelivered : styles.statusActive
                    ]}>
                      <Text style={[
                        styles.statusText,
                        booking.status === 'delivered' ? styles.statusTextDelivered : styles.statusTextActive
                      ]}>
                        {booking.status === 'delivered' ? 'Delivered' : 'In Storage'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.bookingLocation}>{booking.location}</Text>
                  <View style={styles.bookingFooter}>
                    <Text style={styles.bookingDate}>{booking.date}</Text>
                    <Text style={styles.bookingPrice}>{booking.price}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <PriceCalculator
        visible={calculatorVisible}
        onClose={() => setCalculatorVisible(false)}
        onSelect={handlePriceSelection}
      />
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
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
  },
  location: {
    fontSize: 16,
    color: '#E5E7EB',
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#E5E7EB',
    marginTop: 4,
  },
  content: {
    padding: 24,
  },
  cloakroomsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  cloakroomCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  cloakroomImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#F3F4F6',
  },
  cloakroomInfo: {
    padding: 16,
  },
  cloakroomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cloakroomName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
  },
  cloakroomLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  cloakroomMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  reviews: {
    fontSize: 12,
    color: '#6B7280',
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  availabilityContainer: {
    marginBottom: 12,
  },
  lockersInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lockersText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  featureTag: {
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 10,
    color: '#3B82F6',
    fontWeight: '600',
  },
  moreFeatures: {
    fontSize: 10,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  calculatorButton: {
    marginBottom: 32,
  },
  calculatorGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 12,
  },
  calculatorText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  featuresSection: {
    marginBottom: 32,
  },
  featuresList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    gap: 8,
  },
  recentSection: {
    marginBottom: 32,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookingId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusDelivered: {
    backgroundColor: '#DCFCE7',
  },
  statusActive: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextDelivered: {
    color: '#059669',
  },
  statusTextActive: {
    color: '#D97706',
  },
  bookingLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  bookingPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
});