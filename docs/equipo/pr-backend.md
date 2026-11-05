## Qué hace este PR

Conecta el prototipo con una API TypeScript/Fastify y persistencia SQLite/libSQL: el profesional entra con una cuenta ficticia, gestiona alumnos con pseudónimos y consulta/exporta su estado actual. El modo niño muestra solo juegos del alumno seleccionado; salir requiere la contraseña del profesional y los permisos se comprueban en servidor.

Incluye todos los cambios acumulados en `feat/backend` desde `develop`: backend, integración frontend, recuperación de estilos del prototipo, traducción completa ES/EN/FR/AR/UK e informes RTL, y conexión directa entre frontend/API mediante Bearer y orígenes explícitos, sin proxy. Conserva `VITE_API_BASE_URL` para cambiar de API; sin override, el frontend utiliza **https://hack4edu-2026.onrender.com/api**, ya publicada por Miguel en Render con Turso.

Contexto para Floren/Claude Code: [traspaso acumulado](traspaso-floren.md), [contrato API](../../backend/README.md), [integración](integracion-backend.md), [operación/despliegue](despliegue-demo.md) y [mantenimiento de idiomas](i18n.md). Sin offline, histórico complejo, recuperación por email ni IA externa.

## Cómo probarlo

1. Node 22.12+, `cd app`, `npm ci`, `npm run dev`; abrir `http://localhost:3000`. No requiere backend local ni `.env.local`. Revisar cualquier override previo de `VITE_API_BASE_URL`; la base debe terminar en `/api`, nunca `/api/health`.
2. Registrar cuenta ficticia → crear/editar alumno → entrar en niño → jugar → esperar «Guardado» → recargar → salir con contraseña → resultados/revisión y resumen familiar → exportar. Revisar los cinco idiomas, incluido árabe RTL, y aislamiento entre dos cuentas.
3. Validación ejecutada en Windows/Edge: lint y build de `app/` y `backend/`; **18 tests unitarios frontend, 9 API, 11 E2E aisladas y 1 E2E real contra Render/Turso**, todos correctos. Las E2E multilingües completan 50 recorridos de juegos. El bundle de producción contiene la URL pública predeterminada. Vite mantiene el aviso existente de tamaño del bundle.
4. Para repetir la regresión: `npm ci` en ambos directorios; `npm run lint`, `npm test`, `npm run build` en ambos y `npm run test:e2e` en `app/`. Las E2E usan puertos 3100/3101 y base en memoria. `npm run test:live` es opt-in, usa la API pública y crea cuentas QA; elimina su alumno y revoca sesiones, pero deja cuentas QA vacías. No ejecutarlo automáticamente en CI.

## Pendiente tras integrar

- Floren revisa/reconcilia los cruces con las ramas de creatividad y selector de idioma; la integración y el merge quedan al equipo. Este PR no fusiona esas ramas ni toca `main`/`develop` directamente.
- Floren/Delia publican frontend en Netlify y comunican el origen HTTPS exacto. Miguel lo añade a `ALLOWED_ORIGINS` en Render y redespliega la API; no requiere proxy, secretos en frontend ni nueva BBDD.
- Repetir el flujo desde Netlify y la red de Madrid, y comprobar persistencia tras reinicio/redeploy antes del QR. La validación remota actual se hizo desde localhost y no forzó reinicios. Los workflows existentes no incorporan aún backend/E2E.

## Checklist

- [x] Probado en local y contra la API pública con datos ficticios.
- [x] Decisiones y estado actualizados; traspaso acumulado documentado.
- [x] Sin claves, tokens, contraseñas ni datos personales en el repositorio.
- [x] Parte del código generada con IA, revisada y validada con las pruebas indicadas.
