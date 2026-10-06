import { useCallback, useState } from 'react'
import { LIMITS } from '../config'
import { loadSavedPrompts, saveSavedPrompts } from '../lib/storage'
import type { Answers, Audience, SavedPrompt } from '../types'

export const MAX_PROMPT_NAME_LENGTH = 80

function newId(): string {
  try {
    const cryptoObj = globalThis.crypto as
      | { randomUUID?: () => string }
      | undefined
    if (cryptoObj?.randomUUID !== undefined) return cryptoObj.randomUUID()
  } catch {
    // Fall through to the Date-based id below.
  }
  return `prompt-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`
}

function nowIso(): string {
  return new Date().toISOString()
}

function cleanName(name: string): string {
  return name.trim().slice(0, MAX_PROMPT_NAME_LENGTH)
}

/** Saved prompts in localStorage: save (with a name), open, rename, duplicate, delete. */
export function useSavedPrompts(): {
  saved: SavedPrompt[]
  save: (
    name: string,
    templateId: string,
    audience: Audience,
    answers: Answers,
  ) => SavedPrompt | null
  rename: (id: string, name: string) => void
  duplicate: (id: string) => void
  remove: (id: string) => void
  refresh: () => void
} {
  const [saved, setSaved] = useState<SavedPrompt[]>(() => loadSavedPrompts())

  function persist(next: SavedPrompt[]) {
    saveSavedPrompts(next)
    setSaved(next)
  }

  const refresh = useCallback(() => {
    setSaved(loadSavedPrompts())
  }, [])

  function save(
    name: string,
    templateId: string,
    audience: Audience,
    answers: Answers,
  ): SavedPrompt | null {
    const cleaned = cleanName(name)
    if (cleaned === '') return null
    const current = loadSavedPrompts()
    if (current.length >= LIMITS.maxSavedPrompts) return null
    const entry: SavedPrompt = {
      id: newId(),
      name: cleaned,
      templateId,
      audience,
      answers,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    }
    persist([entry, ...current])
    return entry
  }

  function rename(id: string, name: string) {
    const cleaned = cleanName(name)
    if (cleaned === '') return
    persist(
      loadSavedPrompts().map((p) =>
        p.id === id ? { ...p, name: cleaned, updatedAt: nowIso() } : p,
      ),
    )
  }

  function duplicate(id: string) {
    const current = loadSavedPrompts()
    if (current.length >= LIMITS.maxSavedPrompts) return
    const source = current.find((p) => p.id === id)
    if (source === undefined) return
    const copy: SavedPrompt = {
      ...source,
      id: newId(),
      name: `${source.name} (copy)`.slice(0, MAX_PROMPT_NAME_LENGTH),
      answers: { ...source.answers },
      createdAt: nowIso(),
      updatedAt: nowIso(),
    }
    persist([copy, ...current])
  }

  function remove(id: string) {
    persist(loadSavedPrompts().filter((p) => p.id !== id))
  }

  return { saved, save, rename, duplicate, remove, refresh }
}
