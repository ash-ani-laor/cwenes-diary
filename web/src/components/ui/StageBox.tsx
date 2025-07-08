import * as React from 'react'

import { clsx } from 'clsx'

export function StageBox({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'relative min-h-[200px] rounded-xl border-2 border-dashed border-gray-400 p-4',
        className
      )}
    >
      {children}
    </div>
  )
}
