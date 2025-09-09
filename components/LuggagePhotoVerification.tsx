import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { Camera, X, CircleCheck as CheckCircle, Eye } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

interface LuggagePhotoVerificationProps {
  visible: boolean;
  onClose: () => void;
  bookingId: string;
  originalPhotos: string[];
  onVerificationComplete: (verified: boolean) => void;
}

export default function LuggagePhotoVerification({ 
  visible, 
  onClose, 
  bookingId, 
  originalPhotos,
  onVerificationComplete 
}: LuggagePhotoVerificationProps) {
  const [currentPhotos, setCurrentPhotos] = useState<string[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'mismatch'>('pending');

  const takeVerificationPhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Camera permission is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setCurrentPhotos(prev => [...prev, result.assets[0].uri]);
    }
  };

  const handleVerification = () => {
    if (currentPhotos.length === 0) {
      Alert.alert('Error', 'Please take at least one verification photo');
      return;
    }

    // Simulate verification process
    const isVerified = Math.random() > 0.2; // 80% success rate for demo
    setVerificationStatus(isVerified ? 'verified' : 'mismatch');
    
    Alert.alert(
      isVerified ? 'Verification Successful' : 'Verification Failed',
      isVerified 
        ? 'Luggage matches original photos. You can proceed with delivery.'
        : 'Luggage does not match original photos. Please contact support.',
      [
        { 
          text: 'OK', 
          onPress: () => {
            onVerificationComplete(isVerified);
            if (isVerified) onClose();
          }
        }
      ]
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Luggage Verification</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <Text style={styles.bookingId}>Booking #{bookingId}</Text>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Original Photos (At Storage)</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
                {originalPhotos.map((photo, index) => (
                  <View key={index} style={styles.photoContainer}>
                    <Image source={{ uri: photo }} style={styles.photo} />
                    <Text style={styles.photoLabel}>Original {index + 1}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Verification Photos (At Delivery)</Text>
              <TouchableOpacity style={styles.cameraButton} onPress={takeVerificationPhoto}>
                <Camera size={24} color="#3B82F6" />
                <Text style={styles.cameraButtonText}>Take Verification Photo</Text>
              </TouchableOpacity>
              
              {currentPhotos.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
                  {currentPhotos.map((photo, index) => (
                    <View key={index} style={styles.photoContainer}>
                      <Image source={{ uri: photo }} style={styles.photo} />
                      <Text style={styles.photoLabel}>Current {index + 1}</Text>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>

            {verificationStatus !== 'pending' && (
              <View style={[
                styles.verificationResult,
                verificationStatus === 'verified' ? styles.verificationSuccess : styles.verificationError
              ]}>
                <CheckCircle size={20} color={verificationStatus === 'verified' ? '#059669' : '#DC2626'} />
                <Text style={[
                  styles.verificationText,
                  verificationStatus === 'verified' ? styles.verificationTextSuccess : styles.verificationTextError
                ]}>
                  {verificationStatus === 'verified' 
                    ? 'Luggage verified successfully!' 
                    : 'Luggage verification failed!'}
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={[
                styles.verifyButton,
                currentPhotos.length === 0 && styles.verifyButtonDisabled
              ]}
              onPress={handleVerification}
              disabled={currentPhotos.length === 0}
            >
              <Text style={styles.verifyButtonText}>Verify Luggage</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '95%',
    maxHeight: '90%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  bookingId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B82F6',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  photosContainer: {
    marginTop: 12,
  },
  photoContainer: {
    marginRight: 12,
    alignItems: 'center',
  },
  photo: {
    width: 120,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  photoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F8FF',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
  },
  cameraButtonText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
  verificationResult: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  verificationSuccess: {
    backgroundColor: '#DCFCE7',
  },
  verificationError: {
    backgroundColor: '#FEE2E2',
  },
  verificationText: {
    fontSize: 14,
    fontWeight: '600',
  },
  verificationTextSuccess: {
    color: '#059669',
  },
  verificationTextError: {
    color: '#DC2626',
  },
  modalFooter: {
    padding: 20,
  },
  verifyButton: {
    backgroundColor: '#059669',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  verifyButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});