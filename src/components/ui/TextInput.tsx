import type { ChangeEvent } from 'react'

interface TextInputProps {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
  describedBy?: string
  invalid?: boolean
}

const inputStyles =
  'min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-1 dark:border-slate-700 dark:bg-slate-950'

export function TextInput({
  id,
  value,
  onChange,
  placeholder,
  maxLength,
  describedBy,
  invalid = false,
}: TextInputProps) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value)
  }
  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      maxLength={maxLength}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      className={`${inputStyles} ${invalid ? 'border-red-500' : ''}`}
    />
  )
}
