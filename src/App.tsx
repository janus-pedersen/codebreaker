import { System } from './classes/System';
import TerminalComponent from './TerminalComponent';

function App() {
  const system = new System('Home');

  return (
    <div className='container'>
      <TerminalComponent terminal={system.terminal} />
    </div>
  );
}

export default App;
