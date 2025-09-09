import React, { useEffect } from 'react';
import { router } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Luggage } from 'lucide-react-native';

export default function SplashScreen() {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to login after splash screen
    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#3B82F6', '#1E40AF', '#7C3AED']}
        style={styles.gradient}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <View style={styles.logoContainer}>
            <Luggage size={80} color="#FFFFFF" />
            <Text style={styles.title}>DropNGo</Text>
            <Text style={styles.subtitle}>Smart Luggage Cloak & Delivery</Text>
          </View>
          
          <View style={styles.loadingContainer}>
            <Animated.View style={styles.loadingDot} />
            <Animated.View style={[styles.loadingDot, { animationDelay: '0.2s' }]} />
            <Animated.View style={[styles.loadingDot, { animationDelay: '0.4s' }]} />
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 64,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 24,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: '#E5E7EB',
    marginTop: 12,
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    opacity: 0.6,
  },
});