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

/** Sections that are image/text heavy and hide the background anyway: it is torn down while they are on screen. */
const COVERING_SECTION_IDS = ['projects'];
/** Fade-out duration. Must match `duration-[900ms]` (the hidden state) on the background elements in App.tsx; the fade-in is `duration-300`. */
const FADE_MS = 900;
/** Extra time before destroying so the last frames of the fade-out are never cut. */
const DESTROY_BUFFER_MS = 100;
/** Wait this long after the show line is crossed before bringing the background back (ignores flapping). */
const SETTLE_MS = 100;
/**
 * Lines of the viewport (0 = top, 1 = bottom) that hide/show the background around a covering section.
 * Scrolling down: hide when its top edge reaches DOWN_HIDE, show when its content bottom rises above DOWN_SHOW.
 * Scrolling up (mirror): hide when its bottom edge reaches UP_HIDE, show when its top edge drops below UP_SHOW.
 */
const DOWN_HIDE = 0.5;
const DOWN_SHOW = 0.7;
const UP_HIDE = 0.5;
const UP_SHOW = 0.3;

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

/**
 * True while a covering section is "in charge" of the screen. Hiding is instant (so the
 * fade starts exactly on the line); showing again is debounced to ignore flapping.
 */
const useCoveredBySections = (enabled: boolean) => {
  const [covered, setCovered] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let timer: number | undefined;
    let frame = 0;
    let lastY = window.scrollY;
    let scrollingDown = true;

    const measure = () => {
      frame = 0;
      const y = window.scrollY;
      if (y !== lastY) scrollingDown = y > lastY;
      lastY = y;

      const vh = window.innerHeight;
      const isCovering = COVERING_SECTION_IDS.some((id) => {
        const element = document.getElementById(id);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        // Measure where the content ends, not the empty bottom padding of the section
        const bottom = rect.bottom - (parseFloat(getComputedStyle(element).paddingBottom) || 0);
        return scrollingDown
          ? rect.top <= vh * DOWN_HIDE && bottom > vh * DOWN_SHOW
          : bottom >= vh * UP_HIDE && rect.top < vh * UP_SHOW;
      });

      window.clearTimeout(timer);
      if (isCovering) {
        setCovered(true);
      } else {
        timer = window.setTimeout(() => setCovered(false), SETTLE_MS);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      setCovered(false);
    };
  }, [enabled]);

  return covered;
};

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
 * main view, with the tab visible, and not while a covering section is on screen.
 * Otherwise the scene is fully destroyed (WebGL context freed) after a fade-out.
 * Re-creates the scene when the theme changes (a different project is rendered).
 *
 * @returns whether the background should currently be visible (drive the fade with it)
 */
export const useUnicornStudio = (active: boolean, isLightMode: boolean): boolean => {
  const isDesktop = useIsDesktop();
  const tabVisible = useTabVisible();
  const covered = useCoveredBySections(active && isDesktop);
  const wanted = active && isDesktop && tabVisible && !covered;
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
