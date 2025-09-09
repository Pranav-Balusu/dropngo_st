import React, { useState } from 'react';
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
import { Package, MapPin, Clock, Phone, Navigation, QrCode, CircleCheck as CheckCircle, User, IndianRupee, Camera, Car, FileText } from 'lucide-react-native';
import LuggagePhotoVerification from '@/components/LuggagePhotoVerification';

export default function PorterBookingsScreen() {
  const [selectedTab, setSelectedTab] = useState('active');
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  const [selectedBookingForVerification, setSelectedBookingForVerification] = useState(null);

  const bookings = {
    active: [
      {
        id: 'DN001234',
        user: 'John Doe',
        userPhone: '+91 98765 43210',
        pickup: 'Mumbai Central Station',
        delivery: 'Mumbai Airport Terminal 1',
        pickupTime: '2025-01-15 2:30 PM',
        deliveryTime: '2025-01-15 6:00 PM',
        amount: 280,
        commission: 56,
        luggage: 2,
        status: 'pickup-pending',
        otp: '4567',
        luggagePhotos: [
          'https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg',
          'https://images.pexels.com/photos/2034851/pexels-photo-2034851.jpeg'
        ],
        porterDetails: {
          name: 'Rajesh Kumar',
          vehicle: 'Motorcycle - MH12AB1234',
          phone: '+91 98765 43210',
        }
      },
      {
        id: 'DN001235',
        user: 'Sara Ali',
        userPhone: '+91 87654 32109',
        pickup: 'Bandra Station',
        delivery: 'Mumbai Airport Terminal 2',
        pickupTime: '2025-01-15 4:00 PM',
        deliveryTime: '2025-01-15 7:30 PM',
        amount: 150,
        commission: 30,
        luggage: 1,
        status: 'ready-for-delivery',
        otp: '8901',
        luggagePhotos: [
          'https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg'
        ],
        porterDetails: {
          name: 'Rajesh Kumar',
          vehicle: 'Motorcycle - MH12AB1234',
          phone: '+91 98765 43210',
        }
      },
    ],
    completed: [
      {
        id: 'DN001233',
        user: 'Mike Chen',
        pickup: 'Andheri Station',
        delivery: 'Mumbai Airport Terminal 1',
        completedTime: '2025-01-14 5:30 PM',
        amount: 320,
        commission: 64,
        luggage: 3,
        rating: 5,
      },
      {
        id: 'DN001232',
        user: 'Emma Wilson',
        pickup: 'Dadar Station',
        delivery: 'Mumbai Central',
        completedTime: '2025-01-14 2:15 PM',
        amount: 190,
        commission: 38,
        luggage: 2,
        rating: 4,
      },
    ],
  };

  const handleStartPickup = (bookingId: string) => {
    Alert.alert(
      'Start Pickup',
      'Are you ready to start the pickup process?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start Pickup', 
          onPress: () => Alert.alert('Success', 'Pickup process started! Navigate to pickup location.')
        }
      ]
    );
  };

  const handleVerifyAndDeliver = (booking: any) => {
    setSelectedBookingForVerification(booking);
    setVerificationModalVisible(true);
  };

  const handleVerificationComplete = (verified: boolean) => {
    if (verified) {
      Alert.alert('Success', 'Luggage verified and delivered successfully!');
    }
    setVerificationModalVisible(false);
    setSelectedBookingForVerification(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#059669', '#047857']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>My Bookings</Text>
        <Text style={styles.headerSubtitle}>Manage your assignments</Text>
      </LinearGradient>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'active' && styles.tabActive
          ]}
          onPress={() => setSelectedTab('active')}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'active' && styles.tabTextActive
          ]}>
            Active ({bookings.active.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'completed' && styles.tabActive
          ]}
          onPress={() => setSelectedTab('completed')}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'completed' && styles.tabTextActive
          ]}>
            Completed ({bookings.completed.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'active' && bookings.active.map((booking) => (
          <View key={booking.id} style={styles.bookingCard}>
            <View style={styles.bookingHeader}>
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingId}>#{booking.id}</Text>
                <View style={styles.userInfo}>
                  <User size={14} color="#6B7280" />
                  <Text style={styles.userName}>{booking.user}</Text>
                </View>
              </View>
              <View style={styles.amountInfo}>
                <Text style={styles.totalAmount}>₹{booking.amount}</Text>
                <Text style={styles.commission}>Earn: ₹{booking.commission}</Text>
              </View>
            </View>

            <View style={styles.porterInfo}>
              <Car size={16} color="#6B7280" />
              <Text style={styles.porterText}>
                {booking.porterDetails.name} • {booking.porterDetails.vehicle}
              </Text>
            </View>

            <View style={styles.routeContainer}>
              <View style={styles.routePoint}>
                <View style={[styles.routeDot, { backgroundColor: '#3B82F6' }]} />
                <View style={styles.routeDetails}>
                  <Text style={styles.routeLabel}>Pickup</Text>
                  <Text style={styles.routeLocation}>{booking.pickup}</Text>
                  <Text style={styles.routeTime}>{booking.pickupTime}</Text>
                </View>
              </View>
              
              <View style={styles.routeLine} />
              
              <View style={styles.routePoint}>
                <View style={[styles.routeDot, { backgroundColor: '#F97316' }]} />
                <View style={styles.routeDetails}>
                  <Text style={styles.routeLabel}>Delivery</Text>
                  <Text style={styles.routeLocation}>{booking.delivery}</Text>
                  <Text style={styles.routeTime}>{booking.deliveryTime}</Text>
                </View>
              </View>
            </View>

            <View style={styles.luggageInfo}>
              <Package size={16} color="#6B7280" />
              <Text style={styles.luggageText}>{booking.luggage} luggage items</Text>
              <Text style={styles.otpText}>OTP: {booking.otp}</Text>
            </View>

            <View style={styles.bookingActions}>
              <TouchableOpacity style={styles.callButton}>
                <Phone size={16} color="#3B82F6" />
                <Text style={styles.callButtonText}>Call User</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navigationButton}>
                <Navigation size={16} color="#FFFFFF" />
                <Text style={styles.navigationButtonText}>Navigate</Text>
              </TouchableOpacity>

              {booking.status === 'pickup-pending' ? (
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={() => handleStartPickup(booking.id)}
                >
                  <CheckCircle size={16} color="#FFFFFF" />
                  <Text style={styles.startButtonText}>Start Pickup</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.verifyButton}
                  onPress={() => handleVerifyAndDeliver(booking)}
                >
                  <Camera size={16} color="#FFFFFF" />
                  <Text style={styles.verifyButtonText}>Verify & Deliver</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        {selectedTab === 'completed' && bookings.completed.map((booking) => (
          <View key={booking.id} style={styles.completedCard}>
            <View style={styles.completedHeader}>
              <View style={styles.completedInfo}>
                <Text style={styles.bookingId}>#{booking.id}</Text>
                <Text style={styles.completedUser}>{booking.user}</Text>
                <Text style={styles.completedTime}>{booking.completedTime}</Text>
              </View>
              <View style={styles.completedEarnings}>
                <Text style={styles.completedAmount}>₹{booking.amount}</Text>
                <Text style={styles.completedCommission}>+₹{booking.commission}</Text>
                {booking.rating && (
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>★ {booking.rating}</Text>
                  </View>
                )}
              </View>
            </View>
            
            <View style={styles.completedRoute}>
              <Text style={styles.routeText}>
                {booking.pickup} → {booking.delivery}
              </Text>
              <Text style={styles.luggageText}>{booking.luggage} items</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {selectedBookingForVerification && (
        <LuggagePhotoVerification
          visible={verificationModalVisible}
          onClose={() => setVerificationModalVisible(false)}
          bookingId={selectedBookingForVerification.id}
          originalPhotos={selectedBookingForVerification.luggagePhotos}
          onVerificationComplete={handleVerificationComplete}
        />
      )}
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#059669',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#059669',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
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
    marginBottom: 12,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userName: {
    fontSize: 14,
    color: '#6B7280',
  },
  amountInfo: {
    alignItems: 'flex-end',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  commission: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    marginTop: 2,
  },
  porterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    backgroundColor: '#F0F8FF',
    padding: 12,
    borderRadius: 8,
  },
  porterText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
  },
  routeContainer: {
    marginBottom: 16,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },
  routeDetails: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 2,
  },
  routeLocation: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 2,
  },
  routeTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  routeLine: {
    width: 2,
    height: 16,
    backgroundColor: '#E5E7EB',
    marginLeft: 5,
    marginBottom: 8,
  },
  luggageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  luggageText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  otpText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  bookingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  callButtonText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  navigationButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  startButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F97316',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  verifyButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  completedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  completedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  completedInfo: {
    flex: 1,
  },
  completedUser: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  completedTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  completedEarnings: {
    alignItems: 'flex-end',
  },
  completedAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  completedCommission: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    marginTop: 2,
  },
  ratingContainer: {
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
  },
  completedRoute: {
    marginTop: 8,
  },
  routeText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
});