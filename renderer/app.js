import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';

const terminalContainer = document.getElementById('terminal-container');

// Initialize xterm.js
const term = new Terminal({
  cursorBlink: true,
  fontSize: 14,
  theme: {
    background: '#1e1e1e',
    foreground: '#ffffff',
  },
});
const fitAddon = new FitAddon();
term.loadAddon(fitAddon);
term.open(terminalContainer);
fitAddon.fit();

// Send user input to main process
term.onData((data) => {
  window.api.sendInput(data);
});

// Receive shell output from main process
window.api.onOutput((data) => {
  term.write(data);
});

window.api.onError((data) => {
  term.write(`\x1b[31m${data}\x1b[0m`); // Red text for errors
});

window.api.onExit((code) => {
  term.write(`\r\n\n\x1b[33mShell exited with code ${code}\x1b[0m`);
});
