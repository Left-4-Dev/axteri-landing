import { gsap } from "@scripts/animations/gsap";
import {
  bindHover,
  bindLoop,
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

      const stopHover = bindHover(
        cards,
        (card) => card.querySelector(".about__icon"),
        { scale: 1.12, rotate: 6, duration: 0.35, ease: ease.soft },
        { scale: 1, rotate: 0, duration: 0.45, ease: ease.soft },
      );

      const grid = root.querySelector<HTMLElement>(".about__grid");
      if (!grid) return stopHover;

      const stopLoop = bindLoop(grid, () => {
        const q = gsap.utils.selector(grid);
        const arrow = q('[data-about="target-arrow"]');
        const rings = q('[data-about="target-ring"]');
        const iris = q('[data-about="eye-iris"]');
        const brow = q('[data-about="eye-brow"]');
        const blink = q('[data-about="eye-blink"]');

        const loop = gsap.timeline({
          repeat: -1,
          defaults: { ease: "sine.inOut" },
        });

        // Mission (target.svg): arrow pulls back along its diagonal shaft, strikes
        // the bullseye, and ripples the concentric rings.
        if (arrow.length) {
          loop
            .to(
              arrow,
              {
                x: 2.2,
                y: -2.2,
                duration: 0.55,
                ease: "power2.inOut",
              },
              0.4,
            )
            .to(
              arrow,
              {
                x: 0,
                y: 0,
                duration: 0.38,
                ease: "back.out(2.2)",
              },
              0.95,
            );
        }

        if (rings.length) {
          loop
            .to(
              rings,
              {
                scale: 1.06,
                svgOrigin: "30.5 34.5",
                duration: 0.32,
                stagger: 0.08,
                ease: "power2.out",
              },
              1.1,
            )
            .to(
              rings,
              {
                scale: 1,
                svgOrigin: "30.5 34.5",
                duration: 0.6,
                stagger: 0.08,
              },
              1.42,
            );
        }

        // Vision (eye.svg): iris scans horizontally, brow lifts, and eye blinks.
        if (iris.length) {
          loop
            .to(
              iris,
              {
                x: -2.2,
                scale: 1.04,
                svgOrigin: "37.1 31",
                duration: 1.1,
              },
              0.2,
            )
            .to(
              iris,
              {
                x: 2.2,
                scale: 1.04,
                svgOrigin: "37.1 31",
                duration: 1.3,
              },
              1.3,
            )
            .to(
              iris,
              {
                x: 0,
                scale: 1,
                svgOrigin: "37.1 31",
                duration: 1.1,
              },
              2.6,
            );
        }

        if (brow.length) {
          loop
            .to(
              brow,
              {
                y: -1.2,
                svgOrigin: "37.1 9",
                duration: 1.2,
              },
              0.5,
            )
            .to(
              brow,
              {
                y: 0,
                svgOrigin: "37.1 9",
                duration: 1.2,
              },
              1.7,
            );
        }

        if (blink.length) {
          loop
            .to(
              blink,
              {
                scaleY: 0.14,
                svgOrigin: "37.1 31",
                duration: 0.09,
                ease: "power1.in",
              },
              3.7,
            )
            .to(
              blink,
              {
                scaleY: 1,
                svgOrigin: "37.1 31",
                duration: 0.12,
                ease: "power1.out",
              },
              3.79,
            );
        }

        return loop;
      });

      return () => {
        stopHover();
        stopLoop();
      };
    },
    { md: "(width >= 48rem)" },
  );
}
