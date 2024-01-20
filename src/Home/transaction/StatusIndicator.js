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

  const determineColor = () => {
    if (status.cancelled) return 'red';
    if (status.collected) return 'blue';
    if (status.completed) return 'green';
    if (status.delivered) return 'orange';
    if (status.paid) return 'purple';
    if (status.refunded) return 'yellow';
    return 'grey'; // Default color for unknown or no status
  };

  const color = determineColor();

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
