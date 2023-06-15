import { app, desktopCapturer, BrowserWindow, ipcMain, screen } from 'electron'
import isDev from 'electron-is-dev'
import robot from 'robotjs'

import { join } from 'node:path'

const gotTheLock = app.requestSingleInstanceLock(process.argv.slice(1))
if (!gotTheLock) {
  app.exit()
} else {
  app.whenReady().then(async () => {
    const win = new BrowserWindow({
      webPreferences: {
        preload: join(__dirname, 'preload.cjs'),
      },
    })
    win.setMenu(null)
    win.loadURL(
      isDev
        ? new URL(`http://localhost:3100/#/remote`).href
        : new URL(`file://${join(__dirname, './index.html')}#/remote`).href
    )

    win.webContents.openDevTools({ mode: 'undocked' })
    ipcMain.handle('get-sources', async () => {
      const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: {
          width: 1024,
          height: 1024,
        },
      })
      const displays = screen.getAllDisplays()
      return sources.map(({ thumbnail, ...v }) => ({
        ...v,
        screen: displays.find(({ id }) => id === Number(v.display_id)),
        thumbnail: thumbnail.toDataURL(),
      }))
    })
    ipcMain.on('robot-handler', (e, { channel, data }) => {
      try {
        switch (channel) {
          case 'mouse-move':
            robot.moveMouse(data.x, data.y)
            break
          case 'mouse-toggle':
            {
              const { x, y } = data[2]
              robot.moveMouse(x, y)
              robot.mouseToggle(data[0], data[1])
            }
            break
          case 'mouse-click':
            {
              const { x, y } = data[2]
              robot.moveMouse(x, y)
              robot.mouseClick(data[0], data[1])
            }
            break
          case 'drag-mouse':
            robot.dragMouse(data.x, data.y)
            break
          case 'key-toggle':
            robot.keyToggle(data[0], data[1])
            break
          case 'scroll-mouse':
            robot.scrollMouse(data.x, data.y)
            break
        }
      } catch (e) {
        console.error(e)
        console.error(data)
      }
    })
  })
}
