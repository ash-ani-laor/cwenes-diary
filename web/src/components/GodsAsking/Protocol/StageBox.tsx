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

const StageBox = ({ readOnly = false }) => {
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
    removeSymbol,
    bringSymbolToFront,
  } = useProtocolStore()

  const [hoveredLinkId, setHoveredLinkId] = React.useState<string | null>(null)
  const [hoveredSymbolId, setHoveredSymbolId] = React.useState<string | null>(
    null
  )
  const [hoveredSymbol, setHoveredSymbol] = React.useState<null | {
    id: string
    x: number
    y: number
  }>(null)
  const [pendingDelete, setPendingDelete] = React.useState<null | string>(null)
  const [showRemoveTooltip, setShowRemoveTooltip] = React.useState(false)

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setShowRemoveTooltip(true)
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setShowRemoveTooltip(false)
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

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
        onClick={readOnly ? undefined : handleStageClick}
        onDblClick={
          readOnly
            ? undefined
            : () => {
                if (isAddLinkMode) finishLink()
              }
        }
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
              onDblClick={
                readOnly
                  ? undefined
                  : (e) => {
                      // Если зажат shift — удаляем
                      if (e.evt.shiftKey) {
                        removeLink(link.id)
                        setHoveredLinkId(null)
                        // Останавливаем дальнейшие события (на всякий случай)
                        e.cancelBubble = true
                      }
                    }
              }
              onMouseEnter={
                readOnly
                  ? undefined
                  : (e) => {
                      setHoveredLinkId(link.id)
                      e.target.getStage().container().style.cursor = 'pointer'
                    }
              }
              onMouseLeave={
                readOnly
                  ? undefined
                  : (e) => {
                      setHoveredLinkId(null)
                      e.target.getStage().container().style.cursor = 'default'
                    }
              }
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
              onDragEnd={
                readOnly ? undefined : (e) => handleDragEnd(e, item.instanceId)
              }
              onClick={readOnly ? undefined : (e) => handleSymbolClick(item, e)}
              onContextMenu={
                readOnly
                  ? undefined
                  : (e) => {
                      e.evt.preventDefault()
                      rotateSymbol(item.instanceId)
                    }
              }
              onDblClick={
                readOnly
                  ? undefined
                  : (e) => {
                      if (e.evt.shiftKey) {
                        removeSymbol(item.instanceId)
                        setPendingDelete(item.instanceId)
                        e.cancelBubble = true
                      }
                      if (!e.evt.shiftKey) {
                        bringSymbolToFront(item.instanceId)
                        e.cancelBubble = true
                      }
                    }
              }
              onMouseEnter={
                readOnly
                  ? undefined
                  : (e) => {
                      setHoveredSymbol({
                        id: item.instanceId,
                        x: item.x + 36, // чуть справа от плашки, можно подвинуть по вкусу
                        y: item.y,
                      })
                      e.target.getStage().container().style.cursor = window
                        .event?.shiftKey
                        ? 'pointer'
                        : 'grab'
                    }
              }
              onMouseLeave={
                readOnly
                  ? undefined
                  : (e) => {
                      setHoveredSymbol(null)
                      e.target.getStage().container().style.cursor = 'default'
                    }
              }
            >
              <Rect
                width={32}
                height={32}
                fill={
                  hoveredSymbolId === item.instanceId && window.event?.shiftKey
                    ? '#fecaca' // Красноватый, если shift + наведено
                    : item.isRune
                      ? '#bae6fd'
                      : '#fef08a'
                }
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
          {hoveredSymbol && showRemoveTooltip && (
            <Text
              text="Shift + двойной клик — удалить"
              x={hoveredSymbol.x}
              y={hoveredSymbol.y}
              fontSize={14}
              fill="#dc2626"
              padding={4}
              listening={false}
            />
          )}
          {hoveredLinkId && (
            <Text
              text="Shift + двойной клик — удалить"
              x={10}
              y={10}
              fontSize={16}
              fill="red"
            />
          )}
          {pendingDelete && (
            <Group
              x={PROTOCOL_CANVAS_WIDTH / 2 - 80}
              y={PROTOCOL_CANVAS_HEIGHT / 2 - 40}
            >
              <Rect
                width={160}
                height={80}
                fill="#fff"
                stroke="#dc2626"
                strokeWidth={2}
                cornerRadius={10}
              />
              <Text
                text="Удалить плашку?"
                x={0}
                y={10}
                width={160}
                align="center"
                fontSize={16}
                fill="#dc2626"
                listening={false}
              />
              <Group
                x={20}
                y={40}
                onClick={() => {
                  removeSymbol(pendingDelete)
                  setPendingDelete(null)
                  setHoveredSymbol(null)
                }}
              >
                <Rect width={50} height={28} fill="#fecaca" cornerRadius={6} />
                <Text
                  text="Да"
                  width={50}
                  align="center"
                  fontSize={15}
                  y={5}
                  fill="#dc2626"
                />
              </Group>
              <Group x={90} y={40} onClick={() => setPendingDelete(null)}>
                <Rect width={50} height={28} fill="#f3f4f6" cornerRadius={6} />
                <Text
                  text="Нет"
                  width={50}
                  align="center"
                  fontSize={15}
                  y={5}
                  fill="#4b5563"
                />
              </Group>
            </Group>
          )}
        </Layer>
      </Stage>
    </>
  )
}

export default StageBox
