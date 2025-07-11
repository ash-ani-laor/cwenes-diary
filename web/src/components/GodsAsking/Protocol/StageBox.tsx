/*
 * web/src/components/Protocol/StageBox.tsx
 */
import React from 'react'

import { useProtocolStore } from 'src/stores/protocolStore'

import StageLinks from './StageLinks'

const StageBox = () => {
  const { symbols, addSymbol, updateSymbolPosition } = useProtocolStore()

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const rawData = e.dataTransfer.getData('text/plain')

    if (!rawData) {
      console.warn('No data received in drop event')
      return
    }

    let data
    try {
      data = JSON.parse(rawData)
    } catch (err) {
      console.error('Invalid JSON data', err)
      return
    }

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const tileSize = 32
    const clampedX = Math.min(Math.max(x, 0), rect.width - tileSize)
    const clampedY = Math.min(Math.max(y, 0), rect.height - tileSize)

    if (data.instanceId) {
      updateSymbolPosition(data.instanceId, clampedX, clampedY)
    } else {
      addSymbol({
        id: data.id,
        symbol: data.symbol,
        isRune: data.isRune,
        x: clampedX,
        y: clampedY,
      })
    }
  }

  return (
    <div
      className="relative h-80 flex-1 border p-2"
      onDragOver={(e) => {
        e.preventDefault()
        // явно указываем эффект «move»
        e.dataTransfer.dropEffect = 'move'
        console.log('🟡 DragOver на тряпочке')
      }}
      onDrop={(e) => {
        console.log(
          '🔴 Drop на тряпочке:',
          e.dataTransfer.getData('text/plain')
        )
        handleDrop(e)
      }}
    >
      <StageLinks />
      {symbols.map((item) => (
        <div
          key={item.instanceId}
          className={`
                        absolute flex
                        h-8 w-8 cursor-move
                        items-center justify-center
                        rounded-full border text-2xl
                        ${item.isRune ? 'bg-blue-100' : 'bg-yellow-100'}
                      `}
          style={{
            top: item.y,
            left: item.x,
            transform: `rotate(${item.rotation || 0}deg)`,
          }}
          draggable
          onDragStart={(e) => {
            // ⚙️ То же для уже существующих инстансов
            const { width, height } = e.currentTarget.getBoundingClientRect()
            e.dataTransfer.setData(
              'text/plain',
              JSON.stringify({
                ...item,
                width,
                height,
              })
            )
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

export default StageBox
