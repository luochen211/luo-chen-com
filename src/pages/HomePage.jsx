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
  const evidenceLoop = isEnglish
    ? ['Imaging system · production delivery', 'BEST GROUP · phase one shipped', 'career-ops · maintained in public', 'Agent Harness · active build']
    : ['得到影像 · 生产交付', 'BEST GROUP · 一期交付', 'career-ops · 持续维护', 'Agent Harness · 公开建造']
  return (
    <section className="focused-hero home-focused-hero">
      <div className="hero-sticky-frame">
        <div className="hero-portrait-background" aria-hidden="true">
          <img src="/头像111.jpg" alt="" width="940" height="938" />
          <div className="hero-portrait-scrim" />
          <div className="hero-portrait-haze" />
        </div>
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
        <div className="hero-marquee" aria-hidden="true">
          <div className="hero-marquee-track">
            {[0, 1].map((loop) => (
              <span key={loop}>
                {evidenceLoop.map((item) => <span className="hero-marquee-item" key={`${loop}-${item}`}>{item}<i /></span>)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ProofGrid({ t, items }) {
  return (
    <section className="chapter home-proof-chapter">
      <div className="chapter-heading editorial-heading">
        <p>{t.homeUi.assets}</p>
        <h2>{t.home.proofTitle}</h2>
      </div>
      <div className="proof-bento">
        {items.map((item) => (
          <article className="proof-bento-card" data-testid="proof-item" key={item.title}>
            <p>{item.label}</p>
            <h3>{item.title}</h3>
            <span>{item.text}</span>
            <i aria-hidden="true" />
          </article>
        ))}
      </div>
    </section>
  )
}

function SelectedWork({ t, locale }) {
  const work = getProjectShowcase(locale).filter((project) => ['imaging', 'logistics', 'career'].includes(project.id))
  const [activeProject, setActiveProject] = useState(0)
  const selected = work[activeProject]
  const moveSelection = (direction) => {
    setActiveProject((current) => (current + direction + work.length) % work.length)
  }
  return (
    <section className="chapter selected-work">
      <div className="chapter-heading sticky-chapter-title">
        <p>{locale === 'zh' ? '真实交付' : 'Selected evidence'}</p>
        <h2>{t.home.workTitle}</h2>
        <Link to="/output">{t.nav.output} →</Link>
      </div>
      <div className="project-accordion" role="list">
        {work.map((project, index) => (
          <article
            className={`project-accordion-card${activeProject === index ? ' is-active' : ''}`}
            key={project.name}
            onFocus={() => setActiveProject(index)}
            onMouseEnter={() => setActiveProject(index)}
            role="listitem"
          >
            <div className="project-accordion-image">
              <img src={selectedProjectMedia[project.id]} alt="" loading="lazy" />
            </div>
            <button
              aria-pressed={activeProject === index}
              onClick={() => setActiveProject(index)}
              type="button"
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{project.name}</strong>
            </button>
            <div className="project-accordion-copy">
              <p>{project.status} · {project.year}</p>
              <span>{project.role}</span>
              <a href={project.href} target="_blank" rel="noreferrer">{locale === 'zh' ? '查看项目' : 'Inspect project'} ↗</a>
            </div>
          </article>
        ))}
      </div>
      <div className="evidence-carousel" aria-live="polite">
        <div className="evidence-carousel-thumbs" aria-hidden="true">
          {work.map((project, index) => (
            <img className={activeProject === index ? 'is-active' : ''} src={selectedProjectMedia[project.id]} alt="" key={project.id} />
          ))}
        </div>
        <div className="evidence-carousel-copy">
          <p>{locale === 'zh' ? '交付结果' : 'Delivery outcome'}</p>
          <blockquote>{selected.outcome}</blockquote>
          <span>{selected.name}</span>
        </div>
        <div className="evidence-carousel-controls">
          <button aria-label={locale === 'zh' ? '上一个项目' : 'Previous project'} onClick={() => moveSelection(-1)} type="button">←</button>
          <span>{String(activeProject + 1).padStart(2, '0')} / {String(work.length).padStart(2, '0')}</span>
          <button aria-label={locale === 'zh' ? '下一个项目' : 'Next project'} onClick={() => moveSelection(1)} type="button">→</button>
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
