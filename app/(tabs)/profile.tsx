import { View, Text } from 'react-native';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import AppLoading from 'expo-app-loading';
import { Colors } from '../../constants/Colors';

export default function Profile() {
  // Mfano wa data za client, unaweza badilisha na data halisi kutoka backend au context
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+255 700 000 000',
  };

  // Mfano wa status za booking na payment
  const bookings = [
    { id: 1, design: 'Modern Kitchen', status: 'Confirmed', payment: 'Paid' },
    { id: 2, design: 'Cozy Bedroom', status: 'Pending', payment: 'Unpaid' },
  ];

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light.background, padding: 28 }}>
      <Text style={{ fontSize: 30, fontFamily: 'Montserrat_700Bold', marginBottom: 20, color: Colors.light.primary, textAlign: 'center', letterSpacing: 1 }}>
        My Profile
      </Text>
      <View style={{ marginBottom: 28, backgroundColor: Colors.light.card, borderRadius: 16, padding: 20, elevation: 3, shadowColor: Colors.light.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 8 }}>
        <Text style={{ fontSize: 19, marginBottom: 8, fontFamily: 'Montserrat_700Bold', color: Colors.light.text }}>Name: <Text style={{ fontFamily: 'Montserrat_400Regular' }}>{user.name}</Text></Text>
        <Text style={{ fontSize: 19, marginBottom: 8, fontFamily: 'Montserrat_700Bold', color: Colors.light.text }}>Email: <Text style={{ fontFamily: 'Montserrat_400Regular' }}>{user.email}</Text></Text>
        <Text style={{ fontSize: 19, fontFamily: 'Montserrat_700Bold', color: Colors.light.text }}>Phone: <Text style={{ fontFamily: 'Montserrat_400Regular' }}>{user.phone}</Text></Text>
      </View>
      <Text style={{ fontSize: 22, fontFamily: 'Montserrat_700Bold', marginBottom: 16, color: Colors.light.primary, letterSpacing: 1 }}>
        My Bookings
      </Text>
      {bookings.length === 0 ? (
        <Text style={{ color: Colors.light.icon, textAlign: 'center', fontFamily: 'Montserrat_400Regular', fontSize: 16 }}>No bookings yet.</Text>
      ) : (
        bookings.map(booking => (
          <View
            key={booking.id}
            style={{
              backgroundColor: Colors.light.card,
              borderRadius: 12,
              padding: 16,
              marginBottom: 14,
              elevation: 2,
              shadowColor: Colors.light.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 6,
            }}
          >
            <Text style={{ fontSize: 17, fontFamily: 'Montserrat_700Bold', color: Colors.light.text }}>Design: <Text style={{ fontFamily: 'Montserrat_400Regular' }}>{booking.design}</Text></Text>
            <Text>Status: <Text style={{ color: booking.status === 'Confirmed' ? Colors.light.primary : Colors.light.secondary, fontFamily: 'Montserrat_700Bold' }}>{booking.status}</Text></Text>
            <Text>Payment: <Text style={{ color: booking.payment === 'Paid' ? Colors.light.primary : Colors.light.error, fontFamily: 'Montserrat_700Bold' }}>{booking.payment}</Text></Text>
          </View>
        ))
      )}
    </View>
  );
}