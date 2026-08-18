import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polyline, Circle, Rect, G } from 'react-native-svg';
import { TrackData } from '../data/tracks';

interface TrackRendererProps {
  track: TrackData;
}

export const TrackRenderer: React.FC<TrackRendererProps> = ({ track }) => {
  const pointsString = track.centerline.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" viewBox="0 0 500 1000">
        {/* Grass Background */}
        <Rect x="0" y="0" width="1000" height="500" fill="#2d6a4f" />

        <G>
          {/* Road Border / Curbs */}
          <Polyline
            points={pointsString}
            fill="none"
            stroke="#b7b7b7"
            strokeWidth={track.roadWidth + 16}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Road Asphalt */}
          <Polyline
            points={pointsString}
            fill="none"
            stroke="#3a3a3a"
            strokeWidth={track.roadWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Centerline (Subtle dashed line) */}
          <Polyline
            points={pointsString}
            fill="none"
            stroke="#ffffff"
            strokeWidth={4}
            strokeDasharray="20, 20"
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={0.3}
          />
        </G>

        {/* Checkpoints */}
        {track.checkpoints.map((cp, index) => (
          <Circle
            key={`cp-${index}`}
            cx={cp.x}
            cy={cp.y}
            r={cp.radius}
            fill="rgba(255, 255, 0, 0.2)"
            stroke="#ffff00"
            strokeWidth={2}
            strokeDasharray="5, 5"
          />
        ))}

        {/* Start Zone */}
        <Circle
          cx={track.startZone.x}
          cy={track.startZone.y}
          r={track.startZone.radius}
          fill="rgba(0, 255, 0, 0.3)"
          stroke="#00ff00"
          strokeWidth={3}
        />

        {/* Finish Zone */}
        <Circle
          cx={track.finishZone.x}
          cy={track.finishZone.y}
          r={track.finishZone.radius}
          fill="rgba(255, 0, 0, 0.3)"
          stroke="#ff0000"
          strokeWidth={3}
        />
      </Svg>
    </View>
  );
};
