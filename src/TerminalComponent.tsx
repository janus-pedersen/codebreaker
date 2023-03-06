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
      console.log('TerminalComponent useEffect()');

      terminal.on('input', (i) => {
        if (!i) {
          terminal.basic('');
          return;
        }

        if (terminal.shouldIgnore()) {
          return;
        }

        terminal.info(i, true);

        const cmdName = i.split(' ')[0];
        const args = i.match(/(?:[^\s"]+|"[^"]*"|'[^']*')+/g);
        if (args) {
          args.shift();
          args.forEach((a, i) => {
            if (a.startsWith('"') && a.endsWith('"')) {
              args[i] = a.slice(1, -1);
            }
          });
        }

        const command = terminal.system.commandManager.getCommand(cmdName);
        if (!command) {
          terminal.error(`Command not found: ${cmdName}`, false);
          return;
        }

        try {
          const parsedArgs = command?.parseArgs(args!);
          console.log(args, parsedArgs);
          (command?.exec as any)(terminal.system, ...(parsedArgs || []));
        } catch (e) {
          terminal.error((e as any).message, false);
        }

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
