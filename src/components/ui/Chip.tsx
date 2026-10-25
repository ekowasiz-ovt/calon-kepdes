import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean
}

export function Chip({ active = false, className, ...props }: ChipProps) {
  return (
    <button
      className={clsx('ui-chip', active && 'ui-chip--active', className)}
      aria-pressed={active}
      {...props}
    />
  )
}