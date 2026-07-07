export default function TextField({ label, id, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-text-muted">
          {label}
        </label>
      ) : null}
      <input
        id={id}
        className="rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-text/20"
        {...props}
      />
    </div>
  )
}
