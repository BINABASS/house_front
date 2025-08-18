import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { setupTestUsers } from '../utils/setupTestUsers';
import { Colors } from '../constants/Colors';

const TestSetupScreen = () => {
  const router = useRouter();
  const [isSettingUp, setIsSettingUp] = useState(false);

  const handleSetupTestUsers = async () => {
    setIsSettingUp(true);
    try {
      const result = await setupTestUsers();
      
      if (result && result.success) {
        Alert.alert(
          'Success ✅', 
          'Test users have been set up successfully!\n\nYou can now log in with:\n\n👤 Client:\nEmail: client@example.com\nPassword: client123\n\n🎨 Designer:\nEmail: designer@example.com\nPassword: designer123',
          [
            { 
              text: 'Go to Login', 
              onPress: () => router.replace('/login') 
            },
            {
              text: 'Stay Here',
              style: 'cancel'
            }
          ]
        );
      } else {
        Alert.alert(
          'Partial Success', 
          `Some users might not have been set up correctly. ${result?.message || 'Please check the console for details.'}\n\nTry logging in with:\n\n👤 Client: client@example.com / client123\n🎨 Designer: designer@example.com / designer123`,
          [
            { 
              text: 'Try Login', 
              onPress: () => router.replace('/login') 
            },
            {
              text: 'View Console',
              onPress: () => {
                // In a real app, you might want to show a log viewer here
                console.log('Test setup result:', result);
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Setup error:', error);
      Alert.alert(
        'Error', 
        'Failed to set up test users. Please check the console for details.\n\nYou can still try to log in with:\n\n👤 Client: client@example.com / client123\n🎨 Designer: designer@example.com / designer123',
        [
          { 
            text: 'View Console',
            onPress: () => console.error('Test setup error:', error)
          },
          {
            text: 'Try Login',
            onPress: () => router.replace('/login')
          }
        ]
      );
    } finally {
      setIsSettingUp(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <MaterialIcons name="verified-user" size={48} color={Colors.light.primary} style={styles.icon} />
        <Text style={styles.title}>Test User Setup</Text>
        <Text style={styles.subtitle}>Click the button below to set up test accounts for both client and designer roles.</Text>
        
        <View style={styles.credentialsContainer}>
          <Text style={styles.sectionTitle}>Test Credentials:</Text>
          
          <View style={styles.credentialCard}>
            <Text style={styles.roleTitle}>👤 Client Account</Text>
            <Text style={styles.credentialText}>Email: client@example.com</Text>
            <Text style={styles.credentialText}>Password: client123</Text>
          </View>
          
          <View style={styles.credentialCard}>
            <Text style={styles.roleTitle}>🎨 Designer Account</Text>
            <Text style={styles.credentialText}>Email: designer@example.com</Text>
            <Text style={styles.credentialText}>Password: designer123</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.button, isSettingUp && styles.buttonDisabled]} 
          onPress={handleSetupTestUsers}
          disabled={isSettingUp}
        >
          {isSettingUp ? (
            <Text style={styles.buttonText}>Setting Up...</Text>
          ) : (
            <Text style={styles.buttonText}>Set Up Test Users</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => router.replace('/login')}
        >
          <Text style={styles.secondaryButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.light.background,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  credentialsContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
  },
  credentialCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.primary,
    marginBottom: 8,
  },
  credentialText: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 4,
  },
  button: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    padding: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.light.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TestSetupScreen;
