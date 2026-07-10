import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { ESTADOS } from './kanbanConfig'
import { useIdeasStore } from '../../store/ideasStore'
import type { Idea, EstadoIdea } from '../../services/ideaFactory'

interface IdeaCardProps {
  idea: Idea
}

export default function IdeaCard({ idea }: IdeaCardProps) {
  const updateEstado = useIdeasStore((state) => state.updateEstado)
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: idea.id,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  const displayTitle = idea.titulo?.trim() || idea.idea?.trim()?.slice(0, 60) || 'Sin título'

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-lg border border-border bg-surface p-3 shadow-sm ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <button
        type="button"
        {...listeners}
        {...attributes}
        aria-label={`Arrastrar idea: ${displayTitle}`}
        className="cursor-grab touch-none rounded p-1 text-text-muted hover:bg-border/60 active:cursor-grabbing"
      >
        ⠿
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text">{displayTitle}</p>
        {idea.idea ? <p className="truncate text-xs text-text-muted">{idea.idea}</p> : null}
      </div>

      <label className="shrink-0">
        <span className="sr-only">Cambiar estado de la idea</span>
        <select
          value={idea.estado}
          onChange={(event) => updateEstado(idea.id, event.target.value as EstadoIdea)}
          className="rounded-md border border-border bg-bg px-2 py-1 text-xs text-text"
        >
          {ESTADOS.map((estado) => (
            <option key={estado.key} value={estado.key}>
              {estado.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
