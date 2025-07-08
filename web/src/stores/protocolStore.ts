/*
 * web/src/stores/protocolStore.ts
 */
import { create } from 'zustand'

export interface SymbolInstance {
  id: number        // ID из набора
  symbol: string
  isRune: boolean
  instanceId: string
  x: number
  y: number
  rotation?: number
}

interface ProtocolState {
  symbols: SymbolInstance[]
  question: string
  questionFixedTime: string | null
  addSymbol: (symbol: Omit<SymbolInstance, 'instanceId'>) => void
  updateSymbolPosition: (instanceId: string, x: number, y: number) => void
  rotateSymbol: (instanceId: string) => void
  setQuestion: (q: string) => void
  fixQuestion: () => void
  reset: () => void
}

export const useProtocolStore = create<ProtocolState>((set) => ({
  symbols: [],
  question: '',
  questionFixedTime: null,

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
    }),
}))
