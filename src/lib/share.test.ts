import { describe, expect, it } from 'vitest'
import { sharePlaceholder } from './share'

describe('share placeholder', () => {
  it('exists until Phase 2 implements URL-hash sharing', () => {
    expect(sharePlaceholder).toBe('placeholder')
  })
})
