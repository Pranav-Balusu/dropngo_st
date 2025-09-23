import { useEffect } from 'react';
import { Stack, router, useRootNavigationState, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { updatePorterLocation } from '@/services/locationService';

// --- BACKGROUND TASK DEFINITION ---
const LOCATION_TASK_NAME = 'porterLocationTask';
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) { console.error('TaskManager error:', error); return; }
  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    if (locations[0]) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: porterProfile } = await supabase
          .from('porter_profiles').select('id').eq('user_id', session.user.id).single();
        if (porterProfile) {
          await updatePorterLocation(porterProfile.id, {
            latitude: locations[0].coords.latitude,
            longitude: locations[0].coords.longitude,
            timestamp: new Date(locations[0].timestamp).toISOString(),
          }, undefined, 'in-transit');
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
        const currentGroup = `(${segments[0] || ''})`;
        const inAuthGroup = currentGroup === '(auth)';

        if (session) {
          const { data: userProfile } = await supabase
            .from('users').select('user_type').eq('id', session.user.id).single();
          
          const userType = userProfile?.user_type;
          
          // Redirect to the correct tab group based on the user's role.
          // This is the correct logic for handling redirection after login.
          if (userType === 'admin' && currentGroup !== '(admin)') {
            router.replace('/(admin)');
          } else if (userType === 'porter' && currentGroup !== '(porter)') {
            router.replace('/(porter)');
          } else if (userType === 'customer' && currentGroup !== '(user)') {
            router.replace('/(user)');
          }

        } else if (!inAuthGroup) {
          // User is signed out and not on a login/register screen.
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