import { describe, expect, it } from 'vitest'
import { getInitialLocale, siteContent } from './siteContent'

const keys = (value) => Object.keys(value).sort()

describe('site locale content', () => {
  it('defaults first-time visitors to Chinese', () => {
    expect(getInitialLocale({ getItem: () => null })).toBe('zh')
  })

  it('restores a saved English preference', () => {
    expect(getInitialLocale({ getItem: () => 'en' })).toBe('en')
  })

  it('keeps Chinese and English page sections structurally complete', () => {
    expect(keys(siteContent.en)).toEqual(keys(siteContent.zh))
    for (const section of keys(siteContent.zh)) {
      expect(keys(siteContent.en[section])).toEqual(keys(siteContent.zh[section]))
    }
  })
})
