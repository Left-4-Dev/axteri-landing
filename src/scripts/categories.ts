function setupCategories(root: HTMLElement): () => void {
  const grid = root.querySelector<HTMLElement>("[data-category-grid]");
  if (!grid) return () => {};

  const cards = Array.from(grid.querySelectorAll<HTMLElement>("[data-category-card]"));
  const abort = new AbortController();
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const animations = new Map<HTMLElement, Animation>();
  let active = cards.find((card) => card.classList.contains("categories__card--expanded")) ?? null;

  const columnCount = () => getComputedStyle(grid).gridTemplateColumns.split(" ").length;
  let columns = columnCount();

  function cellOf(card: HTMLElement): { row: number; column: number } {
    const css = getComputedStyle(grid!);
    const width = parseFloat(css.gridTemplateColumns.split(" ")[0] ?? "0");
    const rowHeight = parseFloat(css.gridAutoRows);
    return {
      column: Math.round(card.offsetLeft / (width + parseFloat(css.columnGap))) + 1,
      row: Math.round(card.offsetTop / (rowHeight + parseFloat(css.rowGap))) + 1,
    };
  }

  function clearPosition(card: HTMLElement): void {
    card.style.removeProperty("grid-column");
    card.style.removeProperty("grid-row");
  }

  function pin(
    card: HTMLElement,
    cell: { row: number; column: number },
  ): void {
    // La tarjeta expandida ocupa una celda adicional.
    const totalRows = Math.ceil((cards.length + 1) / columns);

    // Limita la fila inicial para que la expansión no añada otra fila.
    const lastStartRow = Math.max(1, totalRows - 1);
    const startRow = Math.min(cell.row, lastStartRow);

    card.style.gridColumn = String(cell.column);
    card.style.gridRow = `${startRow} / span 2`;
  }

  function stopAnimations(): void {
    animations.forEach((animation) => animation.cancel());
    animations.clear();
  }

  function toggle(selected: HTMLElement): void {
    // offsetTop/Left son posiciones de layout: una animación en curso no
    // puede hacer que seleccionemos una celda distinta por accidente.
    const cell = columns > 1 ? cellOf(selected) : null;
    const before = new Map(cards.map((card) => [card, card.getBoundingClientRect()]));
    const previousTop = selected.getBoundingClientRect().top;
    stopAnimations();
    const next = selected === active ? null : selected;

    cards.forEach((card) => {
      const expanded = card === next;
      const button = card.querySelector<HTMLButtonElement>("[data-category-toggle]");
      const panel = card.querySelector<HTMLElement>("[data-category-panel]");
      clearPosition(card);
      card.classList.toggle("categories__card--expanded", expanded);
      if (button) {
        button.setAttribute("aria-expanded", String(expanded));
        button.setAttribute("aria-label", `${expanded ? "Cerrar" : "Ver"} detalles de Axte-${button.dataset.categoryName}`);
      }
      if (panel) panel.hidden = !expanded;
    });

    if (next && cell) pin(next, cell);
    active = next;

    // En una columna, cerrar una tarjeta anterior desplaza la seleccionada.
    // Compensamos ese cambio para mantener su botón en el mismo lugar visible.
    if (columns === 1) {
      const delta = selected.getBoundingClientRect().top - previousTop;
      if (Math.abs(delta) > 1) window.scrollBy({ top: delta, behavior: "instant" });
    }

    if (reducedMotion.matches) return;
    cards.forEach((card) => {
      const first = before.get(card);
      const last = card.getBoundingClientRect();
      if (!first || !last.width || !last.height) return;
      const dx = first.left - last.left;
      const dy = first.top - last.top;
      const sx = first.width / last.width;
      const sy = first.height / last.height;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(sx - 1) < 0.01 && Math.abs(sy - 1) < 0.01) return;
      const animation = card.animate(
        [
          { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
          { transform: "none" },
        ],
        { duration: 320, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" },
      );
      animations.set(card, animation);
      animation.onfinish = () => {
        if (animations.get(card) === animation) animations.delete(card);
      };
    });
  }

  grid.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest<HTMLButtonElement>("[data-category-toggle]");
    const card = button?.closest<HTMLElement>("[data-category-card]");
    if (card && cards.includes(card)) toggle(card);
  }, { signal: abort.signal });

  // Los botones nativos ya admiten Enter y Espacio. Escape cierra el panel.
  grid.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !active) return;
    event.preventDefault();
    const selected = active;
    selected.querySelector<HTMLButtonElement>("[data-category-toggle]")?.focus({ preventScroll: true });
    toggle(selected);
  }, { signal: abort.signal });

  const onMotionChange = () => { if (reducedMotion.matches) stopAnimations(); };
  reducedMotion.addEventListener("change", onMotionChange, { signal: abort.signal });

  const resize = new ResizeObserver(() => {
    const nextColumns = columnCount();
    if (nextColumns === columns) return;
    stopAnimations();
    columns = nextColumns;
    cards.forEach(clearPosition);
    // Recalcular la celda evita columnas implícitas al pasar de 3 a 2 o 1.
    if (active && columns > 1) pin(active, cellOf(active));
  });
  resize.observe(grid);

  return () => {
    abort.abort();
    resize.disconnect();
    stopAnimations();
  };
}

let dispose: (() => void)[] = [];
function initCategories(): void {
  dispose.forEach((cleanup) => cleanup());
  dispose = Array.from(document.querySelectorAll<HTMLElement>("[data-categories]"), setupCategories);
}
initCategories();
document.addEventListener("astro:page-load", initCategories);
document.addEventListener("astro:before-swap", () => {
  dispose.forEach((cleanup) => cleanup());
  dispose = [];
});

export {};
