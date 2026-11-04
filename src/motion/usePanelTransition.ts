import { useEffect, useRef, useState } from 'react'
import { useAnimationControls, useReducedMotion } from 'motion/react'
import { silk } from './presets'

export function usePanelTransition(selected: number) {
  const [shown, setShown] = useState(selected)
  const reduced = useReducedMotion()
  const controls = useAnimationControls()
  const sequence = useRef(0)
  useEffect(() => {
    const token = ++sequence.current
    if (reduced) {
      controls.stop()
      controls.set({ opacity: 1, y: 0 })
      setShown(selected)
      return
    }
    if (selected === shown) {
      controls.start({ opacity: 1, y: 0, transition: { duration: silk.panelIn, ease: silk.ease } })
      return
    }
    controls
      .start({ opacity: 0.2, y: -8, transition: { duration: silk.panelOut, ease: silk.ease } })
      .then(() => {
        if (sequence.current !== token) return
        controls.set({ opacity: 0.45, y: 14 })
        setShown(selected)
      })
    return () => {
      sequence.current++
      controls.stop()
    }
  }, [selected, shown, reduced, controls])
  return { shown, controls, switching: shown !== selected }
}
