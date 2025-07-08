/*
 * web/src/components/GodsAsking/Protocol/QuestionPanel.tsx
 */
import React from 'react'

import { useProtocolStore } from 'src/stores/protocolStore'

export const QuestionPanel = () => {
  const question = useProtocolStore((s) => s.question)
  const setQuestion = useProtocolStore((s) => s.setQuestion)
  const fixQuestion = useProtocolStore((s) => s.fixQuestion)
  const questionFixedTime = useProtocolStore((s) => s.questionFixedTime)

  return (
    <div className="flex flex-col space-y-1 mb-4">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={question}
          disabled={!!questionFixedTime}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Введите ваш вопрос..."
          className="flex-1 border rounded p-1"
        />
        {questionFixedTime ? (
          <div className="text-green-600 text-sm">
            {new Date(questionFixedTime).toLocaleString()}
          </div>
        ) : (
          <button
            disabled={!question.trim()}
            onClick={fixQuestion}
            className="px-3 py-1 rounded bg-blue-500 text-white disabled:opacity-50"
          >
            Зафиксировать
          </button>
        )}
      </div>
      <div className="text-xs text-gray-500">
        Вопрос задан в:{' '}
        {questionFixedTime ? new Date(questionFixedTime).toLocaleString() : '—'}
      </div>
    </div>
  )
}
