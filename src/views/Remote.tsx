import { Button, theme, ConfigProvider } from 'antd'
import { v4 as uuidv4 } from 'uuid'
import { useLocalStorage, useCopyToClipboard } from 'react-use'
import { Peer } from 'peerjs'

const { ipcRenderer } = window

export default () => {
  const [id, setId] = useLocalStorage('id', uuidv4())
  const [, copyToClipboard] = useCopyToClipboard()
  const { token } = theme.useToken()
  const peer = new Peer(id, {
    host: import.meta.env.VITE_APP_HOST,
    port: import.meta.env.VITE_APP_PORT,
    path: import.meta.env.VITE_APP_PATH,
  })
  peer.on('connection', conn => {
    conn.on('data', async ({ channel, data }) => {
      switch (channel) {
        case 'get-sources':
          conn.send({
            channel: 'get-sources',
            data: await ipcRenderer?.getSources(),
          })
          break
        case 'get-stream':
          const {
            peerId,
            id,
            screen: { size, scaleFactor },
          } = data
          const width = size.width * scaleFactor
          const height = size.height * scaleFactor
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
              //@ts-ignore
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: id,
                width,
                height,
                frameRate: 60,
              },
            },
          })
          const videoTrack = stream.getVideoTracks()[0]
          // 应用视频约束条件
          const constraints = {
            width: { ideal: size.width },
            height: { ideal: size.height },
            frameRate: { exact: 60 },
            // videoBitrate: { exact: 5000000 }, // 设置视频比特率为 2Mbps
          }
          await videoTrack.applyConstraints(constraints)
          peer.call(peerId, stream)
          break
        case 'mouse-move':
        case 'mouse-toggle':
        case 'mouse-click':
        case 'drag-mouse':
        case 'key-toggle':
        case 'scroll-mouse':
          ipcRenderer?.robotHandler({
            channel,
            data,
          })
          break
      }
    })
  })

  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <h3>本机识别码</h3>
      <h4 className='my-2'>{id}</h4>
      <div>
        <Button type='primary' onClick={() => setId(uuidv4())}>
          重新生成
        </Button>
        <ConfigProvider theme={{ token: { colorPrimary: token.colorWarning } }}>
          <Button className='ml-2' onClick={() => copyToClipboard(id)}>
            复制
          </Button>
        </ConfigProvider>
      </div>
    </div>
  )
}
