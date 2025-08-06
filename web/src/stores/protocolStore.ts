import { create } from 'zustand'
import type {
  ProtocolState,
  SymbolInstance,
  LinkInstance,
} from './protocolStore.types'

const defaultTags = ['хору']

const getInitialState = () => ({
  editingDivinationId: null,
  symbols: [],
  question: '',
  questionFixedTime: null,
  tempFixedTime: null,
  tags: defaultTags,
  links: [],
  isAddLinkMode: false,
  lastSavedAt: null,
  lastSavedData: null,
  version: 1,
  divinationId: null,
})

export const useProtocolStore = create<ProtocolState>((set, get) => ({
  ...getInitialState(),

  setEditingDivinationId: (id) => set({ editingDivinationId: id }),
  clearEditingDivinationId: () => set({ editingDivinationId: null }),

  setQuestion: (q) => set({ question: q }),
  setTempFixedTime: (date) => set({ tempFixedTime: date }),
  fixQuestion: () =>
    set((state) => ({
      questionFixedTime: state.tempFixedTime ?? new Date().toISOString(),
      tempFixedTime: null,
    })),

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

  updateSymbolPosition: (instanceId, x, y) =>
    set((state) => ({
      symbols: state.symbols.map((item) =>
        item.instanceId === instanceId ? { ...item, x, y } : item
      ),
    })),

  rotateSymbol: (instanceId) =>
    set((state) => ({
      symbols: state.symbols.map((item) =>
        item.instanceId === instanceId
          ? { ...item, rotation: ((item.rotation || 0) + 90) % 360 }
          : item
      ),
    })),

  removeSymbol: (instanceId) =>
    set((state) => ({
      symbols: state.symbols.filter((item) => item.instanceId !== instanceId),
    })),

  bringSymbolToFront: (instanceId) =>
    set((state) => {
      const idx = state.symbols.findIndex(
        (item) => item.instanceId === instanceId
      )
      if (idx === -1) return {}
      const newArr = [...state.symbols]
      const [item] = newArr.splice(idx, 1)
      newArr.push(item)
      return { symbols: newArr }
    }),

  setTags: (tags) => set({ tags }),
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
      if (state.links.length === 0) return {}
      const newLinks = [...state.links]
      const last = newLinks[newLinks.length - 1]
      last.points = [...last.points, { x, y }]
      newLinks[newLinks.length - 1] = last
      return { links: newLinks }
    }),
  finishLink: () => set({ isAddLinkMode: false }),
  removeLink: (id) =>
    set((state) => ({
      links: state.links.filter((link) => link.id !== id),
    })),

  markSaved: () => {
    set((state) => {
      const nextVersion = state.version + 1
      const snapshot = JSON.stringify({
        ...state,
        lastSavedAt: undefined,
        lastSavedData: undefined,
        version: nextVersion,
      })
      return {
        lastSavedAt: new Date().toISOString(),
        lastSavedData: snapshot,
        version: nextVersion,
      }
    })
  },

  reset: () =>
    set({
      ...getInitialState(),
      lastSavedAt: new Date().toISOString(),
      lastSavedData: JSON.stringify(getInitialState()),
    }),
}))
