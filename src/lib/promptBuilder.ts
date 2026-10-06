import { getSafetyRules } from '../data/safetyRules'
import { homeworkHelperCheckAnswerOutputFormat } from '../data/templates/school/homework-helper'
import { getToneById } from '../data/tones'
import type {
  Answers,
  Audience,
  GeneratedPrompt,
  PromptSection,
  PromptSectionId,
  Template,
} from '../types'

/** Hard cap per prompt section. User content is kept below this via
 * question maxLengths (see AGENTS.md), so this is a safety net, not a trimmer. */
export const MAX_SECTION_CHARS = 2000

export const NOTES_WRAPPER =
  'Use the notes below when relevant, and say so if the answer is not in them.'

const SECTION_ORDER: PromptSectionId[] = [
  'role',
  'context',
  'goal',
  'tone',
  'rules',
  'knowledge',
  'outputFormat',
  'firstMessage',
]

const SECTION_TITLES: Record<PromptSectionId, string> = {
  role: 'Role',
  context: 'Context',
  goal: 'Goal',
  tone: 'Tone',
  rules: 'Rules',
  knowledge: 'Your notes',
  outputFormat: 'Answer format',
  firstMessage: 'First message',
}

const SECTION_HEADINGS: Record<PromptSectionId, string> = {
  role: 'ROLE',
  context: 'CONTEXT',
  goal: 'GOAL',
  tone: 'TONE',
  rules: 'RULES',
  knowledge: 'YOUR NOTES',
  outputFormat: 'ANSWER FORMAT',
  firstMessage: 'FIRST MESSAGE',
}

/** First non-empty formatted value from the given answer keys. */
function firstNonEmpty(
  template: Template,
  answers: Answers,
  keys: string[],
): string {
  for (const key of keys) {
    const value = formatAnswer(template, answers, key)
    if (value !== '') return value
  }
  return ''
}

/**
 * Format one answer for insertion. Select values resolve to their option
 * labels ("class-8" -> "Class 8"); arrays join with ", ". Missing answers
 * produce an empty string, never "undefined"/"null".
 */
function formatAnswer(
  template: Template,
  answers: Answers,
  key: string,
): string {
  const raw = answers[key]
  if (raw === undefined || raw === null) return ''
  const values = Array.isArray(raw) ? raw : [raw]
  const question = template.questions.find((q) => q.id === key)
  const labelled = values.map((v) => {
    const text = v.trim()
    if (text === '') return ''
    if (question?.options !== undefined) {
      const match = question.options.find((o) => o.value === text)
      if (match) return match.label
    }
    return text
  })
  return labelled.filter((s) => s !== '').join(', ')
}

/**
 * Replace {{answerId}} placeholders. Unknown or missing answers become an
 * empty string; runs of 3+ newlines collapse so no double blank lines remain.
 */
function fillPlaceholders(
  text: string,
  template: Template,
  answers: Answers,
): string {
  const filled = text.replace(
    /\{\{(\w+)\}\}/g,
    (_match: string, key: string) => formatAnswer(template, answers, key),
  )
  return filled.replace(/\n{3,}/g, '\n\n').trim()
}

function cap(text: string): string {
  const trimmed = text.trim()
  if (trimmed.length <= MAX_SECTION_CHARS) return trimmed
  // Safety net only: back up to the last word boundary so words are
  // never cut mid-word. Normal user content never reaches this branch
  // because the notes maxLength (1800) plus the wrapper stays under the cap.
  const sliced = trimmed.slice(0, MAX_SECTION_CHARS)
  const lastSpace = sliced.lastIndexOf(' ')
  const cut =
    lastSpace > MAX_SECTION_CHARS - 100 ? sliced.slice(0, lastSpace) : sliced
  return cut.trimEnd()
}

function buildContext(
  template: Template,
  answers: Answers,
  audience: Audience,
): string {
  const parts = [`You are helping a ${audience} student.`]
  const subjectLabel = audience === 'school' ? 'Subject' : 'Course'
  const subject = firstNonEmpty(template, answers, ['subject', 'course'])
  if (subject !== '') parts.push(`${subjectLabel}: ${subject}.`)
  const topic = firstNonEmpty(template, answers, ['topic', 'focusTopic'])
  if (topic !== '') parts.push(`Current topic: ${topic}.`)
  const level = firstNonEmpty(template, answers, ['grade', 'year', 'level'])
  if (level !== '') parts.push(`Level: ${level}.`)
  return parts.join(' ')
}

function buildTone(answers: Answers): string {
  const raw = answers['tone']
  const id = Array.isArray(raw) ? (raw[0] ?? '') : (raw ?? '')
  const tone = getToneById(id.trim())
  return tone?.instruction ?? ''
}

const FIRST_MESSAGE_LEAD_IN =
  'Begin the conversation by sending this message to the student:'

/**
 * The Homework Helper answer format depends on the help type: checking an
 * answer needs a correct/wrong/corrected flow, everything else uses the
 * template's standard step-by-step format.
 */
function resolveOutputFormat(template: Template, answers: Answers): string {
  if (template.id !== 'homework-helper') return template.outputFormat
  const helpKind = answers['helpKind']
  const values = Array.isArray(helpKind) ? helpKind : [helpKind]
  if (values.includes('check-answer')) {
    return homeworkHelperCheckAnswerOutputFormat
  }
  return template.outputFormat
}

function buildKnowledge(answers: Answers): string {
  const raw = answers['notes']
  const text =
    raw === undefined || raw === null
      ? ''
      : Array.isArray(raw)
        ? raw.join('\n')
        : raw
  const trimmed = text.trim()
  if (trimmed === '') return ''
  return `${NOTES_WRAPPER}\n\n${trimmed}`
}

/**
 * Pure function: template + answers + audience -> structured prompt.
 * Safety rules always come from our own data files, never from AI output.
 */
export function buildPrompt(
  template: Template,
  answers: Answers,
  audience: Audience,
): GeneratedPrompt {
  const contents: Record<PromptSectionId, string> = {
    role: cap(fillPlaceholders(template.role, template, answers)),
    context: cap(buildContext(template, answers, audience)),
    goal: cap(fillPlaceholders(template.goal, template, answers)),
    tone: cap(buildTone(answers)),
    rules: cap(
      [...getSafetyRules(audience), ...template.rules]
        .map((r) => r.trim())
        .filter((r) => r !== '')
        .map((r) => `- ${r}`)
        .join('\n'),
    ),
    knowledge: cap(buildKnowledge(answers)),
    outputFormat: cap(
      fillPlaceholders(resolveOutputFormat(template, answers), template, answers),
    ),
    firstMessage: cap(
      `${FIRST_MESSAGE_LEAD_IN}\n\n${fillPlaceholders(template.firstMessage, template, answers)}`,
    ),
  }

  const sections: PromptSection[] = []
  for (const id of SECTION_ORDER) {
    const content = contents[id]
    if (content === '') continue
    sections.push({ id, title: SECTION_TITLES[id], content })
  }

  const fullText = sections
    .map((s) => `## ${SECTION_HEADINGS[s.id]}\n\n${s.content}`)
    .join('\n\n')

  return { templateId: template.id, audience, sections, fullText }
}
