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

describe('homepage portrait', () => {
  it('preserves the complete source image instead of cropping it', () => {
    const portraitRule = css.match(/\.focused-portrait img\s*\{([^}]*)\}/)?.[1] || ''

    expect(portraitRule).toMatch(/aspect-ratio:\s*auto/)
    expect(portraitRule).toMatch(/object-fit:\s*contain/)
  })
})

describe('output community call to action', () => {
  it('uses a high-contrast dark surface instead of the former orange-on-orange treatment', () => {
    const rule = css.match(/\.output-deck-link-community\s*\{([^}]*)\}/)?.[1] || ''
    const hoverRule = css.match(/\.output-deck-link-community:hover\s*\{([^}]*)\}/)?.[1] || ''

    expect(rule).toMatch(/color:\s*#f4f1e9/)
    expect(rule).toMatch(/background:\s*#050b12/)
    expect(hoverRule).toMatch(/color:\s*#050b12/)
    expect(hoverRule).toMatch(/background:\s*#f4f1e9/)
    expect(rule).not.toMatch(/#c94f31/)
  })
})
