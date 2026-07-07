import { useMemo, useState } from 'react'
import type { Idea } from '../services/ideaFactory'

export function useIdeaFilters(ideas: Idea[]) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ideas
    return ideas.filter((idea) =>
      [idea.titulo, idea.idea, idea.problema, idea.lugar]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
    )
  }, [ideas, query])

  return { query, setQuery, filtered }
}
