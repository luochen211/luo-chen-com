import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const redirects = readFileSync(new URL('../public/_redirects', import.meta.url), 'utf8')
const notFound = readFileSync(new URL('../public/404.html', import.meta.url), 'utf8')
const redirectLines = redirects.split('\n').map((line) => line.trim()).filter(Boolean)

describe('Cloudflare Pages routing', () => {
  it('rewrites only known SPA routes instead of every missing asset', () => {
    expect(redirects).toContain('/about /index.html 200')
    expect(redirects).toContain('/articles/* /index.html 200')
    expect(redirects).toContain('/columns/* /index.html 200')
    expect(redirectLines).not.toContain('/* /index.html 200')
  })

  it('ships a top-level 404 page so unknown assets cannot fall back to the SPA shell', () => {
    expect(notFound).toContain('<title>页面不存在 · LUOCHEN</title>')
    expect(notFound).toContain('404 / NOT FOUND')
  })
})
