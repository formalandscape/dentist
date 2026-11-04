export const silk = {
  ease: [0.22, 1, 0.36, 1] as const,
  cssEase: 'cubic-bezier(.22,1,.36,1)',
  micro: 0.26,
  text: 0.72,
  section: 0.9,
  pageOut: 0.32,
  pageIn: 0.58,
  panelOut: 0.22,
  panelIn: 0.48,
  stagger: 0.038,
}

export const sceneVariants = {
  enter: { opacity: 0.32, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: silk.pageIn, ease: silk.ease } },
  leave: { opacity: 0.12, y: -16, transition: { duration: silk.pageOut, ease: silk.ease } },
}

export const revealFrames = [
  { opacity: 0.45, transform: 'translateY(18px)' },
  { opacity: 1, transform: 'translateY(0)' },
]

export const imageReveal = {
  opacity: [0.65, 1],
  clipPath: ['inset(16% 0 0 0 round 4px)', 'inset(0% 0 0 0 round 4px)'],
  scale: [1.035, 1],
}
