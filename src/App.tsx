import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { Game } from './classes/Game';
import TerminalComponent from './TerminalComponent';
import { useForceUpdate } from './utils/forceUpdate';

function App() {
  const forceUpdate = useForceUpdate();
  const [game] = useState(new Game());

  useEffect(() => {
    game.on('systemChange', (newSys) => {
      forceUpdate();
    });

    game.on('suspicionChange', (sus, oldSus) => {
      forceUpdate();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!game.currentSystem) {
    return (
      <div className='container'>
        <h1>Loading game..</h1>
      </div>
    );
  }

  return (
    <MantineProvider theme={{ colorScheme: 'dark' }} withNormalizeCSS>
      <Notifications />
      <div className='container'>
        <div className='progress'>
          <span
            className='bar'
            style={{
              width: '100%',
              clipPath: `polygon(0 0, ${game.suspicion}% 0, ${game.suspicion}% 100%, 0 100%)`,
            }}></span>
        </div>
        <TerminalComponent terminal={game.currentSystem?.terminal} />
      </div>
    </MantineProvider>
  );
}

export default App;
