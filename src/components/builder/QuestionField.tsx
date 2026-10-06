import type { Question } from '../../types'
import { Field } from '../ui/Field'
import { MultiSelect } from '../ui/MultiSelect'
import { Select } from '../ui/Select'
import { TextArea } from '../ui/TextArea'
import { TextInput } from '../ui/TextInput'

function describedBy(inputId: string, helpText?: string): string | undefined {
  return helpText !== undefined && helpText !== '' ? `${inputId}-help` : undefined
}

interface QuestionFieldProps {
  question: Question
  value: string | string[] | undefined
  onChange: (value: string | string[]) => void
  error?: string
}

/** Renders the right input for a question type, with label and error. */
export function QuestionField({ question, value, onChange, error = '' }: QuestionFieldProps) {
  const inputId = `question-${question.id}`

  if (question.type === 'multiselect') {
    return (
      <MultiSelect
        legend={question.label}
        helpText={question.helpText}
        error={error}
        options={question.options ?? []}
        value={Array.isArray(value) ? value : []}
        onChange={onChange}
      />
    )
  }

  const textValue = Array.isArray(value) ? value.join(', ') : (value ?? '')
  const describedIds = describedBy(inputId, question.helpText)
  const invalid = error !== ''

  return (
    <Field
      inputId={inputId}
      label={question.label}
      helpText={question.helpText}
      error={error}
    >
      {question.type === 'textarea' ? (
        <TextArea
          id={inputId}
          value={textValue}
          onChange={onChange}
          placeholder={question.placeholder}
          maxLength={question.maxLength}
          describedBy={describedIds}
          invalid={invalid}
        />
      ) : question.type === 'select' ? (
        <Select
          id={inputId}
          value={textValue}
          onChange={onChange}
          options={question.options ?? []}
          describedBy={describedIds}
          invalid={invalid}
        />
      ) : (
        <TextInput
          id={inputId}
          value={textValue}
          onChange={onChange}
          placeholder={question.placeholder}
          maxLength={question.maxLength}
          describedBy={describedIds}
          invalid={invalid}
        />
      )}
    </Field>
  )
}
