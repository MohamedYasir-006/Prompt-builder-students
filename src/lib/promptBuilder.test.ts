import { describe, expect, it } from 'vitest'
import { promptBuilderPlaceholder } from './promptBuilder'

describe('promptBuilder placeholder', () => {
  it('exists until Phase 2 implements the pure builder', () => {
    expect(promptBuilderPlaceholder).toBe('placeholder')
  })
})
