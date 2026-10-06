import { describe, expect, it } from 'vitest'
import {
  MAX_SECTION_CHARS,
  NOTES_WRAPPER,
} from '../../lib/promptBuilder'
import { getToneById } from '../tones'
import type { Template } from '../../types'
import { templates } from './index'

function placeholdersIn(text: string): string[] {
  return [...text.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1] ?? '')
}

function templateTexts(template: Template): string[] {
  return [
    template.role,
    template.goal,
    template.outputFormat,
    template.firstMessage,
    ...template.rules,
  ]
}

describe.each(templates)('template $id', (template) => {
  it('has 5 to 8 questions', () => {
    expect(template.questions.length).toBeGreaterThanOrEqual(5)
    expect(template.questions.length).toBeLessThanOrEqual(8)
  })

  it('has unique question ids', () => {
    const ids = template.questions.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has a required tone select question with known tone options', () => {
    const tone = template.questions.find((q) => q.id === 'tone')
    expect(tone).toBeDefined()
    expect(tone?.type).toBe('select')
    expect(tone?.required).toBe(true)
    expect(tone?.options?.length).toBeGreaterThan(0)
    for (const option of tone?.options ?? []) {
      expect(getToneById(option.value)).toBeDefined()
    }
  })

  it('has an optional notes textarea that fits under the section cap', () => {
    const notes = template.questions.find((q) => q.id === 'notes')
    expect(notes).toBeDefined()
    expect(notes?.type).toBe('textarea')
    expect(notes?.required).toBe(false)
    expect(notes?.maxLength).toBeDefined()
    expect(NOTES_WRAPPER.length + 2 + (notes?.maxLength ?? 0)).toBeLessThanOrEqual(
      MAX_SECTION_CHARS,
    )
  })

  it('uses only placeholders that match a question id', () => {
    const ids = new Set(template.questions.map((q) => q.id))
    for (const text of templateTexts(template)) {
      for (const key of placeholdersIn(text)) {
        expect(ids.has(key)).toBe(true)
      }
    }
  })
})

describe('registry', () => {
  it('exports at least one template', () => {
    expect(templates.length).toBeGreaterThan(0)
  })

  it('has unique template ids', () => {
    const ids = templates.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
