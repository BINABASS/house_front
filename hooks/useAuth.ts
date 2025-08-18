import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import api, { authService } from '../services/api';
import { router } from 'expo-router';
// Alert is kept for future use

// User roles
export type UserRole = 'client' | 'designer';

type TabRoute = '/(tabs)/home' | '/(designer-tabs)/dashboard' | '/chooseRegister' | '/login';

export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  user_type?: UserRole; // Backend field name
  fullName?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  phoneNumber?: string;
  createdAt?: string;
  dateJoined?: string;
  lastLogin?: string;
  isActive?: boolean;
  isStaff?: boolean;
  isSuperuser?: boolean;
  [key: string]: any; // Allow additional properties from the backend
}

// Storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_SESSION = 'current_user';
const ROLE_KEY = 'userRole';
const AUTH_KEY = 'isLoggedIn';
// Users key for future use
// const USERS_KEY = 'users';

// SecureStore helpers
const setAuthTokens = async (tokens: { access: string; refresh: string }) => {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.access);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refresh);
};

const clearAuthTokens = async () => {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_SESSION);
};

// Set current user session
export const setUserSession = async (user: User, tokens?: { access: string; refresh: string }) => {
  if (tokens) {
    await setAuthTokens(tokens);
  }
  await SecureStore.setItemAsync(USER_SESSION, JSON.stringify(user));
  await AsyncStorage.setItem(USER_SESSION, JSON.stringify(user));
  await AsyncStorage.setItem(ROLE_KEY, user.role);
  await AsyncStorage.setItem(AUTH_KEY, 'true');
};

// Get current user session
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userJson = await SecureStore.getItemAsync(USER_SESSION) || await AsyncStorage.getItem(USER_SESSION);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error getting user session:', error);
    return null;
  }
};

export const getUserRole = async (): Promise<UserRole | null> => {
  const role = await AsyncStorage.getItem(ROLE_KEY) as UserRole | null;
  return role === 'client' || role === 'designer' ? role : null;
};

export const isLoggedIn = async (): Promise<boolean> => {
  try {
    const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    const localStatus = await AsyncStorage.getItem(AUTH_KEY);
    return !!accessToken || localStatus === 'true';
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await authService.logout().catch(() => {});
  } finally {
    await clearAuthTokens();
    await AsyncStorage.multiRemove([ROLE_KEY, AUTH_KEY, USER_SESSION]);
    router.replace('/login');
  }
};

// Hash password using SHA-256
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await Crypto.digest(Crypto.CryptoDigestAlgorithm.SHA256, data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Login with API
export const login = async (email: string, password: string, role: UserRole): Promise<{ success: boolean; message: string; user?: User }> => {
  try {
    const response = await authService.login(email, password, role);
    
    // Store tokens
    await SecureStore.setItemAsync('access_token', response.access);
    await SecureStore.setItemAsync('refresh_token', response.refresh);

    // Get user data from the backend
    let userData: User;
    try {
      const profileResponse = await api.get('/auth/profile/');
      
      // Map backend's user_type to frontend's role
      // Ensure the role is always one of the valid UserRole values
      const backendRole = profileResponse.data.user_type || role;
      const userRole: UserRole = (backendRole === 'client' || backendRole === 'designer') 
        ? backendRole 
        : 'client'; // Default to 'client' if role is invalid
      
      userData = {
        id: profileResponse.data.id || 'temp-id',
        email: profileResponse.data.email || email,
        role: userRole, // Use the mapped role
        firstName: profileResponse.data.first_name || email.split('@')[0],
        isActive: true,
        // Include any additional fields from the backend
        lastName: profileResponse.data.last_name || '',
        phone: profileResponse.data.phone || '',
        user_type: backendRole // Keep original user_type from backend
      };
      
      console.log('User logged in with role:', userRole, 'user_type:', backendRole);
      
    } catch (error) {
      console.warn('Failed to fetch user profile, using default role', error);
      // Fallback to the role from login form if profile fetch fails
      userData = {
        id: 'temp-id',
        email: email,
        role: role,
        firstName: email.split('@')[0],
        isActive: true,
        user_type: role // Use role as fallback for user_type
      };
      
      console.log('Using fallback user data with role:', role);
    }
    
    // Store user data
    await setUserSession(userData, { 
      access: response.access, 
      refresh: response.refresh 
    });

    // Redirect based on the actual user role from backend
    const redirectTo: TabRoute = userData.role === 'designer' 
      ? '/(designer-tabs)/dashboard' 
      : '/(tabs)/home';
    
    router.replace(redirectTo as any);

    return { success: true, message: 'Login successful', user: userData };
  } catch (error: any) {
    console.error('Login error:', error);
    let message = 'Login failed. Please try again.';
    
    if (error.response) {
      if (error.response.data) {
        message = error.response.data.detail || 
                 error.response.data.error || 
                 JSON.stringify(error.response.data);
      }
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
      message = 'No response from server. Please check your connection.';
    } else {
      console.error('Error:', error.message);
    }
    
    return { success: false, message };
  }
};

// Register with API
export const register = async (userData: { email: string; password: string; role: UserRole; firstName?: string; lastName?: string; phoneNumber?: string }): Promise<{ success: boolean; message: string; user?: User }> => {
  try {
    const response = await authService.register(userData);

    if (response.access && response.refresh) {
      const user: User = {
        id: 'temp-id',
        email: userData.email,
        role: userData.role,
        firstName: userData.firstName || userData.email.split('@')[0],
        isActive: true
      };
      
      await setUserSession(user, { access: response.access, refresh: response.refresh });
      const redirectTo: TabRoute = userData.role === 'designer' 
        ? '/(designer-tabs)/dashboard'
        : '/(tabs)/home';
      router.replace(redirectTo);
    }

    return { success: true, message: 'Registration successful', user: response.user };
  } catch (error: any) {
    console.error('Registration error:', error);
    let message = 'Registration failed. Please try again.';
    
    if (error.response?.data) {
      message = error.response.data.detail || 
               error.response.data.error || 
               JSON.stringify(error.response.data);
    }
    return { success: false, message };
  }
};

// Optional: Refresh access token
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    if (!refreshToken) return null;

    const response = await api.post('/auth/token/refresh/', { refresh: refreshToken });
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, response.data.access);
    if (response.data.refresh) {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, response.data.refresh);
    }

    return response.data.access;
  } catch (error) {
    console.error('Error refreshing token:', error);
    await clearAuthTokens();
    return null;
  }
};
