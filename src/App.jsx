import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom'
import './App.css'
import CollectionView from './components/CollectionView'
import SiteNav from './components/SiteNav'
import ArticlePage from './pages/ArticlePage'
import ContactPage from './pages/ContactPage'
import HomePage from './pages/HomePage'
import NowPage from './pages/NowPage'
import OutputPage from './pages/OutputPage'
import { getInitialLocale, siteContent } from './data/siteContent'
import { findArticle } from './lib/articles'

gsap.registerPlugin(ScrollTrigger)

function getRouteTitle(pathname, t) {
  if (pathname.startsWith('/articles/')) return null
  if (pathname === '/now') return t.now.title
  if (['/output', '/work', '/projects', '/writing', '/course'].includes(pathname)) return t.output.title
  if (pathname === '/contact') return t.contact.title
  if (pathname === '/topics/where-do-we-go') return t.topic.title
  if (pathname.startsWith('/columns/')) {
    const slug = pathname.slice('/columns/'.length)
    return t.collections[slug]?.title || t.seoTitle.text
  }
  return t.seoTitle.text
}

function IndexedArticleRoute({ locale }) {
  const { slug } = useParams()
  return findArticle(slug) ? <ArticlePage locale={locale} /> : <Navigate replace to="/output" />
}

function SiteApp() {
  const [locale, setLocale] = useState(() => getInitialLocale(window.localStorage))
  const location = useLocation()
  const mainRef = useRef(null)
  const previousPathRef = useRef(location.pathname)
  const t = siteContent[locale]

  useEffect(() => {
    window.localStorage.setItem('site-locale', locale)
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
    const routeTitle = getRouteTitle(location.pathname, t)
    if (routeTitle) document.title = routeTitle
  }, [locale, location.pathname, t])

  useEffect(() => {
    if (previousPathRef.current === location.pathname) return
    previousPathRef.current = location.pathname
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    mainRef.current?.focus({ preventScroll: true })
  }, [location.pathname])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('in')
      })
    }, { threshold: 0.16 })
    document.querySelectorAll('.reveal').forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [location.pathname, locale])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const context = gsap.context(() => {
      gsap.fromTo(
        '.focused-hero-copy > *',
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 },
      )
      gsap.fromTo(
        '.focused-portrait',
        { opacity: 0, y: 42, rotate: -1.5 },
        { opacity: 1, y: 0, rotate: 0, duration: 1.1, ease: 'power3.out', delay: 0.12 },
      )
      gsap.utils.toArray('.focused-proof-item, .selected-work-card').forEach((item) => {
        gsap.fromTo(item, { opacity: 0.18, y: 34 }, {
          opacity: 1, y: 0, ease: 'none',
          scrollTrigger: { trigger: item, start: 'top 90%', end: 'top 48%', scrub: true },
        })
      })
      gsap.utils.toArray('.selected-work .chapter-heading').forEach((heading) => {
        gsap.fromTo(heading, { opacity: 1 }, {
          opacity: 1,
          scrollTrigger: {
            trigger: '.selected-work', start: 'top 16%', end: 'bottom 70%', pin: heading, pinSpacing: false,
          },
        })
      })
    })
    return () => context.revert()
  }, [location.pathname, locale])

  return (
    <div className="page">
      <div className="bg-orb orb-a" aria-hidden="true" />
      <div className="bg-orb orb-b" aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />
      <header className="topbar container">
        <SiteNav locale={locale} t={t} onToggleLocale={() => setLocale((current) => current === 'en' ? 'zh' : 'en')} />
      </header>
      <main className="container route-main" ref={mainRef} tabIndex="-1">
        <Routes>
          <Route path="/" element={<HomePage t={t} locale={locale} />} />
          <Route path="/now" element={<NowPage t={t} />} />
          <Route path="/output" element={<OutputPage t={t} locale={locale} />} />
          <Route path="/work" element={<Navigate replace to="/output" />} />
          <Route path="/writing" element={<Navigate replace to="/output" />} />
          <Route path="/projects" element={<Navigate replace to="/output" />} />
          <Route path="/course" element={<Navigate replace to="/output" />} />
          <Route path="/lab/roundtable" element={<Navigate replace to="/" />} />
          <Route path="/roundtable" element={<Navigate replace to="/" />} />
          <Route path="/columns/:columnSlug" element={<CollectionView locale={locale} />} />
          <Route path="/topics/where-do-we-go" element={<CollectionView locale={locale} slug="where-do-we-go" topicCopy={t.topic} />} />
          <Route path="/articles/:slug" element={<IndexedArticleRoute locale={locale} />} />
          <Route path="/contact" element={<ContactPage t={t} />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </main>
      <footer className="footer container"><p>© {new Date().getFullYear()} {t.footer.text}</p></footer>
    </div>
  )
}

export default function App() {
  return <BrowserRouter><SiteApp /></BrowserRouter>
}
