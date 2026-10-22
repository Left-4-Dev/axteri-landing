import { gsap } from "@scripts/animations/gsap";
import {
  createMotion,
  distance,
  ease,
  start,
} from "@scripts/animations/motion";

/*
 * Benefits comparison (Antes -> Despues): the pill rises, its connector (CSS
 * pseudo-elements, driven through --connector-reveal / --connector-dot-scale)
 * grows up from the pill, the two sides come in towards the centre and the play
 * arrow settles and nudges once in the direction it points.
 * The arrow is rotated by CSS below md, so GSAP only adds translate/scale on top
 * of that rotation and then hands the element back to the stylesheet.
 */
const root = document.querySelector<HTMLElement>(".benefits__comparison");
if (root) {
  createMotion(
    root,
    ({ conditions, markPlayed }) => {
      const wide = conditions["md"] === true;
      const [before, , after] = Array.from(root.children) as HTMLElement[];
      const arrow = root.querySelector<HTMLElement>(".benefits__arrow");

      const timeline = gsap.timeline({
        defaults: { ease: ease.enter },
        scrollTrigger: {
          trigger: root,
          start: start.base,
          once: true,
          onEnter: markPlayed,
        },
      });

      timeline.from(
        root,
        {
          y: distance(34),
          scale: 0.96,
          opacity: 0,
          duration: 0.9,
          clearProps: "transform,opacity",
        },
        0,
      );

      gsap.set(root, { "--connector-reveal": 0, "--connector-dot-scale": 0 });
      timeline
        .to(
          root,
          {
            "--connector-reveal": 1,
            duration: 0.5,
            ease: ease.soft,
            clearProps: "--connector-reveal",
          },
          0.55,
        )
        .to(
          root,
          {
            "--connector-dot-scale": 1,
            duration: 0.4,
            ease: "back.out(2)",
            clearProps: "--connector-dot-scale",
          },
          0.95,
        );

      const side = (element: HTMLElement | undefined, direction: number, at: number) => {
        if (!element) return;
        timeline.from(
          element,
          {
            x: wide ? direction * 24 : 0,
            y: wide ? 0 : distance(16),
            opacity: 0,
            duration: 0.8,
            clearProps: "transform,opacity",
          },
          at,
        );
      };
      side(before, -1, 0.35);
      side(after, 1, 0.5);

      if (arrow) {
        timeline
          .from(
            arrow,
            {
              scale: 0.4,
              opacity: 0,
              duration: 0.6,
              ease: ease.settle,
              clearProps: "transform,opacity",
            },
            0.65,
          )
          // One nudge along the arrow's direction (right on md+, down when stacked).
          .to(
            arrow,
            {
              ...(wide ? { x: 6 } : { y: 6 }),
              duration: 0.35,
              yoyo: true,
              repeat: 1,
              ease: "sine.inOut",
              onComplete: () => {
                gsap.set(arrow, { clearProps: "transform" });
              },
            },
            1.35,
          );
      }
    },
    { md: "(width >= 48rem)" },
  );
}
