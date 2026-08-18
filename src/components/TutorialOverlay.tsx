import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGameStore } from '../store/useGameStore';
import { TrackData } from '../data/tracks';

interface TutorialOverlayProps {
  track: TrackData;
  gameState: string;
  hasValidPath: boolean;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ track, gameState, hasValidPath }) => {
  const { tutorialCompleted, completeTutorial } = useGameStore();
  const [step, setStep] = useState(0);

  if (tutorialCompleted || track.id !== 'rookie-loop') return null;

  const messages = [
    "Welcome to Draw The Line Racing! This is a strategy game.",
    "Your car will drive automatically based on its stats.",
    "Your job is to draw the perfect racing line.",
    "Draw a line from the green START zone to the red FINISH zone."
  ];

  if (gameState === 'PLANNING' && !hasValidPath) {
    return (
      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.box}>
          <Text style={styles.text}>{messages[step]}</Text>
          <View style={styles.btnRow}>
             {step < 3 ? (
               <TouchableOpacity style={styles.btn} onPress={() => setStep(step + 1)}>
                 <Text style={styles.btnText}>Next</Text>
               </TouchableOpacity>
             ) : (
               <TouchableOpacity style={styles.btn} onPress={() => completeTutorial()}>
                 <Text style={styles.btnText}>Got it</Text>
               </TouchableOpacity>
             )}
          </View>
        </View>
      </View>
    );
  }

  if (gameState === 'PLANNING' && hasValidPath) {
    return (
      <View style={styles.overlay} pointerEvents="none">
        <View style={styles.box}>
          <Text style={styles.text}>Great! Now tap START RACE to watch the simulation.</Text>
        </View>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  box: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    padding: 20,
    borderRadius: 15,
    maxWidth: 400,
    borderWidth: 2,
    borderColor: '#34C759'
  },
  text: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  btn: {
    backgroundColor: '#34C759',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});
