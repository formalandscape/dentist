import { useEffect } from 'react'
import { motion, useScroll, useSpring, useReducedMotion } from 'motion/react'
import { useLocation } from 'react-router-dom'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

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

// Animate paint and transforms only; the HTML remains readable before JS and
// without it. One observer per page, released after each element has appeared.
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
            const animation = target.animate(
              [
                { opacity: 0.65, transform: 'translateY(18px)' },
                { opacity: 1, transform: 'translateY(0)' },
              ],
              {
                duration: 850,
                delay: Number((target as HTMLElement).dataset.delay || 0),
                easing: 'cubic-bezier(.22,1,.36,1)',
              },
            )
            animations.add(animation)
            animation.onfinish = () => animations.delete(animation)
            observer?.unobserve(target)
          }
        },
        { threshold: 0.12 },
      )
      document
        .querySelectorAll(
          '.section h2, .section .muted, .association, .encouragement, .service-card-copy, .journey-summary',
        )
        .forEach((el) => observer?.observe(el))
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
  return (
    <div className={`encouragement ${dark ? 'encouragement-dark' : ''}`}>
      <span className="encouragement-icon">
        <Sparkles size={19} strokeWidth={1.2} aria-hidden="true" />
      </span>
      <div>
        <span className="tiny-caps">{label}</span>
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
  return (
    <section className="invitation-section">
      <div className="container invitation-layout">
        <span className="invitation-orbit" aria-hidden="true">
          <span />
          <span />
          <Sparkles strokeWidth={0.8} />
        </span>
        <div>
          <span className="tiny-caps">Здоров’я. Впевненість. Ви.</span>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <Link className="button button-primary" to={to}>
          <span>{link}</span>
          <ArrowUpRight size={19} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
