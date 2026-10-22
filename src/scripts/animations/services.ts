import { gsap } from "@scripts/animations/gsap";
import {
  bindHover,
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

      return bindHover(
        items,
        (item) => item.querySelector(".services__icon"),
        { scale: 1.1, rotate: 4, duration: 0.35, ease: ease.soft },
        { scale: 1, rotate: 0, duration: 0.45, ease: ease.soft },
      );
    },
    { lg: "(width >= 64rem)" },
  );
}
