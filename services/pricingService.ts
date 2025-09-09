import { supabase, getPricing, updatePricing, Pricing } from '@/lib/supabase';

export interface PricingConfig {
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
}

let cachedPricing: PricingConfig | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getCurrentPricing = async (): Promise<PricingConfig> => {
  const now = Date.now();
  
  // Return cached pricing if still valid
  if (cachedPricing && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedPricing;
  }

  try {
    const pricingData = await getPricing();
    
    const config: PricingConfig = {
      'self-service': {
        small: 3.5,
        medium: 4.5,
        large: 7.0,
        'extra-large': 9.0,
      },
      pickup: {
        small: 3.0,
        medium: 5.0,
        large: 7.0,
        'extra-large': 9.0,
      },
      basePickupFee: 20,
      perKmFee: 5,
    };

    // Update config with database values
    pricingData.forEach((item: Pricing) => {
      if (item.service_type in config) {
        config[item.service_type][item.luggage_size] = item.price_per_hour;
      }
      config.basePickupFee = item.base_pickup_fee;
      config.perKmFee = item.per_km_fee;
    });

    cachedPricing = config;
    lastFetchTime = now;
    
    return config;
  } catch (error) {
    console.error('Error fetching pricing:', error);
    
    // Return default pricing if database fetch fails
    return {
      'self-service': {
        small: 3.5,
        medium: 4.5,
        large: 7.0,
        'extra-large': 9.0,
      },
      pickup: {
        small: 3.0,
        medium: 5.0,
        large: 7.0,
        'extra-large': 9.0,
      },
      basePickupFee: 20,
      perKmFee: 5,
    };
  }
};

export const updatePricingConfig = async (newPricing: Partial<PricingConfig>): Promise<void> => {
  try {
    const pricingUpdates: Partial<Pricing>[] = [];

    // Update service pricing
    if (newPricing['self-service']) {
      Object.entries(newPricing['self-service']).forEach(([size, price]) => {
        pricingUpdates.push({
          service_type: 'self-service',
          luggage_size: size as 'small' | 'medium' | 'large' | 'extra-large',
          price_per_hour: price,
        });
      });
    }

    if (newPricing.pickup) {
      Object.entries(newPricing.pickup).forEach(([size, price]) => {
        pricingUpdates.push({
          service_type: 'pickup',
          luggage_size: size as 'small' | 'medium' | 'large' | 'extra-large',
          price_per_hour: price,
        });
      });
    }

    // Update base fees
    if (newPricing.basePickupFee !== undefined || newPricing.perKmFee !== undefined) {
      pricingUpdates.forEach(update => {
        if (newPricing.basePickupFee !== undefined) {
          update.base_pickup_fee = newPricing.basePickupFee;
        }
        if (newPricing.perKmFee !== undefined) {
          update.per_km_fee = newPricing.perKmFee;
        }
      });
    }

    await updatePricing(pricingUpdates);
    
    // Clear cache to force refresh
    cachedPricing = null;
    lastFetchTime = 0;
  } catch (error) {
    console.error('Error updating pricing:', error);
    throw error;
  }
};

export const calculateBookingPrice = (
  serviceType: 'self-service' | 'pickup',
  luggageItems: Array<{ size: string; quantity: number }>,
  storageHours: number,
  hasDelivery: boolean = false,
  pricing: PricingConfig
): { storage: number; delivery: number; total: number } => {
  // Calculate storage cost
  const storageCost = luggageItems.reduce((total, item) => {
    const sizeKey = item.size as keyof PricingConfig['self-service'];
    const pricePerHour = pricing[serviceType][sizeKey] || 0;
    return total + (pricePerHour * item.quantity * storageHours);
  }, 0);

  // Calculate delivery cost
  let deliveryCost = 0;
  if (serviceType === 'pickup') {
    deliveryCost = pricing.basePickupFee; // Full pickup + delivery service
  } else if (serviceType === 'self-service' && hasDelivery) {
    deliveryCost = pricing.basePickupFee / 2; // Only delivery for self-service
  }

  return {
    storage: storageCost,
    delivery: deliveryCost,
    total: storageCost + deliveryCost,
  };
};

// Real-time pricing updates
export const subscribeToPricingUpdates = (callback: (pricing: PricingConfig) => void) => {
  const subscription = supabase
    .channel('pricing-updates')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'pricing' 
      }, 
      async () => {
        // Clear cache and fetch new pricing
        cachedPricing = null;
        lastFetchTime = 0;
        const newPricing = await getCurrentPricing();
        callback(newPricing);
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
};