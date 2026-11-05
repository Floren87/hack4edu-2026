# Backend · demo conectada

Implementado en `feat/backend`, desde `develop`. El frontend está integrado: login inicial, CRUD de alumnos en modo profesional y juegos aislados en modo niño. La propuesta antigua de FastAPI e historial versionado queda sustituida por este alcance aprobado: TypeScript, una cuenta profesional, alumnos con pseudónimo, estado actual y modo niño protegido por contraseña.

## Arranque

Node 22.12+ (probado localmente con 26.13). Desde la raíz:

```powershell
cd backend
npm ci
Copy-Item .env.example .env # solo la primera vez; no sobrescribir un archivo existente
npm run dev
```

API en `http://127.0.0.1:3001/api/health`. No requiere claves para uso local. La base SQLite/libSQL local `backend/demo.db` se crea al arrancar y está ignorada por Git. No contiene usuarios de muestra ni contraseñas por defecto.

```powershell
npm run lint
npm test
npm run build
npm start
```

Las pruebas crean bases temporales, no utilizan datos reales ni el `.env` de desarrollo. En Windows el cierre de la base puede retrasar la limpieza de los archivos temporales.

## Decisiones KISS

- Fastify + TypeScript estricto; validación Zod. SQL parametrizado mediante `@libsql/client`, sin ORM ni servidor de base de datos local separado.
- Tres tablas: `accounts`, `sessions`, `students`. El estado de un alumno se guarda como un JSON compatible con la estructura actual del frontend; propietario y versión son columnas independientes. No hay historial de evaluaciones, tabla de eventos, sincronización ni IA externa.
- `CREATE TABLE IF NOT EXISTS` inicializa el esquema v1 de forma idempotente. No es un sistema de migraciones: futuros cambios de esquema necesitarán una migración explícita.
- Usuario normalizado de 3–32 caracteres `[a-z0-9_-]`; contraseña de 10–128 caracteres. No se solicita email, documento ni nombre real. Sin recuperación de contraseña en este MVP.
- Contraseña con scrypt y sal aleatoria. La sesión es un token opaco aleatorio de 256 bits, guardado como SHA-256 en la base; no es JWT. Caduca a las 8 horas, sin renovación automática. Login revoca el token anterior si se envía expresamente en Authorization; logout revoca la sesión actual. Otras sesiones permanecen independientes.
- Autenticación **solo con `Authorization: Bearer <token>`**; no se emiten ni aceptan cookies de sesión ni tokens por URL. El cliente usa `credentials: 'omit'`. No se utiliza CSRF porque no hay una credencial adjuntada automáticamente por el navegador. `Origin`, cuando está presente, debe pertenecer a la lista exacta permitida; CORS habilita Content-Type/Authorization y los preflight, sin credenciales de cookies.
- El frontend guarda solo token/caducidad en **sessionStorage**, asociado a la URL de API. Recargar conserva la sesión; una pestaña independiente pide login. El token es accesible al JavaScript del mismo origen: no protege contra XSS. No guardar expedientes o contraseñas allí ni introducir scripts de terceros. No hay tokens en localStorage.
- 300 peticiones/minuto por IP; registro, login y salida del modo niño limitados a **60/minuto por ruta/IP** para admitir el acceso simultáneo del público con el QR. El intento 61 devuelve `429 RATE_LIMITED` con `Retry-After`; no se desactiva la protección. Contadores en memoria para una sola instancia; reiniciar los reinicia. El plugin utiliza `request.ip`. En producción se confía solo en el proxy inmediatamente anterior (un salto): pruebas de inyección verifican clientes distintos tras el mismo proxy y que un prefijo falso de `X-Forwarded-For` no crea otra cuota. Esto no certifica la cadena real de proxies de Render; si hay varios saltos o usuarios tras la misma NAT, pueden compartir cuota. No cambiar a `trustProxy: true` ni tomar a ciegas la primera IP enviada por el cliente.
- No se registran cuerpos, credenciales, pseudónimos ni notas en logs de aplicación. Los errores internos no exponen consultas SQL ni trazas. Las respuestas de API llevan `Cache-Control: no-store`.
- Límites deliberados para la demo: 50 alumnos/cuenta, cuerpo de petición de 256 KiB, 500 registros de juego/alumno, notas profesionales de 2000 caracteres. No se elimina evidencia automáticamente; el frontend deberá informar del límite.
- Los informes siguen siendo observaciones orientativas calculadas por las reglas existentes del frontend. El backend valida y guarda el estado, **no certifica que las métricas enviadas por el dispositivo sean verdaderas**. No se usa para clasificar alumnos ni tomar decisiones automáticas.

## Configuración

| Variable | Uso |
|---|---|
| `PORT` | 3001 por defecto; Render proporciona su propio puerto |
| `HOST` | 127.0.0.1 local; 0.0.0.0 en Render |
| `ALLOWED_ORIGINS` | Orígenes exactos del frontend separados por comas, sin `/` final ni comodines. Ejemplo: `http://localhost:3000,https://TU-FRONTEND.netlify.app` |
| `APP_ORIGIN` | Alias de compatibilidad para un `.env` anterior. Solo se usa si no existe `ALLOWED_ORIGINS` |
| `DATABASE_URL` | Local: `file:./demo.db`; producción: URL `libsql://` de Turso |
| `DATABASE_AUTH_TOKEN` | Solo servidor; requerido con la base remota en producción |
| `NODE_ENV` | `production` exige base remota/token y lista de orígenes; solo HTTPS salvo HTTP loopback para pruebas desde localhost |
| `STATIC_DIR` | Opcional para servir archivos estáticos; **dejar sin configurar en el despliegue de API independiente** |

La configuración local presupone abrir la UI en **localhost:3000**. `127.0.0.1:3000` es otro origen: añadirlo explícitamente si se necesita. El frontend conecta directamente mediante `VITE_API_BASE_URL`; no requiere proxy. Solo esa URL es pública: no usar `VITE_DATABASE_AUTH_TOKEN`, ni añadir secretos al bundle. `ALLOWED_ORIGINS` autoriza también localhost contra una API pública HTTPS.

**Demo publicada por Miguel:** `https://hack4edu-2026.onrender.com/api`, con base libSQL en Turso. Es el destino predeterminado del frontend en esta rama. Para probar contra el backend local, definir `VITE_API_BASE_URL=http://localhost:3001/api` en `app/.env.local` y reiniciar Vite. El healthcheck público es `/api/health`, pero esa ruta no es una URL base. `ALLOWED_ORIGINS` de Render incluye `http://localhost:3000,https://floren87.github.io`; no incluir la ruta `/hack4edu-2026/`. No hace falta crear de nuevo la base ni sus tablas.

**Actualización 5 de noviembre:** el frontend final se publica en GitHub Pages: `https://floren87.github.io/hack4edu-2026/`. El origen autorizado es **`https://floren87.github.io`**, sin subcarpeta ni barra final. Miguel cambió la rama de Render a `develop` porque `feat/backend` fue eliminada al integrarse, y el preflight de Pages ya devuelve 204 con su origen permitido. Mantener una rama de despliegue estable. El ajuste de 60/min requiere integrar su PR y desplegar ese commit; ver [operación y comprobaciones](../docs/despliegue-demo.md).

## API

Prefijo `/api`. Cuerpos JSON. Los errores devuelven `{ "error": "CODIGO" }`. Las fechas de expedientes son ISO 8601 UTC; `expiresAt` es un timestamp Unix en **milisegundos**, no segundos.

Tras login, conservar `token` y `expiresAt` y enviar `Authorization: Bearer <token>` en peticiones autenticadas. El navegador establece `Origin` automáticamente; clientes de consola pueden omitirlo, pero necesitan el mismo Bearer para rutas protegidas. Al recargar, `GET /auth/me` recupera cuenta, modo, alumno activo y caducidad, **sin devolver otra vez el token**. Login es el único endpoint que entrega la credencial en bruto. Todas las respuestas `/api/` llevan `Cache-Control: no-store`.

| Método y ruta | Cuerpo / resultado | Acceso |
|---|---|---|
| `GET /health` | `{ ok: true }`, comprueba conexión a base | Público |
| `POST /auth/register` | `{ username, password }` → 201 `{ registered: true }` | Público; no inicia sesión |
| `POST /auth/login` | `{ username, password }` → `{ account: {id,username}, mode, studentId, token, expiresAt }` | Público |
| `GET /auth/me` | `{ account: {id,username}, mode, studentId, expiresAt }` | Autenticado |
| `POST /auth/logout` | Sin cuerpo → `{ loggedOut: true }` | Ambos modos |
| `GET /students` | `{ students: [{ student, version, updatedAt }] }` | Profesional |
| `POST /students` | `{ nameOrAlias, avatar, preferredLanguage?, age? }` → 201 `{ student, version: 0, updatedAt }` | Profesional |
| `GET /students/:id` | `{ student, version, updatedAt }` | Profesional propietario, o niño activo |
| `PUT /students/:id` | Metadatos del alta + `version` → `{ version: anterior+1 }` | Profesional |
| `PUT /students/:id/progress` | Estado de juego completo + `version` → `{ version: anterior+1 }` | Profesional propietario, o niño activo |
| `PUT /students/:id/review` | `{ version, agreements, teacherNotes }` → `{ version: anterior+1 }` | Profesional |
| `DELETE /students/:id` | `{ deleted: true }`; elimina también sesiones que estén jugando con él | Profesional |
| `POST /mode/child` | `{ studentId }` → `{ mode: 'child', studentId }` | Profesional |
| `POST /mode/professional` | `{ password }` → `{ mode: 'professional', studentId: null }` | Sesión vigente y contraseña correcta |

`student` conserva los nombres de campos actuales: `id`, `nameOrAlias`, `avatar`, `preferredLanguage`, `createdAt`, `age?`, `starsCount`, `unlockedLevels`, `unlockedBadges`, `worldVisits`, `telemetryLog`, `teacherValidation`. Se omite género al crear: no hace falta para jugar. El servidor asigna UUID, propietario y fechas; no acepta un propietario desde el cliente.

`progress` reemplaza únicamente los campos de juego:

```json
{
  "version": 0,
  "starsCount": 3,
  "unlockedLevels": { "logic_game": 2 },
  "unlockedBadges": [],
  "worldVisits": { "build": 1, "explore": 0, "create": 0, "help": 0, "organize": 0, "count": 0 },
  "telemetryLog": []
}
```

Cada elemento de `telemetryLog` sigue `GameTelemetry` de `app/src/types/index.ts` y se valida con `backend/src/schemas.ts`. Es el registro acumulado que consume el informe actual, no un historial nuevo de evaluaciones. Las claves desconocidas se rechazan. Las notas del profesional nunca se aceptan por `/progress`.

Una nueva escritura de progreso conserva notas y acuerdos, pero marca la revisión como pendiente (`reviewed=false`) y retira su fecha. Guardar `/review` sustituye la última validación, fecha asignada por el servidor. No hay versiones anteriores recuperables.

`version` evita pérdidas silenciosas al escribir desde pestañas distintas. Si hay 409 `VERSION_CONFLICT`, volver a cargar el alumno y pedir repetir/reconciliar el cambio; no reenviar ciegamente con una versión nueva. La API no implementa fusión automática.

En modo niño `/students/:id` devuelve `teacherValidation` vacío y solo permite el alumno activo. Listar alumnos, crearlos, borrarlos, cambiar de alumno y guardar revisiones están bloqueados. El modo se guarda en servidor y sobrevive a recargar con el mismo token. Pestañas duplicadas pueden compartir ese token y su modo; pestañas con sesiones independientes no se afectan. Logout sigue permitido; volver a autenticarse requiere contraseña.

Al actualizar desde la implementación de cookies hay que desplegar también el nuevo cliente y volver a iniciar sesión. **No borrar la BBDD:** cuentas y alumnos se conservan. `sessions.csrf_token` se mantiene como columna heredada, vacía en sesiones nuevas, para no exigir una migración destructiva.

Errores relevantes: 400 `INVALID_INPUT`, 401 `LOGIN_REQUIRED`/`INVALID_CREDENTIALS`, 403 `ORIGIN_NOT_ALLOWED`/`PROFESSIONAL_REQUIRED`, 404 `STUDENT_NOT_FOUND`, 409 `USERNAME_UNAVAILABLE`/`VERSION_CONFLICT`/`STUDENT_LIMIT`, 413 `BAD_REQUEST` (cuerpo excesivo), 429 `RATE_LIMITED`. Fallos inesperados: 500 `INTERNAL_ERROR`.

## Prueba manual sin modificar frontend

En PowerShell, con la API arrancada y `.env` por defecto:

```powershell
$demoOrigin = 'http://localhost:3000'
$demoApi = 'http://localhost:3001/api'
$demoCredentials = @{ username = 'orientador-demo'; password = 'elige-una-clave-propia' } | ConvertTo-Json
Invoke-RestMethod "$demoApi/auth/register" -Method Post -Headers @{ Origin = $demoOrigin } -ContentType 'application/json' -Body $demoCredentials
$demoLogin = Invoke-RestMethod "$demoApi/auth/login" -Method Post -Headers @{ Origin = $demoOrigin } -ContentType 'application/json' -Body $demoCredentials
$demoHeaders = @{ Origin = $demoOrigin; Authorization = "Bearer $($demoLogin.token)" }
$demoStudent = @{ nameOrAlias = 'Zorro Azul'; avatar = '🦊' } | ConvertTo-Json
Invoke-RestMethod "$demoApi/students" -Method Post -Headers $demoHeaders -ContentType 'application/json; charset=utf-8' -Body ([Text.Encoding]::UTF8.GetBytes($demoStudent))
Invoke-RestMethod "$demoApi/students" -Headers $demoHeaders
```

La contraseña es un ejemplo para reemplazar, no una cuenta precreada. Repetir el registro del mismo usuario devuelve 409. No volcar respuestas de login ni credenciales en logs o capturas. Para probar la API pública, cambiar `$demoApi` y autorizar `$demoOrigin` en el servidor.

## Integración y publicación

- [Contrato vigente de integración desacoplada](../docs/integracion-backend.md).
- [Guía de despliegue gratuito](../docs/despliegue-demo.md).
- Esquema de datos y validación: `src/db.ts` y `src/schemas.ts`.
- Pruebas de aislamiento, permisos, persistencia, Bearer, CORS/orígenes, revocación y despliegue estático opcional: `tests/api.test.ts`.
