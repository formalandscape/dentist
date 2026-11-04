import { useRef, useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { ArrowUpRight, Check, LoaderCircle, Phone, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site } from '../data/site'
import { services } from '../data/services'
import { submitAppointment, validateAppointment } from '../lib/form'
import type { Appointment, FieldErrors } from '../lib/form'

const initial: Appointment = {
  name: '',
  phone: '',
  patient: 'Дорослий',
  direction: '',
  comment: '',
  consent: false,
  website: '',
}

export function AppointmentForm() {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [ready, setReady] = useState(false)
  const controller = useRef<AbortController | null>(null)
  const form = useRef<HTMLFormElement>(null)
  const locked = useRef(false)
  useEffect(() => () => controller.current?.abort(), [])
  useEffect(() => setReady(true), [])
  function update<K extends keyof Appointment>(key: K, value: Appointment[K]) {
    setValues((v) => ({ ...v, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
    if (status === 'error') {
      setStatus('idle')
      setMessage('')
    }
  }
  async function submit(event: FormEvent) {
    event.preventDefault()
    if (locked.current) return
    const nextErrors = validateAppointment(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() =>
        form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
      )
      return
    }
    locked.current = true
    setStatus('sending')
    const abort = new AbortController()
    controller.current = abort
    const timeout = setTimeout(() => abort.abort(), 15000)
    try {
      await submitAppointment(site.formEndpoint, values, abort.signal)
      setStatus('success')
      setValues(initial)
    } catch (error) {
      setStatus('error')
      setMessage(
        error instanceof Error && error.name !== 'AbortError' && error.name !== 'TypeError'
          ? error.message
          : 'Не вдалося підтвердити приймання заявки через проблему зі з’єднанням. Будь ласка, зв’яжіться телефоном.',
      )
    } finally {
      clearTimeout(timeout)
      locked.current = false
    }
  }
  const error = (key: keyof Appointment) =>
    errors[key] ? (
      <span className="field-error" id={`error-${key}`}>
        {errors[key]}
      </span>
    ) : null
  const attrs = (key: keyof Appointment) => ({
    'aria-invalid': !!errors[key],
    'aria-describedby': errors[key] ? `error-${key}` : undefined,
  })

  if (status === 'success')
    return (
      <div className="form-success" role="status">
        <span className="success-icon">
          <Check size={30} />
        </span>
        <h3>Дякую за вашу довіру.</h3>
        <p>Сервіс прийняв вашу заявку. Зв’яжемося з вами, щоб узгодити зручний час консультації.</p>
        <button className="text-link" onClick={() => setStatus('idle')}>
          Повернутися до форми <ArrowUpRight size={16} />
        </button>
      </div>
    )

  return (
    <form
      ref={form}
      method="post"
      className="appointment-form"
      onSubmit={submit}
      noValidate
      aria-label="Форма запису на консультацію"
      aria-busy={status === 'sending'}
    >
      {!site.formEndpoint && (
        <p className="form-availability">
          Онлайн-запис готується до відкриття.
          {site.contacts.phone && (
            <>
              {' '}
              Зараз можна{' '}
              <a href={`tel:${site.contacts.phone}`}>
                записатися телефоном <Phone size={13} aria-hidden="true" />
              </a>
              .
            </>
          )}
        </p>
      )}
      <noscript>
        <p className="form-availability">
          Для роботи форми потрібен JavaScript. Будь ласка, скористайтеся телефоном для запису.
        </p>
      </noscript>
      <fieldset disabled={!ready || status === 'sending'} className="form-fields">
        <legend className="sr-only">Ваші контактні дані</legend>
        <div className="form-row">
          <div className="field">
            <label htmlFor="name">
              Ваше ім’я <span>*</span>
            </label>
            <input
              id="name"
              name="name"
              autoComplete="given-name"
              maxLength={80}
              required
              placeholder="Як до вас звертатися?"
              value={values.name}
              onChange={(e) => update('name', e.target.value)}
              {...attrs('name')}
            />
            {error('name')}
          </div>
          <div className="field">
            <label htmlFor="phone">
              Номер телефону <span>*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={25}
              required
              placeholder="+380 __ ___ __ __"
              value={values.phone}
              onChange={(e) => update('phone', e.target.value)}
              {...attrs('phone')}
            />
            {error('phone')}
          </div>
        </div>
        <fieldset className="patient-options">
          <legend>
            Для кого консультація? <span>*</span>
          </legend>
          <div>
            {['Дорослий', 'Дитина'].map((p) => (
              <label className={`patient-option ${values.patient === p ? 'selected' : ''}`} key={p}>
                <input
                  type="radio"
                  name="patient"
                  value={p}
                  checked={values.patient === p}
                  onChange={() => update('patient', p)}
                />
                <span className="radio-circle">{values.patient === p && <span />}</span>
                {p}
              </label>
            ))}
          </div>
          {error('patient')}
        </fieldset>
        <div className="field">
          <label htmlFor="direction">
            Напрям звернення <span>*</span>
          </label>
          <select
            id="direction"
            name="direction"
            required
            value={values.direction}
            onChange={(e) => update('direction', e.target.value)}
            {...attrs('direction')}
          >
            <option value="">Оберіть напрям</option>
            <option>Первинна консультація</option>
            {services.map((s) => (
              <option key={s.id}>{s.title}</option>
            ))}
            <option>Потрібна порада лікаря</option>
          </select>
          {error('direction')}
        </div>
        <div className="field">
          <label htmlFor="comment">
            Ваш коментар <span className="optional">необов’язково</span>
          </label>
          <textarea
            id="comment"
            name="comment"
            rows={2}
            maxLength={500}
            placeholder="Наприклад, зручний час для дзвінка"
            value={values.comment}
            onChange={(e) => update('comment', e.target.value)}
            aria-describedby={`comment-help${errors.comment ? ' error-comment' : ''}`}
            aria-invalid={!!errors.comment}
          />
          <span id="comment-help" className="field-help">
            Будь ласка, не вказуйте діагнози та інші медичні дані.
          </span>
          {error('comment')}
        </div>
        <div className="honeypot" aria-hidden="true">
          <label htmlFor="website">Вебсайт</label>
          <input
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={(e) => update('website', e.target.value)}
          />
        </div>
        <div className="consent-field">
          <label className="consent">
            <input
              id="consent"
              type="checkbox"
              name="consent"
              required
              checked={values.consent}
              onChange={(e) => update('consent', e.target.checked)}
              {...attrs('consent')}
            />
            <span>
              Погоджуюся на обробку контактних даних для відповіді на звернення відповідно до{' '}
              <Link to="/polityka-konfidentsiinosti/">політики конфіденційності</Link>.
            </span>
          </label>
          {error('consent')}
        </div>
        <button
          className="button button-primary submit-button"
          type="submit"
          disabled={status === 'sending'}
        >
          <span>{status === 'sending' ? 'Надсилаємо…' : 'Надіслати заявку'}</span>
          {status === 'sending' ? (
            <LoaderCircle size={18} className="spinner" aria-hidden="true" />
          ) : (
            <ArrowUpRight size={18} aria-hidden="true" />
          )}
        </button>
      </fieldset>
      <div className="form-status" aria-live="polite" aria-atomic="true">
        {status === 'error' && (
          <p role="alert" className="form-error">
            {message}
          </p>
        )}
      </div>
      <p className="form-safety">
        <ShieldCheck size={15} aria-hidden="true" />
        Ваші дані — лише для зв’язку з вами.
      </p>
    </form>
  )
}
