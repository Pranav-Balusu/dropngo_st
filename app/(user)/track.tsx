import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Package, Clock, CircleCheck as CheckCircle, Truck, QrCode, Phone, MessageCircle, Navigation, Star } from 'lucide-react-native';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import LiveTrackingMap from '@/components/LiveTrackingMap';

export default function TrackingScreen() {
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const [currentBooking, setCurrentBooking] = useState({
    id: 'DN123456',
    status: 'in-transit',
    pickupTime: '2025-01-15 10:30 AM',
    deliveryTime: '2025-01-15 4:00 PM',
    porterName: 'Rajesh Kumar',
    porterPhone: '+91 98765 43210',
    porterRating: 4.8,
    currentLocation: 'En route to Airport Terminal 1',
    qrCode: 'DN123456QR',
    destination: 'Mumbai Airport Terminal 1',
    luggage: { small: 1, medium: 1, large: 0, 'extra-large': 0 },
    serviceType: 'pickup',
    totalAmount: 280,
    porter: {
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      currentLocation: {
        latitude: 19.0760,
        longitude: 72.8777,
      },
    },
    pickupLocation: {
      latitude: 19.0825,
      longitude: 72.8811,
      address: 'Mumbai Central Station',
    },
    deliveryLocation: {
      latitude: 19.0896,
      longitude: 72.8656,
      address: 'Mumbai Airport Terminal 1',
    },
  });

  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const trackingSteps = [
    { title: 'Booking Confirmed', completed: true, time: '10:00 AM' },
    { title: 'Porter Assigned', completed: true, time: '10:15 AM' },
    { title: 'Luggage Picked Up', completed: true, time: '10:30 AM' },
    { title: 'In Secure Storage', completed: true, time: '10:45 AM' },
    { title: 'Out for Delivery', completed: true, time: '3:30 PM' },
    { title: 'Delivered', completed: false, time: '4:00 PM (Est.)' },
  ];

  const handleShowQR = () => {
    setQrModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#059669', '#047857']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Track Luggage</Text>
        <Text style={styles.headerSubtitle}>Real-time tracking & updates</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.statusCard, { opacity: fadeAnim }]}>
          <View style={styles.statusHeader}>
            <View style={styles.statusInfo}>
              <Text style={styles.bookingId}>#{currentBooking.id}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>In Transit</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.qrButton} onPress={handleShowQR}>
              <QrCode size={24} color="#3B82F6" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.bookingDetails}>
            <View style={styles.detailRow}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.detailText}>Destination: {currentBooking.destination}</Text>
            </View>
            <View style={styles.detailRow}>
              <Package size={16} color="#6B7280" />
              <Text style={styles.detailText}>
                {Object.values(currentBooking.luggage).reduce((a, b) => a + b, 0)} items • {currentBooking.serviceType.replace('-', ' ')}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.locationText}>{currentBooking.currentLocation}</Text>
            </View>
          </View>

          <View style={styles.timeInfo}>
            <View style={styles.timeItem}>
              <Clock size={16} color="#059669" />
              <Text style={styles.timeLabel}>Pickup</Text>
              <Text style={styles.timeValue}>{currentBooking.pickupTime}</Text>
            </View>
            <View style={styles.timeItem}>
              <Clock size={16} color="#F97316" />
              <Text style={styles.timeLabel}>Est. Delivery</Text>
              <Text style={styles.timeValue}>{currentBooking.deliveryTime}</Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.trackingSection}>
          <Text style={styles.sectionTitle}>Tracking Status</Text>
          <View style={styles.trackingTimeline}>
            {trackingSteps.map((step, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineIndicator}>
                  <View style={[
                    styles.timelineCircle,
                    step.completed ? styles.timelineCircleCompleted : styles.timelineCirclePending
                  ]}>
                    {step.completed && <CheckCircle size={16} color="#FFFFFF" />}
                  </View>
                  {index < trackingSteps.length - 1 && (
                    <View style={[
                      styles.timelineLine,
                      step.completed ? styles.timelineLineCompleted : styles.timelineLinePending
                    ]} />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[
                    styles.timelineTitle,
                    step.completed ? styles.timelineTitleCompleted : styles.timelineTitlePending
                  ]}>
                    {step.title}
                  </Text>
                  <Text style={styles.timelineTime}>{step.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.porterSection}>
          <Text style={styles.sectionTitle}>Your Porter</Text>
          <View style={styles.porterCard}>
            <View style={styles.porterInfo}>
              <View style={styles.porterAvatar}>
                <Text style={styles.porterInitials}>
                  {currentBooking.porterName.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <View style={styles.porterDetails}>
                <Text style={styles.porterName}>{currentBooking.porterName}</Text>
                <Text style={styles.porterPhone}>{currentBooking.porterPhone}</Text>
                <View style={styles.porterRating}>
                  <Star size={12} color="#F59E0B" />
                  <Text style={styles.ratingText}>★ {currentBooking.porterRating}</Text>
                  <Text style={styles.ratingCount}>(124 reviews)</Text>
                </View>
              </View>
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

        <TouchableOpacity style={styles.liveTrackButton}>
          <LinearGradient
            colors={['#3B82F6', '#1E40AF']}
            style={styles.liveTrackGradient}
            onPress={() => setMapVisible(true)}
          >
            <Navigation size={20} color="#FFFFFF" />
            <Text style={styles.liveTrackText}>Live GPS Tracking</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Booking Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service Type:</Text>
              <Text style={styles.summaryValue}>
                {currentBooking.serviceType === 'pickup' ? 'Pickup Service' : 'Self-Service'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Storage Fee:</Text>
              <Text style={styles.summaryValue}>₹{(currentBooking.totalAmount * 0.8).toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee:</Text>
              <Text style={styles.summaryValue}>₹{(currentBooking.totalAmount * 0.2).toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Amount:</Text>
              <Text style={styles.summaryAmount}>₹{currentBooking.totalAmount.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <QRCodeDisplay
        visible={qrModalVisible}
        onClose={() => setQrModalVisible(false)}
        bookingId={currentBooking.id}
        qrData={currentBooking.qrCode}
      />

      <LiveTrackingMap
        visible={mapVisible}
        onClose={() => setMapVisible(false)}
        booking={currentBooking}
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
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusInfo: {
    flex: 1,
  },
  bookingId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
  },
  qrButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F0F8FF',
  },
  bookingDetails: {
    marginBottom: 16,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  locationText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
    marginLeft: 24,
  },
  timeInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  timeItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  timeValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  trackingSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  trackingTimeline: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineIndicator: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineCircleCompleted: {
    backgroundColor: '#059669',
  },
  timelineCirclePending: {
    backgroundColor: '#E5E7EB',
  },
  timelineLine: {
    width: 2,
    height: 40,
    marginTop: 4,
  },
  timelineLineCompleted: {
    backgroundColor: '#059669',
  },
  timelineLinePending: {
    backgroundColor: '#E5E7EB',
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 20,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  timelineTitleCompleted: {
    color: '#111827',
  },
  timelineTitlePending: {
    color: '#9CA3AF',
  },
  timelineTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  porterSection: {
    marginBottom: 24,
  },
  porterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  porterInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  porterAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  porterInitials: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
  porterRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
  },
  ratingCount: {
    fontSize: 12,
    color: '#6B7280',
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
  liveTrackButton: {
    marginBottom: 24,
  },
  liveTrackGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  liveTrackText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  summarySection: {
    marginBottom: 32,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
  },
});