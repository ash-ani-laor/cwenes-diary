/*
 * web/src/components/ui/Button.tsx
 */
import * as React from 'react'

import { clsx } from 'clsx'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
          variant === 'primary' && 'bg-blue-500 text-white hover:bg-blue-600',
          variant === 'secondary' && 'bg-gray-200 text-black hover:bg-gray-300',
          variant === 'ghost' &&
            'bg-transparent text-blue-500 hover:bg-blue-100',
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
