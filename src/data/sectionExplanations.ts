import type { PromptSectionId } from '../types'

export interface SectionExplanation {
  id: PromptSectionId
  title: string
  /** Student-friendly explanation of why this section makes the prompt work. */
  why: string
}

export const sectionExplanations: Record<PromptSectionId, SectionExplanation> =
  {
    role: {
      id: 'role',
      title: 'Role',
      why: 'Telling the chatbot who to be (like "a friendly maths tutor") gives it a clear job, so its answers stay in character instead of being generic.',
    },
    context: {
      id: 'context',
      title: 'Context',
      why: 'Your class, level, and subject tell the chatbot what you already know, so it pitches explanations at the right level — not too babyish, not too advanced.',
    },
    goal: {
      id: 'goal',
      title: 'Goal',
      why: 'A clear goal tells the chatbot what success looks like, so every answer moves you toward it instead of wandering off topic.',
    },
    tone: {
      id: 'tone',
      title: 'Tone',
      why: 'Tone sets how the chatbot talks to you. The right tone keeps you motivated — strict when you need pushing, playful when you need energy.',
    },
    rules: {
      id: 'rules',
      title: 'Rules',
      why: 'Rules are guardrails. They force the chatbot to explain steps, admit when it is unsure, and keep you safe — even if you ask tricky questions.',
    },
    knowledge: {
      id: 'knowledge',
      title: 'Your notes',
      why: 'Pasting your own notes grounds the chatbot in your real syllabus. It answers from your material and says so when something is not in it.',
    },
    outputFormat: {
      id: 'outputFormat',
      title: 'Answer format',
      why: 'This fixes the shape of every answer (steps, examples, practice questions), so you get usable study material instead of a wall of text.',
    },
    firstMessage: {
      id: 'firstMessage',
      title: 'First message',
      why: 'The opening message sets up the conversation, so when you paste the prompt the chatbot immediately starts helping instead of asking what you want.',
    },
  }
