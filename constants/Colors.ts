/**
 * Modern and professional color palette for the interior design app
 * Following Material Design 3 guidelines with accessible contrast ratios
 */

export const Colors = {
  light: {
    // Primary colors
    primary: '#4A6FA5',  // Softer blue for better readability
    primaryLight: '#7D9BC8',
    primaryDark: '#1A4B7E',
    
    // Secondary colors
    secondary: '#FF9E80',  // Warm accent color
    secondaryLight: '#FFCCBC',
    secondaryDark: '#E65100',
    
    // Status colors
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#E53935',
    info: '#2196F3',
    
    // Background & Surface
    background: '#F5F7FA',  // Light gray background
    surface: '#FFFFFF',     // Card/Sheet background
    surfaceVariant: '#F1F5F9', // Slightly darker for contrast
    
    // Text & Icons
    text: '#1E293B',       // Dark gray for primary text
    textSecondary: '#64748B', // Secondary text
    onPrimary: '#FFFFFF',  // Text/icon on primary color
    onSecondary: '#1E293B', // Text on secondary color
    onBackground: '#1E293B',
    onSurface: '#1E293B',
    
    // UI Elements
    outline: '#E2E8F0',   // Borders, dividers
    outlineVariant: '#CBD5E1', // Hover/focus states
    
    // Special colors
    shadow: '#000000',
    backdrop: '#00000080', // Semi-transparent black for modals
    
    // Legacy support (keep for existing components)
    tint: '#4A6FA5',
    icon: '#475569',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#4A6FA5',
    card: '#FFFFFF',
    border: '#E2E8F0',
  },
  dark: {
    // Primary colors
    primary: '#7D9BC8',  // Lighter blue for dark theme
    primaryLight: '#A8C4FF',
    primaryDark: '#4A6FA5',
    
    // Secondary colors
    secondary: '#FFB74D',  // Warmer orange for dark theme
    secondaryLight: '#FFCC80',
    secondaryDark: '#F57C00',
    
    // Status colors
    success: '#81C784',
    warning: '#FFD54F',
    error: '#E57373',
    info: '#64B5F6',
    
    // Background & Surface
    background: '#121212',  // Dark background
    surface: '#1E1E1E',    // Card/Sheet background
    surfaceVariant: '#2D2D2D', // Slightly lighter for contrast
    
    // Text & Icons
    text: '#E2E8F0',      // Light text for dark theme
    textSecondary: '#94A3B8',
    onPrimary: '#0F172A',  // Dark text on primary color
    onSecondary: '#0F172A', // Dark text on secondary color
    onBackground: '#E2E8F0',
    onSurface: '#E2E8F0',
    
    // UI Elements
    outline: '#3E4C59',   // Darker borders
    outlineVariant: '#4B5563', // Hover/focus states
    
    // Special colors
    shadow: '#000000',
    backdrop: '#000000CC', // More opaque for dark theme
    
    // Legacy support
    tint: '#7D9BC8',
    icon: '#E2E8F0',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#4f8cff',
    accent: '#43d8c9',
    border: '#343a40',
  },
};
