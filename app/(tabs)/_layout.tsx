import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useEffect } from 'react';
import { getUserRole } from '../../hooks/useAuth';
import { useRouter } from 'expo-router';

export default function TabLayout() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const role = await getUserRole();
      if (role !== 'client') {
        router.replace('/designerDashboard');
      }
    })();
  }, []);
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
        tabBarStyle: {
          backgroundColor: Colors.light.surface,
          height: 64,
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          shadowColor: Colors.light.primary,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: { fontSize: 13, marginBottom: 6 },
        headerShown: false, // Hii inaficha header ya juu
        tabBarIcon: ({ color, focused }) => {
          let iconName = 'home-outline';
          if (route.name === 'design') iconName = 'images-outline';
          if (route.name === 'booking') iconName = 'calendar-outline';
          if (route.name === 'payment') iconName = 'card-outline';
          if (route.name === 'profile') iconName = 'person-outline';
          return <Ionicons name={iconName} size={28} color={color} style={{ marginBottom: 6, opacity: focused ? 1 : 0.7 }} />;
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="design" options={{ title: 'Designs' }} />
      <Tabs.Screen name="booking" options={{ title: 'Booking' }} />
      <Tabs.Screen name="payment" options={{ title: 'Payment' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}