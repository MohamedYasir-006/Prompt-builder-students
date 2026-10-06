export type Audience = 'school' | 'college'
export type QuestionType = 'text' | 'textarea' | 'select' | 'multiselect'

export interface QuestionOption {
  value: string
  label: string
}

export interface Question {
  id: string
  label: string
  helpText?: string
  placeholder?: string
  type: QuestionType
  options?: QuestionOption[]
  required: boolean
  maxLength?: number
}

export interface OutputFormatVariant {
  /** Question id whose answer selects this format. */
  whenAnswer: string
  /** Option value that triggers this format. */
  equals: string
  /** Format text used instead of the default outputFormat. May use {{placeholders}}. */
  format: string
}

export interface Template {
  id: string
  audiences: Audience[]
  title: string
  description: string
  icon: string
  category: string
  questions: Question[]
  role: string
  goal: string
  rules: string[]
  outputFormat: string
  outputFormatVariants?: OutputFormatVariant[]
  firstMessage: string
  sampleQuestions: string[]
  improveTips: string[]
}

export type Answers = Record<string, string | string[]>

export type PromptSectionId =
  | 'role'
  | 'context'
  | 'goal'
  | 'tone'
  | 'rules'
  | 'knowledge'
  | 'outputFormat'
  | 'firstMessage'

export interface PromptSection {
  id: PromptSectionId
  title: string
  content: string
}

export interface GeneratedPrompt {
  templateId: string
  audience: Audience
  sections: PromptSection[]
  fullText: string
}

export interface SavedPrompt {
  id: string
  name: string
  templateId: string
  audience: Audience
  answers: Answers
  createdAt: string
  updatedAt: string
}

// Phase 7
export interface DescribeRequest {
  audience: Audience
  description: string
}

export interface DescribeResponse {
  templateId: string
  answers: Answers
}

// Phase 8
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}
