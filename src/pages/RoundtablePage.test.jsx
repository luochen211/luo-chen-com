/* @vitest-environment jsdom */
import { cleanup, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { siteContent } from '../data/siteContent'
import RoundtablePage from './RoundtablePage'

afterEach(cleanup)

describe('RoundtablePage', () => {
  it('presents three steps, recommends three experts, and expands the remaining experts', async () => {
    render(<RoundtablePage t={siteContent.zh} />)

    expect(screen.getByText('输入真实问题')).toBeInTheDocument()
    expect(screen.getByText('选择推荐专家')).toBeInTheDocument()
    expect(screen.getByText('生成并比较判断')).toBeInTheDocument()

    expect(screen.getAllByRole('button', { pressed: true })).toHaveLength(3)
    expect(screen.getByRole('button', { name: /雷·达里奥/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /克莱顿·克里斯坦森/ })).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: '查看全部专家' }))

    expect(screen.getByRole('button', { name: /克莱顿·克里斯坦森/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /彼得·德鲁克/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /纳西姆·塔勒布/ })).toBeInTheDocument()
  })

  it('does not allow deselecting the final selected expert', async () => {
    render(<RoundtablePage t={siteContent.zh} />)
    const selected = screen.getAllByRole('button', { pressed: true })
    await userEvent.click(selected[0])
    await userEvent.click(selected[1])

    const lastSelected = screen.getByRole('button', { pressed: true })
    await userEvent.click(lastSelected)

    expect(lastSelected).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getAllByRole('button', { pressed: true })).toHaveLength(1)
  })

  it('posts the topic and selected expert records, then renders the localized result sections', async () => {
    const fetchMock = vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        topic: '测试议题',
        turns: [{ expert: '专家', angle: '视角', argument: '判断' }],
        judge: {
          verdict: '主持结论', insights: ['洞察'], conflicts: ['冲突'],
          blindSpots: ['盲区'], actions: ['行动'],
        },
      }),
    })
    render(<RoundtablePage t={siteContent.zh} />)
    const topic = screen.getByRole('textbox', { name: '议题' })
    await userEvent.clear(topic)
    await userEvent.type(topic, '测试议题')
    await userEvent.click(screen.getByRole('button', { name: '开始圆桌' }))

    expect(fetchMock).toHaveBeenCalledWith('/api/roundtable', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ topic: '测试议题', experts: siteContent.zh.lab.experts.slice(0, 3) }),
    }))
    expect(await screen.findByText('主持结论')).toBeInTheDocument()
    for (const heading of ['真正有洞察', '核心冲突', '仍然盲区', '下一步行动']) {
      expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument()
    }
  })

  it('retains and displays the current API error', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ error: '服务端暂时不可用' }),
    })
    render(<RoundtablePage t={siteContent.zh} />)
    await userEvent.click(screen.getByRole('button', { name: '开始圆桌' }))
    expect(await screen.findByText('服务端暂时不可用')).toBeInTheDocument()
  })

  it('uses the localized fallback for a network error', async () => {
    vi.spyOn(window, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'))
    render(<RoundtablePage t={siteContent.zh} />)
    await userEvent.click(screen.getByRole('button', { name: '开始圆桌' }))
    expect(await screen.findByText(siteContent.zh.lab.error)).toBeInTheDocument()
    expect(screen.queryByText('Failed to fetch')).not.toBeInTheDocument()
  })
})
