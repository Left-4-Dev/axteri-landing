import { gsap } from "@scripts/animations/gsap";
import {
  createMotion,
  distance,
  ease,
  start,
} from "@scripts/animations/motion";

/*
 * Audience: on the three-column layout (xl) the pill-shaped panels open from the
 * screen edge towards the illustration. They scale from their outer edge instead
 * of sliding in, so nothing is ever pushed past the viewport (no horizontal
 * overflow). Below xl they are plain cards and simply rise.
 */
const root = document.querySelector<HTMLElement>(".audience");
if (root) {
  createMotion(
    root,
    ({ conditions, markPlayed }) => {
      const wide = conditions["xl"] === true;
      const panels = gsap.utils.toArray<HTMLElement>(".audience__panel", root);
      const timeline = gsap.timeline({
        defaults: { ease: ease.enter },
        scrollTrigger: {
          trigger: ".audience__layout",
          start: start.base,
          once: true,
          onEnter: markPlayed,
        },
      });

      timeline.from(
        ".audience__image",
        {
          scale: 0.88,
          opacity: 0,
          duration: 0.9,
          ease: ease.settle,
          clearProps: "transform,opacity",
        },
        0,
      );

      panels.forEach((panel, index) => {
        const buyers = index === 1;
        timeline.from(
          panel,
          wide
            ? {
                scale: 0.88,
                transformOrigin: buyers ? "100% 50%" : "0% 50%",
                opacity: 0,
                duration: 0.9,
                clearProps: "transform,transformOrigin,opacity",
              }
            : {
                y: distance(28),
                opacity: 0,
                duration: 0.8,
                clearProps: "transform,opacity",
              },
          0.15 + index * 0.15,
        );
        timeline.from(
          panel.querySelectorAll("h3, p"),
          {
            y: distance(14),
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: ease.soft,
            clearProps: "transform,opacity",
          },
          0.4 + index * 0.15,
        );
      });
    },
    { xl: "(width >= 80rem)" },
  );
}
