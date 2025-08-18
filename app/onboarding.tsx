import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import AppLoading from 'expo-app-loading';
import { Colors } from '../constants/Colors';

// Import images for each page
const kitchenImage = require('../assets/kitchen.jpg');
const onboarding1 = require('../assets/onboar1.jpg');
const onboarding2 = require('../assets/onboar2.jpg');

const pages = [
  {
    title: 'Welcome!',
    description: 'Start your journey with our app. Please login or sign up to continue.',
    backgroundColor: '#green', // green
    image: kitchenImage,
  },
  {
    title: 'Stay Connected',
    description: 'Connect with people and access your data anywhere, anytime.',
    backgroundColor: '#87CEEB', // Light Blue
    image: onboarding1,
  },
  {
    title: 'Get Started',
    description: 'Create an account or login to unlock all features.',
    backgroundColor: '#fff', //white
    image: onboarding2,
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [page, setPage] = useState(0);

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const backgroundColor = Colors.light.background;
  const image = pages[page].image;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor, padding: 24 }}>
      <Image
        source={image}
        style={{ 
          width: 300, 
          height: 180, 
          borderRadius: 20, 
          marginBottom: 32,
          resizeMode: 'cover',
          shadowColor: Colors.light.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 6,
        }}
      />
      <Text style={{ 
        fontSize: 30, 
        fontFamily: 'Montserrat_700Bold',
        marginBottom: 16, 
        color: Colors.light.primary,
        textAlign: 'center',
        letterSpacing: 1,
        textShadowColor: 'rgba(79, 140, 255, 0.08)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 2,
      }}>
        {pages[page].title}
      </Text>
      <Text style={{ 
        fontSize: 17, 
        color: Colors.light.text, 
        marginBottom: 40, 
        textAlign: 'center', 
        maxWidth: 320,
        lineHeight: 26,
        letterSpacing: 0.5,
        fontFamily: 'Montserrat_400Regular',
      }}>
        {pages[page].description}
      </Text>

      {/* Page indicators */}
      <View style={{ 
        flexDirection: 'row', 
        marginBottom: 32,
        backgroundColor: 'rgba(67, 216, 201, 0.08)',
        padding: 8,
        borderRadius: 16,
      }}>
        {pages.map((_, idx) => (
          <View
            key={idx}
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              marginHorizontal: 6,
              backgroundColor: idx === page ? Colors.light.primary : Colors.light.border,
            }}
          />
        ))}
      </View>

      {/* Navigation Buttons */}
      <View style={{ 
        flexDirection: 'row', 
        width: '100%', 
        justifyContent: 'space-between', 
        paddingHorizontal: 24,
        marginBottom: 32,
      }}>
        {page < pages.length - 1 ? (
          <>
            <TouchableOpacity
              onPress={() => router.replace('/login')}
              style={{
                paddingVertical: 14,
                paddingHorizontal: 28,
                borderRadius: 24,
                backgroundColor: Colors.light.surface,
                borderWidth: 1,
                borderColor: Colors.light.primary,
                shadowColor: Colors.light.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.12,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Text style={{ 
                color: Colors.light.primary, 
                fontFamily: 'Montserrat_700Bold',
                fontSize: 16,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setPage(page + 1)}
              style={{
                paddingVertical: 14,
                paddingHorizontal: 28,
                borderRadius: 24,
                backgroundColor: Colors.light.primary,
                shadowColor: Colors.light.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.12,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Text style={{ 
                color: '#fff', 
                fontFamily: 'Montserrat_700Bold',
                fontSize: 16,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}>Next</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            onPress={() => router.replace('/login')}
            style={{
              flex: 1,
              paddingVertical: 16,
              borderRadius: 30,
              backgroundColor: Colors.light.primary,
              alignItems: 'center',
              marginHorizontal: 24,
              shadowColor: Colors.light.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.12,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text style={{ 
              color: '#fff', 
              fontSize: 18, 
              fontFamily: 'Montserrat_700Bold',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}>Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}