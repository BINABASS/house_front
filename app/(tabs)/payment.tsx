import { View, Text, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { useState, useRef } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import AppLoading from 'expo-app-loading';
import { Colors } from '../../constants/Colors';

const bgImage = { uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' };

export default function Payment() {
  const params = useLocalSearchParams();
  const controlNumber = params.controlNumber || 'N/A';
  const amount = params.amount || '0';

  const [paid, setPaid] = useState(false);
  const [watching, setWatching] = useState(false);
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleMobilePayment = () => {
    Alert.alert('Mobile Payment', 'Follow instructions on your phone to complete payment.');
    setPaid(true);
  };

  const handleCardPayment = () => {
    Alert.alert('Card Payment', 'Card payment processed successfully!');
    setPaid(true);
  };

  // LIVE LOCATION
  const handleShareLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Allow location access to share live location.');
      return;
    }
    setWatching(true);
    watchRef.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 3000, distanceInterval: 5 },
      (loc) => setLocation(loc.coords)
    );
  };

  const handleStopSharing = async () => {
    if (watchRef.current) {
      await watchRef.current.remove();
      watchRef.current = null;
      setWatching(false);
      setLocation(null);
      Alert.alert('Stopped', 'Live location sharing stopped.');
    }
  };

  return (
    <ImageBackground
      source={bgImage}
      style={{ flex: 1, justifyContent: 'center' }}
      imageStyle={{ opacity: 0.18 }}
    >
      <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
        <Text style={{ fontFamily: 'Montserrat_700Bold', color: Colors.light.primary, fontSize: 22, marginBottom: 24, textAlign: 'center' }}>
          Payment
        </Text>
        <Text style={{ fontFamily: 'Montserrat_400Regular', color: Colors.light.text, fontSize: 18, marginBottom: 12, textAlign: 'center' }}>
          Control Number: <Text style={{ fontFamily: 'Montserrat_700Bold', color: Colors.light.primary, fontSize: 18 }}>{controlNumber}</Text>
        </Text>
        <Text style={{ fontFamily: 'Montserrat_400Regular', color: Colors.light.text, fontSize: 18, marginBottom: 24, textAlign: 'center' }}>
          Total Amount: <Text style={{ fontFamily: 'Montserrat_700Bold', color: Colors.light.primary, fontSize: 18 }}>Tsh {amount}</Text>
        </Text>
        {!paid ? (
          <>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.light.primary,
                paddingVertical: 14,
                borderRadius: 18,
                alignItems: 'center',
                marginBottom: 16,
                flexDirection: 'row',
                justifyContent: 'center',
              }}
              onPress={handleMobilePayment}
            >
              <MaterialIcons name="mobile-friendly" size={24} color="#fff" style={{ marginRight: 10 }} />
              <Text style={{ color: '#fff', fontFamily: 'Montserrat_700Bold', fontSize: 16 }}>Pay with Mobile Money</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.light.primary,
                paddingVertical: 14,
                borderRadius: 18,
                alignItems: 'center',
                marginBottom: 16,
                flexDirection: 'row',
                justifyContent: 'center',
              }}
              onPress={handleCardPayment}
            >
              <FontAwesome5 name="credit-card" size={22} color="#fff" style={{ marginRight: 10 }} />
              <Text style={{ color: '#fff', fontFamily: 'Montserrat_700Bold', fontSize: 16 }}>Pay with Credit/Debit Card</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ color: 'green', fontFamily: 'Montserrat_700Bold', fontSize: 20, marginVertical: 24 }}>Payment Successful!</Text>
            {watching && location ? (
              <MapView
                style={{
                  width: '100%',
                  height: 250,
                  borderRadius: 16,
                  marginBottom: 16,
                  marginTop: 8,
                }}
                region={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                showsUserLocation
              >
                <Marker
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  title="You"
                  description="Your live location"
                />
              </MapView>
            ) : null}
            {!watching ? (
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.light.primary,
                  paddingVertical: 14,
                  borderRadius: 18,
                  alignItems: 'center',
                  width: 220,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
                onPress={handleShareLocation}
              >
                <Ionicons name="share-social-outline" size={22} color="#fff" style={{ marginRight: 10 }} />
                <Text style={{ color: '#fff', fontFamily: 'Montserrat_700Bold', fontSize: 16 }}>Share Live Location</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.light.error,
                  paddingVertical: 14,
                  borderRadius: 18,
                  alignItems: 'center',
                  width: 220,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 10,
                }}
                onPress={handleStopSharing}
              >
                <Ionicons name="stop-circle-outline" size={22} color="#fff" style={{ marginRight: 10 }} />
                <Text style={{ color: '#fff', fontFamily: 'Montserrat_700Bold', fontSize: 16 }}>Stop Sharing</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </ImageBackground>
  );
}