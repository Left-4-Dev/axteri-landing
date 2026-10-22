import { gsap } from "@scripts/animations/gsap";
import { createMotion, distance, duration, ease, start } from "@scripts/animations/motion";

/**
 * SectionHeading is shared by most sections, so its entrance lives here once.
 * The Hero does not use it and the heading above the fold is never delayed.
 */
const headings = gsap.utils.toArray<HTMLElement>(".section-heading");
if (headings.length) {
  createMotion(document.body, () => {
    headings.forEach((heading) => {
      const parts = heading.querySelectorAll(
        ".section-heading__title, .section-heading__description",
      );
      gsap.from(parts, {
        y: distance(22),
        opacity: 0,
        duration: duration.enter,
        ease: ease.enter,
        stagger: 0.12,
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: heading, start: start.early, once: true },
      });
    });
  });
}
