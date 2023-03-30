import React, { useCallback, useEffect, useRef, useState } from 'react'

export default function useDebounce(callback: (...args: any[]) => void, delay: number) {
  const timerRef = useRef<any>();

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

export function useThrottle(callback: any, delay: number) {
  const timerRef = useRef<any>(null);

  useEffect(() => {
    // return () => {
    //   console.log(233);
    //   clearTimeout(timerRef.current)
    // }
  })

  const throttle = useCallback((...args: any[]) => {
    if(!timerRef.current) {
      timerRef.current = setTimeout(() => {
        callback(args)
      }, delay);
    }
  }, [callback, delay])

  return throttle;
}