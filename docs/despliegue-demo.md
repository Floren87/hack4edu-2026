# Despliegue de API y BBDD · Miguel

**Estado final después del PR #36 (5 nov):** frontend en Pages y API/BBDD externas, **solo online**. `main` contiene la integración y `develop` ya no existe. En esta sesión: `/api/health` responde 200 con CORS para Pages y una petición vacía de login devuelve 400 con `X-RateLimit-Limit: 60`, sin crear datos. Antes del próximo redeploy de Render, verificar Branch=`main`; no se modifica Render en esta entrega de documentación/logo. Los pasos de integración con `develop` de abajo son históricos. Arquitectura vigente: [arquitectura.md](arquitectura.md); límites de protección de datos: [datos-y-seguridad.md](datos-y-seguridad.md).

**Arquitectura vigente:** API TypeScript/Fastify en Render + base **libSQL** en Turso. El frontend lo publica Floren/Delia de forma independiente; no necesita proxy. También se puede usar el frontend de localhost contra la API pública.

**Estado al 4 de noviembre de 2026:** Miguel ya creó la BBDD Turso y publicó la API en **`https://hack4edu-2026.onrender.com/api`**. [Healthcheck público](https://hack4edu-2026.onrender.com/api/health) responde `200 {"ok":true}`. Esta rama usa esa API por defecto, sin `.env.local`. La prueba real en navegador desde `http://localhost:3000` validó cuentas, CRUD, persistencia tras recarga/nuevo login, modo niño, aislamiento y exportaciones árabes. Ver [traspaso y pruebas](traspaso-floren.md).

**Actualización 5 de noviembre:** el frontend definitivo es **GitHub Pages**, `https://floren87.github.io/hack4edu-2026/`. Miguel guardó `ALLOWED_ORIGINS=http://localhost:3000,https://floren87.github.io` y cambió en Render la rama eliminada `feat/backend` por **`develop`**. Tras confirmar el servicio Live, el preflight desde Pages devuelve **204** con `Access-Control-Allow-Origin: https://floren87.github.io`; una petición vacía de login devuelve 400 por validación, con CORS correcto. No se necesita recrear Turso ni implementar un proxy. Las referencias anteriores a Netlify eran una previsión sustituida por Pages.

**Ajuste de aforo de demo:** el PR de `fix/demo-api-render` eleva registro/login/salida del modo niño de 10 a **60/minuto por IP y ruta**, manteniendo 429 y Retry-After. La API publicada al comprobar CORS aún anunciaba 10: después de integrar el PR, desplegar el nuevo commit de `develop` y verificar el encabezado `X-RateLimit-Limit: 60`. No hacer una ráfaga de 61 intentos contra producción para comprobarlo; el límite se prueba localmente. El cambio no altera permisos, sesiones ni tablas. Documentación oficial de despliegue consultada también el **5 de noviembre de 2026**.

## 1. Crear la base en Turso

1. Registrarse y seleccionar el plan gratuito disponible en [Turso](https://turso.tech/pricing).
2. Crear una base **libSQL** para la demo, compatible con `@libsql/client`. La documentación de Turso distingue esa conexión de sus nuevos motores/SDK: seguir el apartado [Remote libSQL database: @libsql/client](https://docs.turso.tech/sdk/ts/quickstart). No cambiar las dependencias de este repositorio siguiendo un ejemplo de otro SDK.
3. Copiar la URL de conexión `libsql://…` y generar un token de lectura/escritura **de esa base**, con vigencia suficiente para la presentación. No usar un token de solo lectura: la API crea el esquema y guarda alumnos.
4. Guardar URL/token para configurarlos en Render. El token de BBDD nunca debe llegar al frontend, a Git ni a variables `VITE_`.

Si prefieres CLI, instalarla desde la [guía oficial](https://docs.turso.tech/cli/installation) y autenticarse. Los comandos documentados para crear base y token son:

```sh
turso db create talento-demo
turso db tokens create talento-demo --expiration 7d
```

El segundo comando imprime un secreto: copiarlo al gestor de secretos del hosting; no pegarlo en el chat ni en capturas. Obtener la URL en el panel de la base. Referencias: [crear base](https://docs.turso.tech/cli/db/create), [tokens y caducidad](https://docs.turso.tech/cli/db/tokens/create).

No hay que crear tablas manualmente. El primer arranque inicializa `accounts`, `sessions`, `students` e índices con `CREATE TABLE IF NOT EXISTS`. Una base nueva no contiene cuentas ni alumnos. `backend/demo.db` es solo la base local y **no se transfiere automáticamente**. Para la demo se recomienda empezar con datos ficticios nuevos.

## 2. Publicar solo la API en Render

Crear un **Web Service** desde el repositorio. Ver [despliegue Node](https://render.com/docs/deploy-node-express-app) y [servicios web](https://render.com/docs/web-services).

| Campo | Valor |
|---|---|
| Branch | **`main`** tras integrar el PR #36. Verificar en Render antes del próximo redeploy; `develop` y `feat/backend` fueron eliminadas. |
| Runtime | Node |
| Root Directory | `backend` |
| Build Command | `npm ci --include=dev && npm run build` |
| Start Command | `npm start` |
| Plan | Free, una sola instancia |
| Health Check Path | `/api/health` |

Las herramientas de TypeScript son dependencias de desarrollo: `--include=dev` evita que `NODE_ENV=production` las omita durante el build. No compilar `app/` ni configurar un proxy en este servicio.

Variables de entorno del servicio:

```dotenv
NODE_VERSION=22
NODE_ENV=production
HOST=0.0.0.0
ALLOWED_ORIGINS=http://localhost:3000,https://floren87.github.io
DATABASE_URL=libsql://URL-REAL-DE-TU-BASE
DATABASE_AUTH_TOKEN=TOKEN-REAL-SOLO-EN-RENDER
```

- Node debe ser **22.12 o posterior**; comprobar la versión efectiva en el log de build.
- Render proporciona `PORT`: no fijarlo a 3001.
- `DATABASE_AUTH_TOKEN` es secreto. No sustituirlo por el token de sesión de un usuario.
- Dejar `STATIC_DIR` sin configurar: este servicio solo publica la API.
- `APP_ORIGIN` es un alias de compatibilidad para el `.env` antiguo. La configuración vigente es `ALLOWED_ORIGINS`, que tiene prioridad.

La configuración sirve tanto a localhost como al frontend definitivo de Pages. Cualquier origen adicional requiere actualizar **solo la configuración de la API** y desplegar de nuevo:

```dotenv
ALLOWED_ORIGINS=http://localhost:3000,https://floren87.github.io
```

Son orígenes exactos, sin `/` final ni rutas. `localhost` y `127.0.0.1`, o dos puertos distintos, son orígenes diferentes. Añadirlos explícitamente si se necesitan. Producción admite HTTPS y HTTP únicamente para loopback (`localhost`, `127.0.0.1`, `[::1]`). No usar `*`, comodines de Netlify ni `null`. Un preview de Netlify requiere su propio origen autorizado.

Después de publicar, comprobar:

```powershell
Invoke-RestMethod https://hack4edu-2026.onrender.com/api/health
```

Debe devolver `ok: true`; esto comprueba también acceso a BBDD. La raíz `/` puede devolver 404: es correcto en un servicio que solo sirve API. Si falta la configuración remota, el servidor de producción se niega a usar SQLite local deliberadamente.

## 3. Usar tu frontend local contra la API desplegada

**No es necesario crear variables para la demo:** el valor predeterminado centralizado en `app/src/utils/apiConfig.ts` es la API publicada. `app/.env.example` también refleja su URL correcta. Si ya existe un **`app/.env.local`**, comprobar que no conserve un override antiguo a localhost ni termine en `/api/health`. Para fijar explícitamente el destino o usar otra API, editar ese archivo sin sobrescribir sus demás variables:

```dotenv
VITE_API_BASE_URL=https://hack4edu-2026.onrender.com/api
```

Desde `app/`:

```powershell
npm ci
npm run dev
```

Abrir `http://localhost:3000` (origen remoto ya comprobado). Tras cambiar la variable hay que reiniciar Vite. No hay proxy: DevTools debe mostrar llamadas directas a `https://hack4edu-2026.onrender.com/api/…` y preflight `OPTIONS` cuando corresponda. La URL también puede especificarse sin `/api`; el cliente lo añade una sola vez. Para volver al backend local, usar `VITE_API_BASE_URL=http://localhost:3001/api` e iniciar `backend/`.

Login devuelve una sesión Bearer que el cliente conserva en `sessionStorage`, nunca la contraseña. Sobrevive a recargar; una pestaña independiente requiere login. Cerrar sesión revoca el token en servidor. Las sesiones previas con cookie requieren volver a iniciar sesión tras actualizar; cuentas y alumnos existentes se conservan.

## 4. Lo único que necesita Floren para conectar su frontend

La URL pública ya está incorporada en la rama: **`https://hack4edu-2026.onrender.com/api`**. Floren puede compilar sin variables adicionales. Si prefiere definir explícitamente el destino en su build, usar:

```dotenv
VITE_API_BASE_URL=https://hack4edu-2026.onrender.com/api
```

La variable es pública y se incorpora al compilar. Cambiarla requiere reconstruir/republicar; no se modifica un bundle ya generado. Con base de proyecto `app`, el build es `npm run build` y el directorio publicado `dist`. No hace falta una regla de proxy para `/api`. Nunca configurar `DATABASE_AUTH_TOKEN` en Netlify.

Miguel añade el origen del frontend a `ALLOWED_ORIGINS` en Render. El frontend público y la API deben usar HTTPS. Para previsualizar un build local con `npm run preview` (habitualmente puerto 4173), añadir ese origen al backend; no asumir que comparte el origen de desarrollo.

Para **GitHub Pages**, el workflow del repositorio compila `app/` y publica su `dist`; la subcarpeta `/hack4edu-2026/` ya es compatible con el `base: './'` de Vite. Esa ruta no se incluye en `ALLOWED_ORIGINS`. Tras la aprobación y el merge del PR #24 por Floren, comprobar la web pública. No hacen falta variables secretas, proxy ni nueva BBDD. Si en el futuro se usa Netlify, añadir su origen exacto explícitamente; no usar `*`.

### Rama eliminada o deploy que no aplica Environment

En el servicio de Render: **Settings → Build & Deploy → Branch → `main` → Save**, y después **Manual Deploy → Deploy latest commit**. La variable guardada no cambia un proceso anterior hasta que se despliega correctamente; un deploy fallido deja el servicio previo atendiendo. Mantener `Root Directory=backend`, build y start de la tabla, y todas las credenciales de Turso existentes. No recrear ramas eliminadas para corregir el servicio. Este ajuste se coordina con Miguel; no se ha ejecutado desde este sprint de logo/documentación.

Comprobación mínima sin datos ni contraseñas:

```powershell
curl.exe -i -X OPTIONS https://hack4edu-2026.onrender.com/api/auth/login -H "Origin: https://floren87.github.io" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: content-type,authorization"
curl.exe -i -X POST https://hack4edu-2026.onrender.com/api/auth/login -H "Origin: https://floren87.github.io" -H "Content-Type: application/json" --data '{}'
```

La primera devuelve 204 y el origen permitido. La segunda devuelve 400 `INVALID_INPUT` porque no se envían credenciales; revisar su `X-RateLimit-Limit` para confirmar la versión del límite desplegada. Consume solo un intento, no crea cuentas. Fastify toma la cuota de `request.ip` y confía un salto en producción: se ha probado la selección con clientes simulados, no se ha inspeccionado ni registrado la IP real de asistentes. Referencias: [despliegues y rama enlazada](https://render.com/docs/deploys), [trustProxy en Fastify](https://fastify.dev/docs/latest/Reference/Server/#trustproxy) y [clave del rate limiter](https://github.com/fastify/fastify-rate-limit#options).

## 5. Validación antes de entregar el QR

1. Registro → login → alumno ficticio → juego → esperar «Guardado» → recargar. Verificar resultados persistidos.
2. Modo niño → recarga → contraseña incorrecta mantiene el bloqueo → contraseña correcta vuelve al profesional.
3. Notas, descarga de ambos informes y cambio de idioma. Otra cuenta no debe ver alumnos de la primera.
4. Reiniciar/redeploy de la API y comprobar que el alumno y su progreso siguen en Turso. La sesión vigente también debe funcionar hasta su caducidad, si conservas la pestaña.
5. Probar desde otro dispositivo o red, y repetir desde el dominio final del frontend antes de compartir el QR.
6. En DevTools confirmar `Authorization: Bearer …`, ausencia de cookies de autenticación y ninguna respuesta de API en caché. No incluir tokens en las capturas.

Errores frecuentes: `NETWORK` puede ser CORS, URL equivocada o servicio arrancando; revisar Network y `OPTIONS`. `ORIGIN_NOT_ALLOWED` requiere corregir la lista de orígenes. `401 LOGIN_REQUIRED` implica sesión ausente/caducada: volver a entrar. `409 VERSION_CONFLICT` exige cargar el estado remoto. `429` requiere esperar, no repetir peticiones en bucle.

**Automatización:** `npm run test:live` desde `app/` reproduce una prueba remota con datos ficticios y frontend en localhost:3000. Es opt-in, crea dos cuentas `qa-*` por ejecución completa, borra únicamente su alumno de prueba y revoca sus sesiones; quedan cuentas QA vacías porque no hay borrado de cuentas. `npm run test:e2e` se mantiene aislado en memoria y no escribe en Render. No se forzó un reinicio del servicio remoto durante esta validación; la comprobación de supervivencia a redeploy y la red de Madrid siguen siendo verificaciones operativas antes del QR.

## 6. Presentación y límites del plan gratuito

[Render Free](https://render.com/docs/free) suspende la API tras 15 minutos de inactividad y su disco es efímero. Abrir `/api/health` antes de presentar y esperar la respuesta; el arranque puede tardar aproximadamente un minuto. No guardar la BBDD en el disco del servicio ni configurar tráfico artificial permanente para evitar la suspensión. Revisar cuotas de [Render](https://render.com/docs/free) y [Turso](https://turso.tech/pricing) en las cuentas creadas.

Registro/login/desbloqueo tienen límites por IP/ruta; el público de una misma wifi puede compartirlos. Ensayar con la red del evento y conservar un vídeo de respaldo. No prometer capacidad ilimitada ni disponibilidad continua del plan gratuito.

Después de la demo, limpiar datos ficticios y revocar el token de BBDD si se abandona el servicio. La API se puede trasladar a otro hosting manteniendo Turso: basta reconfigurar la URL pública en los builds frontend y revisar los orígenes permitidos. El autoalojamiento de la API en Raspberry con túnel HTTPS es compatible con ese contrato, pero no se ha desplegado ni probado en ARM durante este sprint.
