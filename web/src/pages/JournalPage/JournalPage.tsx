// web/src/pages/JournalPage/JournalPage.tsx
import React, { useState } from 'react'

import { useQuery, gql } from '@redwoodjs/web'

import JournalEditor from 'src/components/Journal/JournalEditor'
import PostsCell from 'src/components/Journal/PostsCell'
import PostView from 'src/components/Journal/PostView'
import { FloatingWindow } from 'src/components/ui/FloatingWindow'
import { parseTags } from 'src/lib/parseTags'

const POSTS_QUERY = gql`
  query POSTS {
    posts {
      id
      title
      content
      tags
      createdAt
      divinationId
    }
  }
`

const JournalPage = () => {
  const { data, loading, error, refetch } = useQuery(POSTS_QUERY)
  const posts = data?.posts || []

  const [selectedPost, setSelectedPost] = useState(null)
  const [viewPost, setViewPost] = useState(null)

  // собираем уникальные теги
  const allTags = Array.from(
    new Set(
      posts
        .flatMap((post) => parseTags(post.tags))
        .map((tag) => tag.trim())
        .filter(Boolean)
    )
  )

  const handleNewPost = () => setSelectedPost({})
  const handleCloseEditor = () => {
    setSelectedPost(null)
    refetch() // подгрузи новые посты после сохранения
  }
  const handleCloseView = () => setViewPost(null)

  const isListView = !selectedPost

  if (loading) return <div>Загрузка...</div>
  if (error) return <div>Ошибка: {error.message}</div>

  return (
    <div className="flex min-h-[calc(100vh-48px)] flex-col overflow-hidden bg-gray-300">
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
          <PostsCell
            posts={posts}
            onEdit={setSelectedPost}
            onView={setViewPost}
          />
        ) : (
          <div className="flex min-h-0 flex-1 flex-col">
            <JournalEditor
              post={selectedPost}
              onClose={handleCloseEditor}
              allTags={allTags}
            />
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
