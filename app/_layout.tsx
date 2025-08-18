import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hii inaficha kabisa header ya Stack layout
      }}
    />
  );
}