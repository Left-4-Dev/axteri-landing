import { gsap } from "@scripts/animations/gsap";
import { createMotion, distance, ease } from "@scripts/animations/motion";

const root = document.querySelector<HTMLElement>(".hero");
if (root) {
  createMotion(root, () => {
    const figures = gsap.utils.toArray<HTMLElement>(".hero__stat dd", root);
    const originalText = new Map<HTMLElement, string>();

    const timeline = gsap.timeline({
      defaults: { duration: 0.8, ease: ease.enter },
    });
    // The title is the LCP element: it is painted from the first frame and only
    // travels a few pixels, never fades. Everything after it fades in.
    timeline
      .from(".hero__title", { y: distance(24), clearProps: "transform" }, 0)
      .from(
        ".hero__description",
        { y: distance(16), opacity: 0, clearProps: "transform,opacity" },
        0.12,
      )
      // The container travels; the buttons only fade because `.button` already
      // has a CSS transition on transform that would smooth GSAP's updates.
      .from(
        ".hero__actions",
        { y: distance(14), clearProps: "transform" },
        0.24,
      )
      .from(
        ".hero__action",
        { opacity: 0, duration: 0.6, stagger: 0.1, clearProps: "opacity" },
        0.24,
      )
      .from(
        ".hero__stat",
        {
          y: distance(26),
          opacity: 0,
          stagger: 0.12,
          clearProps: "transform,opacity",
        },
        0.4,
      );

    figures.forEach((figure, index) => {
      const raw = figure.textContent?.trim() ?? "";
      const match = /^(\+?)(\d+)$/.exec(raw);
      if (!match) return;
      const prefix = match[1] ?? "";
      const target = Number.parseInt(match[2] ?? "0", 10);
      originalText.set(figure, raw);
      const state = { value: 0 };
      figure.style.fontVariantNumeric = "tabular-nums";
      timeline.to(
        state,
        {
          value: target,
          duration: 1.1,
          ease: "power2.out",
          snap: { value: 1 },
          onUpdate: () => {
            figure.textContent = `${prefix}${state.value}`;
          },
          onComplete: () => {
            figure.textContent = raw;
            figure.removeAttribute("style");
          },
        },
        0.4 + index * 0.12,
      );
    });

    return () => {
      originalText.forEach((text, figure) => {
        figure.textContent = text;
        figure.removeAttribute("style");
      });
    };
  });
}
