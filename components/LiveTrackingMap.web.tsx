import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface LiveTrackingMapProps {
  visible: boolean;
  onClose: () => void;
  booking: any;
}

export default function LiveTrackingMap({ visible, onClose }: LiveTrackingMapProps) {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>Live tracking map is not available on the web.</Text>
        <TouchableOpacity onPress={onClose} style={styles.button}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#3B82F6',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
});