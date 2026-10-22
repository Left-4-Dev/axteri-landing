# Axteri

Landing del marketplace B2B de Axteri, construida con Astro, TypeScript, CSS BEM y GSAP. Incluye tema claro/oscuro, menú responsive, recorridos horizontales para vendedores y compradores, categorías expandibles y navegación de partners.

## Desarrollo

Requisitos: Node.js >= 22.12.0 y pnpm. El lockfile conserva las versiones del proyecto.

```sh
pnpm install --frozen-lockfile
pnpm dev --background
pnpm astro dev status
pnpm astro dev logs
pnpm astro dev stop
pnpm build
pnpm preview
```

En PowerShell, utiliza `pnpm.cmd` si la política de ejecución bloquea `pnpm.ps1`. El servidor de desarrollo se gestiona en segundo plano, según `AGENTS.md`. `build` genera `dist/`; `preview` permite revisar esa compilación localmente.

`.npmrc` expone únicamente las dependencias transitivas bloqueadas `cookie` y `sharp`: el prerender de Astro necesita resolverlas desde el proyecto. Evita que Node termine resolviendo una instalación ajena en un directorio superior. No añade dependencias ni cambia sus versiones.

## Organización

```text
public/
  fonts/                    # Exo, Josefin Sans y Noto Sans SC, con licencias
  icons/
    about/ features/ journey/ services/ ui/
  images/backgrounds/       # Fondo CSS del hero
  favicon.svg
  favicon.ico
src/
  assets/
    icons/                  # Play y flechas de partners importados
      partners/
    illustrations/          # Axter, audience y partnership
      features/
      services/             # Alternativas originales conservadas
    logos/                  # AXTERI y AXTE compartidos
      partners/
    photos/
      categories/
      partners/
  components/
    layout/                 # Header y Footer
    sections/               # Secciones de la landing
    ui/                     # Action, SectionHeading, FeatureCard, MetricCard
  data/                     # Contenido y configuración de secciones
  layouts/                  # Documento, metadatos y tema inicial
  pages/                    # Composición de la página
  scripts/                  # Menú, tema, features, categorías y partners
    animations/             # GSAP y animación de entrada del hero
  styles/
    components/actions.css
    fonts.css
    global.css
    reset.css
    tokens.css
docs/
  architecture.md
  validation.md
```

Se mantienen los alias `@assets`, `@components`, `@data`, `@layouts`, `@scripts` y `@styles`. Los recursos de `public` se referencian por URL desde `/`, sin prefijo `/public` ni alias de importación.

`categories.ts`, `partners.ts`, `purchase-journey.ts` y `footer.ts` separan contenido y configuración de su marcado. Las listas pequeñas exclusivas de una sección permanecen junto a ella. `scripts/categories.ts` contiene la interacción de expansión y redistribución; sus selectores `data-*` son el contrato con el componente.

## Assets y estilos

- Usa `src/assets` para recursos que importan los componentes o los datos. Astro/Vite resuelve su URL y puede generar derivados cuando se usa `Image`.
- Usa `public` cuando se necesita una URL directa y estable: fuentes y licencias, favicons, fondo CSS y catálogos de iconos construidos mediante datos, máscaras o interpolaciones.
- Conserva el mecanismo existente (`Image`, `img`, SVG o máscara) al mover archivos. Una máscara puede recibir tanto una URL pública como la URL de un recurso importado.
- Comparte los originales `logos/axteri-logo.svg` y `logos/axte.svg`. No dupliques logos por sección.
- Agrupa por función y añade una carpeta de sección cuando el volumen lo justifique. No conviertas ni recomprimas los originales para reorganizarlos.

Los tokens compartidos están en `styles/tokens.css`. Se distinguen colores fijos de roles que cambian con el tema. Las coordenadas de ilustraciones y las sombras exclusivas permanecen locales. La escala desktop-first es `40 / 48 / 64 / 80 / 96rem`; se conservan las excepciones y las fronteras exactas del diseño original, documentadas en [arquitectura](docs/architecture.md).

## Acciones reutilizables

`Action` genera un solo elemento: un enlace cuando recibe `href`, o un botón para acciones. Mantiene atributos nativos, `aria-*`, `data-*`, `class` y `class:list`, incluidos los atributos de alcance de Astro. Las dimensiones y estados siguen las variantes originales; el componente padre conserva el posicionamiento.

```astro
---
import Action from "@components/ui/Action.astro";
---
<Action href="#categorias" variant="primary">Explorar categorías</Action>
<Action href="#contacto" variant="light" class="section__cta">Contactar</Action>
<Action type="button" variant="outline" data-confirm aria-label="Confirmar" disabled>
  Confirmar
</Action>
```

Variantes: `primary`, `light`, `outline`, `category` y `partnership`. Las dos últimas preservan los estilos particulares de esas secciones. Menú, tema, carruseles y expansión de categorías mantienen sus controles específicos. `SectionHeading`, `FeatureCard` y `MetricCard` siguen cubriendo sus repeticiones existentes.

## Configuración y comprobaciones

Los destinos opcionales `PUBLIC_MARKETPLACE_URL` y `PUBLIC_PARTNER_REGISTRATION_URL` se resuelven en `data/navigation.ts`; conserva allí la validación y los destinos alternativos existentes. El canonical solo se emite si se configura `site` en Astro. Los enlaces sociales pendientes conservan sus destinos originales: no se han inventado URLs.

`pnpm build` es la comprobación incluida en los scripts del proyecto. No hay scripts de lint o tests configurados. Durante la refactorización se ejecutaron además diagnósticos Astro/TypeScript y comparaciones de navegador mediante herramientas externas al proyecto, sin añadir dependencias al lockfile. Consulta los resultados, problemas previos y límites en [validación](docs/validation.md).
