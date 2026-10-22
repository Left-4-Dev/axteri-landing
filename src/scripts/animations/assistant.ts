import { gsap } from "@scripts/animations/gsap";
import {
  createMotion,
  distance,
  duration,
  ease,
  start,
} from "@scripts/animations/motion";

/*
 * Assistant: title, then the Axter symbol whose waveform is drawn stroke by
 * stroke (DrawSVG), then the conversation bubbles. On the desktop diagram the
 * bubbles come out of the symbol (left ones from the left, right ones from the
 * right, scaling from the side that touches the symbol); below lg they stack and
 * simply rise. Bubble tails are ::after pseudo-elements and travel with the
 * bubble, so their size and position never change.
 */
const root = document.querySelector<HTMLElement>(".assistant");
if (root) {
  createMotion(
    root,
    ({ conditions, markPlayed }) => {
      const desktop = conditions["lg"] === true;
      const bubbles = gsap.utils.toArray<HTMLElement>(".assistant__bubble", root);
      const wave = root.querySelector<SVGPathElement>(".assistant__image path");

      gsap.from([".assistant__title-curve", ".assistant__subtitle"], {
        y: distance(20),
        opacity: 0,
        duration: duration.enter,
        ease: ease.enter,
        stagger: 0.12,
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: ".assistant__title",
          start: start.early,
          once: true,
        },
      });

      const timeline = gsap.timeline({
        defaults: { ease: ease.enter },
        scrollTrigger: {
          trigger: ".assistant__layout",
          start: start.late,
          once: true,
          onEnter: markPlayed,
        },
      });

      // The wrapper (circle + connector) lands first.
      timeline.from(".assistant__image-wrapper", {
        scale: 0.8,
        opacity: 0,
        duration: 0.9,
        ease: ease.settle,
        clearProps: "transform,opacity",
      });

      // Connector grows up from the circle, once the circle has settled.
      gsap.set(".assistant__image-wrapper", { "--connector-reveal": 0 });
      timeline.to(
        ".assistant__image-wrapper",
        {
          "--connector-reveal": 1,
          duration: 0.5,
          ease: ease.soft,
          clearProps: "--connector-reveal",
        },
        0.7,
      );

      // The waveform draws itself. A stroke with round caps leaves a dot at
      // zero length, so the path stays transparent until the draw begins.
      if (wave) {
        gsap.set(wave, { opacity: 0 });
        timeline
          .fromTo(
            wave,
            { drawSVG: "0%" },
            {
              drawSVG: "100%",
              duration: 1.4,
              ease: ease.draw,
              onComplete: () => {
                wave.removeAttribute("style");
              },
            },
            0.3,
          )
          .to(
            wave,
            {
              opacity: 1,
              duration: 0.12,
              onComplete: () => {
                wave.removeAttribute("style");
              },
            },
            0.3,
          );
      }

      // Bubbles, in reading order, alternating sides on the desktop diagram.
      const bubblesAt = 0.9;
      bubbles.forEach((bubble, index) => {
        const fromLeft = index % 2 === 0;
        timeline.from(
          bubble,
          desktop
            ? {
                x: fromLeft ? -28 : 28,
                scale: 0.92,
                transformOrigin: fromLeft ? "100% 50%" : "0% 50%",
                opacity: 0,
                duration: 0.8,
                clearProps: "transform,transformOrigin,opacity",
              }
            : {
                y: distance(24),
                scale: 0.97,
                opacity: 0,
                duration: 0.7,
                clearProps: "transform,opacity",
              },
          bubblesAt + index * 0.16,
        );
      });
    },
    { lg: "(width >= 64rem)" },
  );
}
