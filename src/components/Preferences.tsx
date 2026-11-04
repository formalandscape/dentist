import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { useI18n } from '../i18n/I18n'
import { localizedPath } from '../lib/locale'

type Theme = 'light' | 'dark'
export function Preferences() {
  const { language, t } = useI18n()
  const location = useLocation()
  const [theme, setTheme] = useState<Theme>('light')
  useEffect(() => {
    const preference = matchMedia('(prefers-color-scheme: dark)')
    function sync() {
      let stored: string | null = null
      try {
        stored = localStorage.getItem('tepla-theme')
      } catch {
        /* Storage may be disabled. */
      }
      const selected =
        stored === 'light' || stored === 'dark' ? stored : preference.matches ? 'dark' : 'light'
      document.documentElement.dataset.theme = selected
      document.documentElement.style.colorScheme = selected
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', selected === 'dark' ? '#14201a' : '#f8f5ee')
      setTheme(selected)
    }
    sync()
    preference.addEventListener('change', sync)
    return () => preference.removeEventListener('change', sync)
  }, [])
  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.dataset.theme = next
    document.documentElement.style.colorScheme = next
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', next === 'dark' ? '#14201a' : '#f8f5ee')
    try {
      localStorage.setItem('tepla-theme', next)
    } catch {
      /* Keep working without storage. */
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
        {theme === 'dark' ? (
          <Sun size={17} aria-hidden="true" />
        ) : (
          <Moon size={17} aria-hidden="true" />
        )}
      </button>
    </div>
  )
}
