/* * web/src/stores/protocolStore.ts */
import { create } from 'zustand'

export interface SymbolInstance {
  id: number // ID из набора
  symbol: string
  isRune: boolean
  instanceId: string
  x: number
  y: number
  rotation?: number
}

export interface LinkInstance {
  id: string
  fromInstanceId: string
  points: { x: number; y: number }[]
}

interface ProtocolState {
  symbols: SymbolInstance[]
  question: string
  questionFixedTime: string | null
  links: LinkInstance[]
  isAddLinkMode: boolean

  addSymbol: (symbol: Omit<SymbolInstance, 'instanceId'>) => void
  updateSymbolPosition: (instanceId: string, x: number, y: number) => void
  rotateSymbol: (instanceId: string) => void
  setQuestion: (q: string) => void
  fixQuestion: () => void
  reset: () => void
  removeSymbol: (instanceId: string) => void

  toggleAddLinkMode: () => void
  startLink: (instanceId: string, x: number, y: number) => void
  addLinkPoint: (x: number, y: number) => void
  finishLink: () => void
  removeLink: (id: string) => void
}

export const useProtocolStore = create<ProtocolState>((set, get) => ({
  symbols: [],
  question: '',
  questionFixedTime: null,
  links: [],
  isAddLinkMode: false,

  addSymbol: (symbol) =>
    set((state) => ({
      symbols: [
        ...state.symbols,
        {
          ...symbol,
          instanceId: `${symbol.id}-${Date.now()}-${Math.random()}`,
          rotation: 0,
        },
      ],
    })),

  updateSymbolPosition: (instanceId, x, y) => {
    console.log('store update:', { instanceId, x, y })
    set((state) => ({
      symbols: state.symbols.map((item) =>
        item.instanceId === instanceId ? { ...item, x, y } : item
      ),
    }))
  },

  rotateSymbol: (instanceId) =>
    set((state) => ({
      symbols: state.symbols.map((item) =>
        item.instanceId === instanceId
          ? { ...item, rotation: ((item.rotation || 0) + 90) % 360 }
          : item
      ),
    })),

  setQuestion: (q) => set({ question: q }),

  fixQuestion: () =>
    set({
      questionFixedTime: new Date().toISOString(),
    }),

  reset: () =>
    set({
      symbols: [],
      question: '',
      questionFixedTime: null,
      links: [],
      isAddLinkMode: false,
    }),

  removeSymbol: (instanceId) =>
    set((state) => ({
      symbols: state.symbols.filter((item) => item.instanceId !== instanceId),
    })),

  toggleAddLinkMode: () =>
    set((state) => ({ isAddLinkMode: !state.isAddLinkMode })),

  startLink: (instanceId, x, y) =>
    set((state) => ({
      links: [
        ...state.links,
        {
          id: `${instanceId}-${Date.now()}`,
          fromInstanceId: instanceId,
          points: [{ x, y }],
        },
      ],
    })),

  addLinkPoint: (x, y) =>
    set((state) => {
      if (state.links.length === 0) return {} as any
      const newLinks = [...state.links]
      const last = newLinks[newLinks.length - 1]
      last.points = [...last.points, { x, y }]
      newLinks[newLinks.length - 1] = last
      return { links: newLinks }
    }),
  finishLink: () =>
    set((state) => {
      // Можно просто выключить режим
      return { isAddLinkMode: false }
    }),
  removeLink: (id) =>
    set((state) => ({
      links: state.links.filter((link) => link.id !== id),
    })),
}))
