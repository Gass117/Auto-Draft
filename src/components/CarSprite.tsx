import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import Svg, { Rect, Path } from 'react-native-svg';

interface CarSpriteProps {
  color: string;
  size?: number;
}

export const CarSprite: React.FC<CarSpriteProps> = ({ color, size = 100 }) => {
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, {
          toValue: -10,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [bounce]);

  return (
    <Animated.View style={[styles.container, { width: size, height: size, transform: [{ translateY: bounce }] }]}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100">
        {/* Shadow */}
        <Rect x="15" y="85" width="70" height="10" rx="5" fill="rgba(0,0,0,0.3)" />
        {/* Car Body */}
        <Path d="M 20 60 Q 20 40 40 40 L 60 40 Q 80 40 80 60 L 85 80 L 15 80 Z" fill={color} />
        {/* Roof */}
        <Path d="M 35 40 Q 40 20 50 20 Q 60 20 65 40 Z" fill="#333" />
        {/* Wheels */}
        <Rect x="25" y="75" width="15" height="15" rx="7.5" fill="#111" />
        <Rect x="60" y="75" width="15" height="15" rx="7.5" fill="#111" />
        {/* Headlight */}
        <Rect x="75" y="65" width="10" height="5" rx="2" fill="#FFFF00" />
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  }
});
