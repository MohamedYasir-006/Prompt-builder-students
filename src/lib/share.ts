import type { Answers, Audience } from '../types'

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
