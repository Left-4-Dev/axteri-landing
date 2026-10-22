import industry from "@assets/photos/categories/axte-indux.webp";
import agro from "@assets/photos/categories/axte-agro.webp";
import arqui from "@assets/photos/categories/axte-arqui.webp";
import civil from "@assets/photos/categories/axte-civil.webp";
import medic from "@assets/photos/categories/axte-medic.webp";
import { marketplaceUrl, contact } from "@data/navigation";

export const categories = [
  {
    id: "indux",
    name: "INDUX",
    image: industry,
    upcoming: false,
    description:
      "En Axte-Indux encuentras todos los componentes industriales que necesites: sensores, motores, tableros, maquinarias y mucho más.",
    href: marketplaceUrl ?? contact.href,
    action: marketplaceUrl ? "Explorar" : "Consultar Indux",
  },
  {
    id: "agro",
    name: "AGRO",
    image: agro,
    upcoming: false,
    description:
      "Conoce Axte-Agro. Contáctanos para consultar la disponibilidad de productos para tus proyectos agrícolas.",
    href: contact.href,
    action: "Consultar Agro",
  },
  {
    id: "arqui",
    name: "ARQUI",
    image: arqui,
    upcoming: true,
    description:
      "Estamos preparando Axte-Arqui. Contáctanos para conocer más sobre esta próxima categoría de arquitectura.",
    href: contact.href,
    action: "Consultar Arqui",
  },
  {
    id: "civil",
    name: "CIVIL",
    image: civil,
    upcoming: true,
    description:
      "Estamos preparando Axte-Civil. Contáctanos para conocer más sobre esta próxima categoría de construcción.",
    href: contact.href,
    action: "Consultar Civil",
  },
  {
    id: "medic",
    name: "MEDIC",
    image: medic,
    upcoming: true,
    description:
      "Estamos preparando Axte-Medic. Contáctanos para conocer más sobre esta próxima categoría de medicina.",
    href: contact.href,
    action: "Consultar Medic",
  },
];
