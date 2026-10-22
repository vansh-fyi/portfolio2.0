'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'

const RETAIN_MS = 60_000
const subscribeVisibility = (notify: () => void) => {
  document.addEventListener('visibilitychange', notify)
  return () => document.removeEventListener('visibilitychange', notify)
}

/** Keep quick window switches instant, but release uncooperative embeds after a minute hidden. */
export default function RetainedProjectFrame({
  src,
  title,
  active,
}: {
  src: string
  title: string
  active: boolean
}) {
  const frame = useRef<HTMLIFrameElement>(null)
  const [retained, setRetained] = useState(true)
  const visible = useSyncExternalStore(subscribeVisibility, () => document.visibilityState === 'visible', () => true)
  const wanted = active && visible
  if (wanted && !retained) setRetained(true)
  const notify = useCallback(() => {
    frame.current?.contentWindow?.postMessage(
      { type: 'portfolio:visibility', visible: wanted },
      new URL(src).origin
    )
  }, [src, wanted])

  useEffect(() => {
    if (active) return
    const timer = window.setTimeout(() => setRetained(false), RETAIN_MS)
    return () => window.clearTimeout(timer)
  }, [active])

  useEffect(notify, [notify, retained])

  if (!retained) return null
  return (
    <iframe
      ref={frame}
      src={src}
      className="w-full h-full border-0"
      title={title}
      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
      referrerPolicy="no-referrer"
      onLoad={notify}
    />
  )
}
