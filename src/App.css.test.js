import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const css = readFileSync(new URL('./App.css', import.meta.url), 'utf8')

describe('article title cascade', () => {
  it('declares the mobile title override after the base article title rule', () => {
    const baseRule = css.indexOf('.article-page h1 {')
    const mobileQuery = css.lastIndexOf('@media (max-width: 640px)')
    const mobileRule = css.indexOf('.article-hero h1 {', mobileQuery)

    expect(baseRule).toBeGreaterThan(-1)
    expect(mobileQuery).toBeGreaterThan(baseRule)
    expect(mobileRule).toBeGreaterThan(mobileQuery)
  })
})
