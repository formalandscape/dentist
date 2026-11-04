import { useI18n } from '../i18n/I18n'
import { AnimatedHeading } from '../motion/AnimatedHeading'
import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, ChevronsLeftRight, Plus, Quote } from 'lucide-react'
import { faq, reviews, treatmentResults } from '../data/site'
import { Eyebrow, Reveal } from './ui'
import { Encouragement } from './Atmosphere'
import { Monogram } from './Monogram'

export function FAQ() {
  const { t } = useI18n()

  const [open, setOpen] = useState<number | null>(0)
  const reduced = useReducedMotion()
  return (
    <section id="faq" className="section faq-section">
      <div className="container faq-layout">
        <Reveal>
          <Eyebrow>{t('Відповіді на ваші запитання')}</Eyebrow>
          <AnimatedHeading as="h2">
            {t('Більше ясності.')}
            <br />
            <em>{t('Менше хвилювань.')}</em>
          </AnimatedHeading>
          <p className="muted faq-intro">
            {t(
              'Усе починається з розмови. Зібрала відповіді на запитання, які найчастіше виникають перед першою зустріччю.',
            )}
          </p>
          <Encouragement label={t('Запитувати — природно')}>
            {t(
              'Розуміння допомагає приймати зважені рішення. Для важливих запитань завжди є місце.',
            )}
          </Encouragement>
        </Reveal>
        <div className="faq-list">
          {faq.map((item, i) => (
            <div className={`faq-item ${open === i ? 'is-open' : ''}`} key={t(item.question)}>
              <AnimatedHeading as="h3">
                <button
                  id={`faq-button-${i}`}
                  aria-expanded={open === i}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span>{t(item.question)}</span>
                  <Plus size={18} aria-hidden="true" />
                </button>
              </AnimatedHeading>
              <motion.div
                id={`faq-panel-${i}`}
                role="region"
                aria-labelledby={`faq-button-${i}`}
                initial={false}
                animate={{
                  gridTemplateRows: open === i ? '1fr' : '0fr',
                  visibility: open === i ? 'visible' : 'hidden',
                }}
                transition={{ duration: reduced ? 0 : 0.3 }}
                className="faq-answer"
              >
                <div>
                  <p>{t(item.answer)}</p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Results() {
  const { t } = useI18n()

  const [amount, setAmount] = useState(50)
  const [index, setIndex] = useState(0)
  const result = treatmentResults[index]
  return (
    <section id="results" className="section results-section">
      <div className="container results-layout">
        <Reveal>
          <Eyebrow>{t('Результати лікування')}</Eyebrow>
          <AnimatedHeading as="h2">
            {t('За кожною посмішкою —')}
            <br />
            <em>{t('особиста історія.')}</em>
          </AnimatedHeading>
          <p className="muted">
            {t(
              'Кожен випадок індивідуальний. Тут з’являться реальні історії лікування — з повагою до приватності та лише за згодою пацієнтів.',
            )}
          </p>
          <Encouragement label={t('У кожної посмішки — свій ритм')}>
            {t(
              'Важливо порівнювати себе із собою та рухатися за власним планом, а не за чужими очікуваннями.',
            )}
          </Encouragement>
          <p className="small-note">
            {t('Результати інших пацієнтів не є гарантією аналогічного результату лікування.')}
          </p>
          {treatmentResults.length > 1 && (
            <div className="carousel-controls">
              <button
                className="round-button"
                aria-label={t('Попередній результат')}
                onClick={() => {
                  setIndex((index - 1 + treatmentResults.length) % treatmentResults.length)
                  setAmount(50)
                }}
              >
                <ArrowLeft size={18} />
              </button>
              <span>
                {index + 1} / {treatmentResults.length}
              </span>
              <button
                className="round-button"
                aria-label={t('Наступний результат')}
                onClick={() => {
                  setIndex((index + 1) % treatmentResults.length)
                  setAmount(50)
                }}
              >
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </Reveal>
        <Reveal className="comparison-wrap">
          <div className={`comparison ${result ? 'has-result' : ''}`}>
            {result ? (
              <>
                <img src={result.after} alt={result.afterAlt} loading="lazy" />
                <div
                  className="comparison-before"
                  style={{ clipPath: `inset(0 ${100 - amount}% 0 0)` }}
                >
                  <img src={result.before} alt={result.beforeAlt} loading="lazy" />
                </div>
              </>
            ) : (
              <>
                <div className="comparison-art" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <div
                  className="comparison-tint"
                  style={{ clipPath: `inset(0 ${100 - amount}% 0 0)` }}
                />
                <div className="comparison-placeholder">
                  <span className="tiny-caps">{t('Простір для справжніх змін')}</span>
                  <Monogram className="comparison-monogram" />
                  <span>{t('Фотографії незабаром')}</span>
                </div>
              </>
            )}
            <span className="comparison-label before-label">{t('До')}</span>
            <span className="comparison-label after-label">{t('Після')}</span>
            <div className="comparison-divider" style={{ left: `${amount}%` }} aria-hidden="true">
              <span>
                <ChevronsLeftRight size={20} />
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="97"
              value={amount}
              onChange={(e) => setAmount(+e.target.value)}
              aria-label={t('Порівняння до та після')}
              aria-valuetext={`${amount}${t('% зображення до лікування')}`}
              className="comparison-range"
            />
          </div>
          <p className="comparison-caption">
            {result ? result.title : t('Дизайн-заглушка · клінічні фотографії не додані')}
            <span>
              {t('Потягніть, щоб порівняти ')}
              <ArrowLeft size={12} aria-hidden="true" />
              <ArrowRight size={12} aria-hidden="true" />
            </span>
          </p>
          {result && <p className="small-note">{result.description}</p>}
        </Reveal>
      </div>
    </section>
  )
}

export function Reviews() {
  const { t } = useI18n()

  const [index, setIndex] = useState(0)
  const reduced = useReducedMotion()
  const review = reviews[index]
  return (
    <section className="reviews-section section">
      <div className="container">
        <Eyebrow>{t('Відгуки пацієнтів')}</Eyebrow>
        <div className="reviews-layout">
          <AnimatedHeading as="h2">
            {t('Найцінніше —')}
            <br />
            <em>{t('ваша довіра.')}</em>
          </AnimatedHeading>
          <div className="review-content">
            <Quote className="quote-icon" size={38} strokeWidth={1} aria-hidden="true" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={review?.id || 'empty'}
                initial={{ opacity: 0, y: reduced ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.25 }}
              >
                {review ? (
                  <>
                    <blockquote>{review.text}</blockquote>
                    <p className="review-author">
                      {review.name}
                      {review.date && <span>{review.date}</span>}
                    </p>
                    {review.sourceUrl && (
                      <a
                        className="text-link"
                        href={review.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t('Переглянути джерело ')}
                        <ArrowRight size={15} />
                      </a>
                    )}
                  </>
                ) : (
                  <>
                    <blockquote>{t('Довіра починається з чесності.')}</blockquote>
                    <p className="muted">
                      {t(
                        'Тут будуть ваші справжні відгуки. Публікуватиму їх лише з дозволу пацієнтів — зі збереженням ваших слів і вашої приватності.',
                      )}
                    </p>
                    <span className="tiny-caps review-empty-label">
                      {t('Перші історії — незабаром')}
                    </span>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
            {reviews.length > 1 && (
              <div className="carousel-controls">
                <button
                  className="round-button"
                  aria-label={t('Попередній відгук')}
                  onClick={() => setIndex((index - 1 + reviews.length) % reviews.length)}
                >
                  <ArrowLeft size={18} />
                </button>
                <span aria-live="polite">
                  {index + 1} / {reviews.length}
                </span>
                <button
                  className="round-button"
                  aria-label={t('Наступний відгук')}
                  onClick={() => setIndex((index + 1) % reviews.length)}
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
