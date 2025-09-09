import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Users, Package, IndianRupee, Clock, MapPin, Star, TriangleAlert as AlertTriangle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function AdminDashboardScreen() {
  const [timeFilter, setTimeFilter] = useState('today');

  const dashboardStats = {
    today: {
      totalRevenue: 125000,
      totalBookings: 234,
      activePorters: 45,
      pendingVerifications: 8,
      avgRating: 4.7,
      completionRate: 98.5,
    },
    week: {
      totalRevenue: 750000,
      totalBookings: 1456,
      activePorters: 52,
      pendingVerifications: 12,
      avgRating: 4.8,
      completionRate: 97.8,
    },
    month: {
      totalRevenue: 3200000,
      totalBookings: 5678,
      activePorters: 68,
      pendingVerifications: 15,
      avgRating: 4.6,
      completionRate: 98.1,
    }
  };

  const currentStats = dashboardStats[timeFilter as keyof typeof dashboardStats];

  const quickActions = [
    { title: 'Verify Porters', count: currentStats.pendingVerifications, color: '#F97316', action: () => {} },
    { title: 'Resolve Issues', count: 3, color: '#DC2626', action: () => {} },
    { title: 'View Reports', count: 0, color: '#059669', action: () => {} },
  ];

  const recentBookings = [
    { id: 'DN001234', user: 'John Doe', porter: 'Rajesh K.', status: 'completed', amount: 280 },
    { id: 'DN001235', user: 'Sara Ali', porter: 'Amit S.', status: 'in-transit', amount: 150 },
    { id: 'DN001236', user: 'Mike Chen', porter: 'Priya M.', status: 'pending', amount: 320 },
    { id: 'DN001237', user: 'Emma Wilson', porter: 'Ravi P.', status: 'completed', amount: 190 },
  ];

  const alerts = [
    { type: 'warning', message: '8 porters pending verification', action: 'Review Now' },
    { type: 'info', message: 'Peak hours: 2-4 PM today', action: 'View Details' },
    { type: 'error', message: '3 customer complaints unresolved', action: 'Resolve' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#7C3AED', '#5B21B6']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSubtitle}>DropNGo Operations Center</Text>
        
        <View style={styles.filterContainer}>
          {['today', 'week', 'month'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                timeFilter === filter && styles.filterButtonActive
              ]}
              onPress={() => setTimeFilter(filter)}
            >
              <Text style={[
                styles.filterButtonText,
                timeFilter === filter && styles.filterButtonTextActive
              ]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#059669' }]}>
                <IndianRupee size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.statValue}>₹{(currentStats.totalRevenue / 1000).toFixed(0)}K</Text>
              <Text style={styles.statLabel}>Revenue</Text>
              <Text style={styles.statChange}>+12.5%</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#3B82F6' }]}>
                <Package size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.statValue}>{currentStats.totalBookings}</Text>
              <Text style={styles.statLabel}>Bookings</Text>
              <Text style={styles.statChange}>+8.3%</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#F97316' }]}>
                <Users size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.statValue}>{currentStats.activePorters}</Text>
              <Text style={styles.statLabel}>Active Porters</Text>
              <Text style={styles.statChange}>+5.2%</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#7C3AED' }]}>
                <Star size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.statValue}>{currentStats.avgRating}</Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
              <Text style={styles.statChange}>+0.2</Text>
            </View>
          </View>
        </View>

        <View style={styles.alertsSection}>
          <Text style={styles.sectionTitle}>System Alerts</Text>
          {alerts.map((alert, index) => (
            <View key={index} style={[
              styles.alertCard,
              alert.type === 'error' && styles.alertError,
              alert.type === 'warning' && styles.alertWarning,
              alert.type === 'info' && styles.alertInfo,
            ]}>
              <View style={styles.alertContent}>
                <AlertTriangle size={16} color={
                  alert.type === 'error' ? '#DC2626' : 
                  alert.type === 'warning' ? '#F59E0B' : '#3B82F6'
                } />
                <Text style={styles.alertMessage}>{alert.message}</Text>
              </View>
              <TouchableOpacity style={styles.alertAction}>
                <Text style={styles.alertActionText}>{alert.action}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={styles.actionCard} onPress={action.action}>
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <Text style={styles.actionCount}>{action.count}</Text>
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Bookings</Text>
          <View style={styles.bookingsContainer}>
            {recentBookings.map((booking, index) => (
              <View key={index} style={styles.bookingCard}>
                <View style={styles.bookingHeader}>
                  <Text style={styles.bookingId}>#{booking.id}</Text>
                  <View style={[
                    styles.bookingStatus,
                    booking.status === 'completed' && styles.statusCompleted,
                    booking.status === 'in-transit' && styles.statusInTransit,
                    booking.status === 'pending' && styles.statusPending,
                  ]}>
                    <Text style={[
                      styles.statusText,
                      booking.status === 'completed' && styles.statusTextCompleted,
                      booking.status === 'in-transit' && styles.statusTextInTransit,
                      booking.status === 'pending' && styles.statusTextPending,
                    ]}>
                      {booking.status.replace('-', ' ').toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View style={styles.bookingDetails}>
                  <Text style={styles.bookingUser}>User: {booking.user}</Text>
                  <Text style={styles.bookingPorter}>Porter: {booking.porter}</Text>
                </View>
                <View style={styles.bookingFooter}>
                  <Text style={styles.bookingAmount}>₹{booking.amount}</Text>
                  <TouchableOpacity style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
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
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 4,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  filterButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  filterButtonTextActive: {
    color: '#7C3AED',
    fontWeight: '600',
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
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: (width - 60) / 2,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  alertsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertError: {
    borderLeftColor: '#DC2626',
  },
  alertWarning: {
    borderLeftColor: '#F59E0B',
  },
  alertInfo: {
    borderLeftColor: '#3B82F6',
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  alertMessage: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  alertAction: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  alertActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
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
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  actionTitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  recentSection: {
    marginBottom: 32,
  },
  bookingsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  bookingCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
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
  bookingStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusCompleted: {
    backgroundColor: '#DCFCE7',
  },
  statusInTransit: {
    backgroundColor: '#FEF3C7',
  },
  statusPending: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  statusTextCompleted: {
    color: '#059669',
  },
  statusTextInTransit: {
    color: '#D97706',
  },
  statusTextPending: {
    color: '#DC2626',
  },
  bookingDetails: {
    marginBottom: 8,
  },
  bookingUser: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  bookingPorter: {
    fontSize: 12,
    color: '#6B7280',
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
});