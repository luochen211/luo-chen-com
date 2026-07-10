import { articleIndex } from '../data/siteData'

export function estimateReadingMinutes(markdown, locale) {
  const body = markdown.replace(/^---[\s\S]*?---/, '').replace(/[#>*_`-]/g, ' ')
  const units = locale === 'zh'
    ? (body.match(/[\u3400-\u9fff]/g) || []).length
    : body.trim().split(/\s+/).filter(Boolean).length
  const rate = locale === 'zh' ? 400 : 200
  return Math.max(1, Math.ceil(units / rate))
}

export function parseArticleMeta(markdown) {
  const frontmatter = markdown.match(/^---\n([\s\S]*?)\n---/)
  if (!frontmatter) return {}

  return frontmatter[1].split('\n').reduce((meta, line) => {
    const match = line.match(/^(\w+):\s*"?(.*?)"?$/)
    if (match) meta[match[1]] = match[2]
    return meta
  }, {})
}

export function parseArticleMarkdown(markdown) {
  const lines = markdown.replace(/^---[\s\S]*?---\s*/, '').split('\n')
  const blocks = []
  let list = null
  const flushList = () => {
    if (list) blocks.push(list)
    list = null
  }

  lines.forEach((rawLine) => {
    const line = rawLine.trim()
    if (!line) return flushList()
    if (line.startsWith('# ')) {
      flushList(); blocks.push({ type: 'h1', text: line.slice(2) }); return
    }
    if (line.startsWith('## ')) {
      flushList(); blocks.push({ type: 'h2', text: line.slice(3) }); return
    }
    if (line.startsWith('> ')) {
      flushList(); blocks.push({ type: 'quote', text: line.slice(2) }); return
    }
    const unordered = line.match(/^- (.+)$/)
    if (unordered) {
      if (!list || list.type !== 'ul') list = { type: 'ul', items: [] }
      list.items.push(unordered[1]); return
    }
    const ordered = line.match(/^\d+\. (.+)$/)
    if (ordered) {
      if (!list || list.type !== 'ol') list = { type: 'ol', items: [] }
      list.items.push(ordered[1]); return
    }
    flushList(); blocks.push({ type: 'p', text: line })
  })
  flushList()
  return blocks
}

export function findArticle(slug) {
  return articleIndex.find((article) => article.slug === slug)
}

export function getSeriesArticles(article) {
  if (!article) return []
  return articleIndex.filter(
    (item) => item.column.slug === article.column.slug && item.series.slug === article.series.slug,
  )
}

export function getLinkedArticles(slugs = []) {
  return slugs.map(findArticle).filter(Boolean)
}
