/*
 * web/src/components/GodsAsking/Protocol/StageBox.tsx
 */
import React from 'react'

import { Stage, Layer, Group, Rect, Text, Line } from 'react-konva'

import { useProtocolStore } from 'src/stores/protocolStore'

const WIDTH = 500
const HEIGHT = 320

const StageBox = () => {
  const {
    symbols,
    links,
    isAddLinkMode,
    rotateSymbol,
    updateSymbolPosition,
    startLink,
    addLinkPoint,
  } = useProtocolStore()

  const handleDragEnd = (e, id) => {
    const x = e.target.x()
    const y = e.target.y()
    updateSymbolPosition(id, x, y)
    console.log('move', id, x, y)
  }

  // Обработка клика по канвасу (только если линия уже начата)
  const handleStageClick = (e) => {
    if (!isAddLinkMode) return
    const stage = e.target.getStage()
    const pointer = stage.getPointerPosition()
    if (!pointer) return

    const currentLinks = useProtocolStore.getState().links
    if (
      !currentLinks.length ||
      currentLinks[currentLinks.length - 1].points.length === 0
    ) {
      // Если линии нет — ничего не делаем
      return
    } else {
      addLinkPoint(pointer.x, pointer.y)
    }
  }

  // Обработка клика по плашке
  const handleSymbolClick = (item, e) => {
    if (!isAddLinkMode) return
    const stage = e.target.getStage()
    const pointer = stage.getPointerPosition()
    if (!pointer) return
    startLink(item.instanceId, pointer.x, pointer.y)
    e.cancelBubble = true // чтобы клик не пошёл в Stage!
  }

  return (
    <>
      {/* <pre>{JSON.stringify(links)}</pre> */}
      <Stage
        width={WIDTH}
        height={HEIGHT}
        style={{ border: '2px solid #f4ce73', background: 'white' }}
        onClick={handleStageClick}
      >
        <Layer>
          {/* Линии */}
          {links.map((link) => (
            <Line
              key={link.id}
              points={link.points.flatMap((p) => [p.x, p.y])}
              stroke="blue"
              strokeWidth={2}
              tension={0.5}
            />
          ))}
          {/* Плашки */}
          {symbols.map((item) => (
            <Group
              key={item.instanceId}
              x={item.x}
              y={item.y}
              draggable
              onDragEnd={(e) => handleDragEnd(e, item.instanceId)}
              onClick={(e) => handleSymbolClick(item, e)}
              onContextMenu={(e) => {
                e.evt.preventDefault()
                rotateSymbol(item.instanceId)
              }}
            >
              <Rect
                width={32}
                height={32}
                fill={item.isRune ? '#bae6fd' : '#fef08a'}
                cornerRadius={16}
              />
              <Text
                text={item.symbol}
                fontSize={24}
                align="center"
                verticalAlign="middle"
                width={32}
                height={32}
                fill="#000"
                rotation={item.rotation || 0}
                offsetX={16} // половина ширины
                offsetY={16} // половина высоты
                x={16} // чтобы совместить с Rect, если Rect в (0,0)
                y={16}
              />
            </Group>
          ))}
        </Layer>
      </Stage>
    </>
  )
}

export default StageBox
