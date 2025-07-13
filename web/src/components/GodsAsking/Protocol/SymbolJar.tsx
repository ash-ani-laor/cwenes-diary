/*
 * web/src/components/GodsAsking/Protocol/SymbolJar.tsx
 */
import React from 'react'

import { GodsAskingToolset } from 'src/constants/godsAskingToolset'
import {
  PROTOCOL_CANVAS_WIDTH,
  PROTOCOL_CANVAS_HEIGHT,
  TILE_SIZE,
} from 'src/constants/protocolCanvas'
import { useProtocolStore } from 'src/stores/protocolStore'

const SymbolJar = () => {
  const { addSymbol } = useProtocolStore()
  const questionFixedTime = useProtocolStore((s) => s.questionFixedTime)

  /* eslint-disable jsx-a11y/click-events-have-key-events */
  /* eslint-disable jsx-a11y/no-static-element-interactions */
  return (
    <div className="mb-2 flex flex-wrap gap-1 border p-2">
      {GodsAskingToolset.map((item) => (
        <div
          key={item.id}
          className={`
            flex h-8 w-8 cursor-pointer select-none items-center justify-center
            rounded-full border text-xl
            ${item.isRune ? 'bg-blue-100' : 'bg-yellow-100'}
          `}
          title={item.symbol}
          style={{
            opacity: questionFixedTime ? 1 : 0.5,
            pointerEvents: questionFixedTime ? 'auto' : 'none',
          }}
          onClick={() => {
            addSymbol({
              id: item.id,
              symbol: item.symbol,
              isRune: item.isRune,
              // Центр канваса, минус половина размера плашки (16px)
              x: PROTOCOL_CANVAS_WIDTH / 2 - TILE_SIZE / 2,
              y: PROTOCOL_CANVAS_HEIGHT / 2 - TILE_SIZE / 2,
            })
          }}
        >
          {item.symbol}
        </div>
      ))}
    </div>
  )
}

export default SymbolJar
