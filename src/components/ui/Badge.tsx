import type { ReactNode } from 'react'

interface BadgeProps {
  color: string
  bg: string
  children: ReactNode
}

export default function Badge({ color, bg, children }: BadgeProps) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ color, backgroundColor: bg }}
    >
      {children}
    </span>
  )
}
