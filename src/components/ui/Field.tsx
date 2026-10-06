import type { ReactNode } from 'react'

interface FieldProps {
  inputId: string
  label: string
  helpText?: string
  error?: string
  children: ReactNode
}

/** Label + help text + error wrapper. Every input gets a real <label>. */
export function Field({ inputId, label, helpText, error, children }: FieldProps) {
  const helpId = `${inputId}-help`
  const errorId = `${inputId}-error`
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-base font-semibold">
        {label}
      </label>
      {helpText !== undefined && helpText !== '' && (
        <p id={helpId} className="text-sm text-slate-500 dark:text-slate-400">
          {helpText}
        </p>
      )}
      {children}
      {error !== undefined && error !== '' && (
        <p id={errorId} role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
