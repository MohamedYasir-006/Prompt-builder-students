import { useState } from 'react'
import { AudienceSwitch } from '../components/audience/AudienceSwitch'
import { TemplateGrid } from '../components/templates/TemplateGrid'
import { getTemplatesByAudience } from '../data/templates'
import { useAudience } from '../hooks/useAudience'

export function TemplatesPage() {
  const [audience, setAudience] = useAudience()
  const [category, setCategory] = useState<string>('All')

  const forAudience = getTemplatesByAudience(audience)
  const categories = [
    'All',
    ...Array.from(new Set(forAudience.map((t) => t.category))),
  ]
  const visible =
    category === 'All'
      ? forAudience
      : forAudience.filter((t) => t.category === category)

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
      <h1 className="text-2xl font-bold">Pick a template</h1>
      <AudienceSwitch value={audience} onChange={setAudience} />
      <div
        role="group"
        aria-label="Filter by category"
        className="flex flex-wrap gap-2"
      >
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
            className={`min-h-[44px] rounded-full border px-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 ${
              category === c
                ? 'border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900'
                : 'border-slate-300 dark:border-slate-700'
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <TemplateGrid templates={visible} />
    </div>
  )
}
