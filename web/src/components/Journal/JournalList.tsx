import React, { useState, useRef, useEffect } from 'react'

import PostsCell from 'src/components/Journal/PostsCell'

const PAGE_SIZE = 10

const JournalList = ({ onSelect }) => {
  const [page, setPage] = useState(1)
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE)
  const loader = useRef(null)

  // Intersection Observer для "ленивой" подгрузки (только визуально — на клиенте)
  useEffect(() => {
    if (!loader.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayCount((c) => c + PAGE_SIZE)
        }
      },
      { threshold: 1 }
    )
    observer.observe(loader.current)
    return () => observer.disconnect()
  }, [])

  return (
    <PostsCell>
      {({ posts }) => {
        if (!posts?.length) return <div>Записей пока нет</div>

        const sorted = [...posts].sort((a, b) =>
          b.createdAt.localeCompare(a.createdAt)
        )
        const totalPages = Math.ceil(sorted.length / PAGE_SIZE)

        // Если ленивый скролл догрузил больше, показываем не только текущую страницу
        const end = Math.max(page * PAGE_SIZE, displayCount)
        const paged = sorted.slice(0, end)

        return (
          <div className="w-full">
            {/* Пагинатор */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setPage(1)
                  setDisplayCount(PAGE_SIZE)
                }}
                disabled={page === 1}
                className="rounded bg-gray-200 px-2 py-1 hover:bg-gray-300 disabled:opacity-50"
              >
                ⏮ В начало
              </button>
              <button
                onClick={() => {
                  const newPage = Math.max(page - 1, 1)
                  setPage(newPage)
                  setDisplayCount(newPage * PAGE_SIZE)
                }}
                disabled={page === 1}
                className="rounded bg-gray-200 px-2 py-1 hover:bg-gray-300 disabled:opacity-50"
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPage(i + 1)
                    setDisplayCount((i + 1) * PAGE_SIZE)
                  }}
                  disabled={page === i + 1}
                  className={`rounded px-2 py-1 ${page === i + 1 ? 'bg-blue-200 font-bold' : 'bg-gray-100 hover:bg-gray-200'} disabled:opacity-60`}
                >
                  {i + 1}
                </button>
              )).slice(Math.max(page - 3, 0), page + 2)}
              <button
                onClick={() => {
                  const newPage = Math.min(page + 1, totalPages)
                  setPage(newPage)
                  setDisplayCount(newPage * PAGE_SIZE)
                }}
                disabled={page === totalPages}
                className="rounded bg-gray-200 px-2 py-1 hover:bg-gray-300 disabled:opacity-50"
              >
                →
              </button>
              <button
                onClick={() => {
                  setPage(totalPages)
                  setDisplayCount(totalPages * PAGE_SIZE)
                }}
                disabled={page === totalPages}
                className="rounded bg-gray-200 px-2 py-1 hover:bg-gray-300 disabled:opacity-50"
              >
                В конец ⏭
              </button>
            </div>

            {/* Список записей (ограниченный page/pageSize или displayCount для скролла) */}
            <div className="space-y-4">
              {paged
                .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
                .map((post) => (
                  <div
                    key={post.id}
                    className="cursor-pointer rounded border bg-white p-4 shadow hover:bg-yellow-50"
                    onClick={() => onSelect?.(post)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold">{post.title}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(post.createdAt).toLocaleString('ru-RU')}
                      </div>
                    </div>
                    <div className="mt-1 line-clamp-3 text-gray-700">
                      {post.content.substring(0, 160)}
                      {post.content.length > 160 && '…'}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {JSON.parse(post.tags || '[]').map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-blue-100 px-2 py-0.5 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.divinationId && (
                        <span className="rounded bg-amber-200 px-2 py-0.5 text-xs">
                          Расклад #{post.divinationId}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              {/* loader для бесконечного скролла */}
              {end < sorted.length && (
                <div ref={loader} style={{ height: 24 }}></div>
              )}
            </div>
          </div>
        )
      }}
    </PostsCell>
  )
}

export default JournalList
