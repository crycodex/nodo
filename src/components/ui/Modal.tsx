import { useEffect, useRef } from 'react'

export default function Modal({ open, onClose, title, children }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!open) return

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    dialogRef.current?.focus()

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-xl outline-none"
      >
        {title ? <h2 className="mb-4 text-lg font-semibold text-text">{title}</h2> : null}
        {children}
      </div>
    </div>
  )
}
