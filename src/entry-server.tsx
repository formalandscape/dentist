import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'
export { seoForPath, schema, schemaForPath, publicUrl } from './lib/seo'
export { services, servicePath } from './data/services'
export { journeyPath } from './data/journey'

export function render(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return renderToString(
    <StaticRouter basename={import.meta.env.BASE_URL} location={`${base}${path}`}>
      <App />
    </StaticRouter>,
  )
}

export { localizedPath, withoutLanguage, languageForPath } from './lib/locale'
