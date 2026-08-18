import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { Frame } from '../utils/physics';
import { audioManager } from '../utils/audio';

interface CarRendererProps {
  frames: Frame[];
  carImage: any;
  maxSpeed: number;
  onSimulationEnd: () => void;
  isPlaying: boolean;
  dimensions: { width: number; height: number }; // SVG container dimensions to scale
}

export const CarRenderer: React.FC<CarRendererProps> = ({ frames, carImage, maxSpeed, onSimulationEnd, isPlaying, dimensions }) => {
  const scaleX = dimensions.width / 500;
  const scaleY = dimensions.height / 1000;

  const initialX = frames.length > 0 ? frames[0].x * scaleX : 0;
  const initialY = frames.length > 0 ? frames[0].y * scaleY : 0;
  const initialRot = frames.length > 0 ? frames[0].rotation : 0;

  const x = useRef(new Animated.Value(initialX)).current;
  const y = useRef(new Animated.Value(initialY)).current;
  const rotation = useRef(new Animated.Value(initialRot)).current;

  // Pre-calculate skid marks
  const skidMarks = useMemo(() => {
    const lines: string[] = [];
    let currentLine: string[] = [];
    
    for (const frame of frames) {
      if (frame.gripLoss) {
        currentLine.push(`${frame.x * scaleX},${frame.y * scaleY}`);
      } else if (currentLine.length > 0) {
        if (currentLine.length > 1) lines.push(currentLine.join(' '));
        currentLine = [];
      }
    }
    if (currentLine.length > 1) lines.push(currentLine.join(' '));
    
    return lines;
  }, [frames, scaleX, scaleY]);

  useEffect(() => {
    if (isPlaying && frames.length > 0) {
      let start: number | null = null;
      let frameId: number;
      let isEngineStarted = false;

      const loop = async (timestamp: number) => {
        if (!start) {
          start = timestamp;
          await audioManager.startEngine();
          isEngineStarted = true;
        }
        const elapsed = (timestamp - start) / 1000;
        const frameIndex = Math.floor(elapsed * 60);
        
        if (frameIndex < frames.length) {
          const f = frames[frameIndex];
          x.setValue(f.x * scaleX);
          y.setValue(f.y * scaleY);
          rotation.setValue(f.rotation);
          
          audioManager.updateEnginePitch(f.speed, maxSpeed);
          if (f.gripLoss) {
            audioManager.playTireSqueal();
          }
          
          frameId = requestAnimationFrame(loop);
        } else {
          audioManager.stopEngine();
          onSimulationEnd();
        }
      };

      frameId = requestAnimationFrame(loop);
      
      return () => {
        cancelAnimationFrame(frameId);
        audioManager.stopEngine();
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
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {isPlaying && (
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          {skidMarks.map((points, idx) => (
            <Polyline
              key={idx}
              points={points}
              fill="none"
              stroke="rgba(0,0,0,0.4)"
              strokeWidth={8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </Svg>
      )}
      <Animated.View style={[styles.carContainer, animatedStyle]}>
        <Image 
          source={carImage} 
          style={styles.carImage} 
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  carContainer: {
    position: 'absolute',
    left: -15, // Adjusted for image centering based on 30x60 assumed size
    top: -30,
    width: 30,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    zIndex: 10,
  },
  carImage: {
    width: 30,
    height: 60,
    resizeMode: 'contain',
    transform: [{ rotate: '90deg' }] // Since images are drawn "up" but game assumes 0 degrees is "right"
  }
});
