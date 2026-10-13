import type { ImageMetadata } from "astro";
import sellers01 from "@assets/illustrations/sellers-01.webp";
import sellers02 from "@assets/illustrations/sellers-02.webp";
import sellers03 from "@assets/illustrations/sellers-03.webp";
import sellers04 from "@assets/illustrations/sellers-04.webp";
import buyers01 from "@assets/illustrations/buyers-01.webp";
import buyers02 from "@assets/illustrations/buyers-02.webp";
import buyers03 from "@assets/illustrations/buyers-03.webp";
import buyers04 from "@assets/illustrations/buyers-04.webp";
import buyers05 from "@assets/illustrations/buyers-05.webp";

export interface Feature {
  id: string;
  title: string;
  image: ImageMetadata;
  icon?: string;
  iconPath: string;
  items: { title: string; description?: string; bullets?: string[] }[];
}
export const sellerFeatures: Feature[] = [
  {
    id: "seller-account",
    title: "Cuenta del proveedor",
    image: sellers01,
    icon: "/icons/supplier-account.svg",
    iconPath: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2",
    items: [
      {
        title: "Personalización",
        description:
          "Opciones para adaptar el espacio de acuerdo a tu imagen de marca.",
      },
      {
        title: "Verificación",
        description: "Muestra tu ISO y tus certificaciones de calidad.",
      },
      {
        title: "Conexión",
        description:
          "Facilita la comunicación entre el cliente y el proveedor mediante mensajes internos y llamadas.",
      },
    ],
  },
  {
    id: "seller-products",
    title: "Gestión de productos",
    image: sellers02,
    icon: "/icons/product-management.svg",
    iconPath: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2",
    items: [
      {
        title: "Exposición",
        description: "Exhibe tus productos en un espacio digital.",
      },
      {
        title: "Edición",
        bullets: [
          "Sube fotos o videos del producto.",
          "Edita los precios y descuentos.",
          "Modifica el stock disponible.",
          "Clasifícalos por modelo, tamaño, entre otras características.",
        ],
      },
    ],
  },
  {
    id: "seller-orders",
    title: "Pedidos y ventas",
    image: sellers03,
    icon: "/icons/orders-sales.svg",
    iconPath: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2",
    items: [
      {
        title: "Monitoreo",
        description:
          "Gestiona y actualiza el estado del pedido dentro de la plataforma desde la validación hasta la entrega del producto.",
      },
      {
        title: "Rendimiento",
        bullets: [
          "Visualiza tus pedidos enviados y los más vendidos.",
          "Accede a tu historial de ventas.",
          "Descarga tus reportes de ventas por día, semana o mes.",
        ],
      },
    ],
  },
  {
    id: "seller-settings",
    title: "Configuración",
    image: sellers04,
    icon: "/icons/settings.svg",
    iconPath: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2",
    items: [
      {
        title: "Preferencias",
        description:
          "Modifica tus datos, activa tu autenticación, entre otros.",
      },
      {
        title: "Notificaciones",
        description:
          "Activa o desactiva notificaciones por correo, mensajes o la propia página web.",
      },
      {
        title: "Idioma",
        description:
          "Elige el idioma de la plataforma y la moneda predeterminada.",
      },
    ],
  },
];

export const buyerFeatures: Feature[] = [
  {
    id: "buyer-catalog",
    title: "Catálogo de productos",
    image: buyers01,
    icon: "/icons/product-catalog.svg",
    iconPath: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2",
    items: [
      {
        title: "Diversidad",
        description: "Dispón de una extensa variedad de marcas y productos.",
      },
      {
        title: "Especificaciones",
        bullets: [
          "Obtén información detallada y técnica de los productos.",
          "Visualiza los precios y el stock del producto.",
          "Elige variaciones del modelo: tamaño, potencia, entre otras.",
        ],
      },
    ],
  },
  {
    id: "buyer-search",
    title: "Búsqueda de productos",
    image: buyers02,
    icon: "/icons/product-search.svg",
    iconPath: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2",
    items: [
      {
        title: "Asistencia",
        description:
          "Busca tus productos de forma sencilla y precisa con nuestro filtro potenciado por IA.",
      },
      {
        title: "Filtración",
        bullets: [
          "Agrega las características y obtén resultados más precisos.",
          "Mejora tu selección de compra mediante nuestro sistema de comparaciones.",
        ],
      },
    ],
  },
  {
    id: "buyer-support",
    title: "Servicio al cliente",
    image: buyers03,
    icon: "/icons/customer-support.svg",
    iconPath: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2",
    items: [
      {
        title: "Contacto",
        description:
          "Facilita la comunicación con el proveedor mediante llamada o mensaje de texto.",
      },
      {
        title: "Consolidación",
        description:
          "Unifica productos de múltiples tiendas en un solo despacho.",
      },
      {
        title: "Asesoramiento",
        description:
          "Recibe asistencia personal o apoyada por IA para tu búsqueda.",
      },
    ],
  },
  {
    id: "buyer-validation",
    title: "Validación del producto",
    image: buyers04,
    icon: "/icons/product-validation.svg",
    iconPath: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2",
    items: [
      {
        title: "Certificaciones",
        description:
          "Visualiza las normativas técnicas de seguridad o calidad.",
      },
      {
        title: "Puntuación",
        description:
          "Califica tu experiencia de compra por medio de estrellas.",
      },
      {
        title: "Reseñas",
        description:
          "Asegura tus compras con las opiniones verificadas de nuestros compradores.",
      },
    ],
  },
  {
    id: "buyer-account",
    title: "Cuenta del cliente",
    image: buyers05,
    icon: "/icons/customer-account.svg",
    iconPath: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2",
    items: [
      {
        title: "Reclamaciones",
        description:
          "Solicita una devolución si el producto no cumple con las especificaciones estipuladas.",
      },
      {
        title: "Favoritos",
        description:
          "Marca tus productos preferidos o colócalos en la lista de deseos.",
      },
      {
        title: "Historial de compras",
        description:
          "Visualiza las facturas o boletas de las compras realizadas.",
      },
    ],
  },
];
