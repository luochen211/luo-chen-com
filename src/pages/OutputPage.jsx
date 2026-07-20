import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProjectShowcase } from '../data/projectShowcase'
import { localizeArticles, localizeColumns } from '../data/siteContent'
import { articleIndex, getPublicColumns } from '../data/siteData'

const outputTypes = {
  zh: { all: '全部', projects: '项目', writing: '写作', talks: '分享' },
  en: { all: 'All', projects: 'Projects', writing: 'Writing', talks: 'Talks' },
}

export default function OutputPage({ t, locale = 'zh' }) {
  const [activeType, setActiveType] = useState('all')
  const projects = useMemo(() => getProjectShowcase(locale), [locale])
  const columns = localizeColumns(getPublicColumns(), locale)
  const latest = localizeArticles(
    [...articleIndex].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8),
    locale,
  )
  const types = outputTypes[locale]
  const show = (type) => activeType === 'all' || activeType === type

  return (
    <section className="output-page">
      <header className="output-cover output-slide">
        <div>
          <p className="purpose-label">{t.output.eyebrow}</p>
          <h1>{t.output.title}</h1>
          <p className="output-intro">{t.output.intro}</p>
        </div>
        <div className="output-cover-index" aria-hidden="true">
          <span>01</span><span>04</span>
        </div>
        <nav className="output-filter" aria-label={t.output.filterLabel}>
          {Object.entries(types).map(([key, label]) => (
            <button
              className={activeType === key ? 'active' : ''}
              key={key}
              onClick={() => setActiveType(key)}
              type="button"
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      {show('projects') && (
        <section className="output-chapter output-projects" id="projects">
          <header className="output-chapter-heading">
            <p>01 / {t.output.projectsLabel}</p>
            <h2>{t.output.projectsTitle}</h2>
          </header>
          <div className="output-project-list">
            {projects.map((project, index) => (
              <article className="output-project" key={project.id}>
                <div className="output-project-number">{String(index + 1).padStart(2, '0')}</div>
                <div className="output-project-copy">
                  <p>{project.role} · {project.year}</p>
                  <h3>{project.name}</h3>
                  <p>{project.summary}</p>
                </div>
                <div className="output-project-result">
                  <span>{project.status}</span>
                  <p>{project.outcome}</p>
                  <div>
                    {project.liveHref && <a href={project.liveHref} target="_blank" rel="noreferrer">{t.output.viewLive} ↗</a>}
                    <a href={project.href} target="_blank" rel="noreferrer">GitHub ↗</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {show('writing') && (
        <section className="output-chapter output-writing" id="writing">
          <header className="output-chapter-heading">
            <p>02 / {t.output.writingLabel}</p>
            <h2>{t.output.writingTitle}</h2>
          </header>
          <div className="output-column-strip">
            {columns.map((column) => (
              <Link to={column.href} key={column.slug}>
                <span>{column.status}</span><h3>{column.title}</h3><p>{column.summary}</p>
              </Link>
            ))}
          </div>
          <div className="latest-writing-list output-writing-list">
            {latest.map((article) => (
              <Link to={article.href} key={article.slug}>
                <div className="article-list-meta"><time>{article.date}</time><span className="article-column">{article.column.title}</span></div>
                <h3>{article.title}</h3><p>{article.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {show('talks') && (
        <section className="output-deck output-slide" id="talks">
          <div className="output-deck-number">03</div>
          <div>
            <p className="purpose-label">{t.output.talksLabel}</p>
            <h2>{t.course.archive.title}</h2>
            <p>{t.course.archive.description}</p>
            <a className="output-deck-link" href={t.course.archive.href} target="_blank" rel="noreferrer">{t.course.archive.action} ↗</a>
          </div>
        </section>
      )}

      <section className="output-end output-slide">
        <p>04 / {t.output.endLabel}</p>
        <h2>{t.output.endTitle}</h2>
        <Link to="/contact">{t.output.contactAction} →</Link>
      </section>
    </section>
  )
}
