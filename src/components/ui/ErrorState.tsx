import { WarningCircle } from '@phosphor-icons/react'
import { Button } from './Button'

type ErrorStateProps = {
  title?: string
  description: string
  onRetry: () => void
  retryLabel?: string
}

export function ErrorState({
  title = 'Terjadi masalah',
  description,
  onRetry,
  retryLabel = 'Coba lagi',
}: ErrorStateProps) {
  return (
    <section className="ui-state" role="alert">
      <WarningCircle size={20} aria-hidden="true" />
      <h3>{title}</h3>
      <p>{description}</p>
      <Button type="button" variant="outline" onClick={onRetry}>{retryLabel}</Button>
    </section>
  )
}