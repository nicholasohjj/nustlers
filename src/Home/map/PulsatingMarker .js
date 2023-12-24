import React from 'react';
import { View } from 'react-native';
import * as Animatable from 'react-native-animatable';

const PulsatingMarker = () => {
  const pulseAnimation = {
    0: { scale: 0.5, opacity: 1 },
    0.5: { scale: 1.2, opacity: 0.7 },
    1: { scale: 0.5, opacity: 1 }
  };

  return (
    <Animatable.View
      animation={pulseAnimation}
      duration={2000}
      easing="ease-out"
      iterationCount="infinite"
      style={{ width: 24, height: 24, backgroundColor: 'blue', borderRadius: 12 }}
    />
  );
};

export default PulsatingMarker;
