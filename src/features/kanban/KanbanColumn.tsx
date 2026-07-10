import { useDroppable } from '@dnd-kit/core'
import IdeaCard from './IdeaCard'
import type { Idea } from '../../services/ideaFactory'
import type { EstadoConfig } from './kanbanConfig'

interface KanbanColumnProps {
  estado: EstadoConfig
  ideas: Idea[]
}

export default function KanbanColumn({ estado, ideas }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: estado.key })

  return (
    <div className="flex w-full flex-col rounded-xl border border-border bg-bg">
      <div
        className="flex items-center justify-between rounded-t-xl border-b border-border px-3 py-2"
        style={{ backgroundColor: estado.bg }}
      >
        <span className="text-sm font-semibold" style={{ color: estado.color }}>
          {estado.label}
        </span>
        <span className="text-xs font-medium text-text-muted">{ideas.length}</span>
      </div>

      <div
        ref={setNodeRef}
        className={`kanban-scroll flex min-h-[100px] gap-2 overflow-x-auto p-2 snap-x snap-mandatory transition-colors ${
          isOver ? 'bg-border/40' : ''
        }`}
      >
        {ideas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}
        {ideas.length === 0 ? (
          <p className="p-2 text-center text-xs text-text-muted">Sin ideas</p>
        ) : null}
      </div>
    </div>
  )
}
