interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Buscar ideas..."
      aria-label="Buscar ideas"
      className="w-full max-w-xs rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-text/20"
    />
  )
}
