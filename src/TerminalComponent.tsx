import { Terminal } from './classes/Terminal';
import { useState, useEffect } from 'react';
import {
  ColorMode,
  TerminalOutput,
  default as TerminalUi,
} from 'react-terminal-ui';

function useForceUpdate() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
}

export default function TerminalComponent({
  terminal,
}: {
  terminal: Terminal;
}) {
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    (async () => {
      terminal.on('input', (i) => {
        terminal.system.commandManager.handleCommand(i, terminal.system);

        terminal.emit('render');
      });

      terminal.on('render', () => {
        terminal.updatePrompt();
        forceUpdate();
      });
    })();
    terminal.updatePrompt();
    terminal.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TerminalUi
      colorMode={ColorMode.Dark}
      name={terminal.system.user.name + '@' + terminal.system.name}
      prompt={terminal.prompt}
      height='100%'
      onInput={(input) => {
        terminal.handleInput(input);
      }}>
      {terminal.history.map((t, i) => (
        <TerminalOutput key={i}>{t}</TerminalOutput>
      ))}
    </TerminalUi>
  );
}
