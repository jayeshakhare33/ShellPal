// preload.js
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  sendInput: (data) => ipcRenderer.send('terminal-input', data),
  onOutput: (callback) => ipcRenderer.on('terminal-output', (_event, data) => callback(data)),
  onError: (callback) => ipcRenderer.on('terminal-error', (_event, data) => callback(data)),
  onExit: (callback) => ipcRenderer.on('terminal-exit', (_event, code) => callback(code)),
});
