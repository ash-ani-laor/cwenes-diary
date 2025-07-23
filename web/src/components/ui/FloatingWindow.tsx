import React, { useRef, useState } from 'react'

export const FloatingWindow = ({
  title,
  children,
  onClose,
  onMinimize,
  initialPosition = { x: 100, y: 100 },
  width = 480,
  height = 300,
}) => {
  const [pos, setPos] = useState(initialPosition)
  const [dragging, setDragging] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const offset = useRef({ x: 0, y: 0 })

  // Начало перетаскивания
  const handleMouseDown = (e) => {
    setDragging(true)
    offset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    }
    // Чтобы мышь не выделяла текст
    e.preventDefault()
  }

  // Сам процесс перемещения
  const handleMouseMove = (e) => {
    if (!dragging) return
    setPos({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    })
  }

  // Отпускаем мышку
  const handleMouseUp = () => setDragging(false)

  React.useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    } else {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging])

  // eslint-disable-next-line jsx-a11y/click-events-have-key-events
  // eslint-disable-next-line jsx-a11y/no-static-element-interactions
  return (
    <div
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        width,
        height: minimized ? 40 : height,
        background: 'white',
        borderRadius: 16,
        boxShadow: '0 6px 24px 0 #ceb48977',
        zIndex: 1000,
        userSelect: dragging ? 'none' : 'auto',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s',
      }}
    >
      <div
        style={{
          cursor: 'move',
          background: '#f4ce73',
          padding: '8px 16px',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: 'bold',
          userSelect: 'none',
        }}
        onMouseDown={handleMouseDown}
      >
        <span>{title}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => {
              setMinimized(!minimized)
              onMinimize && onMinimize()
            }}
            style={{ background: 'none', border: 'none', fontSize: 18 }}
            title={minimized ? 'Развернуть' : 'Свернуть'}
          >
            {minimized ? '▢' : '–'}
          </button>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: 18 }}
            title="Закрыть"
          >
            ×
          </button>
        </div>
      </div>
      {!minimized && (
        <div style={{ padding: 16, height: height - 40, overflow: 'auto' }}>
          {children}
        </div>
      )}
    </div>
  )
}
