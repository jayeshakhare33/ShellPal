// main.js
import { app, BrowserWindow, ipcMain } from 'electron';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let shellProcess;
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: "ShellPal"
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  spawnShell(); // Start shell when window is created
}

function spawnShell() {
  const isWindows = process.platform === 'win32';
  const shell = isWindows ? 'powershell.exe' : process.env.SHELL || 'bash';

  shellProcess = spawn(shell, [], { stdio: 'pipe', shell: false });

  shellProcess.stdout.on('data', (data) => {
    mainWindow.webContents.send('terminal-output', data.toString());
  });

  shellProcess.stderr.on('data', (data) => {
    mainWindow.webContents.send('terminal-error', data.toString());
  });

  shellProcess.on('exit', (code) => {
    mainWindow.webContents.send('terminal-exit', code);
  });

  // Handle input from renderer
  ipcMain.on('terminal-input', (_event, input) => {
    if (shellProcess && shellProcess.stdin.writable) {
      shellProcess.stdin.write(input);
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
