import type { ChangeEvent } from 'react'

interface TextAreaProps {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
  describedBy?: string
  invalid?: boolean
}

export function TextArea({
  id,
  value,
  onChange,
  placeholder,
  maxLength,
  describedBy,
  invalid = false,
}: TextAreaProps) {
  const counterId = `${id}-counter`
  const describedIds = [describedBy, maxLength !== undefined ? counterId : undefined]
    .filter((s): s is string => s !== undefined && s !== '')
    .join(' ')

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.target.value)
  }

  return (
    <div className="flex flex-col gap-1">
      <textarea
        id={id}
        rows={4}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-describedby={describedIds === '' ? undefined : describedIds}
        aria-invalid={invalid || undefined}
        className={`min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-1 dark:border-slate-700 dark:bg-slate-950 ${invalid ? 'border-red-500' : ''}`}
      />
      {maxLength !== undefined && (
        <p id={counterId} className="self-end text-sm text-slate-500 dark:text-slate-400">
          {value.length}/{maxLength} characters
        </p>
      )}
    </div>
  )
}
