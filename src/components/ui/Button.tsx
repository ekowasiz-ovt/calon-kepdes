import type { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'soft'
  icon?: ReactNode
}

export function Button({ variant = 'primary', icon, className, children, ...props }: ButtonProps) {
  return (
    <button className={clsx('ui-button', `ui-button--${variant}`, className)} {...props}>
      {icon}
      {children}
    </button>
  )
}