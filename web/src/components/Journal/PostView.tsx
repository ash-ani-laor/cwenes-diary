import React from 'react'

import ReactMarkdown from 'react-markdown'

import { parseTags } from 'src/lib/parseTags'

import { MarkdownMarkers } from '../Journal/MarkdownMarkers'

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
      <div className="mb-4 flex flex-wrap gap-2">
        {parseTags(post.tags).map((tag) => (
          <span
            key={tag}
            className="rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mb-2 text-sm text-gray-400">Тип: {post.type}</div>
      {post.divination && (
        <div className="mb-2 text-sm text-green-700">
          Привязка к протоколу: {post.divination.title || post.divination.id}
        </div>
      )}
      <div className="prose prose-slate dark:prose-invert mt-4 max-w-none text-base">
        <ReactMarkdown
          components={{
            p: ({ node, children }) => (
              <p>
                <MarkdownMarkers>{children.join('')}</MarkdownMarkers>
              </p>
            ),
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default PostView
