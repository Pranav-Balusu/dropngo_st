import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
import { X, Phone, MessageCircle, Truck } from 'lucide-react-native';

interface LiveTrackingMapProps {
  visible: boolean;
  onClose: () => void;
  booking: {
    id: string;
    porter: {
      name: string;
      phone: string;
      currentLocation: {
        latitude: number;
        longitude: number;
      };
    };
    pickupLocation: {
      latitude: number;
      longitude: number;
      address: string;
    };
    deliveryLocation: {
      latitude: number;
      longitude: number;
      address: string;
    };
    status: string;
  };
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

export default function LiveTrackingMap({ visible, onClose, booking }: LiveTrackingMapProps) {
  const [porterLocation, setPorterLocation] = useState({
    lat: booking.porter.currentLocation.latitude,
    lng: booking.porter.currentLocation.longitude,
  });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  // Simulate porter's live movement
  useEffect(() => {
    const interval = setInterval(() => {
      setPorterLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001,
      }));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    return status.includes('delivery') ? '#059669' : '#3B82F6';
  };

  const getRouteCoordinates = () => {
    const destination = booking.status.includes('delivery') 
      ? booking.deliveryLocation 
      : booking.pickupLocation;
      
    return [
      { lat: porterLocation.lat, lng: porterLocation.lng },
      { lat: destination.latitude, lng: destination.longitude },
    ];
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Live Tracking</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={24} color="#6B7280" />
            </TouchableOpacity>
        </View>

        <View style={styles.mapWrapper}>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={porterLocation}
              zoom={14}
            >
              {/* Porter Marker */}
              <Marker 
                position={porterLocation} 
                title={booking.porter.name} 
                icon={{
                  path: 'M20.9,13.9c-0.3-0.5-0.8-0.8-1.4-0.8H15V10c0-0.6-0.4-1-1-1h- симптомы-3c-0.6,0-1,0.4-1,1v3H4.5c-0.6,0-1.2,0.4-1.4,0.8L2,18v5h2v-2h16v2h2v-5L20.9,13.9z M7.5,15C6.7,15,6,14.3,6,13.5S6.7,12,7.5,12S9,12.7,9,13.5S8.3,15,7.5,15z M16.5,15c-0.8,0-1.5-0.7-1.5-1.5s0.7-1.5,1.5-1.5s1.5,0.7,1.5,1.5S17.3,15,16.5,15z',
                  fillColor: getStatusColor(booking.status),
                  fillOpacity: 1,
                  strokeWeight: 0,
                  scale: 1.5,
                  anchor: new google.maps.Point(12, 12)
                }}
              />
              {/* Delivery Location Marker */}
              <Marker
                position={{ lat: booking.deliveryLocation.latitude, lng: booking.deliveryLocation.longitude }}
                title="Delivery Location"
              />
              {/* Pickup Location Marker */}
              <Marker
                position={{ lat: booking.pickupLocation.latitude, lng: booking.pickupLocation.longitude }}
                title="Pickup Location"
              />
              {/* Route Polyline */}
              <Polyline
                path={getRouteCoordinates()}
                options={{
                  strokeColor: getStatusColor(booking.status),
                  strokeOpacity: 0.8,
                  strokeWeight: 4,
                }}
              />
            </GoogleMap>
          ) : (
            <Text>Loading Map...</Text>
          )}
        </View>

        <View style={styles.infoPanel}>
            <Text style={styles.porterName}>{booking.porter.name}</Text>
            <Text style={styles.porterPhone}>{booking.porter.phone}</Text>
            <View style={styles.porterActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Phone size={20} color="#3B82F6" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MessageCircle size={20} color="#3B82F6" />
              </TouchableOpacity>
            </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    paddingTop: 50, // For web safe area
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  mapWrapper: {
    flex: 1,
  },
  infoPanel: {
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  porterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  porterPhone: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 16,
  },
  porterActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});