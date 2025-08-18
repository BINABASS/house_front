import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import AppLoading from 'expo-app-loading';
import { Colors } from '../../constants/Colors';

interface Booking {
  id: string;
  clientName: string;
  designTitle: string;
  status: 'pending' | 'confirmed' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed';
  amount: number;
  date: string;
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Hapa unaweza fetch bookings kutoka backend yako
    // Kwa sasa, mfano wa bookings (unaweza acha array ikiwa tupu kuonyesha "hamna booking yoyote")
    setBookings([
      // Mfano wa booking moja:
      // {
      //   id: '1',
      //   clientName: 'Asha Client',
      //   designTitle: 'Modern Living Room',
      //   status: 'confirmed',
      //   paymentStatus: 'paid',
      //   amount: 150000,
      //   date: '2025-07-01',
      // },
    ]);
  }, []);

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f6fa', padding: 16 }}>
      <Text style={styles.title}>Bookings</Text>
      {bookings.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#888', fontSize: 18, marginTop: 40 }}>No bookings yet</Text>
        </View>
      ) : (
        <ScrollView>
          {bookings.map((booking) => (
            <View key={booking.id} style={styles.card}>
              <Text style={styles.bold}>{booking.clientName}</Text>
              <Text style={styles.text}>Design: {booking.designTitle}</Text>
              <Text style={styles.text}>Status: {booking.status}</Text>
              <Text style={styles.text}>Payment: {booking.paymentStatus}</Text>
              <Text style={styles.text}>Amount: Tsh {booking.amount}</Text>
              <Text style={styles.text}>Date: {new Date(booking.date).toLocaleDateString()}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontFamily: 'Montserrat_700Bold',
    color: Colors.light.primary,
    marginBottom: 22,
    textAlign: 'center',
    marginTop: 18,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: Colors.light.primary,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  bold: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 17,
    marginBottom: 4,
    color: Colors.light.text,
  },
  text: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 2,
  },
});