from pathlib import Path
from tempfile import mkdtemp
from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
DECK = ROOT / "public/slides/decks/three-hour-mini-program"
OUT = Path(mkdtemp(prefix="three-hour-mini-program-screens-"))

issues = []
console_errors = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(
        viewport={"width": 1440, "height": 900}, device_scale_factor=1
    )
    page.on(
        "console",
        lambda msg: console_errors.append(msg.text) if msg.type == "error" else None,
    )
    page.goto(
        "http://127.0.0.1:4173/slides/decks/three-hour-mini-program/index.html?slide=1"
    )
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(1400)

    assert page.locator("section.slide").count() == 27
    assert page.locator("#nav .dot").count() == 27

    for index in range(27):
        page.locator("#nav .dot").nth(index).click()
        page.wait_for_timeout(900)
        page.screenshot(path=str(OUT / f"slide-{index + 1:02d}.png"))
        if index == 0:
            page.screenshot(path=str(DECK / "preview.png"))

        overflow = page.evaluate(
            """(index) => {
              const slide = document.querySelectorAll('section.slide')[index];
              const selectors = 'h1,h2,h3,h4,p,li,.t-meta,.t-cat,.lead,.deck-lead,.source-note';
              return [...slide.querySelectorAll(selectors)]
                .filter(el => {
                  const s = getComputedStyle(el);
                  const r = el.getBoundingClientRect();
                  return s.display !== 'none' && s.visibility !== 'hidden' &&
                    Number(s.opacity || 1) > 0 && r.width > 1 && r.height > 1 &&
                    (r.left < -2 || r.right > innerWidth + 2 ||
                     r.top < -2 || r.bottom > innerHeight * .935);
                })
                .map(el => ({
                  tag: el.tagName,
                  text: (el.textContent || '').trim().slice(0, 80),
                  rect: Object.fromEntries(
                    ['left','right','top','bottom','width','height']
                      .map(k => [k, el.getBoundingClientRect()[k]])
                  )
                }));
            }""",
            index,
        )
        if overflow:
            issues.append({"slide": index + 1, "overflow": overflow})

    page.keyboard.press("Escape")
    page.wait_for_timeout(250)
    assert (
        page.locator("#overview").evaluate("(el) => getComputedStyle(el).display")
        == "block"
    )
    page.keyboard.press("Escape")
    page.keyboard.press("b")
    page.wait_for_timeout(250)
    assert page.locator("body").evaluate(
        "(el) => el.classList.contains('low-power')"
    )
    page.keyboard.press("b")
    page.keyboard.press("Home")
    page.wait_for_timeout(850)
    page.mouse.click(20, 20)
    page.keyboard.press("ArrowRight")
    page.wait_for_timeout(700)
    assert page.evaluate("window.__currentSlideIndex") == 1

    page.goto("http://127.0.0.1:4173/slides/")
    page.wait_for_load_state("networkidle")
    assert page.locator(
        'a[href="/slides/decks/three-hour-mini-program/"]'
    ).count() >= 1
    browser.close()

assert not issues, issues
assert not console_errors, console_errors
print({"slides": 27, "layout_issues": issues, "console_errors": console_errors})
