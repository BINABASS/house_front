import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import AppLoading from 'expo-app-loading';
import { Colors } from '../../constants/Colors';
import { Picker } from '@react-native-picker/picker';
import { designService } from '../../services/api';
import { useRouter } from 'expo-router';
import { AxiosProgressEvent } from 'axios';

const DESIGN_CATEGORIES = [
  'Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 
  'Office', 'Garden', 'Dining Room', 'Exterior', 'Other'
];

interface DesignFormData {
  name: string;
  price: string;
  category: string;
  description: string;
  tags: string;
  isPremium: boolean;
}

export default function UploadDesigns() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [formData, setFormData] = useState<DesignFormData>({
    name: '',
    price: '',
    category: '',
    description: '',
    tags: '',
    isPremium: false,
  });

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) return <AppLoading />;

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'We need access to your photos to upload design images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleInputChange = (field: keyof DesignFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpload = async () => {
    if (!image) {
      Alert.alert('Image Required', 'Please select a design image to upload.');
      return;
    }

    if (!formData.name || !formData.price || !formData.category || !formData.description) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formDataToSend = new FormData();
      const fileExt = image.split('.').pop();
      const fileName = `design_${Date.now()}.${fileExt}`;

      const fileInfo = await FileSystem.getInfoAsync(image);
      if (!fileInfo.exists) throw new Error('Image file not found');

      // @ts-ignore
      formDataToSend.append('image', { uri: image, name: fileName, type: `image/${fileExt}` } as any);
      formDataToSend.append('title', formData.name);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('tags', formData.tags);
      formDataToSend.append('is_premium', formData.isPremium ? 'true' : 'false');

      const response = await designService.createDesign(formDataToSend, {
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        },
      });

      Alert.alert('Upload Successful', 'Your design has been uploaded and is pending review.', [
        {
          text: 'View Design',
          onPress: () => router.push(`/designs/${response.id}`),
        },
        {
          text: 'Upload Another',
          style: 'cancel',
          onPress: () => {
            setImage(null);
            setFormData({
              name: '',
              price: '',
              category: '',
              description: '',
              tags: '',
              isPremium: false,
            });
            setUploadProgress(0);
          },
        },
      ]);
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred while uploading your design.';
      Alert.alert('Upload Failed', errorMessage);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const renderUploadProgress = () => {
    if (!uploading) return null;
    return (
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Uploading: {uploadProgress}%</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {renderUploadProgress()}

      <Text style={styles.title}>Upload New Design</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Design Image *</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage} disabled={uploading}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="cloud-upload-outline" size={48} color={Colors.light.primary} />
              <Text style={styles.placeholderText}>Select Design Image</Text>
              <Text style={styles.helperText}>JPG, PNG or WEBP (max 10MB)</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, uploading && styles.buttonDisabled]}
        onPress={handleUpload}
        disabled={uploading}
      >
        {uploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Upload Design</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    marginBottom: 20,
    width: '100%',
  },
  progressText: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.light.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: Colors.light.background,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: Colors.light.primary,
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.light.text,
    marginBottom: 16,
  },
  imagePicker: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
  },
  image: { width: '100%', height: '100%' },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 16,
    fontFamily: 'Montserrat_500Medium',
    color: Colors.light.text,
  },
  helperText: {
    fontSize: 12,
    fontFamily: 'Montserrat_400Regular',
    color: Colors.light.text,
    marginTop: 4,
  },
  button: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
  },
});
