import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { ESTADOS } from './kanbanConfig'
import KanbanColumn from './KanbanColumn'
import { useIdeasStore } from '../../store/ideasStore'
import type { Idea, EstadoIdea } from '../../services/ideaFactory'

interface KanbanBoardProps {
  ideas: Idea[]
}

export default function KanbanBoard({ ideas }: KanbanBoardProps) {
  const updateEstado = useIdeasStore((state) => state.updateEstado)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return
    updateEstado(String(active.id), over.id as EstadoIdea)
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-3">
        {ESTADOS.map((estado) => (
          <KanbanColumn
            key={estado.key}
            estado={estado}
            ideas={ideas.filter((idea) => idea.estado === estado.key)}
          />
        ))}
      </div>
    </DndContext>
  )
}
