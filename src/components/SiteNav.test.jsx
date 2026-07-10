// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import SiteNav from './SiteNav'

const t = {
  nav: { home: '首页', work: '作品', writing: '写作', now: 'Now', contact: '联系', lab: '实验室' },
  common: { menu: '打开菜单', close: '关闭菜单' },
}

afterEach(() => cleanup())

describe('SiteNav', () => {
  it('opens and closes the mobile menu with accessible state', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><SiteNav locale="zh" t={t} onToggleLocale={vi.fn()} /></MemoryRouter>)
    const trigger = screen.getByRole('button', { name: '打开菜单' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard('{Escape}')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('moves focus into the drawer, locks scroll, and returns focus on Escape', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><SiteNav locale="zh" t={t} onToggleLocale={vi.fn()} /></MemoryRouter>)
    const trigger = screen.getByRole('button', { name: '打开菜单' })

    await user.click(trigger)

    expect(document.activeElement).toHaveAttribute('href', '/')
    expect(document.activeElement).toHaveTextContent('首页')
    expect(document.body).toHaveClass('menu-open')

    await user.keyboard('{Escape}')

    expect(trigger).toHaveFocus()
    expect(document.body).not.toHaveClass('menu-open')
  })

  it('uses primary routes and closes the drawer when a route is selected', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><SiteNav locale="zh" t={t} onToggleLocale={vi.fn()} /></MemoryRouter>)
    const trigger = screen.getByRole('button', { name: '打开菜单' })
    await user.click(trigger)

    const drawerWork = screen.getAllByRole('link', { name: '作品' })[1]
    expect(drawerWork).toHaveAttribute('href', '/work')
    expect(screen.getAllByRole('link', { name: '写作' })[1]).toHaveAttribute('href', '/writing')
    expect(screen.getAllByRole('link', { name: '实验室' })[1]).toHaveAttribute('href', '/lab/roundtable')

    await user.click(drawerWork)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('keeps locale switching available in desktop and drawer navigation', async () => {
    const user = userEvent.setup()
    const onToggleLocale = vi.fn()
    render(<MemoryRouter><SiteNav locale="zh" t={t} onToggleLocale={onToggleLocale} /></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: 'EN' }))
    expect(onToggleLocale).toHaveBeenCalledOnce()
  })
})
