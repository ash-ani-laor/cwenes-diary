import React, { useState } from 'react'

import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { DateTime } from 'luxon'

import { useProtocolStore } from 'src/stores/protocolStore'

export const QuestionPanel = () => {
  const question = useProtocolStore((s) => s.question)
  const setQuestion = useProtocolStore((s) => s.setQuestion)
  const fixQuestion = useProtocolStore((s) => s.fixQuestion)
  const tags = useProtocolStore((s) => s.tags)
  const setTags = useProtocolStore((s) => s.setTags)
  const questionFixedTime = useProtocolStore((s) => s.questionFixedTime)
  const tempFixedTime = useProtocolStore((s) => s.tempFixedTime)
  const setTempFixedTime = useProtocolStore((s) => s.setTempFixedTime)

  const [tagInput, setTagInput] = useState('')

  const handleTagInput = (e) => {
    setTagInput(e.target.value)
  }

  // Добавить тег при Enter или запятой
  const handleTagKeyDown = (e) => {
    if (
      (e.key === 'Enter' || e.key === ',') &&
      tagInput.trim() &&
      !tags.includes(tagInput.trim())
    ) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
      e.preventDefault()
    }
  }

  // Удаление тега
  const removeTag = (tag) => {
    if (tags.length > 1) setTags(tags.filter((t) => t !== tag))
  }

  return (
    <div className="mb-4 flex flex-col space-y-1">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={question}
          disabled={!!questionFixedTime}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Введите ваш вопрос..."
          className="flex-1 rounded border p-1"
        />
        {!questionFixedTime && (
          <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="ru">
            <DateTimePicker
              label="Дата/время"
              value={tempFixedTime ? DateTime.fromISO(tempFixedTime) : null}
              onChange={(dt) => setTempFixedTime(dt ? dt.toISO() : null)}
              ampm={false}
              minutesStep={1}
              slotProps={{
                textField: { size: 'small', fullWidth: false },
              }}
            />
          </LocalizationProvider>
        )}
        {questionFixedTime ? (
          <div className="text-sm text-green-600">
            {new Date(questionFixedTime).toLocaleString()}
          </div>
        ) : (
          <button
            disabled={!question.trim()}
            onClick={fixQuestion}
            className="rounded bg-blue-500 px-3 py-1 text-white disabled:opacity-50"
          >
            Зафиксировать
          </button>
        )}
      </div>
      {questionFixedTime && (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={tagInput}
            onChange={handleTagInput}
            onKeyDown={handleTagKeyDown}
            placeholder="Добавить тег..."
            className="rounded border p-1 text-sm"
          />
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center rounded bg-blue-100 px-2 py-0.5 text-sm"
              >
                {tag}
                {tags.length > 1 && (
                  <button
                    className="ml-1 text-red-500"
                    onClick={() => removeTag(tag)}
                    tabIndex={-1}
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
