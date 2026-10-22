import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@scripts/animations/gsap";

const EASE_OUT_EXPO = (t: number): number =>
  Math.min(1, 1.001 - Math.pow(2, -10 * t));

let lenis: Lenis | null = null;
let teardown: (() => void) | null = null;

/** Returns the active Lenis instance when smooth scrolling is enabled. */
export function getLenis(): Lenis | null {
  return lenis;
}

function focusTarget(element: HTMLElement): void {
  const hadTabIndex = element.hasAttribute("tabindex");
  if (!hadTabIndex && element.tabIndex < 0) {
    element.setAttribute("tabindex", "-1");
    element.addEventListener(
      "blur",
      () => {
        element.removeAttribute("tabindex");
      },
      { once: true },
    );
  }
  element.focus({ preventScroll: true });
}

function resolveHashTarget(hash: string): {
  id: string;
  element: HTMLElement | null;
} | null {
  if (!hash || !hash.startsWith("#") || hash === "#") return null;
  let id = "";
  try {
    id = decodeURIComponent(hash.slice(1));
  } catch {
    id = hash.slice(1);
  }
  if (!id) return null;
  return { id, element: document.getElementById(id) };
}

function startSmoothScroll(): void {
  if (lenis) return;

  const instance = new Lenis({
    lerp: 0.05,
    wheelMultiplier: 0.85,
    touchMultiplier: 1,
    smoothWheel: true,
    syncTouch: false,
    gestureOrientation: "vertical",
    autoRaf: false,
    stopInertiaOnNavigate: true,
    respectReducedMotion: true,
  });

  document.documentElement.style.scrollBehavior = "auto";
  lenis = instance;

  // 1. Synchronize Lenis scroll updates with GSAP ScrollTrigger.
  const unsubscribeScroll = instance.on("scroll", () => {
    ScrollTrigger.update();
  });

  // 2. Drive Lenis from GSAP's unified ticker (seconds -> milliseconds).
  const onTick = (time: number) => {
    instance.raf(time * 1000);
  };
  gsap.ticker.add(onTick);
  gsap.ticker.lagSmoothing(0);

  // 3. Coordinate internal anchor navigation (#inicio, #categorias, #nosotros, etc.).
  const abort = new AbortController();
  const { signal } = abort;

  document.addEventListener(
    "click",
    (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      ) {
        return;
      }

      const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const resolved = resolveHashTarget(href);
      if (!resolved?.element) return;

      event.preventDefault();

      if (window.location.hash !== href) {
        history.pushState(null, "", href);
      }

      const isTop = resolved.id === "inicio";
      const isSkipLink = link.classList.contains("skip-link");

      if (isSkipLink || instance.prefersReducedMotion) {
        instance.scrollTo(isTop ? 0 : resolved.element, {
          immediate: true,
          force: true,
        });
        focusTarget(resolved.element);
        ScrollTrigger.update();
        return;
      }

      instance.scrollTo(isTop ? 0 : resolved.element, {
        duration: 1.05,
        easing: EASE_OUT_EXPO,
        force: true,
        onComplete: () => {
          focusTarget(resolved.element!);
          ScrollTrigger.update();
        },
      });
    },
    { signal },
  );

  // 4. Support browser Back/Forward hash navigation.
  window.addEventListener(
    "popstate",
    () => {
      const hash = window.location.hash;
      if (!hash || hash === "#inicio") {
        instance.scrollTo(0, {
          duration: instance.prefersReducedMotion ? 0 : 0.9,
          immediate: instance.prefersReducedMotion,
          easing: EASE_OUT_EXPO,
          force: true,
        });
        return;
      }
      const resolved = resolveHashTarget(hash);
      if (resolved?.element) {
        instance.scrollTo(resolved.element, {
          duration: instance.prefersReducedMotion ? 0 : 0.9,
          immediate: instance.prefersReducedMotion,
          easing: EASE_OUT_EXPO,
          force: true,
        });
      }
    },
    { signal },
  );

  // 5. Keep Lenis and ScrollTrigger calibrated when document height changes
  // (e.g. expanding/collapsing mobile category cards or lazy image loads).
  let lastScrollHeight = document.documentElement.scrollHeight;
  let refreshTimer: ReturnType<typeof setTimeout> | undefined;
  const contentResize = new ResizeObserver(() => {
    const currentHeight = document.documentElement.scrollHeight;
    if (Math.abs(currentHeight - lastScrollHeight) < 2) return;
    lastScrollHeight = currentHeight;
    instance.resize();
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);
  });
  contentResize.observe(document.documentElement);

  teardown = () => {
    clearTimeout(refreshTimer);
    contentResize.disconnect();
    abort.abort();
    unsubscribeScroll();
    gsap.ticker.remove(onTick);
    instance.destroy();
    document.documentElement.style.removeProperty("scroll-behavior");
    if (lenis === instance) {
      lenis = null;
    }
    teardown = null;
  };
}

function stopSmoothScroll(): void {
  teardown?.();
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function syncSmoothScroll(): void {
  if (reducedMotion.matches) {
    stopSmoothScroll();
  } else {
    startSmoothScroll();
  }
}

syncSmoothScroll();
reducedMotion.addEventListener("change", syncSmoothScroll);

window.addEventListener("pagehide", () => {
  stopSmoothScroll();
});
document.addEventListener("astro:before-swap", () => {
  stopSmoothScroll();
});
document.addEventListener("astro:page-load", () => {
  syncSmoothScroll();
});
