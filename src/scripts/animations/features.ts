import { gsap } from "@scripts/animations/gsap";
import {
  createMotion,
  distance,
  duration,
  ease,
  start,
} from "@scripts/animations/motion";

/*
 * Features: native horizontal scroll + scripts/features.ts own the carousel and
 * the active card. Nothing here pins, scrubs or touches scroll position.
 *
 * - Entrance (once per band): intro, art and the *contents* of the cards. The
 *   card itself is never transformed: its surface uses mix-blend-mode and a
 *   filter, which would blend differently inside a transformed group.
 * - Active-state feedback: a MutationObserver reacts to the classes that
 *   features.ts already toggles (feature-card--featured, features__image--active)
 *   and gives the new card's icon and image a short settle. It never changes
 *   which card is selected.
 */
const bands = gsap.utils.toArray<HTMLElement>("[data-features]");
const first = bands[0];
if (first) {
  createMotion(first.parentElement ?? document.body, () => {
    const observers: MutationObserver[] = [];

    bands.forEach((band) => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-feature-card]", band);
      const art = band.querySelector<HTMLElement>(".features__art");
      let ready = false;

      const timeline = gsap.timeline({
        defaults: { ease: ease.enter },
        scrollTrigger: { trigger: band, start: start.base, once: true },
        onComplete: () => {
          ready = true;
        },
      });

      timeline.from(
        band.querySelector(".features__title"),
        {
          y: distance(20),
          opacity: 0,
          duration: duration.enter,
          clearProps: "transform,opacity",
        },
        0,
      );
      if (art) {
        timeline.from(
          art,
          {
            scale: 0.88,
            opacity: 0,
            duration: 0.9,
            clearProps: "transform,opacity",
          },
          0.1,
        );
      }
      // The card tab's contents appear card by card; `y` is small and downward so
      // it stays inside the track padding (no extra scrollable overflow).
      cards.forEach((card, index) => {
        const at = 0.2 + index * 0.09;
        timeline
          .from(
            card.querySelector(".feature-card__icon-wrapper"),
            {
              scale: 0.5,
              opacity: 0,
              duration: 0.6,
              ease: ease.settle,
              clearProps: "transform,opacity",
            },
            at,
          )
          .from(
            card.querySelector(".feature-card__number"),
            {
              opacity: 0,
              duration: 0.6,
              ease: ease.soft,
              clearProps: "opacity",
            },
            at,
          )
          .from(
            card.querySelector(".feature-card__body"),
            {
              y: 12,
              opacity: 0,
              duration: 0.7,
              clearProps: "transform,opacity",
            },
            at + 0.08,
          );
      });

      const observer = new MutationObserver((records) => {
        if (!ready) return;
        for (const record of records) {
          const target = record.target as HTMLElement;
          const before = record.oldValue ?? "";
          if (
            target.matches("[data-feature-card]") &&
            target.classList.contains("feature-card--featured") &&
            !before.includes("feature-card--featured")
          ) {
            gsap.fromTo(
              target.querySelector(".feature-card__icon-wrapper"),
              { scale: 0.82 },
              {
                scale: 1,
                duration: 0.6,
                ease: "back.out(2.2)",
                overwrite: "auto",
                clearProps: "transform",
              },
            );
          } else if (
            target.matches("[data-feature-image]") &&
            target.classList.contains("features__image--active") &&
            !before.includes("features__image--active")
          ) {
            // Opacity/visibility stay with the existing CSS transition.
            gsap.fromTo(
              target,
              { scale: 0.93, y: 10 },
              {
                scale: 1,
                y: 0,
                duration: 0.7,
                ease: ease.enter,
                overwrite: "auto",
                clearProps: "transform",
              },
            );
          }
        }
      });
      observer.observe(band, {
        attributes: true,
        attributeFilter: ["class"],
        attributeOldValue: true,
        subtree: true,
      });
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
      bands.forEach((band) => {
        gsap.killTweensOf(
          band.querySelectorAll(
            "[data-feature-image], .feature-card__icon-wrapper",
          ),
        );
      });
    };
  });
}
