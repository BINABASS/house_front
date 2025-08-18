import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { 
  useFonts, 
  Montserrat_400Regular, 
  Montserrat_500Medium, 
  Montserrat_600SemiBold, 
  Montserrat_700Bold 
} from '@expo-google-fonts/montserrat';
import AppLoading from 'expo-app-loading';
import { Colors } from '../constants/Colors';
import { useEffect, useState } from 'react';
import { getUserRole, logout } from '../hooks/useAuth';

// Dashboard image
const dashboardImage = require('../assets/livingroom.jpg');

const DashboardCard = ({ icon, title, description, onPress }: { icon: string; title: string; description: string; onPress: () => void }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.cardIconContainer}>
      <MaterialIcons name={icon as any} size={28} color={Colors.light.primary} />
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
    <MaterialIcons name="chevron-right" size={24} color={Colors.light.textSecondary} />
  </TouchableOpacity>
);

export default function DesignerDashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const role = await getUserRole();
        const email = await AsyncStorage.getItem('userEmail');
        if (email) setUserEmail(email);
        
        if (role !== 'designer') {
          router.replace('/home');
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        router.replace('/login');
      }
    };

    checkUserRole();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
        <TouchableOpacity onPress={handleLogout} style={styles.avatar}>
          <MaterialIcons name="logout" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
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

        <Text style={styles.sectionTitle}>Your Designer Tools</Text>
        
        <DashboardCard
          icon="cloud-upload"
          title="Upload Designs"
          description="Upload your latest design projects"
          onPress={() => router.push('/(designer-tabs)/uploadDesigns')}
        />
        
        <DashboardCard
          icon="collections"
          title="My Portfolio"
          description="View and manage your portfolio"
          onPress={() => router.push('/(designer-tabs)/portfolio')}
        />
        
        <DashboardCard
          icon="chat-bubble"
          title="Messages"
          description="Connect with clients"
          onPress={() => router.push('/(designer-tabs)/messages')}
        />
        
        <DashboardCard
          icon="settings"
          title="Settings"
          description="Account and app settings"
          onPress={() => router.push('/(designer-tabs)/settings')}
        />
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
    marginBottom: 4,
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
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(101, 87, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
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
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: Colors.light.text,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(101, 87, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    fontFamily: 'Montserrat_400Regular',
    color: Colors.light.textSecondary,
  },
});
