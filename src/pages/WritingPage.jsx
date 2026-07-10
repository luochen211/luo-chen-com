import { Link } from 'react-router-dom'
import { localizeColumns } from '../data/siteContent'
import { articleIndex, getPublicColumns } from '../data/siteData'

export default function WritingPage({ t, locale = 'zh' }) {
  const columns = localizeColumns(getPublicColumns(), locale)
  const latest = [...articleIndex].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8)
  return (
    <section className="focused-page archive-page writing-page">
      <header className="route-hero">
        <p className="purpose-label">{t.writing.eyebrow}</p>
        <h1>{t.writing.title}</h1>
      </header>

      <section className="writing-index chapter">
        <div className="chapter-heading"><h2>{t.writing.collections}</h2></div>
        <div className="column-index-grid">
          {columns.map((column) => (
            <Link className="column-index-card" to={column.href} key={column.slug}>
              <p>{column.status}</p><h3>{column.title}</h3><span>{column.summary}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="latest-writing chapter">
        <div className="chapter-heading"><h2>{t.writing.latest}</h2></div>
        <div className="latest-writing-list">
          {latest.map((article) => (
            <Link to={article.href} key={article.slug}>
              <time>{article.date}</time><h3>{article.title}</h3><p>{article.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="writing-paths chapter">
        <a href={t.course.archive.href} target="_blank" rel="noreferrer">
          <p>{t.writing.talks}</p><h2>{t.course.archive.title}</h2><span>{t.course.archive.description}</span>
        </a>
        <Link to="/lab/roundtable">
          <p>{t.writing.products}</p><h2>{t.lab.title}</h2><span>{t.lab.intro}</span>
        </Link>
      </section>
    </section>
  )
}
