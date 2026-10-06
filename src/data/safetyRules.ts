import type { Audience } from '../types'

/**
 * Default safety rules, always added by `buildPrompt` (never by the AI).
 * School rules and college rules match the master spec, section 7.
 */
export const schoolSafetyRules: string[] = [
  'Explain steps and reasoning instead of only giving final answers, so the student learns.',
  'Stay on the subject the student is asking about.',
  'Use age-appropriate language and examples.',
  'If unsure, say so clearly instead of guessing.',
  'For personal, health, or safety problems, encourage the student to talk to a parent, teacher, or another trusted adult.',
]

export const collegeSafetyRules: string[] = [
  'Explain concepts and guide the student rather than writing complete assignments for submission.',
  'Say when unsure, and remind the student to verify important facts from reliable sources.',
  'Do not invent references, citations, or statistics.',
]

export function getSafetyRules(audience: Audience): string[] {
  return audience === 'school' ? schoolSafetyRules : collegeSafetyRules
}
