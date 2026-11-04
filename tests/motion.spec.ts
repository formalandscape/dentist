import { test, expect } from './fixtures'

async function steady(page: import('@playwright/test').Page, path: string) {
  await expect(page.locator('.page-content')).toHaveAttribute('data-page', path)
  await expect(page.locator('#main-content')).toHaveAttribute('data-motion-phase', 'steady')
}

test('page exit precedes entry without empty frames or a replaced header', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto('/dentist/')
  await page.evaluate(() => {
    const w = window as typeof window & { framesLog: unknown[]; recordFrames: boolean }
    w.framesLog = []
    w.recordFrames = true
    const header = document.querySelector('header')
    const frame = (time: number) => {
      const scene = document.querySelector<HTMLElement>('.page-content')
      w.framesLog.push({
        time,
        path: scene?.dataset.page,
        count: document.querySelectorAll('.page-content').length,
        opacity: scene ? +getComputedStyle(scene).opacity : 0,
        phase: document.querySelector<HTMLElement>('main')?.dataset.motionPhase,
        sameHeader: header === document.querySelector('header'),
      })
      if (w.recordFrames) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  })
  await page.locator('.desktop-nav a[href$="vash-shliakh-do-posmishky/"]').click()
  await steady(page, '/vash-shliakh-do-posmishky/')
  const frames = await page.evaluate(() => {
    const w = window as typeof window & {
      framesLog: Array<{
        time: number
        path: string
        count: number
        opacity: number
        phase: string
        sameHeader: boolean
      }>
      recordFrames: boolean
    }
    w.recordFrames = false
    return w.framesLog
  })
  expect(frames.every((f) => f.count === 1 && f.opacity > 0.09 && f.sameHeader)).toBe(true)
  const leaving = frames.find((f) => f.phase === 'leaving')!
  const entered = frames.find((f) => f.path === '/vash-shliakh-do-posmishky/')!
  expect(leaving).toBeTruthy()
  expect(entered.time - leaving.time).toBeGreaterThan(180)
  expect(frames.some((f) => f.path === '/vash-shliakh-do-posmishky/' && f.opacity < 0.9)).toBe(true)
  expect(errors).toEqual([])
})

test('navigation remains interactive and the latest click wins during exit', async ({ page }) => {
  await page.goto('/dentist/')
  await page
    .locator('.desktop-nav a[href$="vash-shliakh-do-posmishky/"]')
    .dispatchEvent('click', { button: 0 })
  await page.waitForTimeout(70)
  await page.locator('.header-appointment').dispatchEvent('click', { button: 0 })
  await expect(page).toHaveURL(/\/dentist\/#appointment$/)
  await steady(page, '/')
  await expect(page.locator('#appointment')).toBeInViewport()
  await expect(page.locator('#name')).toBeEnabled()
  expect(
    await page.locator('header').evaluate((el) => getComputedStyle(el).pointerEvents),
  ).not.toBe('none')
})

test('back and forward animate and restore the saved scroll position', async ({ page }) => {
  await page.goto('/dentist/#services')
  await expect(page.locator('#services')).toBeInViewport()
  await page
    .locator('.service-card')
    .first()
    .evaluate((el) =>
      el.addEventListener(
        'click',
        () => {
          ;(window as typeof window & { departureY: number }).departureY = scrollY
        },
        { capture: true, once: true },
      ),
    )
  await page.locator('.service-card').first().click()
  const before = await page.evaluate(
    () => (window as typeof window & { departureY: number }).departureY,
  )
  await steady(page, '/poslugy/brekety/')
  expect(await page.evaluate(() => scrollY)).toBeLessThan(3)
  await page.goBack()
  await steady(page, '/')
  await expect
    .poll(async () => Math.abs((await page.evaluate(() => scrollY)) - before))
    .toBeLessThan(6)
  await page.goForward()
  await steady(page, '/poslugy/brekety/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Брекет-системи')
})

test('step details fade out before changing and rapid keyboard choices settle correctly', async ({
  page,
}) => {
  await page.goto('/dentist/vash-shliakh-do-posmishky/')
  const tabs = page.getByRole('tab')
  await tabs.first().focus()
  await tabs.first().press('End')
  await expect(page.locator('.journey-panels')).toHaveAttribute('aria-busy', 'true')
  await expect(page.locator('#journey-panel-0')).toBeVisible()
  await expect(page.locator('#journey-panel-5')).toBeVisible()
  await tabs.last().press('Home')
  await tabs.first().press('ArrowDown')
  await expect(page.locator('#journey-panel-1')).toBeVisible()
  await expect(page.locator('.journey-panels')).toHaveAttribute('aria-busy', 'false')
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tabpanel')).toHaveCount(1)
  const rail = page.locator('.journey-rail > span')
  await page.locator('#journey-stages').scrollIntoViewIfNeeded()
  const start = await rail.evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).d)
  await page.evaluate(() => {
    const el = document.getElementById('journey-stages')!
    scrollTo({ top: el.offsetTop + el.offsetHeight - innerHeight / 2, behavior: 'instant' })
  })
  await expect
    .poll(async () =>
      rail.evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).d),
    )
    .toBeGreaterThan(start + 0.1)
})

test('switching reduced motion on mid-transition cancels movement immediately', async ({
  page,
}) => {
  await page.goto('/dentist/')
  await page
    .locator('.desktop-nav a[href$="vash-shliakh-do-posmishky/"]')
    .dispatchEvent('click', { button: 0 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('.page-content')).toHaveAttribute(
    'data-page',
    '/vash-shliakh-do-posmishky/',
    { timeout: 1200 },
  )
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced')
  await expect
    .poll(async () =>
      page
        .locator('h1 .motion-word')
        .evaluateAll((elements) => elements.every((el) => getComputedStyle(el).opacity === '1')),
    )
    .toBe(true)
  expect(await page.locator('html').evaluate((el) => getComputedStyle(el).scrollBehavior)).toBe(
    'auto',
  )
  await page.getByRole('tab').last().click()
  await expect(page.locator('#journey-panel-5')).toBeVisible({ timeout: 500 })
  await expect
    .poll(async () =>
      page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length),
    )
    .toBe(0)
})

test('animated typography fits every page on mobile, tablet and desktop', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const path of [
      '',
      'poslugy/brekety/',
      'poslugy/elainery/',
      'poslugy/dytiacha-ortodontiia/',
      'poslugy/hnatolohiia/',
      'vash-shliakh-do-posmishky/',
      'polityka-konfidentsiinosti/',
    ]) {
      await page.goto(`/dentist/${path}`)
      await expect(page.locator('h1')).toBeVisible()
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${path} at ${width}`,
      ).toBe(true)
    }
  }
})
