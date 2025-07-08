import * as React from 'react'

import { clsx } from 'clsx'

export function Card({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-gray-300 bg-white p-4 shadow-sm',
        className
      )}
    >
      {children}
    </div>
  )
}
