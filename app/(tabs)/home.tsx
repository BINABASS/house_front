import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import AppLoading from 'expo-app-loading';
import { Colors } from '../../constants/Colors';
import { useEffect } from 'react';
import { getUserRole } from '../../hooks/useAuth';


const bedroomImage = require('../../assets/bedroom.jpg');

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const role = await getUserRole();
      if (role !== 'client') {
        router.replace('/designerDashboard');
      }
    })();
  }, []);
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleLogout = () => {
    // In a real app, you would clear user session/token here
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Image
        source={bedroomImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.contentContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Welcome Home!</Text>
        <Text style={styles.subtitle}>
          Make your home a haven with our expert designers. Explore, book, and transform your space today!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.22,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 28,
  },
  logoutButton: {
    alignSelf: 'flex-end',
    marginTop: 24,
    marginBottom: 24,
    backgroundColor: Colors.light.error,
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 22,
    shadowColor: Colors.light.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonText: {
    color: '#fff',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 17,
    letterSpacing: 1,
  },
  title: {
    fontSize: 34,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 18,
    color: Colors.light.primary,
    letterSpacing: 1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    color: Colors.light.text,
    marginBottom: 36,
    textAlign: 'center',
    maxWidth: 340,
    fontFamily: 'Montserrat_400Regular',
    lineHeight: 26,
  },
});