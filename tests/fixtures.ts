import { test as base } from '@playwright/test'
export { expect } from '@playwright/test'

// Google is external to the app and blocked in the cloud test environment.
// Verify the real iframe URL separately; keep UI tests deterministic without third-party traffic.
export const test = base.extend({
  context: async ({ context }, use) => {
    await context.route('https://www.google.com/maps**', (route) =>
      route.fulfill({
        contentType: 'text/html',
        body: '<!doctype html><html lang="en"><head><title>Map test fixture</title></head><body></body></html>',
      }),
    )
    await use(context)
  },
})
