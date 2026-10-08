const toggle = document.querySelector<HTMLButtonElement>("[data-theme-toggle]");
const preference = matchMedia("(prefers-color-scheme: dark)");
function applyTheme(dark: boolean) {
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  toggle?.setAttribute("aria-pressed", String(dark));
}
if (toggle) {
  toggle.hidden = false;
  applyTheme(document.documentElement.dataset.theme === "dark");
  toggle.addEventListener("click", () => {
    const dark = document.documentElement.dataset.theme !== "dark";
    applyTheme(dark);
    try {
      localStorage.setItem("axteri-theme", dark ? "dark" : "light");
    } catch {}
  });
  preference.addEventListener("change", (event) => {
    try {
      if (!localStorage.getItem("axteri-theme")) applyTheme(event.matches);
    } catch {
      applyTheme(event.matches);
    }
  });
}

export {};
