/** One request-wide deadline, shared with fetch and PostgREST operations. */
export function requestSignal(
  parent?: AbortSignal,
  timeoutMs = 25_000
): AbortSignal {
  const deadline = AbortSignal.timeout(timeoutMs)
  return parent ? AbortSignal.any([parent, deadline]) : deadline
}

/** Also bounds tasks that fail to observe their signal (or are supplied by an SDK). */
export async function abortable<T>(
  task: PromiseLike<T>,
  signal: AbortSignal
): Promise<T> {
  signal.throwIfAborted()
  let abort: () => void = () => {}
  const cancelled = new Promise<never>((_, reject) => {
    abort = () => reject(signal.reason)
    signal.addEventListener('abort', abort, { once: true })
  })
  try {
    return await Promise.race([Promise.resolve(task), cancelled])
  } finally {
    signal.removeEventListener('abort', abort)
  }
}

export async function measureStage<T>(
  stage: string,
  signal: AbortSignal,
  run: () => PromiseLike<T>
): Promise<T> {
  const started = Date.now()
  let ok = false
  try {
    signal.throwIfAborted()
    const result = await abortable(run(), signal)
    ok = true
    return result
  } finally {
    console.info(
      JSON.stringify({
        event: 'ursa-stage',
        stage,
        durationMs: Date.now() - started,
        ok,
      })
    )
  }
}
