from pathlib import Path
from playwright.sync_api import sync_playwright

url = "http://127.0.0.1:5173/articles/2026-07-09-after-watching-dragon-year-archive"
screenshot = Path(__file__).with_name("task-5-title-390.png").resolve()

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=1)
    page.goto(url)
    page.wait_for_load_state("networkidle")
    title = page.locator(".article-hero h1")
    title.wait_for()
    metrics = title.evaluate("""element => {
      const style = getComputedStyle(element)
      const box = element.getBoundingClientRect()
      const lineHeight = parseFloat(style.lineHeight)
      return {
        text: element.textContent,
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
        height: box.height,
        lines: Math.round(box.height / lineHeight),
        overflow: style.overflow,
        textOverflow: style.textOverflow,
      }
    }""")
    title.screenshot(path=str(screenshot))
    print(metrics)
    print(f"screenshot={screenshot}")
    browser.close()
