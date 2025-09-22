import { useEffect } from 'react';
import { Stack, router, useRootNavigationState, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

// --- BACKGROUND TASK IMPORTS ---
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { updatePorterLocation } from '@/services/locationService';

// --- BACKGROUND TASK DEFINITION FOR PORTER LOCATION TRACKING ---
// This code must be in the global scope (outside of any component).
const LOCATION_TASK_NAME = 'porterLocationTask';

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('TaskManager error:', error);
    return;
  }
  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    const currentLocation = locations[0];

    if (currentLocation) {
      // Get the current user session to find the porter's ID
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Find the associated porter_profile id from the user id
        const { data: porterProfile } = await supabase
          .from('porter_profiles')
          .select('id')
          .eq('user_id', session.user.id)
          .single();
        
        if (porterProfile) {
          await updatePorterLocation(
            porterProfile.id,
            {
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
              timestamp: new Date(currentLocation.timestamp).toISOString(),
            },
            undefined, // In a real app, you might fetch the current active booking ID
            'in-transit' // You can set the status based on the booking's state
          );
        }
      }
    }
  }
});


// --- ROOT LAYOUT COMPONENT ---
export default function RootLayout() {
  useFrameworkReady();
  
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key) return;

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const inAuthGroup = segments[0] === '(auth)';

        if (session) {
          const { data: userProfile } = await supabase
            .from('users')
            .select('user_type')
            .eq('id', session.user.id)
            .single();
          
          const userType = userProfile?.user_type;

          if (userType === 'admin') {
            router.replace('/(admin)');
          } else if (userType === 'porter') {
            router.replace('/(porter)');
          } else {
            router.replace('/(user)');
          }
        } else if (!session && !inAuthGroup) {
          router.replace('/(auth)/login');
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigationState?.key, segments]);

  if (!navigationState?.key) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(user)" />
        <Stack.Screen name="(admin)" />
        <Stack.Screen name="(porter)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}