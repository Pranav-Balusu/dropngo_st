import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
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
  Eye,
  Package,
  LogOut
} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { User } from '@/lib/supabase'; // Import the User type

export default function UserHomeScreen() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // --- ADDED: useEffect to fetch the logged-in user's data ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Fetch full profile from your 'users' table
          const { data: userProfile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) throw error;
          setCurrentUser(userProfile);
        }
      } catch (e) {
        console.error('Error fetching user data:', e);
        Alert.alert('Error', 'Failed to fetch user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // The root layout will handle the redirect automatically
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#3B82F6', '#1E40AF']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Welcome, {currentUser?.full_name || 'Guest'}!</Text>
            <Text style={styles.location}>📍 {currentUser?.city || 'Vijayawada'}</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <LogOut size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Package size={24} color="#FFFFFF" />
                <Text style={styles.statNumber}>{currentUser?.total_bookings || 0}</Text>
                <Text style={styles.statLabel}>Total Bookings</Text>
              </View>
              <View style={styles.statCard}>
                <Star size={24} color="#FFFFFF" />
                <Text style={styles.statNumber}>{currentUser?.rating || 'N/A'}</Text>
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
          
          {/* Add recent bookings section here if desired */}

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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
});