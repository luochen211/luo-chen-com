import { describe, expect, it } from 'vitest'
import { estimateReadingMinutes } from './articles'

describe('estimateReadingMinutes', () => {
  it('returns at least one minute for short content', () => {
    expect(estimateReadingMinutes('一段短文。', 'zh')).toBe(1)
  })

  it('uses Chinese character count for Chinese articles', () => {
    expect(estimateReadingMinutes('字'.repeat(800), 'zh')).toBe(2)
  })

  it('uses word count for English articles', () => {
    expect(estimateReadingMinutes(Array(400).fill('word').join(' '), 'en')).toBe(2)
  })
})
