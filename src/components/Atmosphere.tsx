import { useI18n } from '../i18n/I18n'
import { AnimatedHeading } from '../motion/AnimatedHeading'
import { useEffect } from 'react'
import { motion, useScroll, useSpring, useReducedMotion } from 'motion/react'
import { useLocation } from 'react-router-dom'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { Link } from '../i18n/I18n'
import { revealFrames, silk } from '../motion/presets'

const revealed = new WeakSet<Element>()

export function MotionEnvironment() {
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const active = new Set<Animation>()
    for (const [key, value] of Object.entries({
      micro: silk.micro,
      text: silk.text,
      section: silk.section,
    }))
      document.documentElement.style.setProperty(`--motion-${key}`, `${value * 1000}ms`)
    document.documentElement.style.setProperty('--motion-ease', silk.cssEase)
    const sync = () => {
      document.documentElement.dataset.motion = preference.matches ? 'reduced' : 'full'
      if (preference.matches) {
        active.forEach((a) => a.cancel())
        active.clear()
      }
    }
    sync()
    if (!preference.matches)
      document.querySelectorAll('.header-inner > *').forEach((el, i) => {
        if (!el.getBoundingClientRect().height) return
        const animation = el.animate(
          [
            { opacity: 0.65, transform: 'translateY(-6px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          { duration: 600, delay: i * 35, easing: silk.cssEase },
        )
        active.add(animation)
      })
    preference.addEventListener('change', sync)
    return () => {
      active.forEach((a) => a.cancel())
      preference.removeEventListener('change', sync)
    }
  }, [])
  return null
}

export function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 110, damping: 28 })
  const reduced = useReducedMotion()
  return (
    <motion.div
      className="reading-progress"
      aria-hidden="true"
      style={{ scaleX: reduced ? scrollYProgress : scaleX }}
    />
  )
}

// One observer belongs to the displayed route, including its exit phase.
// Content is never hidden in SSR or while waiting for JavaScript.
export function DetailMotion() {
  const { pathname } = useLocation()
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let observer: IntersectionObserver | undefined
    const animations = new Set<Animation>()
    function stop() {
      observer?.disconnect()
      animations.forEach((a) => a.cancel())
      animations.clear()
    }
    function start() {
      stop()
      if (preference.matches || !('IntersectionObserver' in window)) return
      observer = new IntersectionObserver(
        (entries) => {
          for (const { target, isIntersecting } of entries) {
            if (!isIntersecting) continue
            const el = target as HTMLElement
            revealed.add(el)
            const group = el.hasAttribute('data-motion-reveal')
            const line = el.matches('.eyebrow-line, .hero-description-line')
            if (el.matches('.step-line')) el.dataset.silkLine = 'true'
            const image = el.matches('.hero-photo-frame, .about-photo-frame')
            const icon = el.tagName.toLowerCase() === 'svg'
            const surface = el.matches('.encouragement, .service-card-copy, .association')
            const frames = image
              ? [
                  { opacity: 0.65, clipPath: 'inset(14% 0 0 0)' },
                  { opacity: 1, clipPath: 'inset(0% 0 0 0)' },
                ]
              : line
                ? [
                    { opacity: 0.4, scale: el.matches('.hero-description-line') ? '1 0' : '0 1' },
                    { opacity: 1, scale: '1 1' },
                  ]
                : icon
                  ? [
                      { opacity: 0.6, transform: 'translateY(4px) rotate(-6deg)' },
                      { opacity: 1, transform: 'translateY(0) rotate(0)' },
                    ]
                  : group
                    ? [
                        { opacity: 0.88, transform: 'translateY(8px)' },
                        { opacity: 1, transform: 'translateY(0)' },
                      ]
                    : surface
                      ? [{ opacity: 0.65 }, { opacity: 1 }]
                      : revealFrames
            const order = Array.from(el.parentElement?.children || []).indexOf(el)
            const heroButton = !!el.closest('.hero-actions')
            const delay =
              Number(el.dataset.delay || 0) * 1000 +
              (heroButton ? 180 : 0) +
              Math.min(Math.max(order, 0) * 32, 128)
            const animation = target.animate(frames, {
              duration: (icon ? silk.micro * 2 : silk.section) * 1000,
              delay,
              easing: silk.cssEase,
            })
            animations.add(animation)
            animation.onfinish = () => animations.delete(animation)
            observer?.unobserve(target)
          }
        },
        { threshold: 0.12 },
      )
      document
        .querySelectorAll(
          '.page-content [data-motion-reveal], .page-content p, .page-content blockquote, .page-content .eyebrow, .page-content .eyebrow-line, .page-content .button, .page-content .text-link, .page-content .association, .page-content .encouragement, .page-content .service-card-copy, .page-content .field, .page-content .patient-options, .page-content .consent-field, .page-content .hero-location, .page-content .hero-photo-frame, .page-content .about-photo-frame, .page-content .experience-note, .page-content .step-line, .page-content .hero-description-line, .page-content .journey-tabs button, .page-content .contact-details > *, .page-content .success-icon, .page-content .round-button, .page-content .button svg, .page-content .encouragement-icon svg, .page-content .journey-summary > svg, .page-content .journey-roles svg, .page-content .trust-grid > div, .page-content .trust-grid svg, .page-content .doctor-signature, .site-footer p, .site-footer .footer-quote, .site-footer .footer-to-top, .site-footer .footer-contact-link, .site-footer .footer-bottom > *',
        )
        .forEach((el) => {
          if (!revealed.has(el)) observer?.observe(el)
        })
    }
    start()
    preference.addEventListener('change', start)
    return () => {
      stop()
      preference.removeEventListener('change', start)
    }
  }, [pathname])
  return null
}

export function Encouragement({
  children,
  label = 'З увагою до вас',
  dark = false,
}: {
  children: React.ReactNode
  label?: string
  dark?: boolean
}) {
  const { t } = useI18n()

  return (
    <div className={`encouragement ${dark ? 'encouragement-dark' : ''}`}>
      <span className="encouragement-icon">
        <Sparkles size={19} strokeWidth={1.2} aria-hidden="true" />
      </span>
      <div>
        <span className="tiny-caps">{t(label)}</span>
        <p>{children}</p>
      </div>
    </div>
  )
}

export function Invitation({
  title,
  text,
  to = '/#appointment',
  link = 'Почнімо з консультації',
}: {
  title: string
  text: string
  to?: string
  link?: string
}) {
  const { t } = useI18n()

  return (
    <section className="invitation-section">
      <div className="container invitation-layout">
        <span className="invitation-orbit" aria-hidden="true">
          <span />
          <span />
          <Sparkles strokeWidth={0.8} />
        </span>
        <div>
          <span className="tiny-caps">{t('Здоров’я. Впевненість. Ви.')}</span>
          <AnimatedHeading as="h2">{t(title)}</AnimatedHeading>
          <p>{t(text)}</p>
        </div>
        <Link className="button button-primary" to={to}>
          <span>{t(link)}</span>
          <ArrowUpRight size={19} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
