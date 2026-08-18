import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polyline, Circle, Rect, G, Defs, Pattern } from 'react-native-svg';
import { TrackData } from '../data/tracks';

interface TrackRendererProps {
  track: TrackData;
}

const getThemeBackground = (theme: string) => {
  switch (theme) {
    case 'night_street': return '#1a1a24';
    case 'beach': return '#e0cdb1';
    case 'mountain': return '#5b7c6c';
    case 'oriental': return '#c24b51';
    case 'usa': return '#8fa3b3';
    case 'italy': return '#d9b891';
    case 'north_pole': return '#e3f0f7';
    case 'desert': return '#cfae76';
    case 'cyberpunk': return '#0d001a';
    case 'forest':
    default: return '#2d6a4f';
  }
};

export const TrackRenderer: React.FC<TrackRendererProps> = ({ track }) => {
  const pointsString = track.centerline.map(p => `${p.x},${p.y}`).join(' ');

  // Calculate start line angle based on first two points
  let startAngle = 0;
  if (track.centerline.length >= 2) {
    const dx = track.centerline[1].x - track.centerline[0].x;
    const dy = track.centerline[1].y - track.centerline[0].y;
    startAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90; // Perpendicular
  }

  // Calculate finish line angle
  let finishAngle = 0;
  if (track.centerline.length >= 2) {
    const len = track.centerline.length;
    const dx = track.centerline[len - 1].x - track.centerline[len - 2].x;
    const dy = track.centerline[len - 1].y - track.centerline[len - 2].y;
    finishAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90; // Perpendicular
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" viewBox="0 0 500 1000">
        <Defs>
          <Pattern id="checkered" patternUnits="userSpaceOnUse" width="20" height="20">
            <Rect width="10" height="10" fill="#ffffff" />
            <Rect x="10" width="10" height="10" fill="#000000" />
            <Rect y="10" width="10" height="10" fill="#000000" />
            <Rect x="10" y="10" width="10" height="10" fill="#ffffff" />
          </Pattern>
        </Defs>

        {/* Background */}
        <Rect x="0" y="0" width="1000" height="1000" fill={getThemeBackground(track.theme)} />

        <G>
          {/* Road Border / Curbs */}
          <Polyline
            points={pointsString}
            fill="none"
            stroke={track.theme === 'cyberpunk' ? '#00ffff' : '#b7b7b7'}
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
            stroke={track.theme === 'cyberpunk' ? '#ff00ff' : '#ffffff'}
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

        {/* Start Line */}
        <G rotation={startAngle} origin={`${track.startZone.x}, ${track.startZone.y}`}>
          <Rect
            x={track.startZone.x - track.roadWidth / 2}
            y={track.startZone.y - 10}
            width={track.roadWidth}
            height={20}
            fill="url(#checkered)"
          />
          <Rect
            x={track.startZone.x - track.roadWidth / 2}
            y={track.startZone.y - 10}
            width={track.roadWidth}
            height={20}
            fill="rgba(0, 255, 0, 0.4)" // Green tint for start
          />
        </G>

        {/* Finish Line */}
        <G rotation={finishAngle} origin={`${track.finishZone.x}, ${track.finishZone.y}`}>
          <Rect
            x={track.finishZone.x - track.roadWidth / 2}
            y={track.finishZone.y - 10}
            width={track.roadWidth}
            height={20}
            fill="url(#checkered)"
          />
        </G>

      </Svg>
    </View>
  );
};
