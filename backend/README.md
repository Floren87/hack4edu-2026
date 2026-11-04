# Backend · demo conectada

Implementado en `feat/backend`, desde `develop`. El frontend **no está modificado ni integrado** en esta rama. La propuesta antigua de FastAPI e historial versionado queda sustituida por este alcance aprobado: TypeScript, una cuenta profesional, alumnos con pseudónimo, estado actual y modo niño protegido por contraseña.

## Arranque

Node 22.12+ (probado localmente con 26.13). Desde la raíz:

```powershell
cd backend
npm ci
Copy-Item .env.example .env
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
- Contraseña con scrypt y sal aleatoria. La sesión es un token aleatorio de 256 bits, guardado como SHA-256 en la base. Caduca a las 8 horas, sin renovación automática. Login sustituye la sesión de ese navegador; logout la revoca. No se guardan tokens en localStorage.
- Cookie HttpOnly, SameSite=Lax y Secure en producción (`__Host-talento`). Token CSRF de sesión por cabecera y comprobación de `Origin` en toda escritura, incluido login/registro.
- 300 peticiones/minuto por IP; registro, login y salida del modo niño limitados a 10/minuto por ruta/IP. Contadores en memoria para una sola instancia; reiniciar los reinicia. Producción confía solo en el proxy inmediatamente anterior (un salto); revisar si cambia la topología de despliegue.
- No se registran cuerpos, credenciales, pseudónimos ni notas en logs de aplicación. Los errores internos no exponen consultas SQL ni trazas. Las respuestas de API llevan `Cache-Control: no-store`.
- Límites deliberados para la demo: 50 alumnos/cuenta, cuerpo de petición de 256 KiB, 500 registros de juego/alumno, notas profesionales de 2000 caracteres. No se elimina evidencia automáticamente; el frontend deberá informar del límite.
- Los informes siguen siendo observaciones orientativas calculadas por las reglas existentes del frontend. El backend valida y guarda el estado, **no certifica que las métricas enviadas por el dispositivo sean verdaderas**. No se usa para clasificar alumnos ni tomar decisiones automáticas.

## Configuración

| Variable | Uso |
|---|---|
| `PORT` | 3001 por defecto; Render proporciona su propio puerto |
| `HOST` | 127.0.0.1 local; 0.0.0.0 en Render |
| `APP_ORIGIN` | Origen exacto del frontend, sin `/` final ni comodines. Local: `http://localhost:3000` |
| `DATABASE_URL` | Local: `file:./demo.db`; producción: URL `libsql://` de Turso |
| `DATABASE_AUTH_TOKEN` | Solo servidor; requerido con la base remota en producción |
| `NODE_ENV` | `production` activa cookies seguras y obliga a configurar origen HTTPS y base remota |
| `STATIC_DIR` | Opcional. Directorio del build del frontend. Desde backend: `../app/dist` |

La configuración local presupone abrir la UI en **localhost:3000**. `127.0.0.1:3000` es otro origen: no deben alternarse. Lo más sencillo al integrar será usar proxy `/api` en Vite. No usar `VITE_DATABASE_AUTH_TOKEN`, ni añadir secretos al bundle.

## API

Prefijo `/api`. Cuerpos JSON. Los errores devuelven `{ "error": "CODIGO" }`. Las fechas son ISO 8601 UTC.

Tras login, conservar `csrfToken` en memoria y enviar `credentials: 'include'` en todas las peticiones. Toda escritura autenticada necesita `X-CSRF-Token`. El navegador establece `Origin` automáticamente; clientes de consola deben enviarlo expresamente. Al recargar, `GET /auth/me` recupera la sesión, su modo y el token CSRF.

| Método y ruta | Cuerpo / resultado | Acceso |
|---|---|---|
| `GET /health` | `{ ok: true }`, comprueba conexión a base | Público |
| `POST /auth/register` | `{ username, password }` → 201 `{ registered: true }` | Público; no inicia sesión |
| `POST /auth/login` | `{ username, password }` → `{ account: {id,username}, mode, studentId, csrfToken }` + cookie | Público |
| `GET /auth/me` | Mismo estado de sesión que login, sin emitir otra cookie | Autenticado |
| `POST /auth/logout` | Sin cuerpo → `{ loggedOut: true }` | Ambos modos |
| `GET /students` | `{ students: [{ student, version, updatedAt }] }` | Profesional |
| `POST /students` | `{ nameOrAlias, avatar, preferredLanguage?, age? }` → 201 `{ student, version: 0, updatedAt }` | Profesional |
| `GET /students/:id` | `{ student, version, updatedAt }` | Profesional propietario, o niño activo |
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

En modo niño `/students/:id` devuelve `teacherValidation` vacío y solo permite el alumno activo. Listar alumnos, crearlos, borrarlos, cambiar de alumno y guardar revisiones están bloqueados. El modo se guarda en servidor y sobrevive a recargar. Afecta a todas las pestañas que comparten esa cookie; otras sesiones del profesional permanecen independientes. Logout sigue permitido; volver a autenticarse requiere contraseña.

Errores relevantes: 400 `INVALID_INPUT`, 401 `LOGIN_REQUIRED`/`INVALID_CREDENTIALS`, 403 `ORIGIN_NOT_ALLOWED`/`CSRF_REQUIRED`/`PROFESSIONAL_REQUIRED`, 404 `STUDENT_NOT_FOUND`, 409 `USERNAME_UNAVAILABLE`/`VERSION_CONFLICT`/`STUDENT_LIMIT`, 413 `BAD_REQUEST` (cuerpo excesivo), 429 `RATE_LIMITED`. Fallos inesperados: 500 `INTERNAL_ERROR`.

## Prueba manual sin modificar frontend

En PowerShell, con la API arrancada y `.env` por defecto:

```powershell
$demoOrigin = 'http://localhost:3000'
$demoApi = 'http://localhost:3001/api'
$demoCredentials = @{ username = 'orientador-demo'; password = 'elige-una-clave-propia' } | ConvertTo-Json
Invoke-RestMethod "$demoApi/auth/register" -Method Post -Headers @{ Origin = $demoOrigin } -ContentType 'application/json' -Body $demoCredentials
$demoLogin = Invoke-RestMethod "$demoApi/auth/login" -Method Post -Headers @{ Origin = $demoOrigin } -ContentType 'application/json' -Body $demoCredentials -SessionVariable demoSession
$demoHeaders = @{ Origin = $demoOrigin; 'X-CSRF-Token' = $demoLogin.csrfToken }
$demoStudent = @{ nameOrAlias = 'Zorro Azul'; avatar = '🦊' } | ConvertTo-Json
Invoke-RestMethod "$demoApi/students" -Method Post -Headers $demoHeaders -WebSession $demoSession -ContentType 'application/json; charset=utf-8' -Body ([Text.Encoding]::UTF8.GetBytes($demoStudent))
Invoke-RestMethod "$demoApi/students" -WebSession $demoSession
```

La contraseña es un ejemplo para reemplazar, no una cuenta precreada. Repetir el registro del mismo usuario devuelve 409. No volcar cookies, respuestas de login ni credenciales en logs o capturas.

## Integración y publicación

- [Cambios del frontend pendientes](../docs/integracion-backend.md).
- [Guía de despliegue gratuito](../docs/despliegue-demo.md).
- Esquema de datos y validación: `src/db.ts` y `src/schemas.ts`.
- Pruebas de aislamiento, permisos, persistencia, sesiones y despliegue estático: `tests/api.test.ts`.
