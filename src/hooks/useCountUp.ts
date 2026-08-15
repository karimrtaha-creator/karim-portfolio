import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

const STEPS = 20

/** Animates a number from 0 to `target` once `active` becomes true. Uses a
 *  fixed-step interval rather than requestAnimationFrame so it still
 *  completes in backgrounded/unfocused tabs, where rAF is paused. */
export function useCountUp(target: number, active: boolean, durationMs = 900): number {
  const [value, setValue] = useState(0)
  const reducedMotion = useReducedMotion()
  const stepRef = useRef(0)

  useEffect(() => {
    if (!active) return
    if (reducedMotion) {
      setValue(target)
      return
    }
    stepRef.current = 0
    setValue(0)

    const id = window.setInterval(() => {
      stepRef.current += 1
      const progress = Math.min(stepRef.current / STEPS, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress >= 1) window.clearInterval(id)
    }, durationMs / STEPS)

    return () => window.clearInterval(id)
  }, [active, target, durationMs, reducedMotion])

  return value
}
