export default function Badge({ color, bg, children }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ color, backgroundColor: bg }}
    >
      {children}
    </span>
  )
}
