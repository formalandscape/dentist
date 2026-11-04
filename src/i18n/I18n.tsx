import { createContext, useContext, useEffect, useMemo, forwardRef } from 'react'
import type { ReactNode } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import type { LinkProps } from 'react-router-dom'
import { languageForPath, localizedPath, translate } from '../lib/locale'
import type { Language } from '../lib/locale'

const I18n = createContext({ language: 'uk' as Language, t: (text: string) => text })
export function I18nProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const language = languageForPath(pathname)
  const value = useMemo(
    () => ({ language, t: (text: string) => translate(text, language) }),
    [language],
  )
  useEffect(() => {
    document.documentElement.lang = language
  }, [language])
  return <I18n.Provider value={value}>{children}</I18n.Provider>
}
export const useI18n = () => useContext(I18n)

// Keep the language in every internal URL, including contact anchors and the back-to-top link.
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ to, ...props }, ref) {
  const { language } = useI18n()
  const target =
    typeof to === 'string'
      ? localizedPath(to, language)
      : {
          ...to,
          ...(to.pathname ? { pathname: localizedPath(to.pathname, language) } : {}),
        }
  return <RouterLink {...props} ref={ref} to={target} />
})
