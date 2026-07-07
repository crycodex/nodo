import type { ReactNode, TextareaHTMLAttributes } from 'react'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  rightSlot?: ReactNode
}

export default function TextArea({ label, id, className = '', rightSlot, ...props }: TextAreaProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-text-muted">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <textarea
          id={id}
          rows={3}
          className="w-full resize-none rounded-lg border border-border bg-bg px-3 py-2 pr-10 text-sm text-text outline-none focus:ring-2 focus:ring-text/20"
          {...props}
        />
        {rightSlot ? <div className="absolute right-2 top-2">{rightSlot}</div> : null}
      </div>
    </div>
  )
}
