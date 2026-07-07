export const ESTADO_IDEA = {
  LLUVIA_DE_IDEAS: 'lluvia_de_ideas',
  VALIDACION: 'validacion',
  MVP: 'mvp',
  DESCARTADA: 'descartada',
}

export function createIdea(partial = {}) {
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
