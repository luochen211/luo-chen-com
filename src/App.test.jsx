/* @vitest-environment jsdom */
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    context: vi.fn(() => ({ revert: vi.fn() })),
    fromTo: vi.fn(),
    utils: { toArray: vi.fn(() => []) },
  },
}))
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }))

import App from './App'

class IntersectionObserverMock {
  observe() {}
  disconnect() {}
}

beforeEach(() => {
  window.IntersectionObserver = IntersectionObserverMock
  window.matchMedia = vi.fn(() => ({ matches: true }))
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  window.localStorage.clear()
  window.history.replaceState({}, '', '/')
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('localized route rendering', () => {
  it.each([
    ['/output', '/writing'],
    ['/projects', '/work'],
    ['/course', '/writing'],
    ['/roundtable', '/'],
    ['/lab/roundtable', '/'],
  ])('redirects legacy route %s to %s', async (legacyRoute, primaryRoute) => {
    window.history.replaceState({}, '', legacyRoute)
    render(<App />)

    await waitFor(() => expect(window.location.pathname).toBe(primaryRoute))
  })

  it('renders collection and series chrome in English after switching locale', async () => {
    window.localStorage.setItem('site-locale', 'zh')
    window.history.replaceState({}, '', '/columns/expression-review')
    render(<App />)
    expect(document.title).toBe('表达与复盘')

    await userEvent.click(screen.getByRole('button', { name: 'EN' }))

    expect(document.title).toBe('Expression and Retrospectives')
    expect(screen.getByRole('heading', { name: 'Expression and Retrospectives' })).toBeInTheDocument()
    expect(screen.getByText('Public Expression Retrospectives')).toBeInTheDocument()
    expect(screen.queryByText('表达与复盘')).not.toBeInTheDocument()
    expect(screen.queryByText('公开表达复盘')).not.toBeInTheDocument()
  })

  it('keeps document title route-correct when entering and leaving an article', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValue({
      text: async () => '---\ndate: "2026-07-05"\n---\n# Test Article\nBody',
    })
    window.localStorage.setItem('site-locale', 'en')
    window.history.replaceState({}, '', '/articles/2026-07-05-where-do-we-go-preface')
    render(<App />)

    await waitFor(() => expect(document.title).toBe('Test Article · luo-chen.com'))
    await userEvent.click(screen.getByRole('link', { name: 'LUOCHEN' }))
    await waitFor(() => expect(document.title).toBe('Agent Harness Engineer & Full-Stack Builder'))
  })

  it('renders ArticlePage collection and series navigation chrome in English', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValue({
      text: async () => '---\ndate: "2026-07-05"\n---\n# Authored Article Title\nAuthored body',
    })
    window.localStorage.setItem('site-locale', 'en')
    window.history.replaceState({}, '', '/articles/2026-07-05-where-do-we-go-preface')
    render(<App />)

    expect(await screen.findByRole('link', { name: 'Where Do We Go From Here?' })).toBeInTheDocument()
    expect(screen.getByText('Preface: The Old Coordinates Are Failing')).toBeInTheDocument()
    expect(screen.queryByText('我们将何去何从')).not.toBeInTheDocument()
    expect(screen.queryByText('序章：旧坐标正在失效')).not.toBeInTheDocument()

  })

  it('redirects an unknown article slug to writing without fetching it', async () => {
    const fetchMock = vi.spyOn(window, 'fetch')
    window.history.replaceState({}, '', '/articles/not-in-index')
    render(<App />)

    await waitFor(() => expect(window.location.pathname).toBe('/writing'))
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('redirects an unpublished empty column to writing', async () => {
    window.history.replaceState({}, '', '/columns/agent-harness')
    render(<App />)

    await waitFor(() => expect(window.location.pathname).toBe('/writing'))
  })

  it('scrolls to the top and focuses main after client navigation', async () => {
    const scrollTo = vi.mocked(window.scrollTo)
    render(<App />)
    scrollTo.mockClear()

    await userEvent.click(screen.getAllByRole('link', { name: '写作' })[0])

    await waitFor(() => expect(document.querySelector('main')).toHaveFocus())
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' })
    expect(document.querySelector('main')).toHaveAttribute('tabindex', '-1')
  })

})
