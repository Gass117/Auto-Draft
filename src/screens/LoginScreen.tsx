import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useGameStore } from '../store/useGameStore';

type LoginNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginNavigationProp;
}

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { language } = useGameStore();

  const handleMockLogin = () => {
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <View style={styles.overlay} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>DRAW THE LINE</Text>
        <Text style={styles.subtitle}>RACING</Text>

        <View style={styles.spacer} />

        <TouchableOpacity style={[styles.btn, styles.appleBtn]} onPress={handleMockLogin}>
          <Text style={styles.appleBtnText}> Sign in with Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.googleBtn]} onPress={handleMockLogin}>
          <Text style={styles.googleBtnText}>G Sign in with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.guestBtn} onPress={handleMockLogin}>
          <Text style={styles.guestBtnText}>Play as Guest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1a1a2e',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#fff',
    fontStyle: 'italic',
    textShadowColor: '#ff003c',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 1,
  },
  subtitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00e5ff',
    letterSpacing: 8,
    marginBottom: 60,
  },
  spacer: { flex: 1 },
  btn: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  appleBtn: { backgroundColor: '#fff' },
  appleBtnText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  googleBtn: { backgroundColor: '#4285F4' },
  googleBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  guestBtn: { padding: 15 },
  guestBtnText: { color: '#888', fontSize: 16, textDecorationLine: 'underline' }
});
