# Traspaso a Floren y Claude Code · feat/backend

**Fecha:** 4 de noviembre de 2026, Bogotá. **Objetivo:** facilitar las pruebas y la integración del equipo del día siguiente. Este documento resume todo el trabajo desde la construcción del backend; no solo el último sprint.

## Rama y alcance acordado

- Rama: **`feat/backend`**, creada desde `develop` en `d9b5040`. No se ha fusionado posteriormente `develop` ni se ha modificado `main`.
- El usuario autorizó continuar frontend e idiomas en esta rama y subir sus commits. **La integración con las ramas del equipo y el merge los hará Floren.** El PR se preparará al terminar el día; este sprint no lo abre.
- Decisión vigente: TypeScript, demo conectada, cuenta con usuario inventado y contraseña, alumnos con pseudónimos y **estado actual**. Sin offline, historial de evaluaciones, recuperación por email ni IA externa.
- Referencia completa: [decisiones](decisiones.md), [API](../backend/README.md), [integración frontend](integracion-backend.md), [despliegue](despliegue-demo.md).

## Qué cambió desde develop

| Bloque | Implementación y puntos de revisión |
|---|---|
| API nueva | `backend/`: TypeScript + Fastify, Zod, SQLite/libSQL mediante `@libsql/client`. Inicializa `accounts`, `sessions`, `students`. Estado del alumno en JSON, propietario y versión separados; sin ORM ni migraciones complejas. |
| Cuentas y protección | Registro sin datos reales; contraseña con scrypt, sesión de 8 h con cookie HttpOnly, CSRF y comprobación de Origin. Cookie Secure en producción, consultas parametrizadas, límites de peticiones y sin cuerpos sensibles en logs. |
| Alumnos | CRUD aislado por propietario. Progreso y última revisión profesional separados; versión optimista: una escritura obsoleta recibe 409. El progreso nuevo conserva notas, pero vuelve a marcar la revisión pendiente. |
| Profesional / niño | El modo se guarda y autoriza en servidor. Niño solo accede al alumno seleccionado, sin listado ni notas profesionales; no puede crear/borrar/revisar alumnos. Salir exige la contraseña del profesional. No son cuentas de niño independientes. |
| Frontend conectado | `AppContext.tsx` + `api.ts`: login inicial, recuperación de sesión, alumnos remotos, guardado agrupado/serializado e indicadores de éxito/error. No hay perfiles de ejemplo ni expedientes persistidos en el navegador. Solo se conserva la preferencia de idioma. |
| Pantallas | Login/registro, gestión profesional y resultados/resumen familiar. Niño solo ve juegos; sin accesos profesionales ni selector de alumno. El bloqueo también se conserva al recargar. BroadcastChannel y consulta de sesión al recuperar foco actualizan las otras pestañas. |
| Estilos recuperados | Se conservaron los estilos del prototipo de Delia: selector de idioma, avatares, tarjetas, degradados y formularios. «Resultados» y «Resumen familiar» se resaltan según la vista activa. Distribución móvil revisada. |
| Aplicación conectada | Vite hace proxy de `/api`. Se retira el service worker anterior y su caché; no se instala otro worker de caché. Producción: frontend y API desde el mismo origen HTTPS. |
| Informes | Reglas locales en `aiPedagogy.ts`; no se consulta un modelo externo. Dos audiencias, impresión del navegador y descarga de HTML imprimible; PDF mediante «Imprimir / Guardar PDF». Contenido dinámico escapado, incluidas notas y pseudónimos. |
| Sprint de idiomas | ES/EN/FR/AR/UK en controles, juegos, mensajes, observaciones y ambos informes. Se eliminó el traductor exclusivamente inglés y los condicionales español/inglés del generador y de las exportaciones. Catálogos completos, fechas por idioma y `lang`/`dir` correctos, incluido árabe RTL. |

Commits de referencia previos al sprint: `d778a78` (API), `5aa3d70` (documentación), `fea4b0f` (build de despliegue), `534dff1` (integración frontend), `76fd3b0` (estilos). Consultar `git log develop..feat/backend` para el listado actualizado, sin asumir que la rama remota de integración sigue en el mismo punto.

El sprint de traducción y sus pruebas están en **`df17544`**. Este documento y la actualización del contexto compartido se guardan en el commit siguiente.

Al actualizar únicamente las referencias remotas durante el sprint, `origin/develop` seguía en `d9b5040`. Se observaron cambios **no incorporados aquí** en `feature-arrastrar-piezas` (`36ca241`), `feature-parejas-creativas` (`4ca0733`) y `fix/selector-idioma` (`82daada`). Las dos primeras afectan al juego de creatividad; la última también retira referencias visibles a requisitos Rxx. Revisar especialmente esos cruces al integrar: los IDs y catálogos de textos deben mantenerse coherentes en los cinco idiomas.

## Mapa para revisar el código

- **Contrato y permisos:** `backend/src/app.ts`, `schemas.ts`, `security.ts`, `db.ts`; detalle en `backend/README.md`.
- **Sesión, modo, guardado y versión:** `app/src/context/AppContext.tsx`, `app/src/utils/api.ts`.
- **Acceso y navegación:** `app/src/App.tsx`, `components/auth/LoginScreen.tsx`, `components/common/Navbar.tsx`, `components/profiles/ProfileManager.tsx`.
- **Informes:** `app/src/utils/aiPedagogy.ts`, `printReport.ts`, `components/teacher/TeacherDashboard.tsx`, `components/family/FamilyPortal.tsx`.
- **Idiomas:** `app/src/i18n/`; mantenimiento y pruebas en [i18n.md](i18n.md).
- **Pruebas:** `backend/tests/`, `app/tests/reports.test.ts`, `i18n.test.ts`, `english.spec.ts`, `i18n.spec.ts`.

## Arranque reproducible

Node **22.12+**. Comprobado en esta sesión con Node 26.13 en Windows/Edge. No sobrescribir un `.env` que ya exista.

Terminal 1, desde la raíz:

```powershell
cd backend
npm ci
Copy-Item .env.example .env # solo la primera vez
npm run dev
```

Terminal 2:

```powershell
cd app
npm ci
npm run dev
```

Abrir **http://localhost:3000/**; la API escucha en 127.0.0.1:3001. `APP_ORIGIN` debe coincidir exactamente con el origen del navegador. No alternar localhost y 127.0.0.1. Una cuenta nueva no tiene alumnos: crearlos con datos ficticios.

## Validación del sprint

Comandos desde sus directorios respectivos:

```powershell
# backend/
npm run lint
npm test
npm run build

# app/
npm run lint
npm test
npm run test:e2e
npm run build
```

**Resultado antes de subir:** lint y build de ambos proyectos correctos; **10 pruebas unitarias del frontend, 6 de API y 9 E2E correctas**. Las cinco E2E multilingües completan **los diez juegos en cada idioma** (50 recorridos), comprueban guardado, cambios de idioma con estado, informes pendientes/completados y ambos HTML descargados con nombre localizado. Las otras cuatro cubren CRUD, aislamiento, errores/conflictos, controles y distribución. Capturas de resultados/resumen a 390 y 1366 px; revisión visual adicional de francés, árabe RTL y alta de alumno en ucraniano. No hay cambios de CSS en este sprint. El build de Vite avisa del tamaño del bundle principal (aprox. 712 kB / 224 kB gzip); compila correctamente.

Las E2E levantan API y Vite temporales en **3101/3100**, con base **en memoria**; no usan la SQLite del desarrollador. Requieren dependencias de ambos directorios y puertos libres. Windows usa Edge; Linux necesita `npx playwright install chromium`. En Windows una prueba de reapertura/limpieza de SQLite tarda unos 30 s.

## Pruebas de integración que quedan a Floren

1. Comparar la rama con el `develop` vigente y resolver con el equipo cualquier cambio concurrente; no sustituir archivos completos sin revisar sus diferencias.
2. Repetir login → alumno → modo niño → juego → guardado → recarga → contraseña de salida → resultados, con dos cuentas aisladas y dos pestañas. Confirmar que notas y selector de alumnos no llegan al niño.
3. Recorrer ES/EN/FR/AR/UK en móvil y escritorio; cambiar idioma durante la partida y revisar ambos HTML descargados. Pseudónimos, notas libres y nombres nativos del selector permanecen intactos deliberadamente.
4. Probar la URL pública y la persistencia remota después de reiniciar el servicio. **No se ha desplegado a Render/Turso ni se han creado cuentas de proveedores.** Seguir `despliegue-demo.md` antes de distribuir el QR.
5. Revisar el workflow de Pages y la CI al integrar. El workflow actual de Pages publica un frontend estático: **no ejecuta esta API**. La CI existente valida `app/`, pero aún no incorpora los tests del backend ni las E2E. No se cambiaron esos workflows en esta rama.

## Límites deliberados que no deben confundirse con regresiones

- Solo estado actual y última validación; el registro acumulado de juegos ya existente alimenta el informe, pero no hay versiones históricas de evaluaciones.
- Sin recuperación de contraseña ni verificación de identidad profesional. Cada asistente de la demo debe crear su propia cuenta ficticia.
- El guardado pendiente vive en memoria; cerrar/recargar antes de confirmarlo puede perderlo. Un 409 exige cargar el estado remoto, sin fusionar automáticamente. Evitar partidas simultáneas del mismo alumno en varios dispositivos.
- Las notas editadas requieren pulsar «Guardar y validar» antes de navegar. No hay autoguardado del formulario de revisión.
- Máximo 50 alumnos/cuenta, 500 registros/alumno, 256 KiB por petición y 2000 caracteres de notas. Autenticación limitada por IP/ruta: probar la wifi del evento y los tiempos del hosting gratuito.
- Las observaciones de juego se guardan en español canónico para poder mostrarlas en cualquier idioma; **no es un fallo de traducción en la base**. Las antiguas observaciones reconocidas en cualquiera de los cinco idiomas también se traducen al mostrarlas. Texto libre o desconocido se conserva.
- La voz depende de las voces instaladas en el dispositivo. Los porcentajes son reglas del prototipo, no puntuaciones psicométricas validadas; el profesional decide.

La API no cambió durante el sprint de traducción. Quedan a Floren la integración, la revisión entre zonas horarias y el merge; este documento no presupone su aprobación.
