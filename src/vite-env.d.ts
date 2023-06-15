/// <reference types="vite/client" />
/// <reference types="@vue-macros/reactivity-transform/macros-global" />

export {}
import { ipcRendererApi } from '../main/preload'

declare global {
  export interface Window {
    ipcRenderer: typeof ipcRendererApi | undefined
  }
}
