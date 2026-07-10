# Final review fixes report

## Scope completed

- Guarded `/articles/:slug` against the authored article index before mounting the reader. Unknown slugs now replace-navigate to `/writing` and cannot issue an arbitrary Markdown request.
- Kept indexed-article request failures in the localized reader unavailable state and set a localized unavailable document title, eliminating stale titles.
- Added pathname-driven client navigation reset: instant top scroll plus programmatic focus on the main landmark (`tabIndex=-1`, no visual outline).
- Upgraded the mobile drawer to modal semantics with `role="dialog"`, `aria-modal`, Tab/Shift+Tab containment, inert background content, Escape/backdrop/route close, and trigger focus return.
- Added direct regression coverage for the final selected expert and unpublished empty-column redirect.
- Expanded the production browser audit to cover English and Chinese for every route template on desktop and mobile, plus unknown article/unpublished column negatives, no unknown Markdown request, drawer containment/inert behavior, navigation reset, and reduced motion.
- Removed the obsolete page implementations from `App.jsx`; routes now use only the focused page modules. This reduced `App.jsx` by roughly 900 lines without changing authored Markdown or the roundtable API request contract.
- Upgraded `react-router-dom` and transitive `react-router` from 7.13.0 to the minimal advisory-clearing compatible release, 7.16.0.

## TDD evidence

Initial focused RED command:

```text
npm test -- src/App.test.jsx src/pages/ArticlePage.test.jsx src/components/SiteNav.test.jsx src/pages/RoundtablePage.test.jsx
```

Expected failures observed: 5 failures covering unknown article redirect/no fetch, navigation scroll/focus reset, forward/backward drawer focus trapping, inert/modal drawer semantics, and localized failed-article title. The direct last-expert and unpublished-column tests passed immediately because those protections already existed.

Focused GREEN command:

```text
npm test -- src/App.test.jsx src/pages/ArticlePage.test.jsx src/components/SiteNav.test.jsx src/pages/RoundtablePage.test.jsx
```

Result: 4 files passed, 26 tests passed.

## Dependency audit

Before upgrade:

```text
npm audit --omit=dev --audit-level=high
```

Result: 2 high-severity production findings through `react-router-dom@7.13.0` / `react-router@7.13.0`.

Upgrade and audit:

```text
npm install react-router-dom@7.16.0
npm ls react-router-dom react-router
npm audit --omit=dev --audit-level=high
```

Result: both router packages resolve to 7.16.0; production audit reports `found 0 vulnerabilities`.

## Verification

```text
npm test
```

Result: 9 files passed, 48 tests passed.

```text
npm run lint
```

Result: exit 0, no ESLint findings.

```text
npm run build
```

Result: Vite 7.3.1 build succeeded, 59 modules transformed.

```text
npm run preview -- --host 127.0.0.1
node scripts/audit-site.mjs
```

Result: 32 localized route/viewport checks passed (8 route templates × 2 locales × 2 viewports); unknown article and unpublished column negative checks passed; route scroll/focus reset passed; drawer containment/inert checks passed; reduced-motion preference passed. Screenshots were written to `/tmp/luochen-site-redesign-audit`.

## Concerns

- No remaining high-severity production dependency findings.
- `npm install` reports development-tree findings when auditing all dependencies, but the required production-only audit is clean. No production runtime package finding remains.
- The browser audit validates the built app through Vite preview. Hosting-provider redirects/configuration remain outside this local audit.
