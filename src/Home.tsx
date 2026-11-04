import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Clock3,
  Heart,
  Instagram,
  MapPin,
  Phone,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Action, Eyebrow, Flower, Photo, Reveal } from './components/ui'
import { AppointmentForm } from './components/AppointmentForm'
import { FAQ, Results, Reviews } from './components/Interactive'
import { site } from './data/site'
import { services, servicePath } from './data/services'
import { Encouragement, Invitation } from './components/Atmosphere'
import { journeyPath } from './data/journey'

function PortraitPlaceholder({ hero = false }: { hero?: boolean }) {
  if (site.doctor.portrait)
    return (
      <img
        src={site.doctor.portrait}
        alt={site.doctor.portraitAlt}
        className="doctor-portrait"
        width="700"
        height="850"
        loading={hero ? 'eager' : 'lazy'}
      />
    )
  return (
    <div
      className={`portrait-placeholder ${hero ? 'portrait-hero' : ''}`}
      role="img"
      aria-label="Елегантна дизайн-заглушка для майбутнього портрета лікаря Зоряни Теплої"
    >
      <div className="portrait-light" />
      <div className="portrait-arch">
        <div className="portrait-arch-inner" />
      </div>
      <div className="portrait-line-art">
        <svg viewBox="0 0 400 540" fill="none" aria-hidden="true">
          <path
            d="M-40 505C80 492 138 378 198 275S288 98 405 55M78 445C58 407 43 367 72 346c26 32 30 59 6 99ZM130 385c-18-48-16-82 14-103 17 39 14 74-14 103ZM183 301c-10-49-5-82 27-100 11 38 7 72-27 100ZM233 219c-3-47 11-80 46-93 3 36-9 69-46 93ZM276 153c9-40 34-66 69-70-5 36-29 60-69 70ZM105 420c36-15 77-15 97 10-34 22-70 20-97-10ZM156 346c38-18 77-18 98 9-34 23-72 20-98-9ZM204 266c35-20 75-23 99 1-32 26-70 27-99-1ZM252 189c38-19 74-14 93 9-35 24-70 20-93-9Z"
            stroke="currentColor"
            strokeWidth="0.9"
          />
        </svg>
      </div>
      <span className="portrait-wordmark" aria-hidden="true">
        З<span>Т</span>
      </span>
      <div className="portrait-caption">
        <span className="tiny-caps">Особисте знайомство — незабаром</span>
        <span>Місце для портрета лікаря</span>
      </div>
      <span className="portrait-vertical" aria-hidden="true">
        ІНДИВІДУАЛЬНІСТЬ У КОЖНІЙ ДЕТАЛІ
      </span>
    </div>
  )
}

function Hero() {
  const target = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 36])
  return (
    <section className="hero" ref={target}>
      <div className="container hero-layout">
        <motion.div
          className="hero-copy"
          initial={false}
          animate={reduced ? {} : { opacity: [0.85, 1], y: [16, 0] }}
          transition={{ duration: reduced ? 0 : 0.8 }}
        >
          <div className="hero-location">
            <span className="status-dot" />
            ПЕРСОНАЛЬНА ОРТОДОНТІЯ <span className="location-divider">/</span> КИЇВ
          </div>
          <p className="hero-promise">Впевненість починається з усмішки.</p>
          <h1>
            Ваша посмішка.
            <br />
            <span className="hero-indent">Моя професійна</span>
            <br />
            <em>турбота.</em>
            <Flower />
          </h1>
          <div className="hero-description">
            <span className="hero-description-line" />
            <p>
              <strong>Зоряна Тепла</strong> — лікар стоматолог-ортодонт у Києві. Понад 20 років
              досвіду в ортодонтичному лікуванні дітей і дорослих.
            </p>
          </div>
          <div className="hero-actions">
            <Action to="/#appointment">Записатися на консультацію</Action>
            <Link to="/#about" className="text-link">
              Познайомитися з лікарем <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className="hero-bottom">
            <span className="hero-bottom-icon">
              <Heart size={17} strokeWidth={1.4} aria-hidden="true" />
            </span>
            <span>
              З увагою до здоров’я.
              <br />
              <strong>З повагою до вашої індивідуальності.</strong>
            </span>
          </div>
        </motion.div>
        <motion.div
          className="hero-visual"
          style={{ y: reduced ? 0 : y }}
          initial={false}
          animate={reduced ? {} : { opacity: [0.85, 1] }}
          transition={{ duration: reduced ? 0 : 1, delay: reduced ? 0 : 0.15 }}
        >
          <div className="hero-photo-frame">
            <PortraitPlaceholder hero />
          </div>
          <div className="experience-note">
            <span className="experience-number">
              24<span>роки</span>
            </span>
            <span>
              досвіду, що стає
              <br />
              вашою впевненістю
            </span>
            <Sparkles size={22} strokeWidth={1} aria-hidden="true" />
          </div>
          <div className="hero-photo-footer">
            <span>ЗОРЯНА ТЕПЛА</span>
            <span>ЛІКАР СТОМАТОЛОГ-ОРТОДОНТ</span>
          </div>
        </motion.div>
      </div>
      <div className="container hero-scroll">
        <a href="#trust">
          <ArrowDown size={15} aria-hidden="true" />
          <span>ЗНАЙОМСТВО ПОЧИНАЄТЬСЯ ТУТ</span>
        </a>
        <span>ЕСТЕТИКА. ФУНКЦІЯ. ГАРМОНІЯ.</span>
      </div>
    </section>
  )
}

function TrustStrip() {
  return (
    <div id="trust" className="trust-strip">
      <div className="container trust-grid">
        <div>
          <span className="trust-number">24</span>
          <span>
            роки професійного
            <br />
            досвіду
          </span>
        </div>
        <div>
          <span className="trust-symbol">
            <Heart size={27} strokeWidth={1} />
          </span>
          <span>
            Делікатна турбота
            <br />
            про дітей і дорослих
          </span>
        </div>
        <div>
          <span className="trust-abbreviations">
            АОУ · EOS
            <br />
            WFO · AAO
          </span>
          <span>
            Українська та міжнародна
            <br />
            професійна спільнота
          </span>
        </div>
      </div>
    </div>
  )
}

function About() {
  return (
    <section id="about" className="section about-section">
      <div className="container about-layout">
        <Reveal className="about-visual">
          <div className="about-photo-frame">
            <PortraitPlaceholder />
          </div>
          <div className="about-caption">
            <span>Зоряна Тепла</span>
            <span>Лікар стоматолог-ортодонт</span>
          </div>
          <Flower className="about-flower" />
        </Reveal>
        <Reveal className="about-copy">
          <Eyebrow>Давайте познайомимося</Eyebrow>
          <h2>
            Досвід, якому
            <br />
            <em>можна довіряти.</em>
          </h2>
          <p className="lead">
            За красивою посмішкою я завжди бачу людину. Її історію, очікування та індивідуальність.
          </p>
          <p className="muted">
            Мене звати Зоряна Тепла. Я лікар стоматолог-ортодонт, і вже понад 20 років моя
            професійна діяльність присвячена здоров’ю зубощелепної системи та гармонії посмішок.
          </p>
          <p className="muted">
            Працюю з дітьми та дорослими, приділяючи особливу увагу індивідуальній діагностиці та
            плануванню лікування. Мені важливо, щоб ви розуміли кожен крок і почувалися спокійно на
            цьому шляху.
          </p>
          <Encouragement label="Кожна людина — особлива">
            Кожна посмішка заслуговує на індивідуальний підхід. Ваші очікування — важлива частина
            нашої розмови.
          </Encouragement>
          <div className="doctor-signature">
            <span>Зоряна Тепла</span>
            <span>З турботою про вашу посмішку</span>
          </div>
          <Link className="text-link" to="/#approach">
            Більше про мій підхід <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

function Associations() {
  return (
    <section className="associations-section">
      <div className="container">
        <div className="associations-heading">
          <span className="tiny-caps">У професійній спільноті</span>
          <span>Спільні цінності. Постійний розвиток.</span>
        </div>
        <div className="associations-grid">
          {site.associations.map((a) => (
            <div className="association" key={a.name}>
              <span>{a.name}</span>
              <p>{a.description}</p>
            </div>
          ))}
        </div>
        <p className="association-note">
          Професійна спільнота об’єднує навколо спільного прагнення: уважної та обґрунтованої
          допомоги пацієнтам.
        </p>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section id="services" className="section services-section">
      <div className="container">
        <Reveal className="section-heading">
          <div>
            <Eyebrow>Напрями лікування</Eyebrow>
            <h2>
              Різні шляхи.
              <br />
              <em>Одна увага до вас.</em>
            </h2>
          </div>
          <p className="muted">
            Обираємо метод, який відповідає вашій клінічній ситуації, потребам і ритму життя.
          </p>
        </Reveal>
        <div className="services-grid">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.07}>
              <Link className="service-card" to={servicePath(s.id)}>
                <div className="service-image">
                  <Photo kind={s.image} />
                  <span className="service-number">{s.number}</span>
                  <span className="service-image-arrow">
                    <ArrowUpRight size={21} strokeWidth={1.3} aria-hidden="true" />
                  </span>
                </div>
                <div className="service-card-copy">
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                  <span className="text-link">
                    Дізнатися більше <ArrowUpRight size={15} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <Encouragement label="Гармонія в деталях">
          Естетика й здоров’я доповнюють одне одного. Почнімо з розуміння вашого прикусу, а вже
          потім обиратимемо метод.
        </Encouragement>
        <p className="image-disclosure">
          Зображення предметів — ілюстративні. Метод лікування визначається після консультації.
        </p>
      </div>
    </section>
  )
}

function Approach() {
  const reasons = [
    '24 роки клінічної практики',
    'Увага до функції прикусу й естетики',
    'Лікування дітей, підлітків і дорослих',
    'Індивідуальна діагностика та планування',
    'Участь у міжнародній ортодонтичній спільноті',
  ]
  return (
    <section id="approach" className="approach-section">
      <div className="container approach-layout">
        <Reveal className="approach-copy">
          <Eyebrow light>Чому пацієнти обирають мене</Eyebrow>
          <h2>
            Не просто рівні зуби.
            <br />
            <em>
              Гармонія, що має
              <br />
              значення.
            </em>
          </h2>
          <p>
            Я дивлюся ширше за естетику посмішки — на здоров’я, функцію та ваше самопочуття. Кожне
            рішення має бути обґрунтованим, а кожен крок — зрозумілим.
          </p>
          <ul>
            {reasons.map((r) => (
              <li key={r}>
                <Check size={16} strokeWidth={1.5} aria-hidden="true" />
                {r}
              </li>
            ))}
          </ul>
          <Encouragement dark label="У центрі уваги — ви">
            Турбота про посмішку сьогодні — внесок у ваше уважне ставлення до здоров’я в
            майбутньому.
          </Encouragement>
          <Action to="/#appointment" secondary>
            Почнімо зі знайомства
          </Action>
        </Reveal>
        <Reveal className="approach-visual">
          <Photo kind="balance" />
          <div className="approach-quote">
            <span className="tiny-caps">МІЙ ПІДХІД</span>
            <blockquote>
              Лікувати людину,
              <br />а не лише
              <br />
              <em>її посмішку.</em>
            </blockquote>
            <span>Зоряна Тепла</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Consultation() {
  const steps = [
    { title: 'Знайомство', text: 'Розмовляємо про ваші очікування, скарги та побажання.' },
    { title: 'Уважний огляд', text: 'Оцінюю положення зубів, прикус і функціональні особливості.' },
    { title: 'Діагностика', text: 'Визначаю, які обстеження потрібні саме у вашому випадку.' },
    { title: 'Зрозумілий план', text: 'Обговорюємо можливі методи лікування та наступні кроки.' },
  ]
  return (
    <section className="section consultation-section">
      <div className="container">
        <Reveal className="section-heading">
          <div>
            <Eyebrow>Як проходить консультація</Eyebrow>
            <h2>
              Спокійно. Зрозуміло.
              <br />
              <em>У вашому темпі.</em>
            </h2>
          </div>
          <p className="muted">
            Перша зустріч — це можливість познайомитися, отримати відповіді та побачити свій
            наступний крок.
          </p>
        </Reveal>
        <div className="steps-grid">
          {steps.map((step, i) => (
            <Reveal key={step.title} className="step" delay={i * 0.09}>
              <div className="step-line">
                <span>0{i + 1}</span>
                <span className="step-dot" />
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function AppointmentSection() {
  return (
    <section id="appointment" className="section appointment-section">
      <div className="container appointment-layout">
        <Reveal className="appointment-copy">
          <Eyebrow>Ваш новий початок</Eyebrow>
          <h2>
            Перший крок
            <br />
            до здорової
            <br />
            <em>
              та гармонійної
              <br />
              посмішки.
            </em>
          </h2>
          <p className="muted">
            Почнімо з розмови. Я допоможу розібратися у вашій ситуації та зрозуміти, з чого варто
            почати.
          </p>
          {site.contacts.phone && (
            <div className="appointment-phone">
              <span>Зручніше поговорити особисто?</span>
              <a href={`tel:${site.contacts.phone}`}>
                {site.contacts.phoneDisplay}
                <ArrowUpRight size={19} aria-hidden="true" />
              </a>
            </div>
          )}
          <Encouragement label="Рішення без поспіху">
            Дозвольте собі поставити запитання. Перша консультація — простір для ясності та
            спокійного вибору.
          </Encouragement>
          <Flower className="appointment-flower" />
        </Reveal>
        <Reveal className="form-card">
          <div className="form-heading">
            <h3>Запис на консультацію</h3>
            <span>Знайдемо зручний час для знайомства</span>
          </div>
          <AppointmentForm />
        </Reveal>
      </div>
    </section>
  )
}

function Contacts() {
  return (
    <section id="contacts" className="section contacts-section">
      <div className="container contacts-layout">
        <Reveal>
          <Eyebrow>Будьмо на зв’язку</Eyebrow>
          <h2>
            До зустрічі
            <br />
            <em>у Києві.</em>
          </h2>
          <p className="muted">
            Прийом проводиться на базі клініки.
            {site.contacts.address
              ? ''
              : ' Адресу клініки буде додано пізніше. Уточнити місце прийому можна під час запису.'}
          </p>
          <Encouragement label="Ми поруч із вашим рішенням">
            Ваш шлях до гармонійної посмішки може початися з однієї розмови.
          </Encouragement>
          <div className="contact-details">
            {site.contacts.phone && (
              <a href={`tel:${site.contacts.phone}`}>
                <Phone size={19} strokeWidth={1.3} aria-hidden="true" />
                <span>
                  <span className="contact-label">Телефон для запису</span>
                  {site.contacts.phoneDisplay}
                </span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            )}
            {site.contacts.instagram && (
              <a href={site.contacts.instagram} target="_blank" rel="noopener noreferrer">
                <Instagram size={20} strokeWidth={1.3} aria-hidden="true" />
                <span>
                  <span className="contact-label">Більше знайомства в Instagram</span>
                  @dr.zoryana.tepla
                </span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            )}
            <div>
              <Clock3 size={20} strokeWidth={1.3} aria-hidden="true" />
              <span>
                <span className="contact-label">Графік прийому</span>
                {site.contacts.schedule || 'За попереднім записом'}
              </span>
            </div>
          </div>
        </Reveal>
        <Reveal className="map-card">
          {site.contacts.mapsEmbed ? (
            <iframe
              title="Розташування місця прийому на Google Maps"
              src={site.contacts.mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="map-placeholder">
              <div className="map-grid" aria-hidden="true" />
              <svg
                viewBox="0 0 600 430"
                preserveAspectRatio="none"
                className="map-river"
                aria-hidden="true"
              >
                <path
                  d="M430-30C245 90 470 145 322 242S320 365 210 465"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="45"
                />
                <path
                  d="M-20 80L620 285M120-20L265 460M470-20L390 460M-30 330L600 70"
                  fill="none"
                  stroke="#f8f7f4"
                  strokeWidth="7"
                />
              </svg>
              <div className="map-location">
                <span className="map-pin">
                  <MapPin size={25} strokeWidth={1.3} />
                </span>
                <span>Київ</span>
                <span>Точну адресу буде додано</span>
              </div>
              <span className="map-disclosure">Декоративна схема · не карта місця прийому</span>
            </div>
          )}
          {site.contacts.address && <p>{site.contacts.address}</p>}
        </Reveal>
      </div>
    </section>
  )
}

export function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <About />
      <Associations />
      <Services />
      <Approach />
      <Consultation />
      <Invitation
        title="Побачте свій шлях цілком."
        text="Від першого знайомства до ретенції: шість етапів, які допоможуть зрозуміти лікування, підготувати запитання й відчути більше впевненості."
        to={journeyPath}
        link="Ваш шлях до посмішки"
      />
      <Results />
      <Reviews />
      <FAQ />
      <AppointmentSection />
      <Contacts />
    </>
  )
}
