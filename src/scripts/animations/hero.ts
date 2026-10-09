import { gsap } from "@scripts/animations/gsap";
const root = document.querySelector<HTMLElement>(".hero");
if (root) {
  const media = gsap.matchMedia();
  media.add(
    "(prefers-reduced-motion: no-preference)",
    () => {
      const timeline = gsap.timeline({
        defaults: { duration: 0.8, ease: "power3.out" },
      });
      // Keep the main heading visible from first paint; animate only its position.
      timeline
        .from(root.querySelector(".hero__title"), {
          y: 18,
          clearProps: "transform",
        })
        .from(
          root.querySelector(".hero__description"),
          { y: 12, clearProps: "transform" },
          0.12,
        )
        .from(
          root.querySelector(".hero__actions"),
          { y: 10, clearProps: "transform" },
          0.22,
        )
        .from(
          root.querySelectorAll(".hero__stat"),
          { y: 18, stagger: 0.1, clearProps: "transform" },
          0.3,
        );
    },
    root,
  );
  window.addEventListener("pagehide", () => media.revert(), { once: true });
}
