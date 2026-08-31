import { useState } from 'react'
import { Link } from 'react-router-dom'
import { localizeArticles } from '../data/siteContent'
import { articleIndex } from '../data/siteData'
import { getProjectShowcase } from '../data/projectShowcase'

const selectedProjectMedia = {
  imaging: '/media/imaging-architecture.png',
  logistics: '/media/logistics-working-sheet.png',
  career: '/media/career-ops-architecture.png',
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

function ProofGrid({ t, items }) {
  const evidenceArt = [
    <div className="proof-evidence-art proof-evidence-terminal" key="terminal">
      <div className="evidence-window-bar"><i /><i /><i /><span>agent-cli / test-run</span></div>
      <div className="evidence-code-lines"><b>$</b><span /><span /><span /><span /><span /><strong>PASS · 14 checks</strong></div>
    </div>,
    <div className="proof-evidence-art proof-evidence-writing" key="writing">
      <div className="evidence-page-index">PUBLIC / 026</div>
      <div className="evidence-writing-lines"><i /><i /><i /><i /><i /><b /></div>
      <time>2026.08.13</time>
    </div>,
    <div className="proof-evidence-art proof-evidence-pipeline" key="pipeline">
      <div><b>ORDER</b><span>01</span></div><i>→</i><div><b>PAYMENT</b><span>02</span></div><i>→</i><div><b>DELIVERY</b><span>03</span></div>
    </div>,
    <div className="proof-evidence-art proof-evidence-checklist" key="checklist">
      <div><b>01</b><span>需求边界</span><i>✓</i></div>
      <div><b>02</b><span>验收条件</span><i>✓</i></div>
      <div><b>03</b><span>上线验证</span><i>✓</i></div>
      <strong>READY TO SHIP</strong>
    </div>,
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
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{item.label}</p>
                <i />
                {evidenceArt[index]}
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

function SelectedWork({ t, locale }) {
  const work = getProjectShowcase(locale).filter((project) => ['imaging', 'logistics', 'career'].includes(project.id))
  return (
    <section className="chapter selected-work">
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
                style={{ '--project-index': index }}
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
                  <a href={project.href} target="_blank" rel="noreferrer">{locale === 'zh' ? '查看项目' : 'Inspect project'} ↗</a>
                </div>
              </article>
            ))}
          </div>
          <div className="orbit-axis" aria-hidden="true"><span /></div>
          <p className="orbit-counter" aria-hidden="true"><span>01</span> / 03</p>
        </div>
      </div>
    </section>
  )
}

function SelectedWriting({ t, locale }) {
  const latest = localizeArticles(
    [...articleIndex].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4),
    locale,
  )
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
  return (
    <div className="focused-page home-redesign">
      <Hero t={t} locale={locale} />
      <ProofGrid t={t} items={proof} />
      <SelectedWork t={t} locale={locale} />
      <SelectedWriting t={t} locale={locale} />
      <CollaborationCta t={t} />
    </div>
  )
}
