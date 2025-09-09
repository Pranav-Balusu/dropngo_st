import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Search,
  Filter,
  Package,
  MapPin,
  Clock,
  User,
  IndianRupee,
  Eye,
  MessageCircle
} from 'lucide-react-native';

export default function AdminBookingsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const bookings = [
    {
      id: 'DN001234',
      user: 'John Doe',
      porter: 'Rajesh Kumar',
      status: 'completed',
      pickupLocation: 'Mumbai Central Station',
      deliveryLocation: 'Mumbai Airport T1',
      pickupTime: '2025-01-15 10:30 AM',
      deliveryTime: '2025-01-15 4:00 PM',
      amount: 280,
      luggageCount: 2,
      serviceType: 'pickup',
      rating: 5,
    },
    {
      id: 'DN001235',
      user: 'Sara Ali',
      porter: 'Amit Singh',
      status: 'in-transit',
      pickupLocation: 'Bandra Station',
      deliveryLocation: 'Mumbai Airport T2',
      pickupTime: '2025-01-15 2:15 PM',
      deliveryTime: '2025-01-15 6:30 PM',
      amount: 150,
      luggageCount: 1,
      serviceType: 'self-service',
      rating: null,
    },
    {
      id: 'DN001236',
      user: 'Mike Chen',
      porter: 'Priya Sharma',
      status: 'pending',
      pickupLocation: 'Lonavala Station',
      deliveryLocation: 'Pune Airport',
      pickupTime: '2025-01-15 6:00 PM',
      deliveryTime: '2025-01-15 9:00 PM',
      amount: 320,
      luggageCount: 3,
      serviceType: 'pickup',
      rating: null,
    },
  ];

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.porter.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#059669';
      case 'in-transit': return '#D97706';
      case 'pending': return '#DC2626';
      default: return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#7C3AED', '#5B21B6']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Booking Management</Text>
        <Text style={styles.headerSubtitle}>Monitor all bookings and operations</Text>
      </LinearGradient>

      <View style={styles.filtersContainer}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search bookings..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        
        <View style={styles.filterTabs}>
          {['all', 'pending', 'in-transit', 'completed'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterTab,
                filterStatus === status && styles.filterTabActive
              ]}
              onPress={() => setFilterStatus(status)}
            >
              <Text style={[
                styles.filterTabText,
                filterStatus === status && styles.filterTabTextActive
              ]}>
                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredBookings.map((booking) => (
          <View key={booking.id} style={styles.bookingCard}>
            <View style={styles.bookingHeader}>
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingId}>#{booking.id}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(booking.status) + '20' }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(booking.status) }
                  ]}>
                    {booking.status.replace('-', ' ').toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={styles.bookingAmount}>₹{booking.amount}</Text>
            </View>

            <View style={styles.bookingDetails}>
              <View style={styles.detailRow}>
                <User size={16} color="#6B7280" />
                <Text style={styles.detailText}>User: {booking.user}</Text>
              </View>
              <View style={styles.detailRow}>
                <Package size={16} color="#6B7280" />
                <Text style={styles.detailText}>Porter: {booking.porter}</Text>
              </View>
              <View style={styles.detailRow}>
                <MapPin size={16} color="#6B7280" />
                <Text style={styles.detailText}>
                  {booking.pickupLocation} → {booking.deliveryLocation}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Clock size={16} color="#6B7280" />
                <Text style={styles.detailText}>
                  {booking.pickupTime} - {booking.deliveryTime}
                </Text>
              </View>
            </View>

            <View style={styles.bookingMeta}>
              <View style={styles.metaInfo}>
                <Text style={styles.metaText}>
                  {booking.luggageCount} items • {booking.serviceType.replace('-', ' ')}
                </Text>
                {booking.rating && (
                  <Text style={styles.ratingText}>★ {booking.rating}</Text>
                )}
              </View>
              <View style={styles.bookingActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Eye size={16} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <MessageCircle size={16} color="#3B82F6" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
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
  },
  filtersContainer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  filterTabActive: {
    backgroundColor: '#7C3AED',
  },
  filterTabText: {
    fontSize: 12,
    color: '#6B7280',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  bookingAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
  },
  bookingDetails: {
    marginBottom: 12,
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
  bookingMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaInfo: {
    flex: 1,
  },
  metaText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  ratingText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
    marginTop: 2,
  },
  bookingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});