import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import AppLoading from 'expo-app-loading';
import { Colors } from '../constants/Colors';

export default function ChooseRegister() {
  const router = useRouter();
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TouchableOpacity
        style={[styles.button, styles.clientButton]}
        onPress={() => router.push('/registerClient')}
      >
        <Text style={styles.buttonText}>Register as Client</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.designerButton]}
        onPress={() => router.push('/registerDesigner')}
      >
        <Text style={styles.buttonText}>Register as Designer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 36,
    color: Colors.light.primary,
    letterSpacing: 1,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 18,
    borderRadius: 28,
    width: 260,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  clientButton: {
    backgroundColor: Colors.light.primary,
  },
  designerButton: {
    backgroundColor: Colors.light.secondary,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 17,
    letterSpacing: 1,
  },
});