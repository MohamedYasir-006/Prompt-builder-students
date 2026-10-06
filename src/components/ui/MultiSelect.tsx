import type { ChangeEvent } from 'react'
import type { QuestionOption } from '../../types'

interface MultiSelectProps {
  legend: string
  helpText?: string
  error?: string
  options: QuestionOption[]
  value: string[]
  onChange: (value: string[]) => void
}

/** Checkbox group with its own fieldset/legend for screen readers. */
export function MultiSelect({
  legend,
  helpText,
  error,
  options,
  value,
  onChange,
}: MultiSelectProps) {
  function toggle(optionValue: string, checked: boolean) {
    if (checked) {
      onChange([...value, optionValue])
    } else {
      onChange(value.filter((v) => v !== optionValue))
    }
  }

  function handleChange(optionValue: string) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      toggle(optionValue, e.target.checked)
    }
  }

  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="text-base font-semibold">{legend}</legend>
      {helpText !== undefined && helpText !== '' && (
        <p className="text-sm text-slate-500 dark:text-slate-400">{helpText}</p>
      )}
      <div className="flex flex-col gap-1">
        {options.map((o) => (
          <label
            key={o.value}
            className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border border-slate-300 px-3 py-2 text-base has-checked:border-slate-900 dark:border-slate-700"
          >
            <input
              type="checkbox"
              checked={value.includes(o.value)}
              onChange={handleChange(o.value)}
              className="h-5 w-5 accent-slate-900"
            />
            {o.label}
          </label>
        ))}
      </div>
      {error !== undefined && error !== '' && (
        <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </fieldset>
  )
}
