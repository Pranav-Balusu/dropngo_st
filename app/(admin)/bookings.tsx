import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Search,
  Package,
  MapPin,
  Clock,
  User,
  Eye,
  MessageCircle,
  Star,
  X
} from 'lucide-react-native';
type Booking = {
  id: string;
  user: string;
  porter: string;
  status: 'pending' | 'in-transit' | 'completed';
  pickupLocation: string;
  deliveryLocation: string;
  pickupTime: string;
  deliveryTime: string;
  amount: number;
  luggageCount: number;
  serviceType: 'pickup' | 'self-service';
  rating: number | null;
  luggage: { type: string; count: number }[];
  notes: string;
};

export default function AdminBookingsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

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
      luggage: [
        { type: 'Medium Suitcase', count: 1 },
        { type: 'Small Bag', count: 1 }
      ],
      notes: 'Handle with care. Customer will call before pickup.',
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
      luggage: [
        { type: 'Large Suitcase', count: 1 }
      ],
      notes: '',
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
      luggage: [
        { type: 'Small Bag', count: 2 },
        { type: 'Medium Suitcase', count: 1 }
      ],
      notes: 'Customer requested early delivery if possible.',
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
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    setSelectedBooking(booking);
                    setModalVisible(true);
                  }}
                >
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

      {/* Booking Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Booking Details</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            {selectedBooking && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Booking Info</Text>
                  <Text style={styles.modalField}><Text style={styles.modalLabel}>Booking ID:</Text> {selectedBooking.id}</Text>
                  <Text style={styles.modalField}><Text style={styles.modalLabel}>Status:</Text> {selectedBooking.status}</Text>
                  <Text style={styles.modalField}><Text style={styles.modalLabel}>Service:</Text> {selectedBooking.serviceType}</Text>
                  <Text style={styles.modalField}><Text style={styles.modalLabel}>Amount:</Text> ₹{selectedBooking.amount}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>User & Porter</Text>
                  <Text style={styles.modalField}><Text style={styles.modalLabel}>User:</Text> {selectedBooking.user}</Text>
                  <Text style={styles.modalField}><Text style={styles.modalLabel}>Porter:</Text> {selectedBooking.porter}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Locations & Time</Text>
                  <Text style={styles.modalField}><Text style={styles.modalLabel}>Pickup:</Text> {selectedBooking.pickupLocation} ({selectedBooking.pickupTime})</Text>
                  <Text style={styles.modalField}><Text style={styles.modalLabel}>Delivery:</Text> {selectedBooking.deliveryLocation} ({selectedBooking.deliveryTime})</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Luggage</Text>
                  {selectedBooking.luggage && selectedBooking.luggage.map((item: any, idx: number) => (
                    <Text key={idx} style={styles.modalField}>
                      <Text style={styles.modalLabel}>{item.type}:</Text> {item.count}
                    </Text>
                  ))}
                </View>
                {selectedBooking.notes ? (
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Notes</Text>
                    <Text style={styles.modalField}>{selectedBooking.notes}</Text>
                  </View>
                ) : null}
                {selectedBooking.rating && (
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Rating</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Star size={18} color="#F59E0B" />
                      <Text style={styles.modalField}>{selectedBooking.rating} / 5</Text>
                    </View>
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  modalSection: {
    marginBottom: 18,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  modalField: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  modalLabel:{ fontWeight: '600',
    color: '#6B7280',
  },
});