import { Suspense } from 'react'
import {
  RouterProvider,
  // createBrowserRouter,
  createHashRouter,
} from 'react-router-dom'
import { Spin } from 'antd'

export default () => (
  <Suspense
    fallback={
      <Spin
        className='w-full h-full flex items-center justify-center'
        size='large'
      />
    }
  >
    <RouterProvider router={createHashRouter(renderRouter(menuRoutes))} />
  </Suspense>
)
