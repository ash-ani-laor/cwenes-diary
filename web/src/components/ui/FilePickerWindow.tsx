import React, { useState, useRef } from 'react'

const FilePickerWindow = ({ onSelect, onClose }) => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const inputRef = useRef()

  // Загрузка списка файлов при монтировании
  React.useEffect(() => {
    fetch('/uploads/list.json') // Можно сделать API или хранить list.json с путями файлов
      .then((res) => res.json())
      .then((data) => {
        setFiles(data.files)
        setLoading(false)
      })
      .catch(() => setFiles([]))
  }, [])

  // Обработка загрузки файла
  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('http://localhost:9999/upload', {
      method: 'POST',
      body: formData,
    })
    const data = await res.json()
    if (data.url) {
      setFiles((prev) => [data.url, ...prev])
      if (onSelect) onSelect(data.url, file.name)
      onClose()
    }
  }

  // Drag'n'Drop
  const handleDrop = async (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('http://localhost:9999/upload', {
      method: 'POST',
      body: formData,
    })
    const data = await res.json()
    if (data.url) {
      setFiles((prev) => [data.url, ...prev])
      if (onSelect) onSelect(data.url, file.name)
      onClose()
    }
  }

  return (
    <div
      className="min-h-[280px] min-w-[350px] max-w-[90vw] p-4"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="mb-2 flex justify-between text-lg font-bold">
        <span>Загрузка и выбор файла</span>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500">
          ✕
        </button>
      </div>
      <div className="mb-2 flex items-center gap-2">
        <button
          className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-800"
          onClick={() => inputRef.current.click()}
        >
          Загрузить с компьютера
        </button>
        <span className="text-sm text-gray-500">
          или перетащи файл в это окно
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleUpload}
        />
      </div>
      <div className="mb-2 text-xs text-gray-400">Доступные картинки:</div>
      <div className="grid grid-cols-3 gap-2">
        {loading ? (
          <span>Загрузка...</span>
        ) : files.length === 0 ? (
          <span className="col-span-3 text-center text-gray-400">
            Нет файлов
          </span>
        ) : (
          files.map((url) => (
            <button
              key={url}
              className="rounded border bg-gray-50 p-1 hover:border-blue-400"
              onClick={() => {
                onSelect(url)
                onClose()
              }}
            >
              <img
                src={url}
                alt={url}
                className="mx-auto max-h-24 max-w-full object-contain"
              />
            </button>
          ))
        )}
      </div>
    </div>
  )
}

export default FilePickerWindow
