import { sectionExplanations } from '../../data/sectionExplanations'
import type { PromptSectionId } from '../../types'

/** One-line "why this works" note shown next to each prompt section. */
export function SectionExplainer({ sectionId }: { sectionId: PromptSectionId }) {
  const explanation = sectionExplanations[sectionId]
  return (
    <p className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
      <span className="font-semibold">Why this works: </span>
      {explanation.why}
    </p>
  )
}
