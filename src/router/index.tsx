import type { RouteObject } from 'react-router-dom'

const views = import.meta.glob('../views/**.tsx')

const componentsMap = new Map<string, React.ComponentType>()
Object.entries(views).forEach(([k, v]: [string, any]) =>
  componentsMap.set(k, lazy(v))
)

export interface RoutesType {
  path: string
  component?: string
  redirect?: string
  // children?: RoutesType[]
}

export const pageChildren = Object.entries(views).reduce(
  (arr: any[], [component]) => {
    const name: string =
      component.split('/').pop()?.split('.')[0].toLowerCase() || ''
    arr.push({
      path: name,
      component,
    })
    return arr
  },
  []
)
export const menuRoutes = [
  ...pageChildren,
  {
    path: '*',
    redirect: '/home',
  },
]

export const renderRouter = (routes: RoutesType[]): RouteObject[] =>
  routes.map(({ path, component, redirect }) => ({
    path,
    ...(component && {
      Component: componentsMap.get(component),
    }),
    ...(redirect && {
      element: <Navigate to={redirect} />,
    }),
    // ...(children?.length && {
    //   children: renderRouter(children),
    // }),
  }))
