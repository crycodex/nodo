import { useIdeasStore } from '../store/ideasStore'
import { ESTADO_IDEA } from './ideaFactory'

const VALID_ESTADOS = new Set(Object.values(ESTADO_IDEA))

export function exportToJson() {
  const ideas = useIdeasStore.getState().ideas
  const blob = new Blob([JSON.stringify(ideas, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `nodo-ideas-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function validateIdeas(data) {
  if (!Array.isArray(data)) {
    return { valid: false, reason: 'El archivo debe contener un arreglo de ideas.' }
  }
  for (const item of data) {
    if (!item || typeof item !== 'object') {
      return { valid: false, reason: 'Cada idea debe ser un objeto.' }
    }
    if (typeof item.id !== 'string' || !item.id) {
      return { valid: false, reason: 'Cada idea debe tener un id válido.' }
    }
    if (!VALID_ESTADOS.has(item.estado)) {
      return { valid: false, reason: `Estado inválido: ${item.estado}` }
    }
  }
  return { valid: true }
}

export async function importFromFile(file, mode = 'replace') {
  const text = await file.text()
  let data
  try {
    data = JSON.parse(text)
  } catch {
    return { success: false, reason: 'El archivo no contiene JSON válido.' }
  }

  const result = validateIdeas(data)
  if (!result.valid) return { success: false, reason: result.reason }

  useIdeasStore.getState().importIdeas(data, mode)
  return { success: true }
}

export function resetAll() {
  useIdeasStore.getState().resetAll()
}
