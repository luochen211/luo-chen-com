/* @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
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
  window.localStorage.clear()
  window.history.replaceState({}, '', '/')
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('localized route rendering', () => {
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

    window.history.pushState({}, '', '/articles/not-in-index')
    window.dispatchEvent(new PopStateEvent('popstate'))
    expect(await screen.findByText(/^Article ·/)).toBeInTheDocument()
  })

  it('syncs only an untouched default roundtable topic across locale changes', async () => {
    window.localStorage.setItem('site-locale', 'zh')
    window.history.replaceState({}, '', '/lab/roundtable')
    render(<App />)
    const topic = screen.getByRole('textbox', { name: '议题' })

    await userEvent.click(screen.getByRole('button', { name: 'EN' }))
    expect(topic).toHaveValue(
      'Should I move my AI coding course from a low-cost community to a premium advisory offer?',
    )

    fireEvent.change(topic, { target: { value: 'My own question' } })
    await userEvent.click(screen.getByRole('button', { name: '中文' }))
    expect(topic).toHaveValue('My own question')
  })
})
