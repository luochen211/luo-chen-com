// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { siteContent } from '../data/siteContent'
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

  it('traps forward and backward tab focus inside the modal drawer', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><main><button>Background action</button></main><SiteNav locale="zh" t={t} onToggleLocale={vi.fn()} /></MemoryRouter>)
    await user.click(screen.getByRole('button', { name: '打开菜单' }))

    const drawer = document.querySelector('.mobile-menu-panel')
    const focusable = [...drawer.querySelectorAll('a, button')]
    focusable.at(-1).focus()
    await user.tab()
    expect(focusable[0]).toHaveFocus()

    focusable[0].focus()
    await user.tab({ shift: true })
    expect(focusable.at(-1)).toHaveFocus()
  })

  it('makes background content inert while the modal drawer is open', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><main data-testid="page-content"><button>Background action</button></main><SiteNav locale="zh" t={t} onToggleLocale={vi.fn()} /></MemoryRouter>)
    await user.click(screen.getByRole('button', { name: '打开菜单' }))

    expect(document.querySelector('.mobile-menu-panel')).toHaveAttribute('role', 'dialog')
    expect(document.querySelector('.mobile-menu-panel')).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByTestId('page-content')).toHaveAttribute('inert')

    await user.keyboard('{Escape}')
    expect(screen.getByTestId('page-content')).not.toHaveAttribute('inert')
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

  it('closes from the mobile backdrop without closing from inside the panel', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><SiteNav locale="zh" t={t} onToggleLocale={vi.fn()} /></MemoryRouter>)
    const trigger = screen.getByRole('button', { name: '打开菜单' })
    await user.click(trigger)

    await user.click(document.querySelector('.mobile-menu-panel'))
    expect(trigger).toHaveAttribute('aria-expanded', 'true')

    await user.click(document.querySelector('.mobile-menu-backdrop'))
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('uses localized Chinese navigation landmark labels', () => {
    render(
      <MemoryRouter>
        <SiteNav locale="zh" t={siteContent.zh} onToggleLocale={vi.fn()} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('navigation', { name: '主导航' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: '移动端导航' })).toBeInTheDocument()
  })
})
