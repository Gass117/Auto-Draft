import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { tracks, TrackData, Point } from '../data/tracks';
import { cars, Car } from '../data/cars';
import { TrackRenderer } from '../components/TrackRenderer';
import { DrawingSurface } from '../components/DrawingSurface';
import { CarRenderer } from '../components/CarRenderer';
import { TutorialOverlay } from '../components/TutorialOverlay';
import { simulateRace, SimulationResult } from '../utils/physics';
import { useGameStore } from '../store/useGameStore';

type GameNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Game'>;
type GameRouteProp = RouteProp<RootStackParamList, 'Game'>;

interface Props {
  navigation: GameNavigationProp;
  route: GameRouteProp;
}

type GameState = 'PLANNING' | 'RACING' | 'RESULTS';

export const GameScreen: React.FC<Props> = ({ navigation, route }) => {
  const { trackId, carId } = route.params;
  const track = tracks.find(t => t.id === trackId)!;
  const car = cars.find(c => c.id === carId)!;

  const [gameState, setGameState] = useState<GameState>('PLANNING');
  const [isValidPath, setIsValidPath] = useState(false);
  const [processedPath, setProcessedPath] = useState<Point[]>([]);
  const [rawPath, setRawPath] = useState<Point[]>([]);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  const { unlockTrack, saveBestTime } = useGameStore();

  const handlePathComplete = (valid: boolean, processed: Point[], raw: Point[]) => {
    setIsValidPath(valid);
    setProcessedPath(processed);
    setRawPath(raw);
  };

  const handleStartRace = () => {
    if (!isValidPath) return;
    
    // Run simulation
    const result = simulateRace(processedPath, car.stats, track);
    setSimResult(result);
    setGameState('RACING');
  };

  const handleSimulationEnd = () => {
    setGameState('RESULTS');
    
    if (simResult?.success) {
      saveBestTime(track.id, simResult.totalTime);
      
      // Unlock logic: simple linear unlocking based on track id for this MVP
      const currentTrackIndex = tracks.findIndex(t => t.id === track.id);
      if (currentTrackIndex < tracks.length - 1) {
        unlockTrack(tracks[currentTrackIndex + 1].id);
      }
    }
  };

  const resetDrawing = () => {
    setIsValidPath(false);
    setProcessedPath([]);
    setRawPath([]);
    setSimResult(null);
  };

  return (
    <View style={styles.container} onLayout={e => setDimensions(e.nativeEvent.layout)}>
      <TrackRenderer track={track} />
      
      {gameState === 'PLANNING' && (
        <DrawingSurface 
          track={track} 
          onPathComplete={handlePathComplete} 
          disabled={false}
        />
      )}

      {/* Car Renderer */}
      {simResult && (gameState === 'RACING' || gameState === 'RESULTS') && (
        <CarRenderer 
          frames={simResult.frames} 
          carColor={car.color} 
          isPlaying={gameState === 'RACING'} 
          onSimulationEnd={handleSimulationEnd}
          dimensions={dimensions}
        />
      )}

      {/* UI Overlay */}
      <TutorialOverlay track={track} gameState={gameState} hasValidPath={isValidPath} />
      <View style={styles.uiContainer} pointerEvents="box-none">
        {gameState === 'PLANNING' && (
          <>
            <View style={styles.topBar}>
              <Text style={styles.trackName}>{track.name}</Text>
              <Text style={styles.statusText}>
                {isValidPath ? 'Valid Path! Ready to Race.' : 'Draw a line from Start to Finish.'}
              </Text>
            </View>
            
            <View style={styles.bottomBar}>
              <TouchableOpacity style={styles.btn} onPress={resetDrawing}>
                <Text style={styles.btnText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
                <Text style={styles.btnText}>Change Car</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.startBtn, !isValidPath && styles.btnDisabled]} 
                onPress={handleStartRace}
                disabled={!isValidPath}
              >
                <Text style={styles.startBtnText}>START RACE</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {gameState === 'RACING' && (
          <View style={styles.topBar}>
            <Text style={styles.trackName}>Racing...</Text>
          </View>
        )}

        {gameState === 'RESULTS' && simResult && (
          <View style={styles.resultsPanel}>
            <Text style={[styles.resultsTitle, { color: simResult.success ? '#34C759' : '#FF3B30' }]}>
              {simResult.success ? 'Race Finished!' : 'Failed!'}
            </Text>
            
            <Text style={styles.resultsStat}>Time: {simResult.totalTime.toFixed(2)}s</Text>
            
            {!simResult.success && simResult.reason && (
               <Text style={styles.resultsReason}>{simResult.reason}</Text>
            )}

            {simResult.offRoadDuration > 0 && (
               <Text style={styles.resultsWarning}>Off-road penalty applied!</Text>
            )}

            <View style={{ flexDirection: 'row', marginTop: 30 }}>
              <TouchableOpacity style={styles.btn} onPress={() => setGameState('PLANNING')}>
                <Text style={styles.btnText}>Retry</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('TrackSelect')}>
                <Text style={styles.btnText}>Back to Tracks</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  uiContainer: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, justifyContent: 'space-between', padding: 20 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  trackName: { color: 'white', fontSize: 24, fontWeight: 'bold', textShadowColor: 'black', textShadowRadius: 5 },
  statusText: { color: 'white', fontSize: 18, fontWeight: 'bold', textShadowColor: 'black', textShadowRadius: 5 },
  bottomBar: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' },
  btn: { backgroundColor: 'rgba(50,50,50,0.8)', padding: 15, borderRadius: 25, marginRight: 15 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  startBtn: { backgroundColor: '#34C759', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 25, marginLeft: 'auto' },
  startBtnText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  btnDisabled: { opacity: 0.5 },
  resultsPanel: { alignSelf: 'center', margin: 'auto', backgroundColor: 'rgba(0,0,0,0.85)', padding: 40, borderRadius: 20, alignItems: 'center', minWidth: 300 },
  resultsTitle: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
  resultsStat: { color: 'white', fontSize: 24, marginBottom: 10 },
  resultsReason: { color: '#FF3B30', fontSize: 18, marginBottom: 10, fontStyle: 'italic' },
  resultsWarning: { color: '#FFFF00', fontSize: 16, marginBottom: 10 },
});
