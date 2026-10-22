import { gsap } from "@scripts/animations/gsap";
import {
  bindHover,
  createMotion,
  distance,
  duration,
  ease,
  start,
} from "@scripts/animations/motion";

const root = document.querySelector<HTMLElement>(".about");
if (root) {
  // Below md the cards stack, so they rise instead of coming in from the sides.
  createMotion(
    root,
    ({ conditions, markPlayed }) => {
      const cards = gsap.utils.toArray<HTMLElement>(".about__card", root);
      const sideways = conditions["md"] === true;
      const timeline = gsap.timeline({
        defaults: { ease: ease.enter },
        scrollTrigger: {
          trigger: ".about__grid",
          start: start.base,
          once: true,
          onEnter: markPlayed,
        },
      });

      cards.forEach((card, index) => {
        const at = index * 0.16;
        const icon = card.querySelector(".about__icon");
        const text = card.querySelectorAll(".about__title, p");
        timeline.from(
          card,
          {
            y: distance(34),
            x: sideways ? (index === 0 ? -20 : 20) : 0,
            opacity: 0,
            duration: duration.enter + 0.1,
            clearProps: "transform,opacity",
          },
          at,
        );
        // Only the icon image moves: its wrapper owns the multiply-blended shadow,
        // and transforming it would change how that shadow blends mid-animation.
        if (icon) {
          timeline.from(
            icon,
            {
              scale: 0.4,
              rotate: -28,
              opacity: 0,
              duration: 0.8,
              ease: ease.settle,
              clearProps: "transform,opacity",
            },
            at + 0.3,
          );
        }
        timeline.from(
          text,
          {
            y: distance(12),
            opacity: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: ease.soft,
            clearProps: "transform,opacity",
          },
          at + 0.25,
        );
      });

      return bindHover(
        cards,
        (card) => card.querySelector(".about__icon"),
        { scale: 1.12, rotate: 6, duration: 0.35, ease: ease.soft },
        { scale: 1, rotate: 0, duration: 0.45, ease: ease.soft },
      );
    },
    { md: "(width >= 48rem)" },
  );
}
