## Qué hace este PR

La documentación mantenía promesas de PWA offline y datos solo en el dispositivo que no corresponden a la versión entregada. Ahora describe la **aplicación web online**: React/TypeScript/Vite/Tailwind en GitHub Pages, API TypeScript/Fastify en Render y SQLite/libSQL en Turso. README, propuesta, arquitectura, política pública y contexto de las IAs explican tecnologías, flujo, límites y almacenamiento real.

La documentación de datos distingue pseudónimos y minimización de anonimización irreversible; explica contraseñas con hash scrypt/sal, tokens hasheados, permisos de servidor y límites del prototipo. Conserva como pendientes responsables, conservación/proveedores y validación para uso con menores reales; no declara una certificación de cumplimiento.

El logo aprobado `koramap-logo.jpeg` se conserva sin alterar y se refleja en login, cabecera, privacidad, favicon, iconos de instalación e informes HTML/PDF. Los iconos se generan preservando proporciones. El informe descargado incorpora la imagen para abrirse sin servidor de imágenes: **eso no añade modo offline a la aplicación**. Se mantienen los cinco idiomas y la salida del modo niño con contraseña.

Base: `main` integrado hasta `c1a6802` (PR #36). `develop` ya no existe; Miguel autorizó esta rama independiente y PR hacia `main`. No se modifican API, tablas, cuentas ni servicios desplegados.

## Cómo probarlo

1. Leer `docs/arquitectura.md` y `docs/datos-y-seguridad.md`, y revisar la propuesta y política pública. Debe quedar claro qué necesita conexión y qué datos se guardan en cada capa.
2. `cd app`, `npm ci`, `npm run dev`: comprobar logo en login/cabecera y abrir la política. Probar escritorio y móvil; el original completo debe mantener su proporción.
3. Con datos ficticios: alumno → juego → guardado → Perfil Docente → informe → descargar HTML → abrirlo sin red → guardar PDF. Comprobar logo, ES/AR y RTL. Sin red, el modo niño no debe desbloquear el perfil profesional.

**Validación completa:** tipos y build de ambos proyectos; **22 unitarios frontend, 10 tests API y 20 E2E**, todos correctos. [CI frontend sobre `ef1c934`](https://github.com/Floren87/hack4edu-2026/actions/runs/42059961265), con capturas revisadas de login móvil y panel de escritorio. Los E2E usan API/base en memoria; el PDF exportado se prueba en un contexto sin conexión. Los enlaces locales de la documentación se han comprobado. La API pública respondió health 200, CORS de Pages y límite 60/min, sin crear cuentas ni consultar alumnos remotos.

## Cierre con Floren

- Revisar/aprobar e integrar hacia `main`; Pages publicará el frontend con el nuevo logo y la política actualizada.
- Antes del siguiente redeploy de Render, verificar Branch=`main`, porque `develop` se eliminó. La API ya está viva y este PR no requiere cambios de BBDD ni secretos del frontend.
- Confirmar el recorrido desde la red de la presentación. Pendientes de uso real descritos en `datos-y-seguridad.md`.

- [x] Sin commits directos en `main`, secretos ni datos personales de prueba.
- [x] Código generado con IA, revisado y probado; documentación/estado actualizados.
