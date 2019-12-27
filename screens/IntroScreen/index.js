import React from 'react';
import { Dimensions, Text, View, TouchableOpacity } from 'react-native';

const { height } = Dimensions.get('window');

const styles = {
  container: {
    backgroundColor: '#ffc44f',
    paddingTop: 40,
    paddingLeft: 20,
    paddingRight: 20,
    height,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
    marginTop: 40,
    flex: 1,
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

function TitleButton({ text, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
}

function IntroScreen({ handlePlay, handleOptions }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paddle Pong</Text>
      <View style={styles.options}>
        <TitleButton text="Play" onPress={handlePlay} />
        <TitleButton text="Options" onPress={handleOptions} />
      </View>
    </View>
  );
}

export default IntroScreen;
