import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { getCurrentPricing } from '@/services/pricingService';
import { processBooking } from '@/services/bookingService';
import { 
  Package, 
  Calculator,
  ArrowRight,
  MapPin,
  Clock,
  Star,
  Shield
} from 'lucide-react-native';
import PriceCalculator from '@/components/PriceCalculator';
import { supabase } from '@/lib/supabase';

export default function BookingScreen() {
  const [calculatorVisible, setCalculatorVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    getCurrentUser();
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

  const popularDestinations = [
    { name: 'Mumbai Airport T1', price: 'From ₹140', time: '2-4 hrs', rating: 4.8 },
    { name: 'Mumbai Airport T2', price: 'From ₹140', time: '2-4 hrs', rating: 4.9 },
    { name: 'Mumbai Central', price: 'From ₹105', time: '1-3 hrs', rating: 4.7 },
    { name: 'Bandra Station', price: 'From ₹90', time: '1-2 hrs', rating: 4.6 },
  ];

  const features = [
    { title: 'Secure Storage', description: 'CCTV monitored facilities', icon: Shield },
    { title: 'Real-time Tracking', description: 'Track your luggage live', icon: MapPin },
    { title: 'Verified Porters', description: 'KYC verified professionals', icon: Star },
    { title: 'Flexible Timing', description: 'Store from 1 hour to 7 days', icon: Clock },
  ];

  const handlePriceSelection = async (total, details) => {
    if (!currentUser) {
      Alert.alert('Error', 'Please login to continue');
      return;
    }

    try {
      const booking = await processBooking(currentUser.id, details);
      
      Alert.alert(
        'Booking Confirmed',
        `Total: ₹${total.toFixed(2)}\nBooking ID: ${booking.booking_number}\nItems: ${details.totalItems}\nService: ${details.serviceType}`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Track Booking', onPress: () => router.push('/(user)/track') }
        ]
      );
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Error', 'Failed to create booking. Please try again.');
    }
    setCalculatorVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#3B82F6', '#1E40AF']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Book Storage</Text>
        <Text style={styles.headerSubtitle}>Store your luggage securely</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.calculatorButton}
          onPress={() => setCalculatorVisible(true)}
        >
          <LinearGradient
            colors={['#F97316', '#EA580C']}
            style={styles.calculatorGradient}
          >
            <Calculator size={24} color="#FFFFFF" />
            <Text style={styles.calculatorText}>Calculate Price & Book</Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Why Choose LugFree?</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <feature.icon size={20} color="#3B82F6" />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.destinationsSection}>
          <Text style={styles.sectionTitle}>Popular Destinations</Text>
          {popularDestinations.map((destination, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.destinationCard}
              onPress={() => setCalculatorVisible(true)}
            >
              <View style={styles.destinationInfo}>
                <Text style={styles.destinationName}>{destination.name}</Text>
                <View style={styles.destinationMeta}>
                  <View style={styles.metaItem}>
                    <Clock size={12} color="#6B7280" />
                    <Text style={styles.metaText}>{destination.time}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Star size={12} color="#F59E0B" />
                    <Text style={styles.metaText}>{destination.rating}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.destinationPrice}>
                <Text style={styles.priceText}>{destination.price}</Text>
                <ArrowRight size={16} color="#6B7280" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.howItWorksSection}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.stepsContainer}>
            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: '#3B82F6' }]}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Book & Calculate</Text>
                <Text style={styles.stepDescription}>
                  Select destination, luggage type, and duration
                </Text>
              </View>
            </View>
            
            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: '#F97316' }]}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Store or Pickup</Text>
                <Text style={styles.stepDescription}>
                  Drop at our locker or request pickup service
                </Text>
              </View>
            </View>
            
            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: '#059669' }]}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Track & Collect</Text>
                <Text style={styles.stepDescription}>
                  Real-time tracking until delivery to your destination
                </Text>
              </View>
            </View>
          </View>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
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
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  destinationsSection: {
    marginBottom: 32,
  },
  destinationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  destinationInfo: {
    flex: 1,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  destinationMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  destinationPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  howItWorksSection: {
    marginBottom: 32,
  },
  stepsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});