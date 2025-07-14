import { useQuery, gql } from '@redwoodjs/web'

import { useDialog } from 'src/components/ui/DialogManager'
import { useSnackbar } from 'src/components/ui/SnackbarManager'
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

export const DivinationsList = ({ onSelect }) => {
  const { data, loading } = useQuery(DIVINATIONS)
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
        onConfirm: () => onSelect(id),
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
  /* eslint-disable jsx-a11y/click-events-have-key-events */
  /* eslint-disable jsx-a11y/no-static-element-interactions */
  return (
    <div className="max-h-96 space-y-2 overflow-y-auto p-2">
      {data?.divinations?.map((div) => (
        <div
          key={div.id}
          className="cursor-pointer rounded border p-2 hover:bg-yellow-50"
          onClick={() => handleSelect(div.id)}
        >
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
      ))}
    </div>
  )
}
