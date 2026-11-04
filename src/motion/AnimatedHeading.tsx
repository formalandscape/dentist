import { Children, cloneElement, isValidElement } from 'react'
import type { ReactNode, ReactElement } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { silk } from './presets'

type Props = {
  as?: 'h1' | 'h2' | 'h3' | 'h4'
  children: ReactNode
  className?: string
  id?: string
}

// React owns every word. No innerHTML replacement, duplicate accessible text,
// or browser-only splitting that can invalidate prerendered markup.
export function AnimatedHeading({ as = 'h2', children, ...props }: Props) {
  const reduced = useReducedMotion()
  const Heading = motion[as]
  const characters = as === 'h4' && typeof children === 'string'
  let index = 0
  function words(content: ReactNode): ReactNode {
    return Children.map(content, (node) => {
      if (typeof node === 'string' || typeof node === 'number') {
        return String(node)
          .split(/(\s+)/)
          .map((part) => {
            if (!part.trim()) return part
            const order = index++
            return (
              <span className="motion-word-mask" key={order} aria-hidden={characters || undefined}>
                {(characters ? Array.from(part) : [part]).map((unit, letter) => (
                  <motion.span
                    key={letter}
                    className="motion-word"
                    animate={
                      reduced
                        ? { opacity: 1, y: 0, filter: 'none', transition: { duration: 0 } }
                        : undefined
                    }
                    variants={{
                      visible: {
                        opacity: [as === 'h1' ? 0.55 : 0.3, 1],
                        y: [16, 0],
                        filter: as === 'h1' ? ['blur(.8px)', 'blur(0px)'] : undefined,
                        transition: {
                          duration: silk.text,
                          delay: Math.min(
                            order * silk.stagger + (characters ? letter * 0.014 : 0),
                            0.26,
                          ),
                          ease: silk.ease,
                        },
                      },
                    }}
                  >
                    {unit}
                  </motion.span>
                ))}
              </span>
            )
          })
      }
      if (isValidElement(node)) {
        const element = node as ReactElement<{ children?: ReactNode }>
        if (typeof element.type === 'string' && element.props.children)
          return cloneElement(element, {}, words(element.props.children))
      }
      return node
    })
  }
  return (
    <Heading
      {...props}
      data-motion-heading="true"
      aria-label={characters ? children : undefined}
      inherit={false}
      initial={false}
      whileInView={reduced ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.15 }}
    >
      {words(children)}
    </Heading>
  )
}
