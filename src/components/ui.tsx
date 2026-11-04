import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { ArrowUpRight, Asterisk } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={reduced ? {} : { opacity: [0.45, 1], y: [18, 0] }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
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
}: {
  kind: string
  className?: string
  label?: string
}) {
  return (
    <div
      className={`editorial-photo photo-${kind} ${className}`}
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
    />
  )
}

export function Flower({ className = '' }: { className?: string }) {
  return <Asterisk className={`flower ${className}`} strokeWidth={0.6} aria-hidden="true" />
}
