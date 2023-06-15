import { Button, Form, Image, Card } from 'antd'
import { filter } from 'rxjs'
import { useDispatch } from 'react-redux'

export default () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [sources, setSources] = useState([])
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const onFinish = ({ code }) => {
    setLoading(true)
    subscribeSubject.next({
      channel: 'connect',
      data: code.trim(),
    })
  }
  const goRemote = source => {
    dispatch(setSource(source))
    navigate(`/control?id=${peer.id}`)
  }

  const subscribe = subscribeSubject
    .pipe<{ channel: string; data?: any }>(
      filter(({ channel }) => channel === 'get-sources')
    )
    .subscribe(({ data }) => {
      if (data.length) {
        data.length > 1 ? setSources(data) : goRemote(data[0])
      }
      setLoading(false)
    })

  useLayoutEffect(() => subscribe.unsubscribe(), [])
  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <Form
        layout='inline'
        form={form}
        initialValues={{
          code: 'f567ebe4-b75a-4176-94ca-d1adb28cbbf6',
        }}
        onFinish={onFinish}
        autoComplete='off'
      >
        <Form.Item
          name='code'
          rules={[{ required: true, message: '请输入识别码!' }]}
          help={<></>}
        >
          <MyInput placeholder='请输入识别码' />
        </Form.Item>
        <Form.Item>
          <Button htmlType='submit' type='primary' loading={loading}>
            链接
          </Button>
        </Form.Item>
      </Form>
      {Boolean(sources.length) && (
        <section className='flex max-w-80% w-full'>
          {sources.map((source, i) => (
            <Card
              className='mx-2 flex-1 cursor-pointer '
              key={i}
              hoverable
              onClick={() => goRemote(source)}
            >
              <Image src={source.thumbnail} preview={false} width='100%' />
            </Card>
          ))}
        </section>
      )}
    </div>
  )
}
