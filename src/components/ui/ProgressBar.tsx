type ProgressBarProps = {
  value: number
  label?: string
  showValue?: boolean
}

export function ProgressBar({ value, label, showValue = false }: ProgressBarProps) {
  const progress = Math.max(0, Math.min(100, value))

  return (
    <div className="ui-progress">
      {(label || showValue) && (
        <div className="ui-progress__label">
          {label && <span>{label}</span>}
          {showValue && <span>{progress}%</span>}
        </div>
      )}
      <div
        className="ui-progress__track"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progres'}
      >
        <div className="ui-progress__fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}