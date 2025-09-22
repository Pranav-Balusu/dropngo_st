// Create this file at: services/pricingService.ts

// A mock function to simulate fetching pricing data from a server.
export const getCurrentPricing = async () => {
  console.log("Fetching pricing data...");
  // In a real app, you would fetch this from your backend or Supabase.
  const mockPricingData = {
    pickup: {
      small: 30,
      medium: 45,
      large: 65,
      'extra-large': 85,
    },
    basePickupFee: 100, // Base fee for any pickup
    perKmFee: 10,       // Price per kilometer
  };
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return mockPricingData;
};