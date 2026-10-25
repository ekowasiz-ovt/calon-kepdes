type SkeletonProps = {
  width?: string | number
  height?: string | number
  className?: string
}

export function Skeleton({ width = '100%', height = 16, className }: SkeletonProps) {
  return (
    <span
      className={['ui-skeleton', className].filter(Boolean).join(' ')}
      aria-hidden="true"
      style={{ width, height }}
    />
  )
}