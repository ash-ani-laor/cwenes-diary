/*
 * web/src/components/ui/Alert.tsx
 */
import * as React from 'react'

import { clsx } from 'clsx'

export function Alert({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'flex items-center rounded-md border-l-4 border-blue-500 bg-blue-50 p-3 text-sm text-blue-700 shadow-sm',
        className
      )}
    >
      {children}
    </div>
  )
}
