/*
 * web/src/components/Protocol/SymbolJar.tsx
 */
import React from 'react'

import { GodsAskingToolset } from 'src/constants/godsAskingToolset'

const SymbolJar = () => {
  return (
    <div className="flex flex-wrap gap-1 border p-2">
      {GodsAskingToolset.map((item) => (
        <div
          key={item.id}
          className="w-12 h-12 flex items-center justify-center border rounded-full bg-yellow-100 text-xl cursor-grab"
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData(
              'text/plain',
              JSON.stringify({
                id: item.id,
                symbol: item.symbol,
                isRune: item.isRune,
              })
            )
          }}
        >
          {item.symbol}
        </div>
      ))}
    </div>
  )
}

export default SymbolJar
