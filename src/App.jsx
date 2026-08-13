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
import './redesign.css'
import CollectionView from './components/CollectionView'
import BrandMark from './components/BrandMark'
import SiteNav from './components/SiteNav'
import SocialIcon from './components/SocialIcon'
import AboutPage from './pages/AboutPage'
import ArticlePage from './pages/ArticlePage'
import HomePage from './pages/HomePage'
import NowPage from './pages/NowPage'
import OutputPage from './pages/OutputPage'
import { getInitialLocale, siteContent, socialProfiles } from './data/siteContent'
import { findArticle } from './lib/articles'

gsap.registerPlugin(ScrollTrigger)

function getRouteTitle(pathname, t) {
  if (pathname.startsWith('/articles/')) return null
  if (pathname === '/about') return t.about.title
  if (pathname === '/now') return t.now.title
  if (['/output', '/work', '/projects', '/writing', '/course'].includes(pathname)) return t.output.title
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
    if (!location.hash) return
    const frame = window.requestAnimationFrame(() => {
      document.querySelector(location.hash)?.scrollIntoView?.({ block: 'start', behavior: 'auto' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [location.pathname, location.hash])

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
    if (location.pathname !== '/') return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const context = gsap.context(() => {
      gsap.fromTo(
        '.hero-copy > *',
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 },
      )

      const proofScenes = gsap.utils.toArray('.proof-scene')
      const proofLayers = gsap.utils.toArray('.proof-visual-layer')
      proofScenes.forEach((scene, index) => {
        const layer = proofLayers[index]
        gsap.fromTo(scene, { opacity: 0.28, y: 32 }, {
          opacity: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: { trigger: scene, start: 'top 76%', end: 'center 54%', scrub: true },
        })
        gsap.to(scene, {
          opacity: index === proofScenes.length - 1 ? 1 : 0.28,
          ease: 'none',
          scrollTrigger: { trigger: scene, start: 'center 46%', end: 'bottom 24%', scrub: true },
        })
        if (!layer) return
        gsap.fromTo(layer, { opacity: index === 0 ? 1 : 0, yPercent: 10, scale: 0.96 }, {
          opacity: 1,
          yPercent: 0,
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: scene, start: 'top 76%', end: 'center 54%', scrub: true },
        })
        if (index < proofScenes.length - 1) gsap.to(layer, {
          opacity: 0,
          yPercent: -8,
          scale: 1.025,
          ease: 'none',
          scrollTrigger: { trigger: scene, start: 'center 46%', end: 'bottom 24%', scrub: true },
        })
      })

      const orbitCounter = document.querySelector('.orbit-counter span')
      gsap.to('.project-orbit', {
        rotateY: -240,
        ease: 'none',
        scrollTrigger: {
          trigger: '.selected-work',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self) => {
            if (orbitCounter) orbitCounter.textContent = String(Math.min(3, Math.round(self.progress * 2) + 1)).padStart(2, '0')
          },
        },
      })
      gsap.fromTo('.orbit-axis span', { scaleX: 1 }, {
        scaleX: 3,
        ease: 'none',
        scrollTrigger: { trigger: '.selected-work', start: 'top top', end: 'bottom bottom', scrub: 1 },
      })

      gsap.utils.toArray('.writing-stack > a').forEach((article) => {
        gsap.fromTo(article, { scale: 0.94, opacity: 0.58 }, {
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: article, start: 'top 92%', end: 'top 26%', scrub: true },
        })
      })

      gsap.to('.cta-expansion-surface', {
        clipPath: 'circle(78% at 50% 50%)',
        ease: 'none',
        scrollTrigger: { trigger: '.collaboration-cta', start: 'top top', end: 'bottom bottom', scrub: 1 },
      })
      gsap.to('.cta-expansion-copy', {
        opacity: 1,
        y: 0,
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.collaboration-cta', start: 'top -20%', end: 'bottom 35%', scrub: 1 },
      })
    })
    return () => context.revert()
  }, [location.pathname, locale])

  return (
    <div className={`page${location.pathname === '/' ? ' home-route' : ''}`}>
      <div className="bg-orb orb-a" aria-hidden="true" />
      <div className="bg-orb orb-b" aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />
      <header className="topbar container">
        <SiteNav locale={locale} t={t} onToggleLocale={() => setLocale((current) => current === 'en' ? 'zh' : 'en')} />
      </header>
      <main className="container route-main" ref={mainRef} tabIndex="-1">
        <Routes>
          <Route path="/" element={<HomePage t={t} locale={locale} />} />
          <Route path="/about" element={<AboutPage t={t} locale={locale} />} />
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
          <Route path="/contact" element={<Navigate replace to="/about#contact" />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </main>
      <footer className="footer container">
        <div>
          <BrandMark
            className="footer-brand-mark"
            label={`${t.common.brand || 'LUOCHEN'} · ${t.nav.home}`}
          />
          <p>© {new Date().getFullYear()} {t.footer.text}</p>
        </div>
        <nav aria-label={t.common.primaryNav}>
          <a href="https://github.com/luochen211" target="_blank" rel="noreferrer">GitHub</a>
          <a className="social-link" href={socialProfiles.xiaohongshu} target="_blank" rel="noreferrer"><SocialIcon name="xiaohongshu" />{locale === 'zh' ? '小红书 · 300 粉丝' : 'REDnote · 300'}</a>
          <a className="social-link" href={socialProfiles.douyin} target="_blank" rel="noreferrer"><SocialIcon name="douyin" />{locale === 'zh' ? '抖音 · 1000 粉丝' : 'Douyin · 1,000'}</a>
          <a className="social-link" href={socialProfiles.x} target="_blank" rel="noreferrer"><SocialIcon name="x" />@luochenkafei</a>
          <a href="mailto:cuidong111@gmail.com">Email</a>
          <a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Top</a>
        </nav>
      </footer>
    </div>
  )
}

export default function App() {
  return <BrowserRouter><SiteApp /></BrowserRouter>
}
