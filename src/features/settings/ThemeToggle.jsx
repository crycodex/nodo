import { useTheme } from '../../hooks/useTheme'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-text">Tema</p>
        <p className="text-xs text-text-muted">Claro u oscuro, se recuerda entre sesiones.</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label="Alternar tema oscuro"
        onClick={toggleTheme}
        className={`relative h-7 w-12 rounded-full transition-colors ${
          isDark ? 'bg-text' : 'bg-border'
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-bg transition-transform ${
            isDark ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
