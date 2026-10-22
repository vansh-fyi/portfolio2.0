'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

const ContactChat = dynamic(() => import('./ContactChat'))

export default function DeferredContactChat() {
  const container = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (typeof IntersectionObserver !== 'function') {
      const timer = window.setTimeout(() => setReady(true), 0)
      return () => window.clearTimeout(timer)
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true)
          observer.disconnect()
        }
      },
      { rootMargin: '600px' }
    )
    if (container.current) observer.observe(container.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={container} className="h-full min-h-[480px]">
      {ready ? (
        <ContactChat />
      ) : (
        <div
          className="rounded-2xl bg-black/30 p-6 ring-1 ring-white/10"
          role="status"
        >
          Loading Ursa…
        </div>
      )}
    </div>
  )
}
