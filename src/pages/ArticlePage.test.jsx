/* @vitest-environment jsdom */
import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { siteContent } from '../data/siteContent'
import ArticlePage from './ArticlePage'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

function renderArticle(locale = 'zh', slug = '2026-07-05-where-do-we-go-preface') {
  return render(
    <MemoryRouter initialEntries={[`/articles/${slug}`]}>
      <Routes>
        <Route path="/articles/:slug" element={<ArticlePage locale={locale} />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ArticlePage', () => {
  it('replaces loading with the localized unavailable state when fetching fails', async () => {
    vi.spyOn(window, 'fetch').mockRejectedValue(new Error('offline'))
    renderArticle()

    expect(screen.getByText(siteContent.zh.article.loading)).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: siteContent.zh.article.unavailable })).toBeInTheDocument()
    expect(screen.queryByText(siteContent.zh.article.loading)).not.toBeInTheDocument()
    expect(document.title).toBe(`${siteContent.zh.article.unavailable} · luo-chen.com`)
  })

  it('renders localized reading time after Markdown loads', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      text: async () => `---\ndate: "2026-07-05"\n---\n# 测试文章\n${'字'.repeat(800)}`,
    })
    const { container } = renderArticle()

    expect(await screen.findByText(`3 ${siteContent.zh.article.readingTime}`)).toBeInTheDocument()
    expect(container.querySelector('.article-page')).not.toHaveClass('reveal')
  })

  it('links to the original post when the article has a source', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValue({ ok: true, text: async () => '# 越能干，越容易被踢走。\n正文' })
    renderArticle('zh', '2026-10-29-capable-people-get-pushed-out')

    const source = await screen.findByRole('link', { name: /查看 X 原文/ })
    expect(source).toHaveAttribute('href', 'https://x.com/luochenkafei/status/2115705228792037753')
    expect(source).toHaveAttribute('target', '_blank')
  })

  it('omits the source link for articles without one', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValue({ ok: true, text: async () => '# 测试文章\n正文' })
    const { container } = renderArticle()

    await screen.findByRole('heading', { name: '测试文章' })
    expect(container.querySelector('.article-source')).toBeNull()
  })
})
