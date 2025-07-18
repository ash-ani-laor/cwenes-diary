/*
 * web/src/components/GodsAsking/Protocol/ControlPanel.tsx
 */
import React, { useRef, useState } from 'react'

// import MuiAlert from '@mui/material/Alert'
import gql from 'graphql-tag'
import {
  Trash,
  Trash2,
  Link2,
  Download,
  Upload,
  Save,
  ScrollText,
} from 'lucide-react'

import { useMutation, useQuery } from '@redwoodjs/web'

import { Button } from 'src/components/ui/Button'
import { useDialog } from 'src/components/ui/DialogManager'
import { useSnackbar } from 'src/components/ui/SnackbarManager'
import { useProtocolStore } from 'src/stores/protocolStore'
import { useIsDirty } from 'src/stores/useIsDirty'

import { DivinationsList } from './DivinationsList'

// --- GraphQL ---
const CREATE_DIVINATION = gql`
  mutation CreateDivination($input: CreateDivinationInput!) {
    createDivination(input: $input) {
      id
    }
  }
`

const GET_DIVINATION = gql`
  query FindDivinationById($id: Int!) {
    divination(id: $id) {
      id
      question
      questionFixedTime
      tags
      layout
      links
    }
  }
`

const UPDATE_DIVINATION = gql`
  mutation UpdateDivination($id: Int!, $input: UpdateDivinationInput!) {
    updateDivination(id: $id, input: $input) {
      id
    }
  }
`

const ControlPanel = () => {
  const { reset, toggleAddLinkMode, isAddLinkMode } = useProtocolStore()

  const [open, setOpen] = React.useState(false)
  const [message, setMessage] = React.useState('')

  const { showSnackbar } = useSnackbar()
  const { showDialog } = useDialog()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showList, setShowList] = useState(false)
  const [createDivination] = useMutation(CREATE_DIVINATION)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const isDirty = useIsDirty()
  const [updateDivination] = useMutation(UPDATE_DIVINATION)

  // --- Сохранить в БД ---
  const handleSave = async () => {
    const store = useProtocolStore.getState()
    if (!store.question || !store.questionFixedTime) {
      showSnackbar({
        message: 'Сначала зафиксируйте вопрос!',
        severity: 'error',
      })
      return
    }

    const input = {
      userId: 1, // (заменить на динамический userId в будущем)
      question: store.question,
      questionFixedTime: store.questionFixedTime,
      layout: JSON.stringify(store),
      tags: JSON.stringify(store.tags),
      timestamp: new Date().toISOString(),
      links: JSON.stringify(store.links ?? []),
      // previewImage, postId и пр. — по необходимости
    }

    if (store.divinationId) {
      // UPDATE
      await updateDivination({
        variables: {
          id: store.divinationId,
          input,
        },
      })
      showSnackbar({ message: 'Расклад обновлён!', severity: 'success' })
    } else {
      // CREATE
      const { data } = await createDivination({ variables: { input } })
      useProtocolStore.setState({ divinationId: data.createDivination.id })
      showSnackbar({ message: 'Расклад сохранён!', severity: 'success' })
    }

    useProtocolStore.getState().markSaved()
  }

  const { data } = useQuery(GET_DIVINATION, {
    variables: { id: selectedId },
    skip: !selectedId,
    onCompleted: (divData) => {
      const div = divData.divination
      if (div?.layout) {
        const store = JSON.parse(div.layout)
        useProtocolStore.setState({
          ...store,
          divinationId: div.id, // <--- ВАЖНО: сохраняем id из базы
        })
      }
      setSelectedId(null) // сбрасываем id после загрузки
    },
  })

  // --- Экспорт ---
  const sanitize = (str: string) =>
    str
      .replace(/[\\/:*?"<>|]+/g, '_')
      .replace(/\s+/g, '_')
      .slice(0, 64)

  const handleExport = () => {
    const store = useProtocolStore.getState()
    if (!store.question || !store.questionFixedTime) {
      showSnackbar({
        message: 'Сначала зафиксируйте вопрос!',
        severity: 'error',
      })
      return
    }
    const state = { ...store }
    const q = sanitize(store.question || 'no_question')
    const dt = store.questionFixedTime
      ? sanitize(new Date(store.questionFixedTime).toISOString())
      : Date.now()
    const filename = `${q}__${dt}.xrlo`
    const json = JSON.stringify(state, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    showSnackbar({ message: 'Расклад экспортирован!', severity: 'success' })
  }

  // --- Импорт ---
  const handleImportButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    console.log('[IMPORT] handleImport called. File:', file)
    if (!file) return
    console.log('[IMPORT] isDirty:', isDirty)
    if (isDirty) {
      showDialog({
        message:
          'У вас есть несохранённые изменения. Импорт перезапишет расклад. Продолжить?',
        confirmText: 'Импортировать',
        cancelText: 'Отмена',
        onConfirm: () => {
          console.log('[IMPORT] onConfirm fired!')
          const reader = new FileReader()
          reader.onload = (e) => {
            try {
              const data = JSON.parse(e.target?.result as string)
              console.log('[IMPORT] FileReader parsed data (onConfirm):', data)
              useProtocolStore.setState({ ...data, divinationId: null }) // <--- сбросить id при импорте!
              useProtocolStore.getState().markSaved()
              showSnackbar({ message: 'Импорт выполнен!', severity: 'success' })
            } catch (err) {
              showSnackbar({
                message: `Ошибка при импорте файла: ${err.message || err}`,
                severity: 'error',
              })
            }
          }
          reader.readAsText(file)
        },
      })
      return
    }
    console.log('[IMPORT] Importing immediately (not dirty)')
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        console.log('[IMPORT] FileReader parsed data (immediate):', data)
        useProtocolStore.setState({ ...data })
        useProtocolStore.getState().markSaved()
        showSnackbar({ message: 'Импорт выполнен!', severity: 'success' })
      } catch (err) {
        showSnackbar({
          message: `Ошибка при импорте файла: ${err.message || err}`,
          severity: 'error',
        })
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={() => {
          reset()
          useProtocolStore.getState().markSaved()
          showSnackbar({
            message: 'Расклад очищен!',
            severity: 'success',
          })
        }}
        title="DEBUG Очистить"
      >
        <Trash />
      </Button>

      <Button
        onClick={() => {
          if (isDirty) {
            showDialog({
              message:
                'У вас есть несохранённые изменения. Очистка расклада приведёт к потере данных. Продолжить?',
              confirmText: 'Очистить',
              cancelText: 'Отмена',
              onConfirm: () => {
                console.log('[DIALOG Очистить] Подтверждено пользователем')
                reset()
                useProtocolStore.getState().markSaved()
                showSnackbar({
                  message: 'Расклад очищен!',
                  severity: 'success',
                })
              },
              onCancel: () => {
                console.log('[DIALOG Очистить] Отменено пользователем')
                showSnackbar({
                  message: 'Очистка отменена',
                  severity: 'info',
                })
              },
            })
          } else {
            reset()
            useProtocolStore.getState().markSaved()
            showSnackbar({
              message: 'Расклад очищен!',
              severity: 'success',
            })
          }
        }}
        title="Очистить"
        className="bg-red-500 text-white hover:bg-red-700"
      >
        <Trash2 />
      </Button>

      <Button onClick={toggleAddLinkMode} title="Добавить линию">
        <Link2 />
      </Button>

      {/* <Button onClick={handleExport} title="Экспорт">
        <Download />
      </Button>

      <Button onClick={handleImportButtonClick} title="Импорт">
        <Upload />
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xrlo,application/json"
        onChange={handleImport}
        style={{ display: 'none' }}
      /> */}

      <Button onClick={handleSave} title="Сохранить в БД">
        <Save />
      </Button>

      <Button onClick={() => setShowList(true)} title="Список раскладов">
        <ScrollText />
      </Button>

      {/* Модалка со списком раскладов */}
      {showList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="relative w-full max-w-lg rounded bg-white p-4 shadow-xl">
            <button
              className="absolute right-2 top-2 text-gray-400 hover:text-black"
              onClick={() => setShowList(false)}
            >
              ×
            </button>
            <h2 className="mb-3 text-xl font-bold">Выбери расклад</h2>
            <DivinationsList
              onSelect={(id) => {
                setShowList(false)
                setSelectedId(id)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ControlPanel
