import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import AppLoading from 'expo-app-loading';
import { Colors } from '../constants/Colors';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const router = useRouter();
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }
  const handleReset = () => {
    // Hapa unaweza tuma request kwenda backend yako
    setSent(true);
  };

  const inputStyle = {
    borderWidth: 1,
    marginBottom: 18,
    padding: 14,
    borderRadius: 10,
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.border,
    color: Colors.light.text,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  };
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 28, backgroundColor: Colors.light.background }}>
      <Text style={{ fontSize: 28, fontFamily: 'Montserrat_700Bold', marginBottom: 28, color: Colors.light.primary, textAlign: 'center', letterSpacing: 1 }}>
        Forgot Password
      </Text>
      {sent ? (
        <Text style={{ color: Colors.light.secondary, textAlign: 'center', marginBottom: 28, fontFamily: 'Montserrat_400Regular', fontSize: 16 }}>
          If this email exists, a reset link has been sent!
        </Text>
      ) : (
        <>
          <TextInput
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            style={inputStyle}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor={Colors.light.icon}
          />
          <TouchableOpacity
            style={{
              backgroundColor: Colors.light.primary,
              padding: 16,
              borderRadius: 12,
              alignItems: 'center',
              marginBottom: 8,
              shadowColor: Colors.light.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 4,
            }}
            onPress={handleReset}
          >
            <Text style={{ color: '#fff', fontFamily: 'Montserrat_700Bold', fontSize: 17, letterSpacing: 1 }}>Send Reset Link</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity
        style={{ marginTop: 28, alignItems: 'center' }}
        onPress={() => router.replace('/login')}
      >
        <Text style={{ color: Colors.light.secondary, fontFamily: 'Montserrat_700Bold', fontSize: 16 }}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}