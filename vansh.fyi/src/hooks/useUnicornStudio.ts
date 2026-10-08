'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

interface UnicornStudioGlobal {
  /** Mounts a scene into every uninitialised `[data-us-project]` element. */
  init: () => void | Promise<unknown>;
  /** Disposes ALL scenes: frees their WebGL contexts and removes their canvases. */
  destroy: () => void;
}

declare global {
  interface Window {
    UnicornStudio?: UnicornStudioGlobal;
  }
}

const SCRIPT_SRC =
  'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js';
const DESKTOP_QUERY = '(min-width: 768px)';

/** Fade-out duration. Must match `duration-[900ms]` (the hidden state) on the background elements in App.tsx; the fade-in is `duration-300`. */
const FADE_MS = 900;
/** Extra time before destroying so the last frames of the fade-out are never cut. */
const DESTROY_BUFFER_MS = 100;

// --- Scene controller ------------------------------------------------------
// One module-level owner of the WebGL scene. Every mount/destroy goes through a
// single queue, so two scenes can never be alive (or be initialising) together.

let scriptPromise: Promise<void> | null = null;
let queue: Promise<unknown> = Promise.resolve();
/** Bumped on every mount/teardown request; queued work from an older generation is dropped. */
let generation = 0;

const enqueue = (task: () => Promise<void>) => {
  queue = queue.then(task).catch((error) => console.error(error));
  return queue;
};

/** Load the Unicorn Studio script once for the lifetime of the page. */
const loadScript = (): Promise<void> => {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null; // allow a retry on the next mount
      reject(new Error('Failed to load Unicorn Studio script'));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
};

/** Resolves true once a scene is running for the current request. */
const mountScene = (): Promise<boolean> => {
  const gen = ++generation;
  let mounted = false;
  return enqueue(async () => {
    if (gen !== generation) return;
    await loadScript();
    if (gen !== generation) return;
    window.UnicornStudio?.destroy(); // guarantee a clean slate before creating a scene
    await window.UnicornStudio?.init();
    mounted = gen === generation;
  }).then(() => mounted);
};

/** Destroy the scene after the fade-out, unless something mounted again in the meantime. */
const destroySceneAfterFade = () => {
  const gen = ++generation; // also cancels any mount that has not started yet
  window.setTimeout(() => {
    if (gen !== generation) return;
    enqueue(async () => {
      window.UnicornStudio?.destroy();
    });
  }, FADE_MS + DESTROY_BUFFER_MS);
};

// --- Inputs ----------------------------------------------------------------

const useIsDesktop = () =>
  useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(DESKTOP_QUERY);
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    },
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );

const useTabVisible = () =>
  useSyncExternalStore(
    (onChange) => {
      document.addEventListener('visibilitychange', onChange);
      return () => document.removeEventListener('visibilitychange', onChange);
    },
    () => document.visibilityState === 'visible',
    () => true,
  );

/**
 * Runs the Unicorn Studio background only while it is useful: on desktop, on the
 * main view, with the tab visible.
 * Otherwise the scene is fully destroyed (WebGL context freed) after a fade-out.
 * Re-creates the scene when the theme changes (a different project is rendered).
 *
 * @returns whether the background should currently be visible (drive the fade with it)
 */
export const useUnicornStudio = (active: boolean, isLightMode: boolean): boolean => {
  const isDesktop = useIsDesktop();
  const tabVisible = useTabVisible();
  const wanted = active && isDesktop && tabVisible;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!wanted) return;

    let cancelled = false;
    mountScene().then((mounted) => {
      if (!cancelled && mounted) setReady(true);
    });

    return () => {
      cancelled = true;
      setReady(false);
      destroySceneAfterFade();
    };
  }, [wanted, isLightMode]);

  return wanted && ready;
};
