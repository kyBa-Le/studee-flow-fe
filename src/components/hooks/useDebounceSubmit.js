import { useRef, useEffect } from "react";

export function useDebouncedSubmit(callback, delay = 3000) {
  const timerRef = useRef();

  const trigger = (...args) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return trigger;
}