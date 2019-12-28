import React from 'react';
import { View } from 'react-native';

function Ball({ position }) {
  return (
    <View
      style={{
        height: position.height,
        width: position.width,
        borderRadius: position.borderRadius,
        backgroundColor: 'black',
        top: position.y,
        left: position.x,
        zIndex: 9999,
        position: 'absolute',
      }}
    />
  );
}

export default Ball;
