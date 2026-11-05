import { Children, cloneElement, isValidElement } from 'react'
import type { ReactNode, ReactElement, CSSProperties } from 'react'

type Props = {
  as?: 'h1' | 'h2' | 'h3' | 'h4'
  children: ReactNode
  className?: string
  id?: string
}

// Stable, readable server HTML. One shared observer owns scroll entrances;
// the heading does not run another viewport observer or clip its letterforms.
export function AnimatedHeading({ as: Heading = 'h2', children, ...props }: Props) {
  let index = 0
  function words(content: ReactNode): ReactNode {
    return Children.map(content, (node) => {
      if (typeof node === 'string' || typeof node === 'number') {
        return String(node)
          .split(/(\s+)/)
          .map((part) => {
            if (!part.trim()) return part
            return (
              <span className="motion-word-mask" key={index}>
                <span className="motion-word" style={{ '--word-index': index++ } as CSSProperties}>
                  {part}
                </span>
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
    <Heading {...props} data-motion-heading="true">
      {words(children)}
    </Heading>
  )
}
