import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { cars } from '../data/cars';
import { useGameStore } from '../store/useGameStore';
import { CarSprite } from '../components/CarSprite';

type CarSelectNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CarSelect'>;
type CarSelectRouteProp = RouteProp<RootStackParamList, 'CarSelect'>;

interface Props {
  navigation: CarSelectNavigationProp;
  route: CarSelectRouteProp;
}

const StatBar: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <View style={styles.statRow}>
    <Text style={styles.statLabel}>{label}</Text>
    <View style={styles.barContainer}>
      {[1, 2, 3, 4, 5].map((i) => (
        <View key={i} style={[styles.barSegment, { backgroundColor: i <= value ? '#fff' : '#444' }]} />
      ))}
    </View>
  </View>
);

export const CarSelectScreen: React.FC<Props> = ({ navigation, route }) => {
  const { trackId } = route.params;
  const { selectedCarId, setSelectedCarId } = useGameStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Car</Text>
      
      <ScrollView horizontal contentContainerStyle={styles.scrollContent}>
        {cars.map((car) => {
          const isSelected = selectedCarId === car.id;

          return (
            <TouchableOpacity 
              key={car.id}
              style={[styles.card, isSelected && { borderColor: car.color }]}
              onPress={() => setSelectedCarId(car.id)}
            >
              <Text style={[styles.cardTitle, { color: car.color }]}>{car.name}</Text>
              
              <CarSprite color={car.color} size={80} />
              
              <View style={styles.statsContainer}>
                <StatBar label="SPD" value={car.stats.speed} />
                <StatBar label="PWR" value={car.stats.power} />
                <StatBar label="GRP" value={car.stats.grip} />
                <StatBar label="BRK" value={car.stats.braking} />
                <StatBar label="STB" value={car.stats.stability} />
              </View>

              <Text style={styles.desc}>{car.description}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity 
        style={styles.startBtn}
        onPress={() => navigation.navigate('Game', { trackId, carId: selectedCarId })}
      >
        <Text style={styles.startText}>TO THE TRACK</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 20 },
  scrollContent: { alignItems: 'center', paddingRight: 40 },
  card: {
    width: 260,
    height: 380,
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 15,
    marginRight: 20,
    borderWidth: 3,
    borderColor: '#4a4a4a',
  },
  cardTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  statsContainer: { marginBottom: 15 },
  statRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  statLabel: { color: '#ccc', width: 40, fontSize: 12, fontWeight: 'bold' },
  barContainer: { flexDirection: 'row', flex: 1, justifyContent: 'space-between' },
  barSegment: { height: 10, flex: 1, marginHorizontal: 2, borderRadius: 2 },
  desc: { color: '#aaa', fontSize: 12, textAlign: 'center' },
  startBtn: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#34C759', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 25 },
  startText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  backBtn: { position: 'absolute', bottom: 20, left: 20, padding: 10 },
  backText: { color: 'white', fontSize: 18 }
});
