import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'

import { Provider } from 'react-redux'
import store from '@/store'
import App from './App'
import color from '../color.json'
import 'uno.css'
import '@/styles/index.scss'

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: color.primary,
          colorInfo: color.info,
          colorSuccess: color.success,
          colorError: color.error,
          colorWarning: color.warning,
        },
        components: {
          Layout: {
            colorBgHeader: '#145181',
          },
        },
      }}
      autoInsertSpaceInButton
    >
      <Provider store={store}>
        <App />
      </Provider>
    </ConfigProvider>
  </StrictMode>
)
