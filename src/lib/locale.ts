import english from '../i18n/en.json'

export type Language = 'uk' | 'en'
const messages: Record<string, string> = english
export const languageForPath = (path: string): Language =>
  /^\/en(?:\/|$)/.test(path) ? 'en' : 'uk'
export const withoutLanguage = (path: string) => path.replace(/^\/en(?=\/|$)/, '') || '/'
export function localizedPath(path: string, language: Language) {
  if (!path.startsWith('/') || path.startsWith('//')) return path
  const clean = withoutLanguage(path)
  return language === 'en' ? `/en${clean}` : clean
}
export function translate(text: string, language: Language) {
  if (language === 'uk') return text
  const translated = messages[text.replace(/\s+/g, ' ').trim()]
  if (!translated) return text
  return `${/^\s/.test(text) ? ' ' : ''}${translated}${/\s$/.test(text) ? ' ' : ''}`
}
