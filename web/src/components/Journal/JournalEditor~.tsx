import React, { useState } from 'react'

import MDEditor from '@uiw/react-md-editor'
import DivinationReadonlyView from 'web/src/components/Journal/DivinationReadonlyView'

import { gql, useMutation, useQuery } from '@redwoodjs/web'

import { parseTags } from 'src/lib/parseTags'

import DivinationCard from '../Divinations/DivinationCard'
import DivinationEditor4FloatingWindow from '../GodsAsking/Protocol/DivinationEditor4FloatingWindow'
import { DivinationsList } from '../GodsAsking/Protocol/DivinationsList'
import FilePickerWindow from '../ui/FilePickerWindow'
import { FloatingWindow } from '../ui/FloatingWindow'
import { useSnackbar } from '../ui/SnackbarManager'

import { TagsInput } from './TagsInput'

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

// const JournalEditor = ({ post = {}, onClose, allTags }) => {
//   const [title, setTitle] = useState(post.title || '')
//   const [content, setContent] = useState(post.content || '')
//   const [tags, setTags] = useState(() => {
//     // универсально для строки или json
//     return parseTags(post.tags || 'заметка').join(', ')
//   })

//   const [createPost, { loading: creating, error: createError }] =
//     useMutation(CREATE_POST_MUTATION)
//   const [updatePost, { loading: updating, error: updateError }] =
//     useMutation(UPDATE_POST_MUTATION)

//   const [divinationId, setDivinationId] = useState(post.divinationId ?? null)
//   const [showDivinations, setShowDivinations] = useState(false)
//   const [showFullDivination, setShowFullDivination] = useState(false)

//   const [showDivinationEditor, setShowDivinationEditor] = useState(false)
//   const handleCreateDivination = () => {
//     setShowDivinationEditor(true)
//   }

//   // Грузим подробную инфу о выбранном раскладе
//   const { data: divData } = useQuery(
//     gql`
//       query GetDivination($id: Int!) {
//         divination(id: $id) {
//           id
//           question
//           questionFixedTime
//           tags
//         }
//       }
//     `,
//     { variables: { id: divinationId }, skip: !divinationId }
//   )

//   const divination = divData?.divination

//   // const fileInputRef = useRef()
//   const { showSnackbar } = useSnackbar()

//   const [showFilePicker, setShowFilePicker] = useState(false)

//   const handleSave = async () => {
//     const input = {
//       userId: post.userId ?? 1,
//       title,
//       content,
//       tags,
//       type: post.type ?? 'default',
//       divinationId,
//     }

//     try {
//       if (post.id) {
//         await updatePost({ variables: { id: post.id, input } })
//         showSnackbar({ message: 'Пост обновлён!', severity: 'success' })
//       } else {
//         await createPost({ variables: { input } })
//         showSnackbar({ message: 'Пост создан!', severity: 'success' })
//       }
//       onClose()
//     } catch (e) {
//       showSnackbar({
//         message: 'Ошибка при сохранении: ' + e.message,
//         severity: 'error',
//         duration: 6000,
//       })
//     }
//   }

//   const handleSymbolClick = (symbol) => {
//     let marker
//     if (symbol.type === 'hoggva') marker = `[[hoggva:${symbol.name}]]`
//     else if (symbol.type === 'rune') marker = `[[rune:${symbol.name}]]`
//     else marker = `[[${symbol.type}:${symbol.name}]]`
//     setContent((c) => c + ' ' + marker)
//   }

//   return (
//     <div className="flex min-h-0 w-full max-w-full flex-1 flex-col rounded bg-white p-4 shadow-md">
//       <input
//         className="mb-4 w-full rounded border px-3 py-2 text-xl font-semibold"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         placeholder="Заголовок"
//       />

//       <TagsInput value={tags} onChange={setTags} suggestions={allTags} />

//       <div
//         className="flex min-h-0 flex-1 flex-col"
//         style={{ minHeight: 0, flex: 1 }}
//       >
//         <div
//           style={{ height: '60vh', minHeight: 0 }}
//           onDrop={async (e) => {
//             e.preventDefault()
//             const file = e.dataTransfer.files?.[0]
//             if (!file) return
//             const formData = new FormData()
//             formData.append('file', file)
//             const res = await fetch('http://localhost:9999/upload', {
//               method: 'POST',
//               body: formData,
//             })
//             const data = await res.json()
//             if (data.url) {
//               setContent((c) => c + `\n\n![${file.name}](${data.url})\n\n`)
//             }
//           }}
//           onDragOver={(e) => e.preventDefault()}
//         >
//           <MDEditor
//             className="min-h-0 flex-1"
//             value={content}
//             onChange={setContent}
//             style={{ height: '100%' }}
//             textareaProps={{
//               placeholder: 'Введите текст записи с поддержкой Markdown...',
//               style: { minHeight: 0, flex: 1 },
//             }}
//           />
//         </div>
//       </div>
//       <div className="mt-4 flex justify-end gap-2">
//         {/* GET OLD FROM NOTEPAD */}
//         {/* DIVID */}
//         <div className="mb-4">
//           <button
//             className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
//             onClick={handleCreateDivination}
//           >
//             Создать новый
//           </button>
//         </div>
//         {/* DIVID */}

//         <button
//           type="button"
//           className="mr-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-800"
//           onClick={() => setShowFilePicker(true)}
//         >
//           Графика
//         </button>
//         <button
//           className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-800"
//           onClick={handleSave}
//         >
//           Сохранить
//         </button>
//         <button
//           className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
//           onClick={onClose}
//         >
//           Отмена
//         </button>
//       </div>
//       {/*
//       DIVIDER DIVIDER DIVIDER DIVIDER DIVIDER DIVIDER DIVIDER DIVIDER
//       DIVIDER DIVIDER DIVIDER DIVIDER DIVIDER DIVIDER DIVIDER DIVIDER
//       DIVIDER DIVIDER DIVIDER DIVIDER DIVIDER DIVIDER DIVIDER DIVIDER
//       */}
//       {divination && (
//         <>
//           <DivinationCard
//             divination={divination}
//             onClick={() => setShowFullDivination(true)}
//           />
//           {showFullDivination && (
//             <FloatingWindow onClose={() => setShowFullDivination(false)}>
//               <div className="p-4">
//                 <h2 className="mb-2 text-xl font-bold">
//                   {divination.question}
//                 </h2>
//               </div>
//             </FloatingWindow>
//           )}
//         </>
//       )}
//       {showDivinations && (
//         <FloatingWindow
//           title="Выбор расклада"
//           onClose={() => setShowDivinations(false)}
//         >
//           <DivinationsList
//             onSelect={(id) => {
//               setDivinationId(id)
//               setShowDivinations(false)
//             }}
//           />
//         </FloatingWindow>
//       )}
//       {/* {showDivinationEditor && (
//         <FloatingWindow
//           title="Создать новый расклад"
//           onClose={() => setShowDivinationEditor(false)}
//         >
//           <DivinationEditor4FloatingWindow
//             onSave={(newDivination) => {
//               // TODO: логика сохранения нового расклада
//               setShowDivinationEditor(false)
//               // Можно вызвать обновление списка, привязку и т.д.
//             }}
//             onCancel={() => setShowDivinationEditor(false)}
//           />
//         </FloatingWindow>
//       )} */}

//       {showFilePicker && (
//         <FloatingWindow onClose={() => setShowFilePicker(false)}>
//           <FilePickerWindow
//             onClose={() => setShowFilePicker(false)}
//             onSelect={(url, filename) => {
//               setContent((c) => c + `\n\n![${filename || 'image'}](${url})\n\n`)
//             }}
//           />
//         </FloatingWindow>
//       )}
//     </div>
//   )
// }

const JournalEditor = () => {
  const [showDivinationEditor, setShowDivinationEditor] = useState(false)

  return (
    <div>
      <button onClick={() => setShowDivinationEditor(true)}>
        Создать новый
      </button>
      {showDivinationEditor && <div>Тестовое окно</div>}
    </div>
  )
}

export default JournalEditor
