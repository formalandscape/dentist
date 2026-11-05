import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { useI18n } from '../i18n/I18n'
import { localizedPath } from '../lib/locale'

type Theme = 'light' | 'dark'
export function Preferences() {
  const { language, t } = useI18n()
  const location = useLocation()
  const [theme, setTheme] = useState<Theme>('light')
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const applyTheme = useCallback((selected: Theme, animate: boolean) => {
    const root = document.documentElement
    clearTimeout(transitionTimer.current)
    if (
      animate &&
      !matchMedia('(prefers-reduced-motion: reduce)').matches &&
      root.dataset.theme !== selected
    ) {
      root.dataset.themeTransition = 'true'
      // Resolve the previous palette before changing it; one style flush per toggle.
      getComputedStyle(root).backgroundColor
      transitionTimer.current = setTimeout(() => {
        delete root.dataset.themeTransition
      }, 850)
    } else {
      delete root.dataset.themeTransition
    }
    root.dataset.theme = selected
    root.style.colorScheme = selected
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', selected === 'dark' ? '#14201a' : '#f8f5ee')
    setTheme(selected)
  }, [])
  useEffect(() => {
    const preference = matchMedia('(prefers-color-scheme: dark)')
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    function sync(animate = true) {
      let stored: string | null = null
      try {
        stored = localStorage.getItem('tepla-theme')
      } catch {
        /* Optional storage. */
      }
      applyTheme(
        stored === 'light' || stored === 'dark' ? stored : preference.matches ? 'dark' : 'light',
        animate,
      )
    }
    const changed = () => sync()
    const storage = (event: StorageEvent) => {
      if (event.key === 'tepla-theme' || event.key === null) sync()
    }
    const reduce = () => {
      if (motion.matches) {
        clearTimeout(transitionTimer.current)
        delete document.documentElement.dataset.themeTransition
      }
    }
    sync(false)
    preference.addEventListener('change', changed)
    motion.addEventListener('change', reduce)
    window.addEventListener('storage', storage)
    return () => {
      clearTimeout(transitionTimer.current)
      delete document.documentElement.dataset.themeTransition
      preference.removeEventListener('change', changed)
      motion.removeEventListener('change', reduce)
      window.removeEventListener('storage', storage)
    }
  }, [applyTheme])
  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next, true)
    try {
      localStorage.setItem('tepla-theme', next)
    } catch {
      /* Optional storage. */
    }
  }
  return (
    <div className="site-preferences">
      <div className="language-switch" role="group" aria-label={t('Мова сайту')}>
        {(['uk', 'en'] as const).map((locale) => (
          <Link
            key={locale}
            to={{ ...location, pathname: localizedPath(location.pathname, locale) }}
            lang={locale}
            hrefLang={locale}
            aria-label={locale === 'uk' ? 'UA — Українська' : 'EN — English'}
            aria-current={language === locale ? 'true' : undefined}
          >
            {locale === 'uk' ? 'UA' : 'EN'}
          </Link>
        ))}
      </div>
      <button
        type="button"
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={t(theme === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему')}
        aria-pressed={theme === 'dark'}
      >
        <span className="theme-icon theme-icon-sun" aria-hidden="true">
          <Sun size={18} />
        </span>
        <span className="theme-icon theme-icon-moon" aria-hidden="true">
          <Moon size={18} />
        </span>
      </button>
    </div>
  )
}
