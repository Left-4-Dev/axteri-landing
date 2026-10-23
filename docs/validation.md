# Validación de la refactorización

Referencia: estado original de Git `0b1560e` (`feat(footer): add brand footer and navigation`). El árbol estaba limpio al comenzar. No se hicieron commits, push ni despliegues.

## Compilación, tipos y recursos

| Comprobación | Resultado |
| --- | --- |
| Compilación inicial | Fallaba al resolver `cookie` durante el prerender; véase el problema previo abajo |
| `pnpm install --frozen-lockfile` | Correcto con la configuración de hoisting explícita |
| `pnpm build` final | Correcto: una página estática, sin imports rotos |
| Diagnósticos Astro/TypeScript | 35 archivos, 0 errores, 0 advertencias, 0 hints |
| `git diff --check` | Sin errores |
| `package.json` y `pnpm-lock.yaml` | Sin cambios |
| Integridad de recursos | 177 originales verificados por SHA-256; 60 traslados, 0 recursos modificados o perdidos |
| Carga en navegador | Sin respuestas HTTP >= 400, imágenes rotas ni errores de JavaScript/consola en los casos comprobados |

El proyecto no incorpora scripts de lint/tests ni las dependencias de comprobación. Los diagnósticos se ejecutaron con `@astrojs/check` 0.9.10 instalado en un directorio temporal externo. Playwright 1.51.1 utilizó Chromium 136 (revisión 1169) disponible localmente. No se modificó el lockfile para estas herramientas.

## Método visual

Se archivó el commit original en una copia aislada dentro del directorio ignorado `.astro/refactor/original`. Tanto el original como la refactorización se compilaron con las mismas dependencias bloqueadas y se sirvieron localmente desde sus respectivos `dist/`. El servidor de comparación no publica contenido fuera del equipo.

Se esperó a `document.fonts.ready` y a la decodificación de las imágenes, incluyendo las imágenes lazy. Se compararon temas claro y oscuro con viewport de 900px de alto y escala de dispositivo 1. Para las capturas estáticas se usó movimiento reducido; las animaciones normales se comprobaron por separado, esperando su final antes de comparar estados.

Anchos comprobados, en píxeles:

```text
375
575 576 577
607 608 609
639 640 641
671 672 673
767 768 769
820
959 960 961
1023 1024 1025
1279 1280 1281
1440
1535 1536 1537
```

Son 30 anchos por 2 temas: móvil, tablet y escritorio, incluyendo ±1px de las fronteras compartidas y de las excepciones heredadas. También se compararon textos, destinos, geometría, estilos calculados y pseudoelementos. Las URLs de assets se normalizaron únicamente al comparar estilos, porque el traslado cambia la ruta sin cambiar el recurso.

Los 60 casos conservan textos, enlaces, geometría y estado de carga de fuentes e imágenes. Las 46 aserciones de la pasada principal de interacciones pasan sin fallos.

La pasada final por viewport completa los mismos 60 casos con 1.022 pares de capturas durante scroll, sin diferencias geométricas ni errores de carga o consola. Se guardan todas las capturas de 375, 820 y 1440px y las capturas con diferencias de rasterizado de los demás anchos.

Las primeras capturas del servidor de desarrollo se descartaron como evidencia: una compilación concurrente invalidó la caché de dependencias de Vite. Algunas capturas de página completa también resultaron inconsistentes; se complementaron con capturas del viewport durante scroll real, sin ampliar artificialmente el viewport a la altura del documento.

En las 64 capturas adicionales de estados interactivos, 60 coinciden píxel por píxel. Las otras 4 tienen una diferencia máxima de 1 nivel por canal RGB, localizada en bordes/sombras; no representan cambios de dimensiones, colores declarados ni comportamiento. La prueba de control a 820px comparó el original consigo mismo: sus 68 capturas coinciden exactamente con las correspondientes de original/refactorización, reproduciendo incluso las diferencias de rasterizado entre ambas instancias. Por tanto, no se presenta una afirmación engañosa de identidad binaria de todas las capturas.

Se repitió el control en 577 y 1024px: las 38 capturas guardadas de la versión refactorizada coinciden píxel por píxel con la segunda instancia del original. Los controles se conservan en `viewport-control` y `viewport-controls-extra`.

Los artefactos locales están en `.astro/refactor/`: `production-before`, `production-after`, `states-before`, `states-after` y `viewport-final`. Este directorio es temporal y está ignorado por Git. Los resultados finales de la comparación por viewport se registran en `viewport-final/report.json`.

## Interacciones

En 375, 820 y 1440px, en ambos temas:

- Foco de teclado inicial en el enlace para saltar al contenido.
- Alternancia de tema y persistencia en `localStorage`.
- Apertura del menú móvil, cierre con Escape, restauración del foco y cierre al seguir un enlace.
- Vendedores y compradores: avance, tarjeta destacada, imagen asociada, Home/End, controles deshabilitados en los extremos y selección al hacer scroll nativo, respetando LTR/RTL.
- Categorías: expansión exclusiva, cambio entre tarjetas, un único panel visible, Escape y conservación del foco.
- Partners: siguiente, anterior, selección directa y panel asociado.
- Hover y foco visible de los CTAs del hero, categorías y partnership.
- Capturas de categorías expandidas y del menú abierto.
- Redimensionamiento real entre 1023, 1024 y 1025px: sincronización del menú CSS/JavaScript y cierre al entrar en escritorio.

La secuencia GSAP del hero se observó en ejecución con movimiento normal y se comprobó que elimina su transform al terminar. Con movimiento reducido no ejecuta ese desplazamiento. Las interacciones principales también pasan con movimiento normal en escritorio.

## Problemas previos y decisiones de conservación

1. **Resolución de dependencias al compilar.** El prerender resolvía una instalación externa de `cookie` en un directorio superior, incompatible con el import `parseCookie`. Al aislar esa resolución apareció también la necesidad de resolver `sharp`. Ambos paquetes ya estaban en el lockfile como dependencias transitivas. `.npmrc` los expone de forma explícita mediante `public-hoist-pattern`, sin añadir paquetes ni cambiar versiones. La compilación original aislada y la final pasan con esa disposición de dependencias.
2. **Breakpoints heredados.** About, Services y Audience tienen fronteras fuera de la escala compartida. Assistant y PurchaseJourney contienen media queries mobile-first. Se preservan, con sus límites inclusivos/exclusivos documentados en `architecture.md`.
3. **Animaciones declaradas sin implementación.** ScrollTrigger está registrado pero no tiene instancias activas en el original. Los atributos `data-reveal` tampoco tienen un script asociado. Se conserva el comportamiento actual.
4. **Recursos de uso incierto.** Se mantienen las seis ilustraciones WebP alternativas de Services y `favicon.ico`. Se conservan todas las fuentes y sus licencias.
5. **Destinos pendientes.** Los enlaces sociales sin URL oficial siguen sin enlace activo. Los destinos opcionales de marketplace/registro mantienen sus alternativas existentes.

## Límites

Las comprobaciones se realizaron en Chromium de escritorio con viewports emulados. No se ejecutaron Safari, Firefox, dispositivos físicos, lector de pantalla ni una auditoría completa de accesibilidad. Los destinos externos no se probaron como servicios remotos: se verificó que sus valores no cambian. No existe una suite automatizada permanente en el repositorio; los scripts y capturas de esta revisión quedan como artefactos temporales.

## Propuesta de commits atómicos

No se ha creado ninguno. Para separar los cambios que comparten archivo, selecciona los hunks correspondientes y mantén cada grupo compilable:

1. `fix(build): resolve prerender dependencies with pnpm`
2. `refactor(assets): organize shared branding and section resources`
3. `refactor(landing): extract section data and category interactions`
4. `refactor(ui): centralize action variants and shared design tokens`
5. `docs: document project structure and refactor validation`

La reorganización usa `refactor`, porque conserva las funcionalidades existentes; `feat` corresponde a añadir una funcionalidad o sección nueva.
