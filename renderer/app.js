import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { spawn } from 'child_process';

const terminalContainer = document.getElementById('terminal-container');

// Initialize terminal
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
fitAddon.fit(); // Adjust terminal to container size

// Detect platform and shell
const isWindows = process.platform === 'win32';
const shell = isWindows ? 'powershell.exe' : process.env.SHELL || 'bash';

// Spawn shell process
const shellProcess = spawn(shell, [], {
  stdio: 'pipe',
  shell: false,
});

// Pipe shell output to terminal
shellProcess.stdout.on('data', (data) => {
  term.write(data.toString());
});

shellProcess.stderr.on('data', (data) => {
  term.write(data.toString());
});

// Pipe terminal input to shell
term.onData((data) => {
  shellProcess.stdin.write(data);
});

// Handle shell exit
shellProcess.on('exit', (code) => {
  term.write(`\r\n\nShell exited with code ${code}`);
});
