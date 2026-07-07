import { NavLink, Outlet } from 'react-router-dom'
import IdeaCaptureModal from '../features/ideas/IdeaCaptureModal'
import { useTheme } from '../hooks/useTheme'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/stats', label: 'Estadísticas' },
  { to: '/settings', label: 'Settings' },
]

function navLinkClass({ isActive }) {
  return `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive ? 'bg-text text-bg' : 'text-text-muted hover:bg-border/60 hover:text-text'
  }`
}

export default function Layout() {
  useTheme()

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <span className="text-lg font-semibold tracking-tight text-text">Nodo</span>
          <nav className="flex gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <Outlet />
      </main>

      <IdeaCaptureModal />
    </div>
  )
}
