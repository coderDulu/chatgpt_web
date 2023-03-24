import React, { useCallback, useEffect, useRef } from 'react'

export default function useDebounce(callback: (...args: any[]) => void, delay: number) {
  const timerRef = useRef<NodeJS.Timer>();

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current)
    }
  }, [])
  const debounce = useCallback((...args: any[]) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      callback(args)
    }, delay);
  }, [])

  return debounce
}

