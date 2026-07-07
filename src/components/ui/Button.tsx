import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'ghost' | 'danger' | 'icon'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-text text-bg hover:opacity-90',
  ghost: 'bg-transparent text-text hover:bg-border/60 border border-border',
  danger: 'bg-state-descartada text-white hover:opacity-90',
  icon: 'bg-transparent text-text hover:bg-border/60 p-2 rounded-full',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

export default function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    variant === 'icon'
      ? 'inline-flex items-center justify-center transition-colors'
      : 'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

  return (
    <button className={`${base} ${VARIANTS[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
