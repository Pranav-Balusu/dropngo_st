import 'react-native-url-polyfill/auto'; // Required for Supabase to work in React Native
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// Custom secure storage adapter for Expo
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// --- DATABASE TYPES ---
// These types are now consistent with your final database schema.

export interface User {
  id: string;
  email: string;
  phone?: string;
  full_name: string; // Changed from 'name'
  user_type: 'customer' | 'porter' | 'admin';
  address?: string;
  city?: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  is_active: boolean;
  rating: number;
  total_bookings: number;
  created_at: string;
  updated_at: string;
}

export interface PorterProfile {
  id: string;
  user_id: string;
  license_number: string;
  vehicle_type: string;
  vehicle_number: string;
  is_available: boolean;
  commission_rate: number;
  total_earnings: number;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  booking_number: string;
  user_id: string;
  porter_id?: string;
  service_type: 'pickup'; // Removed 'self-service'
  pickup_location: string;
  delivery_location: string;
  storage_hours: number;
  status: 'pending' | 'confirmed' | 'pickup-pending' | 'in-storage' | 'ready-for-delivery' | 'in-transit' | 'delivered' | 'cancelled';
  total_amount: number;
  storage_fee: number;
  delivery_fee: number;
  porter_commission: number;
  pickup_time?: string;
  delivery_time?: string;
  actual_pickup_time?: string;
  actual_delivery_time?: string;
  otp?: string;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
}

export interface LuggageItem {
  id: string;
  booking_id: string;
  luggage_size: 'small' | 'medium' | 'large' | 'extra-large';
  quantity: number;
  price_per_hour: number;
  total_price: number;
  created_at: string;
}

export interface LuggagePhoto {
  id: string;
  booking_id: string;
  photo_url: string;
  photo_type: 'original' | 'pickup_verification' | 'delivery_verification';
  uploaded_by: string;
  created_at: string;
}

export interface Pricing {
  id: string;
  service_type: 'pickup'; // Removed 'self-service'
  luggage_size: 'small' | 'medium' | 'large' | 'extra-large';
  price_per_hour: number;
  base_pickup_fee: number;
  per_km_fee: number;
  updated_at: string;
}