import { Link } from 'react-router-dom'
import { articleIndex, projects } from '../data/siteData'

function Hero({ t }) {
  return (
    <section className="focused-hero home-focused-hero">
      <div className="focused-hero-copy">
        <p className="purpose-label">{t.homeUi.kicker}</p>
        <h1>{t.home.title}</h1>
        <p className="hero-declaration">{t.homeUi.belief}</p>
        <p className="hero-intro">{t.hero.intro}</p>
        <div className="hero-actions">
          <Link className="btn primary" to="/work">{t.homeUi.view}</Link>
          <Link className="btn ghost" to="/contact">{t.homeUi.contact}</Link>
        </div>
      </div>
      <figure className="focused-portrait media-frame">
        <img src="/头像111.jpg" alt={t.hero.avatarAlt} width="940" height="938" />
        <figcaption>{t.homeUi.role}</figcaption>
      </figure>
    </section>
  )
}

function ProofGrid({ t, items }) {
  return (
    <section className="chapter home-proof-chapter">
      <div className="chapter-heading">
        <h2>{t.home.proofTitle}</h2>
      </div>
      <div className="focused-proof-grid">
        {items.map((item) => (
          <article className="focused-proof-item" data-testid="proof-item" key={item.title}>
            <p>{item.label}</p>
            <h3>{item.title}</h3>
            <span>{item.text}</span>
          </article>
        ))}
      </div>
    </section>
  )
}

function SelectedWork({ t }) {
  const work = t.projects.list || projects
  return (
    <section className="chapter selected-work">
      <div className="chapter-heading sticky-chapter-title">
        <h2>{t.home.workTitle}</h2>
        <Link to="/work">{t.nav.work} ↗</Link>
      </div>
      <div className="selected-work-list">
        {work.slice(0, 3).map((project) => (
          <article className="selected-work-card" key={project.name}>
            <p>{project.period}</p>
            <h3>{project.name}</h3>
            <span>{project.role}</span>
            <ul>{project.points.slice(0, 2).map((point) => <li key={point}>{point}</li>)}</ul>
          </article>
        ))}
      </div>
    </section>
  )
}

function SelectedWriting({ t }) {
  const latest = [...articleIndex].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4)
  return (
    <section className="chapter selected-writing">
      <div className="chapter-heading">
        <h2>{t.home.writingTitle}</h2>
        <Link to="/writing">{t.nav.writing} ↗</Link>
      </div>
      <div className="writing-accordion">
        {latest.map((article) => (
          <Link to={article.href} key={article.slug}>
            <time>{article.date}</time>
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
      <h2>{t.home.contactTitle}</h2>
      <Link className="btn cta-button" to="/contact">{t.contact.email} ↗</Link>
    </section>
  )
}

export default function HomePage({ t }) {
  const proof = (t.home.proof || t.homeUi.proofAssets).slice(0, 3)
  return (
    <div className="focused-page home-redesign">
      <Hero t={t} />
      <ProofGrid t={t} items={proof} />
      <SelectedWork t={t} />
      <SelectedWriting t={t} />
      <CollaborationCta t={t} />
    </div>
  )
}
