import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { User, Mail, Lock, Phone, MapPin, Eye, EyeOff, Upload, Car, FileText, Camera, CircleCheck as CheckCircle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function PorterRegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    licenseNumber: '',
    vehicleNumber: '',
    vehicleType: '',
  });
  const [documents, setDocuments] = useState({
    idProof: null as string | null,
    licensePhoto: null as string | null,
    vehicleRegistration: null as string | null,
    vehiclePhoto: null as string | null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const pickImage = async (documentType: keyof typeof documents) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setDocuments(prev => ({
        ...prev,
        [documentType]: result.assets[0].uri,
      }));
    }
  };

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!documents.idProof || !documents.licensePhoto || !documents.vehicleRegistration) {
      Alert.alert('Error', 'Please upload all required documents');
      return;
    }

    setLoading(true);
    try {
      // Simulate registration - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert(
        'Registration Submitted', 
        'Your porter registration has been submitted for verification. You will be notified once approved.',
        [{ text: 'OK', onPress: () => router.push('/(auth)/login') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#059669', '#047857']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.title}>Porter Registration</Text>
              <Text style={styles.subtitle}>Join our verified porter network</Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              
              <View style={styles.inputContainer}>
                <User size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name *"
                  value={formData.name}
                  onChangeText={(text) => updateFormData('name', text)}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputContainer}>
                <Mail size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address *"
                  value={formData.email}
                  onChangeText={(text) => updateFormData('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputContainer}>
                <Phone size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChangeText={(text) => updateFormData('phone', text)}
                  keyboardType="phone-pad"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputContainer}>
                <MapPin size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Complete Address *"
                  value={formData.address}
                  onChangeText={(text) => updateFormData('address', text)}
                  multiline
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <Text style={styles.sectionTitle}>Vehicle Information</Text>

              <View style={styles.inputContainer}>
                <FileText size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Driving License Number *"
                  value={formData.licenseNumber}
                  onChangeText={(text) => updateFormData('licenseNumber', text)}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputContainer}>
                <Car size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Vehicle Number *"
                  value={formData.vehicleNumber}
                  onChangeText={(text) => updateFormData('vehicleNumber', text)}
                  autoCapitalize="characters"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputContainer}>
                <Car size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Vehicle Type (Bike/Car/Van)"
                  value={formData.vehicleType}
                  onChangeText={(text) => updateFormData('vehicleType', text)}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <Text style={styles.sectionTitle}>Document Uploads</Text>

              <View style={styles.documentSection}>
                <TouchableOpacity
                  style={styles.documentUpload}
                  onPress={() => pickImage('idProof')}
                >
                  {documents.idProof ? (
                    <View style={styles.uploadedContainer}>
                      <CheckCircle size={20} color="#059669" />
                      <Text style={styles.uploadedText}>ID Proof Uploaded</Text>
                    </View>
                  ) : (
                    <View style={styles.uploadContainer}>
                      <Upload size={20} color="#6B7280" />
                      <Text style={styles.uploadText}>Upload ID Proof *</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.documentUpload}
                  onPress={() => pickImage('licensePhoto')}
                >
                  {documents.licensePhoto ? (
                    <View style={styles.uploadedContainer}>
                      <CheckCircle size={20} color="#059669" />
                      <Text style={styles.uploadedText}>License Uploaded</Text>
                    </View>
                  ) : (
                    <View style={styles.uploadContainer}>
                      <Camera size={20} color="#6B7280" />
                      <Text style={styles.uploadText}>Upload Driving License *</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.documentUpload}
                  onPress={() => pickImage('vehicleRegistration')}
                >
                  {documents.vehicleRegistration ? (
                    <View style={styles.uploadedContainer}>
                      <CheckCircle size={20} color="#059669" />
                      <Text style={styles.uploadedText}>Registration Uploaded</Text>
                    </View>
                  ) : (
                    <View style={styles.uploadContainer}>
                      <FileText size={20} color="#6B7280" />
                      <Text style={styles.uploadText}>Vehicle Registration *</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.documentUpload}
                  onPress={() => pickImage('vehiclePhoto')}
                >
                  {documents.vehiclePhoto ? (
                    <View style={styles.uploadedContainer}>
                      <CheckCircle size={20} color="#059669" />
                      <Text style={styles.uploadedText}>Vehicle Photo Uploaded</Text>
                    </View>
                  ) : (
                    <View style={styles.uploadContainer}>
                      <Camera size={20} color="#6B7280" />
                      <Text style={styles.uploadText}>Vehicle Photo</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionTitle}>Account Security</Text>

              <View style={styles.inputContainer}>
                <Lock size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Password *"
                  value={formData.password}
                  onChangeText={(text) => updateFormData('password', text)}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#6B7280" />
                  ) : (
                    <Eye size={20} color="#6B7280" />
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Lock size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Confirm Password *"
                  value={formData.confirmPassword}
                  onChangeText={(text) => updateFormData('confirmPassword', text)}
                  secureTextEntry={!showConfirmPassword}
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color="#6B7280" />
                  ) : (
                    <Eye size={20} color="#6B7280" />
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={styles.registerButtonText}>
                  {loading ? 'Submitting Application...' : 'Submit Application'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Text style={styles.backButtonText}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#E5E7EB',
    marginTop: 8,
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#111827',
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  documentSection: {
    marginBottom: 24,
  },
  documentUpload: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadContainer: {
    alignItems: 'center',
  },
  uploadedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 8,
    color: '#6B7280',
    fontSize: 14,
  },
  uploadedText: {
    marginLeft: 8,
    color: '#059669',
    fontSize: 14,
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  backButtonText: {
    color: '#6B7280',
    fontSize: 14,
  },
});