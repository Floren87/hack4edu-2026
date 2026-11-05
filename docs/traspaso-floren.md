# Traspaso a Floren y Claude Code · feat/backend

**Fecha:** 4 de noviembre de 2026, Bogotá. **Objetivo:** facilitar las pruebas y la integración del equipo del día siguiente. Este documento resume todo el trabajo desde la construcción del backend; no solo el último sprint.

**Actualización 5 de noviembre:** el trabajo acumulado ya está integrado en `develop`, incluido KoraMAP y los cambios posteriores del equipo. `feat/backend` se eliminó al integrar; no usarla como rama de despliegue. Miguel cambió Render a `develop`, autorizó `https://floren87.github.io` y confirmó Live: el preflight de Pages devuelve 204. El destino final es `https://floren87.github.io/hack4edu-2026/`, sustituyendo la previsión anterior de Netlify. Corrección posterior en `fix/demo-api-render`: auth a 60/min por IP/ruta, límite 429 conservado y pruebas de clientes tras proxy; hace falta integrar y desplegar ese commit. Ver [guía vigente](despliegue-demo.md). El resto de este traspaso conserva el contexto histórico del día 4; los cambios posteriores de PDF/comentarios/creatividad están en `develop` y el PR #24.

## Rama y alcance acordado

- Rama: **`feat/backend`**, creada desde `develop` en `d9b5040`. No se ha fusionado posteriormente `develop` ni se ha modificado `main`.
- Miguel autorizó continuar frontend e idiomas en esta rama y subir sus commits; ahora autoriza preparar el **PR `feat/backend` → `develop`**, tras validar la conexión pública y documentarla. **La integración con las ramas del equipo y el merge los hará Floren.** No se fusionan aquí las ramas concurrentes.
- Decisión vigente: TypeScript, demo conectada, cuenta con usuario inventado y contraseña, alumnos con pseudónimos y **estado actual**. Sin offline, historial de evaluaciones, recuperación por email ni IA externa.
- Referencia completa: [decisiones](decisiones.md), [API](../backend/README.md), [integración frontend](integracion-backend.md), [despliegue](despliegue-demo.md).

**Actualización posterior al sprint de idiomas:** Miguel aprobó el desacoplamiento. El contrato vigente es **Bearer + `VITE_API_BASE_URL` + `ALLOWED_ORIGINS`**, sin proxy ni cookies. Leer las guías enlazadas antes de publicar: el frontend ya puede apuntar desde localhost a una API remota. Las versiones antiguas de frontend con cookie/CSRF requieren actualizarse y volver a iniciar sesión; no borrar las cuentas ni los alumnos.

## Demo remota ya disponible · entrega a Floren

- **API base:** `https://hack4edu-2026.onrender.com/api`. **Salud:** [GET /api/health](https://hack4edu-2026.onrender.com/api/health), comprobado `200 {"ok":true}`. Miguel la desplegó en Render y la conectó a libSQL/Turso siguiendo la guía. La BBDD, credenciales y operación de la API quedan con Miguel.
- **Esta rama apunta allí por defecto**, también al compilar sin variables. El valor se centraliza en `app/src/utils/apiConfig.ts`; `app/.env.example` lo documenta. `/api/health` no es una URL base. Si existe un `.env.local` anterior apuntando a localhost, quitar/corregir ese override y reiniciar Vite o reconstruir. `.env.example` no se carga automáticamente.
- **Comprobación real aprobada:** navegador en `http://localhost:3000` → API pública → BBDD remota. Registro/login de dos cuentas ficticias, alta/edición/borrado de alumno, nota profesional, partida y progreso persistido tras recarga y nuevo login, bloqueo niño, contraseña incorrecta/correcta, aislamiento entre propietarios y ambos HTML en árabe RTL. Las llamadas observadas van solo al host de Render, sin cookies de autenticación ni errores JavaScript. Se borró el alumno creado y se revocaron las sesiones; quedaron dos cuentas QA vacías, sin datos reales ni contraseñas guardadas en archivos.
- **Único ajuste de conexión pendiente tras integrar:** Floren/Delia comunican el origen final de Netlify; Miguel añade ese origen HTTPS exacto a `ALLOWED_ORIGINS` en Render, conservando `http://localhost:3000` si se necesita, y redespliega la API. No se requiere proxy, nueva BBDD ni secretos en Netlify. Aún no conocemos ni autorizamos ese dominio.
- **Cierre de demo:** repetir desde Netlify el recorrido login → alumno → niño → juego → «Guardado» → recarga → salida con contraseña → resultados/exportación. Comprobar también el arranque tras inactividad y la red de Madrid antes de compartir el QR. Esta sesión no forzó un reinicio de Render; la persistencia a reinicio remoto sigue pendiente de comprobación operativa.

## Qué cambió desde develop

| Bloque | Implementación y puntos de revisión |
|---|---|
| API nueva | `backend/`: TypeScript + Fastify, Zod, SQLite/libSQL mediante `@libsql/client`. Inicializa `accounts`, `sessions`, `students`. Estado del alumno en JSON, propietario y versión separados; sin ORM ni migraciones complejas. |
| Cuentas y protección | Registro sin datos reales, scrypt y sesión opaca de 8 h vía Authorization Bearer; SHA-256 en servidor. Token/caducidad en sessionStorage por API y pestaña; sin cookies ni CSRF. CORS/orígenes explícitos, consultas parametrizadas, límites y sin cuerpos sensibles en logs. |
| Alumnos | CRUD aislado por propietario. Progreso y última revisión profesional separados; versión optimista: una escritura obsoleta recibe 409. El progreso nuevo conserva notas, pero vuelve a marcar la revisión pendiente. |
| Profesional / niño | El modo se guarda y autoriza en servidor. Niño solo accede al alumno seleccionado, sin listado ni notas profesionales; no puede crear/borrar/revisar alumnos. Salir exige la contraseña del profesional. No son cuentas de niño independientes. |
| Frontend conectado | `AppContext.tsx` + `api.ts`: login inicial, recuperación de sesión, alumnos remotos, guardado agrupado/serializado e indicadores de éxito/error. No hay perfiles de ejemplo ni expedientes persistidos en el navegador. Solo se conserva la preferencia de idioma. |
| Pantallas | Login/registro, gestión profesional y resultados/resumen familiar. Niño solo ve juegos; sin accesos profesionales ni selector de alumno. El bloqueo también se conserva al recargar. BroadcastChannel y consulta de sesión al recuperar foco actualizan las otras pestañas. |
| Estilos recuperados | Se conservaron los estilos del prototipo de Delia: selector de idioma, avatares, tarjetas, degradados y formularios. «Resultados» y «Resumen familiar» se resaltan según la vista activa. Distribución móvil revisada. |
| Aplicación conectada | Cliente HTTP directo a `VITE_API_BASE_URL`; la API permite orígenes mediante `ALLOWED_ORIGINS`. Frontend y backend pueden estar en dominios distintos; no se necesita proxy de Vite/Netlify. Service worker anterior y caché retirados. |
| Informes | Reglas locales en `aiPedagogy.ts`; no se consulta un modelo externo. Dos audiencias, impresión del navegador y descarga de HTML imprimible; PDF mediante «Imprimir / Guardar PDF». Contenido dinámico escapado, incluidas notas y pseudónimos. |
| Sprint de idiomas | ES/EN/FR/AR/UK en controles, juegos, mensajes, observaciones y ambos informes. Se eliminó el traductor exclusivamente inglés y los condicionales español/inglés del generador y de las exportaciones. Catálogos completos, fechas por idioma y `lang`/`dir` correctos, incluido árabe RTL. |

Commits de referencia previos al sprint: `d778a78` (API), `5aa3d70` (documentación), `fea4b0f` (build de despliegue), `534dff1` (integración frontend), `76fd3b0` (estilos). Consultar `git log develop..feat/backend` para el listado actualizado, sin asumir que la rama remota de integración sigue en el mismo punto.

El sprint de traducción y sus pruebas están en **`df17544`**, y el traspaso inicial en `588ec12`. Los commits posteriores incorporan el desacoplamiento de API documentado aquí.

El cambio de transporte, configuración y pruebas de desacoplamiento está en **`87f484a`**. Publicar conjuntamente su frontend y backend; no combinar el cliente antiguo de cookies con la API Bearer.

El destino público predeterminado de Render y el smoke de navegador contra la API desplegada están en **`9dade81`**. Descripción completa preparada para el PR: [pr-backend.md](pr-backend.md).

Al actualizar únicamente las referencias remotas durante el sprint, `origin/develop` seguía en `d9b5040`. Se observaron cambios **no incorporados aquí** en `feature-arrastrar-piezas` (`36ca241`), `feature-parejas-creativas` (`4ca0733`) y `fix/selector-idioma` (`82daada`). Las dos primeras afectan al juego de creatividad; la última también retira referencias visibles a requisitos Rxx. Revisar especialmente esos cruces al integrar: los IDs y catálogos de textos deben mantenerse coherentes en los cinco idiomas.

## Mapa para revisar el código

- **Contrato y permisos:** `backend/src/app.ts`, `schemas.ts`, `security.ts`, `db.ts`; detalle en `backend/README.md`.
- **Sesión, modo, guardado y versión:** `app/src/context/AppContext.tsx`, `app/src/utils/api.ts`.
- **Acceso y navegación:** `app/src/App.tsx`, `components/auth/LoginScreen.tsx`, `components/common/Navbar.tsx`, `components/profiles/ProfileManager.tsx`.
- **Informes:** `app/src/utils/aiPedagogy.ts`, `printReport.ts`, `components/teacher/TeacherDashboard.tsx`, `components/family/FamilyPortal.tsx`.
- **Idiomas:** `app/src/i18n/`; mantenimiento y pruebas en [i18n.md](i18n.md).
- **Pruebas:** `backend/tests/`, `app/tests/reports.test.ts`, `i18n.test.ts`, `api.test.ts`, `english.spec.ts`, `i18n.spec.ts`, `decoupled.spec.ts`; smoke remoto opt-in en `render.live.spec.ts`.

## Arranque reproducible

Node **22.12+**. Comprobado en esta sesión con Node 26.13 en Windows/Edge. No sobrescribir un `.env` que ya exista.

Para probar la demo pública, desde la raíz solo hace falta:

```powershell
cd app
npm ci
npm run dev
```

Abrir **http://localhost:3000/**; el cliente conecta directamente a Render, sin backend local ni `.env.local`. No hace falta que la API sirva el frontend. Una cuenta nueva no tiene alumnos: crearlos con datos ficticios.

Para desarrollar todo localmente, iniciar también `backend/` según su [README](../backend/README.md), definir `VITE_API_BASE_URL=http://localhost:3001/api` en `app/.env.local` y reiniciar Vite. `ALLOWED_ORIGINS` de esa API debe incluir el origen del navegador. No sobrescribir configuraciones existentes ni copiar secretos al frontend.

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

**Resultado vigente, incluido desacoplamiento:** lint y build de ambos proyectos correctos; **18 pruebas unitarias del frontend, 9 de API y 11 E2E correctas**. Las cinco E2E multilingües completan **los diez juegos en cada idioma** (50 recorridos), con guardado, cambios de idioma, informes pendientes/completados y ambos HTML descargados. Otras cuatro cubren CRUD, aislamiento, errores/conflictos y distribución; las dos nuevas verifican API directa sin cookies, recarga, revocación entre pestañas, caducidad y rechazo de orígenes. Los tests unitarios cubren además respuestas tardías que no deben borrar un login nuevo y caducidad durante una petición. Sin cambios de CSS. El build de Vite avisa del tamaño del bundle principal (aprox. 714 kB / 225 kB gzip); compila correctamente.

Las E2E levantan API y Vite temporales en **3101/3100**, con base **en memoria**; frontend en `localhost` y API en `127.0.0.1`, sin proxy. No usan la SQLite del desarrollador. Requieren dependencias de ambos directorios y puertos libres. Windows usa Edge; Linux necesita `npx playwright install chromium`. En Windows una prueba de reapertura/limpieza de SQLite tarda unos 30 s.

**Validación pública adicional: 1 E2E remota aprobada** mediante `npm run test:live` desde `app/` (34,7 s en esta ejecución). Inicia/reutiliza Vite en `http://localhost:3000`, no inicia backend local y verifica el destino predeterminado de la rama. Tiene su configuración separada `playwright.live.config.ts`; la suite E2E habitual excluye `*.live.spec.ts`, por lo que no escribe en producción. La suite remota crea cuentas ficticias y borra su alumno; quedan cuentas QA vacías por diseño. No ejecutarla automáticamente en CI ni guardar trazas con credenciales.

## Pruebas de integración que quedan a Floren

1. Comparar la rama con el `develop` vigente y resolver con el equipo cualquier cambio concurrente; no sustituir archivos completos sin revisar sus diferencias.
2. Repetir login → alumno → modo niño → juego → guardado → recarga → contraseña de salida → resultados, con dos cuentas aisladas y dos pestañas. Confirmar que notas y selector de alumnos no llegan al niño.
3. Recorrer ES/EN/FR/AR/UK en móvil y escritorio; cambiar idioma durante la partida y revisar ambos HTML descargados. Pseudónimos, notas libres y nombres nativos del selector permanecen intactos deliberadamente.
4. Publicar frontend en Netlify, comunicar su origen a Miguel para autorizarlo en Render y repetir la prueba desde el dominio final. API/BBDD **ya publicadas y validadas desde localhost**. Comprobar persistencia después de un reinicio/redeploy y ensayar con la red de Madrid. Seguir `despliegue-demo.md` antes de distribuir el QR.
5. Revisar el workflow de Pages y la CI al integrar. El workflow actual de Pages publica un frontend estático: **no ejecuta esta API**. La CI existente valida `app/`, pero aún no incorpora los tests del backend ni las E2E. No se cambiaron esos workflows en esta rama.

## Límites deliberados que no deben confundirse con regresiones

- Solo estado actual y última validación; el registro acumulado de juegos ya existente alimenta el informe, pero no hay versiones históricas de evaluaciones.
- Sin recuperación de contraseña ni verificación de identidad profesional. Cada asistente de la demo debe crear su propia cuenta ficticia.
- Token opaco en sessionStorage: recargar conserva la sesión, cerrar la pestaña normalmente la pierde y una pestaña independiente pide login. Una pestaña duplicada puede compartir token. Es accesible al JavaScript del mismo origen; no introducir scripts de terceros ni asumir protección frente a XSS. Caduca a las 8 horas y logout lo revoca en servidor.
- El guardado pendiente vive en memoria; cerrar/recargar antes de confirmarlo puede perderlo. Un 409 exige cargar el estado remoto, sin fusionar automáticamente. Evitar partidas simultáneas del mismo alumno en varios dispositivos.
- Las notas editadas requieren pulsar «Guardar y validar» antes de navegar. No hay autoguardado del formulario de revisión.
- Máximo 50 alumnos/cuenta, 500 registros/alumno, 256 KiB por petición y 2000 caracteres de notas. Autenticación limitada por IP/ruta: probar la wifi del evento y los tiempos del hosting gratuito.
- Las observaciones de juego se guardan en español canónico para poder mostrarlas en cualquier idioma; **no es un fallo de traducción en la base**. Las antiguas observaciones reconocidas en cualquiera de los cinco idiomas también se traducen al mostrarlas. Texto libre o desconocido se conserva.
- La voz depende de las voces instaladas en el dispositivo. Los porcentajes son reglas del prototipo, no puntuaciones psicométricas validadas; el profesional decide.

La API no cambió durante el sprint de traducción; el sprint posterior de desacoplamiento cambió su transporte de autenticación y CORS, conservando los datos y permisos. Esta última entrega solo cambia el destino predeterminado del frontend, añade la prueba remota y actualiza documentación; no altera el backend desplegado ni sus tablas. Quedan a Floren la integración, la revisión entre zonas horarias y el merge; este documento no presupone su aprobación. Miguel ya publicó API/BBDD; Floren compila con el destino incorporado (o un override explícito) y comunica su origen para autorizarlo en la API.
