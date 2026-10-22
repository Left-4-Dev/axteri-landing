import { gsap } from "@scripts/animations/gsap";
import {
  bindHover,
  bindLoop,
  createMotion,
  distance,
  ease,
  start,
} from "@scripts/animations/motion";

/*
 * Services: the hub appears first, the services settle around it and, on the
 * desktop diagram, the connectors are drawn from the hub out to each icon.
 * Connectors are CSS pseudo-elements (not SVG), so they are driven through the
 * `--connector-reveal` / `--connector-dot-scale` custom properties declared in
 * Services.astro. The <li> itself is never transformed because the support item
 * already positions itself with a CSS transform.
 */
const root = document.querySelector<HTMLElement>(".services");
if (root) {
  createMotion(
    root,
    ({ conditions, markPlayed }) => {
      const diagram = ".services__diagram";
      const items = gsap.utils.toArray<HTMLElement>(".services__item", root);
      const desktop = conditions["lg"] === true;

      const parts = (item: HTMLElement) => ({
        wrapper: item.querySelector<HTMLElement>(".services__icon-wrapper"),
        icon: item.querySelector<HTMLElement>(".services__icon"),
        title: item.querySelector<HTMLElement>("h3"),
      });

      const enterItem = (
        timeline: gsap.core.Timeline,
        item: HTMLElement,
        at: number,
      ) => {
        const { wrapper, icon, title } = parts(item);
        if (wrapper) {
          timeline.from(
            wrapper,
            {
              scale: 0.6,
              opacity: 0,
              duration: 0.7,
              ease: ease.settle,
              clearProps: "transform,opacity",
            },
            at,
          );
        }
        if (icon) {
          timeline.from(
            icon,
            {
              scale: 0.75,
              rotate: -14,
              duration: 0.7,
              ease: ease.enter,
              clearProps: "transform",
            },
            at + 0.12,
          );
        }
        if (title) {
          timeline.from(
            title,
            {
              y: distance(12),
              opacity: 0,
              duration: 0.55,
              ease: ease.soft,
              clearProps: "transform,opacity",
            },
            at + 0.2,
          );
        }
      };

      if (desktop) {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: diagram,
            start: start.late,
            once: true,
            onEnter: markPlayed,
          },
        });
        timeline
          .from(".services__center", {
            scale: 0.8,
            opacity: 0,
            duration: 0.9,
            ease: ease.settle,
            clearProps: "transform,opacity",
          })
          .from(
            ".services__center-image",
            {
              scale: 0.8,
              rotate: -10,
              opacity: 0,
              duration: 0.8,
              ease: ease.enter,
              clearProps: "transform,opacity",
            },
            0.15,
          );

        items.forEach((item, index) => {
          const { wrapper } = parts(item);
          const at = 0.5 + index * 0.14;
          enterItem(timeline, item, at);
          if (!wrapper) return;
          // Drawn after the icon has landed so the wrapper's scale never moves
          // a half-drawn connector. Order: hub-side dot, then bar towards the icon.
          gsap.set(wrapper, { "--connector-reveal": 0, "--connector-dot-scale": 0 });
          timeline
            .to(
              wrapper,
              {
                "--connector-dot-scale": 1,
                duration: 0.35,
                ease: "back.out(2)",
                clearProps: "--connector-dot-scale",
              },
              at + 0.75,
            )
            .to(
              wrapper,
              {
                "--connector-reveal": 1,
                duration: 0.5,
                ease: ease.soft,
                clearProps: "--connector-reveal",
              },
              at + 0.85,
            );
        });
      } else {
        // Stacked layout: hub, then each service as it scrolls into view.
        const hub = gsap.timeline({
          scrollTrigger: {
            trigger: ".services__center",
            start: start.early,
            once: true,
            onEnter: markPlayed,
          },
        });
        hub.from(".services__center", {
          scale: 0.85,
          opacity: 0,
          duration: 0.8,
          ease: ease.settle,
          clearProps: "transform,opacity",
        });
        items.forEach((item) => {
          const timeline = gsap.timeline({
            scrollTrigger: { trigger: item, start: start.early, once: true },
          });
          enterItem(timeline, item, 0);
        });
      }

      const stopHover = bindHover(
        items,
        (item) => item.querySelector(".services__icon"),
        { scale: 1.1, rotate: 4, duration: 0.35, ease: ease.soft },
        { scale: 1, rotate: 0, duration: 0.45, ease: ease.soft },
      );

      const centerSvg = root.querySelector<SVGSVGElement>(".services__center-image");
      if (!centerSvg) return stopHover;

      const stopLoop = bindLoop(centerSvg, () => {
        const q = gsap.utils.selector(centerSvg);
        const storefront = q('[data-marketplace="storefront"]');
        const awning = q('[data-marketplace="awning"]');
        const cols = q('[data-marketplace="col-left"], [data-marketplace="col-right"]');
        const product = q('[data-marketplace="product"]');
        const cta = q('[data-marketplace="cta"]');

        const loop = gsap.timeline({
          repeat: -1,
          defaults: { ease: "sine.inOut" },
        });

        if (storefront.length) {
          loop
            .to(
              storefront,
              {
                y: -2,
                svgOrigin: "105 68",
                duration: 2.5,
              },
              0,
            )
            .to(
              storefront,
              {
                y: 0,
                svgOrigin: "105 68",
                duration: 2.5,
              },
              2.5,
            );
        }

        if (awning.length) {
          loop.to(
            awning,
            {
              scaleY: 1.035,
              y: 0.8,
              svgOrigin: "105 4",
              duration: 1.25,
              yoyo: true,
              repeat: 3,
            },
            0,
          );
        }

        if (cols.length) {
          loop.to(
            cols,
            {
              opacity: 0.68,
              duration: 1.1,
              stagger: 0.25,
              yoyo: true,
              repeat: 3,
            },
            0,
          );
        }

        if (product.length) {
          loop
            .to(
              product,
              {
                scale: 1.06,
                svgOrigin: "126 78.5",
                duration: 0.38,
                ease: "back.out(2)",
              },
              1.0,
            )
            .to(
              product,
              {
                scale: 1,
                svgOrigin: "126 78.5",
                duration: 0.5,
                ease: "power2.out",
              },
              1.65,
            );
        }

        if (cta.length) {
          loop
            .to(
              cta,
              {
                scale: 1.08,
                svgOrigin: "126 103.3",
                duration: 0.32,
                ease: "back.out(2.2)",
              },
              1.35,
            )
            .to(
              cta,
              {
                scale: 1,
                svgOrigin: "126 103.3",
                duration: 0.45,
                ease: "power2.out",
              },
              1.85,
            );
        }

        return loop;
      });

      return () => {
        stopHover();
        stopLoop();
      };
    },
    { lg: "(width >= 64rem)" },
  );
}
