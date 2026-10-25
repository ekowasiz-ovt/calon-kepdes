import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: 'success' | 'info' | 'warning' | 'neutral' | 'danger'
}

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return <span className={clsx('ui-badge', `ui-badge--${tone}`, className)} {...props} />
}