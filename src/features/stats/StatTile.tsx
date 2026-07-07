export default function StatTile({ label, value, sublabel }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-text">{value}</p>
      {sublabel ? <p className="mt-1 text-xs text-text-muted">{sublabel}</p> : null}
    </div>
  )
}
