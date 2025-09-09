import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
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
  service_type: 'self-service' | 'pickup';
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
  service_type: 'self-service' | 'pickup';
  luggage_size: 'small' | 'medium' | 'large' | 'extra-large';
  price_per_hour: number;
  base_pickup_fee: number;
  per_km_fee: number;
  updated_at: string;
}

// Auth functions
export const signUp = async (email: string, password: string, userData: Partial<User>) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  if (data.user) {
    const { error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: data.user.id,
          email,
          ...userData,
        },
      ]);

    if (profileError) throw profileError;
  }

  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Booking functions
export const createBooking = async (bookingData: Partial<Booking>, luggageItems: Partial<LuggageItem>[], photos: string[]) => {
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert([bookingData])
    .select()
    .single();

  if (bookingError) throw bookingError;

  // Insert luggage items
  const luggageItemsWithBookingId = luggageItems.map(item => ({
    ...item,
    booking_id: booking.id,
  }));

  const { error: itemsError } = await supabase
    .from('luggage_items')
    .insert(luggageItemsWithBookingId);

  if (itemsError) throw itemsError;

  // Insert photos
  const photosWithBookingId = photos.map(photo => ({
    booking_id: booking.id,
    photo_url: photo,
    photo_type: 'original',
    uploaded_by: bookingData.user_id,
  }));

  const { error: photosError } = await supabase
    .from('luggage_photos')
    .insert(photosWithBookingId);

  if (photosError) throw photosError;

  return booking;
};

// Pricing functions
export const getPricing = async () => {
  const { data, error } = await supabase
    .from('pricing')
    .select('*');

  if (error) throw error;
  return data;
};

export const updatePricing = async (pricingData: Partial<Pricing>[]) => {
  const { data, error } = await supabase
    .from('pricing')
    .upsert(pricingData, { onConflict: 'service_type,luggage_size' });

  if (error) throw error;
  return data;
};

// Porter functions
export const createPorterProfile = async (porterData: Partial<PorterProfile>, documents: { type: string; url: string }[]) => {
  const { data: porter, error: porterError } = await supabase
    .from('porter_profiles')
    .insert([porterData])
    .select()
    .single();

  if (porterError) throw porterError;

  // Insert documents
  const documentsWithPorterId = documents.map(doc => ({
    porter_id: porter.id,
    document_type: doc.type,
    document_url: doc.url,
  }));

  const { error: docsError } = await supabase
    .from('porter_documents')
    .insert(documentsWithPorterId);

  if (docsError) throw docsError;

  return porter;
};

// File upload function
export const uploadFile = async (file: any, bucket: string, path: string) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file);

  if (error) throw error;
  return data;
};

export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
};