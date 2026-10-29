import { readdirSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const llms = readFileSync(new URL('../public/llms.txt', import.meta.url), 'utf8')
const articleFiles = readdirSync(new URL('../public/articles', import.meta.url)).filter((name) => name.endsWith('.md'))
const linkedArticles = [...llms.matchAll(/https:\/\/luo-chen\.com\/articles\/([^)\s]+\.md)/g)].map((match) => match[1])

describe('llms.txt', () => {
  it('follows the llms.txt shape with a title and summary', () => {
    expect(llms.startsWith('# 落尘 Luochen\n')).toBe(true)
    expect(llms).toMatch(/\n> .+/)
  })

  it('links every published article exactly once', () => {
    expect([...linkedArticles].sort()).toEqual([...articleFiles].sort())
  })
})
