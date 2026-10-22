'use client'

import { memo, useEffect, useState, useSyncExternalStore } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'

const markdownComponents: Components = {
  // Paragraph styling
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  // Bold text
  strong: ({ children }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  // Italic text
  em: ({ children }) => <em className="italic">{children}</em>,
  // Unordered list
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
  ),
  // Ordered list
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
  ),
  // List item
  li: ({ children }) => <li className="text-white/90">{children}</li>,
  // Code inline
  code: ({ children }) => (
    <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono">
      {children}
    </code>
  ),
  // Code block
  pre: ({ children }) => (
    <pre className="bg-white/5 rounded-lg p-3 mb-2 overflow-x-auto">
      {children}
    </pre>
  ),
  // Headers
  h1: ({ children }) => (
    <h1 className="text-lg font-semibold mb-2">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-base font-semibold mb-2">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-semibold mb-1">{children}</h3>
  ),
  // Links
  a: ({ children }) => <span>{children}</span>,
  // Blockquote
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-white/30 pl-3 italic text-white/70 mb-2">
      {children}
    </blockquote>
  ),
}

const subscribeMotion = (notify: () => void) => {
  const media = window.matchMedia?.('(prefers-reduced-motion: reduce)')
  media?.addEventListener('change', notify)
  return () => media?.removeEventListener('change', notify)
}

interface StreamingMarkdownProps {
  content: string
  isComplete?: boolean
  durationMs?: number
  onProgress?: () => void
  onComplete?: (content: string) => void
}

/** Reveal word batches in a bounded time, rather than parsing Markdown for every character. */
const StreamingMarkdown = memo(function StreamingMarkdown({
  content,
  isComplete = false,
  durationMs = 1200,
  onProgress,
  onComplete,
}: StreamingMarkdownProps) {
  const [reveal, setReveal] = useState({ content, length: isComplete ? content.length : 0 })
  if (reveal.content !== content) setReveal({ content, length: 0 })
  const displayedLength = reveal.content === content ? reveal.length : 0
  const reducedMotion = useSyncExternalStore(subscribeMotion, () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false, () => false)
  const visibleText = content.slice(
    0,
    isComplete || reducedMotion ? content.length : displayedLength
  )
  const isStreaming = !isComplete && !reducedMotion && displayedLength < content.length

  useEffect(() => {
    if (isComplete || reducedMotion) return
    const started = Date.now()
    const duration = Math.max(1, Math.min(durationMs, content.length * 12))
    const timer = window.setInterval(() => {
      const progress = Math.min(1, (Date.now() - started) / duration)
      let length = Math.ceil(progress * content.length)
      if (progress < 1) {
        const space = content.indexOf(' ', length)
        if (space >= 0 && space - length < 16) length = space + 1
      }
      setReveal({ content, length })
      if (progress === 1) window.clearInterval(timer)
    }, 50)
    return () => window.clearInterval(timer)
  }, [content, isComplete, reducedMotion, durationMs])

  useEffect(() => {
    onProgress?.()
    if (!isComplete && (reducedMotion || displayedLength >= content.length)) onComplete?.(content)
  }, [displayedLength, content, isComplete, reducedMotion, onProgress, onComplete])

  return (
    <div className="streaming-markdown">
      <ReactMarkdown components={markdownComponents}>
        {visibleText}
      </ReactMarkdown>
      {/* Streaming cursor */}
      {isStreaming && (
        <span className="inline-block w-2 h-4 bg-white/60 animate-pulse ml-0.5 align-middle" />
      )}
    </div>
  )
})

export default StreamingMarkdown
