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

    if (data.instanceId) {
      updateSymbolPosition(data.instanceId, x, y)
    } else {
      addSymbol({
        id: data.id,
        symbol: data.symbol,
        isRune: data.isRune,
        x,
        y,
      })
    }
  }

  return (
    <div
      className="flex-1 relative border p-2"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <StageLinks />
      {symbols.map((item) => (
        <div
          key={item.instanceId}
          className="w-12 h-12 flex items-center justify-center border rounded-full bg-yellow-100 text-2xl cursor-move absolute"
          style={{
            top: item.y,
            left: item.x,
            transform: `rotate(${item.rotation || 0}deg)`,
          }}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData(
              'text/plain',
              JSON.stringify({
                ...item,
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

export default StageBox
