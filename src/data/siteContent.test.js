import { describe, expect, it } from 'vitest'
import { getInitialLocale, siteContent } from './siteContent'

const keys = (value) => Object.keys(value).sort()

function contentShape(value) {
  if (Array.isArray(value)) return value.map(contentShape)
  if (value && typeof value === 'object') {
    return Object.fromEntries(keys(value).map((key) => [key, contentShape(value[key])]))
  }
  return typeof value
}

describe('site locale content', () => {
  it('defaults first-time visitors to Chinese', () => {
    expect(getInitialLocale({ getItem: () => null })).toBe('zh')
  })

  it('restores a saved English preference', () => {
    expect(getInitialLocale({ getItem: () => 'en' })).toBe('en')
  })

  it('keeps Chinese and English page sections structurally complete', () => {
    expect(contentShape(siteContent.en)).toEqual(contentShape(siteContent.zh))
  })
})
