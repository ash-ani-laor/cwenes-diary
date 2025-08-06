/**
 * web\src\components\GodsAsking\Protocol\DivinationsList.tsx
 */
import gql from 'graphql-tag'

import { useMutation, useQuery } from '@redwoodjs/web'

import { useDialog } from 'src/components/ui/DialogManager'
import { useSnackbar } from 'src/components/ui/SnackbarManager'
import { useProtocolStore } from 'src/stores/protocolStore'
import { useIsDirty } from 'src/stores/useIsDirty'

export const DIVINATIONS = gql`
  query Divinations {
    divinations {
      id
      question
      questionFixedTime
      tags
    }
  }
`

// --- Мутация на удаление ---
const DELETE_DIVINATION = gql`
  mutation DeleteDivination($id: Int!) {
    deleteDivination(id: $id) {
      id
    }
  }
`

export const DivinationsList = ({ onSelect }) => {
  const { data, loading, refetch } = useQuery(DIVINATIONS)
  const [deleteDivination] = useMutation(DELETE_DIVINATION, {
    onCompleted: () => refetch(),
  })

  const isDirty = useIsDirty()
  const { showDialog } = useDialog()
  const { showSnackbar } = useSnackbar()

  if (loading) return <div>Загрузка...</div>
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events
  // eslint-disable-next-line jsx-a11y/no-static-element-interactions

  const handleSelect = (id) => {
    if (isDirty) {
      showDialog({
        message:
          'У вас есть несохранённые изменения. Загрузить расклад и потерять несохранённое?',
        confirmText: 'Загрузить',
        cancelText: 'Отмена',
        onConfirm: () => {
          onSelect(Number(id))
          showSnackbar({
            message: 'Расклад загружен',
            severity: 'success',
          })
          useProtocolStore.getState().markSaved()
        },
        onCancel: () => {
          showSnackbar({
            message: 'Открытие расклада отменено',
            severity: 'info',
          })
        },
      })
    } else {
      onSelect(id)
    }
  }

  // --- Новая функция: удалить с подтверждением ---
  const handleDelete = (id) => {
    showDialog({
      message: 'Точно удалить этот расклад? Это действие нельзя отменить.',
      confirmText: 'Удалить',
      cancelText: 'Отмена',
      onConfirm: async () => {
        await deleteDivination({ variables: { id } })
        await refetch() // <<-- вот это гарантирует обновление!
        showSnackbar({ message: 'Расклад удалён', severity: 'success' })
      },
      onCancel: () => {
        showSnackbar({ message: 'Удаление отменено', severity: 'info' })
      },
    })
  }

  /* eslint-disable jsx-a11y/click-events-have-key-events */
  /* eslint-disable jsx-a11y/no-static-element-interactions */
  return (
    <div className="max-h-96 space-y-2 overflow-y-auto p-2">
      {data?.divinations?.map((div) => (
        <div
          key={div.id}
          className="flex cursor-pointer items-center justify-between rounded border p-2 hover:bg-yellow-50"
          // Левый клик - выбрать
          onClick={() => handleSelect(div.id)}
        >
          <div>
            <div className="font-semibold">{div.question}</div>
            <div className="text-xs text-gray-600">
              {new Date(div.questionFixedTime).toLocaleString('ru-RU')}
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              {JSON.parse(div.tags || '[]').map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-blue-100 px-2 py-0.5 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          {/* Кнопка удалить */}
          <button
            className="ml-4 rounded bg-red-100 px-2 py-1 text-xs text-red-700 hover:bg-red-200"
            title="Удалить расклад"
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(div.id)
            }}
          >
            удалить
          </button>
        </div>
      ))}
    </div>
  )
}
