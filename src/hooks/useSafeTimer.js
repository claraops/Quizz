import { useRef, useCallback, useEffect } from 'react'

export function useSafeTimer() {
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)

  const clearIntervalSafe = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const clearTimeoutSafe = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const setIntervalSafe = useCallback((fn, delay) => {
    clearIntervalSafe()
    intervalRef.current = setInterval(fn, delay)
  }, [clearIntervalSafe])

  const setTimeoutSafe = useCallback((fn, delay) => {
    clearTimeoutSafe()
    timeoutRef.current = setTimeout(fn, delay)
  }, [clearTimeoutSafe])

  useEffect(() => {
    return () => {
      clearIntervalSafe()
      clearTimeoutSafe()
    }
  }, [clearIntervalSafe, clearTimeoutSafe])

  return {
    setIntervalSafe,
    setTimeoutSafe,
    clearIntervalSafe,
    clearTimeoutSafe
  }
}
