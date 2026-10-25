import clsx from 'clsx'

export type TabOption<Value extends string = string> = {
  label: string
  value: Value
}

type TabsProps<Value extends string> = {
  options: TabOption<Value>[]
  value: Value
  onChange: (value: Value) => void
  ariaLabel: string
}

export function Tabs<Value extends string>({ options, value, onChange, ariaLabel }: TabsProps<Value>) {
  return (
    <div className="ui-tabs" role="tablist" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={option.value === value}
          className={clsx('ui-tabs__item', option.value === value && 'ui-tabs__item--active')}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}