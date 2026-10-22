'use client';

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useThemeStore } from '../state/themeStore';

const BOOKING_URL = 'https://calendly.com/design-vansh/30min';
const THEMES = {
  dark: {
    background: '1a1a1a', text: 'ffffff', primary: 'ffffff',
    border: 'rgb(255 255 255 / 0.1)', muted: 'rgb(255 255 255 / 0.6)',
    hover: 'rgb(255 255 255 / 0.08)',
    shadow: '0 0 0 1px rgb(255 255 255 / 0.14), 0 24px 100px -20px rgb(0 0 0 / 0.7)',
  },
  light: {
    background: 'ffffff', text: '18181b', primary: '18181b',
    border: 'rgb(0 0 0 / 0.08)', muted: 'rgb(24 24 27 / 0.6)',
    hover: 'rgb(0 0 0 / 0.05)',
    shadow: '0 0 0 1px rgb(0 0 0 / 0.06), 0 8px 24px -8px rgb(0 0 0 / 0.12), 0 32px 100px -20px rgb(0 0 0 / 0.25)',
  },
};

function MeetingDialog({ onClose }: { onClose: () => void }) {
  const isLightMode = useThemeStore((state) => state.isLightMode);
  const theme = THEMES[isLightMode ? 'light' : 'dark'];
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const [loadedUrl, setLoadedUrl] = useState('');
  const url = new URL(BOOKING_URL);
  url.search = new URLSearchParams({
    background_color: theme.background,
    text_color: theme.text,
    primary_color: theme.primary,
    embed_type: 'Inline',
    embed_domain: window.location.hostname,
  }).toString();
  const src = url.toString();
  const loaded = loadedUrl === src;

  useEffect(() => {
    const dialog = dialogRef.current!;
    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    closeRef.current?.focus();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);

  const style: CSSProperties & Record<`--meeting-${string}`, string> = {
    '--meeting-background': `#${theme.background}`,
    '--meeting-text': `#${theme.text}`,
    '--meeting-border': theme.border,
    '--meeting-muted': theme.muted,
    '--meeting-hover': theme.hover,
    '--meeting-shadow': theme.shadow,
    colorScheme: isLightMode ? 'light' : 'dark',
  };

  return createPortal(
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- Native dialog provides keyboard dismissal through onCancel.
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-modal="true"
      style={style}
      className="fixed inset-0 m-auto h-dvh max-h-none w-full max-w-none flex-col overflow-hidden border-0 bg-[var(--meeting-background)] p-0 text-[color:var(--meeting-text)] shadow-[var(--meeting-shadow)] backdrop:bg-black/60 backdrop:backdrop-blur-sm open:flex sm:h-[min(820px,calc(100dvh-48px))] sm:w-[calc(100%-48px)] sm:max-w-5xl sm:rounded-2xl"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[var(--meeting-border)] py-3 pl-5 pr-3 sm:pl-6">
        <h2 id={titleId} className="font-geist text-base font-medium tracking-tight">Schedule a meeting</h2>
        <button
          ref={closeRef}
          type="button"
          aria-label="Close scheduling popup"
          onClick={onClose}
          className="flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-full transition-colors hover:bg-[var(--meeting-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </header>
      <div className="relative min-h-0 flex-1" aria-busy={!loaded}>
        {!loaded && <p role="status" className="absolute inset-0 flex items-center justify-center text-sm text-[color:var(--meeting-muted)]">Loading available times…</p>}
        <iframe
          key={src}
          src={src}
          title="Book a 30-minute meeting with Vansh"
          // Calendly's document uses the normal colour scheme; a mismatch paints its transparent canvas white.
          style={{ colorScheme: 'normal' }}
          className={`relative h-full w-full border-0 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoadedUrl(src)}
        />
      </div>
      <footer className="shrink-0 border-t border-[var(--meeting-border)] px-5 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] text-center text-xs text-[color:var(--meeting-muted)]">
        Having trouble loading?{' '}
        <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-[color:var(--meeting-text)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current">Open Calendly in a new tab</a>
      </footer>
    </dialog>,
    document.body,
  );
}

export default function MeetingButton({ children, className }: { children: ReactNode; className: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={`${className} cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current`} aria-haspopup="dialog" onClick={() => setOpen(true)}>{children}</button>
      {open && <MeetingDialog onClose={() => setOpen(false)} />}
    </>
  );
}
