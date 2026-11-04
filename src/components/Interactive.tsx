import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, ChevronsLeftRight, Plus, Quote } from 'lucide-react'
import { faq, reviews, treatmentResults } from '../data/site'
import { Eyebrow, Reveal } from './ui'
import { Encouragement } from './Atmosphere'

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  const reduced = useReducedMotion()
  return (
    <section id="faq" className="section faq-section">
      <div className="container faq-layout">
        <Reveal>
          <Eyebrow>Відповіді на ваші запитання</Eyebrow>
          <h2>
            Більше ясності.
            <br />
            <em>Менше хвилювань.</em>
          </h2>
          <p className="muted faq-intro">
            Усе починається з розмови. Зібрала відповіді на запитання, які найчастіше виникають
            перед першою зустріччю.
          </p>
          <Encouragement label="Запитувати — природно">
            Розуміння допомагає приймати зважені рішення. Для важливих запитань завжди є місце.
          </Encouragement>
        </Reveal>
        <div className="faq-list">
          {faq.map((item, i) => (
            <div className={`faq-item ${open === i ? 'is-open' : ''}`} key={item.question}>
              <h3>
                <button
                  id={`faq-button-${i}`}
                  aria-expanded={open === i}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span>{item.question}</span>
                  <Plus size={18} aria-hidden="true" />
                </button>
              </h3>
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
                  <p>{item.answer}</p>
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
  const [amount, setAmount] = useState(50)
  const [index, setIndex] = useState(0)
  const result = treatmentResults[index]
  return (
    <section id="results" className="section results-section">
      <div className="container results-layout">
        <Reveal>
          <Eyebrow>Результати лікування</Eyebrow>
          <h2>
            За кожною посмішкою —<br />
            <em>особиста історія.</em>
          </h2>
          <p className="muted">
            Кожен випадок індивідуальний. Тут з’являться реальні історії лікування — з повагою до
            приватності та лише за згодою пацієнтів.
          </p>
          <Encouragement label="У кожної посмішки — свій ритм">
            Важливо порівнювати себе із собою та рухатися за власним планом, а не за чужими
            очікуваннями.
          </Encouragement>
          <p className="small-note">
            Результати інших пацієнтів не є гарантією аналогічного результату лікування.
          </p>
          {treatmentResults.length > 1 && (
            <div className="carousel-controls">
              <button
                className="round-button"
                aria-label="Попередній результат"
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
                aria-label="Наступний результат"
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
                  <span className="tiny-caps">Простір для справжніх змін</span>
                  <span className="comparison-monogram">ЗТ</span>
                  <span>Фотографії незабаром</span>
                </div>
              </>
            )}
            <span className="comparison-label before-label">До</span>
            <span className="comparison-label after-label">Після</span>
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
              aria-label="Порівняння до та після"
              aria-valuetext={`${amount}% зображення до лікування`}
              className="comparison-range"
            />
          </div>
          <p className="comparison-caption">
            {result ? result.title : 'Дизайн-заглушка · клінічні фотографії не додані'}
            <span>
              Потягніть, щоб порівняти <ArrowLeft size={12} aria-hidden="true" />
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
  const [index, setIndex] = useState(0)
  const reduced = useReducedMotion()
  const review = reviews[index]
  return (
    <section className="reviews-section section">
      <div className="container">
        <Eyebrow>Відгуки пацієнтів</Eyebrow>
        <div className="reviews-layout">
          <h2>
            Найцінніше —<br />
            <em>ваша довіра.</em>
          </h2>
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
                        Переглянути джерело <ArrowRight size={15} />
                      </a>
                    )}
                  </>
                ) : (
                  <>
                    <blockquote>Довіра починається з чесності.</blockquote>
                    <p className="muted">
                      Тут будуть ваші справжні відгуки. Публікуватиму їх лише з дозволу пацієнтів —
                      зі збереженням ваших слів і вашої приватності.
                    </p>
                    <span className="tiny-caps review-empty-label">Перші історії — незабаром</span>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
            {reviews.length > 1 && (
              <div className="carousel-controls">
                <button
                  className="round-button"
                  aria-label="Попередній відгук"
                  onClick={() => setIndex((index - 1 + reviews.length) % reviews.length)}
                >
                  <ArrowLeft size={18} />
                </button>
                <span aria-live="polite">
                  {index + 1} / {reviews.length}
                </span>
                <button
                  className="round-button"
                  aria-label="Наступний відгук"
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
