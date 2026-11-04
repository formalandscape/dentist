import { ArrowLeft, ArrowUpRight, Check, Phone } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { services, servicePath } from './data/services'
import { site } from './data/site'
import { Action, Eyebrow, Photo, Reveal } from './components/ui'
import { AppointmentSection } from './Home'

export function ServicePage() {
  const { id } = useParams()
  const service = services.find((s) => s.id === id)
  if (!service) return <NotFound />
  return (
    <>
      <section className="service-hero section">
        <div className="container">
          <Link className="back-link" to="/#services">
            <ArrowLeft size={15} />
            Усі напрями лікування
          </Link>
          <div className="service-hero-layout">
            <Reveal>
              <Eyebrow>Ортодонтія з увагою до вас · Київ</Eyebrow>
              <h1>{service.title}</h1>
              <p className="service-subtitle">{service.subtitle}</p>
              <p className="muted">{service.intro}</p>
              <Action to="/#appointment">Записатися на консультацію</Action>
            </Reveal>
            <Photo kind={service.image} className="service-page-photo" />
          </div>
        </div>
      </section>
      <section className="section service-details">
        <div className="container service-detail-layout">
          <div>
            <Eyebrow>Індивідуальний підхід</Eyebrow>
            <h2>
              Рішення починається
              <br />
              <em>з діагностики.</em>
            </h2>
          </div>
          <div>
            <h3>Що варто знати</h3>
            <ul>
              {service.details.map((detail) => (
                <li key={detail}>
                  <Check size={18} aria-hidden="true" />
                  <p>{detail}</p>
                </li>
              ))}
            </ul>
            <div className="service-note">
              <h3>Важливі деталі</h3>
              <p>{service.note}</p>
            </div>
            <p className="muted">
              Тривалість і вартість лікування можна визначити після діагностики та узгодження
              індивідуального плану. Інформація на сторінці не замінює особистої консультації.
            </p>
          </div>
        </div>
      </section>
      <section className="section more-services">
        <div className="container">
          <Eyebrow>Дізнайтеся більше</Eyebrow>
          <h2>
            Інші <em>напрями.</em>
          </h2>
          <div className="more-service-links">
            {services
              .filter((s) => s.id !== service.id)
              .map((s) => (
                <Link key={s.id} to={servicePath(s.id)}>
                  <span>{s.number}</span>
                  {s.title}
                  <ArrowUpRight size={20} />
                </Link>
              ))}
          </div>
        </div>
      </section>
      <AppointmentSection />
    </>
  )
}

export function PrivacyPage() {
  return (
    <article className="section legal-page">
      <div className="container legal-container">
        <Link className="back-link" to="/">
          <ArrowLeft size={15} />
          На головну
        </Link>
        <Eyebrow>З повагою до вашої приватності</Eyebrow>
        <h1>
          Політика
          <br />
          <em>конфіденційності.</em>
        </h1>
        <p className="muted">Оновлено 4 листопада 2026 року</p>
        <div className="legal-content">
          <p>
            Цей сайт представляє лікаря стоматолога-ортодонта Теплу Зоряну Миколаївну у Києві.
            Політика пояснює, як сайт працює з контактними даними відвідувачів.
          </p>
          <h2>Які дані запитуємо</h2>
          <p>
            Форма консультації запитує ім’я, номер телефону, для кого потрібна консультація (дитина
            або дорослий), напрям звернення, необов’язковий короткий коментар та згоду на обробку
            даних. Не вказуйте діагнози, медичні документи, відомості про здоров’я, ім’я чи інші
            персональні дані дитини. Для запису дитини контактні дані залишає її законний
            представник.
          </p>
          <h2>Для чого потрібні дані</h2>
          <p>
            Дані використовуються для відповіді на ваше звернення та узгодження консультації.
            Підстава — ваша добровільна згода, яку ви надаєте окремою позначкою у формі. Дані не
            призначені для рекламних розсилок.
          </p>
          <h2>Як надсилається звернення</h2>
          <p>
            {site.formEndpoint
              ? 'Для доставки заявок використовується сервіс Formspree. Після натискання кнопки надсилання контактні дані передаються цьому сервісу через HTTPS і далі одержувачу форми.'
              : 'Сервіс онлайн-запису ще не підключено. Зараз дані форми не передаються на сервер і не зберігаються сайтом. Для запису доступний телефон у розділі «Контакти». Після підключення Formspree його використання буде відображено в цій політиці.'}
          </p>
          <p>
            У разі використання Formspree сервіс може обробляти технічні відомості, зокрема
            IP-адресу, для доставки та захисту від спаму. Обробка може відбуватися за межами
            України. Умови сервісу:{' '}
            <a
              href="https://formspree.io/legal/privacy-policy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              політика конфіденційності Formspree
            </a>
            . Сайт не показує повідомлення про успіх без підтвердження приймання сервісом.
          </p>
          <h2>Зберігання і захист</h2>
          <p>
            Сайт не записує вміст форми в URL, localStorage, cookies чи публічні файли. Дані
            введення існують у пам’яті сторінки до її закриття або перезавантаження. Після
            підключення сервісу заявки оброблятимуться одержувачем і сервісом доставки; доступ до
            них має бути обмежений, а дані видалятимуться, щойно потреба у відповіді та узгодженні
            консультації відпаде, з урахуванням законних вимог зберігання.
          </p>
          <h2>Cookies та зовнішні сервіси</h2>
          <p>
            На сайті немає рекламних трекерів і аналітичних cookies. Шрифти та ілюстрації
            завантажуються разом із сайтом. Хостинг може вести технічні журнали запитів відповідно
            до власної політики. Посилання на Instagram і зовнішні сервіси відкривають сторонні
            сайти з їхніми правилами приватності.
          </p>
          {site.contacts.mapsEmbed && (
            <p>
              На сторінці контактів вбудована карта Google Maps. Її завантаження може передавати
              Google технічні дані, зокрема IP-адресу; застосовується політика конфіденційності
              Google.
            </p>
          )}
          <h2>Ваші права і зв’язок</h2>
          <p>
            Ви можете запросити інформацію про обробку свого звернення, уточнення чи видалення
            даних, а також відкликати згоду. Це не впливає на правомірність попередньої обробки. Для
            запиту зв’яжіться з лікарем за публічним телефоном нижче. Не надсилайте у відкритих
            повідомленнях медичні документи.
          </p>
          {site.contacts.phone && (
            <a className="text-link" href={`tel:${site.contacts.phone}`}>
              <Phone size={16} />
              {site.contacts.phoneDisplay}
            </a>
          )}
          <h2>Медична інформація</h2>
          <p>
            Матеріали сайту мають інформаційний характер і не є дистанційною діагностикою або
            індивідуальною медичною рекомендацією. Для визначення діагнозу й плану лікування
            потрібна особиста консультація.
          </p>
        </div>
      </div>
    </article>
  )
}

export function NotFound() {
  return (
    <section className="not-found section">
      <div className="container">
        <Eyebrow>404 · Сторінку не знайдено</Eyebrow>
        <h1>
          Повернімося
          <br />
          <em>до знайомства.</em>
        </h1>
        <p className="muted">
          Можливо, адреса змінилася. Головна сторінка допоможе знайти потрібну інформацію.
        </p>
        <Action to="/">На головну</Action>
      </div>
    </section>
  )
}
