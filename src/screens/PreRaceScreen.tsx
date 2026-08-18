import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Animated } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { tracks } from '../data/tracks';
import { cars, CarStats } from '../data/cars';
import { useGameStore } from '../store/useGameStore';

type PreRaceNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PreRace'>;
type PreRaceRouteProp = RouteProp<RootStackParamList, 'PreRace'>;

interface Props {
  navigation: PreRaceNavigationProp;
  route: PreRaceRouteProp;
}

export const PreRaceScreen: React.FC<Props> = ({ navigation, route }) => {
  const { trackId } = route.params;
  const track = tracks.find(t => t.id === trackId);
  const car = cars.find(c => c.id === track?.assignedCarId);
  
  const { availableUpgradePoints, carUpgrades, spendUpgradePoint, failedAttempts } = useGameStore();

  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  if (!track || !car) return null;

  const upgrades = carUpgrades[car.id] || {};
  
  const renderStatRow = (label: string, statKey: keyof CarStats, baseValue: number) => {
    const upgradedValue = (upgrades[statKey] || 0) + baseValue;
    const canUpgrade = availableUpgradePoints > 0 && upgradedValue < 5;
    const canDowngrade = (upgrades[statKey] || 0) > 0;

    return (
      <View style={styles.statRow} key={statKey}>
        <Text style={styles.statLabel}>{label}</Text>
        <TouchableOpacity 
          style={[styles.btnSmall, !canDowngrade && styles.btnDisabled]} 
          disabled={!canDowngrade}
          onPress={() => spendUpgradePoint(car.id, statKey, -1)}
        >
          <Text style={styles.btnSmallText}>-</Text>
        </TouchableOpacity>
        <View style={styles.statBarContainer}>
          {[1, 2, 3, 4, 5].map(val => (
            <View 
              key={val} 
              style={[
                styles.statBlock, 
                val <= baseValue ? styles.statBlockBase : 
                val <= upgradedValue ? styles.statBlockUpgraded : null
              ]} 
            />
          ))}
        </View>
        <TouchableOpacity 
          style={[styles.btnSmall, !canUpgrade && styles.btnDisabled]} 
          disabled={!canUpgrade}
          onPress={() => spendUpgradePoint(car.id, statKey, 1)}
        >
          <Text style={styles.btnSmallText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const attempts = failedAttempts[track.id] || 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>{track.name}</Text>
        <Text style={styles.subtitle}>Theme: {track.theme.toUpperCase()} | Difficulty: {track.difficulty}</Text>
        {attempts > 0 && (
          <Text style={styles.attemptsText}>Failed Attempts: {attempts}</Text>
        )}
      </View>

      <View style={styles.carSection}>
        <Animated.Image 
          source={car.image} 
          style={[
            styles.carImage, 
            { 
              transform: [
                { rotate: '90deg' },
                { rotateY: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg']
                  }) 
                }
              ] 
            }
          ]} 
        />
        <Text style={styles.carName}>{car.name}</Text>
        <Text style={styles.carDesc}>{car.description}</Text>
      </View>

      <View style={styles.upgradeSection}>
        <Text style={styles.upgradeTitle}>TUNING</Text>
        <Text style={styles.pointsText}>Available Points: {availableUpgradePoints}</Text>
        
        {renderStatRow('Speed', 'speed', car.stats.speed)}
        {renderStatRow('Power', 'power', car.stats.power)}
        {renderStatRow('Grip', 'grip', car.stats.grip)}
        {renderStatRow('Braking', 'braking', car.stats.braking)}
        {renderStatRow('Stability', 'stability', car.stats.stability)}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.btnText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.startBtn} 
          onPress={() => navigation.navigate('Game', { trackId: track.id, carId: car.id })}
        >
          <Text style={styles.startBtnText}>RACE</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  header: { padding: 20, paddingTop: 40, backgroundColor: '#222', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: '900', color: '#fff', fontStyle: 'italic' },
  subtitle: { fontSize: 16, color: '#00e5ff', marginTop: 5 },
  attemptsText: { fontSize: 14, color: '#ff3b30', marginTop: 5, fontWeight: 'bold' },
  carSection: { alignItems: 'center', padding: 20 },
  carImage: { width: 100, height: 200, resizeMode: 'contain', transform: [{ rotate: '90deg' }] },
  carName: { fontSize: 28, color: '#fff', fontWeight: 'bold', marginTop: 20 },
  carDesc: { fontSize: 14, color: '#aaa', textAlign: 'center', marginTop: 5 },
  upgradeSection: { padding: 20 },
  upgradeTitle: { fontSize: 24, color: '#fff', fontWeight: 'bold', marginBottom: 5 },
  pointsText: { fontSize: 16, color: '#00e5ff', marginBottom: 20 },
  statRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  statLabel: { flex: 1, color: '#fff', fontSize: 16 },
  statBarContainer: { flexDirection: 'row', width: 120, justifyContent: 'space-between', marginHorizontal: 10 },
  statBlock: { width: 20, height: 10, backgroundColor: '#333', borderRadius: 2 },
  statBlockBase: { backgroundColor: '#ff9500' },
  statBlockUpgraded: { backgroundColor: '#00e5ff' },
  btnSmall: { width: 30, height: 30, backgroundColor: '#444', justifyContent: 'center', alignItems: 'center', borderRadius: 15 },
  btnDisabled: { opacity: 0.3 },
  btnSmallText: { color: '#fff', fontSize: 20, fontWeight: 'bold', lineHeight: 22 },
  footer: { flexDirection: 'row', padding: 20, justifyContent: 'space-between' },
  backBtn: { padding: 15, backgroundColor: '#333', borderRadius: 8, flex: 1, marginRight: 10, alignItems: 'center' },
  startBtn: { padding: 15, backgroundColor: '#ff003c', borderRadius: 8, flex: 2, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  startBtnText: { color: '#fff', fontSize: 20, fontWeight: '900', fontStyle: 'italic' }
});
