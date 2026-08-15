import { useEffect, useRef } from 'react'

/** Declarative setInterval that always calls the latest callback. Pass a
 *  null delay to pause. */
export function useInterval(callback: () => void, delayMs: number | null) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delayMs === null) return
    const id = setInterval(() => savedCallback.current(), delayMs)
    return () => clearInterval(id)
  }, [delayMs])
}
