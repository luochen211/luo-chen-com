# Site Structure Redesign

## Objective

Turn luo-chen.com into a coherent personal engineering site with a clear primary identity, a complete Chinese/English experience, shorter decision paths, and consistent desktop and mobile behavior.

The site should present Luochen first as an Agent Harness engineer and full-stack builder. Writing, products, experiments, and career updates support that identity instead of competing with it.

## Language Strategy

- Chinese is the default locale for first-time visitors.
- English remains available through the existing language switch.
- Every shared interface string and every non-article page must have complete Chinese and English content.
- Article bodies remain in their authored language; navigation, metadata labels, reading controls, and related-content headings follow the selected site locale.
- The selected locale remains stored in `localStorage`.
- The document language and page title update with the selected locale and current route.

## Information Architecture

### Primary navigation

The desktop navigation contains:

1. Home
2. Work
3. Writing
4. Now
5. Contact

The roundtable remains available as a product experiment under a secondary Lab link. It is not presented as a top-level peer of the portfolio and writing sections.

### Routes

- `/` — concise personal homepage
- `/work` — project and delivery archive
- `/writing` — writing, topics, and productized output overview
- `/now` — current focus and active work
- `/contact` — collaboration entry point
- `/lab/roundtable` — expert roundtable experiment
- `/columns/:columnSlug` — populated writing collection
- `/topics/where-do-we-go` — compatible alias or redirect to the relevant collection
- `/articles/:slug` — article reader

Legacy `/output`, `/projects`, `/course`, and `/roundtable` links remain valid through redirects.

Empty columns are excluded from public listings. Direct visits to an unpublished column redirect to `/writing`.

## Page Designs

### Homepage

The homepage follows a focused AIDA sequence:

1. Attention — asymmetric hero with name, role, concise positioning, two actions, and portrait.
2. Interest — three concrete proof points: open-source Agent work, production delivery, and commercial results.
3. Desire — selected work and selected writing, each limited to three or four high-value entries.
4. Action — a high-contrast collaboration section linking to Work and Contact.

The signal board, capability archive, proof assets, and build log are consolidated. Repeated concepts such as “being validated,” “public assets,” and “build in public” appear once rather than in multiple sections.

The desktop page should remain under roughly 3,500 rendered pixels with current content. This is a design target rather than a hard runtime assertion because text wrapping varies by font and locale.

### Work

Projects move to a dedicated archive. The page begins with a short value statement and a compact capability summary, followed by project entries.

Each project initially shows the decision-useful layer:

- project name
- role and period
- short outcome
- technology tags
- two or three proof points

Technical details use expandable disclosure on smaller screens to reduce page length while remaining available.

### Writing

Writing becomes the home for articles, collections, products, videos, PPT material, courses, and community output.

The first screen presents three clear paths:

- Writing and collections
- Products and learning material
- Public talks and PPT archive

Only populated columns appear. Latest articles are visually secondary to the collection map so the page communicates a durable content system rather than a chronological feed only.

### Now

Now displays:

- last updated date
- current direction
- current projects
- current learning
- open collaboration status
- routines that materially affect the current period

General career positioning moves out of Now and into Work or Contact. Each section is limited to the items that can realistically change between updates.

### Roundtable Lab

The roundtable is framed as an experiment. Its workflow is explicitly numbered:

1. Enter a real question.
2. Select recommended experts.
3. Generate and compare perspectives.

The initial expert list emphasizes three recommended roles, with the remaining experts available through expansion. The result state preserves the existing judging and synthesis behavior.

### Collections

Topic and column pages share one collection layout:

- collection title and summary
- article count and update date
- “start here” article
- grouped series

The duplicate TopicPage and ColumnPage visual structures should converge on a reusable component without requiring article data migration.

### Article Reader

- Body width is reduced to approximately 760–820 CSS pixels on desktop.
- Article title uses a separate fluid type scale from marketing heroes.
- Long mobile titles target no more than three lines at 390 CSS pixels when practical without truncating content.
- Metadata includes collection, series, publication date, and estimated reading time.
- A subtle reading-progress indicator is fixed at the top edge.
- Previous and next navigation does not render empty placeholder cells.
- Related reading remains at the end.
- Article controls and metadata follow the current site locale; article content remains untouched.

### Contact

The page begins with supported collaboration types and expected response time. Email is the primary action. WeChat is the secondary contact method. GitHub and the public domain remain supporting links.

The email action uses a prefilled subject that communicates the collaboration intent without sending any message automatically.

## Visual System

### Foundation

- Preserve the current dark editorial identity, warm coral accent, cool blue ambient light, and grain texture.
- Retain the portrait and existing brand wordmark.
- Use Geist or the closest reliably loaded sans-serif for Latin text and a stable Chinese system/web font stack for Chinese text.
- Do not introduce a dependency on remote placeholder photography.

### Typography

- Marketing heroes: wide containers, two to three lines maximum.
- Article titles: a smaller, reading-oriented display scale.
- Body copy: comfortable line length and at least 1.75 line height for long-form Chinese text.
- Meta labels are limited to page type, status, and date. Decorative codes such as `SPEC.001` are removed from public-facing sections.

### Layout

- Gapless one-pixel grids are reserved for indexes, archives, and structured data.
- Narrative sections use larger chapter spacing and asymmetric editorial layouts.
- Cards are used only when content is genuinely independent or interactive.
- Every clickable card has visible hover and keyboard focus behavior.

### Motion

Motion is concentrated in two places:

- Homepage proof items use a restrained scroll-driven stack or progressive reveal.
- Selected work uses image/text scale and fade transitions while entering the viewport.

Navigation, form controls, and article reading remain calm. All nonessential motion is disabled when `prefers-reduced-motion: reduce` is active.

## Mobile Navigation

- The collapsed top bar is 56–64 CSS pixels tall.
- It contains the brand, language control, and menu button.
- The menu opens as an accessible full-width drawer.
- Opening the drawer locks background scrolling.
- Escape, backdrop click, route selection, and menu-button activation close the drawer.
- Focus is moved into the menu when it opens and returned to the trigger when it closes.
- Desktop navigation remains the existing floating glass pill, adjusted for the new route labels.

## Component Boundaries

The existing single `App.jsx` should be reduced through focused extraction without unrelated architectural migration:

- `SiteNav` — desktop and mobile navigation behavior
- `HomePage` — concise homepage composition
- `WorkPage` — project archive
- `WritingPage` — output and collection overview
- `CollectionPage` — shared topic/column presentation
- `ArticlePage` — article reader and localized controls
- `ContactPage` — collaboration conversion
- locale content/data modules — shared bilingual interface text

Article parsing behavior remains compatible with the current Markdown format.

## Error and Empty States

- Missing article Markdown shows a localized unavailable state rather than remaining on “Loading.”
- Failed fetches distinguish failure from initial loading.
- Unknown article and unpublished collection routes redirect to `/writing`.
- Roundtable submission errors remain inline and preserve the user’s question and expert choices.

## Accessibility

- One page-level `h1` per route.
- Navigation drawer exposes `aria-expanded`, `aria-controls`, and a descriptive label.
- All interactive elements meet a minimum 44 CSS pixel touch target on mobile.
- Visible `:focus-visible` treatment is provided for links, buttons, cards, and form controls.
- Color contrast remains sufficient for body text, metadata, and disabled states.
- Page changes move focus or scroll to the top so client-side navigation does not leave users in the previous scroll position.

## Testing and Verification

Automated behavioral tests are added before implementation for:

- Chinese first-visit default and persisted locale switching
- public collection filtering
- legacy route redirects
- mobile menu open and close behavior
- localized article controls and reading-time calculation
- missing-article error handling

Verification includes:

- full test suite
- ESLint
- production build
- Playwright checks at 1440×1000 and 390×844
- no horizontal overflow on every route template
- console and page-error checks
- visual screenshots for Home, Work, Writing, Now, Roundtable, populated collection, long article, and Contact in both viewports

## Acceptance Criteria

The redesign is complete when:

1. Chinese is the first-visit default and every non-article public page has a complete English equivalent.
2. Mobile navigation remains within 64 CSS pixels when closed and is keyboard accessible.
3. Home, Work, Writing, Now, Contact, Lab, Collection, and Article have distinct purposes and stable routes.
4. Empty columns are absent from public lists.
5. The Work and Writing content is no longer combined into the previous 10,000-pixel mobile Output page.
6. The homepage removes repeated proof/capability sections while retaining concrete evidence.
7. The article reader includes localized metadata, reading progress, reading time, and nonempty pager cells only.
8. All route templates pass automated checks without console errors or horizontal overflow.

