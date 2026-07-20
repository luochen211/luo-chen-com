import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const primaryLinks = [
  { key: 'home', to: '/', end: true },
  { key: 'output', to: '/output' },
  { key: 'now', to: '/now' },
  { key: 'contact', to: '/contact' },
]

function PrimaryLinks({ t, firstLinkRef, onNavigate }) {
  return primaryLinks.map(({ key, to, end }, index) => (
    <NavLink
      className={({ isActive }) => (isActive ? 'active' : '')}
      end={end}
      key={key}
      onClick={onNavigate}
      ref={index === 0 ? firstLinkRef : undefined}
      to={to}
    >
      {t.nav[key]}
    </NavLink>
  ))
}

export default function SiteNav({ locale, t, onToggleLocale }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const triggerRef = useRef(null)
  const firstDrawerLinkRef = useRef(null)
  const panelRef = useRef(null)
  const wasOpenRef = useRef(false)
  const previousPathRef = useRef(location.pathname)
  const menuId = 'site-menu'
  const localeLabel = locale === 'en' ? '中文' : 'EN'

  useEffect(() => {
    if (previousPathRef.current === location.pathname) return undefined
    previousPathRef.current = location.pathname
    const closeTimer = window.setTimeout(() => setOpen(false), 0)
    return () => window.clearTimeout(closeTimer)
  }, [location.pathname])

  useEffect(() => {
    if (open) {
      document.body.classList.add('menu-open')
      document.querySelectorAll('.route-main, .footer, .desktop-nav, body > div > main').forEach((element) => {
        element.inert = true
        element.setAttribute('inert', '')
      })
      firstDrawerLinkRef.current?.focus()
    } else {
      document.body.classList.remove('menu-open')
      document.querySelectorAll('[inert]').forEach((element) => {
        element.inert = false
        element.removeAttribute('inert')
      })
      if (wasOpenRef.current) triggerRef.current?.focus()
    }
    wasOpenRef.current = open

    return () => {
      document.body.classList.remove('menu-open')
      document.querySelectorAll('[inert]').forEach((element) => {
        element.inert = false
        element.removeAttribute('inert')
      })
    }
  }, [open])

  useEffect(() => {
    function handleDrawerKeydown(event) {
      if (event.key === 'Escape') {
        setOpen(false)
        return
      }
      if (!open || event.key !== 'Tab') return
      const focusable = [...panelRef.current.querySelectorAll('a[href], button:not([disabled])')]
      const first = focusable[0]
      const last = focusable.at(-1)
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', handleDrawerKeydown)
    return () => window.removeEventListener('keydown', handleDrawerKeydown)
  }, [open])

  return (
    <>
      <nav className="desktop-nav" aria-label={t.common.primaryNav}>
        <Link className="brand" to="/">{t.common.brand || 'LUOCHEN'}</Link>
        <div className="desktop-nav-links">
          <PrimaryLinks t={t} />
        </div>
        <div className="desktop-nav-secondary">
          <button className="lang-toggle" type="button" onClick={onToggleLocale}>
            {localeLabel}
          </button>
        </div>
      </nav>

      <nav className="mobile-nav-shell" aria-label={t.common.mobileNav}>
        <Link className="brand" to="/" aria-label={t.nav.home}>{t.common.brand || 'LUOCHEN'}</Link>
        <button
          className="menu-toggle"
          type="button"
          ref={triggerRef}
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? t.common.close : t.common.menu}
          onClick={() => setOpen((value) => !value)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <div className="mobile-menu" id={menuId} hidden={!open}>
          <button
            aria-label={t.common.close}
            className="mobile-menu-backdrop"
            onClick={() => setOpen(false)}
            tabIndex="-1"
            type="button"
          />
          <div className="mobile-menu-panel" ref={panelRef} role="dialog" aria-modal="true" aria-label={t.common.mobileNav}>
            <div className="mobile-menu-links">
              <PrimaryLinks
                t={t}
                firstLinkRef={firstDrawerLinkRef}
                onNavigate={() => setOpen(false)}
              />
            </div>
            <div className="mobile-menu-secondary">
              <button className="lang-toggle" type="button" onClick={onToggleLocale}>
                {localeLabel}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
