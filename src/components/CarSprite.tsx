import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, Image } from 'react-native';

interface CarSpriteProps {
  carImage: any;
  size?: number;
}

export const CarSprite: React.FC<CarSpriteProps> = ({ carImage, size = 100 }) => {
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
      <Image 
        source={carImage} 
        style={{ width: size, height: size, resizeMode: 'contain' }} 
      />
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
