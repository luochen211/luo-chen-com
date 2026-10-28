import { useState } from 'react'
import { Link } from 'react-router-dom'
import { localizeArticles } from '../data/siteContent'
import { articleIndex } from '../data/siteData'
import { getProjectShowcase } from '../data/projectShowcase'

const selectedProjectIds = ['scholar', 'imaging', 'logistics', 'career']

const selectedProjectMedia = {
  scholar: '/media/super-scholar.jpg',
  imaging: '/media/imaging-dashboard.jpg',
  logistics: '/media/logistics-working-sheet.png',
  career: '/media/career-ops-contributor.jpg',
}

function Hero({ t, locale }) {
  const isEnglish = locale === 'en'
  const [portraitRevealed, setPortraitRevealed] = useState(false)
  return (
    <section className="focused-hero home-focused-hero">
      <div className="hero-sticky-frame">
        <button
          aria-label={isEnglish ? 'Toggle portrait focus' : '切换头像清晰度'}
          aria-pressed={portraitRevealed}
          className={`hero-portrait-background${portraitRevealed ? ' is-revealed' : ''}`}
          onClick={() => setPortraitRevealed((current) => !current)}
          type="button"
        >
          <img src="/头像111.jpg" alt={t.hero.avatarAlt} width="940" height="938" />
          <div className="hero-portrait-scrim" aria-hidden="true" />
          <div className="hero-portrait-haze" aria-hidden="true" />
        </button>
        <div className="hero-copy">
          <p className="hero-overline">{t.homeUi.name} / {t.homeUi.role}</p>
          <h1>
            <span>{isEnglish ? 'Complex problems,' : '把复杂问题'}</span>{isEnglish ? ' ' : null}
            <span>{isEnglish ? 'reliably delivered.' : '变成可靠交付。'}</span>
          </h1>
          <p className="hero-intro">{t.hero.intro}</p>
          <div className="hero-actions">
            <Link className="btn primary" to="/output">{t.homeUi.view}</Link>
            <Link className="btn ghost" to="/about#contact">{t.homeUi.contact}</Link>
          </div>
        </div>
        <p className="portrait-focus-instruction" aria-hidden="true">
          <span />{isEnglish ? 'Portrait fragment · hover to reveal' : '头像局部 · 移入显影'}
        </p>
        <div className="hero-marquee" aria-hidden="true">
          <div className="hero-marquee-track">
            {[0, 1].map((loop) => (
              <span key={loop}>Agent Harness <i /> Full-stack Delivery <i /> Open Source <i /> Public Writing <i /></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ProofGrid({ t, items, locale, articles, projects }) {
  const isEnglish = locale === 'en'
  const delivered = selectedProjectIds.map((id) => projects.find((project) => project.id === id)).filter(Boolean)
  const evidence = [
    {
      caption: 'github.com/santifer/career-ops',
      body: <img src="/media/career-ops-contributor.jpg" alt="" loading="lazy" />,
    },
    {
      caption: 'luo-chen.com/output',
      body: (
        <ol className="evidence-list">
          {articles.map((article) => (
            <li key={article.slug}>
              <time>{article.date}</time>
              <strong>{article.title}</strong>
              <span>{article.column.title}</span>
            </li>
          ))}
        </ol>
      ),
    },
    {
      caption: isEnglish ? 'Dedao Imaging · operations console' : '得到影像 · 运营后台',
      body: <img src="/media/imaging-dashboard.jpg" alt="" loading="lazy" />,
    },
    {
      caption: isEnglish ? 'Delivery log' : '交付记录',
      body: (
        <ol className="evidence-list evidence-delivery">
          {delivered.map((project) => (
            <li key={project.id}>
              <time>{project.year}</time>
              <strong>{project.name}</strong>
              <span>{project.status} <i aria-hidden="true">✓</i></span>
            </li>
          ))}
        </ol>
      ),
    },
  ]
  return (
    <section className="chapter home-proof-chapter">
      <div className="proof-scene-shell">
        <div className="proof-scene-stage">
          <div className="chapter-heading editorial-heading">
            <p>{t.homeUi.assets}</p>
            <h2>{t.home.proofTitle}</h2>
          </div>
          <div className="proof-scene-visual" aria-hidden="true">
            {items.map((item, index) => (
              <div className={`proof-visual-layer proof-visual-layer-${index + 1}`} data-scene={index} key={item.title}>
                <div className="evidence-window-bar">
                  <i /><i /><i />
                  <span>{evidence[index]?.caption}</span>
                  <b>{String(index + 1).padStart(2, '0')} · {item.label}</b>
                </div>
                <div className="evidence-body">{evidence[index]?.body}</div>
              </div>
            ))}
          </div>
          <p className="proof-scroll-note">
            SCROLL <span aria-hidden="true">↓</span>
          </p>
        </div>
        <div className="proof-scene-list">
          {items.map((item, index) => (
            <article className="proof-scene proof-card" data-scene={index} data-testid="proof-item" key={item.title}>
              <p>{item.label}</p>
              <h3>{item.title}</h3>
              <span>{item.text}</span>
              <b aria-hidden="true">{String(index + 1).padStart(2, '0')}</b>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Showreel({ t }) {
  return (
    <section className="chapter home-showreel">
      <div className="chapter-heading">
        <p>{t.homeUi.showreel}</p>
        <h2>{t.home.showreelTitle}</h2>
      </div>
      <video
        className="showreel-video"
        src="/media/showreel.mp4"
        poster="/media/showreel-poster.jpg"
        controls
        playsInline
        preload="none"
        aria-label={t.home.showreelTitle}
      />
    </section>
  )
}

function ProjectLinks({ project, locale }) {
  return (
    <span className="project-links">
      {project.liveHref && <a href={project.liveHref} target="_blank" rel="noreferrer">{locale === 'zh' ? '在线体验' : 'Live product'} ↗</a>}
      {project.href && <a href={project.href} target="_blank" rel="noreferrer">{locale === 'zh' ? '查看项目' : 'Inspect project'} ↗</a>}
    </span>
  )
}

function SelectedWork({ t, locale, projects }) {
  const work = selectedProjectIds.map((id) => projects.find((project) => project.id === id)).filter(Boolean)
  return (
    <section className="chapter selected-work" style={{ '--project-count': work.length }}>
      <div className="project-orbit-stage">
        <div className="chapter-heading sticky-chapter-title">
          <p>{locale === 'zh' ? '真实交付' : 'Selected evidence'}</p>
          <h2>{t.home.workTitle}</h2>
          <Link to="/output">{t.nav.output} →</Link>
        </div>
        <div className="project-orbit-viewport">
          <div className="project-orbit" role="list">
            {work.map((project, index) => (
              <article
                className="selected-work-card project-orbit-card"
                key={project.name}
                role="listitem"
                style={{ '--project-index': index, '--project-angle': `${360 / work.length}deg` }}
              >
                <div className="project-visual">
                  <img src={selectedProjectMedia[project.id]} alt="" loading="lazy" />
                </div>
                <div className="project-card-copy">
                  <p>{project.status} · {project.year}</p>
                  <h3>{project.name}</h3>
                  <span>{project.role}</span>
                  <p>{project.summary}</p>
                  <strong>{project.outcome}</strong>
                  <ProjectLinks project={project} locale={locale} />
                </div>
              </article>
            ))}
          </div>
          <div className="orbit-axis" aria-hidden="true"><span /></div>
          <p className="orbit-counter" aria-hidden="true"><span>01</span> / {String(work.length).padStart(2, '0')}</p>
        </div>
      </div>
    </section>
  )
}

function MoreWork({ t, locale, projects }) {
  const more = projects.filter((project) => !selectedProjectIds.includes(project.id))
  return (
    <section className="chapter more-work">
      <div className="chapter-heading">
        <p>{locale === 'zh' ? '更多作品' : 'More work'}</p>
        <h2>{locale === 'zh' ? '产品、系统与实验' : 'Products, systems, experiments'}</h2>
        <Link to="/output">{t.nav.output} →</Link>
      </div>
      <ul className="more-work-list">
        {more.map((project) => (
          <li key={project.id}>
            <span className="more-work-name">{project.name}</span>
            <span className="more-work-meta">{project.role} · {project.status}</span>
            <span className="more-work-tech">{project.tech.slice(0, 3).join(' · ')}</span>
            <ProjectLinks project={project} locale={locale} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function SelectedWriting({ t, locale, latest }) {
  return (
    <section className="chapter selected-writing">
      <div className="chapter-heading">
        <p>{locale === 'zh' ? '经验复利' : 'Experience, compounded'}</p>
        <h2>{t.home.writingTitle}</h2>
        <Link to="/output">{t.nav.output} →</Link>
      </div>
      <div className="writing-accordion writing-stack">
        {latest.map((article, index) => (
          <Link to={article.href} key={article.slug} style={{ '--article-index': index }}>
            <span className="writing-stack-index" aria-hidden="true">0{index + 1}</span>
            <div className="article-list-meta">
              <time>{article.date}</time>
              <span className="article-column">{article.column.title}</span>
            </div>
            <h3>{article.title}</h3>
            <p>{article.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

function CollaborationCta({ t }) {
  return (
    <section className="collaboration-cta">
      <div className="cta-expansion-sticky">
        <div className="cta-expansion-surface">
          <div className="cta-expansion-copy">
            <p>{t.contact.intro}</p>
            <h2>{t.home.contactTitle}</h2>
            <Link className="btn cta-button" to="/about#contact">{t.contact.email} ↗</Link>
          </div>
          <span className="cta-expansion-ring" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}

export default function HomePage({ t, locale = 'zh' }) {
  const proof = (t.home.proof || t.homeUi.proofAssets).slice(0, 4)
  const projects = getProjectShowcase(locale)
  const latest = localizeArticles(
    [...articleIndex].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4),
    locale,
  )
  return (
    <div className="focused-page home-redesign">
      <Hero t={t} locale={locale} />
      <Showreel t={t} />
      <ProofGrid t={t} items={proof} locale={locale} articles={latest} projects={projects} />
      <SelectedWork t={t} locale={locale} projects={projects} />
      <MoreWork t={t} locale={locale} projects={projects} />
      <SelectedWriting t={t} locale={locale} latest={latest} />
      <CollaborationCta t={t} />
    </div>
  )
}
