import { Input, Form } from 'antd'
import styles from './MyInput.module.scss'

export default ({ model = '', placeholder = '', ...props }) => {
  const [isFocus, setIsFocus] = useState(false)
  const isActive = useMemo(
    () =>
      isFocus ||
      (Array.isArray(props.value)
        ? props.value?.length
        : props.value || typeof props.value === 'number'),
    [isFocus, props.value]
  )
  const { status, errors } = Form.Item.useStatus()
  const focus = (propsFocus: Function, e: Event) => {
    setIsFocus(true)
    propsFocus?.(e)
  }
  const blur = (propsBlur: Function, e: Event) => {
    setIsFocus(false)
    propsBlur?.(e)
  }
  const InputComponents = {
    '': Input,
    'password': Input.Password,
    'textarea': Input.TextArea,
  }
  const InputComponent =
    InputComponents[(props.type as keyof typeof InputComponents) || '']
  return (
    <div className={`${styles['my-input']} relative ${props.className}`}>
      <label
        className={[
          'placeholder-label',
          isActive ? 'acitive' : '',
          props.type,
          status,
        ]
          .join(' ')
          .trim()}
        style={{
          left: `calc(${isActive ? '12px' : '4px'} + ${props.left || '0px'})`,
        }}
      >
        {status === 'error' ? String(errors) : placeholder}
      </label>

      <InputComponent
        {...props}
        onFocus={e => focus(props.onFocus, e)}
        onBlur={e => blur(props.onBlur, e)}
      />
    </div>
  )
}
