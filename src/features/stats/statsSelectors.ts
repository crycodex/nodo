import { ESTADO_IDEA } from '../../services/ideaFactory'
import type { Idea, EstadoIdea } from '../../services/ideaFactory'

export interface DistributionEntry {
  estado: EstadoIdea
  count: number
  percentage: number
}

export interface PeriodBucket {
  date: Date
  key: string
  count: number
}

export function getDistribution(ideas: Idea[]): DistributionEntry[] {
  const total = ideas.length
  const counts: Record<EstadoIdea, number> = {
    [ESTADO_IDEA.LLUVIA_DE_IDEAS]: 0,
    [ESTADO_IDEA.VALIDACION]: 0,
    [ESTADO_IDEA.MVP]: 0,
    [ESTADO_IDEA.DESCARTADA]: 0,
  }
  for (const idea of ideas) counts[idea.estado] = (counts[idea.estado] ?? 0) + 1

  return (Object.entries(counts) as [EstadoIdea, number][]).map(([estado, count]) => ({
    estado,
    count,
    percentage: total === 0 ? 0 : Math.round((count / total) * 100),
  }))
}

export function getConversionRate(ideas: Idea[]): number {
  if (ideas.length === 0) return 0
  const mvpCount = ideas.filter((idea) => idea.estado === ESTADO_IDEA.MVP).length
  return Math.round((mvpCount / ideas.length) * 100)
}

export function getDiscardRate(ideas: Idea[]): number {
  if (ideas.length === 0) return 0
  const discardedCount = ideas.filter((idea) => idea.estado === ESTADO_IDEA.DESCARTADA).length
  return Math.round((discardedCount / ideas.length) * 100)
}

export function getCountsByPeriod(ideas: Idea[], days: number): PeriodBucket[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const buckets: PeriodBucket[] = []
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    buckets.push({ date, key: date.toISOString().slice(0, 10), count: 0 })
  }

  const byKey = new Map(buckets.map((bucket) => [bucket.key, bucket]))
  for (const idea of ideas) {
    const key = idea.fechaCreacion?.slice(0, 10)
    const bucket = key ? byKey.get(key) : undefined
    if (bucket) bucket.count += 1
  }

  return buckets
}
