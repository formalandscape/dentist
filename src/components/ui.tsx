import { motion, useReducedMotion, useScroll, useTransform, useSpring } from 'motion/react'
import { useRef } from 'react'
import type { ReactNode } from 'react'
import { ArrowUpRight, Asterisk } from 'lucide-react'
import { Link } from 'react-router-dom'
import { imageReveal, silk } from '../motion/presets'

export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <div className={`reveal-block ${className}`} data-motion-reveal="true" data-delay={delay}>
      {children}
    </div>
  )
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <div className={`eyebrow ${light ? 'eyebrow-light' : ''}`}>
      <span className="eyebrow-line" />
      {children}
    </div>
  )
}

export function Action({
  children,
  to,
  secondary = false,
  className = '',
}: {
  children: ReactNode
  to: string
  secondary?: boolean
  className?: string
}) {
  return (
    <Link
      to={to}
      className={`button ${secondary ? 'button-outline' : 'button-primary'} ${className}`}
    >
      <span>{children}</span>
      <ArrowUpRight size={18} aria-hidden="true" />
    </Link>
  )
}

export function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <Link to="/" className={`brand ${footer ? 'brand-footer' : ''}`}>
      <span className="brand-symbol" aria-hidden="true">
        З<span>Т</span>
      </span>
      <span className="brand-type">
        Зоряна Тепла<span>ЛІКАР СТОМАТОЛОГ-ОРТОДОНТ</span>
      </span>
    </Link>
  )
}

export function Photo({
  kind,
  className = '',
  label,
  priority = false,
}: {
  kind: string
  className?: string
  label?: string
  priority?: boolean
}) {
  const target = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, -12])
  const smoothY = useSpring(y, { stiffness: 70, damping: 24, mass: 0.4 })
  return (
    <motion.div
      ref={target}
      className={`editorial-photo photo-${kind} ${className}`}
      style={{ y: reduced ? 0 : smoothY }}
      initial={false}
      inherit={false}
      animate={
        reduced
          ? {
              opacity: 1,
              clipPath: 'inset(0% 0 0 0 round 4px)',
              scale: 1,
              transition: { duration: 0 },
            }
          : undefined
      }
      whileInView={reduced ? {} : imageReveal}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduced ? 0 : silk.section, ease: silk.ease }}
      role="img"
      aria-label={
        label ||
        {
          braces: 'Ілюстративне зображення навчальної моделі з брекетами',
          aligners: 'Ілюстративне зображення прозорих елайнерів',
          children: 'Ілюстративний натюрморт: дерев’яна іграшка та шавлієва ваза',
          balance: 'Ілюстративна скульптура як символ гармонії та балансу',
        }[kind] ||
        'Декоративне зображення'
      }
    >
      <img
        src={`${import.meta.env.BASE_URL}images/editorial-still-life.webp`}
        alt=""
        aria-hidden="true"
        width="1774"
        height="887"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </motion.div>
  )
}

export function Flower({ className = '' }: { className?: string }) {
  return <Asterisk className={`flower ${className}`} strokeWidth={0.6} aria-hidden="true" />
}
