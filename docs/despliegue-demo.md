# Despliegue gratuito para la demo

Guía verificada contra documentación oficial el **4 de noviembre de 2026**. Se han probado API y base local; **no se han creado cuentas de hosting ni realizado un despliegue remoto**. Las condiciones de los planes pueden cambiar: comprobar los enlaces antes de publicar y elegir explícitamente las opciones gratuitas.

## Arquitectura elegida

**Render Free Web Service (Node) + base remota libSQL en el plan gratuito de Turso.** Render sirve el build React y `/api` desde un mismo origen HTTPS. El token de Turso existe solo en el servidor. No usar GitHub Pages para el recorrido conectado: tendría otro origen y no ejecuta el backend.

La documentación de [Render Free](https://render.com/docs/free) indica suspensión tras 15 minutos sin tráfico y sistema de archivos efímero. Por eso la base no puede ser `demo.db` dentro de Render: los datos persistentes van a Turso. Consultar el [plan gratuito de Turso](https://turso.tech/pricing) y la [referencia TypeScript/libSQL](https://docs.turso.tech/sdk/ts/reference). No se promete disponibilidad continua ni capacidad ilimitada; esto es una opción para el prototipo.

## 1. Preparar la base persistente

1. Crear una cuenta en Turso y elegir el plan gratuito disponible.
2. Crear una base compatible con **libSQL** para la demo. El cliente de este proyecto es `@libsql/client`; no configurar una base de otro motor/protocolo.
3. Obtener la URL `libsql://...` y generar un token de acceso a esa base siguiendo el [inicio rápido oficial](https://docs.turso.tech/sdk/ts/quickstart).
4. Guardar URL y token en el gestor de secretos del hosting. No poner el token en commits, capturas, frontend ni variables con prefijo `VITE_`.
5. El backend inicializa las tres tablas al primer arranque. No requiere crear alumnos ni usuarios en la consola ni ejecutar SQL manual.

## 2. Crear el servicio de Render

Según la [guía de Web Services](https://render.com/docs/web-services):

1. Crear **Web Service**, conectar este repositorio y seleccionar `feat/backend` para probar (o `develop` cuando se fusione el PR).
2. Runtime: **Node**, Root Directory: vacío (raíz del repositorio), plan: **Free**, una sola instancia.
3. Build Command:

```sh
npm --prefix backend ci --include=dev && npm --prefix backend run build && npm --prefix app ci --include=dev && npm --prefix app run build
```

`--include=dev` es intencionado: con `NODE_ENV=production`, npm puede omitir TypeScript y las herramientas necesarias para compilar.

4. Start Command:

```sh
npm --prefix backend start
```

5. Configurar variables:

| Variable | Valor |
|---|---|
| `NODE_VERSION` | `22` (versión disponible de Node 22 que sea ≥22.12; comprobarla en los logs) |
| `NODE_ENV` | `production` |
| `HOST` | `0.0.0.0` |
| `APP_ORIGIN` | URL pública exacta del servicio: `https://NOMBRE.onrender.com`, sin `/` final |
| `DATABASE_URL` | URL real `libsql://...` de la base |
| `DATABASE_AUTH_TOKEN` | Token real de Turso, marcado como secreto |
| `STATIC_DIR` | `../app/dist` (npm ejecuta el servidor desde `backend/`) |

Render proporciona `PORT`: no fijarlo a 3001. Si la URL pública no está disponible hasta crear el servicio, crear primero, obtener la URL, corregir `APP_ORIGIN` y volver a desplegar. Un origen incorrecto impide las escrituras; nunca usar `*` como solución.

6. Configurar Health Check Path: `/api/health`.
7. Desplegar y comprobar `https://NOMBRE.onrender.com/api/health` → `{ "ok": true }`.
8. Abrir la URL raíz: debe servir la aplicación. Probar cuentas con los pasos de integración antes de distribuirla.

**Estado de esta rama:** frontend integrado con la API. Publicar esta versión habilita login, CRUD de alumnos, resultados y modo niño. Antes de compartir el QR, comprobar el recorrido completo contra la base remota; esta sesión solo verifica el entorno local.

## 3. Comprobación antes del QR

- Registro y login desde el dominio final HTTPS, con un usuario inventado nuevo.
- Crear un alumno con pseudónimo, completar un juego, guardarlo y volver a consultar su estado.
- Activar modo niño, recargar, intentar volver con contraseña incorrecta y después con la correcta.
- Probar otra cuenta en ventana privada: no ve alumnos de la primera.
- Reiniciar/redeploy del servicio y verificar que el estado persiste en Turso.
- Verificar que no hay service worker cacheando `/api`; la aplicación retira el worker antiguo al arrancar. `Cache-Control: no-store` por sí solo no evita que código de un worker haga `cache.put`.
- Probar en móvil con datos, no solo desde la wifi del equipo.
- Generar el QR con la URL raíz del servicio integrado, no `/api/health` ni el enlace antiguo de Pages.

## 4. Día de la sustentación

Abrir el prototipo y `/api/health` unos minutos antes para que el servicio salga de suspensión. El primer acceso tras inactividad puede tardar; no prometer arranque instantáneo. No configurar tráfico artificial permanente para eludir restricciones del plan.

El público se registra con usuarios inventados y usa alumnos ficticios. No hay recuperación de contraseña ni verificación profesional. Los límites de autenticación son por IP: muchas personas en una misma wifi pueden recibir 429; probar el tamaño esperado del grupo antes del evento, permitir reintentar al minuto o usar redes independientes. No desactivar los controles para la exposición.

Guardar como respaldo un vídeo corto del recorrido y la demo local. Si se agota una cuota gratuita, el servicio externo falla o el frontend no está integrado, informar al público y mostrar ese respaldo; no afirmar que los datos se han guardado.

Después de la demo, retirar o limpiar los datos de prueba y revocar el token de la base si se abandona el despliegue. Las copias/retención del proveedor dependen de su plan: no prometer borrado de backups inmediato.
