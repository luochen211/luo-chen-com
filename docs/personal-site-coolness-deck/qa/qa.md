# QA

| Check | Result | Evidence |
|---|---|---|
| Web deck page structure | pass | 14 pages: 1 cover + 13 demo pages |
| Requested terms | pass | 13 exact terms, 13 dedicated demo titles |
| Browser interaction check | pass | pointer, hover, click and scroll demos verified in Chrome |
| Local asset loading | pass | no 4xx responses; Motion loaded from `/slides/assets/motion.min.js` |
| Tests | pass | `npm test`, 14 files / 75 tests |
| Lint | pass | `npm run lint` |
| Existing site build | pass | `npm run build` |
| Git diff whitespace | pass | `git diff --check` |

## Note

Remotion's bundled Chrome download initially timed out. Rendering succeeded by explicitly using the installed Chrome executable and `--concurrency=1`.
