# Axteri — Landing Page

Landing page oficial del marketplace B2B de **Axteri**, desarrollada para presentar su ecosistema de soluciones digitales e industriales (**Axte-Indux**, **Axte-Agro**, **Axte-Arqui**, **Axte-Civil** y **Axte-Medic**) y conectar a fabricantes, importadores y distribuidores con compradores empresariales.

El repositorio contiene una aplicación estática de una sola página (`src/pages/index.astro`) que integra navegación adaptable, cambio de tema claro/oscuro, presentación corporativa, servicios, asistente virtual (**Axter**), recorrido interactivo de compra, funciones para vendedores y compradores, indicadores de beneficios, catálogo de categorías expandibles, vitrina de aliados comerciales, sistema de animaciones con **GSAP + ScrollTrigger**, ilustraciones SVG animadas en loop continuo y desplazamiento vertical suavizado con **Lenis**.

---

## Stack tecnológico

- **[Astro](https://astro.build/) (`^7.3.8`)**: Framework principal con generación estática (`output: "static"`) y arquitectura basada en componentes `.astro`.
- **[TypeScript](https://www.typescriptlang.org/)**: Tipado estricto extendiendo `astro/tsconfigs/strictest` con alias de importación configurados en `tsconfig.json`.
- **[GSAP](https://gsap.com/) (`^3.15.0`)**: Motor de animación junto con los plugins oficiales **`ScrollTrigger`** y **`DrawSVGPlugin`**.
- **[Lenis](https://lenis.darkroom.engineering/) (`^1.3.27`)**: Sistema de smooth scrolling vertical sincronizado con el ticker de GSAP y `ScrollTrigger`.
- **CSS nativo (BEM + Design Tokens)**: Estilos encapsulados por componente y hojas globales con variables CSS para paleta, tipografía, espaciado, superficies y tema oscuro.
- **[pnpm](https://pnpm.io/)**: Gestor de paquetes del proyecto.

---

## Requisitos previos

- **Node.js**: `>= 22.12.0` (definido en `package.json` bajo `engines.node`).
- **pnpm**: v9 o superior (compatible con `lockfileVersion: '9.0'`).

---

## Instalación y ejecución

1. **Clonar el repositorio:**

   ```sh
   git clone https://github.com/Left-4-Dev/axteri-landing.git
   cd axteri-landing
   ```

2. **Instalar dependencias respetando el lockfile:**

   ```sh
   pnpm install --frozen-lockfile
   ```

3. **Iniciar el servidor de desarrollo (modo en segundo plano recomendado):**

   ```sh
   pnpm astro dev --background
   pnpm astro dev status
   pnpm astro dev logs
   pnpm astro dev stop
   ```

   También puedes ejecutar el servidor en primer plano con `pnpm dev`.

4. **Generar la compilación de producción y previsualizarla localmente:**

   ```sh
   pnpm build
   pnpm preview
   ```

> **Nota para Windows PowerShell:** Si la política de ejecución del sistema bloquea `pnpm.ps1`, utiliza `pnpm.cmd`.
>
> **Nota sobre `.npmrc`:** El archivo `.npmrc` expone mediante `public-hoist-pattern` las dependencias transitivas bloqueadas `cookie` y `sharp` para que el prerender de Astro 7 las resuelva dentro del proyecto sin depender de directorios superiores.

### Variables de entorno opcionales

En `src/data/navigation.ts` se validan dos variables públicas opcionales (únicamente se aceptan URLs con protocolo `https:`):

- `PUBLIC_MARKETPLACE_URL`: URL de destino para los accesos al marketplace (si no se define, utiliza el enlace de contacto telefónico como respaldo).
- `PUBLIC_PARTNER_REGISTRATION_URL`: URL del formulario de registro para aliados/proveedores en la sección `Partnership`.

---

## Estructura del proyecto

```text
public/
  fonts/                      # Fuentes locales (Exo, Josefin Sans, Noto Sans SC) y licencias OFL
  icons/                      # Catálogo de íconos SVG servidos por URL directa
    about/ features/ journey/ services/ ui/
  images/
    backgrounds/              # Textura de fondo del Hero (hero-mesh-background.png)
    brand/
  favicon.svg
  favicon.ico
src/
  assets/                     # Recursos importados y procesados por Astro/Vite
    icons/                    # Íconos importados en componentes (play, flechas de partners)
      partners/
    illustrations/            # Ilustraciones principales (axter.svg, audience.svg, partnership.webp)
      features/               # Vistas WebP para los carruseles de vendedores y compradores
      services/               # Ilustraciones WebP alternativas conservadas
    logos/                    # Logos maestros compartidos (axteri-logo.svg, axte.svg) y de partners
      partners/
    photos/                   # Fotografías WebP de categorías y casos de aliados
      categories/
      partners/
  components/
    layout/                   # Header.astro y Footer.astro
    sections/                 # Secciones de la landing (Hero, About, Services, Assistant,
                              # PurchaseJourney, Audience, Features, Benefits, Categories,
                              # Partners, Partnership)
    ui/                       # Componentes reutilizables (Action, SectionHeading,
                              # FeatureCard, MetricCard)
  data/                       # Datos estructurados y configuración de secciones
                              # (navigation, benefits, categories, features, footer,
                              # partners, purchase-journey)
  layouts/
    BaseLayout.astro          # Documento HTML, metadatos SEO/OpenGraph, preload de fuentes,
                              # inicialización de tema y carga de scripts globales
  pages/
    index.astro               # Composición principal de la landing page
  scripts/                    # Interactividad del cliente y controladores de UI
    animations/               # Sistema de animaciones GSAP, ScrollTrigger y loops SVG
    categories.ts             # Expansión exclusiva de categorías y transición FLIP
    features.ts               # Carruseles horizontales LTR/RTL, controles y teclado
    navigation.ts             # Menú móvil, foco accesible y sincronización por breakpoint
    partners.ts               # Selector interactivo de aliados comerciales
    smooth-scroll.ts          # Integración de Lenis con GSAP, ScrollTrigger y anclas
    theme.ts                  # Conmutación y persistencia de tema claro/oscuro
  styles/
    components/
      actions.css             # Variantes visuales del componente Action (.button, .action--*)
    fonts.css                 # Declaraciones @font-face
    global.css                # Estilos globales, contenedor base, skip-link y utilidades A11y
    reset.css                 # Reset CSS y reglas base de integración para Lenis
    tokens.css                # Design tokens (colores, gradientes, tipografía, espacios, radios)
docs/
  architecture.md             # Notas históricas de arquitectura y contratos de recursos
  validation.md               # Registro de validaciones de refactorización previa
```

---

## Arquitectura

### Componentización con Astro y TypeScript
- La página se ensambla en `src/pages/index.astro` sobre `BaseLayout.astro`.
- Los componentes presentacionales repetidos se abstraen en `src/components/ui/`:
  - `Action.astro`: Renderiza un `<a>` cuando recibe `href` o un `<button>` para acciones interactivas, soportando las variantes `primary`, `light`, `outline`, `category` y `partnership` definidas en `src/styles/components/actions.css`.
  - `SectionHeading.astro`, `FeatureCard.astro` y `MetricCard.astro`: Encapsulan cabeceras de sección, tarjetas de funcionalidades y tarjetas de indicadores porcentuales.
- Los alias configurados en `tsconfig.json` son `@assets/*`, `@components/*`, `@data/*`, `@layouts/*`, `@scripts/*` y `@styles/*`. Los archivos dentro de `public/` se referencian siempre con rutas absolutas desde `/` (sin prefijo `/public`).

### Metodología BEM y Design Tokens
- Los estilos emplean nomenclatura **BEM** (`.bloque__elemento--modificador`) dentro de bloques `<style>` de cada componente Astro y en `src/styles/`.
- `src/styles/tokens.css` separa explícitamente la **paleta fija** (`--color-white`, `--color-ink`, `--color-accent-fixed`, `--color-violet`, `--color-brand-end`, `--color-relief-surface`) de los **tokens adaptables al tema** (`--color-background`, `--color-surface`, `--color-text`, `--color-muted`, `--color-border`, `--color-accent`, `--shadow-card`), los cuales se redefinen bajo `:root[data-theme="dark"]`.

### Estrategia Responsive Desktop-First
El proyecto utiliza una arquitectura **desktop-first**: los estilos base representan el diseño de escritorio y se adaptan progresivamente a pantallas menores mediante media queries descendentes (`@media (width < ...)`).

La escala de breakpoints de referencia (con base `16px`) documentada en `src/styles/tokens.css` es:

| Token de referencia | Medida `rem` | Equivalencia `px` |
| :--- | :--- | :--- |
| `2xl` | `96rem` | `1536px` |
| `xl` | `80rem` | `1280px` |
| `lg` | `64rem` | `1024px` |
| `md` | `48rem` | `768px` |
| `sm` | `40rem` | `640px` |

> Como excepción puntual de maquetación, `Assistant.astro` combina reglas descendentes con dos bloques `@media (min-width: 40rem)` y `@media (min-width: 64rem)` para estructurar la cuadrícula de tres columnas alrededor de la ilustración central.

### Gestión de recursos (`src/assets` vs `public`)
- **`src/assets/`**: Recursos importados desde componentes `.astro` o módulos de `src/data/` (optimizados mediante `<Image>` de `astro:assets`, componentes SVG inline o imports `?url`). Los logotipos `axteri-logo.svg` y `axte.svg` son únicos y se comparten entre secciones.
- **`public/`**: Recursos que requieren URLs estáticas directas (fuentes WOFF2 y licencias, favicons, fondo del Hero e íconos consumidos mediante rutas dinámicas o máscaras CSS `mask-image`).

---

## Animaciones e interactividad

### Sistema GSAP y ScrollTrigger (`src/scripts/animations/`)
- **`gsap.ts`**: Centraliza el registro de `ScrollTrigger` y `DrawSVGPlugin` y activa `ScrollTrigger.config({ ignoreMobileResize: true })` para evitar saltos en navegadores móviles cuando cambia la altura de la barra de direcciones.
- **`motion.ts`**: Define el lenguaje de movimiento compartido (`ease`, `duration`, `start`, `distance`) y expone tres utilidades principales:
  - `createMotion(root, setup, queries)`: Envuelve `gsap.matchMedia()` acotando selectores a `root`, condicionando la ejecución a `(prefers-reduced-motion: no-preference)` y evitando que una animación de entrada ya reproducida (`markPlayed`) se repita al redimensionar la ventana.
  - `bindHover(items, pick, over, out)`: Aplica micro-interacciones de puntero exclusivamente para ratón (`pointerType === "mouse"`) y limpia propiedades inline al finalizar.
  - `bindLoop(trigger, build)`: Controla timelines de animación continua, pausándolos automáticamente cuando el elemento sale del viewport (`ScrollTrigger`) o cuando la pestaña del navegador pasa a segundo plano (`visibilitychange`).
- **Animaciones de entrada y trazado SVG**: Cada sección cuenta con su propio módulo en `src/scripts/animations/` (`header.ts`, `hero.ts`, `about.ts`, `services.ts`, `assistant.ts`, `journey.ts`, `audience.ts`, `features.ts`, `benefits.ts`, `metrics.ts`, `partners.ts`, `partnership.ts`, `footer.ts`, más `reveal.ts` para `SectionHeading`). Los conectores de `Assistant` y `PurchaseJourney` se dibujan progresivamente con `DrawSVGPlugin`, y `metrics.ts` interpola los contadores porcentuales al entrar en pantalla.

### Ilustraciones SVG con loops continuos
Las escenas e íconos vectoriales complejos se renderizan inline con identificadores e atributos `data-*` aislados para animar sus partes internas en bucle continuo mediante `bindLoop`:
- **`Audience` (`audience.svg`)**: Escena coordinada de comercio electrónico (compradora interactuando con el teléfono, ondas digitales del portal, mascota repartidora, paquete isométrico, carrito, check de confirmación y bolsas de compra).
- **`Assistant` (`axter.svg`)**: Modulación continua de las barras de voz y respiración sutil del emblema de Axter.
- **`Services` (`marketplace.svg` inline)**: Flotación del toldo comercial, pulso de ubicación y tarjetas de interfaz del teléfono.
- **`About` (`target.svg` y `eye.svg` inline)**: Oscilación de la flecha y anillos de objetivo en Misión; parpadeo natural e iris con destello en Visión.

### Smooth Scrolling con Lenis (`src/scripts/smooth-scroll.ts`)
- Se instancia una única instancia global de `Lenis` (`lerp: 0.11`, `wheelMultiplier: 1`, `smoothWheel: true`, `syncTouch: false`, `gestureOrientation: "vertical"`, `autoRaf: false`).
- **Sincronización con GSAP**: Cada evento `scroll` de Lenis invoca `ScrollTrigger.update()`, y `gsap.ticker` alimenta `lenis.raf(time * 1000)` con `gsap.ticker.lagSmoothing(0)`, unificando todo el renderizado en un único loop `requestAnimationFrame`.
- **Navegación por anclas e historial**: Intercepta enlaces internos `a[href^="#"]` (`#inicio`, `#categorias`, `#nosotros`, `#eventos`, `#contacto`, `#aliados`, `#contenido`), coordina el cierre previo del menú móvil, respeta `scroll-padding-top: 6rem`, transfiere el foco accesible al destino y soporta navegación con los botones Atrás/Adelante (`popstate`).
- **Recalibración automática**: Un `ResizeObserver` sobre `document.documentElement` ejecuta `lenis.resize()` y `ScrollTrigger.refresh()` (con *debounce*) cuando cambia la altura del documento (por ejemplo, al expandir tarjetas en `Categories`).
- **Compatibilidad con el carrusel horizontal (`Features`)**: Las pistas `.features__cards` incluyen `data-lenis-prevent-horizontal`, preservando intactos el scroll horizontal nativo LTR/RTL, `scroll-snap-type: x mandatory`, el arrastre táctil y la navegación por teclado, sin bloquear el scroll vertical con rueda del mouse sobre las tarjetas.

### Accesibilidad y `prefers-reduced-motion`
- Cuando el sistema operativo o navegador reporta `(prefers-reduced-motion: reduce)`:
  - `smooth-scroll.ts` no instancia Lenis (o la destruye dinámicamente si cambia la preferencia en caliente), delegando el desplazamiento al scroll nativo inmediato.
  - `createMotion` omite las animaciones de entrada y los loops internos de SVG, dejando todos los elementos visibles en su posición final de diseño.
  - Los scripts interactivos (`categories.ts`, `features.ts`, `partners.ts`) y las hojas CSS desactivan las transiciones de movimiento.

---

## Desarrollo y mantenimiento

- **Contenido y datos**: Antes de editar texto o listas en un componente `.astro`, verifica si provienen de `src/data/`. Mantén allí los datos estructurados y las importaciones de imágenes asociadas.
- **Contratos DOM (`data-*` y `aria-*`)**: Los scripts en `src/scripts/` dependen de atributos como `data-theme-toggle`, `data-feature-track`, `data-feature-card`, `data-category-card`, `data-partner-tab`, `data-audience`, `data-about` y `data-service`. No los elimines ni renombres al ajustar el marcado.
- **Verificación de cambios**: El script de validación incluido en `package.json` es `pnpm build`, el cual valida la compilación de TypeScript/Astro, la resolución de imports y la generación estática completa en `dist/`.

---

## Git

- **Ramas principales**:
  - `main`: Rama de producción.
  - `dev`: Rama de integración y desarrollo activo.
- **Convención de mensajes**: El historial del repositorio sigue el formato **Conventional Commits** (`feat:`, `fix:`, `refactor:`, `docs:`, con alcance opcional como `feat(scroll):` o `feat(animations):`).
