import React from 'react';
import { View, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

const styles = {
  ball: {
    height: 50,
    width: 50,
    backgroundColor: 'lightblue',
    borderRadius: 25,
    position: 'absolute',
  },
};

function Paddle({ position }) {
  return (
    <View
      style={{
        ...styles.ball,
        height: Math.abs(100 + position.z),
        width: Math.abs(100 + position.z),
        borderRadius: Math.abs(50 + position.z),
        top: position.y,
        left: position.x,
        transition: 'top 1s; left 1s;',
      }}
    />
  );
}

export default Paddle;
