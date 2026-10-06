import type { PromptSection } from '../../types'
import { Card } from '../ui/Card'
import { SectionExplainer } from './SectionExplainer'

/** The generated prompt, section by section, each with its explainer. */
export function PromptPreview({ sections }: { sections: PromptSection[] }) {
  return (
    <div className="flex flex-col gap-4">
      {sections.map((section) => (
        <Card key={section.id}>
          <section aria-label={section.title} className="flex flex-col gap-2">
            <h2 className="text-lg font-bold">{section.title}</h2>
            <p className="whitespace-pre-wrap text-base">{section.content}</p>
            <SectionExplainer sectionId={section.id} />
          </section>
        </Card>
      ))}
    </div>
  )
}
