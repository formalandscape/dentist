export const silk = {
  ease: [0.22, 1, 0.36, 1] as const,
  cssEase: 'cubic-bezier(.22,1,.36,1)',
  scrollEase: 'cubic-bezier(.22,.45,.32,1)',
  micro: 0.26,
  text: 1.3,
  section: 1.45,
  pageOut: 0.38,
  pageIn: 0.72,
  panelOut: 0.22,
  panelIn: 0.48,
  stagger: 0.022,
}

export const sceneVariants = {
  enter: { opacity: 0.42, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: silk.pageIn, ease: silk.ease } },
  leave: { opacity: 0.22, y: -8, transition: { duration: silk.pageOut, ease: silk.ease } },
}

// Scroll entrances stay close to their final position and never crop content.
export const revealFrames: Keyframe[] = [
  { opacity: 0.96, transform: 'translateY(6px)' },
  { opacity: 1, transform: 'translateY(0)' },
]
