import { View, Text, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import AppLoading from 'expo-app-loading';
import { Colors } from '../../constants/Colors';

export default function Me() {
  const router = useRouter();

  // Mfano wa taarifa za designer (kwa production, hizi ziletwe kutoka backend au context)
  const designer = {
    name: 'John Designer',
    email: 'designer@example.com',
    phone: '+255 712 345 678',
    location: 'Dar es Salaam, Tanzania',
    category: 'Interior Designer',
    profilePic: 'https://randomuser.me/api/portraits/men/32.jpg', // unaweza tumia picha yako mwenyewe
  };

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleLogout = () => {
    Alert.alert('Logged out', 'You have been logged out.');
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      {/* Logout button juu kulia */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Profile info */}
      <View style={styles.profileCard}>
        <Image
          source={{ uri: designer.profilePic }}
          style={styles.profilePic}
        />
        <Text style={styles.name}>{designer.name}</Text>
        <Text style={styles.email}>{designer.email}</Text>
        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={18} color={Colors.light.primary} />
          <Text style={styles.infoText}>{designer.phone}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={18} color={Colors.light.primary} />
          <Text style={styles.infoText}>{designer.location}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="briefcase-outline" size={18} color={Colors.light.primary} />
          <Text style={styles.infoText}>{designer.category}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop: 48,
    paddingHorizontal: 18,
  },
  logoutBtn: {
    position: 'absolute',
    top: 48,
    right: 18,
    flexDirection: 'row',
    backgroundColor: Colors.light.error,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 22,
    alignItems: 'center',
    zIndex: 10,
    shadowColor: Colors.light.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    color: '#fff',
    fontFamily: 'Montserrat_700Bold',
    marginLeft: 8,
    fontSize: 16,
    letterSpacing: 1,
  },
  profileCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    alignItems: 'center',
    padding: 32,
    marginTop: 70,
    shadowColor: Colors.light.primary,
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 3,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: Colors.light.primary,
    marginBottom: 6,
  },
  email: {
    color: Colors.light.primary,
    marginBottom: 18,
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 17,
    color: Colors.light.text,
    fontFamily: 'Montserrat_400Regular',
  },
});