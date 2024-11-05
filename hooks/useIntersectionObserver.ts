import { useEffect, useRef, useState } from 'react'

export function useIntersectionObserver(options: IntersectionObserverOptions = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const targetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      {
        rootMargin: '50px',
        ...options,
      },
    )

    const currentTarget = targetRef.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [options])

  return { targetRef, isIntersecting }
}

type IntersectionObserverOptions = {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
}
