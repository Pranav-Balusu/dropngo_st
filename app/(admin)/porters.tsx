import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Filter, CircleCheck as CheckCircle, Circle as XCircle, Eye, Star, MapPin, Phone, Car, FileText, X, Package } from 'lucide-react-native';

export default function AdminPortersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPorter, setSelectedPorter] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const porters = [
    {
      id: 'P001',
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      city: 'Mumbai',
      status: 'pending',
      rating: 0,
      totalDeliveries: 0,
      vehicleType: 'Motorcycle',
      vehicleNumber: 'MH12AB1234',
      joinDate: '2025-01-10',
      documents: {
        idProof: 'https://images.pexels.com/photos/6963098/pexels-photo-6963098.jpeg',
        license: 'https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg',
        vehicleReg: 'https://images.pexels.com/photos/7688460/pexels-photo-7688460.jpeg',
      }
    },
    {
      id: 'P002',
      name: 'Priya Sharma',
      phone: '+91 87654 32109',
      city: 'Mumbai',
      status: 'verified',
      rating: 4.8,
      totalDeliveries: 156,
      vehicleType: 'Car',
      vehicleNumber: 'MH14CD5678',
      joinDate: '2024-12-15',
      documents: {
        idProof: 'https://images.pexels.com/photos/6963098/pexels-photo-6963098.jpeg',
        license: 'https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg',
        vehicleReg: 'https://images.pexels.com/photos/7688460/pexels-photo-7688460.jpeg',
      }
    },
    {
      id: 'P003',
      name: 'Amit Singh',
      phone: '+91 76543 21098',
      city: 'Mumbai',
      status: 'rejected',
      rating: 0,
      totalDeliveries: 0,
      vehicleType: 'Van',
      vehicleNumber: 'MH16EF9012',
      joinDate: '2025-01-08',
      documents: {
        idProof: 'https://images.pexels.com/photos/6963098/pexels-photo-6963098.jpeg',
        license: 'https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg',
        vehicleReg: 'https://images.pexels.com/photos/7688460/pexels-photo-7688460.jpeg',
      }
    },
  ];

  const filteredPorters = porters.filter(porter => {
    const matchesSearch = porter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         porter.phone.includes(searchQuery);
    const matchesFilter = filterStatus === 'all' || porter.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleVerifyPorter = (porterId: string, action: 'approve' | 'reject') => {
    const actionText = action === 'approve' ? 'approve' : 'reject';
    Alert.alert(
      'Confirm Action',
      `Are you sure you want to ${actionText} this porter?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: action === 'approve' ? 'Approve' : 'Reject',
          onPress: () => {
            Alert.alert('Success', `Porter ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
          }
        }
      ]
    );
  };

  const viewPorterDetails = (porter: any) => {
    setSelectedPorter(porter);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#7C3AED', '#5B21B6']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Porter Management</Text>
        <Text style={styles.headerSubtitle}>Verify and manage porter network</Text>
      </LinearGradient>

      <View style={styles.filtersContainer}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search porters..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        
        <View style={styles.filterTabs}>
          {['all', 'pending', 'verified', 'rejected'].map((status) => (
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
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredPorters.map((porter) => (
          <View key={porter.id} style={styles.porterCard}>
            <View style={styles.porterHeader}>
              <View style={styles.porterInfo}>
                <View style={styles.porterAvatar}>
                  <Text style={styles.porterInitials}>
                    {porter.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <View style={styles.porterDetails}>
                  <Text style={styles.porterName}>{porter.name}</Text>
                  <Text style={styles.porterPhone}>{porter.phone}</Text>
                  <View style={styles.porterMeta}>
                    <MapPin size={12} color="#6B7280" />
                    <Text style={styles.porterCity}>{porter.city}</Text>
                    <Text style={styles.separator}>•</Text>
                    <Car size={12} color="#6B7280" />
                    <Text style={styles.vehicleType}>{porter.vehicleType}</Text>
                  </View>
                </View>
              </View>
              
              <View style={[
                styles.statusBadge,
                porter.status === 'verified' && styles.statusVerified,
                porter.status === 'pending' && styles.statusPending,
                porter.status === 'rejected' && styles.statusRejected,
              ]}>
                <Text style={[
                  styles.statusText,
                  porter.status === 'verified' && styles.statusTextVerified,
                  porter.status === 'pending' && styles.statusTextPending,
                  porter.status === 'rejected' && styles.statusTextRejected,
                ]}>
                  {porter.status.toUpperCase()}
                </Text>
              </View>
            </View>

            {porter.status === 'verified' && (
              <View style={styles.porterStats}>
                <View style={styles.stat}>
                  <Star size={14} color="#F59E0B" />
                  <Text style={styles.statText}>{porter.rating} Rating</Text>
                </View>
                <View style={styles.stat}>
                  <Package size={14} color="#3B82F6" />
                  <Text style={styles.statText}>{porter.totalDeliveries} Deliveries</Text>
                </View>
              </View>
            )}

            <View style={styles.porterActions}>
              <TouchableOpacity
                style={styles.viewDetailsButton}
                onPress={() => viewPorterDetails(porter)}
              >
                <Eye size={16} color="#6B7280" />
                <Text style={styles.viewDetailsText}>View Details</Text>
              </TouchableOpacity>

              {porter.status === 'pending' && (
                <View style={styles.verificationActions}>
                  <TouchableOpacity
                    style={styles.approveButton}
                    onPress={() => handleVerifyPorter(porter.id, 'approve')}
                  >
                    <CheckCircle size={16} color="#FFFFFF" />
                    <Text style={styles.approveButtonText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => handleVerifyPorter(porter.id, 'reject')}
                  >
                    <XCircle size={16} color="#FFFFFF" />
                    <Text style={styles.rejectButtonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Porter Details</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {selectedPorter && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Personal Information</Text>
                  <View style={styles.modalField}>
                    <Text style={styles.modalLabel}>Name:</Text>
                    <Text style={styles.modalValue}>{selectedPorter.name}</Text>
                  </View>
                  <View style={styles.modalField}>
                    <Text style={styles.modalLabel}>Phone:</Text>
                    <Text style={styles.modalValue}>{selectedPorter.phone}</Text>
                  </View>
                  <View style={styles.modalField}>
                    <Text style={styles.modalLabel}>Vehicle:</Text>
                    <Text style={styles.modalValue}>{selectedPorter.vehicleType} - {selectedPorter.vehicleNumber}</Text>
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Documents</Text>
                  <View style={styles.documentsGrid}>
                    <View style={styles.documentItem}>
                      <Text style={styles.documentLabel}>ID Proof</Text>
                      <Image source={{ uri: selectedPorter.documents.idProof }} style={styles.documentImage} />
                    </View>
                    <View style={styles.documentItem}>
                      <Text style={styles.documentLabel}>Driving License</Text>
                      <Image source={{ uri: selectedPorter.documents.license }} style={styles.documentImage} />
                    </View>
                    <View style={styles.documentItem}>
                      <Text style={styles.documentLabel}>Vehicle Registration</Text>
                      <Image source={{ uri: selectedPorter.documents.vehicleReg }} style={styles.documentImage} />
                    </View>
                  </View>
                </View>

                {selectedPorter.status === 'pending' && (
                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={styles.modalApproveButton}
                      onPress={() => {
                        handleVerifyPorter(selectedPorter.id, 'approve');
                        setModalVisible(false);
                      }}
                    >
                      <CheckCircle size={20} color="#FFFFFF" />
                      <Text style={styles.modalApproveText}>Approve Porter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modalRejectButton}
                      onPress={() => {
                        handleVerifyPorter(selectedPorter.id, 'reject');
                        setModalVisible(false);
                      }}
                    >
                      <XCircle size={20} color="#FFFFFF" />
                      <Text style={styles.modalRejectText}>Reject Porter</Text>
                    </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  filterTabActive: {
    backgroundColor: '#7C3AED',
  },
  filterTabText: {
    fontSize: 14,
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
  porterCard: {
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
  porterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  porterInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  porterAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#7C3AED',
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
    marginBottom: 4,
  },
  porterPhone: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  porterMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  porterCity: {
    fontSize: 12,
    color: '#6B7280',
  },
  separator: {
    fontSize: 12,
    color: '#6B7280',
  },
  vehicleType: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusVerified: {
    backgroundColor: '#DCFCE7',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusRejected: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  statusTextVerified: {
    color: '#059669',
  },
  statusTextPending: {
    color: '#D97706',
  },
  statusTextRejected: {
    color: '#DC2626',
  },
  porterStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
  },
  porterActions: {
    flexDirection: 'row',
    gap: 8,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  viewDetailsText: {
    fontSize: 12,
    color: '#6B7280',
  },
  verificationActions: {
    flexDirection: 'row',
    gap: 8,
  },
  approveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  approveButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  rejectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  rejectButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
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
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  modalField: {
    marginBottom: 8,
  },
  modalLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  modalValue: {
    fontSize: 14,
    color: '#111827',
  },
  documentsGrid: {
    gap: 16,
  },
  documentItem: {
    alignItems: 'center',
  },
  documentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  documentImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalApproveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  modalApproveText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalRejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  modalRejectText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});