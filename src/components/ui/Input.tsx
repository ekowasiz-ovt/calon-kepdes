import type { InputHTMLAttributes } from 'react'
import clsx from 'clsx'

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  label: string
  id: string
  hint?: string
  error?: string
}

export function Input({ label, id, hint, error, className, ...props }: InputProps) {
  return (
    <label className="ui-field" htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        className={clsx('ui-field__control', error && 'ui-field__control--error', className)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...props}
      />
      {hint && !error && <span id={`${id}-hint`} className="ui-field__hint">{hint}</span>}
      {error && <span id={`${id}-error`} className="ui-field__error">{error}</span>}
    </label>
  )
}