import React from 'react'

export function MarkdownMarkers({ children }) {
  const text = React.Children.toArray(children)
    .map((child) => (typeof child === 'string' ? child : ''))
    .join('')
  const regex = /\[\[(hoggva|rune):([^\]]+)\]\]/g
  const parts = []
  let lastIndex = 0
  let match
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    parts.push(
      <span
        key={match.index}
        className={
          match[1] === 'hoggva'
            ? 'mr-1 rounded bg-yellow-200 px-2 py-0.5 font-bold text-yellow-900'
            : 'mr-1 rounded bg-gray-200 px-2 py-0.5 font-bold text-gray-800'
        }
      >
        {match[2]}
      </span>
    )
    lastIndex = regex.lastIndex
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }
  return <>{parts}</>
}
