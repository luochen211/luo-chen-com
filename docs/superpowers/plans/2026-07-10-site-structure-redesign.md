# Site Structure Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild luo-chen.com into a Chinese-first bilingual engineering site with distinct Home, Work, Writing, Now, Lab, Collection, Article, and Contact experiences.

**Architecture:** Extract site data, locale copy, navigation, and page components from the current monolithic `App.jsx` while retaining React Router, the existing Markdown article format, and the current API. Pure selectors and reading helpers are tested independently; interactive navigation and route behavior are tested with React Testing Library; final layout is verified with Playwright at desktop and mobile sizes.

**Tech Stack:** React 19, React Router 7, Vite 7, GSAP 3, Vitest, jsdom, React Testing Library, Playwright for final browser verification.

## Global Constraints

- Chinese is the default locale for first-time visitors; English remains a complete switchable locale.
- Article bodies remain in their authored language while reader controls follow the selected locale.
- Preserve the dark editorial identity, portrait, warm coral accent, cool blue ambient light, and grain texture.
- Do not add remote placeholder photography.
- Closed mobile navigation must remain between 56 and 64 CSS pixels tall.
- Empty writing columns must not appear in public lists or render public empty states.
- Legacy `/output`, `/projects`, `/course`, and `/roundtable` routes must remain valid through redirects.
- Preserve `prefers-reduced-motion` behavior and add visible keyboard focus styles.
- Do not alter the roundtable API request or response contract.
- Preserve unrelated worktree files, including the existing untracked `preview-article-rendered.png`.

## File Structure

- Create `src/data/siteContent.js`: bilingual shared page and navigation copy.
- Create `src/data/siteData.js`: projects, writing columns, articles, experts, and derived public selectors.
- Create `src/lib/articles.js`: Markdown parsing, reading-time calculation, and article lookup helpers.
- Create `src/components/SiteNav.jsx`: desktop navigation and accessible mobile drawer.
- Create `src/components/CollectionView.jsx`: reusable populated collection page.
- Create `src/pages/HomePage.jsx`, `WorkPage.jsx`, `WritingPage.jsx`, `NowPage.jsx`, `RoundtablePage.jsx`, `ArticlePage.jsx`, and `ContactPage.jsx`: route-specific page composition.
- Modify `src/App.jsx`: locale state, route table, global motion, page reset, and layout shell only.
- Modify `src/App.css`: redesigned page system, mobile drawer, focused motion, article reader, and accessibility.
- Modify `src/index.css`: final font tokens and global focus/color rules.
- Modify `package.json` and `package-lock.json`: Vitest/jsdom/Testing Library test dependencies and scripts.
- Create `src/**/*.test.{js,jsx}` alongside the unit being tested.

---

### Task 1: Test Harness and Public Data Selectors

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `src/data/siteData.js`
- Create: `src/data/siteData.test.js`
- Modify: `src/App.jsx` to import the extracted data

**Interfaces:**
- Produces: `getPublicColumns(): WritingColumn[]`
- Produces: `findColumn(slug: string): WritingColumn | undefined`
- Produces: `articleIndex: Article[]`
- Produces: existing `projects`, `expertOptions`, and `exampleTopics` exports for later pages.

- [ ] **Step 1: Install the test harness and add scripts**

Run:

```bash
npm install --save-dev vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

Add to `package.json`:

```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 2: Write the failing public-column tests**

Create `src/data/siteData.test.js`:

```js
import { describe, expect, it } from 'vitest'
import { findColumn, getPublicColumns } from './siteData'

describe('public writing columns', () => {
  it('excludes columns without published articles', () => {
    expect(getPublicColumns().map((column) => column.slug)).toEqual([
      'where-do-we-go',
      'expression-review',
      'after-watching',
    ])
  })

  it('still allows populated columns to be found by slug', () => {
    expect(findColumn('after-watching')?.series[0].articles).toHaveLength(1)
  })
})
```

- [ ] **Step 3: Run the tests and verify RED**

Run: `npm test -- src/data/siteData.test.js`

Expected: FAIL because `src/data/siteData.js` does not exist.

- [ ] **Step 4: Extract data and implement the selectors**

Move the existing project, expert, topic, column, and article-index constants out of `App.jsx`. Add:

```js
export const getPublicColumns = () =>
  writingColumns.filter((column) =>
    column.series.some((series) => series.articles.length > 0),
  )

export const findColumn = (slug) =>
  getPublicColumns().find((column) => column.slug === slug)
```

Update `App.jsx` imports so behavior remains unchanged.

- [ ] **Step 5: Run focused and full verification**

Run: `npm test -- src/data/siteData.test.js && npm run lint && npm run build`

Expected: two tests pass, ESLint exits 0, Vite build exits 0.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/data/siteData.js src/data/siteData.test.js src/App.jsx
git commit -m "refactor: extract public site data"
```

### Task 2: Chinese-First Complete Locale System

**Files:**
- Create: `src/data/siteContent.js`
- Create: `src/data/siteContent.test.js`
- Modify: `src/App.jsx`
- Modify: extracted page files as they are introduced in later tasks

**Interfaces:**
- Produces: `siteContent.zh` and `siteContent.en` with identical key structure.
- Produces: `getInitialLocale(storage): 'zh' | 'en'`.
- Produces: `readerCopy(locale)` for ArticlePage controls.

- [ ] **Step 1: Write failing locale tests**

Create `src/data/siteContent.test.js`:

```js
import { describe, expect, it } from 'vitest'
import { getInitialLocale, siteContent } from './siteContent'

const keys = (value) => Object.keys(value).sort()

describe('site locale content', () => {
  it('defaults first-time visitors to Chinese', () => {
    expect(getInitialLocale({ getItem: () => null })).toBe('zh')
  })

  it('restores a saved English preference', () => {
    expect(getInitialLocale({ getItem: () => 'en' })).toBe('en')
  })

  it('keeps Chinese and English page sections structurally complete', () => {
    expect(keys(siteContent.en)).toEqual(keys(siteContent.zh))
    for (const section of keys(siteContent.zh)) {
      expect(keys(siteContent.en[section])).toEqual(keys(siteContent.zh[section]))
    }
  })
})
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `npm test -- src/data/siteContent.test.js`

Expected: FAIL because `siteContent.js` and `getInitialLocale` do not exist.

- [ ] **Step 3: Implement locale content and migrate hard-coded page strings**

Create the complete shape:

```js
export function getInitialLocale(storage) {
  return storage?.getItem('site-locale') === 'en' ? 'en' : 'zh'
}

export const siteContent = {
  zh: {
    nav: { home: '首页', work: '作品', writing: '写作', now: 'Now', contact: '联系', lab: '实验室' },
    common: { menu: '打开菜单', close: '关闭菜单', readMore: '继续阅读' },
    article: { readingTime: '分钟阅读', previous: '上一篇', next: '下一篇', related: '继续读', unavailable: '文章暂时无法读取' },
    home: { title: '可靠 Agent 需要 Harness', proofTitle: '用真实结果证明工程判断', workTitle: '精选项目', writingTitle: '最近写作', contactTitle: '把复杂问题变成可靠交付' },
    work: { eyebrow: '作品与交付', title: '从 Agent Harness 到生产系统', intro: '开源贡献、商业系统和端到端工程交付。', details: '技术细节' },
    writing: { eyebrow: '写作与产出', title: '把实践沉淀成可以继续使用的资产', collections: '文章栏目', latest: '最新文章', products: '产品与学习材料', talks: '公开分享与 PPT' },
    now: { eyebrow: '现在', title: '我最近在做什么', updated: '最后更新', direction: '当前方向', projects: '正在推进', learning: '学习中', open: '开放合作', routine: '长期习惯' },
    lab: { eyebrow: '产品实验室', title: '专家圆桌', stepOne: '输入真实问题', stepTwo: '选择推荐专家', stepThree: '生成并比较判断', expand: '查看全部专家', submit: '开始圆桌', loading: '圆桌讨论中', error: '圆桌生成失败，请稍后再试。' },
    contact: { eyebrow: '联系', title: '一起解决值得解决的问题', intro: '开放远程工程、Agent 工具链和全栈产品交付合作。', response: '通常会在 48 小时内回复。', email: '发送合作邮件' },
  },
  en: {
    nav: { home: 'Home', work: 'Work', writing: 'Writing', now: 'Now', contact: 'Contact', lab: 'Lab' },
    common: { menu: 'Open menu', close: 'Close menu', readMore: 'Read more' },
    article: { readingTime: 'min read', previous: 'Previous', next: 'Next', related: 'Keep reading', unavailable: 'This article is currently unavailable' },
    home: { title: 'Reliable agents need a harness.', proofTitle: 'Engineering judgment, proven by real outcomes.', workTitle: 'Selected Work', writingTitle: 'Recent Writing', contactTitle: 'Turn complex problems into reliable delivery.' },
    work: { eyebrow: 'Work and Delivery', title: 'From Agent Harness to production systems.', intro: 'Open-source contributions, commercial systems, and end-to-end engineering delivery.', details: 'Technical details' },
    writing: { eyebrow: 'Writing and Output', title: 'Turn practice into assets people can keep using.', collections: 'Writing Collections', latest: 'Latest Articles', products: 'Products and Learning', talks: 'Public Talks and Decks' },
    now: { eyebrow: 'Now', title: 'What I am doing now', updated: 'Last updated', direction: 'Current Direction', projects: 'In Progress', learning: 'Learning', open: 'Open to Work', routine: 'Long-term Routine' },
    lab: { eyebrow: 'Product Lab', title: 'Expert Roundtable', stepOne: 'Enter a real question', stepTwo: 'Choose recommended experts', stepThree: 'Generate and compare judgments', expand: 'View all experts', submit: 'Start roundtable', loading: 'Roundtable in progress', error: 'The roundtable could not be generated. Please try again.' },
    contact: { eyebrow: 'Contact', title: 'Let’s solve something worth solving.', intro: 'Open to remote engineering, Agent tooling, and full-stack product delivery.', response: 'I usually reply within 48 hours.', email: 'Send a collaboration email' },
  },
}
```

Replace the current default-locale initializer with `getInitialLocale(window.localStorage)`. No visible non-article copy may remain hard-coded inside page JSX.

- [ ] **Step 4: Run tests and verify GREEN**

Run: `npm test -- src/data/siteContent.test.js`

Expected: three tests pass.

- [ ] **Step 5: Verify locale rendering manually before moving on**

Run: `npm run dev -- --host 127.0.0.1`

Check `/`, `/now`, `/work`, `/writing`, `/contact`, and `/lab/roundtable` once in Chinese and once in English. Expected: shared interface copy never mixes languages.

- [ ] **Step 6: Commit**

```bash
git add src/data/siteContent.js src/data/siteContent.test.js src/App.jsx src/pages
git commit -m "feat: add complete bilingual site copy"
```

### Task 3: Accessible Navigation and Route Architecture

**Files:**
- Create: `src/components/SiteNav.jsx`
- Create: `src/components/SiteNav.test.jsx`
- Modify: `src/App.jsx`
- Modify: `src/App.css`

**Interfaces:**
- Consumes: `t.nav`, `t.common`, `locale`, and `onToggleLocale`.
- Produces: `<SiteNav locale t onToggleLocale />`.
- Produces routes `/work`, `/writing`, `/lab/roundtable` and legacy redirects.

- [ ] **Step 1: Write failing mobile-menu tests**

Create `src/components/SiteNav.test.jsx`:

```jsx
// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import SiteNav from './SiteNav'

const t = {
  nav: { home: '首页', work: '作品', writing: '写作', now: 'Now', contact: '联系', lab: '实验室' },
  common: { menu: '打开菜单', close: '关闭菜单' },
}

describe('SiteNav', () => {
  it('opens and closes the mobile menu with accessible state', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><SiteNav locale="zh" t={t} onToggleLocale={vi.fn()} /></MemoryRouter>)
    const trigger = screen.getByRole('button', { name: '打开菜单' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard('{Escape}')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })
})
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- src/components/SiteNav.test.jsx`

Expected: FAIL because `SiteNav.jsx` does not exist.

- [ ] **Step 3: Implement the navigation component**

Implement `SiteNav` with this state contract:

```jsx
const [open, setOpen] = useState(false)
const menuId = 'site-menu'

<button
  className="menu-toggle"
  aria-expanded={open}
  aria-controls={menuId}
  aria-label={open ? t.common.close : t.common.menu}
  onClick={() => setOpen((value) => !value)}
/>
```

Add Escape handling, scroll lock, route-change close, focus transfer to the first drawer link, and focus return to the trigger. Use the new primary routes and place Lab in the secondary drawer/footer area.

Update the router:

```jsx
<Route path="/work" element={<WorkPage t={t} />} />
<Route path="/writing" element={<WritingPage t={t} />} />
<Route path="/lab/roundtable" element={<RoundtablePage t={t} />} />
<Route path="/output" element={<Navigate replace to="/writing" />} />
<Route path="/projects" element={<Navigate replace to="/work" />} />
<Route path="/course" element={<Navigate replace to="/writing" />} />
<Route path="/roundtable" element={<Navigate replace to="/lab/roundtable" />} />
```

- [ ] **Step 4: Add mobile and focus CSS**

Use a closed `.mobile-nav-shell` height of `60px`, an overlay drawer, `body.menu-open { overflow: hidden; }`, 44px touch targets, and visible `:focus-visible` outlines. Keep `.desktop-nav` at widths above 760px.

- [ ] **Step 5: Run tests and verification**

Run: `npm test -- src/components/SiteNav.test.jsx && npm run lint && npm run build`

Expected: navigation test passes; lint and build exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/components/SiteNav.jsx src/components/SiteNav.test.jsx src/App.jsx src/App.css
git commit -m "feat: add accessible responsive navigation"
```

### Task 4: Focused Home, Work, Writing, Now, and Contact Pages

**Files:**
- Create: `src/pages/HomePage.jsx`
- Create: `src/pages/WorkPage.jsx`
- Create: `src/pages/WritingPage.jsx`
- Create: `src/pages/NowPage.jsx`
- Create: `src/pages/ContactPage.jsx`
- Create: `src/pages/pages.test.jsx`
- Modify: `src/App.jsx`
- Modify: `src/App.css`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: `t`, `projects`, `articleIndex`, and `getPublicColumns()`.
- Produces: one route-level `h1` per page and explicit primary actions.

- [ ] **Step 1: Write failing page-purpose tests**

Create `src/pages/pages.test.jsx`:

```jsx
// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import HomePage from './HomePage'
import WritingPage from './WritingPage'
import { siteContent } from '../data/siteContent'

describe('redesigned page purposes', () => {
  it('limits the homepage to three proof items', () => {
    render(<MemoryRouter><HomePage t={siteContent.zh} /></MemoryRouter>)
    expect(screen.getAllByTestId('proof-item')).toHaveLength(3)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('does not list unpublished columns on Writing', () => {
    render(<MemoryRouter><WritingPage t={siteContent.zh} /></MemoryRouter>)
    expect(screen.queryByText('Agent Harness 实践')).not.toBeInTheDocument()
    expect(screen.queryByText('项目复盘')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests and verify RED**

Run: `npm test -- src/pages/pages.test.jsx`

Expected: FAIL because the extracted page modules do not exist.

- [ ] **Step 3: Build the five focused page components**

Implement the approved structures:

```jsx
// HomePage section order
<Hero />
<ProofGrid items={t.home.proof.slice(0, 3)} />
<SelectedWork projects={projects.slice(0, 3)} />
<SelectedWriting articles={articleIndex.slice(0, 4)} />
<CollaborationCta />
```

`WorkPage` owns the full project archive. `WritingPage` owns public columns, latest articles, and product/PPT paths. `NowPage` removes general career positioning and displays the update date. `ContactPage` leads with collaboration types, response time, and a prefilled `mailto:` primary action.

- [ ] **Step 4: Apply the visual system**

Implement wide two-to-three-line hero containers, large chapter spacing, asymmetric narrative layouts, grid styling only for indexes, reduced meta labels, contained image hover scale, and focused homepage proof/work GSAP selectors. Update font tokens to a Geist-first Latin stack plus the existing Chinese system stack.

- [ ] **Step 5: Run tests and verification**

Run: `npm test -- src/pages/pages.test.jsx && npm run lint && npm run build`

Expected: page tests pass; lint and build exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/pages/HomePage.jsx src/pages/WorkPage.jsx src/pages/WritingPage.jsx src/pages/NowPage.jsx src/pages/ContactPage.jsx src/pages/pages.test.jsx src/App.jsx src/App.css src/index.css
git commit -m "feat: clarify core site pages"
```

### Task 5: Shared Collection and Article Reader

**Files:**
- Create: `src/lib/articles.js`
- Create: `src/lib/articles.test.js`
- Create: `src/components/CollectionView.jsx`
- Create: `src/pages/ArticlePage.jsx`
- Create: `src/pages/ArticlePage.test.jsx`
- Modify: `src/App.jsx`
- Modify: `src/App.css`

**Interfaces:**
- Produces: `estimateReadingMinutes(markdown: string, locale: string): number`.
- Produces: `parseArticleMeta`, `parseArticleMarkdown`, `findArticle`, `getSeriesArticles`, and `getLinkedArticles`.
- Consumes: `findColumn`, redirecting unpublished slugs to `/writing`.

- [ ] **Step 1: Write failing reading-helper tests**

Create `src/lib/articles.test.js`:

```js
import { describe, expect, it } from 'vitest'
import { estimateReadingMinutes } from './articles'

describe('estimateReadingMinutes', () => {
  it('returns at least one minute for short content', () => {
    expect(estimateReadingMinutes('一段短文。', 'zh')).toBe(1)
  })

  it('uses Chinese character count for Chinese articles', () => {
    expect(estimateReadingMinutes('字'.repeat(800), 'zh')).toBe(2)
  })

  it('uses word count for English articles', () => {
    expect(estimateReadingMinutes(Array(400).fill('word').join(' '), 'en')).toBe(2)
  })
})
```

- [ ] **Step 2: Run tests and verify RED**

Run: `npm test -- src/lib/articles.test.js`

Expected: FAIL because `estimateReadingMinutes` does not exist.

- [ ] **Step 3: Implement the helper and extract article parsing**

```js
export function estimateReadingMinutes(markdown, locale) {
  const body = markdown.replace(/^---[\s\S]*?---/, '').replace(/[#>*_`\-]/g, ' ')
  const units = locale === 'zh'
    ? (body.match(/[\u3400-\u9fff]/g) || []).length
    : body.trim().split(/\s+/).filter(Boolean).length
  const rate = locale === 'zh' ? 400 : 200
  return Math.max(1, Math.ceil(units / rate))
}
```

Move the existing Markdown parsing and article relationship helpers into this module without changing supported Markdown blocks.

- [ ] **Step 4: Write the failing article error-state test**

Create `src/pages/ArticlePage.test.jsx` with a rejected fetch and assert that `siteContent.zh.article.unavailable` replaces loading. Also assert the reading-time label is rendered for a successful Markdown response.

- [ ] **Step 5: Run the test and verify RED**

Run: `npm test -- src/pages/ArticlePage.test.jsx`

Expected: FAIL because the new ArticlePage failure state is not implemented.

- [ ] **Step 6: Implement collection and article experiences**

Use one `CollectionView` for topic and column routes. Add article count, latest update, start-here entry, and grouped series. In `ArticlePage`, model fetch state explicitly:

```js
const [status, setStatus] = useState('loading')
// success => setMarkdown(text); setStatus('ready')
// failure => setStatus('error')
```

Add localized metadata, reading time, top-edge progress using scroll position, 760–820px body width, article-specific title scale, and conditional previous/next links without empty grid cells.

- [ ] **Step 7: Run tests and verification**

Run: `npm test -- src/lib/articles.test.js src/pages/ArticlePage.test.jsx && npm run lint && npm run build`

Expected: all focused tests pass; lint and build exit 0.

- [ ] **Step 8: Commit**

```bash
git add src/lib/articles.js src/lib/articles.test.js src/components/CollectionView.jsx src/pages/ArticlePage.jsx src/pages/ArticlePage.test.jsx src/App.jsx src/App.css
git commit -m "feat: improve collections and article reading"
```

### Task 6: Bilingual Roundtable Lab and Final Route Behavior

**Files:**
- Create: `src/pages/RoundtablePage.jsx`
- Create: `src/pages/RoundtablePage.test.jsx`
- Modify: `src/App.jsx`
- Modify: `src/App.css`

**Interfaces:**
- Consumes: current `POST /api/roundtable` request body `{ topic, experts }` and existing response fields.
- Produces: localized three-step Lab interface while preserving all result rendering.

- [ ] **Step 1: Write the failing lab-workflow test**

Create `src/pages/RoundtablePage.test.jsx` and render with Chinese copy. Assert that workflow labels 1, 2, and 3 exist, three recommended experts are initially selected, and expanding experts reveals the remaining options.

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- src/pages/RoundtablePage.test.jsx`

Expected: FAIL because the existing page has no three-step workflow or expandable expert list.

- [ ] **Step 3: Extract and redesign RoundtablePage**

Keep `selected` initialized to `['munger', 'kahneman', 'dalio']`, preserve `runRoundtable`, and add `showAllExperts`. Render `expertOptions.slice(0, showAllExperts ? expertOptions.length : 3)`. Localize every label, placeholder, error, loading message, result heading, and judge category through `t.lab`.

- [ ] **Step 4: Run tests and verification**

Run: `npm test -- src/pages/RoundtablePage.test.jsx && npm run lint && npm run build`

Expected: lab test passes; lint and build exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/pages/RoundtablePage.jsx src/pages/RoundtablePage.test.jsx src/App.jsx src/App.css
git commit -m "feat: frame roundtable as a product lab"
```

### Task 7: Full Visual and Behavioral Verification

**Files:**
- Create: `scripts/audit-site.mjs`
- Modify: any file required to fix a verified regression

**Interfaces:**
- Consumes the production preview at `http://127.0.0.1:4173`.
- Produces screenshots under `/tmp/luochen-site-redesign-audit`; no screenshot artifacts are committed.

- [ ] **Step 1: Add a reusable Playwright audit**

The script visits `/`, `/work`, `/writing`, `/now`, `/lab/roundtable`, `/columns/where-do-we-go`, a long article, and `/contact` at 1440×1000 and 390×844. For each route it asserts:

```js
if (metrics.scrollWidth > metrics.clientWidth) throw new Error(`overflow: ${route}`)
if (metrics.h1Count !== 1) throw new Error(`invalid h1 count: ${route}`)
if (consoleErrors.length) throw new Error(`console errors: ${route}`)
if (label === 'mobile' && metrics.closedNavHeight > 64) throw new Error(`mobile nav too tall: ${route}`)
```

It also captures full-page screenshots for visual review.

- [ ] **Step 2: Run the full automated suite**

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: all tests pass with zero failures; ESLint and Vite exit 0.

- [ ] **Step 3: Run the production browser audit**

Run:

```bash
python3 /Users/luochen/.codex/skills/webapp-testing/scripts/with_server.py \
  --server "npm run preview -- --host 127.0.0.1" --port 4173 \
  -- node scripts/audit-site.mjs
```

Expected: every route reports zero overflow, one `h1`, no console errors, and a mobile closed-nav height no greater than 64px.

- [ ] **Step 4: Inspect the generated screenshots**

Review both viewport sets for hero title wrapping, card density, section rhythm, article readability, drawer layering, language completeness, and contact CTA prominence. Fix any visual regression, then repeat Steps 2 and 3.

- [ ] **Step 5: Confirm worktree scope**

Run:

```bash
git status --short
git diff --check
git diff --stat
```

Expected: only redesign files and the audit script are modified; `preview-article-rendered.png` remains untracked and untouched.

- [ ] **Step 6: Commit the final verified state**

```bash
git add scripts/audit-site.mjs src package.json package-lock.json
git commit -m "feat: complete responsive site redesign"
```

- [ ] **Step 7: Push the verified commits**

Run: `git push origin main`

Expected: remote `main` advances without force-push.
