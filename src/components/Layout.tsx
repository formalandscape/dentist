import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowUp, ArrowUpRight, Instagram, Menu, Phone, X } from 'lucide-react'
import { Link, useLocation, useNavigationType } from 'react-router-dom'
import { site } from '../data/site'
import { Brand } from './ui'
import { publicUrl, seoForPath } from '../lib/seo'
import { journeyPath } from '../data/journey'
import { silk } from '../motion/presets'

const navItems = [
  { label: 'Про лікаря', to: '/#about' },
  { label: 'Напрями лікування', to: '/#services' },
  { label: 'Мій підхід', to: '/#approach' },
  { label: 'Ваш шлях', to: journeyPath },
  { label: 'Запитання', to: '/#faq' },
  { label: 'Контакти', to: '/#contacts' },
]

export function RouteEffects() {
  const { pathname, hash, key } = useLocation()
  const reduced = useReducedMotion()
  const first = useRef(true)
  const navigation = useNavigationType()
  const previous = useRef<{ key: string; pathname: string } | null>(null)
  const positions = useRef(new Map<string, number>())
  const applied = useRef('')
  useEffect(() => {
    const original = history.scrollRestoration
    history.scrollRestoration = 'manual'
    return () => {
      history.scrollRestoration = original
    }
  }, [])
  useEffect(() => {
    if (previous.current && previous.current.key !== key)
      positions.current.set(previous.current.key, window.scrollY)
    const changedPage = !!previous.current && previous.current.pathname !== pathname
    previous.current = { key, pathname }
    let frame = 0
    let arrival: Animation | undefined
    function apply() {
      const scene = document.querySelector<HTMLElement>('.page-content[data-page]')
      if (scene?.dataset.page !== pathname || applied.current === key) return
      applied.current = key
      const seo = seoForPath(pathname)
      document.title = seo.title
      const meta = (name: string, content: string, property = false) => {
        const attr = property ? 'property' : 'name'
        let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`)
        if (!element) {
          element = document.createElement('meta')
          element.setAttribute(attr, name)
          document.head.appendChild(element)
        }
        element.content = content
      }
      meta('description', seo.description)
      meta('og:title', seo.title, true)
      meta('og:description', seo.description, true)
      meta('robots', seo.noindex ? 'noindex, follow' : 'index, follow')
      const canonical = publicUrl(seo.path)
      if (canonical) {
        let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
        if (!link) {
          link = document.createElement('link')
          link.rel = 'canonical'
          document.head.appendChild(link)
        }
        link.href = canonical
        meta('og:url', canonical, true)
      }
      frame = requestAnimationFrame(() => {
        if (navigation === 'POP' && positions.current.has(key)) {
          window.scrollTo({ top: positions.current.get(key)!, behavior: 'instant' })
        } else if (hash) {
          let id = hash.substring(1)
          try {
            id = decodeURIComponent(id)
          } catch {
            /* Invalid escapes should not break navigation. */
          }
          const target = document.getElementById(id)
          target?.scrollIntoView({
            behavior: reduced || first.current || changedPage ? 'instant' : 'smooth',
            block: 'start',
          })
          if (target && !reduced && !first.current && !changedPage) {
            arrival = target.animate([{ opacity: 0.72 }, { opacity: 1 }], {
              duration: 780,
              easing: silk.cssEase,
            })
          }
        } else {
          window.scrollTo({
            top: 0,
            behavior: reduced || first.current || changedPage ? 'instant' : 'smooth',
          })
          if (!first.current)
            document.getElementById('main-content')?.focus({ preventScroll: true })
        }
        first.current = false
      })
    }
    apply()
    document.addEventListener('site:scene-ready', apply)
    return () => {
      cancelAnimationFrame(frame)
      arrival?.cancel()
      document.removeEventListener('site:scene-ready', apply)
    }
  }, [pathname, hash, key, reduced, navigation])
  return null
}

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const reduced = useReducedMotion()
  useEffect(() => {
    setOpen(false)
  }, [location])
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 24)
    scroll()
    window.addEventListener('scroll', scroll, { passive: true })
    return () => window.removeEventListener('scroll', scroll)
  }, [])
  useEffect(() => {
    if (!open) return
    const old = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panel.current?.querySelector<HTMLElement>('a')?.focus()
    const keydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        menuButton.current?.focus()
      }
      if (e.key === 'Tab') {
        const items = [
          menuButton.current,
          ...Array.from(panel.current?.querySelectorAll<HTMLElement>('a') || []),
        ].filter(Boolean) as HTMLElement[]
        const index = items.indexOf(document.activeElement as HTMLElement)
        if (e.shiftKey && index <= 0) {
          e.preventDefault()
          items.at(-1)?.focus()
        }
        if (!e.shiftKey && index === items.length - 1) {
          e.preventDefault()
          items[0]?.focus()
        }
      }
    }
    const resize = () => {
      if (window.innerWidth > 1050) setOpen(false)
    }
    document.addEventListener('keydown', keydown)
    window.addEventListener('resize', resize)
    return () => {
      document.body.style.overflow = old
      document.removeEventListener('keydown', keydown)
      window.removeEventListener('resize', resize)
    }
  }, [open])
  return (
    <>
      <a className="skip-link" href="#main-content">
        Перейти до вмісту
      </a>
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Основна навігація">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={
                  location.hash === item.to.slice(1) || location.pathname === item.to
                    ? 'active'
                    : ''
                }
                aria-current={location.pathname === item.to ? 'page' : undefined}
              >
                {item.label}
                {(location.hash === item.to.slice(1) || location.pathname === item.to) && (
                  <motion.span
                    className="nav-active-line"
                    layoutId="nav-active"
                    aria-hidden="true"
                    transition={{ duration: reduced ? 0 : 0.32, ease: silk.ease }}
                  />
                )}
              </Link>
            ))}
          </nav>
          <Link className="header-appointment" to="/#appointment">
            Записатися <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <button
            ref={menuButton}
            className="menu-toggle round-button"
            aria-label={open ? 'Закрити меню' : 'Відкрити меню'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panel}
            className="mobile-menu"
            initial={{ opacity: 0, y: reduced ? 0 : -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -15 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
          >
            <span className="tiny-caps">Ваша посмішка. Моя турбота.</span>
            <motion.nav
              aria-label="Мобільна навігація"
              initial="closed"
              animate="open"
              variants={{
                open: { transition: { staggerChildren: 0.045, delayChildren: 0.08 } },
                closed: {},
              }}
            >
              {navItems.map((item, i) => (
                <motion.div
                  key={item.to}
                  variants={{
                    closed: { opacity: reduced ? 1 : 0.3, y: reduced ? 0 : 12 },
                    open: { opacity: 1, y: 0, transition: { duration: 0.48, ease: silk.ease } },
                  }}
                >
                  <Link key={item.to} to={item.to}>
                    <span className="mobile-nav-number">0{i + 1}</span>
                    {item.label}
                    <ArrowUpRight size={22} />
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
            <Link className="button button-primary" to="/#appointment">
              Записатися на консультацію
              <ArrowUpRight size={18} />
            </Link>
            {site.contacts.phone && (
              <a className="mobile-phone" href={`tel:${site.contacts.phone}`}>
                {site.contacts.phoneDisplay}
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export function Footer() {
  return (
    <>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-column footer-identity">
              <Link to="/" className="footer-to-top">
                <span className="footer-up-icon">
                  <ArrowUp size={28} strokeWidth={1.3} aria-hidden="true" />
                </span>
                <span>
                  На початок сайту<small>До першого знайомства</small>
                </span>
              </Link>
              <p className="footer-doctor-name">Зоряна Тепла</p>
              <span className="footer-doctor-role">Лікар стоматолог-ортодонт</span>
              <span className="footer-doctor-detail">24 роки досвіду · Київ</span>
            </div>
            <div className="footer-column footer-voices">
              <span className="footer-kicker">Слова, у яких — турбота</span>
              <blockquote className="footer-quote">
                «Ваша посмішка. Моя професійна турбота.»
              </blockquote>
              <blockquote className="footer-quote">
                «Кожна посмішка заслуговує на індивідуальний підхід.»
              </blockquote>
            </div>
            <div className="footer-column footer-contact">
              <span className="footer-kicker">Залишаймося на зв’язку</span>
              {site.contacts.phone && (
                <a href={`tel:${site.contacts.phone}`} className="footer-contact-link">
                  <Phone size={17} strokeWidth={1.3} aria-hidden="true" />
                  <span>{site.contacts.phoneDisplay}</span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              )}
              {site.contacts.instagram && (
                <a
                  href={site.contacts.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-contact-link"
                >
                  <Instagram size={18} strokeWidth={1.3} aria-hidden="true" />
                  <span>@dr.zoryana.tepla</span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              )}
              <span className="footer-visit-note">Прийом у Києві за попереднім записом.</span>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Зоряна Тепла. Київ, Україна.</span>
            <Link to="/polityka-konfidentsiinosti/">Політика конфіденційності</Link>
            <Link to={journeyPath}>
              Ваш шлях до посмішки <ArrowUpRight size={12} aria-hidden="true" />
            </Link>
          </div>
          <p className="medical-note">
            Інформація на сайті має ознайомчий характер і не замінює особисту консультацію лікаря.
            Діагноз і план лікування визначаються індивідуально.
          </p>
        </div>
      </footer>
      <Link to="/#appointment" className="mobile-booking">
        Записатися на консультацію
        <ArrowUpRight size={17} aria-hidden="true" />
      </Link>
    </>
  )
}
