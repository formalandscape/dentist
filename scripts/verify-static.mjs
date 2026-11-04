import fs from 'node:fs/promises'
import assert from 'node:assert/strict'
import { loadEnv } from 'vite'

const env = { ...loadEnv('production', process.cwd(), ''), ...process.env }
const base = env.VITE_BASE_PATH || '/'
const origin = env.VITE_SITE_URL?.replace(/\/$/, '')
const paths = [
  '/',
  '/poslugy/brekety/',
  '/poslugy/elainery/',
  '/poslugy/dytiacha-ortodontiia/',
  '/poslugy/hnatolohiia/',
  '/polityka-konfidentsiinosti/',
]
const descriptions = new Set()
const titles = new Set()
for (const path of paths) {
  const html = await fs.readFile(`dist${path}index.html`, 'utf8')
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${path}: exactly one h1`)
  assert.ok(!html.includes('<!--app-->'), `${path}: actual prerendered content`)
  const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/)?.[1]
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1]
  assert.ok(description && !descriptions.has(description), `${path}: unique description`)
  assert.ok(title && !titles.has(title), `${path}: unique title`)
  descriptions.add(description)
  titles.add(title)
  assert.ok(html.includes('lang="uk"'), `${path}: Ukrainian document`)
  assert.ok(html.includes(`src="${base}assets/`), `${path}: script respects base path`)
  assert.ok(html.includes(`href="${base}favicon.svg"`), `${path}: favicon respects base path`)
  if (origin) {
    assert.ok(html.includes(`rel="canonical" href="${origin}${base}${path.slice(1)}"`))
    assert.ok(html.includes(`property="og:image" content="${origin}${base}images/social-card.png"`))
  } else assert.ok(!html.includes('rel="canonical"'), 'No invented canonical domain')
}
const home = await fs.readFile('dist/index.html', 'utf8')
assert.ok(home.includes('"@type":"Physician"'))
assert.ok(home.includes('tel:+380679404225'))
assert.ok(home.includes(`href="${base}poslugy/brekety/"`), 'Prerendered links respect base path')
assert.ok((await fs.readFile('dist/404.html', 'utf8')).includes('noindex, follow'))
const cssFiles = (await fs.readdir('dist/assets')).filter((f) => f.endsWith('.css'))
const css = (await Promise.all(cssFiles.map((f) => fs.readFile(`dist/assets/${f}`, 'utf8')))).join(
  '',
)
assert.ok(css.includes(`${base}images/editorial-still-life.webp`), 'Photo respects base path')
const robots = await fs.readFile('dist/robots.txt', 'utf8')
if (origin) {
  assert.ok(robots.includes(`Sitemap: ${origin}${base}sitemap.xml`))
  const sitemap = await fs.readFile('dist/sitemap.xml', 'utf8')
  for (const path of paths)
    assert.ok(sitemap.includes(`<loc>${origin}${base}${path.slice(1)}</loc>`))
} else {
  assert.ok(!robots.includes('Sitemap:'))
  await assert.rejects(fs.access('dist/sitemap.xml'))
}
console.log(
  `Static checks passed: 6 pages, SEO, schema, 404, assets, robots${origin ? ', canonical, sitemap' : ' (domain pending)'}. Base: ${base}`,
)
