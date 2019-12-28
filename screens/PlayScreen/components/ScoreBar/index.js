import React from 'react';
import { View, Text } from 'react-native';

const styles = {
  container: {
    flexDirection: 'row',
    paddingTop: 50,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    backgroundColor: 'indianred',
    justifyContent: 'alignItems',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  label: {
    marginBottom: 5,
  },
  score: {
    fontWeight: 'bold',
    color: 'white',
  },
};
function ScoreBar({ score }) {
  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <Text style={styles.label}>Score</Text>
        <Text style={styles.score}>{score}</Text>
      </View>
    </View>
  );
}

export default ScoreBar;
