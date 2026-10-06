import { describe, expect, it } from 'vitest'
import {
  collegeSafetyRules,
  schoolSafetyRules,
} from '../data/safetyRules'
import { courseStudyBuddy } from '../data/templates/college/course-study-buddy'
import { homeworkHelper } from '../data/templates/school/homework-helper'
import type { Answers } from '../types'
import { buildPrompt } from './promptBuilder'

const homeworkAnswers: Answers = {
  subject: 'maths',
  topic: 'fractions addition',
  grade: 'class-8',
  helpKind: 'explain-steps',
  tone: 'friendly',
  notes: 'To add fractions, first make the denominators equal.',
}

const buddyAnswers: Answers = {
  course: 'Data Structures',
  focusTopic: 'Binary trees for the midterm',
  year: '2nd-year',
  studyMode: 'practice-questions',
  tone: 'encouraging-coach',
}

describe('placeholder replacement', () => {
  it('fills role, goal, and first message with readable labels', () => {
    const result = buildPrompt(homeworkHelper, homeworkAnswers, 'school')
    const role = result.sections.find((s) => s.id === 'role')?.content ?? ''
    expect(role).toContain('Maths')
    expect(role).toContain('Class 8')
    expect(role).toContain('fractions addition')
    expect(result.fullText).not.toContain('{{')
    expect(result.fullText).not.toContain('}}')
  })

  it('resolves college placeholders too', () => {
    const result = buildPrompt(courseStudyBuddy, buddyAnswers, 'college')
    const role = result.sections.find((s) => s.id === 'role')?.content ?? ''
    expect(role).toContain('2nd year')
    expect(role).toContain('Data Structures')
    expect(result.fullText).not.toContain('{{')
  })
})

describe('missing optional answers', () => {
  it('skips the knowledge section and leaves no dangling placeholders', () => {
    const withoutNotes: Answers = { ...homeworkAnswers }
    delete withoutNotes['notes']
    const result = buildPrompt(homeworkHelper, withoutNotes, 'school')
    expect(result.sections.some((s) => s.id === 'knowledge')).toBe(false)
    expect(result.fullText).not.toMatch(/\{\{\w+\}\}/)
    expect(result.fullText).not.toMatch(/\n{3,}/)
    expect(result.fullText).not.toMatch(/undefined|null/)
  })
})

describe('section ordering', () => {
  it('emits sections in the canonical order', () => {
    const result = buildPrompt(homeworkHelper, homeworkAnswers, 'school')
    expect(result.sections.map((s) => s.id)).toEqual([
      'role',
      'context',
      'goal',
      'tone',
      'rules',
      'knowledge',
      'outputFormat',
      'firstMessage',
    ])
    const headings = result.fullText.match(/^## .+$/gm) ?? []
    expect(headings).toEqual([
      '## ROLE',
      '## CONTEXT',
      '## GOAL',
      '## TONE',
      '## RULES',
      '## YOUR NOTES',
      '## ANSWER FORMAT',
      '## FIRST MESSAGE',
    ])
  })
})

describe('audience-specific rules', () => {
  it('puts school safety rules first, then template rules', () => {
    const result = buildPrompt(homeworkHelper, homeworkAnswers, 'school')
    const rules = result.sections.find((s) => s.id === 'rules')?.content ?? ''
    for (const r of schoolSafetyRules) expect(rules).toContain(r)
    for (const r of homeworkHelper.rules) expect(rules).toContain(r)
    expect(rules.indexOf(schoolSafetyRules[0])).toBeLessThan(
      rules.indexOf(homeworkHelper.rules[0]),
    )
  })

  it('uses college safety rules for college audiences', () => {
    const result = buildPrompt(courseStudyBuddy, buddyAnswers, 'college')
    const rules = result.sections.find((s) => s.id === 'rules')?.content ?? ''
    for (const r of collegeSafetyRules) expect(rules).toContain(r)
    for (const r of schoolSafetyRules) expect(rules).not.toContain(r)
  })
})

describe('knowledge section', () => {
  it('wraps pasted notes with the grounding instruction', () => {
    const result = buildPrompt(homeworkHelper, homeworkAnswers, 'school')
    const knowledge =
      result.sections.find((s) => s.id === 'knowledge')?.content ?? ''
    expect(knowledge).toContain(
      'Use the notes below when relevant, and say so if the answer is not in them.',
    )
    expect(knowledge).toContain('denominators equal')
  })

  it('is skipped when no notes are given', () => {
    const result = buildPrompt(courseStudyBuddy, buddyAnswers, 'college')
    expect(result.sections.some((s) => s.id === 'knowledge')).toBe(false)
  })

  it('keeps max-length notes intact, never silently truncated', () => {
    const notes = 'x'.repeat(1800)
    const result = buildPrompt(
      homeworkHelper,
      { ...homeworkAnswers, notes },
      'school',
    )
    const knowledge =
      result.sections.find((s) => s.id === 'knowledge')?.content ?? ''
    expect(knowledge.length).toBeLessThanOrEqual(2000)
    expect(knowledge.endsWith(notes)).toBe(true)
  })
})

describe('end-to-end prompts for both starter templates', () => {
  it('generates a complete prompt for Homework Helper', () => {
    const result = buildPrompt(homeworkHelper, homeworkAnswers, 'school')
    expect(result.templateId).toBe('homework-helper')
    expect(result.audience).toBe('school')
    expect(result.sections.length).toBeGreaterThanOrEqual(7)
    expect(result.fullText).toContain('## ROLE')
    expect(result.fullText).toContain('## RULES')
  })

  it('generates a complete prompt for Course Study Buddy', () => {
    const result = buildPrompt(courseStudyBuddy, buddyAnswers, 'college')
    expect(result.templateId).toBe('course-study-buddy')
    expect(result.audience).toBe('college')
    expect(result.sections.length).toBeGreaterThanOrEqual(7)
    expect(result.fullText).toContain('## ROLE')
    expect(result.fullText).toContain('## RULES')
  })
})

describe('context labels', () => {
  it('labels the field Subject for school audiences', () => {
    const result = buildPrompt(homeworkHelper, homeworkAnswers, 'school')
    const context = result.sections.find((s) => s.id === 'context')?.content ?? ''
    expect(context).toContain('Subject: Maths.')
  })

  it('labels the field Course for college audiences', () => {
    const result = buildPrompt(courseStudyBuddy, buddyAnswers, 'college')
    const context = result.sections.find((s) => s.id === 'context')?.content ?? ''
    expect(context).toContain('Course: Data Structures.')
    expect(context).not.toContain('Subject:')
  })
})

describe('first message lead-in', () => {
  it('opens the section with the send-this-message instruction', () => {
    for (const [template, answers, audience] of [
      [homeworkHelper, homeworkAnswers, 'school'],
      [courseStudyBuddy, buddyAnswers, 'college'],
    ] as const) {
      const result = buildPrompt(template, answers, audience)
      const first =
        result.sections.find((s) => s.id === 'firstMessage')?.content ?? ''
      expect(first.startsWith('Begin the conversation by sending this message to the student:')).toBe(true)
    }
  })
})

describe('output format variants (data-driven)', () => {
  it('uses the check-answer flow when checking an answer', () => {
    const result = buildPrompt(
      homeworkHelper,
      { ...homeworkAnswers, helpKind: 'check-answer' },
      'school',
    )
    const format =
      result.sections.find((s) => s.id === 'outputFormat')?.content ?? ''
    expect(format).toContain('ask the student to show their work')
    expect(format).toContain('(a) What is correct')
    expect(format).toContain('(d) One quick practice question')
  })

  it('keeps the standard steps for other help types', () => {
    const result = buildPrompt(
      homeworkHelper,
      { ...homeworkAnswers, helpKind: 'explain-steps' },
      'school',
    )
    const format =
      result.sections.find((s) => s.id === 'outputFormat')?.content ?? ''
    expect(format).toContain('What the question asks')
    expect(format).not.toContain('show their work')
  })

  it('leaves other templates on their standard format', () => {
    const result = buildPrompt(courseStudyBuddy, buddyAnswers, 'college')
    const format =
      result.sections.find((s) => s.id === 'outputFormat')?.content ?? ''
    expect(format).toContain('Key idea in 2-3 lines')
  })
})
