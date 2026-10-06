import { Card } from '../ui/Card'

/** Sample questions to test the new bot + tips to improve the prompt. */
export function TestIdeas({
  sampleQuestions,
  improveTips,
}: {
  sampleQuestions: string[]
  improveTips: string[]
}) {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <section aria-label="Try these first" className="flex flex-col gap-2">
          <h2 className="text-lg font-bold">Try these first</h2>
          <ul className="flex list-disc flex-col gap-1 pl-5 text-base">
            {sampleQuestions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </section>
      </Card>
      <Card>
        <section aria-label="Make it even better" className="flex flex-col gap-2">
          <h2 className="text-lg font-bold">Make it even better</h2>
          <ul className="flex list-disc flex-col gap-1 pl-5 text-base">
            {improveTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>
      </Card>
    </div>
  )
}
