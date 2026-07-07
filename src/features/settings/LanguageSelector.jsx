import { useSettingsStore } from '../../store/settingsStore'

const LANGUAGES = [
  { value: 'es-ES', label: 'Español (España)' },
  { value: 'es-419', label: 'Español (Latinoamérica)' },
  { value: 'en-US', label: 'English (US)' },
]

export default function LanguageSelector() {
  const voiceLang = useSettingsStore((state) => state.voiceLang)
  const setVoiceLang = useSettingsStore((state) => state.setVoiceLang)

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-text">Idioma de reconocimiento de voz</p>
        <p className="text-xs text-text-muted">Usado por el dictado en el formulario de captura.</p>
      </div>
      <select
        value={voiceLang}
        onChange={(event) => setVoiceLang(event.target.value)}
        aria-label="Idioma de reconocimiento de voz"
        className="rounded-lg border border-border bg-bg px-3 py-1.5 text-sm text-text"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  )
}
