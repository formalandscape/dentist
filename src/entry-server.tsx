import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'
export { seoForPath, schema, publicUrl } from './lib/seo'
export { services, servicePath } from './data/services'

export function render(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return renderToString(
    <StaticRouter basename={base || '/'} location={`${base}${path}`}>
      <App />
    </StaticRouter>,
  )
}
