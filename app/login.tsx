import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  Image,
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  SafeAreaView
} from 'react-native';
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
import { login, UserRole } from '../hooks/useAuth';

// ✅ Corrected path
const livingroomImage = require('../assets/livingroom.jpg');

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('client');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    'Montserrat-Regular': Montserrat_400Regular,
    'Montserrat-Medium': Montserrat_500Medium,
    'Montserrat-SemiBold': Montserrat_600SemiBold,
    'Montserrat-Bold': Montserrat_700Bold,
  });

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const result = await login(email, password, role);
      
      if (result.success) {
        if (role === 'designer') {
          router.replace('/(designer-tabs)');
        } else {
          router.replace('/(tabs)/home');
        }
      } else {
        setError(result.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestUser = (testRole: UserRole) => {
    setRole(testRole);
    setEmail(testRole === 'client' ? 'client@example.com' : 'designer@example.com');
    setPassword('password123');
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.backgroundImageContainer}>
            <Image
              source={livingroomImage}
              style={styles.backgroundImage}
              resizeMode="cover"
            />
            <View style={styles.overlay} />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === 'client' && styles.roleButtonActive
                ]}
                onPress={() => setRole('client')}
                disabled={isLoading}
              >
                <Text style={[
                  styles.roleButtonText,
                  role === 'client' && styles.roleButtonTextActive
                ]}>
                  Client
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === 'designer' && styles.roleButtonActive
                ]}
                onPress={() => setRole('designer')}
                disabled={isLoading}
              >
                <Text style={[
                  styles.roleButtonText,
                  role === 'designer' && styles.roleButtonTextActive
                ]}>
                  Designer
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons 
                  name="email" 
                  size={20} 
                  color={Colors.light.textSecondary} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={Colors.light.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons 
                  name="lock" 
                  size={20} 
                  color={Colors.light.textSecondary} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Enter your password"
                  placeholderTextColor={Colors.light.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  <MaterialIcons 
                    name={showPassword ? 'visibility-off' : 'visibility'} 
                    size={20} 
                    color={Colors.light.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Log In</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => router.push('/forgot-password')}
              disabled={isLoading}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.testUsersContainer}>
              <Text style={styles.testUsersTitle}>Test Accounts</Text>
              <View style={styles.testUsersButtons}>
                <TouchableOpacity 
                  style={[styles.testUserButton, styles.clientButton]}
                  onPress={() => handleTestUser('client')}
                  disabled={isLoading}
                >
                  <Text style={styles.testUserButtonText}>Client</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.testUserButton, styles.designerButton]}
                  onPress={() => handleTestUser('designer')}
                  disabled={isLoading}
                >
                  <Text style={styles.testUserButtonText}>Designer</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity 
                onPress={() => router.push(role === 'designer' ? '/registerDesigner' : '/registerClient')}
                disabled={isLoading}
              >
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1 },
  backgroundImageContainer: { height: 250, position: 'relative' },
  backgroundImage: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  formContainer: { padding: 20, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -20 },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.light.primary, marginBottom: 5, fontFamily: 'Montserrat-Bold' },
  subtitle: { fontSize: 16, color: Colors.light.textSecondary, marginBottom: 20, fontFamily: 'Montserrat-Medium' },
  errorContainer: { backgroundColor: '#FFEBEE', padding: 12, borderRadius: 8, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#F44336' },
  errorText: { color: '#D32F2F', fontSize: 14, fontFamily: 'Montserrat-Medium' },
  roleContainer: { flexDirection: 'row', backgroundColor: '#F5F5F5', borderRadius: 10, padding: 5, marginBottom: 20 },
  roleButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  roleButtonActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  roleButtonText: { fontSize: 14, fontFamily: 'Montserrat-SemiBold', color: Colors.light.textSecondary },
  roleButtonTextActive: { color: Colors.light.primary },
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 14, color: Colors.light.textPrimary, marginBottom: 8, fontFamily: 'Montserrat-SemiBold' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 10, paddingHorizontal: 15, height: 50 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: '100%', fontFamily: 'Montserrat-Regular', color: Colors.light.textPrimary },
  passwordInput: { paddingRight: 40 },
  eyeIcon: { position: 'absolute', right: 15, padding: 10 },
  loginButton: { backgroundColor: Colors.light.primary, height: 50, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  loginButtonDisabled: { opacity: 0.6 },
  loginButtonText: { color: '#fff', fontSize: 16, fontFamily: 'Montserrat-SemiBold' },
  forgotPassword: { alignSelf: 'flex-end', marginTop: 10, marginBottom: 20 },
  forgotPasswordText: { color: Colors.light.primary, fontSize: 14, fontFamily: 'Montserrat-Medium' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  divider: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
  dividerText: { paddingHorizontal: 10, color: Colors.light.textSecondary, fontSize: 12, fontFamily: 'Montserrat-Medium' },
  testUsersContainer: { marginBottom: 20 },
  testUsersTitle: { textAlign: 'center', color: Colors.light.textSecondary, marginBottom: 10, fontFamily: 'Montserrat-Medium' },
  testUsersButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  testUserButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  clientButton: { backgroundColor: '#E3F2FD' },
  designerButton: { backgroundColor: '#E8F5E9' },
  testUserButtonText: { color: Colors.light.primary, fontFamily: 'Montserrat-SemiBold' },
  signupContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  signupText: { color: Colors.light.textSecondary, fontFamily: 'Montserrat-Regular' },
  signupLink: { color: Colors.light.primary, fontFamily: 'Montserrat-SemiBold' },
});

export default LoginScreen;
