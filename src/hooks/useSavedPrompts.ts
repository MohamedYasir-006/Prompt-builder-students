import { useState } from 'react'
import { loadSavedPrompts } from '../lib/storage'
import type { SavedPrompt } from '../types'

/** Phase 3 placeholder: save/rename/duplicate/delete land in Phase 4. */
export function useSavedPrompts(): {
  saved: SavedPrompt[]
  refresh: () => void
} {
  const [saved, setSaved] = useState<SavedPrompt[]>(() => loadSavedPrompts())

  function refresh() {
    setSaved(loadSavedPrompts())
  }

  return { saved, refresh }
}
