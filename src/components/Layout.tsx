import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowUp, ArrowUpRight, Instagram, Menu, Phone, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { site } from '../data/site'
import { Brand } from './ui'
import { publicUrl, seoForPath } from '../lib/seo'
import { journeyPath } from '../data/journey'

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
  useEffect(() => {
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
    const frame = requestAnimationFrame(() => {
      if (hash) {
        let id = hash.substring(1)
        try {
          id = decodeURIComponent(id)
        } catch {
          /* Invalid escapes should not break navigation. */
        }
        const target = document.getElementById(id)
        target?.scrollIntoView({
          behavior: reduced || first.current ? 'instant' : 'smooth',
          block: 'start',
        })
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' })
        if (!first.current) document.getElementById('main-content')?.focus({ preventScroll: true })
      }
      first.current = false
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash, key, reduced])
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
            <nav aria-label="Мобільна навігація">
              {navItems.map((item, i) => (
                <Link key={item.to} to={item.to}>
                  <span className="mobile-nav-number">0{i + 1}</span>
                  {item.label}
                  <ArrowUpRight size={22} />
                </Link>
              ))}
            </nav>
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
          <div className="footer-top">
            <Brand footer />
            <p>
              Ваша посмішка.
              <br />
              <span>Моя професійна турбота.</span>
            </p>
            <div className="footer-socials">
              {site.contacts.instagram && (
                <a
                  href={site.contacts.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="round-button"
                  aria-label="Instagram Зоряни Теплої"
                >
                  <Instagram size={19} />
                </a>
              )}
              {site.contacts.phone && (
                <a
                  href={`tel:${site.contacts.phone}`}
                  className="round-button"
                  aria-label="Зателефонувати Зоряні Теплій"
                >
                  <Phone size={18} />
                </a>
              )}
              <a
                href="#main-content"
                className="round-button"
                aria-label="Повернутися нагору"
                onClick={(e) => {
                  e.preventDefault()
                  window.scrollTo({
                    top: 0,
                    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                      ? 'instant'
                      : 'smooth',
                  })
                  document.getElementById('main-content')?.focus({ preventScroll: true })
                }}
              >
                <ArrowUp size={18} />
              </a>
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
