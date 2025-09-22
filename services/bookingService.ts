import { supabase } from '@/lib/supabase';
import type { Booking, LuggageItem } from '@/lib/supabase';

export interface BookingDetails {
  serviceType: 'pickup'; // Removed 'self-service'
  pickupLocation: string;
  deliveryLocation: string;
  storageHours: number;
  luggageItems: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  luggagePhotos: string[]; // Assuming these are local URIs for upload
  totalItems: number;
  breakdown: {
    storage: number;
    delivery: number;
    total: number;
    hours: number;
  };
  insurance: boolean;
}

export const generateBookingNumber = (): string => {
  const prefix = 'DN';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

export const generateOTP = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const calculateDeliveryTime = (pickupTime: Date, storageHours: number): Date => {
  const deliveryTime = new Date(pickupTime);
  deliveryTime.setHours(deliveryTime.getHours() + storageHours + 1); // +1 hour for processing
  return deliveryTime;
};

export const processBooking = async (
  userId: string,
  bookingDetails: BookingDetails
): Promise<Booking> => {
  try {
    const bookingNumber = generateBookingNumber();
    const otp = generateOTP();
    const pickupTime = new Date();
    const deliveryTime = calculateDeliveryTime(pickupTime, bookingDetails.storageHours);

    // 1. Create the main booking record
    const { data: newBooking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        booking_number: bookingNumber,
        user_id: userId,
        service_type: 'pickup',
        pickup_location: bookingDetails.pickupLocation,
        delivery_location: bookingDetails.deliveryLocation,
        storage_hours: bookingDetails.storageHours,
        status: 'pending',
        total_amount: bookingDetails.breakdown.total,
        storage_fee: bookingDetails.breakdown.storage,
        delivery_fee: bookingDetails.breakdown.delivery,
        pickup_time: pickupTime.toISOString(),
        delivery_time: deliveryTime.toISOString(),
        otp: otp,
      })
      .select()
      .single();

    if (bookingError) throw bookingError;

    // 2. Create the associated luggage items
    const luggageItemsData: Omit<LuggageItem, 'id' | 'created_at'>[] = bookingDetails.luggageItems.map(item => ({
      booking_id: newBooking.id,
      luggage_size: item.id as 'small' | 'medium' | 'large' | 'extra-large',
      quantity: item.quantity,
      price_per_hour: item.price,
      total_price: item.price * item.quantity * bookingDetails.storageHours,
    }));
    
    const { error: itemsError } = await supabase.from('luggage_items').insert(luggageItemsData);
    if (itemsError) throw itemsError;

    // 3. TODO: Handle luggage photo uploads to Supabase Storage
    // For now, we'll just log them. In a real app, you would upload each photo
    // from bookingDetails.luggagePhotos and save the URL.
    console.log('Photo URIs to upload:', bookingDetails.luggagePhotos);

    return newBooking;
  } catch (error) {
    console.error('Error processing booking:', error);
    throw error;
  }
};

export const getBookingsByUser = async (userId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        luggage_items(*),
        luggage_photos(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

export const getBookingsByPorter = async (porterId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        luggage_items(*),
        luggage_photos(*),
        users!bookings_user_id_fkey(full_name, phone)
      `)
      .eq('porter_id', porterId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching porter bookings:', error);
    throw error;
  }
};

export const updateBookingStatus = async (
  bookingId: string,
  status: Booking['status'],
  additionalData?: Partial<Booking>
): Promise<void> => {
  try {
    const updateData = {
      status,
      updated_at: new Date().toISOString(),
      ...additionalData,
    };

    const { error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};