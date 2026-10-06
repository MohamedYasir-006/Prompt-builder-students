import type { Template } from '../../types'
import { TemplateCard } from './TemplateCard'

export function TemplateGrid({ templates }: { templates: Template[] }) {
  if (templates.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500 dark:border-slate-700">
        No templates here yet. Try another category.
      </p>
    )
  }
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {templates.map((t) => (
        <li key={t.id}>
          <TemplateCard template={t} />
        </li>
      ))}
    </ul>
  )
}
