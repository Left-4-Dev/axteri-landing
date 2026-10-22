import { gsap, ScrollTrigger } from "@scripts/animations/gsap";
import {
  createMotion,
  distance,
  duration,
  ease,
  start,
} from "@scripts/animations/motion";

/*
 * MetricCard: the percentage ring fills up to its value while the figure counts
 * with it. The ring is an inline SVG circle (pathLength = 100) whose
 * `stroke-dasharray="value rest"` attribute is the authored final state; the tween
 * runs from "0 100" to that same pair and then removes its inline style.
 * Cards that enter the viewport together (one grid row) are staggered as a batch.
 */
const cards = gsap.utils.toArray<HTMLElement>(".metric");
const first = cards[0];
if (first) {
  createMotion(first.parentElement ?? document.body, () => {
    const originalText = new Map<HTMLElement, string>();

    gsap.set(cards, { opacity: 0, y: distance(28) });

    ScrollTrigger.batch(cards, {
      start: start.early,
      once: true,
      batchMax: 3,
      interval: 0.1,
      onEnter: (batch) => {
        const timeline = gsap.timeline();
        batch.forEach((card, index) => {
          const ring = card.querySelector<SVGCircleElement>(".metric__value");
          const figure = card.querySelector<HTMLElement>(".metric__label strong");
          const at = index * 0.14;
          timeline.to(
            card,
            {
              opacity: 1,
              y: 0,
              duration: duration.enter,
              ease: ease.enter,
              clearProps: "transform,opacity",
            },
            at,
          );

          // The attribute holds the authored "value rest" pair.
          const final = ring?.getAttribute("stroke-dasharray");
          const value = Number.parseFloat(final ?? "");
          if (ring && final && Number.isFinite(value)) {
            timeline.fromTo(
              ring,
              { strokeDasharray: "0 100" },
              {
                strokeDasharray: final,
                duration: 1.5,
                ease: "power3.out",
                clearProps: "strokeDasharray",
              },
              at + 0.15,
            );
            if (figure) {
              const text = figure.textContent ?? "";
              originalText.set(figure, text);
              const counter = { n: 0 };
              // Equal-width digits while counting keeps the centred figure steady.
              figure.style.fontVariantNumeric = "tabular-nums";
              timeline.to(
                counter,
                {
                  n: value,
                  duration: 1.5,
                  ease: "power3.out",
                  snap: { n: 1 },
                  onUpdate: () => {
                    figure.textContent = `${counter.n}%`;
                  },
                  onComplete: () => {
                    figure.textContent = text;
                    figure.removeAttribute("style");
                  },
                },
                at + 0.15,
              );
            }
          }
        });
      },
    });

    return () => {
      originalText.forEach((text, figure) => {
        figure.textContent = text;
        figure.removeAttribute("style");
      });
    };
  });
}
