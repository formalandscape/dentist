import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Compass,
  Layers,
  MessageCircle,
  Phone,
} from 'lucide-react'
import { AnimatedHeading } from './motion/AnimatedHeading'
import { Eyebrow, Photo, Reveal } from './components/ui'
import { useI18n } from './i18n/I18n'
import { site } from './data/site'

const audience = [
  [
    'Перші кроки в ортодонтії',
    'Молодим лікарям-ортодонтам, які шукають опору для самостійних клінічних рішень.',
  ],
  [
    'Нове професійне поле',
    'Стоматологам, які цікавляться ортодонтією та хочуть краще розуміти її можливості.',
  ],
  [
    'Глибше розуміння',
    'Фахівцям, які прагнуть розвивати клінічне мислення й бачити за окремими симптомами цілісну картину.',
  ],
  [
    'Знання як система',
    'Лікарям, які хочуть упорядкувати знання та пов’язати теорію зі щоденною практикою.',
  ],
]
const directions = [
  [
    'Аналіз клінічних ситуацій',
    'Від вихідних даних до аргументованого рішення: що врахувати, які запитання поставити та де проходять межі висновків.',
  ],
  [
    'Планування ортодонтичного лікування',
    'Логіка послідовності дій, вибір підходу та оцінка його можливостей і обмежень.',
  ],
  [
    'Діагностичне мислення',
    'Як зіставляти скарги, дані огляду й обстежень та визначати, якої інформації ще бракує.',
  ],
  [
    'Міждисциплінарний підхід',
    'Взаємодія із суміжними фахівцями, спільні цілі та узгодження етапів допомоги пацієнту.',
  ],
  [
    'Розбір професійних питань',
    'Простір для конкретних запитань із практики, обговорення альтернатив і пошуку надійних джерел.',
  ],
]
const steps = [
  [
    'Знайомство та запит',
    'Обговорюємо ваш досвід, професійні інтереси та питання, з якими ви хотіли б попрацювати.',
  ],
  [
    'Узгодження формату',
    'Уточнюємо можливість співпраці, теми, формат зустрічей, їхню частоту та вартість.',
  ],
  [
    'Спільний розбір',
    'Якщо формат погоджено, розглядаємо обрані питання та логіку клінічних рішень. Матеріали пацієнтів — лише з належною згодою та без ідентифікаційних даних.',
  ],
  [
    'Висновки та орієнтири',
    'Підсумовуємо обговорення й окреслюємо питання для подальшої самостійної роботи.',
  ],
]

export function MentorshipPage() {
  const { t } = useI18n()
  const timeline = useRef<HTMLOListElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: timeline,
    offset: ['start center', 'end center'],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 26 })
  return (
    <>
      <section className="section mentorship-hero">
        <div className="container mentorship-hero-grid">
          <Reveal className="mentorship-intro">
            <Eyebrow>{t('Досвід, яким можна ділитися')}</Eyebrow>
            <AnimatedHeading as="h1">
              {t('Менторство, що допомагає')} <em>{t('зростати професійно')}</em>
            </AnimatedHeading>
            <p className="mentorship-lead">
              {t(
                'Практичний досвід, професійне мислення та індивідуальний підхід до розвитку лікаря-ортодонта',
              )}
            </p>
            <a className="button button-primary" href="#mentorship-about">
              {t('Дізнатися більше')}
              <ArrowDown size={18} aria-hidden="true" />
            </a>
            <p className="mentorship-status">
              <span aria-hidden="true" />
              {t('Можливе професійне партнерство · за погодженням')}
            </p>
          </Reveal>
          <div className="mentorship-visual">
            <Photo kind="balance" priority />
            <span className="mentorship-visual-rule" aria-hidden="true" />
            <div className="mentorship-visual-caption">
              <span>01 — 04</span>
              <p>
                {t('Від запитання')}
                <br />
                <em>{t('до розуміння')}</em>
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="mentorship-about" className="section mentorship-about">
        <div className="container mentorship-split">
          <Reveal>
            <Eyebrow>{t('Про менторство')}</Eyebrow>
            <AnimatedHeading>
              {t('Не лише знати.')}
              <br />
              <em>{t('Розуміти, чому.')}</em>
            </AnimatedHeading>
          </Reveal>
          <Reveal className="mentorship-prose">
            <p className="mentorship-lead">
              {t(
                'Між знанням методики та впевненим клінічним рішенням є простір для запитань, аналізу й досвіду.',
              )}
            </p>
            <p>
              {t(
                'Професійне наставництво може допомогти пройти цей шлях усвідомлено: зіставити теорію з практикою, побачити альтернативи та навчитися пояснювати власний вибір. Досвід практикуючого лікаря додає до обговорення те, що складно передати готовим алгоритмом: контекст, нюанси й увагу до конкретної людини.',
              )}
            </p>
            <p>
              {t(
                'Ця сторінка представляє можливе менторське спрямування Зоряни Теплої. Це запрошення обговорити професійний запит; проведення програм чи навчальних курсів наразі не заявлено.',
              )}
            </p>
            <div className="mentorship-signature">
              <span>{t('Зоряна Тепла')}</span>
              <small>{t('Лікар стоматолог-ортодонт · 20+ років досвіду')}</small>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="section mentorship-audience">
        <div className="container">
          <Reveal className="section-heading">
            <div>
              <Eyebrow>{t('Для кого')}</Eyebrow>
              <AnimatedHeading>
                {t('Різний досвід.')}
                <br />
                <em>{t('Спільна цікавість до професії.')}</em>
              </AnimatedHeading>
            </div>
          </Reveal>
          <div className="mentorship-audience-grid">
            {audience.map(([title, text], i) => {
              const Icon = [Compass, BookOpen, MessageCircle, Layers][i]
              return (
                <Reveal className="mentorship-card" delay={i * 0.07} key={title}>
                  <div className="mentorship-card-top">
                    <Icon size={24} strokeWidth={1.25} aria-hidden="true" />
                    <span>0{i + 1}</span>
                  </div>
                  <AnimatedHeading as="h3">{t(title)}</AnimatedHeading>
                  <p>{t(text)}</p>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>
      <section className="section mentorship-directions">
        <div className="container mentorship-split">
          <Reveal>
            <Eyebrow>{t('Можливі напрями менторства')}</Eyebrow>
            <AnimatedHeading>
              {t('У центрі уваги —')}
              <br />
              <em>{t('ваші запитання.')}</em>
            </AnimatedHeading>
            <p className="muted">
              {t(
                'Теми можуть стати відправною точкою для розмови. Зміст взаємодії визначається індивідуально, після знайомства з вашим запитом.',
              )}
            </p>
          </Reveal>
          <div className="mentorship-topics">
            {directions.map(([title, text], i) => (
              <Reveal className="mentorship-topic" key={title} delay={i * 0.04}>
                <span className="mentorship-index">0{i + 1}</span>
                <div>
                  <AnimatedHeading as="h3">{t(title)}</AnimatedHeading>
                  <p>{t(text)}</p>
                </div>
                <ArrowUpRight size={20} aria-hidden="true" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section mentorship-format">
        <div className="container">
          <Reveal className="section-heading">
            <div>
              <Eyebrow>{t('Як може проходити менторство')}</Eyebrow>
              <AnimatedHeading>
                {t('Послідовна розмова.')}
                <br />
                <em>{t('Зрозумілий наступний крок.')}</em>
              </AnimatedHeading>
            </div>
            <p className="muted">
              {t(
                'Орієнтовна послідовність взаємодії. Формат, вартість і доступність потребують окремого погодження.',
              )}
            </p>
          </Reveal>
          <ol className="mentorship-timeline" ref={timeline}>
            <li className="mentorship-rail" aria-hidden="true" role="presentation">
              <motion.span style={{ scaleY: reduced ? scrollYProgress : progress }} />
            </li>
            {steps.map(([title, text], i) => (
              <li key={title}>
                <Reveal className="mentorship-stage" delay={i * 0.05}>
                  <span className="mentorship-stage-number">0{i + 1}</span>
                  <div>
                    <AnimatedHeading as="h3">{t(title)}</AnimatedHeading>
                    <p>{t(text)}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section id="mentorship-request" className="section mentorship-request">
        <div className="container mentorship-request-inner">
          <Eyebrow>{t('Почнімо з професійної розмови')}</Eyebrow>
          <AnimatedHeading>
            {t('Бажаєте дізнатися більше')}
            <br />
            <em>{t('про можливості менторства?')}</em>
          </AnimatedHeading>
          <p>
            {t(
              'Напишіть Зоряні Теплій в Instagram: коротко розкажіть про свій досвід і тему, яку хотіли б обговорити. Актуальні можливості, формат та вартість уточнюються особисто.',
            )}
          </p>
          <div className="mentorship-request-actions">
            <a
              className="button button-primary"
              href={site.contacts.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('Залишити запит')}
              <ArrowUpRight size={19} aria-hidden="true" />
            </a>
            <a className="text-link" href={`tel:${site.contacts.phone}`}>
              <Phone size={16} aria-hidden="true" />
              {t('Зателефонувати')}
            </a>
          </div>
          <p className="mentorship-request-note">
            {t(
              'Запит відкриває особисте листування в Instagram. Не надсилайте персональні дані чи знімки пацієнтів.',
            )}
          </p>
        </div>
      </section>
    </>
  )
}
