import { gsap } from "@scripts/animations/gsap";
import {
  bindHover,
  createMotion,
  distance,
  ease,
  start,
} from "@scripts/animations/motion";

const root = document.querySelector<HTMLElement>(".footer");
if (root) {
  createMotion(root, () => {
    const topLink = root.querySelector<HTMLElement>(".footer__top");

    gsap.from([".footer__brand", ".footer__universe"], {
      y: distance(18),
      opacity: 0,
      duration: 0.65,
      ease: ease.enter,
      stagger: 0.07,
      clearProps: "transform,opacity",
      scrollTrigger: {
        trigger: ".footer__brands",
        start: start.early,
        once: true,
      },
    });

    if (!topLink) return;
    return bindHover(
      [topLink],
      (item) => item.querySelector("svg"),
      { y: -4, scale: 1.06, duration: 0.28, ease: ease.soft },
      { y: 0, scale: 1, duration: 0.35, ease: ease.soft },
    );
  });
}
