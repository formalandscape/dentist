import { useI18n } from '../i18n/I18n'
import { site } from '../data/site'

export function DoctorPortrait({
  slot,
  priority = false,
}: {
  slot: keyof typeof site.doctor.portraits
  priority?: boolean
}) {
  const portrait = site.doctor.portraits[slot]
  const { t } = useI18n()
  return (
    <img
      src={portrait.src}
      alt={t(site.doctor.portraitAlt)}
      className={`doctor-portrait doctor-portrait--${slot}`}
      width={portrait.width}
      height={portrait.height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
    />
  )
}
