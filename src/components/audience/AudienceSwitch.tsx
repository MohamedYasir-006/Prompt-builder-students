import type { Audience } from '../../types'

interface AudienceSwitchProps {
  value: Audience
  onChange: (audience: Audience) => void
}

/** Big School / College choice. Tap targets are 44px+. */
export function AudienceSwitch({ value, onChange }: AudienceSwitchProps) {
  return (
    <div
      role="group"
      aria-label="Choose your level"
      className="grid grid-cols-2 gap-3"
    >
      {(
        [
          { id: 'school', label: 'School', hint: 'Classes 6–10' },
          { id: 'college', label: 'College', hint: 'UG & PG' },
        ] as const
      ).map((option) => {
        const selected = value === option.id
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.id)}
            className={`flex min-h-[64px] flex-col items-center justify-center rounded-2xl border-2 px-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 ${
              selected
                ? 'border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900'
                : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
            }`}
          >
            <span className="text-lg font-bold">{option.label}</span>
            <span className="text-xs opacity-70">{option.hint}</span>
          </button>
        )
      })}
    </div>
  )
}
