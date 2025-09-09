/*
  # Initial Database Schema for DropNGo

  1. New Tables
    - `users` - User accounts (customers, porters, admins)
    - `bookings` - Luggage storage and delivery bookings
    - `luggage_items` - Individual luggage items in bookings
    - `luggage_photos` - Photos of luggage for verification
    - `locations` - Pickup and delivery locations
    - `pricing` - Dynamic pricing configuration
    - `porter_documents` - Porter verification documents
    - `reviews` - User reviews and ratings

  2. Security
    - Enable RLS on all tables
    - Add policies for user access control
    - Secure file uploads for photos and documents
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  phone text UNIQUE NOT NULL,
  name text NOT NULL,
  user_type text NOT NULL CHECK (user_type IN ('customer', 'porter', 'admin')),
  address text,
  city text,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  is_active boolean DEFAULT true,
  rating numeric(3,2) DEFAULT 0,
  total_bookings integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Porter specific information
CREATE TABLE IF NOT EXISTS porter_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  license_number text NOT NULL,
  vehicle_type text NOT NULL,
  vehicle_number text NOT NULL,
  is_available boolean DEFAULT true,
  commission_rate numeric(5,2) DEFAULT 20.00,
  total_earnings numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Porter documents for verification
CREATE TABLE IF NOT EXISTS porter_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  porter_id uuid REFERENCES porter_profiles(id) ON DELETE CASCADE,
  document_type text NOT NULL CHECK (document_type IN ('id_proof', 'license', 'vehicle_registration', 'vehicle_photo')),
  document_url text NOT NULL,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  latitude numeric(10,8),
  longitude numeric(11,8),
  is_popular boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Pricing configuration
CREATE TABLE IF NOT EXISTS pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type text NOT NULL CHECK (service_type IN ('self-service', 'pickup')),
  luggage_size text NOT NULL CHECK (luggage_size IN ('small', 'medium', 'large', 'extra-large')),
  price_per_hour numeric(6,2) NOT NULL,
  base_pickup_fee numeric(6,2) DEFAULT 20.00,
  per_km_fee numeric(6,2) DEFAULT 5.00,
  updated_at timestamptz DEFAULT now()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number text UNIQUE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  porter_id uuid REFERENCES porter_profiles(id),
  service_type text NOT NULL CHECK (service_type IN ('self-service', 'pickup')),
  pickup_location text NOT NULL,
  delivery_location text NOT NULL,
  storage_hours integer NOT NULL DEFAULT 1,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'pickup-pending', 'in-storage', 'ready-for-delivery', 'in-transit', 'delivered', 'cancelled')),
  total_amount numeric(8,2) NOT NULL,
  storage_fee numeric(8,2) NOT NULL,
  delivery_fee numeric(8,2) DEFAULT 0,
  porter_commission numeric(8,2) DEFAULT 0,
  pickup_time timestamptz,
  delivery_time timestamptz,
  actual_pickup_time timestamptz,
  actual_delivery_time timestamptz,
  otp text,
  special_instructions text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Luggage items in bookings
CREATE TABLE IF NOT EXISTS luggage_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  luggage_size text NOT NULL CHECK (luggage_size IN ('small', 'medium', 'large', 'extra-large')),
  quantity integer NOT NULL DEFAULT 1,
  price_per_hour numeric(6,2) NOT NULL,
  total_price numeric(8,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Luggage photos for verification
CREATE TABLE IF NOT EXISTS luggage_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  photo_type text NOT NULL CHECK (photo_type IN ('original', 'pickup_verification', 'delivery_verification')),
  uploaded_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Reviews and ratings
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id uuid REFERENCES users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- System settings
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value text NOT NULL,
  description text,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE porter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE porter_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE luggage_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE luggage_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for bookings
CREATE POLICY "Users can read own bookings" ON bookings
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT user_id FROM porter_profiles WHERE id = bookings.porter_id
  ));

CREATE POLICY "Users can create bookings" ON bookings
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings" ON bookings
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT user_id FROM porter_profiles WHERE id = bookings.porter_id
  ));

-- RLS Policies for luggage items
CREATE POLICY "Users can read luggage items for their bookings" ON luggage_items
  FOR SELECT TO authenticated
  USING (booking_id IN (
    SELECT id FROM bookings WHERE user_id = auth.uid() OR porter_id IN (
      SELECT id FROM porter_profiles WHERE user_id = auth.uid()
    )
  ));

-- RLS Policies for luggage photos
CREATE POLICY "Users can read photos for their bookings" ON luggage_photos
  FOR SELECT TO authenticated
  USING (booking_id IN (
    SELECT id FROM bookings WHERE user_id = auth.uid() OR porter_id IN (
      SELECT id FROM porter_profiles WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can upload photos for their bookings" ON luggage_photos
  FOR INSERT TO authenticated
  WITH CHECK (uploaded_by = auth.uid());

-- Insert default pricing
INSERT INTO pricing (service_type, luggage_size, price_per_hour) VALUES
  ('self-service', 'small', 3.5),
  ('self-service', 'medium', 4.5),
  ('self-service', 'large', 7.0),
  ('self-service', 'extra-large', 9.0),
  ('pickup', 'small', 3.0),
  ('pickup', 'medium', 5.0),
  ('pickup', 'large', 7.0),
  ('pickup', 'extra-large', 9.0);

-- Insert popular locations
INSERT INTO locations (name, address, city, is_popular) VALUES
  ('Mumbai Central Station', 'Mumbai Central Railway Station, Mumbai', 'Mumbai', true),
  ('Mumbai Airport Terminal 1', 'Chhatrapati Shivaji International Airport T1, Mumbai', 'Mumbai', true),
  ('Mumbai Airport Terminal 2', 'Chhatrapati Shivaji International Airport T2, Mumbai', 'Mumbai', true),
  ('Bandra Station', 'Bandra Railway Station, Mumbai', 'Mumbai', true),
  ('Andheri Station', 'Andheri Railway Station, Mumbai', 'Mumbai', true),
  ('Dadar Station', 'Dadar Railway Station, Mumbai', 'Mumbai', true),
  ('Churchgate Station', 'Churchgate Railway Station, Mumbai', 'Mumbai', true),
  ('CST Station', 'Chhatrapati Shivaji Terminus, Mumbai', 'Mumbai', true);

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
  ('max_bookings_per_day', '500', 'Maximum bookings allowed per day'),
  ('porter_commission_rate', '20', 'Default porter commission percentage'),
  ('auto_approval_enabled', 'false', 'Auto approve verified porters'),
  ('maintenance_mode', 'false', 'System maintenance mode'),
  ('base_pickup_fee', '20', 'Base pickup fee in rupees'),
  ('per_km_fee', '5', 'Per kilometer delivery fee in rupees');