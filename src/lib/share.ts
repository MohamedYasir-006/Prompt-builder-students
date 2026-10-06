import type { Answers, Audience, Template } from '../types'

export interface ShareData {
  templateId: string
  audience: Audience
  answers: Answers
}

interface NodeBuffer {
  from(data: string, encoding: string): { toString(encoding: string): string }
}

function getNodeBuffer(): NodeBuffer | undefined {
  const g = globalThis as unknown as { Buffer?: NodeBuffer }
  return g.Buffer
}

function encodeBase64(json: string): string {
  const nodeBuffer = getNodeBuffer()
  if (nodeBuffer !== undefined) {
    return nodeBuffer.from(json, 'utf-8').toString('base64')
  }
  const bytes = new TextEncoder().encode(json)
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary)
}

function decodeBase64(b64: string): string | null {
  try {
    const nodeBuffer = getNodeBuffer()
    if (nodeBuffer !== undefined) {
      return nodeBuffer.from(b64, 'base64').toString('utf-8')
    }
    const binary = atob(b64.trim())
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  } catch {
    return null
  }
}

function isAnswers(value: unknown): value is Answers {
  if (typeof value !== 'object' || value === null) return false
  return Object.values(value as Record<string, unknown>).every(
    (v) =>
      typeof v === 'string' ||
      (Array.isArray(v) && v.every((item) => typeof item === 'string')),
  )
}

export function isShareData(value: unknown): value is ShareData {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v['templateId'] === 'string' &&
    v['templateId'] !== '' &&
    (v['audience'] === 'school' || v['audience'] === 'college') &&
    isAnswers(v['answers'])
  )
}

/** base64 of { templateId, audience, answers }. */
export function encodeShareData(data: ShareData): string {
  return encodeBase64(
    JSON.stringify({
      templateId: data.templateId,
      audience: data.audience,
      answers: data.answers,
    }),
  )
}

/** Full share fragment, e.g. "#data=...". */
export function buildShareHash(data: ShareData): string {
  return `#data=${encodeShareData(data)}`
}

/**
 * Decode a share hash. Accepts "#data=...", "data=..." or raw base64.
 * Returns null for anything invalid — callers show a friendly error, never crash.
 */
export function decodeShareData(input: string): ShareData | null {
  try {
    let b64 = input.trim()
    if (b64.startsWith('#')) b64 = b64.slice(1)
    if (b64.startsWith('data=')) b64 = b64.slice('data='.length)
    if (b64 === '') return null
    const json = decodeBase64(b64)
    if (json === null) return null
    const parsed: unknown = JSON.parse(json)
    return isShareData(parsed) ? parsed : null
  } catch {
    return null
  }
}

/** Length above which a share URL gets unwieldy to send by hand. */
export const SHARE_LINK_WARN_LENGTH = 1500

function isNonEmpty(value: string | string[] | undefined): boolean {
  if (value === undefined) return false
  if (Array.isArray(value)) return value.some((v) => v.trim() !== '')
  return value.trim() !== ''
}

/**
 * Validate decoded share data against a template. Returns null when valid,
 * otherwise a short human-readable reason. Checks: audience is supported by
 * the template, every answer key belongs to the template, option values are
 * from the allowed lists, string lengths respect maxLength, and required
 * questions are answered. Used by ResultPage for both shared hashes and
 * in-app navigation state — invalid always means a friendly error, never a crash.
 */
export function validateAnswersForTemplate(
  template: Template,
  audience: Audience,
  answers: Answers,
): string | null {
  if (!template.audiences.includes(audience)) {
    return `This saved prompt is for a different level and does not match the "${template.title}" template.`
  }
  const byId = new Map(template.questions.map((q) => [q.id, q]))
  for (const key of Object.keys(answers)) {
    if (!byId.has(key)) {
      return `This link contains an answer ("${key}") that does not belong to the "${template.title}" template.`
    }
  }
  for (const question of template.questions) {
    const value = answers[question.id]
    if (question.type === 'select') {
      if (value !== undefined) {
        if (typeof value !== 'string') {
          return `The answer to "${question.label}" has the wrong shape.`
        }
        if (
          value.trim() !== '' &&
          (question.options ?? []).every((o) => o.value !== value.trim())
        ) {
          return `The answer to "${question.label}" is not a valid option.`
        }
      }
    } else if (question.type === 'multiselect') {
      if (value !== undefined) {
        if (
          !Array.isArray(value) ||
          !value.every((item) => typeof item === 'string')
        ) {
          return `The answer to "${question.label}" has the wrong shape.`
        }
        const allowed = new Set((question.options ?? []).map((o) => o.value))
        for (const item of value) {
          if (item.trim() !== '' && !allowed.has(item.trim())) {
            return `The answer to "${question.label}" is not a valid option.`
          }
          if (
            question.maxLength !== undefined &&
            item.length > question.maxLength
          ) {
            return `The answer to "${question.label}" is too long.`
          }
        }
      }
    } else {
      // text | textarea
      if (value !== undefined) {
        if (typeof value !== 'string') {
          return `The answer to "${question.label}" has the wrong shape.`
        }
        if (
          question.maxLength !== undefined &&
          value.length > question.maxLength
        ) {
          return `The answer to "${question.label}" is too long.`
        }
      }
    }
    if (question.required && !isNonEmpty(value)) {
      return `This link is missing the answer to "${question.label}".`
    }
  }
  return null
}
