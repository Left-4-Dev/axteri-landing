import { gsap } from "@scripts/animations/gsap";
import { createMotion, ease } from "@scripts/animations/motion";

const root = document.querySelector<HTMLElement>(".header");
if (root) {
  createMotion(root, () => {
    const nav = root.querySelector<HTMLElement>("#main-navigation");
    const links = gsap.utils.toArray<HTMLElement>(".header__link", root);

    // Intro: runs together with the hero (no waiting). The hamburger button is
    // never animated so the menu is reachable from the first frame.
    const intro = gsap.timeline({
      defaults: { duration: 0.6, ease: ease.enter },
    });
    intro.from(".brand", { y: -10, opacity: 0, clearProps: "transform,opacity" }, 0);
    // On mobile the links live inside the closed panel; they animate on open.
    if (nav && getComputedStyle(nav).display !== "none") {
      intro.from(
        links,
        {
          y: -8,
          opacity: 0,
          stagger: 0.06,
          duration: 0.5,
          clearProps: "transform,opacity",
        },
        0.1,
      );
    }
    intro.from(
      ".header__theme",
      { opacity: 0, duration: 0.5, clearProps: "opacity" },
      0.3,
    );

    // Mobile panel: stagger the links each time navigation.ts opens it. Only the
    // class that script already toggles is observed; its logic is untouched.
    if (!nav) return;
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        const wasOpen = (record.oldValue ?? "").includes("header__nav--open");
        const isOpen = nav.classList.contains("header__nav--open");
        if (isOpen && !wasOpen) {
          gsap.fromTo(
            links,
            { y: -8, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.35,
              ease: ease.soft,
              stagger: 0.05,
              overwrite: "auto",
              clearProps: "transform,opacity",
            },
          );
        }
      }
    });
    observer.observe(nav, {
      attributes: true,
      attributeFilter: ["class"],
      attributeOldValue: true,
    });
    return () => {
      observer.disconnect();
      gsap.killTweensOf(links);
      gsap.set(links, { clearProps: "transform,opacity" });
    };
  });
}
