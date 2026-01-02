import React, { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';

interface StreamingMarkdownProps {
    content: string;
    isComplete?: boolean; // If true, show full content immediately (for user messages)
    speed?: number; // Characters per tick (default: 1)
    tickInterval?: number; // Milliseconds between ticks (default: 30)
    onProgress?: () => void; // Called on each tick for scroll tracking
}

/**
 * StreamingMarkdown - Displays markdown content with a typewriter effect
 * 
 * - Receives full text but reveals it progressively
 * - Renders markdown properly (bold, lists, paragraphs, etc.)
 * - Smooth fade-in animation for new content
 */
const StreamingMarkdown: React.FC<StreamingMarkdownProps> = ({
    content,
    isComplete = false,
    speed = 1,
    tickInterval = 30,
    onProgress,
}) => {
    const [displayedLength, setDisplayedLength] = useState(isComplete ? content.length : 0);
    const [isStreaming, setIsStreaming] = useState(!isComplete);

    // Reset when content changes
    useEffect(() => {
        if (isComplete) {
            setDisplayedLength(content.length);
            setIsStreaming(false);
        } else {
            setDisplayedLength(0);
            setIsStreaming(true);
        }
    }, [content, isComplete]);

    // Streaming animation
    useEffect(() => {
        if (!isStreaming || displayedLength >= content.length) {
            if (displayedLength >= content.length) {
                setIsStreaming(false);
            }
            return;
        }

        const timer = setTimeout(() => {
            // Advance by 'speed' characters, but try to break at word boundaries
            let newLength = Math.min(displayedLength + speed, content.length);

            // If we're not at the end, try to find a word boundary
            if (newLength < content.length) {
                const nextChars = content.slice(newLength, newLength + 10);
                const spaceIndex = nextChars.indexOf(' ');
                if (spaceIndex !== -1 && spaceIndex < 5) {
                    newLength += spaceIndex + 1;
                }
            }

            setDisplayedLength(Math.min(newLength, content.length));

            // Call onProgress for scroll tracking
            if (onProgress) {
                onProgress();
            }
        }, tickInterval);

        return () => clearTimeout(timer);
    }, [displayedLength, content, isStreaming, speed, tickInterval, onProgress]);

    // Get the currently visible text
    const visibleText = useMemo(() => {
        return content.slice(0, displayedLength);
    }, [content, displayedLength]);

    return (
        <div className="streaming-markdown">
            <ReactMarkdown
                components={{
                    // Paragraph styling
                    p: ({ children }) => (
                        <p className="mb-2 last:mb-0">{children}</p>
                    ),
                    // Bold text
                    strong: ({ children }) => (
                        <strong className="font-semibold text-white">{children}</strong>
                    ),
                    // Italic text
                    em: ({ children }) => (
                        <em className="italic">{children}</em>
                    ),
                    // Unordered list
                    ul: ({ children }) => (
                        <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
                    ),
                    // Ordered list
                    ol: ({ children }) => (
                        <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
                    ),
                    // List item
                    li: ({ children }) => (
                        <li className="text-white/90">{children}</li>
                    ),
                    // Code inline
                    code: ({ children }) => (
                        <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
                    ),
                    // Code block
                    pre: ({ children }) => (
                        <pre className="bg-white/5 rounded-lg p-3 mb-2 overflow-x-auto">{children}</pre>
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
                    a: ({ href, children }) => (
                        <a href={href} className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">
                            {children}
                        </a>
                    ),
                    // Blockquote
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-white/30 pl-3 italic text-white/70 mb-2">
                            {children}
                        </blockquote>
                    ),
                }}
            >
                {visibleText}
            </ReactMarkdown>
            {/* Streaming cursor */}
            {isStreaming && (
                <span className="inline-block w-2 h-4 bg-white/60 animate-pulse ml-0.5 align-middle" />
            )}
        </div>
    );
};

export default StreamingMarkdown;
