import { useSelector } from 'react-redux'
import { useVideo, useMeasure, useMouse } from 'react-use'
import { throttle } from 'lodash'
export default () => {
  const source = useSelector(({ control: { source } }) => source)
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [video, state, controls, videoRef] = useVideo(
    <video autoPlay className='w-full h-full absolute pointer-events-none' />
  )
  const [box, { width, height }] = useMeasure()
  const drag = useRef(false)
  const isFocus = useRef(false)
  const boxRef = useRef<HTMLDivElement>(null)
  const { elX, elY } = useMouse(boxRef)
  const ratio = useMemo(
    () => `${source?.screen.bounds.width}/${source?.screen.bounds.height}`,
    [source]
  )
  const bounds = useMemo(() => source?.screen.bounds, [source])

  const setBoxRef = ref => {
    if (!boxRef.current && ref) {
      boxRef.current = ref
      return box(ref)
    }
    return null
  }

  const mouseToggle = ({ button }, data) => {
    if (data === 'down' || drag.current) {
      drag.current = true
      if (isFocus.current) {
        subscribeSubject.next({
          channel: 'mouse-toggle',
          data: [
            data,
            MouseButton[button],
            {
              x: bounds.x + elX / scale,
              y: bounds.y + elY / scale,
            },
          ],
        })
      }
    }
  }

  const mouseDoubleClick = ({ button }) => {
    drag.current = false
    if (isFocus.current) {
      subscribeSubject.next({
        channel: 'mouse-click',
        data: [
          MouseButton[button],
          true,
          {
            x: bounds.x + elX / scale,
            y: bounds.y + elY / scale,
          },
        ],
      })
    }
  }
  const mouseClick = ({ button }) => {
    drag.current = false
    if (isFocus.current) {
      subscribeSubject.next({
        channel: 'mouse-click',
        data: [
          MouseButton[button],
          false,
          {
            x: bounds.x + elX / scale,
            y: bounds.y + elY / scale,
          },
        ],
      })
    }
  }

  const scale = useMemo(
    () => Math.min(width / bounds?.width, height / bounds?.height),
    [width, height]
  )
  peer.on('call', call => {
    call.answer()
    call.on('stream', stream => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => videoRef.current.play()
      }
    })
  })

  const throttled = throttle(([elX, elY]) => {
    if (
      elX > 0 &&
      elY > 0 &&
      elX / scale <= bounds.width &&
      elY / scale <= bounds.height
    ) {
      subscribeSubject.next({
        channel: drag.current ? 'drag-mouse' : 'mouse-move',
        data: {
          x: bounds.x + elX / scale,
          y: bounds.y + elY / scale,
        },
      })
    }
  }, 300)

  const keydown = e => {
    e.preventDefault()
    const { key } = e
    console.log(key)
    if (isFocus.current) {
      subscribeSubject.next({
        channel: 'key-toggle',
        data: [(KeyMap[key] || key).toLowerCase(), 'down'],
      })
    }
  }
  const keyup = e => {
    e.preventDefault()
    const { key } = e
    if (isFocus.current) {
      subscribeSubject.next({
        channel: 'key-toggle',
        data: [(KeyMap[key] || key).toLowerCase(), 'up'],
      })
    }
  }
  const wheel = e => {
    if (isFocus.current) {
      subscribeSubject.next({
        channel: 'scroll-mouse',
        data: {
          x: -e.deltaX,
          y: -e.deltaY,
        },
      })
    }
  }

  useEffect(() => {
    if (isFocus.current) {
      throttled([elX, elY])
    }
  }, [elX, elY])

  useLayoutEffect(() => {
    if (!source) {
      navigate('/home')
    } else {
      subscribeSubject.next({
        channel: 'get-stream',
        data: {
          ...source,
          peerId: params.get('id'),
        },
      })
    }
  }, [])
  return (
    <section className='w-full h-full relative bg-#202123'>
      {scale}
      <div
        tabIndex={0}
        className={[
          'absolute',
          'max-w-full',
          'max-h-full',
          'left-1/2',
          'top-1/2',
          '-translate-x-1/2',
          '-translate-y-1/2',
          'outline-none',
          bounds?.width >= bounds?.height ? 'w-full' : 'h-full',
        ].join(' ')}
        style={{ aspectRatio: ratio }}
        ref={setBoxRef}
        onMouseDown={e => mouseToggle(e, 'down')}
        onMouseUp={e => mouseToggle(e, 'up')}
        onContextMenu={e => e.preventDefault()}
        onDoubleClick={mouseDoubleClick}
        onClick={mouseClick}
        onFocus={() => (isFocus.current = true)}
        onBlur={() => (isFocus.current = false)}
        onKeyDown={keydown}
        onKeyUp={keyup}
        onWheel={wheel}
      >
        {video}
      </div>
    </section>
  )
}
