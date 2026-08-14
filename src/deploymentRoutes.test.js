import { readFileSync } from 'node:fs'
import { describe, expect, it, vi } from 'vitest'
import { onRequestGet } from '../functions/[[path]].js'

const redirects = readFileSync(new URL('../public/_redirects', import.meta.url), 'utf8')
const notFound = readFileSync(new URL('../public/404.html', import.meta.url), 'utf8')
const functionRoutes = JSON.parse(readFileSync(new URL('../public/_routes.json', import.meta.url), 'utf8'))
const redirectLines = redirects.split('\n').map((line) => line.trim()).filter(Boolean)

describe('Cloudflare Pages routing', () => {
  it('routes only known SPA paths through the Pages Function', () => {
    expect(functionRoutes.include).toContain('/about')
    expect(functionRoutes.include).toContain('/articles/*')
    expect(functionRoutes.include).toContain('/columns/*')
    expect(functionRoutes.include).toContain('/demos/futures-trader')
    expect(functionRoutes.exclude).toContain('/assets/*')
    expect(functionRoutes.exclude).toContain('/demos/agent-harness/*')
    expect(redirectLines).not.toContain('/* /index.html 200')
    expect(redirects).not.toContain('/about /index.html 200')
  })

  it('ships a top-level 404 page so unknown assets cannot fall back to the SPA shell', () => {
    expect(notFound).toContain('<title>页面不存在 · LUOCHEN</title>')
    expect(notFound).toContain('404 / NOT FOUND')
  })

  it('serves the root application shell without redirecting the browser URL', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response('<!doctype html>', { status: 200 }))
    const request = new Request('https://luo-chen.com/about?source=test')

    const response = await onRequestGet({ request, env: { ASSETS: { fetch } } })

    expect(response.status).toBe(200)
    expect(fetch).toHaveBeenCalledOnce()
    expect(fetch.mock.calls[0][0].url).toBe('https://luo-chen.com/')
  })

  it('serves article Markdown as a static asset instead of the SPA shell', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response('# Article', {
      status: 200,
      headers: { 'content-type': 'text/markdown; charset=utf-8' },
    }))
    const request = new Request('https://luo-chen.com/articles/example.md?source=test')

    const response = await onRequestGet({ request, env: { ASSETS: { fetch } } })

    expect(response.status).toBe(200)
    expect(await response.text()).toBe('# Article')
    expect(fetch).toHaveBeenCalledOnce()
    expect(fetch.mock.calls[0][0]).toBe(request)
  })
})
