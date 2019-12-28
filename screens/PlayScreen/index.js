import React, { useState, useEffect, useRef } from 'react';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import { Dimensions, Text, View, TouchableOpacity, Button } from 'react-native';
import ScoreBar from './components/ScoreBar';
import Paddle from './components/Paddle';
import Ball from './components/Ball';

const { height, width } = Dimensions.get('window');

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

const CENTER_TOP = height / 2;
const CENTER_LEFT = width / 2 - 50;

const BALL_DIRECTIONS = {
  DOWN: 'DOWN',
  UP: 'UP',
};

const BOUNCE_SPEED = 3;

const DEFAULT_PADDLE_POSITION = {
  x: CENTER_LEFT,
  y: CENTER_TOP,
  z: 1,
};

const DEFAULT_BALL_POSITION = {
  x: CENTER_LEFT,
  y: CENTER_TOP,
  height: 50,
  width: 50,
  borderRadius: 25,
};

function PlayScreen() {
  const [currentGameState, setCurrentGameState] = useState('PLAYING');
  const [countDown, setCountDown] = useState(3);
  const [paddlePosition, setPaddlePosition] = useState(DEFAULT_PADDLE_POSITION);
  const [ballPosition, setBallPosition] = useState(DEFAULT_BALL_POSITION);
  const [score, setScore] = useState(0);
  const [gyro, setGyro] = useState({ x: 0, y: 0, z: 0 });
  const maxZ = useRef(0);
  const countIntervalRef = useRef(false);
  const countRef = useRef(3);
  const gyroscopeListener = useRef(false);
  const ballZDirection = useRef(BALL_DIRECTIONS.DOWN);
  const ballXYDirection = useRef({ x: 0, y: 0 });
  const ballBounceInterval = useRef(false);

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

  function checkBallCollision() {
    const topCover = paddlePosition.y;
    const bottomCover = paddlePosition.y + 100;
    const leftCover = paddlePosition.x;
    const rightCover = paddlePosition.x + 100;

    const ballTopCover = ballPosition.y;
    const ballBottomCover = ballPosition.y + ballPosition.height;
    const ballLeftCover = ballPosition.x;
    const ballRightCover = ballPosition.x + ballPosition.width;

    if (
      ballTopCover > topCover &&
      ballBottomCover < bottomCover &&
      (ballLeftCover > leftCover && ballRightCover < rightCover)
    ) {
      const yDir = ballTopCover - topCover - 50;
      const xDir = ballLeftCover - leftCover - 50;
      ballXYDirection.current = { x: xDir * 0.1, y: yDir * 0.1 };
      return true;
    }
    return false;
  }

  useEffect(() => {
    if (ballPosition.height <= 20 && currentGameState !== 'LOST') {
      setCurrentGameState('LOST');
      return;
    }
    if (
      ballPosition.height <= 25 &&
      ballZDirection.current === BALL_DIRECTIONS.DOWN &&
      checkBallCollision()
    ) {
      setScore(state => state + 1);
      ballZDirection.current = BALL_DIRECTIONS.UP;
    } else if (
      ballPosition.height > 50 &&
      ballZDirection.current === BALL_DIRECTIONS.UP
    ) {
      ballZDirection.current = BALL_DIRECTIONS.DOWN;
    }
  }, [ballPosition]);

  function ballBounceStart() {
    ballBounceInterval.current = setInterval(() => {
      const heightWidthInterval =
        ballZDirection.current === BALL_DIRECTIONS.DOWN ? -1 : 1;

      setBallPosition(state => ({
        ...state,
        y: state.y + ballXYDirection.current.y,
        x: state.x + ballXYDirection.current.x,
        height: state.height + 1 * BOUNCE_SPEED * heightWidthInterval,
        width: state.width + 1 * BOUNCE_SPEED * heightWidthInterval,
        borderRadius:
          state.borderRadius + 0.5 * BOUNCE_SPEED * heightWidthInterval,
      }));
    }, 50);
  }

  function updateFast() {
    Gyroscope.setUpdateInterval(16);
  }

  function updateSlow() {
    Gyroscope.setUpdateInterval(1000);
  }

  useEffect(() => {
    startCountDown();
    startAccelListen();
    ballBounceStart();
  }, []);

  function handleMovePaddle(gyroData) {
    const { x, y, z } = gyroData;

    setGyro({ x, y, z });

    // if (z > 0.2 || z < -0.2) return;

    if (x < -0.1 || x > 0.1 || (y < -0.1 || y > 0.1)) {
      setPaddlePosition(state => ({
        ...state,
        x: state.x + y * 20,
        y: state.y + x * 20,
      }));
    }
  }

  function startAccelListen() {
    updateFast();
    gyroscopeListener.current = Gyroscope.addListener(handleMovePaddle);
  }

  function round(n) {
    if (!n) {
      return 0;
    }

    return Math.floor(n * 100) / 100;
  }

  function centerBall() {
    setPaddlePosition({
      ...paddlePosition,
      x: CENTER_LEFT,
      y: CENTER_TOP,
    });
  }

  function restartGame() {
    ballXYDirection.current = { x: 0, y: 0 };
    setPaddlePosition(DEFAULT_PADDLE_POSITION);
    setScore(0);
    setBallPosition(DEFAULT_BALL_POSITION);
    setCurrentGameState('PLAYING');
  }
  return (
    <React.Fragment>
      {currentGameState === 'STARTING' && (
        <View style={styles.countdownContainer}>
          <Text style={styles.title}>{countDown}</Text>
        </View>
      )}
      {currentGameState === 'PLAYING' && (
        <View>
          <ScoreBar score={score} />
          <Text>
            x: {round(gyro.x)} y: {round(gyro.y)} z: {round(gyro.z)}
          </Text>
          <Text>Max Z: {round(maxZ.current)}</Text>
          <Paddle position={paddlePosition} />
          <Ball position={ballPosition} />
          <Button title="Center" onPress={centerBall} />
        </View>
      )}
      {currentGameState === 'LOST' && (
        <View style={{ height }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 64,
              fontWeight: 'bold',
              marginTop: height / 2,
            }}
          >
            You LOST Score: {score}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: 'lightgray',
              height: 50,
              width: 150,
              position: 'absolute',
              bottom: 50,
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
            }}
            onPress={restartGame}
          >
            <Text>Restart</Text>
          </TouchableOpacity>
        </View>
      )}
    </React.Fragment>
  );
}

export default PlayScreen;
