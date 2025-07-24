import React, { useState, useRef } from 'react'

export const TagsInput = ({ value, onChange, suggestions = [] }) => {
  const [input, setInput] = useState('')
  const [tags, setTags] = useState(
    Array.isArray(value)
      ? value
      : value
        ? value
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : []
  )
  const inputRef = useRef()

  // Для автодополнения
  const filteredSuggestions = suggestions.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
  )

  const addTag = (tag) => {
    const newTags = [...tags, tag.trim()]
      .filter(Boolean)
      .filter((t, i, arr) => arr.indexOf(t) === i)
    setTags(newTags)
    setInput('')
    onChange(newTags.join(', '))
  }

  const removeTag = (tag) => {
    const newTags = tags.filter((t) => t !== tag)
    setTags(newTags)
    onChange(newTags.join(', '))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab') {
      e.preventDefault()
      if (input.trim()) addTag(input)
    } else if (e.key === 'Backspace' && !input && tags.length) {
      removeTag(tags[tags.length - 1])
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded border bg-white px-2 py-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800"
        >
          {tag}
          <button
            className="ml-1 text-yellow-800 hover:text-red-600"
            onClick={() => removeTag(tag)}
            type="button"
          >
            ×
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-w-[100px] flex-1 bg-transparent px-2 py-1 text-sm outline-none"
        placeholder="Добавить тег..."
        list="tags-suggestions"
      />
      {/* Автодополнение */}
      {filteredSuggestions.length > 0 && input && (
        <div className="absolute z-10 mt-10 rounded border bg-white px-2 py-1 shadow">
          {filteredSuggestions.map((s) => (
            <div
              key={s}
              className="cursor-pointer px-1 py-0.5 hover:bg-yellow-200"
              onMouseDown={() => addTag(s)}
            >
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
