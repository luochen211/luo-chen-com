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
  return (
    <section className="focused-hero home-focused-hero">
      <div className="hero-copy">
        <p className="hero-overline">{t.homeUi.name} / {t.homeUi.role}</p>
        <h1>
          <span>{isEnglish ? 'Complex problems,' : '把复杂问题'}</span>
          <span>{isEnglish ? 'reliably delivered.' : '变成可靠交付。'}</span>
        </h1>
        <p className="hero-intro">{t.hero.intro}</p>
        <div className="hero-actions">
          <Link className="btn primary" to="/output">{t.homeUi.view}</Link>
          <Link className="btn ghost" to="/contact">{t.homeUi.contact}</Link>
        </div>
      </div>
      <figure className="hero-portrait-panel">
        <img src="/头像111.jpg" alt={t.hero.avatarAlt} width="940" height="938" />
        <figcaption><span>{t.homeUi.belief}</span><small>LUOCHEN / 2026</small></figcaption>
      </figure>
      <div className="hero-marquee" aria-hidden="true">
        <div className="hero-marquee-track">
          {[0, 1].map((loop) => (
            <span key={loop}>Agent Harness <i /> Full-stack Delivery <i /> Open Source <i /> Public Writing <i /></span>
          ))}
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
      <div className="focused-proof-grid">
        {items.map((item, index) => (
          <article className={`focused-proof-item proof-card proof-card-${index + 1}`} data-testid="proof-item" key={item.title}>
            <p>{item.label}</p>
            <h3>{item.title}</h3>
            <span>{item.text}</span>
            <b aria-hidden="true">{String(index + 1).padStart(2, '0')}</b>
          </article>
        ))}
      </div>
    </section>
  )
}

function SelectedWork({ t, locale }) {
  const work = getProjectShowcase(locale).filter((project) => ['imaging', 'logistics', 'career'].includes(project.id))
  return (
    <section className="chapter selected-work">
      <div className="chapter-heading sticky-chapter-title">
        <p>{locale === 'zh' ? '真实交付' : 'Selected evidence'}</p>
        <h2>{t.home.workTitle}</h2>
        <Link to="/output">{t.nav.output} →</Link>
      </div>
      <div className="selected-work-list">
        {work.map((project) => (
          <article className="selected-work-card project-stack-card" key={project.name}>
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
      <div className="writing-accordion">
        {latest.map((article) => (
          <Link to={article.href} key={article.slug}>
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
      <p>{t.contact.intro}</p>
      <h2>{t.home.contactTitle}</h2>
      <Link className="btn cta-button" to="/contact">{t.contact.email} ↗</Link>
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
