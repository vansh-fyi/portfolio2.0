export function canWarmResources() {
  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string }
    }
  ).connection
  return (
    !connection?.saveData &&
    !/^(slow-2g|2g|3g)$/.test(connection?.effectiveType ?? '')
  )
}

/** Speculative work starts after critical resources load, and yields on constrained connections. */
export function scheduleWarmup(callback: () => void) {
  if (!canWarmResources()) return () => {}
  const w = window
  let idle: number | undefined
  let timer: number | undefined
  const schedule = () => {
    if (
      typeof w.requestIdleCallback === 'function' &&
      typeof w.cancelIdleCallback === 'function'
    )
      idle = w.requestIdleCallback(callback, { timeout: 8000 })
    else timer = window.setTimeout(callback, 3000)
  }
  if (document.readyState === 'complete') schedule()
  else window.addEventListener('load', schedule, { once: true })
  return () => {
    window.removeEventListener('load', schedule)
    if (idle !== undefined) w.cancelIdleCallback?.(idle)
    if (timer !== undefined) window.clearTimeout(timer)
  }
}
