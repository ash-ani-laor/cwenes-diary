/*
 * web/src/components/GodsAsking/Protocol/SymbolJar.tsx
 */
import React from 'react'

import { GodsAskingToolset } from 'src/constants/godsAskingToolset'
import { useProtocolStore } from 'src/stores/protocolStore'

// Размеры тряпочки (канваса) — должны совпадать с теми, что в StageBox
const WIDTH = 500
const HEIGHT = 320

const SymbolJar = () => {
  const { addSymbol } = useProtocolStore()

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
          onClick={() => {
            addSymbol({
              id: item.id,
              symbol: item.symbol,
              isRune: item.isRune,
              // Центр канваса, минус половина размера плашки (16px)
              x: WIDTH / 2 - 16,
              y: HEIGHT / 2 - 16,
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
