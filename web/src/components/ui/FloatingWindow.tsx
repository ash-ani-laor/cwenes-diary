import React, { useState } from 'react'

import { Rnd } from 'react-rnd'

const DEFAULT_WIDTH = 1636
const DEFAULT_HEIGHT = 700
const TITLEBAR_HEIGHT = 40 // высота шапки в пикселях

export const FloatingWindow = ({
  title,
  children,
  onClose,
  onMinimize,
  minWidth = 400,
  minHeight = 280,
  defaultWidth = DEFAULT_WIDTH,
  defaultHeight = DEFAULT_HEIGHT,
  maxWidth = 1800,
  maxHeight = 800,
}) => {
  const [minimized, setMinimized] = useState(false)
  const [size, setSize] = useState({
    width: defaultWidth,
    height: defaultHeight,
  })

  return (
    <Rnd
      default={{
        x: window.innerWidth / 2 - defaultWidth / 2,
        y: window.innerHeight / 2 - defaultHeight / 2,
        width: defaultWidth,
        height: defaultHeight,
      }}
      size={{
        width: size.width,
        height: minimized ? TITLEBAR_HEIGHT : size.height,
      }}
      minWidth={minWidth}
      minHeight={TITLEBAR_HEIGHT}
      maxWidth={maxWidth}
      maxHeight={maxHeight}
      bounds="window"
      dragHandleClassName="floatingwindow-title"
      enableResizing={!minimized}
      disableDragging={false}
      style={{
        zIndex: 1000,
        borderRadius: 16,
        boxShadow: '0 6px 24px 0 #ceb48977',
        background: 'white',
        overflow: 'hidden',
        userSelect: minimized ? 'none' : 'auto',
        transition: 'box-shadow 0.2s',
        display: 'flex',
        flexDirection: 'column',
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setSize({
          width: ref.offsetWidth,
          height: ref.offsetHeight,
        })
      }}
      onDragStop={(e, d) => {
        // можно добавить стейт для позиции, если хочешь сохранять
      }}
    >
      <div
        className="floatingwindow-title"
        style={{
          cursor: minimized ? 'default' : 'move',
          background: '#f4ce73',
          padding: '8px 16px',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: 'bold',
          userSelect: 'none',
          height: TITLEBAR_HEIGHT,
          minHeight: TITLEBAR_HEIGHT,
        }}
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
        <div style={{ padding: 16, flex: 1, overflow: 'auto', minHeight: 0 }}>
          {children}
        </div>
      )}
    </Rnd>
  )
}
