import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const StatusIndicator = ({ status }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const maxScale = 1.25; // Maximum scale to respect the font size limit
  const baseSize = 12; // Base size of the indicator

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: maxScale,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulseAnim]);

  const color = status.completed ? 'red' : 'green';

  return (
    <Animated.View
      style={[
        styles.pulse,
        {
          backgroundColor: color,
          transform: [{ scale: pulseAnim }],
          width: baseSize,
          height: baseSize,
          borderRadius: baseSize / 2,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  pulse: {
    marginRight: 10,
  },
});

export default StatusIndicator;
