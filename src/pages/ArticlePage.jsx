import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { localizeArticles, readerCopy } from '../data/siteContent'
import { estimateReadingMinutes, findArticle, getLinkedArticles, getSeriesArticles, parseArticleMarkdown, parseArticleMeta } from '../lib/articles'

function Inline({ children }) {
  return children.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={index}>{part.slice(2, -2)}</strong> : part,
  )
}

export default function ArticlePage({ locale }) {
  const { slug } = useParams()
  const [request, setRequest] = useState({ slug, status: 'loading', markdown: '' })
  const [progress, setProgress] = useState(0)
  const article = findArticle(slug)
  const [localizedArticle] = article ? localizeArticles([article], locale) : []
  const series = localizeArticles(getSeriesArticles(article), locale)
  const related = localizeArticles(getLinkedArticles(article?.related), locale)
  const index = series.findIndex((item) => item.slug === slug)
  const previous = index > 0 ? series[index - 1] : null
  const next = index >= 0 && index < series.length - 1 ? series[index + 1] : null
  const copy = readerCopy(locale)

  useEffect(() => {
    let alive = true
    fetch(`/articles/${slug}.md`)
      .then((response) => {
        if ('ok' in response && !response.ok) throw new Error('Article unavailable')
        return response.text()
      })
      .then((text) => { if (alive) setRequest({ slug, status: 'ready', markdown: text }) })
      .catch(() => { if (alive) setRequest({ slug, status: 'error', markdown: '' }) })
    return () => { alive = false }
  }, [slug])

  useEffect(() => {
    const update = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight
      setProgress(available > 0 ? Math.min(100, Math.max(0, window.scrollY / available * 100)) : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  const status = request.slug === slug ? request.status : 'loading'
  const markdown = request.slug === slug ? request.markdown : ''
  const blocks = useMemo(() => status === 'ready' ? parseArticleMarkdown(markdown) : [], [markdown, status])
  const meta = status === 'ready' ? parseArticleMeta(markdown) : {}
  const title = blocks.find((block) => block.type === 'h1')?.text
  const minutes = status === 'ready' ? estimateReadingMinutes(markdown, locale) : 0
  useEffect(() => { if (title) document.title = `${title} · luo-chen.com` }, [title])

  if (status !== 'ready') return (
    <article className="article-page"><div className="article-progress" style={{ width: 0 }} />
      <div className="article-hero"><p>{status === 'loading' ? copy.loading : null}</p><h1>{status === 'error' ? copy.unavailable : null}</h1></div>
    </article>
  )

  return <article className="article-page reveal">
    <div className="article-progress" style={{ width: `${progress}%` }} />
    {blocks.map((block, blockIndex) => {
      if (block.type === 'h1') return <header className="article-hero" key={blockIndex}>
        <p>{localizedArticle ? <><Link to={localizedArticle.column.href}>{localizedArticle.column.title}</Link><span> · </span><a href={localizedArticle.series.href}>{localizedArticle.series.title}</a><span> · </span></> : `${copy.unknownLabel} · `}{meta.date || localizedArticle?.date || ''}<span> · </span><span>{minutes} {copy.readingTime}</span></p>
        <h1>{block.text}</h1>{localizedArticle?.tags?.length ? <div className="article-tags">{localizedArticle.tags.map((tag) => <span key={tag}>{tag}</span>)}</div> : null}
      </header>
      if (block.type === 'h2') return <h2 key={blockIndex}>{block.text}</h2>
      if (block.type === 'quote') return <blockquote key={blockIndex}><Inline>{block.text}</Inline></blockquote>
      if (block.type === 'ul' || block.type === 'ol') { const List = block.type; return <List key={blockIndex}>{block.items.map((item) => <li key={item}><Inline>{item}</Inline></li>)}</List> }
      return <p key={blockIndex}><Inline>{block.text}</Inline></p>
    })}
    {article ? <footer className="article-network">
      {previous || next ? <nav className={`article-pager ${previous && next ? '' : 'single'}`} aria-label={copy.pagerLabel}>
        {previous ? <Link to={previous.href}><span>{copy.previous}</span><strong>{previous.title}</strong></Link> : null}
        {next ? <Link to={next.href}><span>{copy.next}</span><strong>{next.title}</strong></Link> : null}
      </nav> : null}
      <div className="article-network-grid"><section><h2>{copy.series}</h2><div className="network-list">{series.map((item) => <Link className={item.slug === slug ? 'active' : ''} to={item.href} key={item.slug}><span>{item.date}</span><strong>{item.title}</strong></Link>)}</div></section>
      {related.length ? <section><h2>{copy.related}</h2><div className="network-list">{related.map((item) => <Link to={item.href} key={item.slug}><span>{item.column.title}</span><strong>{item.title}</strong></Link>)}</div></section> : null}</div>
    </footer> : null}
  </article>
}
