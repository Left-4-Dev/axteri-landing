export const navigationLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Categorías", href: "#categorias" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Eventos", href: "#eventos" },
  { label: "Contacto", href: "#contacto" },
];
export const contact = { phone: "+51 934 923 404", href: "tel:+51934923404" };
const configuredUrl = (value: string | undefined): string | undefined => {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : undefined;
  } catch {
    return undefined;
  }
};
export const marketplaceUrl = configuredUrl(
  import.meta.env.PUBLIC_MARKETPLACE_URL,
);
export const registrationUrl = configuredUrl(
  import.meta.env.PUBLIC_PARTNER_REGISTRATION_URL,
);
