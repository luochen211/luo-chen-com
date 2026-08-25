import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const deck = readFileSync(new URL('../public/slides/decks/personal-site-coolness/index.html', import.meta.url), 'utf8')

const requestedTerms = [
  '距离驱动的排斥位移',
  '指针驱动的网格变形',
  '滚动固定',
  '悬停触发视频预览',
  '滚动速度驱动的形变',
  '手风琴式拓展布局',
  '交互式流体扭曲',
  '滚动驱动的场景切换',
  '滚动驱动的3d环形轮播',
  '逐字错峰入场',
  '滚动吸附',
  '滚动叠层转场',
  '滚动驱动的全屏幕拓展转场',
]

describe('personal site coolness interaction deck', () => {
  it('keeps 13 requested terms as 13 dedicated demo titles', () => {
    expect(deck.match(/<section class="slide[^>]+data-demo="[^>]+>/g)).toHaveLength(13)
    expect(deck.match(/<h1 class="demo-title">[^<]+<\/h1>/g)).toHaveLength(13)

    requestedTerms.forEach((term) => {
      expect(deck).toContain(`<h1 class="demo-title">${term}</h1>`)
    })
  })

  it('keeps the cover and archive page count aligned with the 14-page deck', () => {
    expect(deck).toContain('01 / 14')
    expect(deck.match(/^<section class="slide [^>]+>/gm)).toHaveLength(14)
    const archive = readFileSync(new URL('../public/slides/index.html', import.meta.url), 'utf8')
    expect(archive).toContain('<span>14 页</span>')
  })
})
