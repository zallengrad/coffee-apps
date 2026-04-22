import { useRef } from 'react';

export default function useDebounce() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debounce = (callback: () => void, delay: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(callback, delay);
  };

  return debounce;
}
