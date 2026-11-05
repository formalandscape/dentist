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

test('decorative numbering is absent in service cards and every mentorship block', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/dentist/')
  await expect(page.locator('.service-card')).toHaveCount(4)
  await expect(page.locator('.service-number')).toHaveCount(0)
  for (const language of ['', 'en/']) {
    await page.goto(`/dentist/${language}mentorstvo/`)
    await expect(
      page.locator(
        '.mentorship-index, .mentorship-stage-number, .mentorship-rail, .mentorship-visual-rule',
      ),
    ).toHaveCount(0)
    await expect(
      page.locator('.mentorship-visual-caption > span, .mentorship-card-top > span'),
    ).toHaveCount(0)
    await expect(page.locator('.mentorship-card')).toHaveCount(4)
    await expect(page.locator('.mentorship-topic')).toHaveCount(5)
    await expect(page.locator('.mentorship-stage')).toHaveCount(4)
    await expect(page.locator('.mentorship-visual .editorial-photo')).toBeVisible()
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      )
      for (const selector of ['.mentorship-topic', '.mentorship-stage']) {
        const inset = await page
          .locator(selector)
          .first()
          .evaluate(
            (el) =>
              el.querySelector('h3')!.getBoundingClientRect().left -
              el.getBoundingClientRect().left,
          )
        expect(inset).toBeLessThan(3)
      }
    }
  }
})

test('slow scroll starts a single smooth entrance before the unit is visible, without clipping', async ({
  page,
}) => {
  await page.goto('/dentist/mentorstvo/')
  const topic = page.locator('.mentorship-topic').first()
  await expect(topic).toHaveAttribute('data-motion-unit', 'true')
  await topic.evaluate((el) => {
    scrollTo({
      top: el.getBoundingClientRect().top + scrollY - innerHeight - 185,
      behavior: 'instant',
    })
  })
  // Let the deliberate positioning jump finish; subsequent input models a slow wheel gesture.
  await page.waitForTimeout(280)
  await page.evaluate(() => scrollBy({ top: 40, behavior: 'instant' }))
  await expect(topic).toHaveAttribute('data-scroll-state', 'running')
  const evidence = await topic.evaluate(async (el) => {
    const read = () => {
      const style = getComputedStyle(el)
      const matrix = new DOMMatrixReadOnly(style.transform)
      return { y: matrix.f, opacity: +style.opacity, scale: matrix.a, clip: style.clipPath }
    }
    const animations = el.getAnimations().filter((a) => a.id === 'scroll-reveal')
    const duration = animations[0]?.effect?.getTiming().duration
    const samples = [read()]
    for (let i = 0; i < 5; i++) {
      await new Promise((resolve) => setTimeout(resolve, 80))
      samples.push(read())
    }
    const targets = document
      .getAnimations()
      .filter((a) => a.id === 'scroll-reveal')
      .map((a) => (a.effect as KeyframeEffect).target as Element)
    return {
      duration,
      samples,
      nested: targets.some((a) => targets.some((b) => a !== b && a.contains(b))),
      masks: [...document.querySelectorAll('.motion-word-mask')].every(
        (word) => getComputedStyle(word).overflow === 'visible',
      ),
    }
  })
  expect(Number(evidence.duration)).toBeGreaterThanOrEqual(1300)
  expect(
    evidence.samples.every(
      (s) => s.y >= 0 && s.y <= 6.1 && s.opacity >= 0.95 && s.scale === 1 && s.clip === 'none',
    ),
  ).toBe(true)
  for (let i = 1; i < evidence.samples.length; i++) {
    expect(evidence.samples[i].y).toBeLessThanOrEqual(evidence.samples[i - 1].y + 0.01)
    expect(evidence.samples[i].opacity).toBeGreaterThanOrEqual(
      evidence.samples[i - 1].opacity - 0.001,
    )
  }
  expect(evidence.nested).toBe(false)
  expect(evidence.masks).toBe(true)
})

test('rapid scrolling keeps content readable, settles promptly and never replays completed reveals', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/dentist/')
  const result = await page.evaluate(async () => {
    const samples: number[] = []
    for (const id of ['services', 'faq', 'appointment', 'services', 'about', 'contacts', 'faq']) {
      const el = document.getElementById(id)!
      scrollTo({ top: el.getBoundingClientRect().top + scrollY - 110, behavior: 'instant' })
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      )
      for (const target of document.querySelectorAll<HTMLElement>('[data-motion-unit]')) {
        const rect = target.getBoundingClientRect()
        if (rect.top < innerHeight && rect.bottom > 100)
          samples.push(+getComputedStyle(target).opacity)
      }
    }
    return { samples, skipped: document.querySelectorAll('[data-scroll-state="skipped"]').length }
  })
  expect(result.samples.length).toBeGreaterThan(0)
  expect(Math.min(...result.samples)).toBeGreaterThanOrEqual(0.9)
  expect(result.skipped).toBeGreaterThan(0)
  await expect
    .poll(
      () =>
        page.evaluate(
          () =>
            document
              .getAnimations()
              .filter((a) => a.id === 'scroll-reveal' && a.playState === 'running').length,
        ),
      { timeout: 1000 },
    )
    .toBe(0)
  await page
    .locator('#services')
    .evaluate((el) =>
      scrollTo({ top: el.getBoundingClientRect().top + scrollY - 110, behavior: 'instant' }),
    )
  await page.waitForTimeout(150)
  expect(
    await page
      .locator('.service-card')
      .evaluateAll((els) =>
        els.every((el) => el.getAnimations().filter((a) => a.id === 'scroll-reveal').length === 0),
      ),
  ).toBe(true)
  expect(
    await page
      .locator('.editorial-photo')
      .evaluateAll((els) =>
        els.every(
          (el) =>
            getComputedStyle(el).clipPath === 'none' && getComputedStyle(el).transform === 'none',
        ),
      ),
  ).toBe(true)
})
