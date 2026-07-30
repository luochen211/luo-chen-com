from pathlib import Path
from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public/slides/decks/dag-efficient-development/test-screens"
OUT.mkdir(parents=True, exist_ok=True)

issues = []
console_errors = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
    page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
    page.goto("http://127.0.0.1:4173/slides/decks/dag-efficient-development/index.html?slide=1")
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(1400)

    assert page.locator("section.slide").count() == 17
    assert page.locator("#nav .dot").count() == 17

    for index in range(17):
        page.locator("#nav .dot").nth(index).click()
        page.wait_for_timeout(2200)
        page.screenshot(path=str(OUT / f"slide-{index + 1:02d}.png"))
        if index == 3:
            page.screenshot(
                path=str(ROOT / "public/slides/decks/dag-efficient-development/preview.png")
            )

        overflow = page.evaluate(
            """(index) => {
              const slide = document.querySelectorAll('section.slide')[index];
              const selectors = 'h1,h2,h3,h4,p,li,.t-meta,.t-cat,.lead,.body,.body-sm,.label,.stmt-anchor,.sys-note';
              return [...slide.querySelectorAll(selectors)]
                .filter(el => {
                  const s = getComputedStyle(el);
                  const r = el.getBoundingClientRect();
                  return s.display !== 'none' && s.visibility !== 'hidden' &&
                    Number(s.opacity || 1) > 0 && r.width > 1 && r.height > 1 &&
                    (r.left < -2 || r.right > innerWidth + 2 || r.top < -2 || r.bottom > innerHeight * .935);
                })
                .map(el => ({
                  tag: el.tagName,
                  text: (el.textContent || '').trim().slice(0, 80),
                  rect: Object.fromEntries(['left','right','top','bottom','width','height'].map(k => [k, el.getBoundingClientRect()[k]]))
                }));
            }""",
            index,
        )
        if overflow:
            issues.append({"slide": index + 1, "overflow": overflow})

    page.keyboard.press("Escape")
    page.wait_for_timeout(250)
    assert page.locator("#overview").evaluate("(el) => getComputedStyle(el).display") == "block"
    page.keyboard.press("Escape")
    page.keyboard.press("b")
    page.wait_for_timeout(250)
    assert page.locator("body").evaluate("(el) => el.classList.contains('low-power')")
    page.keyboard.press("b")
    page.keyboard.press("Home")
    page.wait_for_timeout(800)
    page.keyboard.press("ArrowRight")
    page.wait_for_timeout(850)
    assert "translateX(-100vw)" in page.locator("#deck").get_attribute("style")
    browser.close()

print({"layout_issues": issues, "console_errors": console_errors})
