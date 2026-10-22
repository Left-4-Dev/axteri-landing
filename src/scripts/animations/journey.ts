import { gsap } from "@scripts/animations/gsap";
import {
  bindHover,
  createMotion,
  ease,
  start,
} from "@scripts/animations/motion";

/*
 * Purchase journey: a progression of steps.
 *
 * Desktop (xl and up): the inline SVG route is drawn with DrawSVG. The route is
 * a path inside the mask, so drawing it reveals the gradient behind it, and each
 * node ring (outer circle + hollow centre, scaled together around the node
 * centre) blooms just before the line reaches it. The final render is the
 * untouched mask.
 *
 * Below xl: the route is a plain vertical line (::before of the list). It grows
 * through `--route-progress` as each step enters the viewport.
 */
const root = document.querySelector<HTMLElement>(".journey");
if (root) {
  createMotion(
    root,
    ({ conditions, markPlayed }) => {
      const steps = gsap.utils.toArray<HTMLElement>(".journey__step", root);
      const parts = (step: HTMLElement) => ({
        wrapper: step.querySelector<HTMLElement>(".journey__icon-wrapper"),
        icon: step.querySelector<HTMLElement>(".journey__icon"),
        label: step.querySelector<HTMLElement>(".journey__label"),
      });

      if (conditions["xl"] === true) {
        const svg = root.querySelector<SVGSVGElement>(".journey__route");
        const path = svg?.querySelector<SVGPathElement>("[data-journey-path]");
        const nodes = svg
          ? Array.from(svg.querySelectorAll<SVGCircleElement>("[data-journey-node]"))
          : [];
        const holes = svg
          ? Array.from(svg.querySelectorAll<SVGCircleElement>("[data-journey-hole]"))
          : [];
        if (!svg || !path || !nodes.length || nodes.length !== holes.length) return;

        // Where along the route (0..1) each node sits, from the node coordinates.
        const centres = nodes.map((node) => ({
          x: Number(node.getAttribute("cx")),
          y: Number(node.getAttribute("cy")),
        }));
        const along = [0];
        for (let i = 1; i < centres.length; i++) {
          const a = centres[i - 1]!;
          const b = centres[i]!;
          along.push(along[i - 1]! + Math.hypot(b.x - a.x, b.y - a.y));
        }
        const total = along[along.length - 1] || 1;

        const DRAW = 3.4;
        const LEAD = 0.35;
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".journey__diagram",
            start: start.late,
            once: true,
            onEnter: markPlayed,
          },
        });

        // Round caps would show a dot at zero length: keep the path transparent
        // until the first node ring is already covering its start.
        gsap.set(path, { opacity: 0 });
        timeline
          .fromTo(
            path,
            { drawSVG: "0%" },
            {
              drawSVG: "100%",
              duration: DRAW,
              ease: "none",
              onComplete: () => {
                path.removeAttribute("style");
              },
            },
            LEAD,
          )
          .to(
            path,
            {
              opacity: 1,
              duration: 0.01,
              onComplete: () => {
                path.removeAttribute("style");
              },
            },
            LEAD,
          );

        nodes.forEach((node, index) => {
          const hole = holes[index]!;
          const centre = centres[index]!;
          const step = steps[index];
          const at = Math.max(0, LEAD + (DRAW * along[index]!) / total - 0.5);
          timeline.from(
            [node, hole],
            {
              scale: 0,
              svgOrigin: `${centre.x} ${centre.y}`,
              duration: 0.6,
              ease: "back.out(1.3)",
              onComplete: () => {
                node.removeAttribute("style");
                node.removeAttribute("transform");
                hole.removeAttribute("style");
                hole.removeAttribute("transform");
              },
            },
            at,
          );
          if (!step) return;
          const { icon, label } = parts(step);
          // The step <li> and the labels carry CSS translate(-50%, ...): only the
          // icon image is scaled and the label only fades.
          if (icon) {
            timeline.from(
              icon,
              {
                scale: 0.5,
                opacity: 0,
                duration: 0.55,
                ease: ease.settle,
                clearProps: "transform,opacity",
              },
              at + 0.2,
            );
          }
          if (label) {
            timeline.from(
              label,
              {
                opacity: 0,
                duration: 0.5,
                ease: ease.soft,
                clearProps: "opacity",
              },
              at + 0.3,
            );
          }
        });
      } else {
        const list = root.querySelector<HTMLElement>(".journey__steps");
        if (!list) return;
        gsap.set(list, { "--route-progress": 0 });

        // How far down the line a step's node centre is (0..1).
        const progressAt = (wrapper: HTMLElement): number => {
          const line = getComputedStyle(list, "::before");
          const top = parseFloat(line.top) || 0;
          const height = parseFloat(line.height) || 1;
          const listTop = list.getBoundingClientRect().top;
          const box = wrapper.getBoundingClientRect();
          const centre = box.top + box.height / 2 - listTop;
          return gsap.utils.clamp(0, 1, (centre - top) / height);
        };

        steps.forEach((step, index) => {
          const { wrapper, label } = parts(step);
          const last = index === steps.length - 1;
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: step,
              start: start.early,
              once: true,
              onEnter: () => {
                markPlayed();
                gsap.to(list, {
                  "--route-progress": last || !wrapper ? 1 : progressAt(wrapper),
                  duration: 0.7,
                  ease: ease.soft,
                  overwrite: "auto",
                  // The step is the last one: leave the authored (full) line.
                  clearProps: last ? "--route-progress" : "",
                });
              },
            },
          });
          if (wrapper) {
            timeline.from(wrapper, {
              scale: 0.6,
              opacity: 0,
              duration: 0.6,
              ease: ease.settle,
              clearProps: "transform,opacity",
            });
          }
          if (label) {
            timeline.from(
              label,
              {
                x: 14,
                opacity: 0,
                duration: 0.55,
                ease: ease.soft,
                clearProps: "transform,opacity",
              },
              0.12,
            );
          }
        });
      }

      return bindHover(
        steps,
        (step) => step.querySelector(".journey__icon"),
        { scale: 1.1, duration: 0.35, ease: ease.soft },
        { scale: 1, duration: 0.45, ease: ease.soft },
      );
    },
    { xl: "(width >= 80rem)" },
  );
}
