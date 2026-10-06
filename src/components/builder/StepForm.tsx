import { useBuilderState } from '../../hooks/useBuilderState'
import type { Answers, Template } from '../../types'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { ProgressBar } from './ProgressBar'
import { QuestionField } from './QuestionField'

interface StepFormProps {
  template: Template
  onComplete: (answers: Answers) => void
}

/** One question per screen, with progress, Back/Next, and validation. */
export function StepForm({ template, onComplete }: StepFormProps) {
  const state = useBuilderState(template)
  const total = template.questions.length

  function handleNext() {
    const wasLast = state.isLast
    if (!state.goNext()) return
    if (wasLast) {
      onComplete(state.answers)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <ProgressBar current={state.step + 1} total={total} />
      <Card>
        <form
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault()
            handleNext()
          }}
        >
          <QuestionField
            question={state.question}
            value={state.answers[state.question.id]}
            onChange={(value) => state.setAnswer(state.question.id, value)}
            error={state.error}
          />
          <div className="flex gap-3">
            {!state.isFirst && (
              <Button variant="secondary" onClick={state.goBack}>
                Back
              </Button>
            )}
            <Button type="submit" variant="primary">
              {state.isLast ? 'See my prompt' : 'Next'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
