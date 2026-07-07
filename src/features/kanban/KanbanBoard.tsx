import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { ESTADOS } from './kanbanConfig'
import KanbanColumn from './KanbanColumn'
import { useIdeasStore } from '../../store/ideasStore'

export default function KanbanBoard({ ideas }) {
  const updateEstado = useIdeasStore((state) => state.updateEstado)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over) return
    updateEstado(active.id, over.id)
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-2">
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
