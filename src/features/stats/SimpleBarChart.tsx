import type { PeriodBucket } from './statsSelectors'

interface SimpleBarChartProps {
  data: PeriodBucket[]
  title?: string
}

export default function SimpleBarChart({ data, title }: SimpleBarChartProps) {
  const max = Math.max(1, ...data.map((point) => point.count))

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      {title ? <p className="mb-3 text-sm font-medium text-text">{title}</p> : null}
      <div className="flex h-32 gap-1" role="img" aria-label={title}>
        {data.map((point) => (
          <div key={point.key} className="flex h-full flex-1 flex-col justify-end">
            <div
              className="w-full rounded-t bg-state-mvp"
              style={{ height: `${(point.count / max) * 100}%`, minHeight: point.count > 0 ? '4px' : '1px' }}
              title={`${point.date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}: ${point.count}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
