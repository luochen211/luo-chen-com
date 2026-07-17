/* @vitest-environment jsdom */
import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import HomePage from './HomePage'
import ContactPage from './ContactPage'
import NowPage from './NowPage'
import WorkPage from './WorkPage'
import WritingPage from './WritingPage'
import { siteContent } from '../data/siteContent'
import { getProjectShowcase } from '../data/projectShowcase'

const pages = [
  ['Home', HomePage, { locale: 'zh' }],
  ['Work', WorkPage],
  ['Writing', WritingPage, { locale: 'zh' }],
  ['Now', NowPage],
  ['Contact', ContactPage],
]

afterEach(cleanup)

describe('redesigned page purposes', () => {
  it('limits the homepage to three proof items', () => {
    render(<MemoryRouter><HomePage t={siteContent.zh} locale="zh" /></MemoryRouter>)
    expect(screen.getAllByTestId('proof-item')).toHaveLength(3)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('does not list unpublished columns on Writing', () => {
    render(<MemoryRouter><WritingPage t={siteContent.zh} locale="zh" /></MemoryRouter>)
    expect(screen.queryByText('Agent Harness 实践')).not.toBeInTheDocument()
    expect(screen.getAllByText('项目复盘').length).toBeGreaterThan(0)
  })

  it.each(pages)('renders exactly one route-level H1 on %s', (_, Page, props = {}) => {
    render(<MemoryRouter><Page t={siteContent.zh} {...props} /></MemoryRouter>)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('keeps the homepage section sequence focused', () => {
    const { container } = render(<MemoryRouter><HomePage t={siteContent.zh} locale="zh" /></MemoryRouter>)
    expect([...container.querySelector('.home-redesign').children].map((node) => node.className)).toEqual([
      'focused-hero home-focused-hero',
      'chapter home-proof-chapter',
      'chapter selected-work',
      'chapter selected-writing',
      'collaboration-cta',
    ])
  })

  it('owns the complete project archive on Work', () => {
    const { container } = render(<WorkPage t={siteContent.zh} />)
    expect(container.querySelectorAll('.archive-project')).toHaveLength(getProjectShowcase('zh').length)
  })

  it('keeps Now current and omits general career positioning', () => {
    render(<NowPage t={siteContent.zh} />)
    expect(screen.getByText(/2026\.07\.10/)).toHaveAttribute('datetime', '2026-07-10')
    expect(screen.queryByText(siteContent.zh.now.careerTitle)).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: siteContent.zh.now.projects })).toBeInTheDocument()
  })

  it('provides a prefilled collaboration email on Contact', () => {
    render(<ContactPage t={siteContent.en} />)
    const action = screen.getByRole('link', { name: /Send a collaboration email/ })
    expect(action).toHaveAttribute('href', expect.stringContaining('subject=Collaboration%20inquiry'))
    expect(action).toHaveAttribute('href', expect.stringContaining('Project%20context'))
  })

  it('renders English article display metadata on Home', () => {
    render(<MemoryRouter><HomePage t={siteContent.en} locale="en" /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'After Watching The Years of the Dragon' })).toBeInTheDocument()
    expect(screen.queryByText('看完《龙年档案》之后：我尊重罗成，但我不会成为罗成')).not.toBeInTheDocument()
  })

  it('renders every listed Writing article with English metadata', () => {
    const { container } = render(<MemoryRouter><WritingPage t={siteContent.en} locale="en" /></MemoryRouter>)
    const articles = [...container.querySelectorAll('.latest-writing-list a')]
    expect(articles).toHaveLength(8)
    articles.forEach((article) => expect(article.textContent).not.toMatch(/[\u3400-\u9fff]/))
    expect(articles[0].querySelector('.article-column')).toHaveTextContent('Where Do We Go From Here?')
    expect(articles[1].querySelector('.article-column')).toHaveTextContent('Project Retrospectives')
    expect(screen.getByRole('heading', { name: 'Before Trusting a 3% Equity Promise, Find the Missing Fifty' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /The Programmer’s Product Illusion/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'English Is Infrastructure for a Larger Market' })).toBeInTheDocument()
  })
})
