/*
 * web/src/components/GodsAsking/Protocol/StageBox.tsx
 */
import React from 'react'

import { Stage, Layer, Group, Rect, Text, Line } from 'react-konva'

import {
  PROTOCOL_CANVAS_WIDTH,
  PROTOCOL_CANVAS_HEIGHT,
  TILE_SIZE,
} from 'src/constants/protocolCanvas'
import { useProtocolStore } from 'src/stores/protocolStore'

const StageBox = () => {
  const {
    symbols,
    links,
    isAddLinkMode,
    rotateSymbol,
    updateSymbolPosition,
    startLink,
    addLinkPoint,
    finishLink,
    removeLink,
  } = useProtocolStore()

  const [hoveredLinkId, setHoveredLinkId] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!isAddLinkMode) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        finishLink()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isAddLinkMode, finishLink])

  React.useEffect(() => {
    if (hoveredLinkId && !links.some((link) => link.id === hoveredLinkId)) {
      setHoveredLinkId(null)
    }
  }, [links, hoveredLinkId])

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
        width={PROTOCOL_CANVAS_WIDTH}
        height={PROTOCOL_CANVAS_HEIGHT}
        style={{ border: '2px solid #f4ce73', background: 'white' }}
        onClick={handleStageClick}
        onDblClick={() => {
          if (isAddLinkMode) finishLink()
        }}
      >
        <Layer>
          {/* Линии */}
          {links.map((link) => (
            <Line
              key={link.id}
              points={link.points.flatMap((p) => [p.x, p.y])}
              stroke={hoveredLinkId === link.id ? 'red' : 'blue'}
              strokeWidth={hoveredLinkId === link.id ? 4 : 2}
              tension={0}
              onDblClick={(e) => {
                // Если зажат shift — удаляем
                if (e.evt.shiftKey) {
                  removeLink(link.id)
                  setHoveredLinkId(null)
                  // Останавливаем дальнейшие события (на всякий случай)
                  e.cancelBubble = true
                }
              }}
              onMouseEnter={(e) => {
                setHoveredLinkId(link.id)
                e.target.getStage().container().style.cursor = 'pointer'
              }}
              onMouseLeave={(e) => {
                setHoveredLinkId(null)
                e.target.getStage().container().style.cursor = 'default'
              }}
              listening={true}
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
                width={TILE_SIZE}
                height={TILE_SIZE}
                fill="#000"
                rotation={item.rotation || 0}
                offsetX={TILE_SIZE / 2} // половина ширины
                offsetY={TILE_SIZE / 2} // половина высоты
                x={TILE_SIZE / 2} // чтобы совместить с Rect, если Rect в (0,0)
                y={TILE_SIZE / 2}
              />
            </Group>
          ))}
          {hoveredLinkId && (
            <Text
              text="Shift + двойной клик — удалить"
              x={10}
              y={10}
              fontSize={16}
              fill="red"
            />
          )}
        </Layer>
      </Stage>
    </>
  )
}

export default StageBox
