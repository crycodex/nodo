import { ESTADO_IDEA } from '../../services/ideaFactory'
import type { EstadoIdea } from '../../services/ideaFactory'

export interface EstadoConfig {
  key: EstadoIdea
  label: string
  color: string
  bg: string
}

export const ESTADOS: EstadoConfig[] = [
  {
    key: ESTADO_IDEA.LLUVIA_DE_IDEAS,
    label: 'Lluvia de ideas',
    color: 'var(--color-state-lluvia)',
    bg: 'var(--color-state-lluvia-bg)',
  },
  {
    key: ESTADO_IDEA.VALIDACION,
    label: 'Validación',
    color: 'var(--color-state-validacion)',
    bg: 'var(--color-state-validacion-bg)',
  },
  {
    key: ESTADO_IDEA.MVP,
    label: 'MVP',
    color: 'var(--color-state-mvp)',
    bg: 'var(--color-state-mvp-bg)',
  },
  {
    key: ESTADO_IDEA.DESCARTADA,
    label: 'Descartada',
    color: 'var(--color-state-descartada)',
    bg: 'var(--color-state-descartada-bg)',
  },
]

export function getEstadoConfig(estado: EstadoIdea): EstadoConfig {
  return ESTADOS.find((e) => e.key === estado) ?? ESTADOS[0]!
}
