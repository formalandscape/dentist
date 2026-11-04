import { site } from '../data/site'
import { services, servicePath } from '../data/services'

export function seoForPath(path: string) {
  if (path.replace(/\/$/, '') === '/vash-shliakh-do-posmishky')
    return {
      title: 'Ваш шлях до посмішки — етапи лікування | Зоряна Тепла',
      description:
        'Як проходить ортодонтичне лікування: консультація, діагностика, індивідуальний план, вибір апарата, контроль і ретенція. Ортодонт Зоряна Тепла, Київ.',
      path: '/vash-shliakh-do-posmishky/',
    }
  const service = services.find(
    (s) => path.replace(/\/$/, '') === servicePath(s.id).replace(/\/$/, ''),
  )
  if (service)
    return {
      title: service.seoTitle,
      description: `${service.description} Індивідуальна діагностика та планування лікування дітей і дорослих. Лікар ортодонт Зоряна Тепла, Київ.`,
      path: servicePath(service.id),
    }
  if (path.startsWith('/polityka-konfidentsiinosti'))
    return {
      title: 'Політика конфіденційності — Зоряна Тепла',
      description:
        'Які дані збирає форма запису, для чого вони потрібні та як обробляються звернення на сайті лікаря Зоряни Теплої.',
      path: '/polityka-konfidentsiinosti/',
    }
  if (path !== '/')
    return {
      title: 'Сторінку не знайдено — Зоряна Тепла',
      description: 'Поверніться на головну сторінку лікаря стоматолога-ортодонта Зоряни Теплої.',
      path,
      noindex: true,
    }
  return {
    title: 'Зоряна Тепла — лікар ортодонт у Києві',
    description:
      'Зоряна Тепла — стоматолог-ортодонт у Києві. 24 роки практики. Ортодонтичне лікування дітей і дорослих, брекети, елайнери та діагностика прикусу.',
    path: '/',
  }
}

export const schema = {
  '@context': 'https://schema.org',
  '@type': 'Physician',
  name: site.doctor.fullName,
  description: site.doctor.role,
  medicalSpecialty: 'Dentistry',
  ...(site.contacts.phone ? { telephone: site.contacts.phone } : {}),
  ...(site.contacts.instagram ? { sameAs: [site.contacts.instagram] } : {}),
  areaServed: { '@type': 'City', name: 'Київ' },
  memberOf: site.associations.map((a) => ({ '@type': 'Organization', name: a.description })),
}

export function publicUrl(path: string) {
  const origin = import.meta.env.VITE_SITE_URL?.replace(/\/$/, '')
  return origin ? `${origin}${import.meta.env.BASE_URL}${path.replace(/^\//, '')}` : undefined
}
