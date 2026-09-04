/* @vitest-environment jsdom */
import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import AboutPage from './AboutPage'
import HomePage from './HomePage'
import NowPage from './NowPage'
import WorkPage from './WorkPage'
import WritingPage from './WritingPage'
import OutputPage from './OutputPage'
import AiDeliveryTalkPage from './AiDeliveryTalkPage'
import { siteContent } from '../data/siteContent'
import { getProjectShowcase } from '../data/projectShowcase'

const pages = [
  ['Home', HomePage, { locale: 'zh' }],
  ['Work', WorkPage],
  ['Writing', WritingPage, { locale: 'zh' }],
  ['Output', OutputPage, { locale: 'zh' }],
  ['Now', NowPage],
  ['About', AboutPage, { locale: 'zh' }],
  ['AI delivery talk', AiDeliveryTalkPage, { locale: 'zh' }],
]

afterEach(cleanup)

describe('redesigned page purposes', () => {
  it('uses a complete four-card proof bento on the homepage', () => {
    render(<MemoryRouter><HomePage t={siteContent.zh} locale="zh" /></MemoryRouter>)
    expect(screen.getAllByTestId('proof-item')).toHaveLength(4)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('keeps every homepage motion scene represented in the document', () => {
    const { container } = render(<MemoryRouter><HomePage t={siteContent.zh} locale="zh" /></MemoryRouter>)
    expect(container.querySelector('.hero-portrait-background img')).toHaveAttribute('src', '/头像111.jpg')
    expect(container.querySelector('.portrait-focus-instruction')).toBeInTheDocument()
    expect(container.querySelectorAll('.proof-scene')).toHaveLength(4)
    expect(container.querySelectorAll('.project-orbit-card')).toHaveLength(3)
    expect(container.querySelectorAll('.writing-stack > a')).toHaveLength(4)
    expect(container.querySelector('.cta-expansion-surface')).toBeInTheDocument()
  })

  it('lets pointer and keyboard users toggle the portrait focus state', async () => {
    render(<MemoryRouter><HomePage t={siteContent.zh} locale="zh" /></MemoryRouter>)
    const portrait = screen.getByRole('button', { name: '切换头像清晰度' })
    expect(portrait).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(portrait)
    expect(portrait).toHaveAttribute('aria-pressed', 'true')
    expect(portrait).toHaveClass('is-revealed')
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

  it('routes every homepage archive action through Output', () => {
    render(<MemoryRouter><HomePage t={siteContent.zh} locale="zh" /></MemoryRouter>)
    expect(screen.getAllByRole('link', { name: /查看内容|产出/ })).toHaveLength(3)
    screen.getAllByRole('link', { name: /查看内容|产出/ }).forEach((link) => {
      expect(link).toHaveAttribute('href', '/output')
    })
  })

  it('owns the complete project archive on Work', () => {
    const { container } = render(<WorkPage t={siteContent.zh} />)
    expect(container.querySelectorAll('.archive-project')).toHaveLength(getProjectShowcase('zh').length)
  })

  it('combines projects, writing, and talks on Output', () => {
    const { container } = render(<MemoryRouter><OutputPage t={siteContent.zh} locale="zh" /></MemoryRouter>)
    expect(container.querySelectorAll('.output-project')).toHaveLength(getProjectShowcase('zh').length)
    const harnessDemo = [...container.querySelectorAll('.output-project')]
      .find((project) => project.textContent.includes('Agent Harness 讲师演示台'))
    expect(harnessDemo?.querySelector('a[href="/demos/agent-harness/"]')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: siteContent.zh.output.writingTitle })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '从毕业设计到持续接单' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /打开这场分享/ })).toHaveAttribute('href', '/talks/ai-delivery')
    expect(screen.getByRole('link', { name: /了解 AI接单实验室/ })).toHaveAttribute(
      'href',
      'https://my.feishu.cn/docx/XKuRdcy3MoxS9ixBaa1cPzTYnVp',
    )
  })

  it('renders the AI delivery talk as four modules around one core judgment', () => {
    const { container } = render(<MemoryRouter><AiDeliveryTalkPage locale="zh" /></MemoryRouter>)
    expect(container.querySelector('.ai-talk-embed')).toHaveAttribute('src', '/slides/decks/ai-delivery/')
    expect(container.querySelector('.ai-talk-embed')).toHaveAttribute('title', '从毕业设计到持续接单 · AI 编程真实交付')
  })

  it('keeps the Output closing statement in two deliberate lines with highlighted keywords', () => {
    const { container } = render(<MemoryRouter><OutputPage t={siteContent.zh} locale="zh" /></MemoryRouter>)
    const statement = screen.getByRole('heading', { name: siteContent.zh.output.endTitle })
    const lines = statement.querySelectorAll('.output-end-line')
    expect(lines).toHaveLength(2)
    expect(lines[0]).toHaveTextContent('下一项 产出，')
    expect(lines[1]).toHaveTextContent('正在 发生。')
    expect([...container.querySelectorAll('.output-end em')].map((node) => node.textContent)).toEqual(['产出', '发生'])
  })

  it('keeps Now current and omits general career positioning', () => {
    render(<NowPage t={siteContent.zh} />)
    expect(screen.getByText(/2026\.08\.13/)).toHaveAttribute('datetime', '2026-08-13')
    expect(screen.queryByText(siteContent.zh.now.careerTitle)).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: siteContent.zh.now.projects })).toBeInTheDocument()
    expect(screen.getByText(/可以直接说出口的口播稿/)).toBeInTheDocument()
    expect(screen.getByText(/录制、剪辑和发布短视频/)).toBeInTheDocument()
  })

  it('combines a personal timeline and prefilled collaboration email on About', () => {
    render(<AboutPage t={siteContent.en} locale="en" />)
    expect(document.querySelector('.about-introduction')).not.toBeInTheDocument()
    expect(document.querySelector('.about-timeline-track')).toHaveAttribute('data-point-count', '7')
    expect(screen.getByRole('heading', { name: 'Earned money on my own for the first time' })).toBeInTheDocument()
    expect(screen.getByText('MIDDLE SCHOOL', { selector: 'time' })).not.toHaveAttribute('datetime')
    expect(screen.getByRole('button', { name: 'HIGH SCHOOL · Ran Chinese metaphysics training and became a Taoist priest' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: / · / })).toHaveLength(7)
    const action = screen.getByRole('link', { name: /Send a collaboration email/ })
    expect(action).toHaveAttribute('href', expect.stringContaining('subject=Collaboration%20inquiry'))
    expect(action).toHaveAttribute('href', expect.stringContaining('Project%20context'))
  })

  it('reveals the event attached to a selected timeline coordinate', async () => {
    render(<AboutPage t={siteContent.zh} locale="zh" />)
    const commercialCoordinate = screen.getByRole('button', { name: '2025 · 开始为企业项目交付结果' })
    expect(commercialCoordinate).toHaveAttribute('aria-pressed', 'false')

    await userEvent.click(commercialCoordinate)

    expect(commercialCoordinate).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('heading', { name: '开始为企业项目交付结果' })).toBeInTheDocument()
    expect(screen.getByText(/开发不再只是把功能写出来/)).toBeInTheDocument()
  })

  it('publishes Xiaohongshu and Douyin profiles with follower counts', () => {
    render(<AboutPage t={siteContent.zh} locale="zh" />)
    const xiaohongshu = screen.getByRole('link', { name: /小红书300 粉丝/ })
    expect(xiaohongshu).toHaveAttribute(
      'href',
      'https://www.xiaohongshu.com/user/profile/69ce663f000000003402ed88',
    )
    const douyin = screen.getByRole('link', { name: /抖音1000 粉丝/ })
    expect(douyin).toHaveAttribute(
      'href',
      expect.stringContaining('www.douyin.com/user/'),
    )
    expect(xiaohongshu.querySelector('.social-icon-xiaohongshu')).toBeInTheDocument()
    expect(douyin.querySelector('.social-icon-douyin')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '全网 1000+ 粉丝' })).toBeInTheDocument()
    const x = screen.getByRole('link', { name: /X@luochenkafei/ })
    expect(x).toHaveAttribute('href', 'https://x.com/luochenkafei')
    expect(x.querySelector('.social-icon-x')).toBeInTheDocument()
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
