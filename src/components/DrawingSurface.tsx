import React, { useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Svg, { Polyline } from 'react-native-svg';
import { Point, TrackData } from '../data/tracks';
import { isPointInCircle, resamplePath, smoothPath } from '../utils/geometry';

interface DrawingSurfaceProps {
  track: TrackData;
  onPathComplete: (valid: boolean, processedPath: Point[], rawPath: Point[]) => void;
  disabled?: boolean;
}

export const DrawingSurface: React.FC<DrawingSurfaceProps> = ({ track, onPathComplete, disabled = false }) => {
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [isValidStart, setIsValidStart] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Convert screen coordinates to SVG viewBox coordinates (1000x500)
  const toSVGCoords = (x: number, y: number): Point => {
    if (dimensions.width === 0 || dimensions.height === 0) return { x, y };
    
    // Assuming objectFit="contain" or similar scaling.
    // React Native SVG by default stretches to fill if not specified, 
    // but typically we preserve aspect ratio. 
    // For this MVP, we map exactly if it's stretched, or we calculate the scale.
    // Let's assume the View matches the 2:1 aspect ratio exactly.
    const scaleX = 500 / dimensions.width;
    const scaleY = 1000 / dimensions.height;
    
    return { x: x * scaleX, y: y * scaleY };
  };

  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .onBegin((e) => {
      if (disabled) return;
      const pt = toSVGCoords(e.x, e.y);
      // Check if start is inside the start zone
      const valid = isPointInCircle(pt, track.startZone);
      setIsValidStart(valid);
      if (valid) {
        setCurrentPath([pt]);
      }
    })
    .onChange((e) => {
      if (disabled || !isValidStart) return;
      const pt = toSVGCoords(e.x, e.y);
      setCurrentPath((prev) => [...prev, pt]);
    })
    .onEnd(() => {
      if (disabled || !isValidStart || currentPath.length === 0) return;
      
      const lastPoint = currentPath[currentPath.length - 1];
      const validEnd = isPointInCircle(lastPoint, track.finishZone);
      
      if (validEnd) {
        // Process path
        const smoothed = smoothPath(currentPath, 5);
        // Resample with spacing of 10 SVG units for physics
        const resampled = resamplePath(smoothed, 10);
        
        // Also check if checkpoints are passed in order
        // This is a simplified check: just check if the path passes near each checkpoint
        let currentCpIndex = 0;
        let missedCheckpoint = false;
        
        // Very basic checkpoint validation: 
        // Iterate through path and see if we hit checkpoints sequentially
        for (const pt of resampled) {
          if (currentCpIndex < track.checkpoints.length) {
            if (isPointInCircle(pt, track.checkpoints[currentCpIndex])) {
              currentCpIndex++;
            }
          }
        }
        
        const passedAllCheckpoints = currentCpIndex === track.checkpoints.length;
        
        onPathComplete(validEnd && passedAllCheckpoints, resampled, currentPath);
      } else {
        onPathComplete(false, [], currentPath);
      }
      
      setIsValidStart(false);
    });

  const onLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  };

  const pointsString = currentPath.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <View style={StyleSheet.absoluteFill} onLayout={onLayout}>
      <GestureDetector gesture={panGesture}>
        <View style={StyleSheet.absoluteFill}>
          <Svg width="100%" height="100%" viewBox="0 0 500 1000">
            {currentPath.length > 0 && (
              <Polyline
                points={pointsString}
                fill="none"
                stroke="#FFFF00"
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.8}
              />
            )}
          </Svg>
        </View>
      </GestureDetector>
    </View>
  );
};
