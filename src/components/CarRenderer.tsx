import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Frame } from '../utils/physics';

interface CarRendererProps {
  frames: Frame[];
  carColor: string;
  onSimulationEnd: () => void;
  isPlaying: boolean;
  dimensions: { width: number; height: number }; // SVG container dimensions to scale
}

export const CarRenderer: React.FC<CarRendererProps> = ({ frames, carColor, onSimulationEnd, isPlaying, dimensions }) => {
  const scaleX = dimensions.width / 500;
  const scaleY = dimensions.height / 1000;

  const initialX = frames.length > 0 ? frames[0].x * scaleX : 0;
  const initialY = frames.length > 0 ? frames[0].y * scaleY : 0;
  const initialRot = frames.length > 0 ? frames[0].rotation : 0;

  const x = useRef(new Animated.Value(initialX)).current;
  const y = useRef(new Animated.Value(initialY)).current;
  const rotation = useRef(new Animated.Value(initialRot)).current;

  useEffect(() => {
    if (isPlaying && frames.length > 0) {
      let start: number | null = null;
      let frameId: number;

      const loop = (timestamp: number) => {
        if (!start) start = timestamp;
        const elapsed = (timestamp - start) / 1000;
        const frameIndex = Math.floor(elapsed * 60);
        
        if (frameIndex < frames.length) {
          const f = frames[frameIndex];
          // We can use setValue for fast, direct updates outside the React render cycle
          x.setValue(f.x * scaleX);
          y.setValue(f.y * scaleY);
          rotation.setValue(f.rotation);
          frameId = requestAnimationFrame(loop);
        } else {
          onSimulationEnd();
        }
      };

      frameId = requestAnimationFrame(loop);
      
      return () => {
        cancelAnimationFrame(frameId);
      };
    } else if (frames.length > 0 && !isPlaying) {
      x.setValue(frames[0].x * scaleX);
      y.setValue(frames[0].y * scaleY);
      rotation.setValue(frames[0].rotation);
    }
  }, [isPlaying, frames]);

  const animatedStyle = {
    transform: [
      { translateX: x },
      { translateY: y },
      { rotate: rotation.interpolate({
          inputRange: [-Math.PI * 2, Math.PI * 2],
          outputRange: ['-360deg', '360deg']
        }) 
      }
    ]
  };

  if (frames.length === 0 || dimensions.width === 0) return null;

  return (
    <Animated.View style={[styles.car, { backgroundColor: carColor }, animatedStyle]}>
      <View style={styles.window} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  car: {
    position: 'absolute',
    left: -10,
    top: -5,
    width: 20,
    height: 10,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#000',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  window: {
    width: 4,
    height: 8,
    backgroundColor: '#000',
    marginRight: 2,
    borderRadius: 1,
  }
});
