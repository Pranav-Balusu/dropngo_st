import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Package, IndianRupee, Clock, Star, TrendingUp, MapPin, Bell, Navigation, CircleCheck as CheckCircle } from 'lucide-react-native';

export default function PorterDashboardScreen() {
  const [isOnline, setIsOnline] = useState(true);

  const porterStats = {
    todayEarnings: 1250,
    totalEarnings: 45600,
    completedDeliveries: 23,
    rating: 4.8,
    activeBookings: 2,
  };

  const activeBookings = [
    {
      id: 'LF001234',
      user: 'John Doe',
      pickup: 'Mumbai Central',
      delivery: 'Mumbai Airport T1',
      time: '2:30 PM',
      amount: 280,
      status: 'pickup-pending',
      luggage: 2,
    },
    {
      id: 'LF001235',
      user: 'Sara Ali',
      pickup: 'Bandra Station',
      delivery: 'Mumbai Airport T2',
      time: '4:00 PM',
      amount: 150,
      status: 'in-storage',
      luggage: 1,
    },
  ];

  const quickActions = [
    { title: 'Start Pickup', icon: Package, color: '#3B82F6' },
    { title: 'Scan QR', icon: Package, color: '#F97316' },
    { title: 'Navigation', icon: Navigation, color: '#059669' },
    { title: 'Report Issue', icon: Bell, color: '#DC2626' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#059669', '#047857']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.onlineStatus}>
            <Text style={styles.greeting}>Porter Dashboard</Text>
            <View style={styles.statusToggle}>
              <Text style={styles.statusLabel}>
                {isOnline ? 'Online' : 'Offline'}
              </Text>
              <Switch
                value={isOnline}
                onValueChange={setIsOnline}
                trackColor={{ false: '#F3F4F6', true: '#DCFCE7' }}
                thumbColor={isOnline ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
          </View>
          
          <View style={styles.earningsDisplay}>
            <Text style={styles.earningsLabel}>Today's Earnings</Text>
            <Text style={styles.earningsAmount}>₹{porterStats.todayEarnings}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#3B82F6' }]}>
                <Package size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.statValue}>{porterStats.completedDeliveries}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#F59E0B' }]}>
                <Star size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.statValue}>{porterStats.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#059669' }]}>
                <IndianRupee size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.statValue}>₹{(porterStats.totalEarnings / 1000).toFixed(0)}K</Text>
              <Text style={styles.statLabel}>Total Earned</Text>
            </View>
          </View>
        </View>

        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={styles.actionCard}>
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <action.icon size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bookingsSection}>
          <Text style={styles.sectionTitle}>Active Bookings ({activeBookings.length})</Text>
          {activeBookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <View style={styles.bookingInfo}>
                  <Text style={styles.bookingId}>#{booking.id}</Text>
                  <Text style={styles.userName}>{booking.user}</Text>
                </View>
                <View style={styles.bookingAmount}>
                  <Text style={styles.amountText}>₹{booking.amount}</Text>
                  <Text style={styles.luggageCount}>{booking.luggage} items</Text>
                </View>
              </View>

              <View style={styles.routeInfo}>
                <View style={styles.routePoint}>
                  <MapPin size={14} color="#3B82F6" />
                  <Text style={styles.routeText}>{booking.pickup}</Text>
                </View>
                <View style={styles.routeLine} />
                <View style={styles.routePoint}>
                  <MapPin size={14} color="#F97316" />
                  <Text style={styles.routeText}>{booking.delivery}</Text>
                </View>
              </View>

              <View style={styles.bookingFooter}>
                <View style={styles.timeInfo}>
                  <Clock size={14} color="#6B7280" />
                  <Text style={styles.timeText}>{booking.time}</Text>
                </View>
                
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    booking.status === 'pickup-pending' ? styles.pickupButton : styles.deliverButton
                  ]}
                >
                  <Text style={styles.actionButtonText}>
                    {booking.status === 'pickup-pending' ? 'Start Pickup' : 'Ready to Deliver'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.performanceSection}>
          <Text style={styles.sectionTitle}>Performance</Text>
          <View style={styles.performanceCard}>
            <View style={styles.performanceItem}>
              <TrendingUp size={16} color="#059669" />
              <Text style={styles.performanceLabel}>This Week</Text>
              <Text style={styles.performanceValue}>18 deliveries</Text>
            </View>
            <View style={styles.performanceItem}>
              <CheckCircle size={16} color="#3B82F6" />
              <Text style={styles.performanceLabel}>Success Rate</Text>
              <Text style={styles.performanceValue}>98.5%</Text>
            </View>
            <View style={styles.performanceItem}>
              <Clock size={16} color="#F59E0B" />
              <Text style={styles.performanceLabel}>Avg Time</Text>
              <Text style={styles.performanceValue}>45 min</Text>
            </View>
          </View>
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
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  onlineStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  earningsDisplay: {
    alignItems: 'center',
  },
  earningsLabel: {
    fontSize: 14,
    color: '#E5E7EB',
  },
  earningsAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  statsSection: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
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
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
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
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  bookingsSection: {
    marginBottom: 24,
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
    marginBottom: 16,
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
  userName: {
    fontSize: 14,
    color: '#6B7280',
  },
  bookingAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
  },
  luggageCount: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  routeInfo: {
    marginBottom: 16,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  routeLine: {
    width: 2,
    height: 16,
    backgroundColor: '#E5E7EB',
    marginLeft: 6,
    marginBottom: 8,
  },
  routeText: {
    fontSize: 14,
    color: '#374151',
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  pickupButton: {
    backgroundColor: '#3B82F6',
  },
  deliverButton: {
    backgroundColor: '#F97316',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  performanceSection: {
    marginBottom: 32,
  },
  performanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  performanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  performanceLabel: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
  },
  performanceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
});