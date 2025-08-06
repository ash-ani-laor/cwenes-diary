// web/src/components/GodsAsking/Protocol/QuestionPanelReadonly.tsx
import React from 'react'
import { TagsInput } from 'src/components/Journal/TagsInput'

export const QuestionPanelReadonly = ({
  question,
  questionFixedTime,
  tags,
}) => (
  <div className="mb-4 flex flex-col space-y-1">
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={question}
        disabled
        className="flex-1 rounded border p-1"
      />
      <div className="text-sm text-green-600">
        {questionFixedTime ? new Date(questionFixedTime).toLocaleString() : ''}
      </div>
    </div>
    <TagsInput value={tags || []} readOnly suggestions={[]} />
  </div>
)
