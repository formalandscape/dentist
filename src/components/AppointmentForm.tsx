import { useI18n } from '../i18n/I18n'
import { AnimatedHeading } from '../motion/AnimatedHeading'
import { useRef, useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { ArrowUpRight, Check, LoaderCircle, Phone, ShieldCheck } from 'lucide-react'
import { Link } from '../i18n/I18n'
import { site } from '../data/site'
import { motion, useReducedMotion } from 'motion/react'
import { silk } from '../motion/presets'
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
  const { t } = useI18n()

  const reduced = useReducedMotion()
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
          : t(
              'Не вдалося підтвердити приймання заявки через проблему зі з’єднанням. Будь ласка, зв’яжіться телефоном.',
            ),
      )
    } finally {
      clearTimeout(timeout)
      locked.current = false
    }
  }
  const error = (key: keyof Appointment) =>
    errors[key] ? (
      <motion.span
        className="field-error"
        id={`error-${key}`}
        initial={false}
        animate={reduced ? { opacity: 1, y: 0 } : { opacity: [0.6, 1], y: [5, 0] }}
        transition={{ duration: reduced ? 0 : silk.micro, ease: silk.ease }}
      >
        {t(errors[key]!)}
      </motion.span>
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
        <AnimatedHeading as="h3">{t('Дякую за вашу довіру.')}</AnimatedHeading>
        <p>
          {t(
            'Сервіс прийняв вашу заявку. Зв’яжемося з вами, щоб узгодити зручний час консультації.',
          )}
        </p>
        <button className="text-link" onClick={() => setStatus('idle')}>
          {t('Повернутися до форми ')}
          <ArrowUpRight size={16} />
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
      aria-label={t('Форма запису на консультацію')}
      aria-busy={status === 'sending'}
    >
      {!site.formEndpoint && (
        <p className="form-availability">
          {t('Онлайн-запис готується до відкриття.')}
          {site.contacts.phone && (
            <>
              {' '}
              {t('Зараз можна')}{' '}
              <a href={`tel:${site.contacts.phone}`}>
                {t('записатися телефоном ')}
                <Phone size={13} aria-hidden="true" />
              </a>
              .
            </>
          )}
        </p>
      )}
      <noscript>
        <p className="form-availability">
          {t(
            'Для роботи форми потрібен JavaScript. Будь ласка, скористайтеся телефоном для запису.',
          )}
        </p>
      </noscript>
      <fieldset disabled={!ready || status === 'sending'} className="form-fields">
        <legend className="sr-only">{t('Ваші контактні дані')}</legend>
        <div className="form-row">
          <div className="field">
            <label htmlFor="name">
              {t('Ваше ім’я ')}
              <span>*</span>
            </label>
            <input
              id="name"
              name="name"
              autoComplete="given-name"
              maxLength={80}
              required
              placeholder={t('Як до вас звертатися?')}
              value={values.name}
              onChange={(e) => update('name', e.target.value)}
              {...attrs('name')}
            />
            {error('name')}
          </div>
          <div className="field">
            <label htmlFor="phone">
              {t('Номер телефону ')}
              <span>*</span>
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
            {t('Для кого консультація? ')}
            <span>*</span>
          </legend>
          <div>
            {['Дорослий', 'Дитина'].map((p) => (
              <label
                className={`patient-option ${values.patient === p ? 'selected' : ''}`}
                key={t(p)}
              >
                <input
                  type="radio"
                  name="patient"
                  value={p}
                  checked={values.patient === p}
                  onChange={() => update('patient', p)}
                />
                <span className="radio-circle">{values.patient === p && <span />}</span>
                {t(p)}
              </label>
            ))}
          </div>
          {error('patient')}
        </fieldset>
        <div className="field">
          <label htmlFor="direction">
            {t('Напрям звернення ')}
            <span>*</span>
          </label>
          <select
            id="direction"
            name="direction"
            required
            value={values.direction}
            onChange={(e) => update('direction', e.target.value)}
            {...attrs('direction')}
          >
            <option value="">{t('Оберіть напрям')}</option>
            <option value="Первинна консультація">{t('Первинна консультація')}</option>
            {services.map((s) => (
              <option key={s.id} value={s.title}>
                {t(s.title)}
              </option>
            ))}
            <option value="Потрібна порада лікаря">{t('Потрібна порада лікаря')}</option>
          </select>
          {error('direction')}
        </div>
        <div className="field">
          <label htmlFor="comment">
            {t('Ваш коментар ')}
            <span className="optional">{t('необов’язково')}</span>
          </label>
          <textarea
            id="comment"
            name="comment"
            rows={2}
            maxLength={500}
            value={values.comment}
            onChange={(e) => update('comment', e.target.value)}
            aria-describedby={errors.comment ? 'error-comment' : undefined}
            aria-invalid={!!errors.comment}
          />
          {error('comment')}
        </div>
        <div className="honeypot" aria-hidden="true">
          <label htmlFor="website">{t('Вебсайт')}</label>
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
              {t('Погоджуюся на обробку контактних даних для відповіді на звернення відповідно до')}{' '}
              <Link to="/polityka-konfidentsiinosti/">{t('політики конфіденційності')}</Link>.
            </span>
          </label>
          {error('consent')}
        </div>
        <button
          className="button button-primary submit-button"
          type="submit"
          disabled={status === 'sending'}
        >
          <span>{status === 'sending' ? t('Надсилаємо…') : t('Надіслати заявку')}</span>
          {status === 'sending' ? (
            <LoaderCircle size={18} className="spinner" aria-hidden="true" />
          ) : (
            <ArrowUpRight size={18} aria-hidden="true" />
          )}
        </button>
      </fieldset>
      <div className="form-status" aria-live="polite" aria-atomic="true">
        {status === 'error' && (
          <motion.p
            role="alert"
            className="form-error"
            initial={false}
            animate={reduced ? { opacity: 1, y: 0 } : { opacity: [0.6, 1], y: [7, 0] }}
            transition={{ duration: reduced ? 0 : 0.36, ease: silk.ease }}
          >
            {t(message)}
          </motion.p>
        )}
      </div>
      <p className="form-safety">
        <ShieldCheck size={15} aria-hidden="true" />
        {t('Ваші дані — лише для зв’язку з вами.')}
      </p>
    </form>
  )
}
