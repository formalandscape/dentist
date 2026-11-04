import { AnimatedHeading } from './motion/AnimatedHeading'
import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { ArrowDown, ArrowLeft, ArrowRight, Check, Heart, ListChecks, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { journeySteps } from './data/journey'
import { Action, Eyebrow, Photo, Reveal } from './components/ui'
import { Encouragement, Invitation } from './components/Atmosphere'
import { AppointmentSection } from './Home'
import { usePanelTransition } from './motion/usePanelTransition'

export function JourneyPage() {
  const [selected, setSelected] = useState(0)
  const tabs = useRef<Array<HTMLButtonElement | null>>([])
  const timeline = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: timeline,
    offset: ['start center', 'end center'],
  })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 28 })
  const { shown, controls, switching } = usePanelTransition(selected)
  const reduced = useReducedMotion()
  const step = journeySteps[selected]
  function keyboard(event: KeyboardEvent, index: number) {
    const next = ['ArrowDown', 'ArrowRight'].includes(event.key)
      ? (index + 1) % 6
      : ['ArrowUp', 'ArrowLeft'].includes(event.key)
        ? (index + 5) % 6
        : event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? 5
            : null
    if (next === null) return
    event.preventDefault()
    setSelected(next)
    tabs.current[next]?.focus()
  }
  return (
    <>
      <section className="section journey-hero">
        <div className="container">
          <Link to="/" className="back-link">
            <ArrowLeft size={15} aria-hidden="true" />
            На головну
          </Link>
          <div className="journey-hero-layout">
            <Reveal>
              <Eyebrow>Ваш шлях до посмішки</Eyebrow>
              <AnimatedHeading as="h1">
                Крок за кроком.
                <br />
                <em>З турботою про вас.</em>
              </AnimatedHeading>
              <p className="journey-lead">
                Впевненість починається з розуміння. Дізнайтеся, як може проходити ортодонтичне
                лікування — від першої розмови до підтримки досягнутих змін.
              </p>
              <div className="journey-hero-actions">
                <Action to="/#appointment">Обговорити мій шлях</Action>
                <a className="text-link" href="#journey-stages">
                  Дослідити етапи <ArrowDown size={16} aria-hidden="true" />
                </a>
              </div>
              <Encouragement label="Ваш темп — важливий">
                Ви не зобов’язані знати всі відповіді заздалегідь. Саме для цього є перша
                консультація.
              </Encouragement>
            </Reveal>
            <div className="journey-art">
              <Photo kind="balance" priority />
              <div className="journey-art-orbit" aria-hidden="true">
                <span />
                <span />
                <Sparkles size={36} strokeWidth={0.7} />
              </div>
              <div className="journey-art-caption">
                <span>06</span>
                <p>
                  етапів, щоб
                  <br />
                  побачити цілісну картину
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section ref={timeline} id="journey-stages" className="section journey-stages">
        <div className="container">
          <Reveal className="section-heading">
            <div>
              <Eyebrow>Зрозумілий маршрут</Eyebrow>
              <AnimatedHeading as="h2">
                Ваше лікування.
                <br />
                <em>Ваші усвідомлені рішення.</em>
              </AnimatedHeading>
            </div>
            <p className="muted">
              Оберіть етап, щоб дізнатися про його мету, роль лікаря й те, що можете зробити ви.
            </p>
          </Reveal>
          <div className="journey-progress-row">
            <span>
              Крок 0{selected + 1} <span>з 06</span>
            </span>
            <progress max="6" value={selected + 1} aria-label="Обраний етап лікування" />
            <span className="tiny-caps">{step.short}</span>
          </div>
          <div className="journey-explorer">
            <div
              className="journey-tabs"
              role="tablist"
              aria-label="Етапи ортодонтичного лікування"
              aria-orientation="vertical"
            >
              <span className="journey-rail" aria-hidden="true">
                <motion.span style={{ scaleY: reduced ? scrollYProgress : smoothProgress }} />
              </span>
              {journeySteps.map((s, i) => (
                <button
                  key={s.title}
                  ref={(el) => {
                    tabs.current[i] = el
                  }}
                  role="tab"
                  id={`journey-tab-${i}`}
                  aria-controls={`journey-panel-${i}`}
                  aria-selected={selected === i}
                  tabIndex={selected === i ? 0 : -1}
                  onClick={() => setSelected(i)}
                  onKeyDown={(e) => keyboard(e, i)}
                >
                  <span className="journey-tab-number">0{i + 1}</span>
                  <span>{s.title}</span>
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
              ))}
            </div>
            <motion.div
              className="journey-panels"
              initial={false}
              animate={controls}
              aria-busy={switching}
            >
              {journeySteps.map((s, i) => (
                <div
                  key={s.title}
                  role="tabpanel"
                  id={`journey-panel-${i}`}
                  aria-labelledby={`journey-tab-${i}`}
                  tabIndex={0}
                  hidden={shown !== i}
                  className="journey-panel"
                >
                  <span className="tiny-caps">
                    Етап 0{i + 1} · {s.short}
                  </span>
                  <AnimatedHeading as="h3">{s.title}</AnimatedHeading>
                  <p className="journey-panel-intro">{s.text}</p>
                  <div className="journey-roles">
                    <div>
                      <ListChecks size={20} aria-hidden="true" />
                      <AnimatedHeading as="h4">Разом із лікарем</AnimatedHeading>
                      <p>{s.doctor}</p>
                    </div>
                    <div>
                      <Heart size={20} aria-hidden="true" />
                      <AnimatedHeading as="h4">Ваша участь</AnimatedHeading>
                      <p>{s.patient}</p>
                    </div>
                  </div>
                  <p className="journey-takeaway">
                    <Check size={19} aria-hidden="true" />
                    {s.takeaway}
                  </p>
                  <div className="journey-panel-footer">
                    <p>{s.phrase}</p>
                    <button
                      className="round-button"
                      aria-label={i === 5 ? 'Повернутися до першого етапу' : 'Наступний етап'}
                      onClick={() => {
                        const next = (i + 1) % 6
                        setSelected(next)
                        tabs.current[next]?.focus({ preventScroll: true })
                      }}
                    >
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
          <p className="journey-disclaimer">
            Це загальна схема для знайомства. Послідовність, обсяг діагностики, методи та тривалість
            визначаються індивідуально. Жоден етап не гарантує конкретного результату.
          </p>
          <noscript>
            <style>
              {
                '.journey-tabs,.journey-progress-row{display:none}.journey-panel[hidden]{display:block;margin-top:24px}'
              }
            </style>
          </noscript>
        </div>
      </section>
      <section className="section journey-support">
        <div className="container">
          <Eyebrow>Турбота між зустрічами</Eyebrow>
          <AnimatedHeading as="h2">
            Ваша посмішка —<br />
            <em>наша спільна увага.</em>
          </AnimatedHeading>
          <div className="journey-summary-grid">
            {[
              {
                icon: Heart,
                title: 'Гігієна щодня',
                text: 'Догляд за зубами, яснами й апаратом залишається важливим на всіх етапах. Обговоріть індивідуальні засоби гігієни з лікарем.',
              },
              {
                icon: ListChecks,
                title: 'Послідовність у діях',
                text: 'Виконуйте рекомендації щодо носіння конструкцій і контрольних візитів. Маленькі щоденні звички підтримують сплановане лікування.',
              },
              {
                icon: Sparkles,
                title: 'Відкрита розмова',
                text: 'Запитуйте й діліться відчуттями. Якщо з’явився нетиповий біль або пошкодився апарат, зв’яжіться з лікарем поза плановим візитом.',
              },
            ].map(({ icon: Icon, title, text }, i) => (
              <Reveal className="journey-summary" delay={i * 0.1} key={title}>
                <Icon size={25} strokeWidth={1.2} aria-hidden="true" />
                <AnimatedHeading as="h3">{title}</AnimatedHeading>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <Invitation
        title="Ваш перший крок може бути простим."
        text="Не потрібно обирати апарат або ставити собі діагноз. Достатньо розповісти, що для вас важливо, — і почати з консультації."
      />
      <AppointmentSection />
    </>
  )
}
