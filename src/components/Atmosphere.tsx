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
    for (const [key, value] of Object.entries({
      micro: silk.micro,
      text: silk.text,
      section: silk.section,
    }))
      document.documentElement.style.setProperty(`--motion-${key}`, `${value * 1000}ms`)
    document.documentElement.style.setProperty('--motion-ease', silk.cssEase)
    const sync = () => {
      document.documentElement.dataset.motion = preference.matches ? 'reduced' : 'full'
    }
    sync()
    preference.addEventListener('change', sync)
    return () => {
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

// Each visual unit owns one entrance. Text inside a card never gets a second
// transform, and native scrolling remains entirely under the browser's control.
const surfaces = [
  '.service-card',
  '.preparation-card',
  '.journey-summary',
  '.mentorship-card',
  '.mentorship-topic',
  '.mentorship-stage',
  '.association',
  '.step',
  '.faq-item',
  '.encouragement',
  '.hero-photo-frame',
  '.about-photo-frame',
  '.editorial-photo',
  '.form-card',
  '.contact-details > *',
  '.site-footer .footer-column',
  '.site-footer .footer-bottom',
].join(', ')
const details = '[data-motion-heading], p, .eyebrow, .button, .text-link, .experience-note'

export function DetailMotion() {
  const { pathname } = useLocation()
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let observer: IntersectionObserver | undefined
    const active = new Map<Animation, HTMLElement>()
    let lastY = window.scrollY
    let lastTime = performance.now()
    let lastFastScroll = -Infinity

    function onScroll() {
      const now = performance.now()
      const y = window.scrollY
      const speed = Math.abs(y - lastY) / Math.max(16, Math.min(64, now - lastTime))
      lastY = y
      lastTime = now
      if (speed < 2.4) return
      lastFastScroll = now
      // Preserve each animation's current frame while shortening its remaining
      // travel. No cancel/restart jump when a wheel or touch gesture accelerates.
      active.forEach((_, animation) => animation.updatePlaybackRate(4))
    }
    function settle(el: HTMLElement, state = 'settled') {
      el.dataset.scrollState = state
      revealed.add(el)
      observer?.unobserve(el)
    }
    function animate(el: HTMLElement, target: HTMLElement, frames: Keyframe[], delay = 0) {
      const animation = target.animate(frames, {
        duration: (el.dataset.revealKind === 'card' ? silk.section : silk.text) * 1000,
        delay,
        easing: silk.scrollEase,
        fill: 'backwards',
      })
      animation.id = 'scroll-reveal'
      active.set(animation, el)
      const release = () => {
        active.delete(animation)
        if (![...active.values()].includes(el)) settle(el)
      }
      animation.onfinish = () => {
        release()
        animation.cancel()
      }
      animation.oncancel = release
    }
    function stop() {
      observer?.disconnect()
      active.forEach((el, animation) => {
        el.dataset.scrollState = 'settled'
        animation.oncancel = null
        animation.cancel()
      })
      active.clear()
    }
    function start() {
      stop()
      if (preference.matches || !('IntersectionObserver' in window)) return
      observer = new IntersectionObserver(
        (entries) => {
          for (const { target, isIntersecting } of entries) {
            const el = target as HTMLElement
            if (!isIntersecting) {
              // Once a unit is outside the pre-entry margin, its animation is no
              // longer useful. Returning to it must show the final, stable content.
              active.forEach((owner, animation) => {
                if (owner === el) animation.finish()
              })
              continue
            }
            if (revealed.has(el)) continue
            revealed.add(el)
            const rect = el.getBoundingClientRect()
            const alreadyVisible = rect.top < innerHeight - 80 && rect.bottom > 100
            if (alreadyVisible || performance.now() - lastFastScroll < 220) {
              settle(el, 'skipped')
              continue
            }
            el.dataset.scrollState = 'running'
            if (el.matches('[data-motion-heading]')) {
              // No masks, clipping, blur or character-by-character motion.
              el.querySelectorAll<HTMLElement>('.motion-word').forEach((word, index) => {
                animate(
                  el,
                  word,
                  [
                    { opacity: 0.92, transform: 'translateY(5px)' },
                    { opacity: 1, transform: 'translateY(0)' },
                  ],
                  Math.min(index * silk.stagger * 1000, 132),
                )
              })
            } else {
              const image = el.dataset.revealKind === 'image'
              const card = el.dataset.revealKind === 'card'
              const frames: Keyframe[] = image
                ? [{ opacity: 0.96 }, { opacity: 1 }]
                : card
                  ? [
                      { opacity: 0.94, transform: 'translateY(8px)' },
                      { opacity: 1, transform: 'translateY(0)' },
                    ]
                  : revealFrames
              // Keep authored transparency (for example the approach illustration)
              // identical at completion; removing an effect must never change it.
              const baselineOpacity = Number(getComputedStyle(el).opacity)
              const delay =
                el.dataset.revealKind === 'card'
                  ? Math.min(
                      Number(el.closest('[data-motion-reveal]')?.getAttribute('data-delay') || 0) *
                        1000,
                      80,
                    )
                  : 0
              animate(
                el,
                el,
                frames.map((frame) => ({
                  ...frame,
                  opacity: Number(frame.opacity) * baselineOpacity,
                })),
                delay,
              )
            }
          }
        },
        {
          // Begin just outside the viewport, before a slow scroll exposes the unit.
          // A large jump directly into view skips entrances instead of hiding text.
          rootMargin: '120px 0px 160px 0px',
          threshold: 0,
        },
      )
      const scope = document.querySelector('.page-content')
      const candidates = [
        ...Array.from(scope?.querySelectorAll<HTMLElement>(`${surfaces}, ${details}`) || []),
        ...Array.from(
          document.querySelectorAll<HTMLElement>(
            '.site-footer .footer-column, .site-footer .footer-bottom',
          ),
        ),
      ]
      for (const el of candidates) {
        if (el.parentElement?.closest(surfaces)) continue
        const kind = el.matches('.editorial-photo, .hero-photo-frame, .about-photo-frame')
          ? 'image'
          : el.matches('.service-card, .preparation-card, .journey-summary, .mentorship-card')
            ? 'card'
            : el.matches('.step, .mentorship-topic, .mentorship-stage, .faq-item')
              ? 'sequence'
              : 'text'
        el.dataset.revealKind = kind
        el.dataset.motionUnit = 'true'
        if (!revealed.has(el)) {
          el.dataset.scrollState = 'idle'
          observer.observe(el)
        }
      }
    }
    start()
    window.addEventListener('scroll', onScroll, { passive: true })
    preference.addEventListener('change', start)
    return () => {
      stop()
      window.removeEventListener('scroll', onScroll)
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
