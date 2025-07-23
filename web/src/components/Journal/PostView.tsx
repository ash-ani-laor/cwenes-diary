import React from 'react'

import ReactMarkdown from 'react-markdown'

const PostView = ({ post }) => {
  if (!post) return null

  return (
    <div className="min-w-[320px] max-w-[540px] p-4">
      <h2 className="mb-3 text-2xl font-bold">{post.title}</h2>
      <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
        <span>
          {post.user?.name ? (
            <>Автор: {post.user.name}</>
          ) : (
            <>Автор: пользователь {post.userId}</>
          )}
        </span>
        <span>{new Date(post.createdAt).toLocaleString()}</span>
      </div>
      {post.tags && (
        <div className="mb-2 text-sm font-semibold text-blue-600">
          Теги: {post.tags}
        </div>
      )}
      <div className="mb-2 text-sm text-gray-400">Тип: {post.type}</div>
      {post.divination && (
        <div className="mb-2 text-sm text-green-700">
          Привязка к протоколу: {post.divination.title || post.divination.id}
        </div>
      )}
      <div className="prose prose-slate dark:prose-invert mt-4 max-w-none text-base">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </div>
  )
}

export default PostView
