import { useCallback, useEffect, useState } from 'react'

/**
 * This hook provides a counter value that increments at a specified interval.
 * The hook also includes a resetCounter function to reset the counter value to zero.
 */
const useIntervalCounter = (interval: number): [number, () => void] => {
  const [counter, setCounter] = useState<number>(0)

  const resetCounter = useCallback(() => {
    setCounter(0)
  }, [setCounter])

  useEffect(() => {
    const timerId = setTimeout(() => setCounter(counter + 1), interval)
    return () => clearTimeout(timerId)
  }, [counter, interval])

  return [counter, resetCounter]
}

export default useIntervalCounter
