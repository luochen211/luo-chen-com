import { Link, Navigate, useParams } from 'react-router-dom'
import { localizeArticles, localizeColumns } from '../data/siteContent'
import { articleIndex } from '../data/siteData'
import { findColumn } from '../data/siteData'

export default function CollectionView({ locale, slug: fixedSlug, topicCopy }) {
  const { columnSlug } = useParams()
  const rawColumn = findColumn(fixedSlug || columnSlug)
  if (!rawColumn) return <Navigate replace to="/output" />

  const [column] = localizeColumns([rawColumn], locale)
  const articles = localizeArticles(
    articleIndex.filter((article) => article.column.slug === rawColumn.slug),
    locale,
  )
  const latest = [...articles].sort((a, b) => b.date.localeCompare(a.date))[0]
  const start = articles[0]
  const labels = locale === 'en'
    ? { count: 'articles', updated: 'Latest update', start: 'Start here' }
    : { count: '篇文章', updated: '最近更新', start: '从这里开始' }

  return (
    <section className="page-section topic-page collection-view">
      <div className="topic-hero reveal">
        <p className="eyebrow">{topicCopy?.eyebrow || column.eyebrow}</p>
        <h1>{topicCopy?.title || column.title}</h1>
        <p>{topicCopy?.intro || column.summary}</p>
        <dl className="collection-meta">
          <div><dt>{articles.length}</dt><dd>{labels.count}</dd></div>
          {latest ? <div><dt>{latest.date}</dt><dd>{labels.updated}</dd></div> : null}
        </dl>
      </div>

      {topicCopy ? (
        <div className="topic-frame reveal">
          <article><h2>{topicCopy.focus}</h2><ul className="list-tight">{topicCopy.questions.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article><h2>{topicCopy.method}</h2><p>{topicCopy.methodText}</p></article>
        </div>
      ) : null}

      {start ? (
        <Link className="collection-start reveal" to={`/articles/${start.slug}`}>
          <span>{labels.start}</span><strong>{start.title}</strong><p>{start.summary}</p>
        </Link>
      ) : null}

      {column.series.map((section) => (
        <div className="article-list reveal" id={section.slug} key={section.slug}>
          <div className="article-list-head"><p>{section.title}</p><small>{section.summary}</small></div>
          {articles.filter((article) => article.series.slug === section.slug).map((article) => (
            <Link className="article-card" to={`/articles/${article.slug}`} key={article.slug}>
              <time dateTime={article.date}>{article.date}</time><h3>{article.title}</h3><p>{article.summary}</p>
            </Link>
          ))}
        </div>
      ))}
    </section>
  )
}
