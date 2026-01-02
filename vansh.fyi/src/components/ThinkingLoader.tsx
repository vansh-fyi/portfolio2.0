import React, { useState, useEffect } from 'react';

interface ThinkingLoaderProps {
    className?: string;
}

/**
 * ThinkingLoader - Displays animated status text while AI is processing
 * 
 * Cycles through: "Understanding intent" → "Gathering information" → 
 * "Going through the documents" → "Writing response"
 * 
 * Each phase has typewriter effect, 2s gap between phases,
 * stays at "Writing response" with pulsating opacity
 */
const ThinkingLoader: React.FC<ThinkingLoaderProps> = ({ className = '' }) => {
    const phases = [
        'Understanding intent',
        'Gathering information',
        'Going through the documents',
        'Writing response',
    ];

    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(true);

    const currentPhase = phases[currentPhaseIndex];
    const isLastPhase = currentPhaseIndex === phases.length - 1;

    // Typewriter effect for current phase
    useEffect(() => {
        if (displayedText.length < currentPhase.length) {
            const timer = setTimeout(() => {
                setDisplayedText(currentPhase.slice(0, displayedText.length + 1));
            }, 40); // 40ms per character for smooth typing
            return () => clearTimeout(timer);
        } else {
            setIsTyping(false);

            // If not last phase, wait 2s then move to next
            if (!isLastPhase) {
                const timer = setTimeout(() => {
                    setCurrentPhaseIndex(prev => prev + 1);
                    setDisplayedText('');
                    setIsTyping(true);
                }, 2000);
                return () => clearTimeout(timer);
            }
        }
    }, [displayedText, currentPhase, isLastPhase]);

    // Reset when phase changes
    useEffect(() => {
        setDisplayedText('');
        setIsTyping(true);
    }, [currentPhaseIndex]);

    return (
        <div className={`flex gap-2 text-sm text-white/80 gap-x-2 gap-y-2 items-center ${className}`}>
            {/* Spinner */}
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                style={{
                    width: '16px',
                    height: '16px',
                    animation: 'spin 1s linear infinite'
                }}
            >
                <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z"
                />
            </svg>

            {/* Animated text with pulsating effect on last phase */}
            <span
                className={isLastPhase && !isTyping ? 'animate-pulse' : ''}
                style={{
                    animation: isLastPhase && !isTyping ? 'pulse 2s ease-in-out infinite' : 'none',
                }}
            >
                {displayedText}
                {/* Blinking cursor while typing */}
                {isTyping && (
                    <span className="inline-block w-0.5 h-4 bg-white/60 animate-pulse ml-0.5 align-middle" />
                )}
            </span>

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
        </div>
    );
};

export default ThinkingLoader;
