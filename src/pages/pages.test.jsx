/* @vitest-environment jsdom */
import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import AboutPage from './AboutPage'
import HomePage from './HomePage'
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
    expect(container.querySelectorAll('.project-orbit-card')).toHaveLength(4)
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
      'chapter home-showreel',
      'chapter home-proof-chapter',
      'chapter selected-work',
      'chapter more-work',
      'chapter open-source-work',
      'chapter selected-writing',
      'collaboration-cta',
    ])
  })

  it('routes every homepage archive action through Output', () => {
    render(<MemoryRouter><HomePage t={siteContent.zh} locale="zh" /></MemoryRouter>)
    expect(screen.getAllByRole('link', { name: /查看内容|产出/ })).toHaveLength(4)
    screen.getAllByRole('link', { name: /查看内容|产出/ }).forEach((link) => {
      expect(link).toHaveAttribute('href', '/output')
    })
  })

  it('features the live Super Scholar product without a private repository link', () => {
    const { container } = render(<MemoryRouter><HomePage t={siteContent.zh} locale="zh" /></MemoryRouter>)
    const card = [...container.querySelectorAll('.project-orbit-card')]
      .find((project) => project.textContent.includes('超级学霸'))
    expect(card?.querySelector('a[href="https://xysjwlwhcm.top/chat/"]')).toHaveTextContent('在线体验')
    expect(card?.querySelector('a[href*="github.com"]')).not.toBeInTheDocument()
    const moreWork = container.querySelectorAll('.more-work-list li')
    expect(moreWork).toHaveLength(getProjectShowcase('zh').length - 4)
  })

  it('lists upstream open-source contributions with merged PR links', () => {
    const { container } = render(<MemoryRouter><HomePage t={siteContent.zh} locale="zh" /></MemoryRouter>)
    const rows = container.querySelectorAll('.open-source-list a')
    expect(rows.length).toBeGreaterThan(10)
    const careerOps = [...rows].find((row) => row.textContent.includes('career-ops-hq/career-ops'))
    expect(careerOps).toHaveAttribute('href', expect.stringContaining('author%3Aluochen211+is%3Amerged'))
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
    expect(screen.getByRole('heading', { name: siteContent.zh.course.archive.title })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /了解 AI接单实验室/ })).toHaveAttribute(
      'href',
      'https://my.feishu.cn/docx/XKuRdcy3MoxS9ixBaa1cPzTYnVp',
    )
  })

  it('renders the AI delivery talk as four modules around one core judgment', () => {
    const { container } = render(<MemoryRouter><AiDeliveryTalkPage locale="zh" /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: /客户为什么愿意把结果交给你/ })).toBeInTheDocument()
    expect(container.querySelectorAll('.ai-talk-module')).toHaveLength(4)
    expect(screen.getByText(/客户真正购买的，不是你的身份/)).toBeInTheDocument()
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

  it('folds Now into About and omits general career positioning', () => {
    render(<AboutPage t={siteContent.zh} locale="zh" />)
    expect(document.querySelector('#now')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(siteContent.zh.now.title)
    expect(screen.getByText(/2026\.10\.25/)).toHaveAttribute('datetime', '2026-10-25')
    expect(screen.queryByText(siteContent.zh.now.careerTitle)).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: siteContent.zh.now.projects })).toBeInTheDocument()
    expect(screen.getByText(/在线学习工作台/)).toBeInTheDocument()
    expect(screen.getByText(/家长向短视频的内容生产线/)).toBeInTheDocument()
  })

  it('combines a personal timeline and prefilled collaboration email on About', () => {
    render(<AboutPage t={siteContent.en} locale="en" />)
    expect(document.querySelector('.about-introduction')).not.toBeInTheDocument()
    expect(document.querySelector('.about-timeline-track')).toHaveAttribute('data-point-count', '8')
    expect(screen.getByRole('heading', { name: 'Earned money on my own for the first time' })).toBeInTheDocument()
    expect(screen.getByText('MIDDLE SCHOOL', { selector: 'time' })).not.toHaveAttribute('datetime')
    expect(screen.getByRole('button', { name: 'HIGH SCHOOL · Ran Chinese metaphysics training and became a Taoist priest' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: / · / })).toHaveLength(8)
    const action = screen.getByRole('link', { name: /Send a collaboration email/ })
    expect(action).toHaveAttribute('href', expect.stringContaining('subject=Collaboration%20inquiry'))
    expect(action).toHaveAttribute('href', expect.stringContaining('Project%20context'))
  })

  it('reveals the event attached to a selected timeline coordinate', async () => {
    render(<AboutPage t={siteContent.zh} locale="zh" />)
    const commercialCoordinate = screen.getByRole('button', { name: '2026.06—10 · 5 个月，175 个 PR 被上游合并' })
    expect(commercialCoordinate).toHaveAttribute('aria-pressed', 'false')

    await userEvent.click(commercialCoordinate)

    expect(commercialCoordinate).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('heading', { name: '5 个月，175 个 PR 被上游合并' })).toBeInTheDocument()
    expect(screen.getByText(/累计合并 112 个，我进入了贡献者前 10/)).toBeInTheDocument()
  })

  it('publishes Xiaohongshu and Douyin profiles with follower counts', () => {
    render(<AboutPage t={siteContent.zh} locale="zh" />)
    const xiaohongshu = screen.getByRole('link', { name: /小红书300 粉丝/ })
    expect(xiaohongshu).toHaveAttribute(
      'href',
      'https://www.xiaohongshu.com/user/profile/69ce663f000000003402ed88',
    )
    const douyin = screen.getByRole('link', { name: /抖音1462 粉丝/ })
    expect(douyin).toHaveAttribute(
      'href',
      expect.stringContaining('www.douyin.com/user/'),
    )
    expect(xiaohongshu.querySelector('.social-icon-xiaohongshu')).toBeInTheDocument()
    expect(douyin.querySelector('.social-icon-douyin')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '全网 1700+ 粉丝' })).toBeInTheDocument()
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
    expect(articles[2].querySelector('.article-column')).toHaveTextContent('Project Retrospectives')
    expect(screen.getByRole('heading', { name: 'The More Capable You Are, the Easier You Are to Push Out' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Before Trusting a 3% Equity Promise, Find the Missing Fifty' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /The Programmer’s Product Illusion/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'English Is Infrastructure for a Larger Market' })).toBeInTheDocument()
  })
})
