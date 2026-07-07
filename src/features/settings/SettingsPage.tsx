import ThemeToggle from './ThemeToggle'
import LanguageSelector from './LanguageSelector'
import DataManagement from './DataManagement'

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-text">Settings</h1>

      <section className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4">
        <ThemeToggle />
      </section>

      <section className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4">
        <LanguageSelector />
      </section>

      <section className="rounded-xl border border-border bg-surface p-4">
        <DataManagement />
      </section>
    </div>
  )
}
