import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const html = readFileSync(new URL('../public/slides/index.html', import.meta.url), 'utf8')
const redesignCss = readFileSync(new URL('./redesign.css', import.meta.url), 'utf8')

describe('PPT archive redesign', () => {
  it('uses the shared navy and burnt-orange palette', () => {
    expect(html).toContain('--navy-900:#061424')
    expect(html).toContain('--orange-600:#c75b2d')
    expect(redesignCss).toContain('--bg: #061424')
    expect(redesignCss).toContain('--paper: #c75b2d')
  })

  it('keeps all five deck destinations in a dense archive', () => {
    expect(html.match(/class="deck-card"/g)).toHaveLength(5)
    expect(html).toContain('/slides/decks/agent-harness/lessons/')
    expect(html).toContain('/slides/decks/three-hour-mini-program/')
    expect(html).toContain('/slides/decks/dag-efficient-development/')
    expect(html).toContain('/slides/decks/mini-program-ui/')
    expect(html).toContain('/slides/decks/ai-product-talk/')
  })

  it('loads animation locally without hiding readable content by default', () => {
    expect(html).toContain('src="/slides/assets/gsap.min.js"')
    expect(html).toContain('src="/slides/assets/ScrollTrigger.min.js"')
    expect(html).not.toContain('cdn.jsdelivr.net/npm/gsap')
    expect(html).not.toMatch(/\.reveal\s*\{[^}]*opacity\s*:\s*0/)
  })
})
