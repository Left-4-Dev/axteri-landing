const menu = document.querySelector<HTMLButtonElement>(".header__menu");
const nav = document.querySelector<HTMLElement>("#main-navigation");
if (menu && nav) {
  const mobile = matchMedia("(width < 64rem)");
  nav.classList.add("header__nav--enhanced");
  const close = () => {
    menu.setAttribute("aria-expanded", "false");
    nav.classList.remove("header__nav--open");
  };
  const sync = () => {
    menu.hidden = !mobile.matches;
    close();
  };
  sync();
  mobile.addEventListener("change", sync);
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("header__nav--open", open);
  });
  nav.addEventListener("click", (event) => {
    if ((event.target as HTMLElement).closest("a")) close();
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menu.getAttribute("aria-expanded") === "true"
    ) {
      close();
      menu.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (
      event.target instanceof Node &&
      !menu.contains(event.target) &&
      !nav.contains(event.target)
    )
      close();
  });
}

export {};
