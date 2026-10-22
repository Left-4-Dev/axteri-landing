import { gsap } from "@scripts/animations/gsap";
import {
  bindLoop,
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
 *
 * Inside `.audience__image`, a coordinated 6-second loop brings the e-commerce
 * scene to life: the buyer taps her phone, the store portal emits digital waves,
 * the package and delivery mascot float forward along the isometric axis, and
 * the cart + check badge confirm the order.
 */
const root = document.querySelector<HTMLElement>(".audience");
if (root) {
  createMotion(
    root,
    ({ conditions, markPlayed }) => {
      const wide = conditions["xl"] === true;
      const panels = gsap.utils.toArray<HTMLElement>(".audience__panel", root);
      const svg = root.querySelector<SVGSVGElement>(".audience__image");
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

      if (!svg) return;

      return bindLoop(svg, () => {
        const q = gsap.utils.selector(svg);
        const bubble = q('[data-audience="bubble"]');
        const cart = q('[data-audience="cart"]');
        const check = q('[data-audience="check"]');
        const awning = q('[data-audience="awning"]');
        const portal = q('[data-audience="portal"]');
        const waves = q('[data-audience="wave"]');
        const delivery = q('[data-audience="delivery"]');
        const mascotEyes = q('[data-audience="mascot-eyes"]');
        const pkg = q('[data-audience="package"]');
        const characterUpper = q('[data-audience="character-upper"]');
        const characterHand = q('[data-audience="character-hand"]');
        const characterEyes = q('[data-audience="character-eyes"]');
        const characterBrows = q('[data-audience="character-brows"]');

        const loop = gsap.timeline({
          repeat: -1,
          defaults: { ease: "sine.inOut" },
        });

        // 1. Character breathing, subtle phone tap, eye blinks & brow reaction
        if (characterUpper.length) {
          loop
            .to(
              characterUpper,
              {
                y: -1.6,
                rotation: -0.8,
                scaleY: 1.007,
                svgOrigin: "288 255",
                duration: 3,
              },
              0,
            )
            .to(
              characterUpper,
              {
                y: 0,
                rotation: 0,
                scaleY: 1,
                svgOrigin: "288 255",
                duration: 3,
              },
              3,
            );
        }

        if (characterHand.length) {
          for (const tapAt of [0.15, 3.05]) {
            loop
              .to(
                characterHand,
                {
                  x: 0.9,
                  y: -1.1,
                  rotation: 2.6,
                  svgOrigin: "242 248",
                  duration: 0.25,
                  ease: "power2.out",
                },
                tapAt,
              )
              .to(
                characterHand,
                {
                  x: 0,
                  y: 0,
                  rotation: 0,
                  svgOrigin: "242 248",
                  duration: 0.35,
                  ease: "power2.inOut",
                },
                tapAt + 0.25,
              );
          }
        }

        if (characterEyes.length) {
          for (const blinkAt of [1.15, 4.35]) {
            loop
              .to(
                characterEyes,
                {
                  scaleY: 0.1,
                  svgOrigin: "272.6 153.6",
                  duration: 0.08,
                  ease: "power1.in",
                },
                blinkAt,
              )
              .to(
                characterEyes,
                {
                  scaleY: 1,
                  svgOrigin: "272.6 153.6",
                  duration: 0.1,
                  ease: "power1.out",
                },
                blinkAt + 0.08,
              );
          }
        }

        if (characterBrows.length) {
          loop
            .to(
              characterBrows,
              {
                y: -1.4,
                svgOrigin: "272.8 148",
                duration: 0.4,
                ease: "power2.out",
              },
              2.25,
            )
            .to(
              characterBrows,
              {
                y: 0,
                svgOrigin: "272.8 148",
                duration: 0.65,
              },
              3.1,
            );
        }

        // 2. Digital storefront: portal pulse, expanding signal waves & awning sway
        if (portal.length) {
          loop.to(
            portal,
            {
              scale: 1.045,
              svgOrigin: "102 211",
              duration: 1.5,
              yoyo: true,
              repeat: 3,
            },
            0,
          );
        }

        if (waves.length) {
          for (const waveStart of [0.35, 3.25]) {
            loop
              .to(
                waves,
                {
                  scale: 1.08,
                  x: 2.2,
                  y: -1.2,
                  opacity: 0.35,
                  svgOrigin: "102 211",
                  duration: 0.9,
                  stagger: 0.12,
                  ease: "power2.out",
                },
                waveStart,
              )
              .to(
                waves,
                {
                  scale: 1,
                  x: 0,
                  y: 0,
                  opacity: 1,
                  svgOrigin: "102 211",
                  duration: 1.1,
                  stagger: 0.12,
                  ease: "sine.inOut",
                },
                waveStart + 0.9,
              );
          }
        }

        if (awning.length) {
          loop.to(
            awning,
            {
              rotation: -1.1,
              y: -1.2,
              scale: 1.008,
              svgOrigin: "89.5 85.3",
              duration: 1.5,
              yoyo: true,
              repeat: 3,
            },
            0,
          );
        }

        // 3. Isometric delivery & floating package
        if (delivery.length) {
          loop
            .to(
              delivery,
              {
                x: 4.2,
                y: -5.5,
                svgOrigin: "145 225",
                duration: 3,
              },
              0,
            )
            .to(
              delivery,
              {
                x: 0,
                y: 0,
                svgOrigin: "145 225",
                duration: 3,
              },
              3,
            );
        }

        if (pkg.length) {
          loop.to(
            pkg,
            {
              x: 1.8,
              y: -3.2,
              rotation: 1.3,
              svgOrigin: "168 244",
              duration: 1.5,
              yoyo: true,
              repeat: 3,
            },
            0,
          );
        }

        if (mascotEyes.length) {
          for (const blinkAt of [1.8, 4.8]) {
            loop
              .to(
                mascotEyes,
                {
                  scaleY: 0.12,
                  svgOrigin: "146 207",
                  duration: 0.08,
                  ease: "power1.in",
                },
                blinkAt,
              )
              .to(
                mascotEyes,
                {
                  scaleY: 1,
                  svgOrigin: "146 207",
                  duration: 0.1,
                  ease: "power1.out",
                },
                blinkAt + 0.08,
              );
          }
        }

        // 4. Speech bubble, shopping cart & confirmation check badge
        if (bubble.length) {
          loop
            .to(
              bubble,
              {
                y: 3.2,
                svgOrigin: "298 60",
                duration: 3,
              },
              0,
            )
            .to(
              bubble,
              {
                y: 0,
                svgOrigin: "298 60",
                duration: 3,
              },
              3,
            );
        }

        if (cart.length) {
          loop
            .to(
              cart,
              {
                y: -2.4,
                rotation: -3.5,
                scale: 1.045,
                svgOrigin: "290 62",
                duration: 0.32,
                ease: "power2.out",
              },
              1.85,
            )
            .to(
              cart,
              {
                y: 0,
                rotation: 0,
                scale: 1,
                svgOrigin: "290 62",
                duration: 0.5,
                ease: "back.out(1.8)",
              },
              2.17,
            );
        }

        if (check.length) {
          loop
            .to(
              check,
              {
                scale: 1.2,
                rotation: -6,
                svgOrigin: "316.7 58.9",
                duration: 0.34,
                ease: "back.out(2.4)",
              },
              2.1,
            )
            .to(
              check,
              {
                scale: 1,
                rotation: 0,
                svgOrigin: "316.7 58.9",
                duration: 0.55,
                ease: "power2.out",
              },
              2.44,
            )
            .to(
              check,
              {
                scale: 1.08,
                svgOrigin: "316.7 58.9",
                duration: 0.35,
                yoyo: true,
                repeat: 1,
              },
              4.6,
            );
        }

        return loop;
      });
    },
    { xl: "(width >= 80rem)" },
  );
}
