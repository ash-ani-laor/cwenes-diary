// web/src/components/Divinations/DivinationCard.tsx

import React from 'react'

import { parseTags } from 'src/lib/parseTags'

const DivinationCard = ({
  divination,
  onClick, // если нужно сделать карточку кликабельной
  className = '',
  style = {},
  compact = false, // если нужен особо компактный вид
}) => {
  if (!divination) return null

  return (
    <div
      className={
        'rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 shadow-sm transition hover:shadow-md ' +
        (onClick ? 'cursor-pointer hover:bg-yellow-100 ' : '') +
        className
      }
      style={style}
      onClick={onClick}
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="font-semibold text-yellow-900">
          {divination.question || 'Без вопроса'}
        </span>
        <span className="ml-2 text-xs text-gray-500">
          {divination.questionFixedTime
            ? new Date(divination.questionFixedTime).toLocaleString('ru-RU')
            : ''}
        </span>
      </div>
      {!compact && (
        <div className="mb-1 flex flex-wrap gap-1">
          {(typeof divination.tags === 'string'
            ? parseTags(divination.tags)
            : divination.tags || []
          ).map((tag) => (
            <span
              key={tag}
              className="rounded bg-yellow-200 px-2 py-0.5 text-xs text-yellow-900"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {divination.result && !compact && (
        <div className="mt-1 line-clamp-3 text-xs text-gray-700">
          {/* Можешь выводить тут краткий результат, если хочешь */}
          {divination.result}
        </div>
      )}
    </div>
  )
}

export default DivinationCard
