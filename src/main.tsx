import { hydrateRoot, createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles.css'
import './refinements.css'

const root = document.getElementById('root')!
const base = import.meta.env.BASE_URL.replace(/\/$/, '')
const app = (
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <App />
  </BrowserRouter>
)
const normalize = (path: string) => path.replace(/\/$/, '') || '/'
const currentPath = window.location.pathname.slice(base.length) || '/'
// A static host may serve index.html as a fallback for unknown routes.
// Hydrate only when its prerendered document belongs to the current route.
if (root.querySelector('main') && normalize(root.dataset.page || '') === normalize(currentPath))
  hydrateRoot(root, app)
else createRoot(root).render(app)
