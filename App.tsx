import React, { useEffect } from 'react';
import { NavigationContainer as NavContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Screens
import { HomeScreen } from './src/screens/HomeScreen';
import { TrackSelectScreen } from './src/screens/TrackSelectScreen';
import { GameScreen } from './src/screens/GameScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { PreRaceScreen } from './src/screens/PreRaceScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { audioManager } from './src/utils/audio';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  TrackSelect: undefined;
  PreRace: { trackId: string };
  Game: { trackId: string; carId: string };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    const initAudio = async () => {
      await audioManager.init();
      audioManager.playBGM();
    };
    initAudio();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" hidden={true} />
        <NavContainer>
          <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="TrackSelect" component={TrackSelectScreen} />
            <Stack.Screen name="PreRace" component={PreRaceScreen} />
            <Stack.Screen name="Game" component={GameScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </Stack.Navigator>
        </NavContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
