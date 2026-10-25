import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <section className="ui-state" aria-live="polite">
      {icon}
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </section>
  )
}