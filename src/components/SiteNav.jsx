import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const primaryLinks = [
  { key: 'home', to: '/', end: true },
  { key: 'work', to: '/work' },
  { key: 'writing', to: '/writing' },
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
  const wasOpenRef = useRef(false)
  const menuId = 'site-menu'
  const localeLabel = locale === 'en' ? '中文' : 'EN'

  useEffect(() => {
    const closeTimer = window.setTimeout(() => setOpen(false), 0)
    return () => window.clearTimeout(closeTimer)
  }, [location.pathname])

  useEffect(() => {
    if (open) {
      document.body.classList.add('menu-open')
      firstDrawerLinkRef.current?.focus()
    } else {
      document.body.classList.remove('menu-open')
      if (wasOpenRef.current) triggerRef.current?.focus()
    }
    wasOpenRef.current = open

    return () => document.body.classList.remove('menu-open')
  }, [open])

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  return (
    <>
      <nav className="desktop-nav" aria-label={t.common.primaryNav || 'Primary navigation'}>
        <Link className="brand" to="/">{t.common.brand || 'LUOCHEN'}</Link>
        <div className="desktop-nav-links">
          <PrimaryLinks t={t} />
        </div>
        <div className="desktop-nav-secondary">
          <NavLink to="/lab/roundtable">{t.nav.lab}</NavLink>
          <button className="lang-toggle" type="button" onClick={onToggleLocale}>
            {localeLabel}
          </button>
        </div>
      </nav>

      <nav className="mobile-nav-shell" aria-label={t.common.mobileNav || 'Mobile navigation'}>
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
          <div className="mobile-menu-links">
            <PrimaryLinks
              t={t}
              firstLinkRef={firstDrawerLinkRef}
              onNavigate={() => setOpen(false)}
            />
          </div>
          <div className="mobile-menu-secondary">
            <NavLink to="/lab/roundtable" onClick={() => setOpen(false)}>{t.nav.lab}</NavLink>
            <button className="lang-toggle" type="button" onClick={onToggleLocale}>
              {localeLabel}
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}
