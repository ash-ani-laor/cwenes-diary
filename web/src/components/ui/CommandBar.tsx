//web\src\components\ui\CommandBar.tsx
import React from 'react'

export const CommandBar = ({ onOpenOR }) => (
  <div
    style={{
      width: '100%',
      height: 48,
      background: '#f4ce73',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      fontWeight: 'bold',
      fontSize: 20,
      boxShadow: '0 2px 8px #ceb48944',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 2000,
    }}
  >
    <span>ЗузукApp</span>
    <div style={{ display: 'flex', gap: 16 }}>
      <button
        onClick={onOpenOR}
        style={{
          background: '#fef08a',
          border: '1px solid #eab308',
          borderRadius: 8,
          padding: '8px 20px',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: 16,
        }}
      >
        Герб
      </button>
      {/* Сюда потом добавим другие иконки/кнопки */}
    </div>
  </div>
)
