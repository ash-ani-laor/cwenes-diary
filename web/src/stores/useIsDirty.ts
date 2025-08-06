/**
 * web\src\stores\useIsDirty.ts
 */
import { useProtocolStore } from './protocolStore'

export const useIsDirty = () => {
  const lastSavedData = useProtocolStore((s) => s.lastSavedData)
  const currentData = JSON.stringify({
    ...useProtocolStore.getState(),
    lastSavedAt: undefined,
    lastSavedData: undefined,
  })
  // console.log('[DIRTY-CHECK] lastSavedData:', lastSavedData)
  // console.log('[DIRTY-CHECK] currentData:', currentData)
  return lastSavedData !== currentData
}
