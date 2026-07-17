import { useMemo, useState } from 'react'
import { getProjectShowcase, projectFilters } from '../data/projectShowcase'

export default function WorkPage({ t, locale = 'zh' }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const work = getProjectShowcase(locale)
  const filters = projectFilters[locale]
  const visibleWork = useMemo(
    () => activeFilter === 'all' ? work : work.filter((project) => project.category === activeFilter),
    [activeFilter, work],
  )
  return (
    <section className="focused-page archive-page work-archive">
      <header className="route-hero">
        <p className="purpose-label">{t.work.eyebrow}</p>
        <h1>{t.work.title}</h1>
        <p>{t.work.intro}</p>
      </header>
      <div className="work-filter" aria-label={locale === 'zh' ? '项目类型筛选' : 'Project filters'}>
        {Object.entries(filters).map(([key, label]) => (
          <button className={activeFilter === key ? 'active' : ''} key={key} type="button" onClick={() => setActiveFilter(key)}>{label}</button>
        ))}
      </div>
      <div className="project-archive-grid" aria-live="polite">
        {visibleWork.map((project, index) => (
          <article className={`archive-project ${project.featured ? 'featured' : ''}`} key={project.id}>
            <header>
              <div className="project-index"><span>{String(index + 1).padStart(2, '0')}</span><time>{project.year}</time></div>
              <p>{project.role}</p>
              <h2>{project.name}</h2>
            </header>
            <p className="project-summary">{project.summary}</p>
            <p className="project-outcome">{project.outcome}</p>
            <ul className="project-tech">{project.tech.map((item) => <li key={item}>{item}</li>)}</ul>
            <footer className="project-actions">
              <details>
                <summary>{t.work.details}</summary>
              <ul>{project.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
              </details>
              <div>
                {project.liveHref && <a href={project.liveHref} target="_blank" rel="noreferrer">{locale === 'zh' ? '在线体验' : 'Live product'} ↗</a>}
                <a href={project.href} target="_blank" rel="noreferrer">GitHub ↗</a>
              </div>
            </footer>
            <span className="project-status">{project.status}</span>
          </article>
        ))}
      </div>
    </section>
  )
}
