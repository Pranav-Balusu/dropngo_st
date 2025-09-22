import { supabase } from '@/lib/supabase';
import { Pricing } from '@/lib/supabase';

export type PricingConfig = {
  pickup: {
    small: number;
    medium: number;
    large: number;
    'extra-large': number;
  };
  basePickupFee: number;
  perKmFee: number;
};

// Fetches pricing from the database and formats it for the app
export const getCurrentPricing = async (): Promise<PricingConfig> => {
  console.log("Fetching pricing data from Supabase...");
  const { data, error } = await supabase.from('pricing').select('*');

  if (error) {
    console.error('Error fetching pricing:', error);
    throw error;
  }

  // Transform the array of prices into the structured object the app expects
  const config: PricingConfig = {
    pickup: {
      small: 0,
      medium: 0,
      large: 0,
      'extra-large': 0,
    },
    basePickupFee: 0,
    perKmFee: 0,
  };

  data.forEach((priceRow: Pricing) => {
    if (priceRow.service_type === 'pickup') {
      config.pickup[priceRow.luggage_size] = priceRow.price_per_hour;
      // Assume base fees are the same across all pickup rows for simplicity
      config.basePickupFee = priceRow.base_pickup_fee;
      config.perKmFee = priceRow.per_km_fee;
    }
  });

  return config;
};

// Updates the pricing configuration in the database
export const updatePricingConfig = async (pricing: PricingConfig) => {
  const upsertData = Object.entries(pricing.pickup).map(([size, price]) => ({
    service_type: 'pickup',
    luggage_size: size,
    price_per_hour: price,
    base_pickup_fee: pricing.basePickupFee,
    per_km_fee: pricing.perKmFee,
  }));

  const { error } = await supabase
    .from('pricing')
    .upsert(upsertData, { onConflict: 'service_type,luggage_size' });

  if (error) {
    console.error('Error updating pricing:', error);
    throw error;
  }
};