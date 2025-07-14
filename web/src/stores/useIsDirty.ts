import { useProtocolStore } from './protocolStore'

export const useIsDirty = () => {
  const lastSavedData = useProtocolStore((s) => s.lastSavedData)
  const currentData = JSON.stringify({
    ...useProtocolStore.getState(),
    lastSavedAt: undefined,
    lastSavedData: undefined,
  })
  return lastSavedData !== currentData
}
