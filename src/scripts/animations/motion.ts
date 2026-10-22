import { gsap, ScrollTrigger } from "@scripts/animations/gsap";

/**
 * Shared motion language: one vocabulary of easings and durations so every
 * section moves with the same character.
 */
export const ease = {
  /** Entrances: quick start, long soft landing. */
  enter: "power3.out",
  /** Small elements and fades. */
  soft: "power2.out",
  /** Icons and nodes that "settle" into place. */
  settle: "back.out(1.5)",
  /** Strokes that draw from one end to the other. */
  draw: "power2.inOut",
} as const;

export const duration = {
  micro: 0.3,
  enter: 0.8,
  slow: 1.1,
} as const;

/** Where a ScrollTrigger-driven entrance starts: element top at 85% of the viewport. */
export const start = { early: "top 88%", base: "top 80%", late: "top 68%" } as const;

/** Offsets are tuned for desktop; small screens get proportionally shorter travel. */
export function distance(px: number): number {
  return window.innerWidth < 640 ? Math.round(px * 0.65) : px;
}

export type Conditions = Record<string, boolean>;

export interface MotionContext {
  /** Results of the media queries requested by the section. */
  conditions: Conditions;
  /** Call when the entrance starts; resizing afterwards will not replay it. */
  markPlayed: () => void;
}

const registry: gsap.MatchMedia[] = [];

/**
 * Wraps gsap.matchMedia() for one section:
 * - the setup only runs with motion allowed (`prefers-reduced-motion: no-preference`),
 *   otherwise the markup stays exactly as authored and fully visible;
 * - selectors inside `setup` are scoped to `root`;
 * - `queries` are layout breakpoints (desktop-first, same as the CSS) for sections
 *   whose composition changes between breakpoints;
 * - once the entrance has played, a breakpoint change reverts to the final state
 *   instead of replaying it.
 */
export function createMotion(
  root: Element,
  setup: (context: MotionContext) => void | (() => void),
  queries: Record<string, string> = {},
): gsap.MatchMedia {
  let played = false;
  const media = gsap.matchMedia();
  media.add(
    { motion: "(prefers-reduced-motion: no-preference)", ...queries },
    (context) => {
      const conditions = (context.conditions ?? {}) as Conditions;
      if (!conditions["motion"] || played) return;
      return setup({
        conditions,
        markPlayed: () => {
          played = true;
        },
      });
    },
    root as HTMLElement,
  );
  registry.push(media);
  return media;
}

/**
 * Hover feedback for mouse users only (touch and pen never get a stuck hover).
 * Returns a cleanup function that removes the listeners and restores the target.
 */
export function bindHover(
  items: Element[],
  pick: (item: Element) => Element | null,
  over: gsap.TweenVars,
  out: gsap.TweenVars,
): () => void {
  const abort = new AbortController();
  const { signal } = abort;
  const targets: Element[] = [];
  for (const item of items) {
    const target = pick(item);
    if (!target) continue;
    targets.push(target);
    item.addEventListener(
      "pointerenter",
      (event) => {
        if ((event as PointerEvent).pointerType !== "mouse") return;
        gsap.to(target, { ...over, overwrite: "auto" });
      },
      { signal },
    );
    item.addEventListener(
      "pointerleave",
      () => {
        gsap.to(target, {
          ...out,
          overwrite: "auto",
          onComplete: () => {
            gsap.set(target, { clearProps: "transform" });
            if (!target.getAttribute("style")?.trim()) {
              target.removeAttribute("style");
            }
          },
        });
      },
      { signal },
    );
  }
  return () => {
    abort.abort();
    gsap.killTweensOf(targets);
    gsap.set(targets, { clearProps: "transform" });
  };
}

// Web fonts change text metrics after the first layout: re-measure the triggers.
document.fonts?.ready.then(() => ScrollTrigger.refresh());

// Leaving the page (including bfcache) restores the authored, fully visible state.
window.addEventListener("pagehide", () => {
  registry.forEach((media) => media.revert());
  registry.length = 0;
});
