import type { ChangeEvent } from 'react'
import type { QuestionOption } from '../../types'

interface SelectProps {
  id: string
  value: string
  onChange: (value: string) => void
  options: QuestionOption[]
  describedBy?: string
  invalid?: boolean
}

export function Select({
  id,
  value,
  onChange,
  options,
  describedBy,
  invalid = false,
}: SelectProps) {
  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    onChange(e.target.value)
  }
  return (
    <select
      id={id}
      value={value}
      onChange={handleChange}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      className={`min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-1 dark:border-slate-700 dark:bg-slate-950 ${invalid ? 'border-red-500' : ''}`}
    >
      <option value="">Choose an option…</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}
