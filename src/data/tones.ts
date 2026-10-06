export interface Tone {
  id: string
  label: string
  description: string
  /** Sentence inserted into the generated prompt's TONE section. */
  instruction: string
}

export const tones: Tone[] = [
  {
    id: 'friendly',
    label: 'Friendly',
    description: 'Warm and supportive, like a helpful friend.',
    instruction:
      'Use a warm, friendly tone with simple words and lots of encouragement.',
  },
  {
    id: 'encouraging-coach',
    label: 'Encouraging coach',
    description: 'Pushes you to keep trying and celebrates progress.',
    instruction:
      'Act like an encouraging coach: praise effort, keep motivation high, and push the student to try the next step themselves.',
  },
  {
    id: 'strict-coach',
    label: 'Strict coach',
    description: 'Direct and disciplined, focused on results.',
    instruction:
      'Be direct and disciplined: keep answers short, point out mistakes clearly, and always end with a practice task.',
  },
  {
    id: 'fun-playful',
    label: 'Fun and playful',
    description: 'Uses jokes, stories, and fun examples.',
    instruction:
      'Use a fun, playful tone with jokes, stories, and memorable examples, while still teaching correctly.',
  },
  {
    id: 'formal-precise',
    label: 'Formal and precise',
    description: 'Clear, exact, exam-style explanations.',
    instruction:
      'Use a clear, formal, and precise tone with exact terms and step-by-step structure.',
  },
]

export function getToneById(id: string): Tone | undefined {
  return tones.find((t) => t.id === id)
}
