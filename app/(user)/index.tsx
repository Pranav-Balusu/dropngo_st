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
  Package,
  LogOut
} from 'lucide-react-native';
import PriceCalculator from '@/components/PriceCalculator';
import { supabase } from '@/lib/supabase';

export default function UserHomeScreen() {
  const [calculatorVisible, setCalculatorVisible] = useState(false);
  const [userLocation, setUserLocation] = useState('Varanasi Railway Station');

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

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: async () => {
            try {
              const { error } = await supabase.auth.signOut();
              if (error) {
                Alert.alert('Error', error.message);
              } else {
                router.push('/(auth)/login');
              }
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'An unexpected error occurred during logout.');
            }
          }
        }
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
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <LogOut size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
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
          <TouchableOpacity
            style={styles.calculatorButton}
            onPress={() => router.push('/(user)/book')}
          >
            <LinearGradient
              colors={['#F97316', '#EA580C']}
              style={styles.calculatorGradient}
            >
              <Package size={24} color="#FFFFFF" />
              <Text style={styles.calculatorText}>Book Pickup & Delivery</Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Why Choose DropNGo?</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Shield size={20} color="#059669" />
                <Text style={styles.featureItemText}>100% Secure Storage</Text>
              </View>
              <View style={styles.featureItem}>
                <MapPin size={20} color="#059669" />
                <Text style={styles.featureItemText}>Real-time Tracking</Text>
              </View>
              <View style={styles.featureItem}>
                <Clock size={20} color="#059669" />
                <Text style={styles.featureItemText}>24/7 Service</Text>
              </View>
              <View style={styles.featureItem}>
                <Star size={20} color="#059669" />
                <Text style={styles.featureItemText}>Verified Porters</Text>
              </View>
              <View style={styles.featureItem}>
                <Camera size={20} color="#059669" />
                <Text style={styles.featureItemText}>Photo Verification</Text>
              </View>
              <View style={styles.featureItem}>
                <Eye size={20} color="#059669" />
                <Text style={styles.featureItemText}>CCTV Monitored</Text>
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
    position: 'relative',
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
  logoutButton: {
    position: 'absolute',
    top: 16,
    right: 0,
    padding: 8,
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
  featureItemText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
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