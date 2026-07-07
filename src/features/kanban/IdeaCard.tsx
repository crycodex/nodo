import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { ESTADOS } from './kanbanConfig'
import { useIdeasStore } from '../../store/ideasStore'

export default function IdeaCard({ idea }) {
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
      className={`rounded-lg border border-border bg-surface p-3 shadow-sm ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-text">{displayTitle}</p>
        <button
          type="button"
          {...listeners}
          {...attributes}
          aria-label={`Arrastrar idea: ${displayTitle}`}
          className="cursor-grab touch-none rounded p-1 text-text-muted hover:bg-border/60 active:cursor-grabbing"
        >
          ⠿
        </button>
      </div>

      {idea.idea ? <p className="mt-1 line-clamp-2 text-xs text-text-muted">{idea.idea}</p> : null}

      <label className="mt-3 block">
        <span className="sr-only">Cambiar estado de la idea</span>
        <select
          value={idea.estado}
          onChange={(event) => updateEstado(idea.id, event.target.value)}
          className="w-full rounded-md border border-border bg-bg px-2 py-1 text-xs text-text"
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
