import { RefObject, useEffect, useRef } from "react";


const useOutsideClick = (
  callback: () => void,
  excludedRefs: RefObject<HTMLElement>[] = []
) => {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && ref.current.contains(event.target as Node)) {
        return;
      }

      for (const excludedRef of excludedRefs) {
        if (excludedRef.current && excludedRef.current.contains(event.target as Node)) {
          return;
        }
      }

      callback()
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, callback, excludedRefs])

  return ref
}

export { useOutsideClick }