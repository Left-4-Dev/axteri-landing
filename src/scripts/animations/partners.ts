import { gsap } from "@scripts/animations/gsap";
import {
  createMotion,
  distance,
  ease,
  start,
} from "@scripts/animations/motion";

/*
 * Partners: the viewer and controls rise as cohesive blocks. Individual brand
 * buttons keep their authored CSS hover transition untouched, and panel
 * switching stays under scripts/partners.ts.
 */
const root = document.querySelector<HTMLElement>(".partners");
if (root) {
  createMotion(root, () => {
    const timeline = gsap.timeline({
      defaults: { ease: ease.enter },
      scrollTrigger: {
        trigger: ".partners__viewer",
        start: start.base,
        once: true,
      },
    });

    timeline
      .from(
        ".partners__viewer",
        {
          y: distance(26),
          opacity: 0,
          duration: 0.85,
          clearProps: "transform,opacity",
        },
        0,
      )
      .from(
        ".partners__controls",
        {
          y: distance(18),
          opacity: 0,
          duration: 0.7,
          ease: ease.soft,
          clearProps: "transform,opacity",
        },
        0.18,
      );
  });
}
