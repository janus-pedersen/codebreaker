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
    <div className='container'>
      <TerminalComponent terminal={game.currentSystem?.terminal} />
    </div>
  );
}

export default App;
