import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState, createContext, useContext } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

// Define the shape of the user profile
export type Profile = {
  id: string;
  full_name: string;
  role: 'admin' | 'porter' | 'user';
};

// Define the shape of the authentication context
type AuthData = {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  profileLoading: boolean;
};

// Create the authentication context
const AuthContext = createContext<AuthData>({
  session: null,
  profile: null,
  loading: true,
  profileLoading: true,
});

// The main layout component
export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    // Fetch the initial session
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    fetchSession();

    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setProfileLoading(false);
      setProfile(null);
      return;
    }

    setProfileLoading(true);
    const userEmail = session.user.email;

    // Hardcoded credentials logic
    if (userEmail === 'admin@dropngo.com') {
      setProfile({ id: session.user.id, full_name: 'Admin User', role: 'admin' });
      setProfileLoading(false);
    } else if (userEmail === 'porter@dropngo.com') {
      setProfile({ id: session.user.id, full_name: 'Porter User', role: 'porter' });
      setProfileLoading(false);
    } else if (userEmail === 'user@dropngo.com') {
      setProfile({ id: session.user.id, full_name: 'Sample User', role: 'user' });
      setProfileLoading(false);
    } else {
      // Fallback to database for other users
      const fetchProfile = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setProfile(data as Profile | null);
        setProfileLoading(false);
      };
      fetchProfile();
    }
  }, [session?.user]);

  return (
    <AuthContext.Provider value={{ session, profile, loading, profileLoading }}>
      <InitialLayout />
    </AuthContext.Provider>
  );
}

// Component to handle redirection logic
const InitialLayout = () => {
  const { session, profile, loading, profileLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading || profileLoading) {
      return; // Wait until session and profile are loaded
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (session && profile) {
      // User is logged in, redirect based on role
      const redirectPath =
        profile.role === 'admin' ? '/(admin)' :
        profile.role === 'porter' ? '/(porter)' :
        '/(user)';
      router.replace(redirectPath);
    } else if (!session && !inAuthGroup) {
      // User is not logged in and not in the auth flow, redirect to login
      router.replace('/(auth)/login');
    }
  }, [session, profile, loading, profileLoading, segments, router]);

  return <Slot />;
};

// Custom hook to easily access auth data
export const useAuth = () => useContext(AuthContext);