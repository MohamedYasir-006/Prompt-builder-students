import { useEffect, useRef } from 'react'
import { useBuilderState } from '../../hooks/useBuilderState'
import type { Answers, Template } from '../../types'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { ProgressBar } from './ProgressBar'
import { QuestionField } from './QuestionField'

interface StepFormProps {
  template: Template
  initialAnswers?: Answers
  onComplete: (answers: Answers) => void
}

/** One question per screen, with progress, Back/Next, and validation. */
export function StepForm({
  template,
  initialAnswers,
  onComplete,
}: StepFormProps) {
  const state = useBuilderState(template, initialAnswers)
  const total = template.questions.length
  const questionRef = useRef<HTMLDivElement>(null)

  // Move keyboard focus to the new question whenever the step changes,
  // so screen-reader and keyboard users land on the fresh input.
  useEffect(() => {
    const target = questionRef.current?.querySelector<HTMLElement>(
      'input, select, textarea',
    )
    target?.focus()
  }, [state.step, state.question.id])

  function handleNext() {
    const wasLast = state.isLast
    if (!state.goNext()) return
    if (wasLast) {
      state.clearDraft()
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
          <div ref={questionRef}>
            <QuestionField
              question={state.question}
              value={state.answers[state.question.id]}
              onChange={(value) => state.setAnswer(state.question.id, value)}
              error={state.error}
            />
          </div>
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
