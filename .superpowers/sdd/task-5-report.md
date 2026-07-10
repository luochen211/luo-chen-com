# Task 5 Report: Shared Collection and Article Reader

## Status

Implemented the shared collection view and extracted article reader/helpers.

## Changes

- Added article parsing, relationship, lookup, and locale-aware reading-time helpers in `src/lib/articles.js`.
- Added a reusable `CollectionView` for topic and column routes, including localized article metadata, article count, latest update, start-here entry, and series grouping.
- Added an extracted `ArticlePage` with explicit loading/ready/error request states, HTTP and network failure handling, localized metadata, reading time, scroll progress, conditional pager links, and localized series/related navigation.
- Updated routing to use the shared views and redirect missing/unpublished collections through `findColumn` to `/writing`.
- Constrained reader width to 800px and added mobile-specific article title scaling.

## TDD Evidence

- RED reading helpers: `npm test -- src/lib/articles.test.js` failed because `./articles` did not exist.
- GREEN reading helpers: 3/3 tests passed after implementation.
- RED article state: `npm test -- src/pages/ArticlePage.test.jsx` failed because `./ArticlePage` did not exist.
- GREEN article state: failure-state and reading-time tests passed after implementation.

## Verification

- `npm test`: 7 files, 37 tests passed.
- `npm run lint`: passed with no errors.
- `npm run build`: passed; Vite transformed 58 modules and emitted the production bundle.

## Self-review

- Existing Markdown block support remains unchanged: frontmatter, H1/H2, paragraphs, quotes, ordered/unordered lists, and bold inline spans.
- Article files and the site data/API contract were not modified.
- Missing Markdown responds with localized unavailable copy rather than remaining in loading state.
- Pager markup emits links only; it does not add empty placeholder cells.

## Concerns

- Reading progress relies on document-level scroll height, which is appropriate for the current single-column page shell.
