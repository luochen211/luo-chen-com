import { existsSync, readFileSync, statSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const deck = readFileSync(new URL('../public/slides/decks/ai-delivery/index.html', import.meta.url), 'utf8')
const videoAsset = new URL('../public/slides/decks/ai-delivery/assets/video/computer-use-demo.mp4', import.meta.url)
const posterAsset = new URL('../public/slides/decks/ai-delivery/assets/video/computer-use-demo-poster.jpg', import.meta.url)

describe('AI delivery deck', () => {
  it('embeds the published Computer Use video on slide 18', () => {
    expect(deck).toContain('data-layout="COMPUTER-USE-VIDEO"')
    expect(deck).toContain('<source src="./assets/video/computer-use-demo.mp4" type="video/mp4">')
    expect(deck).toContain('poster="./assets/video/computer-use-demo-poster.jpg"')
    expect(deck).toContain('window.__currentSlideIndex!==17')
    expect(deck).not.toContain('computer-use-video-input')
    expect(deck).not.toContain('现场选择本地视频')
  })

  it('ships non-empty video and poster assets', () => {
    expect(existsSync(videoAsset)).toBe(true)
    expect(existsSync(posterAsset)).toBe(true)
    expect(statSync(videoAsset).size).toBeGreaterThan(0)
    expect(statSync(posterAsset).size).toBeGreaterThan(0)
  })
})
