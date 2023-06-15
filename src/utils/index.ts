import { Peer } from 'peerjs'
import type { DataConnection } from 'peerjs'
import { Subject } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'
export const deepClone = origin =>
  typeof origin === 'object' ? JSON.parse(JSON.stringify(origin)) : origin
export const subscribeSubject = new Subject()

export const peer = new Peer(uuidv4(), {
  host: import.meta.env.VITE_APP_HOST,
  port: import.meta.env.VITE_APP_PORT,
  path: import.meta.env.VITE_APP_PATH,
})
let conn: DataConnection
subscribeSubject.subscribe(({ channel, data }) => {
  if (channel === 'connect') {
    conn = peer.connect(data)
    conn.on('open', () =>
      conn.send({
        channel: 'get-sources',
      })
    )
    conn.on('data', ({ channel, data }) => {
      if (channel === 'get-sources') {
        subscribeSubject.next({
          channel,
          data,
        })
      }
    })
  } else {
    conn?.send({
      channel,
      data,
    })
  }
})
