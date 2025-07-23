import React, { useState, useRef } from 'react'

import MDEditor from '@uiw/react-md-editor'

import { gql, useMutation } from '@redwoodjs/web'

import FilePickerWindow from '../ui/FilePickerWindow'
import { FloatingWindow } from '../ui/FloatingWindow'
import { useSnackbar } from '../ui/SnackbarManager'

const CREATE_POST_MUTATION = gql`
  mutation CreatePostMutation($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      content
      tags
      type
      createdAt
      updatedAt
    }
  }
`

const UPDATE_POST_MUTATION = gql`
  mutation UpdatePostMutation($id: Int!, $input: UpdatePostInput!) {
    updatePost(id: $id, input: $input) {
      id
      title
      content
      tags
      type
      createdAt
      updatedAt
    }
  }
`

const JournalEditor = ({ post = {}, onClose }) => {
  const [title, setTitle] = useState(post.title || '')
  const [content, setContent] = useState(post.content || '')

  const [createPost, { loading: creating, error: createError }] =
    useMutation(CREATE_POST_MUTATION)
  const [updatePost, { loading: updating, error: updateError }] =
    useMutation(UPDATE_POST_MUTATION)

  const fileInputRef = useRef()
  const { showSnackbar } = useSnackbar()

  const [showFilePicker, setShowFilePicker] = useState(false)

  const handleSave = async () => {
    const input = {
      userId: post.userId ?? 1,
      title,
      content,
      tags: post.tags ?? '',
      type: post.type ?? 'default',
      divinationId: post.divinationId ?? null,
    }

    try {
      if (post.id) {
        await updatePost({ variables: { id: post.id, input } })
        showSnackbar({ message: 'Пост обновлён!', severity: 'success' })
      } else {
        await createPost({ variables: { input } })
        showSnackbar({ message: 'Пост создан!', severity: 'success' })
      }
      onClose()
    } catch (e) {
      showSnackbar({
        message: 'Ошибка при сохранении: ' + e.message,
        severity: 'error',
        duration: 6000,
      })
    }
  }

  return (
    <div className="flex min-h-0 w-full max-w-full flex-1 flex-col rounded bg-white p-4 shadow-md">
      <input
        className="mb-4 w-full rounded border px-3 py-2 text-xl font-semibold"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Заголовок"
      />
      <div
        className="flex min-h-0 flex-1 flex-col"
        style={{ minHeight: 0, flex: 1 }}
      >
        <div
          style={{ height: '65vh', minHeight: 0 }}
          onDrop={async (e) => {
            e.preventDefault()
            const file = e.dataTransfer.files?.[0]
            if (!file) return
            const formData = new FormData()
            formData.append('file', file)
            const res = await fetch('/.redwood/functions/upload', {
              method: 'POST',
              body: formData,
            })
            const data = await res.json()
            if (data.url) {
              setContent((c) => c + `\n\n![${file.name}](${data.url})\n\n`)
            }
          }}
          onDragOver={(e) => e.preventDefault()}
        >
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
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          className="mr-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-800"
          onClick={() => setShowFilePicker(true)}
        >
          Выбрать/загрузить картинку
        </button>
        <button
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-800"
          onClick={handleSave}
        >
          Сохранить
        </button>
        <button
          className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
          onClick={onClose}
        >
          Отмена
        </button>
      </div>
      {showFilePicker && (
        <FloatingWindow onClose={() => setShowFilePicker(false)}>
          <FilePickerWindow
            onClose={() => setShowFilePicker(false)}
            onSelect={(url, filename) => {
              setContent((c) => c + `\n\n![${filename || 'image'}](${url})\n\n`)
            }}
          />
        </FloatingWindow>
      )}
    </div>
  )
}

export default JournalEditor
