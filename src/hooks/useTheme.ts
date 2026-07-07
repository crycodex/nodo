import { useEffect } from 'react'
import { useSettingsStore } from '../store/settingsStore'

export function useTheme() {
  const theme = useSettingsStore((state) => state.theme)
  const toggleTheme = useSettingsStore((state) => state.toggleTheme)
  const setTheme = useSettingsStore((state) => state.setTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return { theme, toggleTheme, setTheme }
}
