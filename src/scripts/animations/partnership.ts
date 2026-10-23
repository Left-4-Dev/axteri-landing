import { gsap } from "@scripts/animations/gsap";
import {
  createMotion,
  distance,
  ease,
  start,
} from "@scripts/animations/motion";

/*
 * Partnership: the illustration eases in and the call to action rises in order.
 * The big circle behind the illustration is a pseudo-element with a multiply
 * shadow and the section clips overflow, so only the content is animated.
 * The CTA only fades: `.action` links keep their own CSS transitions.
 */
const root = document.querySelector<HTMLElement>(".partnership");
if (root) {
  createMotion(root, () => {
    const timeline = gsap.timeline({
      defaults: { ease: ease.enter },
      scrollTrigger: { trigger: root, start: start.late, once: true },
    });

    timeline
      .from(
        ".partnership__image",
        {
          scale: 0.92,
          opacity: 0,
          duration: 1,
          clearProps: "transform,opacity",
        },
        0,
      )
      .from(
        ".partnership__title, .partnership__description",
        {
          y: distance(24),
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          clearProps: "transform,opacity",
        },
        0.2,
      )
      .from(
        ".partnership__action",
        { opacity: 0, duration: 0.6, ease: ease.soft, clearProps: "opacity" },
        0.5,
      );
  });
}
