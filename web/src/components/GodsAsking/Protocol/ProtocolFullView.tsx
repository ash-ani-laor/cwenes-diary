// web/src/components/GodsAsking/Protocol/ProtocolFullView.tsx
import React, { useEffect } from 'react'
import { useProtocolStore } from 'src/stores/protocolStore'
import { QuestionPanel } from './QuestionPanel'
import StageBox from './StageBox'
import ControlPanel from './ControlPanel'
import SymbolJar from './SymbolJar'

function initializeStoreFromLayout(layoutObj, id) {
  useProtocolStore.setState({
    ...layoutObj,
    divinationId: id,
  })
}

const ProtocolFullView = ({
  divination,
  mode = 'view', // 'view' | 'edit'
  onClose,
}) => {
  const setEditingDivinationId = useProtocolStore(
    (s) => s.setEditingDivinationId
  )
  const clearEditingDivinationId = useProtocolStore(
    (s) => s.clearEditingDivinationId
  )

  useEffect(() => {
    if (divination?.layout) {
      let layout = divination.layout
      if (typeof layout === 'string') {
        try {
          layout = JSON.parse(layout)
        } catch {
          layout = {}
        }
      }
      initializeStoreFromLayout(layout, divination.id)
      if (mode === 'edit') {
        setEditingDivinationId(divination.id)
      }
    }
    return () => {
      if (mode === 'edit') clearEditingDivinationId()
      useProtocolStore.setState(useProtocolStore.getInitialState())
    }
  }, [divination, mode, setEditingDivinationId, clearEditingDivinationId])

  return (
    <div className="max-w-full space-y-4 rounded bg-white p-4 shadow">
      <QuestionPanel readOnly={mode === 'view'} />
      <div className="flex gap-2">
        <div className="flex-[3]">
          <SymbolJar />
        </div>
        <div className="flex-[7]">
          <StageBox readOnly={mode === 'view'} />
        </div>
        <div className="w-12">
          <ControlPanel readOnly={mode === 'view'} />
        </div>
      </div>
      <button
        className="mt-4 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-700"
        onClick={onClose}
      >
        Закрыть
      </button>
    </div>
  )
}

export default ProtocolFullView
