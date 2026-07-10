import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

const baseUrl = process.env.AUDIT_BASE_URL ?? 'http://127.0.0.1:4173'
const outputDir = process.env.AUDIT_OUTPUT_DIR ?? '/tmp/luochen-site-redesign-audit'
const routes = [
  ['home', '/'],
  ['work', '/work'],
  ['writing', '/writing'],
  ['now', '/now'],
  ['roundtable', '/lab/roundtable'],
  ['column', '/columns/where-do-we-go'],
  ['article', '/articles/2026-07-05-where-do-we-go-preface'],
  ['contact', '/contact'],
]
const viewports = [
  ['desktop', { width: 1440, height: 1000 }],
  ['mobile', { width: 390, height: 844 }],
]

await mkdir(outputDir, { recursive: true })

const browser = await chromium.launch({ headless: true })
let failures = 0

try {
  for (const [label, viewport] of viewports) {
    for (const [name, route] of routes) {
      const context = await browser.newContext({ viewport })
      await context.addInitScript(() => window.localStorage.setItem('site-locale', 'en'))
      const page = await context.newPage()
      const consoleErrors = []
      const pageErrors = []

      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text())
      })
      page.on('pageerror', (error) => pageErrors.push(error.message))

      try {
        const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' })
        if (!response?.ok()) throw new Error(`HTTP ${response?.status() ?? 'no response'}: ${route}`)

        await page.locator('h1').waitFor({ state: 'visible' })
        const metrics = await page.evaluate(() => {
          const mobileNav = document.querySelector('.mobile-nav-shell')
          return {
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
            h1Count: document.querySelectorAll('h1').length,
            closedNavHeight: mobileNav?.getBoundingClientRect().height ?? 0,
          }
        })

        if (metrics.scrollWidth > metrics.clientWidth) throw new Error(`overflow: ${route}`)
        if (metrics.h1Count !== 1) throw new Error(`invalid h1 count: ${route}`)
        if (consoleErrors.length) throw new Error(`console errors: ${route}: ${consoleErrors.join(' | ')}`)
        if (pageErrors.length) throw new Error(`page errors: ${route}: ${pageErrors.join(' | ')}`)
        if (label === 'mobile' && metrics.closedNavHeight > 64) {
          throw new Error(`mobile nav too tall: ${route}: ${metrics.closedNavHeight}px`)
        }

        // Exercise scroll-driven reveals before taking a full-page visual artifact.
        const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight)
        for (let y = 0; y < pageHeight; y += Math.max(400, Math.floor(viewport.height * 0.75))) {
          await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y)
          await page.waitForTimeout(35)
        }
        await page.evaluate(() => window.scrollTo(0, 0))
        await page.waitForTimeout(100)

        const screenshot = path.join(outputDir, `${label}-${name}.png`)
        await page.screenshot({ path: screenshot, fullPage: true })
        console.log(
          `PASS ${label.padEnd(7)} ${route.padEnd(52)} ` +
          `width=${metrics.scrollWidth}/${metrics.clientWidth} h1=${metrics.h1Count} nav=${metrics.closedNavHeight}px`,
        )

        if (label === 'mobile' && name === 'home') {
          await page.locator('.menu-toggle').click()
          await page.locator('.mobile-menu-panel').waitFor({ state: 'visible' })
          await page.screenshot({ path: path.join(outputDir, 'mobile-home-drawer.png'), fullPage: true })
          if (await page.locator('.mobile-menu-panel').count() !== 1) throw new Error('drawer panel missing')
          await page.keyboard.press('Escape')
          await page.locator('.mobile-menu').waitFor({ state: 'hidden' })

          await page.locator('.menu-toggle').click()
          await page.locator('.mobile-menu-secondary .lang-toggle').click()
          await page.waitForFunction(() => document.documentElement.lang === 'zh-CN')
          await page.keyboard.press('Escape')
          await page.locator('.mobile-menu').waitFor({ state: 'hidden' })
          await page.waitForTimeout(900)
          const localizedHeight = await page.evaluate(() => document.documentElement.scrollHeight)
          for (let y = 0; y < localizedHeight; y += Math.max(400, Math.floor(viewport.height * 0.75))) {
            await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y)
            await page.waitForTimeout(35)
          }
          await page.evaluate(() => window.scrollTo(0, 0))
          await page.waitForTimeout(100)
          await page.screenshot({ path: path.join(outputDir, 'mobile-home-zh.png'), fullPage: true })
        }
      } catch (error) {
        failures += 1
        console.error(`FAIL ${label} ${route}: ${error.message}`)
      } finally {
        await context.close()
      }
    }
  }
} finally {
  await browser.close()
}

if (failures) {
  console.error(`Audit failed: ${failures} route/viewport checks failed.`)
  process.exit(1)
}

console.log(`Audit passed: ${routes.length * viewports.length} route/viewport checks; screenshots: ${outputDir}`)
