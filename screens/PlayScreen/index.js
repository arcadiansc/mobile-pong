import React, { useState, useEffect, useRef } from 'react';
import { Accelerometer } from 'expo-sensors';
import { Dimensions, Text, View, TouchableOpacity } from 'react-native';

const { height } = Dimensions.get('window');

const styles = {
  countdownContainer: {
    backgroundColor: '#ffc44f',
    paddingLeft: 20,
    paddingRight: 20,
    height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 64,
    fontWeight: 'bold',
  },
  button: {
    height: 50,
    width: 120,
    backgroundColor: '#04588c',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  options: {
    flex: 1,
  },
};

function PlayScreen() {
  const [currentGameState, setCurrentGameState] = useState('STARTING');
  const [countDown, setCountDown] = useState(3);
  const countIntervalRef = useRef(false);
  const countRef = useRef(3);
  const accelListener = useRef(false);

  function startCountDown() {
    countIntervalRef.current = setInterval(() => {
      setCountDown(countRef.current - 1);
      countRef.current = countRef.current - 1;
      if (countRef.current <= 0) {
        clearInterval(countIntervalRef.current);
        countIntervalRef.current = false;
        setCurrentGameState('PLAYING');
      }
    }, 1000);
  }

  useEffect(() => {
    startCountDown();
  }, []);

  function startAccelListen() {
    accelListener.current = Accelerometer.addListener(accelerometerData => {
      console.log('accelerometerData: ', accelerometerData);
    });
  }

  useEffect(() => {
    if (currentGameState === 'STARTING') {
      startAccelListen();
    }
  }, [currentGameState]);

  return (
    <React.Fragment>
      {currentGameState === 'STARTING' && (
        <View style={styles.countdownContainer}>
          <Text style={styles.title}>{countDown}</Text>
        </View>
      )}
    </React.Fragment>
  );
}

export default PlayScreen;
