# Organización y contratos de mantenimiento

La refactorización conserva el marcado efectivo, los textos, destinos, orden, valores CSS y comportamientos del proyecto original. No introduce un sistema de estado ni nuevas dependencias.

## Recursos

La distinción es por consumo, no por extensión: `src/assets` forma parte del grafo de imports de Astro/Vite; `public` se copia directamente y sirve URLs estables.

| Recurso | Ubicación y uso |
| --- | --- |
| AXTERI | `src/assets/logos/axteri-logo.svg`: `img` del Header y máscara del Footer comparten el original |
| AXTE | `src/assets/logos/axte.svg`: `Image` en Categories y máscara del Footer |
| Logos de partners | `src/assets/logos/partners`, importados desde `data/partners.ts` |
| Fotos de categorías y partner | `src/assets/photos/categories` y `photos/partners`, importadas manteniendo `Image` |
| Ilustraciones de features | `src/assets/illustrations/features`, importadas en datos; se conserva el mecanismo de imagen actual |
| Ilustraciones únicas | `src/assets/illustrations`: Axter, audience y partnership |
| Play y flechas de partners | `src/assets/icons`, imports de URL |
| Iconos de About, Services y Features | `public/icons/{about,services,features}`, URLs explícitas en marcado/datos, incluidas máscaras CSS |
| Recorrido de compra | `public/icons/journey`, URL dinámica `/icons/journey/${step.icon}` |
| Tema | `public/icons/ui`, URLs de sun/moon utilizadas por el control |
| Fondo del hero | `public/images/backgrounds/hero-mesh-background.png`, URL CSS; conserva capa, opacidad y mezcla |
| Fuentes | `public/fonts`, archivos, subconjuntos y licencias originales; preload y `@font-face` conservados |
| Favicons | `public/favicon.svg` declarado y `.ico` conservado por posible consumo convencional |

Se trasladaron 60 archivos conservando sus bytes. El inventario previo contiene 177 recursos: todos se conservaron, incluyendo fuentes y licencias. No se han reexportado SVG, alterado sus IDs ni recomprimido originales. Los derivados de `Image` generados por `pnpm build` siguen siendo archivos de salida de Astro, no reemplazos de los originales.

Las seis ilustraciones WebP de `illustrations/services` no tienen consumidores identificados en el código revisado; Services utiliza actualmente SVG públicos. Se conservan como alternativas originales de uso no confirmado. Una búsqueda literal negativa no se considera prueba suficiente para borrar un recurso. Se revisaron también URLs construidas desde datos, máscaras, fondos, scripts e identificadores SVG.

## Componentes, datos e interacción

- `Action.astro`: enlace con `href` o botón de acción, sin contenedor adicional. Su unión de props impide `disabled` en enlaces y conserva `type`, atributos nativos y `data-*` en botones. Los enlaces y botones mantienen sus semánticas.
- `actions.css`: variantes originales de los CTAs. `.action.action--category` y `.action.action--partnership` mantienen la especificidad de los selectores locales compilados de Astro (dos clases). Se reenvían los atributos de alcance del padre. Márgenes, alineación dentro del grid y otras decisiones de distribución siguen en cada sección.
- `SectionHeading`, `FeatureCard` y `MetricCard`: componentes existentes conservados. No se fragmentan en componentes los detalles sin repetición útil.
- `data/categories.ts`: contenido y fotos; `data/partners.ts`: logos y paneles; `data/purchase-journey.ts`: pasos y geometría; `data/footer.ts`: universos y redes. La geometría del recorrido es configuración exclusiva de esa ilustración, no tokens globales.
- `scripts/categories.ts`: extracción de la lógica existente de expansión exclusiva, fijación de filas, redistribución, animación FLIP y Escape. No cambia sus cálculos ni orden de ejecución.
- `scripts/features.ts`: conserva el scroll nativo LTR/RTL, teclado, selección destacada, imagen asociada y respuesta a redimensionamiento.
- `scripts/navigation.ts`, `theme.ts` y `partners.ts`: conservan menú, persistencia del tema y navegación de partners. Los controles específicos no se fuerzan a usar `Action`.
- `animations/hero.ts`: conserva la secuencia GSAP, `matchMedia` para movimiento reducido y limpieza en `pagehide`. `animations/gsap.ts` registra ScrollTrigger; el original no crea instancias de ScrollTrigger. Tampoco existe lógica de revelado asociada a `data-reveal`: no se añadieron animaciones durante esta tarea.

## Tokens

Se conservan exactamente los valores originales y los tokens anteriores. Los nuevos nombres representan decisiones compartidas:

| Token | Valor |
| --- | --- |
| `--color-white` | `#fff` fijo |
| `--color-ink` | `#323643` |
| `--color-accent-fixed` | `#5145cf`, sin cambio en oscuro |
| `--color-violet` | `#7770ff` |
| `--color-brand-end` | `#9d98fc` |
| `--color-relief-surface` | `#f6f6f6` |
| `--gradient-header-dark` | `linear-gradient(115deg, #253b66, #36325d)` |
| `--font-weight-semibold` | `600` |
| `--font-weight-strong` | `800` |
| `--radius-card-lg` | `1.25rem` |
| `--radius-control` | `0.75rem` |

Se reutilizan los tokens existentes de espacios, radio pill, colores y transición únicamente cuando los valores coinciden. `--color-accent` sigue cambiando a `#b8b5ff` en oscuro; `--color-accent-fixed` conserva el violeta de controles que antes usaban el literal. No son intercambiables.

Services centraliza su sombra repetida en la variable local `--service-shadow: 5px 7px 10px rgb(48 52 65 / 22%)`. Sombras exclusivas, coordenadas, ajustes ópticos y stops de ilustraciones permanecen locales. Los modos de fusión y opacidades siguen en sus capas originales; sustituir un color por un token no traslada el efecto a otro elemento.

## Responsive: escala y excepciones

La escala compartida desktop-first es sm `40rem`, md `48rem`, lg `64rem`, xl `80rem`, 2xl `96rem`. No se usan variables CSS en media queries. Las equivalencias en píxeles siguientes suponen la base habitual de 16px.

| Componente | Fronteras conservadas |
| --- | --- |
| Header | `width < 64rem`, `width < 40rem`; JavaScript usa exactamente `(width < 64rem)` |
| Hero | `max-width: 40rem` (incluye 640px) |
| About | `max-width: 42rem` (672px), excepción heredada |
| Services | `max-width: 60rem` y `36rem` (960px y 576px), excepciones heredadas |
| Assistant | `min-width: 40rem` y `64rem`; construcción mobile-first heredada |
| PurchaseJourney | `min-width: 64rem`; construcción mobile-first heredada |
| Audience | `max-width: 64rem` y `38rem` (608px), segunda frontera heredada |
| Features | `max-width: 64rem`, `max-width: 40rem` |
| Benefits | `width < 64rem`, `< 48rem`, `< 40rem` |
| Categories, Partners, Partnership, Footer | `width < 64rem`, `< 40rem` |

No se convierten indiscriminadamente `max-width` a `<`: cambiaría el comportamiento justo en la frontera. Tampoco se fuerza la escala compartida sobre las excepciones heredadas, porque desplazaría el diseño. Los breakpoints futuros siguen la escala acordada; una migración de los heredados necesita una tarea visual explícita.
