//web\src\components\GodsAsking\Protocol\DivinationEditor4FloatingWindow.tsx
import React, { useState, useMemo } from 'react'

import { useMutation } from '@redwoodjs/web'
import { useQuery } from '@redwoodjs/web'

import { DELETE_DRAFT } from 'src/components/GodsAsking/Protocol/draft.gql'
import { DRAFTS } from 'src/components/GodsAsking/Protocol/draft.gql'
import { DraftTypes } from 'src/constants/draftTypes'
import { useDivinationDraft } from 'src/hooks/useDivinationDraft'

export function useDraftForEditor({ userId, type }) {
  const { data, loading } = useQuery(DRAFTS)

  // Берём черновик по типу и пользователю
  const draft = data?.drafts?.find(
    (d) => d.userId === userId && d.type === type
  )

  return { draft, loading }
}

// где-то в начале компонента
function isDirty(values, draft) {
  if (!draft || !draft.data) return true
  try {
    const draftObj =
      typeof draft.data === 'string' ? JSON.parse(draft.data) : draft.data
    return JSON.stringify(values) !== JSON.stringify(draftObj)
  } catch {
    return true
  }
}

const userId = 1

// Типы пропсов для интеграции с JournalEditor/FloatingWindow
// interface DivinationEditor4FloatingWindowProps {
//   initData?: {
//     question?: string
//     date?: string
//     tags?: string[]
//     symbols?: any[] // Можно уточнить тип позднее
//   }
//   onSave: (data: any) => void // что сохраняем (новый расклад)
//   onCancel: () => void // закрыть окно без сохранения
// }

// const DivinationEditor4FloatingWindow: React.FC<
//   DivinationEditor4FloatingWindowProps
// > = ({ initData = {}, onSave, onCancel }) => {
//   // Состояния для формы (вопрос, дата, теги, символы)
//   const [question, setQuestion] = useState(initData.question || '')
//   const [date, setDate] = useState(
//     initData.date || new Date().toISOString().slice(0, 10)
//   )
//   const [tags, setTags] = useState<string[]>(initData.tags || [])
//   const [symbols, setSymbols] = useState<any[]>(initData.symbols || [])

//   const [deleteDraft] = useMutation(DELETE_DRAFT)
//   const [showConfirm, setShowConfirm] = useState(false)

//   const { draft, loading } = useDraftForEditor({
//     userId,
//     type: DraftTypes.PROTOCOL,
//   })

//   const values = useMemo(
//     () => ({ question, date, tags, symbols }),
//     [question, date, tags, symbols]
//   )

//   // useDivinationDraft({
//   //   userId,
//   //   draft,
//   //   values,
//   //   loading,
//   // })

//   // TODO: можно добавить дополнительные поля (описание, заметки...)

//   // Сохраняем новый расклад
//   const handleSave = () => {
//     // TODO: валидация и сбор данных
//     const data = {
//       question,
//       date,
//       tags,
//       symbols,
//       // сюда добавлять всё, что появится в дальнейшем
//     }
//     onSave(data)
//   }

//   // Заглушка под рендеринг символов и других редакторских частей
//   // (сюда поэтапно добавим полноценный UI/UX)
//   return (
//     <div style={{ padding: 24, minWidth: 350, maxWidth: 520 }}>
//       <h2>Создать новый расклад</h2>
//       <div style={{ marginBottom: 16 }}>
//         <label>
//           Вопрос: <br />
//           <input
//             type="text"
//             value={question}
//             onChange={(e) => setQuestion(e.target.value)}
//             style={{ width: '100%' }}
//             placeholder="Введите вопрос или тему расклада"
//           />
//         </label>
//       </div>
//       <div style={{ marginBottom: 16 }}>
//         <label>
//           Дата: <br />
//           <input
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             style={{ width: '60%' }}
//           />
//         </label>
//       </div>
//       <div style={{ marginBottom: 16 }}>
//         <label>
//           Теги: <br />
//           <input
//             type="text"
//             value={tags.join(', ')}
//             onChange={(e) =>
//               setTags(
//                 e.target.value
//                   .split(',')
//                   .map((t) => t.trim())
//                   .filter(Boolean)
//               )
//             }
//             placeholder="тег1, тег2, ..."
//             style={{ width: '100%' }}
//           />
//         </label>
//       </div>
//       <div style={{ marginBottom: 16 }}>
//         <label>
//           Символы/карты (пока заглушка): <br />
//           <textarea
//             value={JSON.stringify(symbols, null, 2)}
//             onChange={(e) => {
//               try {
//                 setSymbols(JSON.parse(e.target.value))
//               } catch {}
//             }}
//             style={{ width: '100%', height: 60, fontFamily: 'monospace' }}
//             placeholder="Сюда потом добавим редактор плашек"
//           />
//         </label>
//       </div>

//       <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
//         <button
//           onClick={() => {
//             // При нажатии “Добавить” — вызываем onSave с данными из черновика!
//             if (draft && draft.id) {
//               onSave({ ...draft }) // (или прокидывай id — зависит от твоей логики)
//             }
//           }}
//           disabled={!draft || !draft.id}
//           style={{ flex: 1, opacity: !draft || !draft.id ? 0.5 : 1 }}
//         >
//           Добавить в редактируемую запись
//         </button>

//         <button
//           onClick={() => {
//             // Проверяем: если есть несохранённые изменения — запрашиваем подтверждение
//             // Можно здесь дописать свою dirty-проверку (например, сравнить draft.data с values)
//             if (JSON.stringify(values) !== draft?.data) {
//               setShowConfirm(true)
//             } else {
//               handleCancel()
//             }
//           }}
//           style={{ flex: 1 }}
//         >
//           Отмена
//         </button>
//       </div>

//       {/*
//       DIVIDER DIVIDER DIVIDER DIVIDER DIVIDER DIVIDER DIVIDER DIVIDER
//       DIVIDER DIVIDER DIVIDER DIVIDER DIVIDER DIVIDER DIVIDER DIVIDER
//       DIVIDER DIVIDER DIVIDER DIVIDER DIVIDER DIVIDER DIVIDER DIVIDER
//       */}

//       {showConfirm && (
//         <div className="confirm-dialog">
//           <p>Есть несохранённые изменения. Отменить и удалить черновик?</p>
//           <button
//             onClick={async () => {
//               if (draft && draft.id) {
//                 await deleteDraft({ variables: { id: draft.id } })
//               }
//               setShowConfirm(false)
//               handleCancel()
//             }}
//           >
//             Да, отменить
//           </button>
//           <button onClick={() => setShowConfirm(false)}>Нет, вернуться</button>
//         </div>
//       )}
//     </div>
//   )
// }

const DivinationEditor4FloatingWindow = ({ onSave, onCancel }) => {
  const [question, setQuestion] = useState('')
  return (
    <div>
      <input value={question} onChange={(e) => setQuestion(e.target.value)} />
      <button onClick={() => onSave({ question })}>Сохранить</button>
      <button onClick={onCancel}>Отмена</button>
    </div>
  )
}

export default DivinationEditor4FloatingWindow
