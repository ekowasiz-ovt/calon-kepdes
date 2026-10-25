import type { SelectHTMLAttributes } from 'react'
import clsx from 'clsx'

export type SelectOption = {
  label: string
  value: string
}

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> & {
  label: string
  id: string
  options: SelectOption[]
  placeholder?: string
  hint?: string
  error?: string
}

export function Select({ label, id, options, placeholder, hint, error, className, ...props }: SelectProps) {
  return (
    <label className="ui-field" htmlFor={id}>
      <span>{label}</span>
      <select
        id={id}
        className={clsx('ui-field__control', error && 'ui-field__control--error', className)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {hint && !error && <span id={`${id}-hint`} className="ui-field__hint">{hint}</span>}
      {error && <span id={`${id}-error`} className="ui-field__error">{error}</span>}
    </label>
  )
}