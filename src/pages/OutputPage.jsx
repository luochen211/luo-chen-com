import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProjectShowcase } from '../data/projectShowcase'
import { localizeArticles, localizeColumns } from '../data/siteContent'
import { articleIndex, getPublicColumns } from '../data/siteData'

const outputTypes = {
  zh: { all: '全部', projects: '项目', writing: '写作', talks: '分享' },
  en: { all: 'All', projects: 'Projects', writing: 'Writing', talks: 'Talks' },
}

const projectMedia = {
  imaging: '/media/imaging-architecture.png',
  logistics: '/media/logistics-working-sheet.png',
  career: '/media/career-ops-architecture.png',
  'harness-demo': '/demos/agent-harness/preview.png',
}

export default function OutputPage({ t, locale = 'zh' }) {
  const [activeType, setActiveType] = useState('all')
  const projects = useMemo(() => getProjectShowcase(locale), [locale])
  const selectedIds = ['imaging', 'logistics', 'career', 'harness-demo']
  const selectedProjects = selectedIds.map((id) => projects.find((project) => project.id === id)).filter(Boolean)
  const archivedProjects = projects.filter((project) => !selectedIds.includes(project.id))
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
          <p className="output-overline">{locale === 'zh' ? '产出不是终点，是下一次判断的证据。' : 'Output is evidence for the next decision.'}</p>
          <h1>{t.output.title}</h1>
          <p className="output-intro">{t.output.intro}</p>
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
            <p>{t.output.projectsLabel}</p>
            <h2>{t.output.projectsTitle}</h2>
          </header>
          <div className="output-project-accordion">
            {selectedProjects.map((project) => (
              <article className="output-project output-project-featured" key={project.id}>
                <div className="output-project-media"><img src={projectMedia[project.id]} alt="" loading="lazy" /></div>
                <div className="output-project-copy">
                  <span>{project.status}</span>
                  <h3>{project.name}</h3>
                  <p>{project.summary}</p>
                </div>
                <div className="output-project-result">
                  <p>{project.outcome}</p>
                  <div>
                    {project.liveHref && <a href={project.liveHref} target="_blank" rel="noreferrer">{t.output.viewLive} ↗</a>}
                    <a href={project.href} target="_blank" rel="noreferrer">GitHub ↗</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="output-project-archive">
            {archivedProjects.map((project) => (
              <article className="output-project output-project-compact" key={project.id}>
                <div className="output-project-copy">
                  <span>{project.role} · {project.year}</span>
                  <h3>{project.name}</h3>
                </div>
                <div className="output-project-result">
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
            <p>{t.output.writingLabel}</p>
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
          <div className="output-deck-preview">
            <img src="/slides/decks/agent-harness/lessons-preview.png" alt="" loading="lazy" />
          </div>
          <div>
            <p className="output-deck-kicker">{t.output.talksLabel}</p>
            <h2>{locale === 'zh' ? '从毕业设计到持续接单' : 'From Graduation Project to Continuous Delivery'}</h2>
            <p>{locale === 'zh' ? '一套关于 AI 编程真实交付的 22 页分享：客户、需求、质量和下一次机会。' : 'A 22-page talk on real AI coding delivery: clients, scope, quality, and the next opportunity.'}</p>
            <div className="output-deck-actions">
              <a className="output-deck-link" href="/talks/ai-delivery">{locale === 'zh' ? '打开这场分享' : 'Open this talk'} ↗</a>
              <a className="output-deck-link" href={t.course.archive.href} target="_blank" rel="noreferrer">{t.course.archive.action} ↗</a>
              <a className="output-deck-link output-deck-link-community" href={t.course.archive.communityHref} target="_blank" rel="noreferrer">{t.course.archive.communityAction} ↗</a>
            </div>
          </div>
        </section>
      )}

      <section className="output-end output-slide">
        <p>{t.output.endLabel}</p>
        <h2 aria-label={t.output.endTitle}>
          {locale === 'zh' ? (
            <>
              <span className="output-end-line">下一项 <em>产出</em>，</span>
              <span className="output-end-line">正在 <em>发生</em>。</span>
            </>
          ) : (
            <>
              <span className="output-end-line">The next <em>output</em></span>
              <span className="output-end-line">is already in <em>motion</em>.</span>
            </>
          )}
        </h2>
        <Link to="/about#contact">{t.output.contactAction} →</Link>
      </section>
    </section>
  )
}
