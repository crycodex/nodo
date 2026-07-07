import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const prefersDark =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-color-scheme: dark)').matches

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      theme: prefersDark ? 'dark' : 'light',
      voiceLang: 'es-ES',

      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
      setVoiceLang: (voiceLang) => set({ voiceLang }),
    }),
    { name: 'nodo-settings', version: 1 }
  )
)
