/*
 * web/src/components/Protocol/ControlPanel.tsx
 */
import React from 'react'

import { Trash2, Link2, Download, Upload } from 'lucide-react'

import { Button } from 'src/components/ui/Button'
import { useProtocolStore } from 'src/stores/protocolStore'

const sanitize = (str: string) =>
  str
    .replace(/[\\/:*?"<>|]+/g, '_')
    .replace(/\s+/g, '_')
    .slice(0, 64)

const handleExport = () => {
  const store = useProtocolStore.getState()
  console.log('store.links', store.links)

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

const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0]
  console.log('IMPORT', file)
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

const ControlPanel = () => {
  const { reset, toggleAddLinkMode, isAddLinkMode } = useProtocolStore()
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleImportButtonClick = () => {
    fileInputRef.current?.click()
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
    </div>
  )
}

export default ControlPanel
