import { useState } from 'react'
import type { Answers, Question, Template } from '../types'

function requiredMessage(question: Question): string {
  if (question.type === 'select') return 'Please choose an option to continue.'
  if (question.type === 'multiselect')
    return 'Please choose at least one option to continue.'
  return 'Please answer this question to continue.'
}

function isAnswered(value: string | string[] | undefined): boolean {
  if (value === undefined) return false
  if (Array.isArray(value)) return value.some((v) => v.trim() !== '')
  return value.trim() !== ''
}

export interface BuilderState {
  answers: Answers
  step: number
  question: Question
  error: string
  isFirst: boolean
  isLast: boolean
  setAnswer: (id: string, value: string | string[]) => void
  goNext: () => boolean
  goBack: () => void
}

/** One-question-per-screen builder state with per-step validation. */
export function useBuilderState(template: Template): BuilderState {
  const [answers, setAnswers] = useState<Answers>({})
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')

  const total = template.questions.length
  const safeStep = Math.min(step, total - 1)
  const question = template.questions[safeStep]

  function setAnswer(id: string, value: string | string[]) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
    setError('')
  }

  /** Validates the current step. Returns true when it is ok to advance. */
  function goNext(): boolean {
    if (question.required && !isAnswered(answers[question.id])) {
      setError(requiredMessage(question))
      return false
    }
    setError('')
    setStep((s) => Math.min(s + 1, total - 1))
    return true
  }

  function goBack() {
    setError('')
    setStep((s) => Math.max(s - 1, 0))
  }

  return {
    answers,
    step: safeStep,
    question,
    error,
    isFirst: safeStep === 0,
    isLast: safeStep === total - 1,
    setAnswer,
    goNext,
    goBack,
  }
}
