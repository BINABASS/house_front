import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { 
  useFonts, 
  Montserrat_400Regular, 
  Montserrat_500Medium, 
  Montserrat_600SemiBold, 
  Montserrat_700Bold 
} from '@expo-google-fonts/montserrat';
import AppLoading from 'expo-app-loading';
import { Colors } from '../../constants/Colors';
import { useEffect, useState } from 'react';

// Using an existing image from assets
const dashboardImage = require('../../assets/livingroom.jpg');

export default function DesignerDashboard() {
  const [userEmail, setUserEmail] = useState('');
  
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  useEffect(() => {
    const loadUserEmail = async () => {
      const email = await AsyncStorage.getItem('userEmail');
      if (email) setUserEmail(email);
    };
    loadUserEmail();
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{userEmail || 'Designer'}</Text>
          <View style={styles.roleBadge}>
            <MaterialIcons name="brush" size={16} color={Colors.light.background} />
            <Text style={styles.roleText}>Designer</Text>
          </View>
        </View>
      </View>

      {/* Dashboard Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeMessage}>Welcome to Your Designer Dashboard</Text>
          <Text style={styles.welcomeSubtitle}>Use the bottom navigation to access all features</Text>
          
          <View style={styles.imageContainer}>
            <Image 
              source={dashboardImage} 
              style={styles.dashboardImage} 
              resizeMode="cover"
            />
          </View>
          
          <View style={styles.infoBox}>
            <MaterialIcons name="info" size={24} color={Colors.light.primary} />
            <Text style={styles.infoText}>
              Navigate using the bottom tabs to access your designs, bookings, and profile.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    fontFamily: 'Montserrat_400Regular',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  roleText: {
    color: Colors.light.background,
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    marginLeft: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  welcomeMessage: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: Colors.light.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Montserrat_400Regular',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: Colors.light.card,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dashboardImage: {
    width: '100%',
    height: '100%',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(101, 87, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(101, 87, 255, 0.1)',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    color: Colors.light.text,
    fontFamily: 'Montserrat_400Regular',
    lineHeight: 20,
  },
});
