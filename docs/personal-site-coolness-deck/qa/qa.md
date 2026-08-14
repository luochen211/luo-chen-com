# QA

| Check | Result | Evidence |
|---|---|---|
| Remotion composition loads | pass | `CoolnessDeck`, 1920x1080, 30fps |
| Dynamic render | pass | `final/coolness-deck.mp4`, H.264, 55.06s |
| Still-frame visual check | pass | `final/coolness-deck-frame-330.png` |
| Lint | pass | `npm run lint` |
| Existing site build | pass | `npm run build` |
| Git diff whitespace | pass | `git diff --check` |

## Note

Remotion's bundled Chrome download initially timed out. Rendering succeeded by explicitly using the installed Chrome executable and `--concurrency=1`.
