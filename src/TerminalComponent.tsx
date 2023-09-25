import { Terminal } from './classes/Terminal';
import { useEffect, useState } from 'react';
import {
  ColorMode,
  TerminalOutput,
  default as TerminalUi,
} from 'react-terminal-ui';
import { useForceUpdate } from './utils/forceUpdate';

export default function TerminalComponent({
  terminal,
}: {
  terminal: Terminal;
}) {
  const forceUpdate = useForceUpdate();
  const renderHistory = 50;

  useEffect(() => {
    const onInput = async (i: string) => {
      await terminal.system.commandManager.handleCommand(i, terminal.system);
    };


    const onRender = () => {
      forceUpdate();
      terminal.updatePrompt();
      const item = document.getElementsByClassName('react-terminal').item(0);
      item?.scrollTo(0, item.scrollHeight);
    };
    (async () => {
      terminal.on('input', onInput);
      terminal.on('render', onRender);
    })();
    terminal.emit('setup');
    terminal.updatePrompt();

    return () => {
      terminal.off('input', onInput);
      terminal.off('render', onRender);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terminal]);

  return (
    <TerminalUi
      colorMode={ColorMode.Dark}
      name={terminal.system.user.name + '@' + terminal.system.name}
      prompt={terminal.prompt}
      height='100%'
      onInput={(input) => {
        terminal.handleInput(input);
      }}>
      {terminal.history
        .slice(
          Math.max(terminal.history.length - renderHistory, 0),
          terminal.history.length,
        )
        .map((t, i) => (
          <TerminalOutput key={i}>{t}</TerminalOutput>
        ))}
    </TerminalUi>
  );
}
