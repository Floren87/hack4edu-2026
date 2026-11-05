# Integración frontend/API desacoplada · feat/backend

Implementada en esta rama por autorización de Miguel. La API ya está publicada en Render con BBDD Turso; esta rama la utiliza por defecto. Miguel autoriza preparar el PR contra `develop` después de validar. Floren realiza la reconciliación con las demás ramas y el merge. Contexto acumulado: [traspaso-floren.md](traspaso-floren.md). Publicación: [despliegue-demo.md](despliegue-demo.md).

## Contrato de conexión

- Frontend: por defecto **`https://hack4edu-2026.onrender.com/api`**, centralizada en `app/src/utils/apiConfig.ts`. `VITE_API_BASE_URL` permite cambiarla, por ejemplo a `http://localhost:3001/api` para desarrollo local. `.env.example` es una referencia: Vite no lo carga automáticamente. Un `.env.local` anterior puede sobrescribir el destino; revisarlo si se siguen viendo llamadas a localhost.
- Se acepta también el origen sin `/api`; se normaliza una vez. La URL se valida en la configuración de Vite y en el cliente. No admite credenciales, query, fragmentos ni `/api/health` como base; un frontend HTTPS rechaza una API HTTP.
- Backend: `ALLOWED_ORIGINS`, lista explícita separada por comas. Se puede autorizar localhost y el frontend público al mismo tiempo, sin comodines. `APP_ORIGIN` se mantiene solo como alias de compatibilidad; la lista nueva tiene prioridad.
- No hay proxy de Vite ni requisito de proxy en Netlify. `BACKEND_URL` dejó de utilizarse. Las llamadas del navegador van directamente a la API configurada.
- Cambiar la URL requiere reiniciar Vite o reconstruir el frontend. Añadir un origen nuevo requiere actualizar la configuración del backend y reiniciarlo/republicarlo; no exige un cambio de código.

## Sesión Bearer

1. `POST /api/auth/register` crea la cuenta. El frontend llama después a `/auth/login`.
2. Login devuelve `{ token, expiresAt, account, mode, studentId }`. Es un token opaco aleatorio, no un JWT; en BBDD solo se conserva su SHA-256. Caducidad: 8 horas, sin renovación automática.
3. El cliente persiste **solo token y caducidad en `sessionStorage`**, con una clave asociada a la URL de API. Nunca guarda contraseña, expedientes ni notas. La preferencia de idioma continúa en localStorage.
4. Todas las peticiones autenticadas envían `Authorization: Bearer <token>`, con `credentials: 'omit'` y `cache: 'no-store'`. La API no emite cookies ni autentica mediante cookies o parámetros de URL. No se usa `X-CSRF-Token`: la credencial ya no se adjunta automáticamente por el navegador.
5. `GET /auth/me` recupera modo, cuenta, alumno activo y caducidad; no vuelve a devolver el token. La carga de alumnos se hace según el modo. Sin sesión se muestra login; un fallo de conexión con sesión conserva la credencial para reintentar.
6. `401 LOGIN_REQUIRED` elimina la credencial y retira los expedientes de la UI. Contraseña incorrecta (`INVALID_CREDENTIALS`), 409 o caída de red no eliminan una sesión válida. Una respuesta antigua no borra un login nuevo.
7. Logout revoca la sesión en BBDD, elimina la credencial del cliente y notifica a otras pestañas, sin transmitir el token por BroadcastChannel.

`sessionStorage` conserva la sesión al recargar. Una pestaña nueva independiente pide login; duplicar una pestaña o abrirla con `window.open` y opener puede copiar su sesión. Si comparten token, comparten el modo del servidor y la revocación. Sesiones independientes permanecen independientes. Las notificaciones provocan consulta de `/auth/me`, no un cambio de rol por un booleano local.

**Límite de seguridad explícito:** el token es accesible al JavaScript del mismo origen. `sessionStorage` reduce la persistencia frente a localStorage, pero no protege de XSS. No añadir scripts de terceros ni insertar notas/pseudónimos como HTML. La exportación mantiene el escape de datos. Una revisión de arquitectura para producción real queda fuera del alcance de esta demo.

## Módulos relevantes

| Módulo | Responsabilidad |
|---|---|
| `app/src/utils/apiConfig.ts` | Normaliza y valida la URL pública |
| `app/src/utils/session.ts` | Valida almacenamiento y caducidad de la credencial |
| `app/src/utils/api.ts` | Fetch, Bearer, errores y retirada de sesión inválida |
| `app/src/context/AppContext.tsx` | Sesión, modo, alumnos, carga y guardado serializado |
| `backend/src/config.ts` | Lista de orígenes y compatibilidad del entorno anterior |
| `backend/src/app.ts` | CORS/preflight, autenticación y autorización de cada ruta |
| `backend/src/db.ts` | Esquema SQLite/libSQL compatible con los datos existentes |

## Datos y permisos conservados

- Profesional: CRUD y resultados/resumen familiar; edición de metadatos mediante `PUT /students/:id` con versión.
- Niño: solo juegos del alumno activo. El backend oculta notas y rechaza listados, CRUD y revisión; salir sigue exigiendo contraseña.
- Progreso agrupado y serializado en memoria, sin cola offline; se muestran los estados guardando/guardado/error y se esperan escrituras antes de cambiar de modo o salir.
- Un 409 no se fusiona automáticamente: exige cargar el estado remoto. Cerrar/recargar antes de confirmar puede perder cambios pendientes. No jugar simultáneamente con el mismo alumno desde varios dispositivos.
- La última revisión se guarda explícitamente; notas editadas sin guardar requieren pulsar Guardar antes de navegar.
- No se importan perfiles de muestra ni se conservan expedientes en el navegador. No se registra un service worker de caché; se retira el antiguo.
- Estilos y ES/EN/FR/AR/UK conservados; informes generados por reglas locales. Guía de idiomas: [i18n.md](i18n.md).

## Actualización desde la versión de cookies

Actualizar frontend y backend a este contrato antes de probarlos juntos. Clientes antiguos con cookies/CSRF deben volver a iniciar sesión con la nueva UI. No borrar la base: cuentas y alumnos siguen siendo compatibles. La columna antigua `sessions.csrf_token` se conserva vacía para evitar una migración destructiva; ya no participa en autenticación.

## Validación requerida

Las E2E usan **frontend `http://localhost:3100` y API `http://127.0.0.1:3101`**, sin proxy, con base en memoria. Cubren CORS real, login, reload, revocación, pestañas, CRUD, niño, guardado/conflictos y juegos/informes en los cinco idiomas. Instalar dependencias de ambos directorios y dejar libres ambos puertos.

Además existe **`npm run test:live`** en `app/`: opt-in, separado de `npm run test:e2e`, inicia/reutiliza frontend en `http://localhost:3000` y usa el destino público predeterminado, sin iniciar backend local. Validó registro, CRUD, progreso, recarga/nuevo login, permisos niño/profesional, contraseña de salida, aislamiento entre dos cuentas y ambos HTML en árabe RTL contra Render/Turso. Crea cuentas ficticias `qa-*`, elimina su propio alumno y revoca las sesiones. Quedan cuentas QA vacías porque no existe endpoint de borrado de cuentas. No usar datos reales ni ejecutar esta suite automáticamente en CI; las E2E normales usan memoria y no escriben en Render. No se guardan trazas con credenciales.

**Actualización 5 de noviembre:** el destino final es GitHub Pages, `https://floren87.github.io/hack4edu-2026/`. Miguel cambió en Render la rama eliminada `feat/backend` por `develop` y guardó `ALLOWED_ORIGINS=http://localhost:3000,https://floren87.github.io`. El redeploy está Live y el preflight público devuelve 204 con el origen correcto. Quedan la aprobación/merge del PR #24 por el equipo y la prueba desde Pages una vez publicado. El ajuste de 60 intentos/minuto de `fix/demo-api-render` requiere integrar y desplegar ese commit; no asumir que el redeploy previo ya lo incluye. No se crearon cuentas remotas durante esta comprobación.
