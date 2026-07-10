import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createIdea, isValidIdea } from '../services/ideaFactory'
import type { Idea, IdeaPartial, EstadoIdea } from '../services/ideaFactory'

export type ImportMode = 'replace' | 'merge'

interface IdeasState {
  ideas: Idea[]
}

interface IdeasActions {
  addIdea: (partial?: IdeaPartial) => Idea
  updateIdea: (id: string, patch: Partial<Idea>) => void
  updateEstado: (id: string, nuevoEstado: EstadoIdea) => void
  deleteIdea: (id: string) => void
  importIdeas: (ideas: Idea[], mode?: ImportMode) => void
  resetAll: () => void
}

type IdeasStore = IdeasState & IdeasActions

export const useIdeasStore = create<IdeasStore>()(
  persist(
    (set) => ({
      ideas: [],

      addIdea: (partial) => {
        const idea = createIdea(partial)
        set((state) => ({ ideas: [...state.ideas, idea] }))
        return idea
      },

      updateIdea: (id, patch) => {
        set((state) => ({
          ideas: state.ideas.map((idea) =>
            idea.id === id
              ? { ...idea, ...patch, fechaActualizacion: new Date().toISOString() }
              : idea
          ),
        }))
      },

      updateEstado: (id, nuevoEstado) => {
        set((state) => ({
          ideas: state.ideas.map((idea) =>
            idea.id === id
              ? { ...idea, estado: nuevoEstado, fechaActualizacion: new Date().toISOString() }
              : idea
          ),
        }))
      },

      deleteIdea: (id) => {
        set((state) => ({ ideas: state.ideas.filter((idea) => idea.id !== id) }))
      },

      importIdeas: (ideas, mode = 'replace') => {
        if (mode === 'replace') {
          set({ ideas })
          return
        }
        set((state) => {
          const byId = new Map(state.ideas.map((idea) => [idea.id, idea]))
          for (const idea of ideas) byId.set(idea.id, idea)
          return { ideas: Array.from(byId.values()) }
        })
      },

      resetAll: () => set({ ideas: [] }),
    }),
    {
      name: 'nodo-ideas',
      version: 1,
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<IdeasState> | undefined
        const ideas =
          persisted && Array.isArray(persisted.ideas) && persisted.ideas.every(isValidIdea)
            ? persisted.ideas
            : currentState.ideas
        return { ...currentState, ideas }
      },
    }
  )
)
