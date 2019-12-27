import React, { useState } from 'react';
import IntroScreen from './screens/IntroScreen';
import PlayScreen from './screens/PlayScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('INTRO');

  function handlePlay() {
    setCurrentScreen('PLAY');
  }

  function handleOptions() {
    setCurrentScreen('OPTIONS');
  }

  return (
    <React.Fragment>
      {currentScreen === 'INTRO' && (
        <IntroScreen handlePlay={handlePlay} handleOptions={handleOptions} />
      )}
      {currentScreen === 'PLAY' && <PlayScreen />}
    </React.Fragment>
  );
}
