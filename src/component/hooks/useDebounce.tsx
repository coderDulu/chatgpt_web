import React, { useCallback, useEffect, useRef, useState } from 'react'

export function useDebounce(callback: (...args: any[]) => void, delay: number) {
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

// 实现节流函数
export function useThrottle(callback: any, delay: number, deps = []) {
  const lastTimeRef = useRef(Date.now());

  return useCallback(
    (...args: any[]) => {
      const now = Date.now();
      if (now - lastTimeRef.current >= delay) {
        callback(...args);
        lastTimeRef.current = now;
      }
    },
    [callback, delay, ...deps],
  );
}