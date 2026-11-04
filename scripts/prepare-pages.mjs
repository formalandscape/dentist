import fs from 'node:fs/promises'

// Pages is already configured to serve main/(root). Keep editable application
// sources in src/ and copy only the verified public build into the publishing root.
const allowed = new Set([
  'index.html',
  '404.html',
  '.nojekyll',
  'favicon.svg',
  'robots.txt',
  'sitemap.xml',
  'assets',
  'images',
  'poslugy',
  'polityka-konfidentsiinosti',
])
const entries = await fs.readdir('dist')
if (!entries.includes('sitemap.xml') || !entries.includes('.nojekyll')) {
  throw new Error('Run npm run build:pages before preparing the public root.')
}
for (const entry of entries) {
  if (!allowed.has(entry)) throw new Error(`Unexpected build output: ${entry}`)
}
for (const entry of entries) {
  if (['assets', 'images', 'poslugy', 'polityka-konfidentsiinosti'].includes(entry)) {
    await fs.rm(entry, { recursive: true, force: true })
  }
  await fs.cp(`dist/${entry}`, entry, { recursive: true, force: true })
}
console.log('Prepared verified GitHub Pages files in main/(root). Editable HTML: src/index.html.')
