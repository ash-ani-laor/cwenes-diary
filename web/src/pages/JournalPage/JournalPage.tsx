//web\src\pages\JournalPage\JournalPage.tsx
import React, { useState } from 'react'

import JournalEditor from 'src/components/Journal/JournalEditor'
import PostsCell from 'src/components/Journal/PostsCell'
import PostView from 'src/components/Journal/PostView'
import { FloatingWindow } from 'src/components/ui/FloatingWindow'

const JournalPage = () => {
  const [selectedPost, setSelectedPost] = useState(null)
  const handleNewPost = () => setSelectedPost({})
  const handleCloseEditor = () => setSelectedPost(null)
  const [viewPost, setViewPost] = useState(null)
  const handleCloseView = () => setViewPost(null)

  const isListView = !selectedPost

  return (
    <div className="flex min-h-[calc(100vh-48px)] flex-col overflow-hidden bg-gray-50">
      <div className="flex min-h-0 flex-1 flex-col px-8 pb-4 pt-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {selectedPost
              ? selectedPost.id
                ? 'Редактирование записи'
                : 'Новая запись'
              : 'Дневник'}
          </h1>
          {isListView && (
            <button
              className="ml-4 rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
              onClick={handleNewPost}
            >
              + Новая запись
            </button>
          )}
        </div>
        {isListView ? (
          <PostsCell onEdit={setSelectedPost} onView={setViewPost} />
        ) : (
          <div className="flex min-h-0 flex-1 flex-col">
            <JournalEditor post={selectedPost} onClose={handleCloseEditor} />
          </div>
        )}

        {viewPost && (
          <FloatingWindow onClose={handleCloseView}>
            <PostView post={viewPost} />
          </FloatingWindow>
        )}
      </div>
    </div>
  )
}

export default JournalPage
