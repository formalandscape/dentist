export type Appointment = {
  name: string
  phone: string
  patient: string
  direction: string
  comment: string
  consent: boolean
  website: string
}
export type FieldErrors = Partial<Record<keyof Appointment, string>>
export function validateAppointment(values: Appointment): FieldErrors {
  const errors: FieldErrors = {}
  if (values.name.trim().length < 2 || values.name.trim().length > 80)
    errors.name = 'Вкажіть ім’я: від 2 до 80 символів.'
  const digits = values.phone.replace(/\D/g, '')
  if (!/^\+?[\d\s()\-]+$/.test(values.phone.trim()) || digits.length < 10 || digits.length > 15)
    errors.phone = 'Вкажіть коректний номер телефону: від 10 до 15 цифр.'
  if (!['Дорослий', 'Дитина'].includes(values.patient))
    errors.patient = 'Оберіть, для кого потрібна консультація.'
  if (!values.direction) errors.direction = 'Оберіть напрям звернення.'
  if (values.comment.length > 500) errors.comment = 'Будь ласка, обмежте коментар 500 символами.'
  if (!values.consent) errors.consent = 'Для надсилання потрібна ваша згода.'
  return errors
}

export async function submitAppointment(
  endpoint: string,
  values: Appointment,
  signal: AbortSignal,
) {
  if (!/^https:\/\/formspree\.io\/f\/[a-z0-9]+$/i.test(endpoint))
    throw new Error(
      'Онлайн-запис поки недоступний. Будь ласка, скористайтеся телефоном у розділі «Контакти».',
    )
  if (values.website) throw new Error('Не вдалося надіслати форму. Спробуйте ще раз.')
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({
      name: values.name.trim(),
      phone: values.phone.trim(),
      patient: values.patient,
      direction: values.direction,
      comment: values.comment.trim(),
      consent: values.consent,
      _gotcha: values.website,
      _subject: 'Нова заявка на консультацію — сайт Зоряни Теплої',
    }),
  })
  if (response.status === 429)
    throw new Error('Забагато спроб. Будь ласка, зачекайте кілька хвилин.')
  if (!response.ok)
    throw new Error(
      'Сервіс не прийняв заявку. Спробуйте пізніше або скористайтеся телефоном у контактах, якщо його вказано.',
    )
  const body = await response.json().catch(() => null)
  if (body?.ok !== true)
    throw new Error(
      'Не вдалося підтвердити приймання заявки. Будь ласка, скористайтеся іншим доступним способом зв’язку.',
    )
}
