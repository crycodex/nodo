import { useState } from 'react'
import { useIdeasStore } from '../../store/ideasStore'
import {
  getConversionRate,
  getCountsByPeriod,
  getDiscardRate,
  getDistribution,
} from './statsSelectors'
import { getEstadoConfig } from '../kanban/kanbanConfig'
import StatTile from './StatTile'
import SimpleBarChart from './SimpleBarChart'

export default function StatsPage() {
  const ideas = useIdeasStore((state) => state.ideas)
  const [period, setPeriod] = useState(7)

  const distribution = getDistribution(ideas)
  const conversionRate = getConversionRate(ideas)
  const discardRate = getDiscardRate(ideas)
  const periodData = getCountsByPeriod(ideas, period)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-text">Estadísticas</h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Total de ideas" value={ideas.length} />
        <StatTile label="Tasa de conversión a MVP" value={`${conversionRate}%`} />
        <StatTile label="Tasa de descarte" value={`${discardRate}%`} />
        <StatTile
          label="En pipeline activo"
          value={ideas.length - distribution.find((d) => d.estado === 'descartada').count}
        />
      </div>

      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="mb-3 text-sm font-medium text-text">Distribución por estado</p>
        <div className="flex flex-col gap-2">
          {distribution.map((item) => {
            const config = getEstadoConfig(item.estado)
            return (
              <div key={item.estado} className="flex items-center gap-3">
                <span className="w-32 shrink-0 text-xs text-text-muted">{config.label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-border/50">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${item.percentage}%`, backgroundColor: config.color }}
                  />
                </div>
                <span className="w-16 shrink-0 text-right text-xs text-text-muted">
                  {item.count} ({item.percentage}%)
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setPeriod(7)}
          className={`rounded-lg px-3 py-1 text-xs font-medium ${
            period === 7 ? 'bg-text text-bg' : 'bg-border/40 text-text-muted'
          }`}
        >
          Últimos 7 días
        </button>
        <button
          type="button"
          onClick={() => setPeriod(30)}
          className={`rounded-lg px-3 py-1 text-xs font-medium ${
            period === 30 ? 'bg-text text-bg' : 'bg-border/40 text-text-muted'
          }`}
        >
          Últimos 30 días
        </button>
      </div>

      <SimpleBarChart data={periodData} title={`Ideas creadas (últimos ${period} días)`} />
    </div>
  )
}
