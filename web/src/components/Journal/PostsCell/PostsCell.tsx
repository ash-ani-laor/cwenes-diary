//web\src\components\Journal\PostsCell\PostsCell.tsx
import React, { useRef, useEffect, useState } from 'react'

import ReactMarkdown from 'react-markdown'

import { gql, useMutation } from '@redwoodjs/web'

import DivinationCard from 'src/components/Divinations/DivinationCard'
import { parseTags } from 'src/lib/parseTags'

import { MarkdownMarkers } from '../../Journal/MarkdownMarkers'
import { useSnackbar } from '../../ui/SnackbarManager'

export const QUERY = gql`
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

const DELETE_POST_MUTATION = gql`
  mutation DeletePostMutation($id: Int!) {
    deletePost(id: $id) {
      id
    }
  }
`

export const Loading = () => <div>Загрузка записей...</div>
export const Empty = () => <div>Записей пока нет</div>
export const Failure = ({ error }) => <div>Ошибка: {error.message}</div>

export const Success = ({ posts, onEdit, onView }) => {
  const PAGE_SIZE = 5
  const [page, setPage] = useState(1)
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE)
  const loader = useRef(null)

  const [deletePost, { loading: deleting, error: deleteError }] = useMutation(
    DELETE_POST_MUTATION,
    {
      refetchQueries: ['POSTS'],
    }
  )

  const { showSnackbar } = useSnackbar()

  function extractFirstImage(markdown) {
    if (!markdown) return null
    // Поиск ![alt](url)
    const match = markdown.match(/!\[[^\]]*\]\((?<url>.*?)\)/)
    return match?.groups?.url || null
  }

  function removeImagesFromPreviewButTheFirst(markdown) {
    if (!markdown) return markdown
    // Только первое вхождение
    //return markdown.replace(/!\[[^\]]*\]\((.*?)\)/, '').trim()
    return markdown.replace(/!\[[^\]]*\]\((.*?)\)/g, '').trim()
  }

  // Когда пользователь нажимает на пагинатор — сбрасываем displayCount в PAGE_SIZE
  useEffect(() => {
    setDisplayCount(page * PAGE_SIZE)
  }, [page])

  // Ленивая подгрузка страниц при скролле
  useEffect(() => {
    if (!loader.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayCount((c) => {
            // Не выходить за пределы общего количества записей
            return Math.min(posts.length, c + PAGE_SIZE)
          })
        }
      },
      { threshold: 1 }
    )
    observer.observe(loader.current)
    return () => observer.disconnect()
  }, [loader, posts.length])

  const allTags = Array.from(
    new Set(
      posts
        .flatMap((post) => parseTags(post.tags))
        .map((tag) => tag.trim())
        .filter(Boolean)
    )
  )

  function flattenChildren(children) {
    return React.Children.toArray(children)
      .map((child) => (typeof child === 'string' ? child : ''))
      .join('')
  }

  const sorted = [...posts].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  )
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)

  // Тут: если displayCount > PAGE_SIZE, показываем всё с первой до displayCount
  // если клик по пагинатору, ограничиваем одной страницей
  let visiblePosts
  if (displayCount > PAGE_SIZE || page === 1) {
    visiblePosts = sorted.slice(0, displayCount)
  } else {
    visiblePosts = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  }

  // Определяем, показывать ли лоадер для ленивой подгрузки
  const showLoader = displayCount < sorted.length

  const onDelete = async (id) => {
    if (!window.confirm('Удалить эту запись?')) return
    try {
      await deletePost({ variables: { id } })
      showSnackbar({ message: 'Запись удалена!', severity: 'success' })
    } catch (e) {
      showSnackbar({
        message: 'Ошибка при удалении: ' + e.message,
        severity: 'error',
        duration: 6000,
      })
    }
  }

  return (
    <div className="space-y-4">
      {visiblePosts.map((post) => {
        const imageUrl = extractFirstImage(post.content)
        const contentWithoutFirstImage = imageUrl
          ? removeImagesFromPreviewButTheFirst(post.content)
          : post.content

        return (
          <div
            key={post.id}
            className="mb-4 flex flex-col rounded-lg bg-white p-4 shadow-md"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleString()}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onView(post)}
                  className="rounded bg-gray-200 px-2 py-1 text-sm hover:bg-gray-300"
                >
                  Просмотреть
                </button>
                <button
                  onClick={() => onEdit(post)}
                  className="rounded bg-blue-600 px-2 py-1 text-sm text-white hover:bg-blue-800"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => onDelete(post.id)}
                  className="rounded bg-red-600 px-2 py-1 text-sm text-white hover:bg-red-800"
                >
                  Удалить
                </button>
              </div>
            </div>
            <div className="mb-1 text-lg font-bold">{post.title}</div>
            {/* Блок для картинки */}
            {post.divination ? (
              <DivinationCard divination={post.divination} />
            ) : (
              imageUrl && (
                <div className="mb-2 flex w-full justify-center">
                  <img
                    src={imageUrl}
                    alt="Превью"
                    className="max-h-52 rounded object-contain"
                    loading="lazy"
                  />
                </div>
              )
            )}
            <div className="mb-1 flex flex-wrap gap-2">
              {parseTags(post.tags).map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="prose prose-sm line-clamp-3 max-w-none text-gray-700">
              <ReactMarkdown
                components={{
                  p: ({ node, children }) => (
                    <p>
                      <MarkdownMarkers>{children}</MarkdownMarkers>
                    </p>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        )
      })}
      {/* loader для ленивой подгрузки */}
      {showLoader && <div ref={loader} style={{ height: 24 }}></div>}
    </div>
  )
}
