import { STORAGE_KEYS } from '../config'
import type { Answers, Audience, SavedPrompt } from '../types'

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

/** JSON-safe read. Returns the fallback on any error or bad shape. */
export function getItem<T>(key: string, fallback: T): T {
  try {
    if (!isBrowser()) return fallback
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

/** JSON-safe write. Silently ignores quota errors and missing storage. */
export function setItem(key: string, value: unknown): void {
  try {
    if (!isBrowser()) return
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage unavailable or full: the app keeps working without saving.
  }
}

export function removeItem(key: string): void {
  try {
    if (!isBrowser()) return
    window.localStorage.removeItem(key)
  } catch {
    // Ignore: removing is best-effort.
  }
}

function isSavedPrompt(value: unknown): value is SavedPrompt {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v['id'] === 'string' &&
    typeof v['name'] === 'string' &&
    typeof v['templateId'] === 'string' &&
    (v['audience'] === 'school' || v['audience'] === 'college') &&
    typeof v['answers'] === 'object' &&
    v['answers'] !== null &&
    typeof v['createdAt'] === 'string' &&
    typeof v['updatedAt'] === 'string'
  )
}

export function loadSavedPrompts(): SavedPrompt[] {
  const parsed = getItem<unknown>(STORAGE_KEYS.savedPrompts, [])
  if (!Array.isArray(parsed)) return []
  return parsed.filter(isSavedPrompt)
}

export function saveSavedPrompts(prompts: SavedPrompt[]): void {
  setItem(STORAGE_KEYS.savedPrompts, prompts)
}

export function loadAudience(): Audience | null {
  const parsed = getItem<unknown>(STORAGE_KEYS.audience, null)
  return parsed === 'school' || parsed === 'college' ? parsed : null
}

export function saveAudience(audience: Audience): void {
  setItem(STORAGE_KEYS.audience, audience)
}

function isSessionAvailable(): boolean {
  try {
    return (
      typeof window !== 'undefined' &&
      typeof window.sessionStorage !== 'undefined'
    )
  } catch {
    return false
  }
}

function isAnswersRecord(value: unknown): value is Answers {
  if (typeof value !== 'object' || value === null) return false
  return Object.values(value as Record<string, unknown>).every(
    (v) =>
      typeof v === 'string' ||
      (Array.isArray(v) && v.every((item) => typeof item === 'string')),
  )
}

export function builderDraftKey(templateId: string): string {
  return `${STORAGE_KEYS.builderDraftPrefix}${templateId}`
}

/** Draft answers for one template, kept in sessionStorage (tab-scoped). */
export function loadBuilderDraft(templateId: string): Answers | null {
  try {
    if (!isSessionAvailable()) return null
    const raw = window.sessionStorage.getItem(builderDraftKey(templateId))
    if (raw === null) return null
    const parsed: unknown = JSON.parse(raw)
    return isAnswersRecord(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function saveBuilderDraft(templateId: string, answers: Answers): void {
  try {
    if (!isSessionAvailable()) return
    window.sessionStorage.setItem(
      builderDraftKey(templateId),
      JSON.stringify(answers),
    )
  } catch {
    // Session storage full or unavailable: builder keeps working in memory.
  }
}

export function clearBuilderDraft(templateId: string): void {
  try {
    if (!isSessionAvailable()) return
    window.sessionStorage.removeItem(builderDraftKey(templateId))
  } catch {
    // Best-effort only.
  }
}
