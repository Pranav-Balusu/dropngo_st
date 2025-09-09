import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { User, Mail, Phone, MapPin, Car, FileText, CreditCard as Edit, Bell, Shield, Star, Package, Clock, LogOut, Save } from 'lucide-react-native';

export default function PorterProfileScreen() {
  const [editing, setEditing] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [availability, setAvailability] = useState(true);
  
  const [porterProfile, setPorterProfile] = useState({
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    phone: '+91 98765 43210',
    address: '123 Main Street, Andheri West, Mumbai',
    licenseNumber: 'MH1420210045678',
    vehicleNumber: 'MH12AB1234',
    vehicleType: 'Motorcycle',
    rating: 4.8,
    totalDeliveries: 156,
    joinDate: 'December 2024',
    verificationStatus: 'verified',
  });

  const performanceStats = [
    { label: 'Total Deliveries', value: porterProfile.totalDeliveries, icon: Package, color: '#3B82F6' },
    { label: 'Average Rating', value: porterProfile.rating, icon: Star, color: '#F59E0B' },
    { label: 'Success Rate', value: '98.5%', icon: Clock, color: '#059669' },
  ];

  const handleSave = () => {
    setEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => router.push('/(auth)/login') }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#059669', '#047857']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitials}>
                {porterProfile.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <View style={[
              styles.verificationBadge,
              porterProfile.verificationStatus === 'verified' && styles.verifiedBadge
            ]}>
              <Text style={styles.verificationText}>
                {porterProfile.verificationStatus === 'verified' ? 'Verified' : 'Pending'}
              </Text>
            </View>
          </View>
          <Text style={styles.profileName}>{porterProfile.name}</Text>
          <Text style={styles.memberSince}>Porter since {porterProfile.joinDate}</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.availabilitySection}>
          <View style={styles.availabilityCard}>
            <Text style={styles.availabilityTitle}>Availability Status</Text>
            <View style={styles.availabilityToggle}>
              <Text style={styles.availabilityLabel}>
                {availability ? 'Available for Bookings' : 'Unavailable'}
              </Text>
              <Switch
                value={availability}
                onValueChange={setAvailability}
                trackColor={{ false: '#F3F4F6', true: '#DCFCE7' }}
                thumbColor={availability ? '#059669' : '#9CA3AF'}
              />
            </View>
          </View>
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Performance Stats</Text>
          <View style={styles.statsGrid}>
            {performanceStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                  <stat.icon size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Profile Information</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditing(!editing)}
            >
              <Edit size={16} color="#059669" />
              <Text style={styles.editButtonText}>
                {editing ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileForm}>
            <View style={styles.inputContainer}>
              <User size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled]}
                value={porterProfile.name}
                onChangeText={(text) => setPorterProfile(prev => ({ ...prev, name: text }))}
                editable={editing}
                placeholder="Full Name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputContainer}>
              <Mail size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled]}
                value={porterProfile.email}
                onChangeText={(text) => setPorterProfile(prev => ({ ...prev, email: text }))}
                editable={editing}
                placeholder="Email"
                keyboardType="email-address"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputContainer}>
              <Phone size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled]}
                value={porterProfile.phone}
                onChangeText={(text) => setPorterProfile(prev => ({ ...prev, phone: text }))}
                editable={editing}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputContainer}>
              <MapPin size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled]}
                value={porterProfile.address}
                onChangeText={(text) => setPorterProfile(prev => ({ ...prev, address: text }))}
                editable={editing}
                placeholder="Address"
                multiline
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputContainer}>
              <FileText size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={porterProfile.licenseNumber}
                editable={false}
                placeholder="License Number"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputContainer}>
              <Car size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled]}
                value={`${porterProfile.vehicleType} - ${porterProfile.vehicleNumber}`}
                onChangeText={(text) => {
                  const [type, number] = text.split(' - ');
                  setPorterProfile(prev => ({ 
                    ...prev, 
                    vehicleType: type || prev.vehicleType,
                    vehicleNumber: number || prev.vehicleNumber
                  }));
                }}
                editable={editing}
                placeholder="Vehicle Details"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {editing && (
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Save size={16} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Bell size={20} color="#6B7280" />
              <Text style={styles.settingText}>Push Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#F3F4F6', true: '#DCFCE7' }}
              thumbColor={notifications ? '#059669' : '#9CA3AF'}
            />
          </View>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Shield size={20} color="#6B7280" />
              <Text style={styles.menuItemText}>Security Settings</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <FileText size={20} color="#6B7280" />
              <Text style={styles.menuItemText}>Document Center</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#DC2626" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileInitials: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  verificationBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F59E0B',
  },
  verifiedBadge: {
    backgroundColor: '#059669',
  },
  verificationText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  memberSince: {
    fontSize: 14,
    color: '#E5E7EB',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  availabilitySection: {
    marginBottom: 24,
  },
  availabilityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  availabilityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  availabilityToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availabilityLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  profileSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editButtonText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '600',
  },
  profileForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#111827',
  },
  inputDisabled: {
    color: '#6B7280',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#111827',
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#111827',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
});