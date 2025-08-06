import React, { useState, useEffect, useCallback } from 'react'
import MDEditor from '@uiw/react-md-editor'
import gql from 'graphql-tag'
import { useQuery } from '@redwoodjs/web'

import DivinationReadonlyView from 'web/src/components/GodsAsking/Protocol/DivinationReadonlyView'
import ProtocolFullView from '../GodsAsking/Protocol/ProtocolFullView'
import DivinationEditor4FloatingWindow from '../GodsAsking/Protocol/DivinationEditor4FloatingWindow'
import { DivinationsList } from '../GodsAsking/Protocol/DivinationsList'
import { FloatingWindow } from '../ui/FloatingWindow'
import { TagsInput } from './TagsInput'
import { parseTags } from 'src/lib/parseTags'

// ГрафQL запрос для получения расклада
const DIVINATION_QUERY = gql`
  query GetDivination($id: Int!) {
    divination(id: $id) {
      id
      question
      questionFixedTime
      layout
      tags
      previewImage
      timestamp
      links
    }
  }
`

// Утилита для парсинга расклада
function parseDivination(raw) {
  if (!raw) return null
  return {
    ...raw,
    tags: Array.isArray(raw.tags)
      ? raw.tags
      : (() => {
          try {
            return JSON.parse(raw.tags)
          } catch {
            return []
          }
        })(),
    layout:
      typeof raw.layout === 'string'
        ? (() => {
            try {
              return JSON.parse(raw.layout)
            } catch {
              return {}
            }
          })()
        : raw.layout,
    links:
      typeof raw.links === 'string'
        ? (() => {
            try {
              return JSON.parse(raw.links)
            } catch {
              return []
            }
          })()
        : raw.links,
  }
}

const JournalEditor = ({ post = {}, onClose, allTags }) => {
  // Основные состояния
  const [title, setTitle] = useState(post.title || '')
  const [content, setContent] = useState(post.content || '')
  const [tags, setTags] = useState(() =>
    parseTags(post.tags || 'заметка').join(', ')
  )
  const [showFilePicker, setShowFilePicker] = useState(false)

  // Расклад
  const [divinationId, setDivinationId] = useState(null)
  const [divination, setDivination] = useState(null)

  // Модалки и состояния показа
  const [showDivinations, setShowDivinations] = useState(false)
  const [showDivinationEditor, setShowDivinationEditor] = useState(false)
  const [showFullDivination, setShowFullDivination] = useState(false)
  const [showFullDivinationEdit, setShowFullDivinationEdit] = useState(false)

  // Загрузка расклада по id
  const { data } = useQuery(DIVINATION_QUERY, {
    variables: { id: divinationId ? Number(divinationId) : undefined },
    skip: !divinationId,
  })

  useEffect(() => {
    if (data?.divination) {
      const parsed = parseDivination(data.divination)
      setDivination(parsed)
    }
  }, [data])

  // Открепить расклад
  const handleDetachDivination = () => {
    setDivinationId(null)
    setDivination(null)
  }

  // Привязать созданный расклад
  const handleNewDivination = (newDiv) => {
    setDivinationId(Number(newDiv.id))
    setDivination(parseDivination(newDiv))
    setShowDivinationEditor(false)
  }

  // Выбрать расклад из списка
  const handleSelectDivination = (id) => {
    setDivinationId(Number(id))
    setShowDivinations(false)
  }

  // Клик по символу в просмотре (для вставки ссылки в текст редактора)
  const handleSymbolClick = useCallback(
    (symbol) => {
      // Например: [[hoggva:Имя]] или [[rune:Имя]]
      let marker
      if (symbol.type === 'hoggva') marker = `[[hoggva:${symbol.name}]]`
      else if (symbol.type === 'rune') marker = `[[rune:${symbol.name}]]`
      else marker = `[[${symbol.type}:${symbol.name}]]`
      setContent((c) => c + ' ' + marker)
    },
    [setContent]
  )

  // Условия для показа кнопок привязать/создать
  const showChooseOrCreate =
    !divinationId && !divination && !showDivinations && !showDivinationEditor

  // Состояние блокировки (для межоконного контроля, см. ниже)
  const [editLock, setEditLock] = useState(false)

  // --- Межвкладочная блокировка редактирования ---
  useEffect(() => {
    const lockKey = divinationId
      ? `vaer:divination:editing:${divinationId}`
      : null
    if (!showFullDivinationEdit || !divinationId) return

    // Проверка: если уже кто-то редактирует
    const existing = localStorage.getItem(lockKey)
    if (existing && existing !== window.name) {
      setEditLock(true)
      alert('Этот расклад уже редактируется в другой вкладке или окне!')
      setShowFullDivinationEdit(false)
      return
    }
    // Помечаем: мы редактируем
    localStorage.setItem(lockKey, window.name || String(Math.random()))

    // Слежение за локалсториджем — если кто-то другой начнёт редактировать, закроем окно
    const handler = (e) => {
      if (e.key === lockKey && e.newValue && e.newValue !== window.name) {
        alert(
          'Расклад открыт на редактирование в другом окне/вкладке, здесь будет закрыт.'
        )
        setShowFullDivinationEdit(false)
        setEditLock(true)
      }
    }
    window.addEventListener('storage', handler)
    return () => {
      // По закрытию снимаем блокировку
      if (lockKey) localStorage.removeItem(lockKey)
      window.removeEventListener('storage', handler)
    }
  }, [showFullDivinationEdit, divinationId])

  return (
    <div className="flex min-h-0 w-full max-w-full flex-1 flex-col rounded bg-white p-4 shadow-md">
      {/* Заголовок */}
      <input
        className="mb-4 w-full rounded border px-3 py-2 text-xl font-semibold"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Заголовок"
      />

      {/* Теги */}
      <TagsInput value={tags} onChange={setTags} suggestions={allTags} />

      {/* Текст */}
      <div
        className="flex min-h-0 flex-1 flex-col"
        style={{ minHeight: 0, flex: 1 }}
      >
        <div style={{ height: '60vh', minHeight: 0 }}>
          <MDEditor
            className="min-h-0 flex-1"
            value={content}
            onChange={setContent}
            style={{ height: '100%' }}
            textareaProps={{
              placeholder: 'Введите текст записи с поддержкой Markdown...',
              style: { minHeight: 0, flex: 1 },
            }}
          />
        </div>
      </div>

      {/* Привязать/создать расклад */}
      {showChooseOrCreate && (
        <div className="my-4 flex gap-2">
          <button
            className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
            onClick={() => setShowDivinations(true)}
          >
            + Привязать расклад
          </button>
          <button
            className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
            onClick={() => setShowDivinationEditor(true)}
          >
            Создать новый
          </button>
        </div>
      )}

      {/* Предпросмотр + панель управления раскладом */}
      {divinationId && divination && (
        <div className="my-4 rounded bg-yellow-50 p-2">
          <DivinationReadonlyView
            divination={divination}
            onSymbolClick={handleSymbolClick}
          />
          <div className="mt-2 flex gap-2">
            <button
              className="rounded bg-gray-100 px-2 py-1 text-xs"
              onClick={handleDetachDivination}
            >
              Открепить
            </button>
            <button
              className="rounded bg-blue-100 px-2 py-1 text-xs"
              onClick={() => setShowDivinations(true)}
            >
              Заменить расклад
            </button>
            <button
              className="rounded bg-yellow-100 px-2 py-1 text-xs"
              onClick={() => setShowFullDivination(true)}
            >
              Просмотр расклада
            </button>
            <button
              className="rounded bg-blue-100 px-2 py-1 text-xs"
              onClick={() => {
                // Проверяем лок на редактирование
                if (editLock) {
                  alert(
                    'Этот расклад уже редактируется в другой вкладке или окне!'
                  )
                  return
                }
                setShowFullDivinationEdit(true)
              }}
            >
              Открыть для редактирования
            </button>
          </div>
        </div>
      )}

      {/* Управляющие кнопки */}
      <div className="mt-4 flex gap-2">
        <button
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-800"
          onClick={() => setShowFilePicker(true)}
        >
          Графика
        </button>
        <button
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-800"
          onClick={() => alert('Сохраняем пост (тест)!')}
        >
          Сохранить
        </button>
        <button
          className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
          onClick={() => window.location.reload()}
        >
          Отмена
        </button>
      </div>

      {/* --- Модальные окна --- */}

      {/* Выбор расклада */}
      {showDivinations && (
        <FloatingWindow
          title="Выбор расклада"
          onClose={() => setShowDivinations(false)}
          defaultWidth="900"
        >
          <DivinationsList onSelect={handleSelectDivination} />
        </FloatingWindow>
      )}

      {/* Создание нового расклада */}
      {showDivinationEditor && (
        <FloatingWindow
          title="Создать новый расклад"
          onClose={() => setShowDivinationEditor(false)}
          defaultWidth="900"
        >
          <DivinationEditor4FloatingWindow
            onSave={handleNewDivination}
            onCancel={() => setShowDivinationEditor(false)}
          />
        </FloatingWindow>
      )}

      {/* Просмотр расклада — только вопрос/время/теги/символы */}
      {showFullDivination && (
        <FloatingWindow
          title="Просмотр расклада"
          onClose={() => setShowFullDivination(false)}
          defaultWidth="700"
          defaultHeight="700"
        >
          <DivinationReadonlyView
            divination={divination}
            onSymbolClick={handleSymbolClick}
          />
        </FloatingWindow>
      )}

      {/* Полный редактор расклада (ProtocolFullView) */}
      {showFullDivinationEdit && (
        <FloatingWindow
          title="Редактирование расклада"
          onClose={() => setShowFullDivinationEdit(false)}
          defaultWidth="1200"
          defaultHeight="800"
        >
          <ProtocolFullView
            divination={divination}
            mode="edit"
            onClose={() => setShowFullDivinationEdit(false)}
          />
        </FloatingWindow>
      )}

      {/* Окно выбора графики */}
      {showFilePicker && (
        <div className="mt-4 rounded bg-green-100 p-4">
          Тестовое окно "Графика"
        </div>
      )}
    </div>
  )
}

export default JournalEditor
