# Axteri — Instrucciones para Agentes de IA

Guía operativa obligatoria para cualquier agente de programación que analice o modifique este repositorio. Para conocer la descripción funcional, estructura general e instalación del proyecto, consulta `README.md`.

---

## Entorno de desarrollo

Al iniciar el servidor de desarrollo de Astro, ejecútalo siempre en segundo plano:

```sh
pnpm astro dev --background
```

Gestiona el proceso en segundo plano mediante:

- `pnpm astro dev status`
- `pnpm astro dev logs`
- `pnpm astro dev stop`

En Windows PowerShell, utiliza `pnpm.cmd` si la política de ejecución bloquea `pnpm.ps1`.
Documentación oficial de referencia de Astro: https://docs.astro.build

---

## 1. Arquitectura

- **Respetar la estructura modular**:
  - `src/components/layout/`: Estructura global (`Header.astro`, `Footer.astro`).
  - `src/components/sections/`: Secciones de la landing ensambladas en `src/pages/index.astro`.
  - `src/components/ui/`: Componentes reutilizables (`Action.astro`, `SectionHeading.astro`, `FeatureCard.astro`, `MetricCard.astro`).
  - `src/data/`: Contenido estructurado y configuración de secciones.
  - `src/scripts/`: Controladores de interacción de UI y `smooth-scroll.ts`.
  - `src/scripts/animations/`: Configuración de GSAP, utilidades de movimiento y animaciones por sección.
  - `src/styles/`: Reset, fuentes, design tokens (`tokens.css`), estilos globales y variantes de acciones (`components/actions.css`).
- **Evitar sobre-ingeniería**: Reutiliza los componentes de `src/components/ui/` cuando exista repetición real; no fracciones marcado único en subcomponentes innecesarios.
- **Separación de responsabilidades**: Mantén los datos en `src/data/`, el marcado y estilos encapsulados en `.astro`, y la lógica imperativa en `src/scripts/`.
- **Alias de importación**: Utiliza siempre los alias de `tsconfig.json` (`@assets/*`, `@components/*`, `@data/*`, `@layouts/*`, `@scripts/*`, `@styles/*`). Referencia los archivos de `public/` con rutas absolutas desde `/` (nunca uses `/public/...` ni imports relativos hacia `public`).
- **Contratos DOM**: Conserva intactos los atributos `data-*` (`data-theme-toggle`, `data-feature-track`, `data-feature-card`, `data-category-card`, `data-partner-tab`, `data-audience`, `data-about`, `data-service`, etc.) y `aria-*` que vinculan el HTML con los scripts.

---

## 2. Astro y TypeScript

- **Tipado estricto**: El proyecto extiende `astro/tsconfigs/strictest`. Mantén tipos explícitos, evita `any` y verifica el acceso a elementos del DOM (`querySelector<HTMLElement>`, guardas de nulidad).
- **Cero frameworks de UI adicionales**: No introduzcas React, Vue, Svelte, Tailwind ni librerías de componentes externas.
- **Dependencias**: No instales paquetes nuevos sin una solicitud o justificación técnica explícita. Usa exclusivamente `pnpm` respetando `.npmrc` y `pnpm-lock.yaml`.
- **Semántica y accesibilidad**: Preserva la jerarquía de encabezados, regiones semánticas (`header`, `main#contenido`, `section`, `footer`), navegación por teclado (`Tab`, `Escape`, flechas en carruseles), `focus-visible` y atributos ARIA.

---

## 3. CSS y Arquitectura Responsive (Desktop-First)

- **Metodología BEM**: Sigue la convención `.bloque__elemento--modificador` tanto en los bloques `<style>` de los componentes como en `src/styles/`.
- **Design Tokens (`src/styles/tokens.css`)**:
  - Reutiliza las variables CSS existentes para colores, tipografía, espaciados (`--space-1` a `--space-5`), radios y sombras.
  - Respeta la separación entre **colores fijos** (`--color-white`, `--color-ink`, `--color-accent-fixed`, `--color-violet`, `--color-brand-end`, `--color-relief-surface`) y **colores adaptables al tema** (`--color-background`, `--color-surface`, `--color-text`, `--color-muted`, `--color-border`, `--color-accent`). No son intercambiables.
- **Arquitectura DESKTOP-FIRST obligatoria**:
  - Los estilos base se escriben para escritorio y se adaptan hacia pantallas menores con media queries descendentes (`@media (width < ...)`), ordenadas de mayor a menor.
  - **No conviertas ni migres el proyecto a mobile-first.**
  - Utiliza la escala de breakpoints del proyecto:
    - `2xl`: `96rem` (`1536px`)
    - `xl`: `80rem` (`1280px`)
    - `lg`: `64rem` (`1024px`)
    - `md`: `48rem` (`768px`)
    - `sm`: `40rem` (`640px`)
  - Respeta las media queries existentes en cada componente (incluyendo el layout específico de `Assistant.astro` y el breakpoint `(width < 64rem)` sincronizado en `src/scripts/navigation.ts`).
- **Fidelidad visual**: No alteres colores, tipografías, dimensiones, sombras ni proporciones del diseño sin una instrucción explícita del usuario.

---

## 4. GSAP y Animaciones

- **Instancia única de GSAP**: Importa `gsap`, `ScrollTrigger` y `DrawSVGPlugin` únicamente desde `@scripts/animations/gsap`. No registres plugins múltiples veces.
- **Utilidades de movimiento (`@scripts/animations/motion`)**:
  - Usa `createMotion(root, setup, queries)` para todas las animaciones de sección. Esto garantiza el alcance de selectores a `root`, el respeto a `(prefers-reduced-motion: no-preference)` y evita repetir entradas al redimensionar (`markPlayed`).
  - Usa `bindHover` para micro-interacciones de ratón (`pointerType === "mouse"`) y `bindLoop` para animaciones continuas condicionadas a visibilidad en viewport y pestaña activa.
  - Utiliza las constantes compartidas `ease`, `duration`, `start` y la función `distance(px)`.
- **Limpieza e integridad**:
  - Usa `clearProps` al terminar animaciones de entrada para no dejar `transform` u `opacity` inline que interfieran con el CSS o estados `:hover`.
  - Gestiona los listeners con `AbortController` y devuelve funciones de limpieza en `createMotion`.
  - No dupliques listeners ni agregues efectos invasivos (parallax no solicitado, bloqueos de scroll o sobrecarga de tweens simultáneos).

---

## 5. Ilustraciones e Íconos SVG

- **Integridad vectorial**: Preserva siempre `viewBox`, geometría de trazados (`d`), colores, grosores, proporciones, `mask`, `clipPath`, `filter` y `linearGradient` originales.
- **Aislamiento de IDs**: Cuando un SVG se inserte inline en un componente Astro, asegúrate de que todos sus `id`, `url(#...)` y `href="#..."` tengan un prefijo único por componente para evitar colisiones en el documento.
- **Loops internos**: Selecciona las partes animables mediante atributos `data-*` acotados a la raíz del SVG (`gsap.utils.selector(svg)`) y envuelve la línea de tiempo con `bindLoop(svg, ...)` usando `svgOrigin` o `transformOrigin` precisos.

---

## 6. Lenis (Smooth Scroll)

- **Instancia única**: La configuración de `Lenis` vive exclusivamente en `src/scripts/smooth-scroll.ts` y se carga en `BaseLayout.astro`. No crees nuevas instancias de `Lenis`; si necesitas acceder a ella, utiliza `getLenis()`.
- **Sincronización con GSAP**: Mantén `autoRaf: false` en Lenis y su ejecución dentro de `gsap.ticker` junto con `instance.on("scroll", () => ScrollTrigger.update())`. No introduzcas un loop `requestAnimationFrame` adicional.
- **Protección de carruseles horizontales**: Conserva `data-lenis-prevent-horizontal` en `[data-feature-track]` (`Features.astro`) y `overscroll-behavior-x: contain` en `src/styles/reset.css` para no interferir con el scroll horizontal nativo LTR/RTL ni bloquear el scroll vertical con rueda del mouse sobre las tarjetas.
- **Dispositivos táctiles y accesibilidad**: Mantén `syncTouch: false` para preservar el desplazamiento táctil nativo en móviles, conserva la navegación suave por anclas (`a[href^="#"]`) con gestión de foco accesible y desactiva Lenis completamente cuando `(prefers-reduced-motion: reduce)` esté activo.

---

## 7. Recursos y Datos

- **`src/assets/` vs `public/`**:
  - Coloca en `src/assets/` los recursos importados por componentes o archivos de `src/data/`.
  - Coloca en `public/` los recursos consumidos mediante URL estática directa (fuentes, favicons, fondos CSS e íconos referenciados por ruta en datos o máscaras CSS).
- **No duplicar activos**: Reutiliza los originales compartidos `src/assets/logos/axteri-logo.svg` y `src/assets/logos/axte.svg`. No elimines recursos existentes sin confirmación (como las alternativas en `src/assets/illustrations/services/`).
- **Datos centralizados**: Al actualizar contenido de navegación, beneficios, categorías, features, aliados, recorrido de compra o footer, edita el módulo correspondiente en `src/data/` en lugar de hardcodear valores en el componente `.astro`.

---

## 8. Validaciones antes de finalizar

Antes de dar por concluida cualquier tarea, el agente debe:

1. Revisar los archivos modificados (`git status` y `git diff`) para confirmar que no existan cambios accidentales.
2. Ejecutar `pnpm build` cuando se modifique código, estilos, datos o configuración para validar tipos, imports y generación estática.
3. Verificar que no se introduzcan errores de consola, desbordamientos horizontales (`overflow-x`) ni regresiones en la adaptación desktop-first (`1536px`, `1280px`, `1024px`, `768px`, `640px`) o en `prefers-reduced-motion: reduce`.
4. Informar claramente al usuario qué validaciones se ejecutaron y cuáles no pudieron realizarse.

---

## 9. Reglas de Git

- **No crear commits automáticamente**: Solo realiza un commit cuando el usuario lo solicite de forma explícita.
- **No ejecutar `git push`** ni operaciones remotas sin autorización directa.
- **No cambiar ni crear ramas** salvo instrucción explícita (`dev` es la rama de desarrollo y `main` la de producción).
- **No alterar el historial de Git** (`git reset`, `git rebase`, `git commit --amend`, `git checkout --`) sin permiso expreso.
- **Respetar cambios previos**: No reviertas ni sobrescribas modificaciones locales del usuario.
- **Conventional Commits**: Cuando se solicite crear un commit, redacta el mensaje siguiendo el formato `<tipo>(<alcance opcional>): <descripción en inglés>` (por ejemplo: `feat(animations): ...`, `fix(build): ...`, `refactor(ui): ...`, `docs: ...`), coherente con el historial del repositorio.
