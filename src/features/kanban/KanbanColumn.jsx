import { useDroppable } from '@dnd-kit/core'
import IdeaCard from './IdeaCard'

export default function KanbanColumn({ estado, ideas }) {
  const { setNodeRef, isOver } = useDroppable({ id: estado.key })

  return (
    <div className="flex min-w-[260px] flex-1 flex-col rounded-xl border border-border bg-bg">
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
        className={`flex min-h-[120px] flex-1 flex-col gap-2 p-2 transition-colors ${
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
