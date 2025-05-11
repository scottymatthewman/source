import { Stack } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './globals.css';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Home',
          }} 
        />
        <Stack.Screen 
          name="newSong" 
          options={{ 
            title: 'New Song',
          }} 
        />
      </Stack>
    </SafeAreaProvider>
  );
}
