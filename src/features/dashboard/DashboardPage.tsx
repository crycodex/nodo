import { useIdeasStore } from '../../store/ideasStore'
import { useIdeaFilters } from '../../hooks/useIdeaFilters'
import KanbanBoard from '../kanban/KanbanBoard'
import SearchBar from './SearchBar'

export default function DashboardPage() {
  const ideas = useIdeasStore((state) => state.ideas)
  const { query, setQuery, filtered } = useIdeaFilters(ideas)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-text">Dashboard</h1>
        <SearchBar value={query} onChange={setQuery} />
      </div>

      <KanbanBoard ideas={filtered} />
    </div>
  )
}
