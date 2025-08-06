export interface SymbolInstance {
  id: number
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

export interface ProtocolState {
  editingDivinationId: number | null
  setEditingDivinationId: (id: number) => void
  clearEditingDivinationId: () => void

  symbols: SymbolInstance[]
  addSymbol: (symbol: Omit<SymbolInstance, 'instanceId'>) => void
  updateSymbolPosition: (instanceId: string, x: number, y: number) => void
  rotateSymbol: (instanceId: string) => void
  removeSymbol: (instanceId: string) => void
  bringSymbolToFront: (instanceId: string) => void

  question: string
  setQuestion: (q: string) => void
  questionFixedTime: string | null
  tempFixedTime: string | null
  setTempFixedTime: (date: string | null) => void
  fixQuestion: () => void

  tags: string[]
  setTags: (tags: string[]) => void

  links: LinkInstance[]
  isAddLinkMode: boolean
  toggleAddLinkMode: () => void
  startLink: (instanceId: string, x: number, y: number) => void
  addLinkPoint: (x: number, y: number) => void
  finishLink: () => void
  removeLink: (id: string) => void

  lastSavedAt: string | null
  lastSavedData: string | null
  version: number
  markSaved: () => void

  divinationId: number | null
  reset: () => void
}
