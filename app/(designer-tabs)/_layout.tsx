import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

// Hooks
import { getUserRole } from '../../hooks/useAuth';

// Constants
import { Colors } from '../../constants/Colors';

type TabBarIconProps = {
  name: keyof typeof MaterialIcons.glyphMap;
  color: string;
  focused: boolean;
  size: number;
};

const TabBarIcon = ({ name, color, focused, size }: TabBarIconProps) => (
  <View style={styles.iconContainer}>
    <MaterialIcons
      name={name}
      size={size}
      color={color}
      style={[styles.icon, { opacity: focused ? 1 : 0.7 }]}
    />
    {focused && <View style={styles.activeIndicator} />}
  </View>
);

const styles = StyleSheet.create({
  // Active indicator for the selected tab
  activeIndicator: {
    position: 'absolute',
    bottom: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.light.primary,
    alignSelf: 'center',
  },
  // Container for tab icons
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    position: 'relative',
    paddingTop: 8,
  },
  // Icon style
  icon: {
    marginBottom: 4,
  },
  // Tab bar style
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 90 : 80,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Tab label style
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
    fontFamily: 'Montserrat_500Medium',
    marginBottom: 4,
  },
  // Tab item style
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});

export default function DesignerTabsLayout() {
  const router = useRouter();

  // Check user role on component mount
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const role = await getUserRole();
        if (role !== 'designer') {
          router.replace('/login'); // redirect if not designer
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        router.replace('/login');
      }
    };

    checkUserRole();
  }, [router]);

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: '#9CA3AF',
        headerShown: false,
        tabBarItemStyle: styles.tabItem,
      }}
      sceneContainerStyle={{
        backgroundColor: Colors.light.background,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="dashboard" color={color} focused={focused} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="uploadDesigns"
        options={{
          title: 'Upload',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="cloud-upload" color={color} focused={focused} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="event" color={color} focused={focused} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="myDesigns"
        options={{
          title: 'My Designs',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="collections" color={color} focused={focused} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="person" color={color} focused={focused} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
