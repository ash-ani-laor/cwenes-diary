/*
 * web/src/components/GodsAsking/Protocol/ControlPanel.tsx
 */
import React, { useRef, useState } from 'react'

import gql from 'graphql-tag'
import { Trash2, Link2, Download, Upload } from 'lucide-react'

import { useMutation, useQuery } from '@redwoodjs/web'

import { Button } from 'src/components/ui/Button'
import { useProtocolStore } from 'src/stores/protocolStore'

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

const ControlPanel = () => {
  const { reset, toggleAddLinkMode, isAddLinkMode } = useProtocolStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showList, setShowList] = useState(false)
  const [createDivination] = useMutation(CREATE_DIVINATION)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  // const [getDivination] = useLazyQuery(GET_DIVINATION)

  // --- Сохранить в БД ---
  const handleSave = async () => {
    const store = useProtocolStore.getState()
    await createDivination({
      variables: {
        input: {
          userId: 1,
          question: store.question,
          questionFixedTime: store.questionFixedTime,
          layout: JSON.stringify(store),
          tags: JSON.stringify(store.tags),
          timestamp: new Date().toISOString(), // обязательно!
          links: JSON.stringify(store.links ?? []), // всегда строкой, даже если пустой
          // previewImage: store.previewImage || null, // если есть, иначе null
          // postId: store.postId ?? null, // если есть
        },
      },
    })
    alert('Расклад сохранён!')
  }

  const { data } = useQuery(GET_DIVINATION, {
    variables: { id: selectedId },
    skip: !selectedId,
    onCompleted: (divData) => {
      const div = divData.divination
      if (div?.layout) {
        const store = JSON.parse(div.layout)
        useProtocolStore.setState({ ...store })
      }
      setSelectedId(null) // сбрасываем id после загрузки
    },
  })

  // // --- Загрузить из БД по id ---
  // const handleLoadDivination = (id: number) => {
  //   getDivination({ variables: { id } }).then((result) => {
  //     const div = result?.data?.divination
  //     if (div?.layout) {
  //       const store = JSON.parse(div.layout)
  //       useProtocolStore.setState({ ...store })
  //     }
  //   })
  // }

  // --- Экспорт ---
  const sanitize = (str: string) =>
    str
      .replace(/[\\/:*?"<>|]+/g, '_')
      .replace(/\s+/g, '_')
      .slice(0, 64)

  const handleExport = () => {
    const store = useProtocolStore.getState()
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
  }

  // --- Импорт ---
  const handleImportButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (
      !window.confirm(
        'Импорт перезапишет текущее состояние расклада. Продолжить?'
      )
    )
      return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        useProtocolStore.setState({ ...data })
      } catch (err) {
        alert('Ошибка при импорте файла')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={reset} title="Очистить">
        <Trash2 />
      </Button>
      <Button onClick={toggleAddLinkMode} title="Добавить линию">
        <Link2 />
      </Button>
      <Button onClick={handleExport} title="Экспорт">
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
      />
      <Button onClick={handleSave} title="Сохранить в БД">
        Сохранить в БД
      </Button>
      <Button onClick={() => setShowList(true)} title="Список раскладов">
        Список раскладов
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
                // handleLoadDivination(id)
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
