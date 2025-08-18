import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import AppLoading from 'expo-app-loading';
import { Colors } from '../constants/Colors';
import { registerUser } from '../hooks/useAuth';

export default function RegisterDesignerScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    category: '',
  });

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleRegister = async () => {
    if (!validateEmail(formData.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (!validatePassword(formData.password)) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters.');
      return;
    }
    const { success, message } = await registerUser({
      email: formData.email,
      password: formData.password,
      role: 'client',
    });
    if (!success) {
      Alert.alert('Registration Error', message);
      return;
    }
    Alert.alert('Success', 'Account created successfully! Please login.');
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Designer Account</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={formData.fullName}
        onChangeText={(text) => setFormData({ ...formData, fullName: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={formData.phone}
        onChangeText={(text) => setFormData({ ...formData, phone: text })}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Location"
        value={formData.location}
        onChangeText={(text) => setFormData({ ...formData, location: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Category (e.g. Interior Designer)"
        value={formData.category}
        onChangeText={(text) => setFormData({ ...formData, category: text })}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>Register as Designer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/login')}
      >
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 32,
    textAlign: 'center',
    color: Colors.light.primary,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    color: Colors.light.text,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  linkText: {
    color: Colors.light.secondary,
    textAlign: 'center',
    marginTop: 24,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 15,
  },
});