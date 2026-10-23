/** Carruseles independientes: el borde inicial del scroll determina la tarjeta activa. */
function setupFeatures(root: HTMLElement): () => void {
  const track = root.querySelector<HTMLElement>("[data-feature-track]");
  const cards = Array.from(
    root.querySelectorAll<HTMLElement>("[data-feature-card]"),
  );
  const images = Array.from(
    root.querySelectorAll<HTMLImageElement>("[data-feature-image]"),
  );
  const dots = Array.from(
    root.querySelectorAll<HTMLButtonElement>("[data-feature-dot]"),
  );
  const previous = root.querySelector<HTMLButtonElement>("[data-feature-prev]");
  const next = root.querySelector<HTMLButtonElement>("[data-feature-next]");
  const controls = root.querySelector<HTMLElement>("[data-feature-controls]");
  const status = root.querySelector<HTMLElement>("[data-feature-status]");
  if (!track || !cards.length || !previous || !next || !controls)
    return () => {};

  const abort = new AbortController();
  const { signal } = abort;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let active = -1;
  let destination: number | null = null;
  let frame = 0;
  let settleTimer: ReturnType<typeof setTimeout> | undefined;
  const isRTL = () => getComputedStyle(track).direction === "rtl";

  // Medir los bordes evita depender del signo de scrollLeft en RTL.
  function distance(index: number): number {
    const card = cards[index];
    if (!card) return 0;
    const viewport = track!.getBoundingClientRect();
    const rect = card.getBoundingClientRect();
    const css = getComputedStyle(track!);
    return isRTL()
      ? rect.right - (viewport.right - parseFloat(css.paddingRight))
      : rect.left - (viewport.left + parseFloat(css.paddingLeft));
  }

  function select(index: number): void {
    if (index === active) return;
    active = index;
    cards.forEach((card, i) =>
      card.classList.toggle("feature-card--featured", i === index),
    );
    images.forEach((image, i) => {
      image.classList.toggle("features__image--active", i === index);
      if (i === index) image.loading = "eager";
    });
    dots.forEach((dot, i) => {
      if (i === index) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
    previous!.disabled = index === 0;
    next!.disabled = index === cards.length - 1;
  }

  function sync(): void {
    frame = 0;
    let closest = 0;
    let min = Infinity;
    cards.forEach((_, index) => {
      const offset = Math.abs(distance(index));
      if (offset < min) {
        min = offset;
        closest = index;
      }
    });
    select(closest);
  }

  function announce(): void {
    sync();
    destination = null;
    if (status) {
      const title =
        cards[active]?.querySelector("h4")?.textContent?.trim() ?? "";
      status.textContent = `${active + 1} de ${cards.length}: ${title}`;
    }
  }

  function onScroll(): void {
    if (!frame) frame = requestAnimationFrame(sync);
    clearTimeout(settleTimer);
    // También funciona en navegadores sin scrollend.
    settleTimer = setTimeout(announce, 180);
  }

  function goTo(index: number, smooth = true): void {
    const target = Math.max(0, Math.min(cards.length - 1, index));
    destination = target;
    track!.scrollBy({
      left: distance(target),
      behavior: smooth && !reducedMotion.matches ? "smooth" : "instant",
    });
    onScroll();
  }

  previous.addEventListener("click", () => goTo((destination ?? active) - 1), {
    signal,
  });
  next.addEventListener("click", () => goTo((destination ?? active) + 1), {
    signal,
  });
  dots.forEach((dot, index) =>
    dot.addEventListener("click", () => goTo(index), { signal }),
  );
  track.addEventListener("scroll", onScroll, { signal, passive: true });
  track.addEventListener(
    "pointerdown",
    () => {
      destination = null;
    },
    { signal, passive: true },
  );
  track.addEventListener(
    "wheel",
    () => {
      destination = null;
    },
    { signal, passive: true },
  );
  track.addEventListener(
    "keydown",
    (event) => {
      if (
        event.target !== track ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      )
        return;
      let target: number;
      if (event.key === "ArrowRight")
        target = (destination ?? active) + (isRTL() ? -1 : 1);
      else if (event.key === "ArrowLeft")
        target = (destination ?? active) + (isRTL() ? 1 : -1);
      else if (event.key === "Home") target = 0;
      else if (event.key === "End") target = cards.length - 1;
      else return;
      event.preventDefault();
      goTo(target);
    },
    { signal },
  );

  // Al cambiar de breakpoint conservamos la selección y su alineación.
  const resize = new ResizeObserver(() =>
    goTo(destination ?? Math.max(0, active), false),
  );
  resize.observe(track);
  controls.hidden = false;
  sync();

  return () => {
    abort.abort();
    resize.disconnect();
    cancelAnimationFrame(frame);
    clearTimeout(settleTimer);
  };
}

let cleanups: (() => void)[] = [];
function initFeatures(): void {
  cleanups.forEach((cleanup) => cleanup());
  cleanups = Array.from(
    document.querySelectorAll<HTMLElement>("[data-features]"),
    setupFeatures,
  );
}

initFeatures();
// Compatible también con ClientRouter/View Transitions de Astro.
document.addEventListener("astro:page-load", initFeatures);
document.addEventListener("astro:before-swap", () => {
  cleanups.forEach((cleanup) => cleanup());
  cleanups = [];
});
