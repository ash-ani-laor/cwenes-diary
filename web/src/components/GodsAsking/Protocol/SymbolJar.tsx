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
          className={`
            flex h-8 w-8 cursor-grab items-center
            justify-center
            rounded-full border
            text-xl ${item.isRune ? 'bg-blue-100' : 'bg-yellow-100'}
          `}
          draggable
          onDragStart={(e) => {
            // ⚙️ Получаем реальные размеры плитки
            const { width, height } = e.currentTarget.getBoundingClientRect()
            e.dataTransfer.setData(
              'text/plain',
              JSON.stringify({
                id: item.id,
                symbol: item.symbol,
                isRune: item.isRune,
                width,
                height,
              })
            )
            // 🖱 Точка захвата — верхний левый угол плитки
            e.dataTransfer.setDragImage(e.currentTarget, 0, 0)
            e.dataTransfer.effectAllowed = 'move'
          }}
        >
          {item.symbol}
        </div>
      ))}
    </div>
  )
}

export default SymbolJar
