const buttons = Array.from(
  document.querySelectorAll<HTMLButtonElement>("[data-partner-index]"),
);
const panels = Array.from(
  document.querySelectorAll<HTMLElement>("[data-partner-panel]"),
);
const partnerStatus = document.querySelector<HTMLElement>(
  "[data-partner-status]",
);
let selected = 2;
function selectPartner(index: number) {
  selected = (index + buttons.length) % buttons.length;
  buttons.forEach((button, i) =>
    button.setAttribute("aria-pressed", String(i === selected)),
  );
  panels.forEach((panel, i) => {
    panel.hidden = i !== selected;
  });
  if (partnerStatus)
    partnerStatus.textContent = `Marca destacada: ${buttons[selected]?.querySelector("img")?.alt ?? ""}`;
  const panel = panels[selected];
  if (panel && !matchMedia("(prefers-reduced-motion: reduce)").matches)
    panel.animate([{ opacity: 0.35 }, { opacity: 1 }], {
      duration: 250,
      easing: "ease-out",
    });
}
if (buttons.length) {
  buttons.forEach((button, index) => {
    button.disabled = false;
    button.addEventListener("click", () => selectPartner(index));
  });
  for (const [selector, delta] of [
    ["[data-partner-prev]", -1],
    ["[data-partner-next]", 1],
  ] as const) {
    const button = document.querySelector<HTMLButtonElement>(selector);
    if (button) {
      button.hidden = false;
      button.addEventListener("click", () => selectPartner(selected + delta));
    }
  }
}

export {};
