import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { tracks } from '../data/tracks';
import { useGameStore } from '../store/useGameStore';

type TrackSelectNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TrackSelect'>;

interface Props {
  navigation: TrackSelectNavigationProp;
}

export const TrackSelectScreen: React.FC<Props> = ({ navigation }) => {
  const { unlockedTracks, bestTimes } = useGameStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Track</Text>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {tracks.map((track) => {
          const isUnlocked = unlockedTracks.includes(track.id) || ['track-1', 'track-2', 'track-3'].includes(track.id);
          const bestTime = bestTimes[track.id];

          return (
            <TouchableOpacity 
              key={track.id}
              style={[styles.card, !isUnlocked && styles.cardLocked]}
              disabled={!isUnlocked}
              onPress={() => navigation.navigate('PreRace', { trackId: track.id })}
            >
              <Text style={styles.cardTitle} numberOfLines={1} adjustsFontSizeToFit>{track.name}</Text>
              <Text style={styles.cardDiff}>Livello: {tracks.findIndex(t => t.id === track.id) + 1}/{tracks.length}</Text>
              
              {!isUnlocked && (
                <Text style={styles.lockedText}>LOCKED</Text>
              )}
              
              {isUnlocked && bestTime && (
                <Text style={styles.timeText}>Best: {bestTime.toFixed(2)}s</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  scrollContent: {
    alignItems: 'stretch',
    paddingBottom: 80,
  },
  card: {
    width: '100%',
    minHeight: 120,
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#4a4a4a',
  },
  cardLocked: {
    opacity: 0.5,
  },
  cardTitle: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardDiff: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 10,
  },
  lockedText: {
    color: '#ff3b30',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 10,
  },
  timeText: {
    color: '#34c759',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  backBtn: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    padding: 10,
  },
  backText: {
    color: 'white',
    fontSize: 18,
  }
});
