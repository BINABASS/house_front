import axios, { AxiosInstance, AxiosRequestConfig, AxiosProgressEvent } from 'axios';
import * as SecureStore from 'expo-secure-store';

// Get API base URL from environment variables or use default
const API_BASE_URL = 'http://10.66.85.52:8001/api/v1'; // Using current local network IP for mobile testing

// Create axios instance with base URL and default headers
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  async (config) => {
    // Skip adding token for auth endpoints
    if (config.url?.includes('/auth/')) {
      return config;
    }
    
    const token = await SecureStore.getItemAsync('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error status is 401 and we haven't already tried to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/token/')) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await SecureStore.getItemAsync('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access, refresh } = response.data;
          await SecureStore.setItemAsync('access_token', access);
          if (refresh) {
            await SecureStore.setItemAsync('refresh_token', refresh);
          }
          
          // Update the Authorization header
          originalRequest.headers.Authorization = `Bearer ${access}`;
          
          // Retry the original request
          return api(originalRequest);
        }
      } catch (error) {
        // If refresh token is invalid, clear tokens and redirect to login
        await SecureStore.deleteItemAsync('access_token');
        await SecureStore.deleteItemAsync('refresh_token');
        // You might want to redirect to login screen here
        // navigation.navigate('Login');
      }
    }
    
    return Promise.reject(error);
  }
);

// API service methods
export const authService = {
  login: async (email: string, password: string, role: string) => {
    const response = await api.post('/auth/token/', { 
      email, 
      password,
      role
    });
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },
  
  logout: async () => {
    try {
      // No need to call logout endpoint, just clear tokens
    } finally {
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('refresh_token');
    }
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile/');
    return response.data;
  },
};

interface Design {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  tags: string[];
  is_premium: boolean;
  image: string;
  designer: string;
  created_at: string;
  updated_at: string;
}

interface CreateDesignData {
  title: string;
  description: string;
  price: string;
  category: string;
  tags: string;
  is_premium: boolean;
  image: {
    uri: string;
    name: string;
    type: string;
  };
}

export const designService = {
  getDesigns: async (params?: Record<string, any>): Promise<{ results: Design[]; count: number }> => {
    const response = await api.get('/designs/', { params });
    return response.data;
  },
  
  getDesign: async (id: string): Promise<Design> => {
    const response = await api.get(`/designs/${id}/`);
    return response.data;
  },
  
  createDesign: async (
    designData: FormData, 
    options?: { onUploadProgress?: (progressEvent: AxiosProgressEvent) => void }
  ): Promise<Design> => {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    
    if (options?.onUploadProgress) {
      config.onUploadProgress = options.onUploadProgress;
    }
    
    const response = await api.post('/designs/', designData, config);
    return response.data;
  },
  
  updateDesign: async (id: string, designData: Partial<CreateDesignData>): Promise<Design> => {
    const response = await api.patch(`/designs/${id}/`, designData);
    return response.data;
  },
  
  deleteDesign: async (id: string): Promise<void> => {
    await api.delete(`/designs/${id}/`);
  },

  // Add any additional design-related API calls here
  getCategories: async (): Promise<string[]> => {
    const response = await api.get('/designs/categories/');
    return response.data;
  },

  searchDesigns: async (query: string): Promise<Design[]> => {
    const response = await api.get('/designs/search/', { params: { q: query } });
    return response.data;
  },
};

export const bookingService = {
  getBookings: async (params?: any) => {
    const response = await api.get('/bookings/', { params });
    return response.data;
  },
  
  createBooking: async (bookingData: any) => {
    const response = await api.post('/bookings/', bookingData);
    return response.data;
  },
  
  updateBooking: async (id: string, bookingData: any) => {
    const response = await api.patch(`/bookings/${id}/`, bookingData);
    return response.data;
  },
  
  cancelBooking: async (id: string) => {
    await api.delete(`/bookings/${id}/`);
  },
};

export default api;
