import React, { useState, useEffect } from 'react';
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
import { getCurrentPricing, updatePricingConfig } from '@/services/pricingService';
import { 
  Settings,
  IndianRupee,
  MapPin,
  Bell,
  Shield,
  Database,
  Users,
  LogOut,
  Save,
  Plus,
  Building
} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

// Assuming you have this type defined in '@/types/pricing.ts'
type PricingConfig = {
  'self-service': {
    small: number;
    medium: number;
    large: number;
    'extra-large': number;
  };
  pickup: {
    small: number;
    medium: number;
    large: number;
    'extra-large': number;
  };
  basePickupFee: number;
  perKmFee: number;
};

export default function AdminSettingsScreen() {
  const [pricing, setPricing] = useState<PricingConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const [systemSettings, setSystemSettings] = useState({
    maxBookingsPerDay: 500,
    porterCommission: 20,
    autoApprovalEnabled: false,
    maintenanceMode: false,
    notificationsEnabled: true,
    basePickupFee: 20,
    perKmFee: 5,
  });

  const [hubs, setHubs] = useState([
    { id: 'HUB001', name: 'Varanasi Junction Hub', location: 'Platform 1 Exit', lockers: 50, active: true },
    { id: 'HUB002', name: 'Dashashwamedh Ghat Hub', location: 'Near Main Ghat', lockers: 30, active: true },
    { id: 'HUB003', name: 'Kashi Vishwanath Hub', location: 'Temple Complex', lockers: 40, active: true },
    { id: 'HUB004', name: 'Varanasi Airport Hub', location: 'Departure Terminal', lockers: 25, active: false },
  ]);

  useEffect(() => {
    loadPricing();
  }, []);

  const loadPricing = async () => {
    try {
      const currentPricing = await getCurrentPricing();
      if (currentPricing) {
        setPricing(currentPricing);
      }
    } catch (error) {
      console.error('Error loading pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePricing = async () => {
    if (!pricing) return;
    
    try {
      await updatePricingConfig(pricing);
      Alert.alert('Success', 'Pricing updated successfully!');
    } catch (error) {
      console.error('Error updating pricing:', error);
      Alert.alert('Error', 'Failed to update pricing. Please try again.');
    }
  };

  const handleSaveSettings = async () => {
    try {
      console.log('Saving system settings:', systemSettings);
      Alert.alert('Success', 'System settings updated successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    }
  };

  const handleAddHub = () => {
    Alert.alert(
      'Add New Hub',
      'Enter hub details',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add Hub', onPress: () => Alert.alert('Success', 'New hub added successfully!') }
      ]
    );
  };

  const toggleHubStatus = (hubId: string) => {
    setHubs(prev => prev.map(hub => 
      hub.id === hubId ? { ...hub, active: !hub.active } : hub
    ));
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
            } catch (logoutError) {
              console.error('Logout error:', logoutError);
              Alert.alert('Error', 'An unexpected error occurred during logout.');
            }
          }
        }
      ]
    );
  };

  if (loading || !pricing) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#7C3AED', '#5B21B6']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Loading...</Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#7C3AED', '#5B21B6']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>System Settings</Text>
        <Text style={styles.headerSubtitle}>Configure DropNGo operations</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Building size={20} color="#7C3AED" />
            <Text style={styles.sectionTitle}>Hub Management</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAddHub}>
              <Plus size={16} color="#7C3AED" />
              <Text style={styles.addButtonText}>Add Hub</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.hubsContainer}>
            {hubs.map((hub) => (
              <View key={hub.id} style={styles.hubCard}>
                <View style={styles.hubInfo}>
                  <Text style={styles.hubName}>{hub.name}</Text>
                  <Text style={styles.hubLocation}>{hub.location}</Text>
                  <Text style={styles.hubLockers}>{hub.lockers} lockers</Text>
                </View>
                <Switch
                  value={hub.active}
                  onValueChange={() => toggleHubStatus(hub.id)}
                  trackColor={{ false: '#F3F4F6', true: '#DCFCE7' }}
                  thumbColor={hub.active ? '#059669' : '#9CA3AF'}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IndianRupee size={20} color="#7C3AED" />
            <Text style={styles.sectionTitle}>Pricing Configuration</Text>
          </View>
          
          <View style={styles.pricingContainer}>
            <Text style={styles.pricingSubtitle}>Self-Service Rates (per hour)</Text>
            <View style={styles.pricingGrid}>
              {Object.entries(pricing['self-service']).map(([size, price]) => (
                <View key={size} style={styles.pricingItem}>
                  <Text style={styles.pricingLabel}>
                    {size.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </Text>
                  <View style={styles.pricingInputContainer}>
                    <Text style={styles.currencySymbol}>₹</Text>
                    <TextInput
                      style={styles.pricingInput}
                      value={Math.round(price as number).toString()}
                      onChangeText={(text) => 
                        setPricing(prev => {
                          if (!prev) return null;
                          return {
                            ...prev,
                            'self-service': { ...prev['self-service'], [size]: parseInt(text) || 0 }
                          };
                        })
                      }
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              ))}
            </View>

            <Text style={styles.pricingSubtitle}>Pickup Service Rates (per hour)</Text>
            <View style={styles.pricingGrid}>
              {Object.entries(pricing.pickup).map(([size, price]) => (
                <View key={size} style={styles.pricingItem}>
                  <Text style={styles.pricingLabel}>
                    {size.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </Text>
                  <View style={styles.pricingInputContainer}>
                    <Text style={styles.currencySymbol}>₹</Text>
                    <TextInput
                      style={styles.pricingInput}
                      value={Math.round(price as number).toString()}
                      onChangeText={(text) => 
                        setPricing(prev => {
                          if (!prev) return null;
                          return {
                            ...prev,
                            pickup: { ...prev.pickup, [size]: parseInt(text) || 0 }
                          };
                        })
                      }
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              ))}
            </View>

            <Text style={styles.pricingSubtitle}>Pickup & Delivery Charges</Text>
            <View style={styles.deliveryPricing}>
              <View style={styles.deliveryItem}>
                <Text style={styles.deliveryLabel}>Base Fee:</Text>
                <View style={styles.pricingInputContainer}>
                  <Text style={styles.currencySymbol}>₹</Text>
                  <TextInput
                    style={styles.pricingInput}
                    value={Math.round(pricing.basePickupFee).toString()}
                    onChangeText={(text) => 
                      setPricing(prev => {
                        if (!prev) return null;
                        return {
                          ...prev,
                          basePickupFee: parseInt(text) || 0
                        };
                      })
                    }
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <View style={styles.deliveryItem}>
                <Text style={styles.deliveryLabel}>Per KM:</Text>
                <View style={styles.pricingInputContainer}>
                  <Text style={styles.currencySymbol}>₹</Text>
                  <TextInput
                    style={styles.pricingInput}
                    value={Math.round(pricing.perKmFee).toString()}
                    onChangeText={(text) => 
                      setPricing(prev => {
                        if (!prev) return null;
                        return {
                          ...prev,
                          perKmFee: parseInt(text) || 0
                        };
                      })
                    }
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSavePricing}>
              <Save size={16} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Save Pricing</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Settings size={20} color="#7C3AED" />
            <Text style={styles.sectionTitle}>System Configuration</Text>
          </View>

          <View style={styles.settingsContainer}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Max Bookings per Day</Text>
                <Text style={styles.settingDescription}>System capacity limit</Text>
              </View>
              <TextInput
                style={styles.settingInput}
                value={systemSettings.maxBookingsPerDay.toString()}
                onChangeText={(text) => 
                  setSystemSettings(prev => ({
                    ...prev,
                    maxBookingsPerDay: parseInt(text) || 0
                  }))
                }
                keyboardType="numeric"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Porter Commission (%)</Text>
                <Text style={styles.settingDescription}>Percentage of booking amount</Text>
              </View>
              <TextInput
                style={styles.settingInput}
                value={systemSettings.porterCommission.toString()}
                onChangeText={(text) => 
                  setSystemSettings(prev => ({
                    ...prev,
                    porterCommission: parseInt(text) || 0
                  }))
                }
                keyboardType="numeric"
              />
            </View>

            <View style={styles.switchItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Auto Porter Approval</Text>
                <Text style={styles.settingDescription}>Automatically approve verified porters</Text>
              </View>
              <Switch
                value={systemSettings.autoApprovalEnabled}
                onValueChange={(value) => 
                  setSystemSettings(prev => ({ ...prev, autoApprovalEnabled: value }))
                }
                trackColor={{ false: '#F3F4F6', true: '#DBEAFE' }}
                thumbColor={systemSettings.autoApprovalEnabled ? '#7C3AED' : '#9CA3AF'}
              />
            </View>

            <View style={styles.switchItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Maintenance Mode</Text>
                <Text style={styles.settingDescription}>Temporarily disable new bookings</Text>
              </View>
              <Switch
                value={systemSettings.maintenanceMode}
                onValueChange={(value) => 
                  setSystemSettings(prev => ({ ...prev, maintenanceMode: value }))
                }
                trackColor={{ false: '#F3F4F6', true: '#FEE2E2' }}
                thumbColor={systemSettings.maintenanceMode ? '#DC2626' : '#9CA3AF'}
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
              <Save size={16} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Save Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#DC2626" />
          <Text style={styles.logoutText}>Admin Logout</Text>
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
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '600',
  },
  hubsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  hubCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  hubInfo: {
    flex: 1,
  },
  hubName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  hubLocation: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  hubLockers: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  pricingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  pricingSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  pricingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  pricingItem: {
    width: '48%',
    alignItems: 'center',
  },
  pricingLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  pricingInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
  },
  currencySymbol: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 4,
  },
  pricingInput: {
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
    minWidth: 40,
    textAlign: 'center',
  },
  deliveryPricing: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  deliveryItem: {
    flex: 1,
    alignItems: 'center',
  },
  deliveryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  settingsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  switchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  settingInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#F9FAFB',
    minWidth: 80,
    textAlign: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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