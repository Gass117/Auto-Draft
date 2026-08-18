import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useGameStore } from '../store/useGameStore';
import { t } from '../utils/i18n';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

export const SettingsScreen: React.FC<{ navigation: SettingsScreenNavigationProp }> = ({ navigation }) => {
  const { language, setLanguage, audioVolumes, setAudioVolume } = useGameStore();

  const handleVolumeChange = (type: 'general' | 'car', change: number) => {
    const current = audioVolumes[type];
    let newVal = current + change;
    if (newVal < 0) newVal = 0;
    if (newVal > 1) newVal = 1;
    setAudioVolume(type, parseFloat(newVal.toFixed(1)));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('settings', language)}</Text>
      
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>{t('language', language)}</Text>
        <View style={styles.langButtons}>
          <TouchableOpacity 
            style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
            onPress={() => setLanguage('en')}
          >
            <Text style={styles.btnText}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.langBtn, language === 'it' && styles.langBtnActive]}
            onPress={() => setLanguage('it')}
          >
            <Text style={styles.btnText}>Italiano</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>BGM Volume: {Math.round(audioVolumes.general * 100)}%</Text>
        <View style={styles.langButtons}>
          <TouchableOpacity style={styles.langBtn} onPress={() => handleVolumeChange('general', -0.1)}>
            <Text style={styles.btnText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.langBtn} onPress={() => handleVolumeChange('general', 0.1)}>
            <Text style={styles.btnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Car Volume: {Math.round(audioVolumes.car * 100)}%</Text>
        <View style={styles.langButtons}>
          <TouchableOpacity style={styles.langBtn} onPress={() => handleVolumeChange('car', -0.1)}>
            <Text style={styles.btnText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.langBtn} onPress={() => handleVolumeChange('car', 0.1)}>
            <Text style={styles.btnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>{t('back', language)}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a', padding: 20, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 40, marginTop: 40 },
  settingRow: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between', marginBottom: 20, backgroundColor: '#2a2a2a', padding: 20, borderRadius: 10 },
  settingLabel: { color: 'white', fontSize: 18 },
  langButtons: { flexDirection: 'row' },
  langBtn: { padding: 10, borderWidth: 1, borderColor: '#555', borderRadius: 5, marginLeft: 10 },
  langBtnActive: { backgroundColor: '#34C759', borderColor: '#34C759' },
  btnText: { color: 'white', fontWeight: 'bold' },
  backBtn: { position: 'absolute', bottom: 30, backgroundColor: '#444', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 25 },
  backText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});
