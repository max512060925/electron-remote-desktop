import { contextBridge, ipcRenderer } from 'electron'

export const ipcRendererApi = {
  getSources: () => ipcRenderer.invoke('get-sources'),
  robotHandler: data => ipcRenderer.send('robot-handler', data),
}

contextBridge.exposeInMainWorld('ipcRenderer', ipcRendererApi)
