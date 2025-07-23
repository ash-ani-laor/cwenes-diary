import { create } from 'zustand'

export interface WindowState {
  id: string // уникальный идентификатор окна (например, 'OR', 'Diary')
  visible: boolean // открыто или нет
  minimized: boolean // свернуто или нет
  x: number
  y: number
  width: number
  height: number
  payload?: any // что отображать (например, id расклада)
}

interface WindowManagerState {
  windows: Record<string, WindowState>
  openWindow: (id: string, payload?: any) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string, minimized?: boolean) => void
  moveWindow: (id: string, x: number, y: number) => void
  setWindowPayload: (id: string, payload: any) => void
}

export const useWindowManager = create<WindowManagerState>((set, get) => ({
  windows: {},
  openWindow: (id, payload) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...(state.windows[id] || {
            id,
            visible: true,
            minimized: false,
            x: 120 + Object.keys(state.windows).length * 30,
            y: 90 + Object.keys(state.windows).length * 30,
            width: 600,
            height: 460,
          }),
          visible: true,
          minimized: false,
          payload,
        },
      },
    })),
  closeWindow: (id) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...(state.windows[id] || {}),
          visible: false,
        },
      },
    })),
  minimizeWindow: (id, minimized = true) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...(state.windows[id] || {}),
          minimized,
        },
      },
    })),
  moveWindow: (id, x, y) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...(state.windows[id] || {}),
          x,
          y,
        },
      },
    })),
  setWindowPayload: (id, payload) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...(state.windows[id] || {}),
          payload,
        },
      },
    })),
}))
