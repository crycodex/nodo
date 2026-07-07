export const ESTADO_IDEA = {
  LLUVIA_DE_IDEAS: 'lluvia_de_ideas',
  VALIDACION: 'validacion',
  MVP: 'mvp',
  DESCARTADA: 'descartada',
} as const

export type EstadoIdea = (typeof ESTADO_IDEA)[keyof typeof ESTADO_IDEA]

export interface Idea {
  id: string
  titulo: string
  idea: string
  problema: string
  lugar: string
  estado: EstadoIdea
  fechaCreacion: string
  fechaActualizacion: string
}

export type IdeaPartial = Partial<Pick<Idea, 'titulo' | 'idea' | 'problema' | 'lugar'>>

export function createIdea(partial: IdeaPartial = {}): Idea {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    titulo: partial.titulo ?? '',
    idea: partial.idea ?? '',
    problema: partial.problema ?? '',
    lugar: partial.lugar ?? '',
    estado: ESTADO_IDEA.LLUVIA_DE_IDEAS,
    fechaCreacion: now,
    fechaActualizacion: now,
  }
}
