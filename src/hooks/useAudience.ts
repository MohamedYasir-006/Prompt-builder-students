import { useState } from 'react'
import { loadAudience, saveAudience } from '../lib/storage'
import type { Audience } from '../types'

/** Remembered School/College choice, persisted to localStorage. */
export function useAudience(): [Audience, (audience: Audience) => void] {
  const [audience, setAudienceState] = useState<Audience>(
    () => loadAudience() ?? 'school',
  )

  function setAudience(next: Audience) {
    saveAudience(next)
    setAudienceState(next)
  }

  return [audience, setAudience]
}
