import { useIdeasStore } from '../store/ideasStore'
import { isValidIdea } from './ideaFactory'
import type { Idea } from './ideaFactory'
import type { ImportMode } from '../store/ideasStore'

interface ValidationResult {
  valid: boolean
  reason?: string
}

interface ImportResult {
  success: boolean
  reason?: string
}

export function exportToJson(): void {
  const ideas = useIdeasStore.getState().ideas
  const blob = new Blob([JSON.stringify(ideas, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `nodo-ideas-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function validateIdeas(data: unknown): ValidationResult {
  if (!Array.isArray(data)) {
    return { valid: false, reason: 'El archivo debe contener un arreglo de ideas.' }
  }
  for (const item of data as unknown[]) {
    if (!isValidIdea(item)) {
      return { valid: false, reason: 'Cada idea debe tener id, estado y campos de texto válidos.' }
    }
  }
  return { valid: true }
}

export async function importFromFile(file: File, mode: ImportMode = 'replace'): Promise<ImportResult> {
  const text = await file.text()
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    return { success: false, reason: 'El archivo no contiene JSON válido.' }
  }

  const result = validateIdeas(data)
  if (!result.valid) return { success: false, reason: result.reason }

  useIdeasStore.getState().importIdeas(data as Idea[], mode)
  return { success: true }
}

export function resetAll(): void {
  useIdeasStore.getState().resetAll()
}
