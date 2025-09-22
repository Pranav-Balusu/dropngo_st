import { useEffect } from 'react';
import { Stack, router, useRootNavigationState, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { supabase } from '@/lib/supabase';

// Note: I'm assuming useFrameworkReady() is a custom hook you need.
// If not, you can safely remove it.
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady(); // Kept your custom hook
  
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    // If the navigation state is not ready yet, do nothing.
    if (!navigationState?.key) return;

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const inAuthGroup = segments[0] === '(auth)';

        if (session) {
          // User is signed in, fetch their role.
          const { data: userProfile } = await supabase
            .from('users')
            .select('user_type')
            .eq('id', session.user.id)
            .single();
          
          const userType = userProfile?.user_type;

          // Navigate to the correct stack based on the user's role.
          if (userType === 'admin') {
            router.replace('/(admin)');
          } else if (userType === 'porter') {
            router.replace('/(porter)');
          } else {
            router.replace('/(user)');
          }
        } else if (!session && !inAuthGroup) {
          // User is signed out and not in the auth group, so redirect to login.
          router.replace('/(auth)/login');
        }
      }
    );

    // Cleanup the listener when the component unmounts
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigationState?.key, segments]); // Rerun the effect when navigation is ready or segments change

  // Show a loading indicator while we determine the auth state.
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
        {/* Define all your top-level layouts (route groups) here */}
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