import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  BrowserRouter,
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom'
import './App.css'
import { getInitialLocale, localizeColumns, readerCopy, siteContent } from './data/siteContent'
import {
  articleIndex,
  expertOptions,
  findColumn,
  getPublicColumns,
} from './data/siteData'

gsap.registerPlugin(ScrollTrigger)


function findArticle(slug) {
  return articleIndex.find((article) => article.slug === slug)
}

function getSeriesArticles(article) {
  if (!article) return []
  return articleIndex.filter(
    (item) => item.column.slug === article.column.slug && item.series.slug === article.series.slug,
  )
}

function getLinkedArticles(slugs = []) {
  return slugs.map((slug) => findArticle(slug)).filter(Boolean)
}

function RoundtablePage({ t }) {
  const [topic, setTopic] = useState(t.lab.examples[0])
  const [isTopicEdited, setIsTopicEdited] = useState(false)
  const [selected, setSelected] = useState(['munger', 'kahneman', 'dalio'])
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const selectedExperts = expertOptions.filter((expert) => selected.includes(expert.id))

  useEffect(() => {
    if (!isTopicEdited) setTopic(t.lab.examples[0])
  }, [isTopicEdited, t.lab.examples])

  function toggleExpert(id) {
    setSelected((current) => {
      if (current.includes(id)) {
        return current.length === 1 ? current : current.filter((item) => item !== id)
      }
      return [...current, id]
    })
  }

  async function runRoundtable(event) {
    event.preventDefault()
    setError('')
    setResult(null)

    if (!topic.trim()) {
      setError(t.lab.empty)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/roundtable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, experts: selectedExperts }),
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.error || t.lab.error)
      }

      setResult(payload)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="roundtable-page">
      <div className="roundtable-hero reveal">
        <p className="eyebrow">{t.lab.eyebrow}</p>
        <h1>{t.lab.title}</h1>
        <p>{t.lab.intro}</p>
      </div>

      <form className="roundtable-workspace reveal" onSubmit={runRoundtable}>
        <div className="roundtable-input">
          <label htmlFor="topic">{t.lab.topic}</label>
          <textarea
            id="topic"
            value={topic}
            onChange={(event) => {
              setTopic(event.target.value)
              setIsTopicEdited(true)
            }}
            rows="7"
            placeholder={t.lab.placeholder}
          />
          <div className="example-row">
            {t.lab.examples.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => {
                  setTopic(example)
                  setIsTopicEdited(true)
                }}
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <div className="expert-picker">
          <div className="picker-head">
            <span>{t.lab.choose}</span>
            <strong>{selected.length} {t.lab.expertUnit}</strong>
          </div>
          <div className="expert-grid">
            {t.lab.experts.map((expert) => {
              const active = selected.includes(expert.id)
              return (
                <button
                  className={`expert-tile ${active ? 'active' : ''}`}
                  key={expert.id}
                  type="button"
                  onClick={() => toggleExpert(expert.id)}
                  aria-pressed={active}
                >
                  <span>{expert.name}</span>
                  <strong>{expert.title}</strong>
                  <small>{expert.stance}</small>
                </button>
              )
            })}
          </div>
          <button className="btn primary roundtable-submit" type="submit" disabled={isLoading}>
            {isLoading ? t.lab.loading : t.lab.submit}
          </button>
          {error ? <p className="roundtable-error">{error}</p> : null}
        </div>
      </form>

      {isLoading ? (
        <div className="roundtable-loading reveal">
          <span />
          <p>{t.lab.loadingDetail}</p>
        </div>
      ) : null}

      {result ? (
        <div className="roundtable-result reveal">
          <div className="section-head">
            <p>{t.lab.discussion}</p>
            <h2>{result.topic}</h2>
          </div>
          <div className="turn-list">
            {result.turns?.map((turn, index) => (
              <article className="turn-item" key={`${turn.expert}-${index}`}>
                <div>
                  <span>{turn.expert}</span>
                  <strong>{turn.angle}</strong>
                </div>
                <p>{turn.argument}</p>
              </article>
            ))}
          </div>

          <div className="judge-panel">
            <p>{t.lab.summary}</p>
            <h3>{result.judge?.verdict}</h3>
            <div className="judge-grid">
              <ResultList title={t.lab.insights} items={result.judge?.insights} />
              <ResultList title={t.lab.conflicts} items={result.judge?.conflicts} />
              <ResultList title={t.lab.blindSpots} items={result.judge?.blindSpots} />
              <ResultList title={t.lab.actions} items={result.judge?.actions} />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

function ResultList({ title, items = [] }) {
  return (
    <div>
      <h4>{title}</h4>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

function HomePage({ t, locale }) {
  const latestArticles = [...articleIndex].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4)
  const columns = localizeColumns(getPublicColumns(), locale)
  const capabilities = [
    {
      title: t.summary.narrativeTitle,
      items: t.summary.narrative,
      code: 'SPEC.001',
    },
    {
      title: t.summary.principlesTitle,
      items: t.summary.principles,
      code: 'RULES',
    },
    {
      title: t.stack.focusTitle,
      items: t.stack.focus,
      code: 'FOCUS',
    },
    {
      title: t.summary.workflowTitle,
      items: t.summary.workflow,
      code: 'FLOW',
      ordered: true,
    },
  ]
  const { signalRows, proofAssets, buildLog } = t.homeUi

  return (
    <div className="home-flow signal-home">
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="eyebrow hero-kicker">{t.homeUi.kicker}</p>
          <h1>{t.homeUi.name}</h1>
          <p className="home-hero-line">{t.homeUi.role}</p>
          <p className="home-hero-belief">{t.homeUi.belief}</p>
          <p className="intro">{t.hero.intro}</p>
          <div className="home-hero-actions">
            <Link className="btn primary" to="/output">
              {t.homeUi.view}
            </Link>
            <Link className="btn ghost" to="/contact">
              {t.homeUi.contact}
            </Link>
          </div>
          <p className="meta-line hero-meta">
            luo-chen.com
            <a href="https://github.com/luochen211" target="_blank" rel="noreferrer">
              github.com/luochen211
            </a>
            <a href="mailto:cuidong111@gmail.com">cuidong111@gmail.com</a>
          </p>
        </div>

        <div className="home-hero-visual">
          <figure className="home-portrait">
            <img
              src="/头像111.jpg"
              alt={t.hero.avatarAlt}
              width="940"
              height="938"
              fetchPriority="high"
              decoding="async"
              onError={(event) => {
                event.currentTarget.style.display = 'none'
                event.currentTarget.parentElement?.classList.add('avatar-fallback')
              }}
            />
            <span className="avatar-fallback-text">CD</span>
          </figure>
          <div className="home-spec">
            <p>{t.homeUi.validating}</p>
            <dl>
              <div>
                <dt>{t.homeUi.direction}</dt>
                <dd>{t.homeUi.directionValue}</dd>
              </div>
              <div>
                <dt>{t.homeUi.output}</dt>
                <dd>{t.homeUi.outputValue}</dd>
              </div>
              <div>
                <dt>{t.homeUi.proof}</dt>
                <dd>{t.homeUi.proofValue}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="home-signal-grid page-section">
        <div className="signal-about reveal">
          <p className="eyebrow">{t.homeUi.abilityEyebrow}</p>
          <h2>{t.homeUi.abilityTitle}</h2>
          <div className="signal-copy">
            {t.summary.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="signal-board reveal">
          <div className="signal-board-head">
            <span>{t.homeUi.signals}</span>
            <strong>{t.homeUi.signalState}</strong>
          </div>
          <ul>
            {signalRows.map((row) => {
              const content = (
                <>
                  <span>{row.label}</span>
                  <strong>{row.value}</strong>
                  <em>{row.status}</em>
                </>
              )
              return (
                <li key={row.label}>
                  {row.href ? (
                    row.href.startsWith('/') ? (
                      <Link to={row.href}>{content}</Link>
                    ) : (
                      <a href={row.href} target="_blank" rel="noreferrer">
                        {content}
                      </a>
                    )
                  ) : (
                    <div>{content}</div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="home-proof page-section reveal">
        <div className="home-proof-head">
          <p className="eyebrow">{t.homeUi.assets}</p>
          <h2>{t.homeUi.assetsTitle}</h2>
        </div>
        <div className="home-proof-grid">
          {proofAssets.map((asset) => (
            <article key={asset.label}>
              <span>{asset.label}</span>
              <h3>{asset.title}</h3>
              <p>{asset.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-capability page-section">
        <div className="article-list-head">
          <p>{t.homeUi.profile}</p>
        </div>
        <div className="home-capability-grid">
          {capabilities.map((capability) => {
            const ListTag = capability.ordered ? 'ol' : 'ul'
            return (
              <article className="home-capability-item reveal" key={capability.title}>
                <span>{capability.code}</span>
                <h3>{capability.title}</h3>
                <ListTag>
                  {capability.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ListTag>
              </article>
            )
          })}
        </div>
      </section>

      <section className="home-writing page-section">
        <div className="section-head reveal">
          <p>{t.homeUi.content}</p>
          <h2>{t.homeUi.contentTitle}</h2>
        </div>
        <div className="home-writing-grid reveal">
          <div className="home-column-list">
            {columns.map((column) => (
              <Link to={column.href} key={column.slug}>
                <span>{column.eyebrow}</span>
                <strong>{column.title}</strong>
                <small>{column.summary}</small>
              </Link>
            ))}
          </div>
          <div className="home-article-list">
            {latestArticles.map((article, index) => (
              <Link to={article.href} key={article.slug}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{article.title}</strong>
                <small>{article.summary}</small>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-build page-section reveal">
        <div>
          <p className="eyebrow">{t.homeUi.build}</p>
          <h2>{t.homeUi.buildTitle}</h2>
          <p>{t.homeUi.buildText}</p>
        </div>
        <div className="build-terminal">
          <p>{t.homeUi.buildCommand}</p>
          {buildLog.map((line, index) => (
            <span key={line}>
              {`10:12:0${index + 1}`} &nbsp; {line}
            </span>
          ))}
          <strong>{t.homeUi.buildStatus}</strong>
        </div>
      </section>
    </div>
  )
}

function NowPage({ t }) {
  const nowSections = [
    {
      key: 'learning',
      title: t.now.learningTitle,
      items: t.now.learningItems,
      variant: 'focus',
    },
    {
      key: 'career',
      title: t.now.careerTitle,
      items: t.now.career,
      variant: 'career',
    },
    {
      key: 'building',
      title: t.now.buildingTitle,
      items: t.now.building,
      variant: 'building',
    },
    {
      key: 'routine',
      title: t.now.routineTitle,
      items: t.now.routineItems,
      variant: 'routine',
    },
  ]

  return (
    <section className="page-section now-page">
      <div className="section-head reveal">
        <p>{t.now.label}</p>
        <h2>{t.now.title}</h2>
      </div>

      <div className="now-mindset reveal">
        <span>{t.now.mindsetTitle}</span>
        <p>{t.now.mindset}</p>
      </div>

      <div className="now-stack">
        {nowSections.map((section, index) => (
          <article className={`now-entry reveal ${section.variant}`} key={section.key}>
            <div className="now-entry-head">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{section.title}</h3>
            </div>
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

function SummarySection({ t }) {
  return (
    <section className="page-section editorial-section">
      <div className="section-head reveal">
        <p>{t.summary.label}</p>
        <h2>{t.summary.title}</h2>
      </div>
      <div className="about-panel reveal">
        {t.summary.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  )
}

function CourseSection({ t, locale, standalone = false }) {
  const latestArticles = [...articleIndex].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6)
  const columns = localizeColumns(getPublicColumns(), locale)

  return (
    <section className="page-section course-section">
      <div className="section-head reveal">
        <p>{t.course.label}</p>
        <h2>{t.course.title}</h2>
      </div>
      <div className="course-archive reveal">
        <div className="course-lead">
          <p className="course-intro">{t.course.intro}</p>
          <ul className="course-stats">
            {t.course.stats.map((stat) => (
              <li key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <article>
          <h3>{t.course.supportTitle}</h3>
          <ul className="list-tight">
            {t.course.support.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article>
          <h3>{t.course.outcomeTitle}</h3>
          <ul className="list-tight">
            {t.course.outcomes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
      {standalone ? (
        <>
          <div className="writing-map reveal">
            <div className="article-list-head">
              <p>{t.writing.collections}</p>
            </div>
            <div className="column-grid">
              {columns.map((column) => (
                <Link className="column-card" to={column.href} key={column.slug}>
                  <h3>{column.title}</h3>
                  <p>{column.summary}</p>
                </Link>
              ))}
            </div>
          </div>
          <div className="article-list reveal">
            <div className="article-list-head">
              <p>{t.course.articlesTitle}</p>
            </div>
            {latestArticles.map((article) => (
              <Link className="article-card" to={article.href} key={article.slug}>
                <h3>{article.title}</h3>
                <p>{article.summary}</p>
              </Link>
            ))}
          </div>
          <a
            className="course-fit course-link reveal"
            href={t.course.archive.href}
            target="_blank"
            rel="noreferrer"
          >
            <span>{t.course.archive.action}</span>
            <h3>{t.course.archive.title}</h3>
            <p>{t.course.archive.description}</p>
          </a>
          <div className="course-fit reveal">
            <h3>{t.now.careerTitle}</h3>
            <ul className="list-tight">
              {t.now.career.slice(0, 2).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </>
      ) : null}
    </section>
  )
}

function TopicPage({ t, locale }) {
  const [topic] = localizeColumns([findColumn('where-do-we-go')], locale)

  return (
    <section className="page-section topic-page">
      <div className="topic-hero reveal">
        <p className="eyebrow">{t.topic.eyebrow}</p>
        <h1>{t.topic.title}</h1>
        <p>{t.topic.intro}</p>
      </div>

      <div className="topic-frame reveal">
        <article>
          <h2>{t.topic.focus}</h2>
          <ul className="list-tight">
            {t.topic.questions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </article>
        <article>
          <h2>{t.topic.method}</h2>
          <p>{t.topic.methodText}</p>
        </article>
      </div>

      {topic.series.map((section) => (
        <div className="article-list reveal" id={section.slug} key={section.slug}>
          <div className="article-list-head">
            <p>{section.title}</p>
            <small>{section.summary}</small>
          </div>
          {section.articles.map((article) => (
            <Link className="article-card" to={`/articles/${article.slug}`} key={article.slug}>
              <h3>{article.title}</h3>
              <p>{article.summary}</p>
            </Link>
          ))}
        </div>
      ))}
    </section>
  )
}

function ColumnPage({ t, locale }) {
  const { columnSlug } = useParams()
  const rawColumn = findColumn(columnSlug)
  const [column] = rawColumn ? localizeColumns([rawColumn], locale) : []

  if (!column) return <Navigate replace to="/output" />

  return (
    <section className="page-section topic-page">
      <div className="topic-hero reveal">
        <p className="eyebrow">{column.eyebrow}</p>
        <h1>{column.title}</h1>
        <p>{column.summary}</p>
      </div>

      {column.series.length ? (
        column.series.map((section) => (
          <div className="article-list reveal" id={section.slug} key={section.slug}>
            <div className="article-list-head">
              <p>{section.title}</p>
              <small>{section.summary}</small>
            </div>
            {section.articles.map((article) => (
              <Link className="article-card" to={`/articles/${article.slug}`} key={article.slug}>
                <h3>{article.title}</h3>
                <p>{article.summary}</p>
              </Link>
            ))}
          </div>
        ))
      ) : (
        <div className="course-fit reveal">
          <h3>{t.common.columnReserved}</h3>
          <p className="column-empty">{t.common.columnReservedDetail}</p>
        </div>
      )}
    </section>
  )
}

function StackSection({ t }) {
  return (
    <section className="page-section stack-section">
      <div className="section-head reveal">
        <p>{t.stack.label}</p>
        <h2>{t.stack.title}</h2>
      </div>
      <div className="stack-grid">
        {t.stack.groups.map((group) => (
          <article className="stack-column reveal" key={group.title}>
            <h3>{group.title}</h3>
            <ul className="stack-list">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

function ProjectsPage({ t }) {
  return (
    <section className="page-section work-archive">
      <div className="section-head reveal">
        <p>{t.projects.label}</p>
        <h2>{t.projects.title}</h2>
      </div>
      <div className="timeline">
        {t.projects.list.map((project, index) => (
          <article className="timeline-item reveal" key={project.name}>
            <span className="project-index">{String(index + 1).padStart(2, '0')}</span>
            <div className="project-head">
              <h3>
                {project.link ? (
                  <a
                    className="project-title-link"
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {project.name}
                  </a>
                ) : (
                  project.name
                )}
              </h3>
              <span>{project.period}</span>
            </div>
            <p className="project-role">{project.role}</p>
            <div className="chip-row">
              {project.tech.map((tech) => (
                <span className="chip" key={tech}>
                  {tech}
                </span>
              ))}
            </div>
            <ul className="project-points">
              {project.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <p className="project-detail-title">{t.projects.detailTitle}</p>
            <ul className="project-details">
              {project.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

function OutputPage({ t, locale }) {
  return (
    <>
      <CourseSection t={t} locale={locale} standalone />
      <ProjectsPage t={t} />
    </>
  )
}

function parseInlineMarkdown(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

function parseArticleMeta(markdown) {
  const frontmatter = markdown.match(/^---\n([\s\S]*?)\n---/)
  if (!frontmatter) return {}

  return frontmatter[1].split('\n').reduce((meta, line) => {
    const match = line.match(/^(\w+):\s*"?(.*?)"?$/)
    if (match) {
      meta[match[1]] = match[2]
    }
    return meta
  }, {})
}

function parseArticleMarkdown(markdown) {
  const withoutFrontmatter = markdown.replace(/^---[\s\S]*?---\s*/, '')
  const lines = withoutFrontmatter.split('\n')
  const blocks = []
  let list = null

  const flushList = () => {
    if (list) {
      blocks.push(list)
      list = null
    }
  }

  lines.forEach((rawLine) => {
    const line = rawLine.trim()
    if (!line) {
      flushList()
      return
    }

    if (line.startsWith('# ')) {
      flushList()
      blocks.push({ type: 'h1', text: line.slice(2) })
      return
    }

    if (line.startsWith('## ')) {
      flushList()
      blocks.push({ type: 'h2', text: line.slice(3) })
      return
    }

    if (line.startsWith('> ')) {
      flushList()
      blocks.push({ type: 'quote', text: line.slice(2) })
      return
    }

    const unordered = line.match(/^- (.+)$/)
    if (unordered) {
      if (!list || list.type !== 'ul') list = { type: 'ul', items: [] }
      list.items.push(unordered[1])
      return
    }

    const ordered = line.match(/^\d+\. (.+)$/)
    if (ordered) {
      if (!list || list.type !== 'ol') list = { type: 'ol', items: [] }
      list.items.push(ordered[1])
      return
    }

    flushList()
    blocks.push({ type: 'p', text: line })
  })

  flushList()
  return blocks
}

function ArticlePage({ locale }) {
  const { slug } = useParams()
  const [markdown, setMarkdown] = useState('')
  const article = findArticle(slug)
  const seriesArticles = getSeriesArticles(article)
  const currentIndex = seriesArticles.findIndex((item) => item.slug === slug)
  const prevArticle = currentIndex > 0 ? seriesArticles[currentIndex - 1] : null
  const nextArticle =
    currentIndex >= 0 && currentIndex < seriesArticles.length - 1
      ? seriesArticles[currentIndex + 1]
      : null
  const relatedArticles = getLinkedArticles(article?.related)
  const copy = readerCopy(locale)

  useEffect(() => {
    let alive = true
    fetch(`/articles/${slug}.md`)
      .then((response) => response.text())
      .then((text) => {
        if (alive) setMarkdown(text)
      })
      .catch(() => {
        if (alive) setMarkdown('')
      })
    return () => {
      alive = false
    }
  }, [slug])

  const meta = markdown ? parseArticleMeta(markdown) : {}
  const blocks = markdown ? parseArticleMarkdown(markdown) : []
  const title = blocks.find((block) => block.type === 'h1')?.text

  useEffect(() => {
    if (title) document.title = `${title} · luo-chen.com`
  }, [title])

  return (
    <article className="article-page reveal">
      {blocks.length ? (
        blocks.map((block, index) => {
          if (block.type === 'h1') {
            return (
              <header className="article-hero" key={`${block.type}-${index}`}>
                <p>
                  {article ? (
                    <>
                      <Link to={article.column.href}>{article.column.title}</Link>
                      <span> · </span>
                      <a href={article.series.href}>{article.series.title}</a>
                      <span> · </span>
                    </>
                  ) : (
                    'Article · '
                  )}
                  {meta.date || article?.date || ''}
                </p>
                <h1>{block.text}</h1>
                {article?.tags?.length ? (
                  <div className="article-tags">
                    {article.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                ) : null}
              </header>
            )
          }
          if (block.type === 'h2') return <h2 key={`${block.text}-${index}`}>{block.text}</h2>
          if (block.type === 'quote') {
            return <blockquote key={`${block.text}-${index}`}>{parseInlineMarkdown(block.text)}</blockquote>
          }
          if (block.type === 'ul') {
            return (
              <ul key={`${block.type}-${index}`}>
                {block.items.map((item) => (
                  <li key={item}>{parseInlineMarkdown(item)}</li>
                ))}
              </ul>
            )
          }
          if (block.type === 'ol') {
            return (
              <ol key={`${block.type}-${index}`}>
                {block.items.map((item) => (
                  <li key={item}>{parseInlineMarkdown(item)}</li>
                ))}
              </ol>
            )
          }
          return <p key={`${block.text}-${index}`}>{parseInlineMarkdown(block.text)}</p>
        })
      ) : (
        <div className="article-hero">
          <p>{copy.loading}</p>
          <h1>{copy.unavailable}</h1>
        </div>
      )}
      {article ? (
        <footer className="article-network">
          {prevArticle || nextArticle ? (
            <nav className="article-pager" aria-label={copy.pagerLabel}>
              {prevArticle ? (
                <Link to={prevArticle.href}>
                  <span>{copy.previous}</span>
                  <strong>{prevArticle.title}</strong>
                </Link>
              ) : (
                <span />
              )}
              {nextArticle ? (
                <Link to={nextArticle.href}>
                  <span>{copy.next}</span>
                  <strong>{nextArticle.title}</strong>
                </Link>
              ) : (
                <span />
              )}
            </nav>
          ) : null}

          <div className="article-network-grid">
            <section>
              <h2>{copy.series}</h2>
              <div className="network-list">
                {seriesArticles.map((item) => (
                  <Link
                    className={item.slug === slug ? 'active' : ''}
                    to={item.href}
                    key={item.slug}
                  >
                    <span>{item.date}</span>
                    <strong>{item.title}</strong>
                  </Link>
                ))}
              </div>
            </section>

            {relatedArticles.length ? (
              <section>
                <h2>{copy.related}</h2>
                <div className="network-list">
                  {relatedArticles.map((item) => (
                    <Link to={item.href} key={item.slug}>
                      <span>{item.column.title}</span>
                      <strong>{item.title}</strong>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </footer>
      ) : null}
    </article>
  )
}

function ContactPage({ t }) {
  return (
    <section className="page-section">
      <div className="section-head reveal">
        <p>{t.contact.label}</p>
        <h2>{t.contact.title}</h2>
      </div>
      <div className="contact-grid">
        {t.contact.cards.map((card) => {
          const isLink = Boolean(card.href)
          const linkProps = isLink
            ? {
                href: card.href,
                target: card.href.startsWith('mailto:') ? undefined : '_blank',
                rel: card.href.startsWith('mailto:') ? undefined : 'noreferrer',
              }
            : {}

          return (
            <a className="contact-card reveal" key={card.value} {...linkProps}>
              <p>{card.label}</p>
              <h3>{card.value}</h3>
              {card.note ? <span className="contact-note">{card.note}</span> : null}
              {card.qrSrc ? (
                <img
                  className="contact-qr"
                  src={card.qrSrc}
                  alt={card.qrAlt || `${card.label} QR code`}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                  }}
                />
              ) : null}
            </a>
          )
        })}
      </div>
    </section>
  )
}

function getRouteTitle(pathname, t) {
  if (pathname.startsWith('/articles/')) return null
  if (pathname === '/now') return t.now.title
  if (['/output', '/writing', '/work', '/projects', '/course'].includes(pathname)) {
    return t.course.title
  }
  if (pathname === '/contact') return t.contact.title
  if (pathname === '/roundtable' || pathname === '/lab/roundtable') return t.lab.title
  if (pathname === '/topics/where-do-we-go') return t.topic.title
  if (pathname.startsWith('/columns/')) {
    const slug = pathname.slice('/columns/'.length)
    return t.collections[slug]?.title || t.seoTitle.text
  }
  return t.seoTitle.text
}

function SiteApp() {
  const [locale, setLocale] = useState(() => {
    if (typeof window === 'undefined') return 'zh'
    return getInitialLocale(window.localStorage)
  })
  const location = useLocation()
  const t = siteContent[locale]

  useEffect(() => {
    window.localStorage.setItem('site-locale', locale)
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
    const routeTitle = getRouteTitle(location.pathname, t)
    if (routeTitle) document.title = routeTitle
  }, [locale, location.pathname, t])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
          }
        })
      },
      { threshold: 0.16 },
    )

    const revealItems = document.querySelectorAll('.reveal')
    revealItems.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [location.pathname, locale])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const context = gsap.context(() => {
      gsap.fromTo(
        '.hero-copy > *, .home-hero-copy > *',
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.08,
        },
      )

      gsap.fromTo(
        '.hero-visual, .home-hero-visual',
        { opacity: 0, y: 42, rotate: -1.5 },
        { opacity: 1, y: 0, rotate: 0, duration: 1.1, ease: 'power3.out', delay: 0.12 },
      )

      gsap.utils.toArray('.timeline-item').forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0.78, y: 26 },
          {
            opacity: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top 86%',
              end: 'top 42%',
              scrub: true,
            },
          },
        )
      })

      gsap.utils.toArray('.capability-tile, .home-capability-item, .home-proof article').forEach((tile) => {
        gsap.fromTo(
          tile,
          { scale: 0.96, opacity: 0.42 },
          {
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: tile,
              start: 'top 92%',
              end: 'top 58%',
              scrub: true,
            },
          },
        )
      })
    })

    return () => context.revert()
  }, [location.pathname, locale])

  return (
    <div className="page">
      <div className="bg-orb orb-a" aria-hidden="true" />
      <div className="bg-orb orb-b" aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />

      <header className="topbar container">
        <nav className="nav">
          <Link className="brand" to="/">
            {t.common.brand}
          </Link>
          <div className="nav-right">
            <div className="nav-links">
              <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
                {t.nav.home}
              </NavLink>
              <NavLink to="/now" className={({ isActive }) => (isActive ? 'active' : '')}>
                {t.nav.now}
              </NavLink>
              <NavLink
                to="/output"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {t.nav.output}
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {t.nav.contact}
              </NavLink>
            </div>
            <button
              className="lang-toggle"
              type="button"
              onClick={() => setLocale((current) => (current === 'en' ? 'zh' : 'en'))}
            >
              {t.toggle.text}
            </button>
          </div>
        </nav>
      </header>

      <main className="container route-main">
        <Routes>
          <Route path="/" element={<HomePage t={t} locale={locale} />} />
          <Route path="/now" element={<NowPage t={t} />} />
          <Route path="/roundtable" element={<RoundtablePage t={t} />} />
          <Route path="/lab/roundtable" element={<RoundtablePage t={t} />} />
          <Route path="/work" element={<Navigate replace to="/output" />} />
          <Route path="/projects" element={<Navigate replace to="/output" />} />
          <Route path="/output" element={<OutputPage t={t} locale={locale} />} />
          <Route path="/writing" element={<OutputPage t={t} locale={locale} />} />
          <Route path="/course" element={<Navigate replace to="/output" />} />
          <Route path="/columns/:columnSlug" element={<ColumnPage t={t} locale={locale} />} />
          <Route path="/topics/where-do-we-go" element={<TopicPage t={t} locale={locale} />} />
          <Route path="/articles/:slug" element={<ArticlePage locale={locale} />} />
          <Route path="/contact" element={<ContactPage t={t} />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </main>

      <footer className="footer container">
        <p>
          © {new Date().getFullYear()} {t.footer.text}
        </p>
      </footer>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <SiteApp />
    </BrowserRouter>
  )
}

export default App
