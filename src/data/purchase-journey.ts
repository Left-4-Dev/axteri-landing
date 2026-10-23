export const diagram = {
  width: 1120,
  height: 820,
  radius: 64,
  innerRadius: 51,
};

/*
 * x e y ubican cada hito dentro del SVG.
 * label indica dónde aparece su texto en escritorio.
 */
export const steps = [
  {
    id: "customer",
    title: "Cliente o empresa",
    icon: "customer.svg",
    x: 175,
    y: 110,
    label: "left",
  },
  {
    id: "requirements",
    title: "Lista de requerimientos",
    icon: "requirements.svg",
    x: 410,
    y: 195,
    label: "top",
  },
  {
    id: "search",
    title: "Búsqueda de proveedores",
    icon: "supplier-search.svg",
    x: 640,
    y: 95,
    label: "bottom",
  },
  {
    id: "verification",
    title: "Verificación de proveedores",
    icon: "supplier-verification.svg",
    x: 910,
    y: 160,
    label: "top",
  },
  {
    id: "prices",
    title: "Negociación de precios",
    icon: "price-negotiation.svg",
    x: 1010,
    y: 400,
    label: "bottom",
  },
  {
    id: "contract",
    title: "Contrato de venta",
    icon: "sales-contract.svg",
    x: 765,
    y: 470,
    label: "top",
  },
  {
    id: "payment",
    title: "Trámites de pago",
    icon: "payment.svg",
    x: 540,
    y: 360,
    label: "bottom",
  },
  {
    id: "authenticity",
    title: "Verificación de originalidad del producto",
    icon: "product-authenticity.svg",
    x: 305,
    y: 485,
    label: "top",
  },
  {
    id: "shipping",
    title: "Gestión de envíos",
    icon: "shipping-management.svg",
    x: 75,
    y: 385,
    label: "top",
  },
  {
    id: "loading",
    title: "Carga del producto",
    icon: "product-loading.svg",
    x: 175,
    y: 695,
    label: "bottom",
  },
  {
    id: "transport",
    title: "Transporte del producto",
    icon: "product-transport.svg",
    x: 520,
    y: 630,
    label: "bottom",
  },
  {
    id: "arrival",
    title: "Llegada al almacén u obra",
    icon: "arrival.svg",
    x: 865,
    y: 705,
    label: "right",
  },
];

