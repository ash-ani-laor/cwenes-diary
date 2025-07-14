/*
 * web/src/pages/ProtocolPage/ProtocolPage.tsx
 */
import React from 'react'

import ControlPanel from 'src/components/GodsAsking/Protocol/ControlPanel'
import { DraftManager } from 'src/components/GodsAsking/Protocol/DraftManager'
import { QuestionPanel } from 'src/components/GodsAsking/Protocol/QuestionPanel'
import StageBox from 'src/components/GodsAsking/Protocol/StageBox'
import SymbolJar from 'src/components/GodsAsking/Protocol/SymbolJar'
import { GodsAskingToolset } from 'src/constants/godsAskingToolset'

const ProtocolPage = () => {
  const handleDragStart = (
    e: React.DragEvent,
    symbol: (typeof GodsAskingToolset)[0]
  ) => {
    e.dataTransfer.setData('symbol', JSON.stringify(symbol))
  }

  return (
    <div className="space-y-4 p-4">
      <DraftManager />
      <QuestionPanel />
      <div className="flex gap-2">
        <div className="flex-[3]">
          <SymbolJar onDragStart={handleDragStart} />
        </div>
        <div className="flex-[7]">
          <StageBox />
        </div>
        <div className="w-12">
          <ControlPanel />
        </div>
      </div>
    </div>
  )
}

export default ProtocolPage
