/*
  # Add location tracking tables

  1. New Tables
    - `porter_locations`
      - `porter_id` (uuid, references porter_profiles)
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `address` (text)
      - `booking_id` (uuid, references bookings, optional)
      - `status` (text)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `porter_locations` table
    - Add policies for porters to update their own location
    - Add policies for users to read porter locations for their bookings
*/

CREATE TABLE IF NOT EXISTS porter_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  porter_id uuid REFERENCES porter_profiles(id) ON DELETE CASCADE,
  latitude numeric(10,8) NOT NULL,
  longitude numeric(11,8) NOT NULL,
  address text,
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'available',
  updated_at timestamptz DEFAULT now(),
  UNIQUE(porter_id)
);

ALTER TABLE porter_locations ENABLE ROW LEVEL SECURITY;

-- Porter can update their own location
CREATE POLICY "Porters can update own location"
  ON porter_locations
  FOR ALL
  TO authenticated
  USING (
    porter_id IN (
      SELECT id FROM porter_profiles 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    porter_id IN (
      SELECT id FROM porter_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Users can read porter locations for their bookings
CREATE POLICY "Users can read porter locations for their bookings"
  ON porter_locations
  FOR SELECT
  TO authenticated
  USING (
    booking_id IN (
      SELECT id FROM bookings 
      WHERE user_id = auth.uid()
    )
    OR
    porter_id IN (
      SELECT porter_id FROM bookings 
      WHERE user_id = auth.uid()
    )
  );

-- Add status constraint
ALTER TABLE porter_locations 
ADD CONSTRAINT porter_locations_status_check 
CHECK (status IN ('available', 'pickup-pending', 'in-transit', 'at-delivery'));

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_porter_locations_porter_id ON porter_locations(porter_id);
CREATE INDEX IF NOT EXISTS idx_porter_locations_booking_id ON porter_locations(booking_id);
CREATE INDEX IF NOT EXISTS idx_porter_locations_status ON porter_locations(status);