import { describe, expect, it } from 'vitest'
import { homeworkHelper } from '../data/templates/school/homework-helper'
import type { ShareData } from './share'
import {
  buildShareHash,
  decodeShareData,
  encodeShareData,
  validateAnswersForTemplate,
} from './share'

const sample: ShareData = {
  templateId: 'homework-helper',
  audience: 'school',
  answers: {
    subject: 'maths',
    topic: 'fractions addition',
    grade: 'class-8',
    tags: ['a', 'b'],
  },
}

describe('share round trip', () => {
  it('encodes and decodes back to the same data', () => {
    const decoded = decodeShareData(encodeShareData(sample))
    expect(decoded).toEqual(sample)
  })

  it('accepts full hash, prefixed, and raw forms', () => {
    const encoded = encodeShareData(sample)
    expect(decodeShareData(`#data=${encoded}`)).toEqual(sample)
    expect(decodeShareData(`data=${encoded}`)).toEqual(sample)
    expect(decodeShareData(buildShareHash(sample))).toEqual(sample)
  })

  it('survives unicode answers', () => {
    const unicode: ShareData = {
      templateId: 'course-study-buddy',
      audience: 'college',
      answers: { course: 'Tamilò இலக்கியம் 🎓' },
    }
    expect(decodeShareData(encodeShareData(unicode))).toEqual(unicode)
  })
})

describe('invalid share input', () => {
  it('returns null instead of crashing', () => {
    expect(decodeShareData('')).toBeNull()
    expect(decodeShareData('#data=')).toBeNull()
    expect(decodeShareData('not-valid-base64!!!')).toBeNull()
    expect(decodeShareData('#data=aGVsbG8=')).toBeNull() // "hello", wrong shape
  })

  it('rejects unknown audiences and bad answer types', () => {
    const badAudience = encodeShareData({
      templateId: 'x',
      audience: 'aliens',
      answers: {},
    } as unknown as ShareData)
    expect(decodeShareData(badAudience)).toBeNull()

    const badAnswers = encodeShareData({
      templateId: 'x',
      audience: 'school',
      answers: { topic: 42 },
    } as unknown as ShareData)
    expect(decodeShareData(badAnswers)).toBeNull()
  })
})

describe('validateAnswersForTemplate', () => {
  const valid = {
    subject: 'maths',
    topic: 'fractions',
    grade: 'class-8',
    helpKind: 'explain-steps',
    tone: 'friendly',
  }

  it('accepts a complete valid answer set', () => {
    expect(
      validateAnswersForTemplate(homeworkHelper, 'school', valid),
    ).toBeNull()
  })

  it('rejects an audience the template does not support', () => {
    expect(
      validateAnswersForTemplate(homeworkHelper, 'college', valid),
    ).toMatch(/different level/i)
  })

  it('rejects unknown answer keys', () => {
    expect(
      validateAnswersForTemplate(homeworkHelper, 'school', {
        ...valid,
        nope: 'x',
      }),
    ).toMatch(/does not belong/i)
  })

  it('rejects option values outside the allowed list', () => {
    expect(
      validateAnswersForTemplate(homeworkHelper, 'school', {
        ...valid,
        subject: ' Klingon ',
      }),
    ).toMatch(/not a valid option/i)
  })

  it('rejects missing required answers', () => {
    const rest = { ...valid }
    delete (rest as Partial<typeof valid>).topic
    expect(validateAnswersForTemplate(homeworkHelper, 'school', rest)).toMatch(
      /missing/i,
    )
  })

  it('rejects answers over maxLength', () => {
    expect(
      validateAnswersForTemplate(homeworkHelper, 'school', {
        ...valid,
        topic: 'x'.repeat(121),
      }),
    ).toMatch(/too long/i)
  })
})
