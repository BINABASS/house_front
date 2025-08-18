import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient'; // For beautiful buttons
import { Ionicons } from '@expo/vector-icons'; // For icons in Picker/Date fields
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import AppLoading from 'expo-app-loading';
import { Colors } from '../../constants/Colors';

// Designers list
const designers = [
  { id: 1, name: 'Alice Smith' },
  { id: 2, name: 'John Doe' },
  { id: 3, name: 'Maria Garcia' },
];

export default function Booking() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [postcode, setPostcode] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('Select Preferred Date'); // Placeholder for date
  const [selectedDesignerId, setSelectedDesignerId] = useState(designers[0].id); // Use a more distinct name

  // Parse selected designs and total from params
  let selectedDesigns = [];
  let total = 0;
  try {
    selectedDesigns = params.designs ? JSON.parse(params.designs as string) : [];
    total = params.total ? Number(params.total) : 0;
  } catch (e) {
    console.error("Failed to parse designs or total from params:", e);
    selectedDesigns = [];
    total = 0;
  }

  // Generate random control number
  const generateControlNumber = () => {
    return Math.floor(100000000 + Math.random() * 900000000).toString();
  };

  const handleBooking = () => {
    if (!name || !phone || !address || !email || date === 'Select Preferred Date') {
      Alert.alert('Missing Information', 'Please fill in all required fields and select a preferred date.');
      return;
    }

    const controlNumber = generateControlNumber();
    const designNames = selectedDesigns.map(d => d.name).join(', ');
    
    Alert.alert(
      'Booking Submitted',
      `Design(s): ${designNames || 'N/A'}\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\nPost Code: ${postcode}\nEmail: ${email}\nDesigner: ${designers.find(d => d.id === selectedDesignerId)?.name}\nTotal Cost: Tsh ${total.toLocaleString()}\nDate: ${date}\n\nPayment Control Number: ${controlNumber}`,
      [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to payment screen
            router.replace({
              pathname: '/payment', // Ensure this path is correct in your Expo Router setup
              params: {
                controlNumber,
                amount: total.toString(),
              },
            });
          },
        },
      ]
    );
  };

  // Function to simulate date picker
  const handleDateSelection = () => {
    Alert.alert(
      "Select Date",
      "This would open a calendar picker for date selection.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Today (Simulated)", onPress: () => setDate(new Date().toLocaleDateString('en-GB')) },
        { text: "Tomorrow (Simulated)", onPress: () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setDate(tomorrow.toLocaleDateString('en-GB'));
          }
        },
      ]
    );
  };

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContent}>
      <Text style={styles.title}>Book a Designer</Text>

      {selectedDesigns.length > 0 && (
        <View style={styles.selectedDesignsCard}>
          <Text style={styles.selectedDesignsTitle}>
            Selected Design(s):
          </Text>
          {selectedDesigns.map((d) => (
            <Text key={d.id} style={styles.selectedDesignItem}>
              • {d.name} (Tsh {d.price.toLocaleString()})
            </Text>
          ))}
          <Text style={styles.selectedTotalCost}>Total for Designs: Tsh {total.toLocaleString()}</Text>
        </View>
      )}

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#888"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        placeholderTextColor="#888"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Post Code"
        placeholderTextColor="#888"
        value={postcode}
        onChangeText={setPostcode}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Select Designer */}
      <Text style={styles.label}>Select Designer</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedDesignerId}
          onValueChange={itemValue => setSelectedDesignerId(itemValue)}
          style={styles.picker}
          itemStyle={styles.pickerItem} // iOS specific, for Android, text color handled by `color` on Picker itself
        >
          {designers.map(d => (
            <Picker.Item key={d.id} label={d.name} value={d.id} />
          ))}
        </Picker>
        <Ionicons name="chevron-down" size={20} color="#666" style={styles.pickerIcon} />
      </View>

      {/* Preferred Date - styled as a touchable input */}
      <Text style={styles.label}>Preferred Date</Text>
      <TouchableOpacity style={styles.datePickerInput} onPress={handleDateSelection}>
        <Text style={date === 'Select Preferred Date' ? styles.datePickerPlaceholder : styles.datePickerText}>
          {date}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#666" />
      </TouchableOpacity>

      {/* Total Cost */}
      <View style={styles.totalCostContainer}>
        <Text style={styles.totalCostLabel}>Total Cost:</Text>
        <Text style={styles.totalCostAmount}>Tsh {total.toLocaleString()}</Text>
      </View>

      {/* Book Now Button */}
      <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
        <LinearGradient
          colors={['#487eb0', '#273c75']} // Gradient from lighter to darker blue
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.bookButtonGradient}
        >
          <Text style={styles.bookButtonText}>BOOK NOW</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background, // Modern, light grey-blue background
  },
  scrollViewContent: {
    padding: 25, // More generous padding
    paddingTop: 40, // Space at the top
    paddingBottom: 40, // Space at the bottom
  },
  title: {
    fontSize: 32, // Larger and more impactful title
    fontWeight: '800', // Extra bold
    color: Colors.light.text, // Dark blue-grey for text
    marginBottom: 30, // More space below title
    textAlign: 'center',
    letterSpacing: 0.5,
    fontFamily: 'Montserrat_700Bold',
  },
  selectedDesignsCard: {
    backgroundColor: Colors.light.card, // Lighter blue background for this section
    borderRadius: 16, // Rounded corners
    padding: 20,
    marginBottom: 25, // Space below this card
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  selectedDesignsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.primary, // Blue for the title
    marginBottom: 10,
    fontFamily: 'Montserrat_700Bold',
  },
  selectedDesignItem: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 4,
    marginLeft: 5,
    fontFamily: 'Montserrat_400Regular',
  },
  selectedTotalCost: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.light.text,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: 8,
    fontFamily: 'Montserrat_700Bold',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
    marginTop: 5, // A bit of space above labels
    fontFamily: 'Montserrat_700Bold',
  },
  input: {
    backgroundColor: Colors.light.surface, // White background for inputs
    borderRadius: 15, // Rounded inputs (randi!)
    paddingHorizontal: 20, // Horizontal padding
    paddingVertical: 16, // Vertical padding for taller inputs
    marginBottom: 18, // Space between inputs
    fontSize: 16,
    color: Colors.light.text, // Darker text for input
    shadowColor: Colors.light.shadow, // Soft shadow for depth
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4, // Android shadow
    borderWidth: 1, // Subtle border
    borderColor: Colors.light.border, // Light border
    fontFamily: 'Montserrat_400Regular',
  },
  pickerContainer: {
    backgroundColor: Colors.light.surface,
    borderRadius: 15,
    marginBottom: 18,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: 'hidden', // Ensures picker doesn't bleed outside container
    position: 'relative', // For absolute positioning of icon
  },
  picker: {
    height: 50, // Standard height for picker
    color: Colors.light.text, // Text color for picker items (Android)
  },
  pickerItem: {
    // This style is primarily for iOS picker items
    color: Colors.light.text,
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
  },
  pickerIcon: {
    position: 'absolute',
    right: 15,
    top: '50%',
    marginTop: -10, // Adjust to center vertically
  },
  datePickerInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 18,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.light.border,
    fontFamily: 'Montserrat_400Regular',
  },
  datePickerText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  datePickerPlaceholder: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  totalCostContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15, // More space above total cost
    marginBottom: 30, // More space before button
    paddingVertical: 10, // Padding for better visual separation
    backgroundColor: Colors.light.surface,
    borderRadius: 15,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  totalCostLabel: {
    fontSize: 19, // Larger label
    fontWeight: '700',
    color: Colors.light.text,
    fontFamily: 'Montserrat_700Bold',
  },
  totalCostAmount: {
    fontSize: 26, // Significantly larger amount
    fontWeight: '900', // Extra bold
    color: Colors.light.primary, // Primary blue for amount
    fontFamily: 'Montserrat_700Bold',
  },
  bookButton: {
    borderRadius: 30, // Highly rounded button
    overflow: 'hidden', // Ensures gradient respects borderRadius
    shadowColor: Colors.light.primary, // Darker shadow for button
    shadowOffset: { width: 0, height: 10 }, // More pronounced shadow
    shadowOpacity: 0.4, // More opaque shadow
    shadowRadius: 20, // Larger blur
    elevation: 15, // High elevation for Android
    marginBottom: 40, // Space at the bottom
  },
  bookButtonGradient: {
    paddingVertical: 18, // Taller button
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    color: Colors.light.background, // White text
    fontSize: 22, // Larger text
    fontWeight: 'bold',
    letterSpacing: 1.5, // Spaced out letters
    textTransform: 'uppercase', // Make text uppercase
    fontFamily: 'Montserrat_700Bold',
  },
});