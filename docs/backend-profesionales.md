# Propuesta: cuentas e historial para profesionales

Estado: **propuesta para revisar**, no implementada ni desplegada. No cambia por sí sola la decisión de mantener la demo sin servidor. Complementa la issue #10; el endpoint de IA no proporciona autenticación ni historial.

## Punto de partida comprobado

La rama `feat/ingles-historial-profesional` parte de `deliainclusiveapps-patch-1`, commit `3f1c457` (Delia, 4 de noviembre de 2026).

- React 19 + TypeScript + Vite 8 + Tailwind 4. No hay backend ejecutable.
- `AppContext.tsx` guarda perfiles, telemetría y la última revisión en localStorage, compartido por todo el navegador. Cambiar a «profesional» es navegación, no autenticación.
- Cada alumno tiene `telemetryLog`: registros de actividades con fecha, métricas y observaciones. `generatePedagogicalAssessment` recalcula el informe desde esos registros mediante reglas locales; el nombre `aiPedagogy.ts` no implica una llamada a un modelo externo.
- `teacherValidation` guarda únicamente la revisión más reciente; no hay versiones anteriores, propietario profesional ni separación entre cuentas.
- Los porcentajes son reglas del prototipo, no medidas psicométricas validadas. No deben convertirse en decisiones automáticas ni diagnósticos.
- El prototipo incluye un service worker básico. Las funciones sin conexión necesitan una comprobación específica en producción; poder compilar como web estática no demuestra su cobertura offline.

## Alcance mínimo recomendado

Conservar el juego local. Añadir **FastAPI + SQLite** para una zona profesional conectada que permita:

1. Registrarse, iniciar sesión y cerrarla. Una cuenta corresponde a un profesional adulto, identificado por un nombre de usuario; no se pide información de alumnos durante el registro.
2. Registrar alumnos únicamente con pseudónimo y avatar. Cada alumno pertenece al profesional que lo registró.
3. Incorporar explícitamente resultados del dispositivo al expediente de un alumno. Mostrar qué alumno y cuántas actividades se enviarán; no subir automáticamente los perfiles locales ni los ejemplos.
4. Consultar actividades por fecha y guardar una evaluación revisada con notas educativas, acuerdos y versión del generador. Cada guardado crea una evaluación nueva.
5. Abrir evaluaciones anteriores sin recalcularlas ni sobrescribirlas. Se muestran fecha, evidencias utilizadas, revisión y versión.
6. Borrar el expediente y sus registros asociados. Explicar la diferencia entre borrar una copia local y borrar el expediente del servidor.

El acceso al servidor requiere conexión. El juego local sigue disponible sin cuenta; cerrar sesión debe retirar de la memoria y del almacenamiento local las copias del expediente remoto.

## Modelo de datos propuesto

| Tabla | Datos principales | Regla |
|---|---|---|
| `professionals` | UUID, usuario único normalizado, hash de contraseña, fecha de alta | Sin contraseñas en claro |
| `sessions` | hash del token aleatorio, profesional, caducidad | Revocación al cerrar sesión |
| `students` | UUID, propietario, pseudónimo, avatar, fecha de registro | No nombres reales, documentos ni datos de salud |
| `activity_events` | UUID del evento, alumno, fechas de actividad y recepción, identificador del juego, métricas permitidas | Único por alumno y UUID del evento; reenviar no duplica |
| `assessments` | UUID, alumno, profesional, fecha del servidor, versión del esquema y reglas, idioma, instantánea del informe, notas educativas y acuerdos | Nueva fila por revisión; no modificar evaluaciones anteriores |
| `assessment_events` | evaluación y eventos incluidos | Evidencias trazables para cada versión |

El servidor asigna el propietario desde la sesión, nunca desde un `ownerId` enviado por el navegador. Toda consulta debe filtrar por propietario, incluidos eventos y evaluaciones. Una cuenta ajena recibe 404 al consultar UUID ajenos.

La instantánea contiene los datos necesarios para reproducir la evaluación histórica: referencias a los eventos, métricas agregadas y textos del informe en el idioma guardado. Cambiar de idioma en la interfaz traduce la navegación; no reescribe el documento histórico. Una traducción del informe sería una vista derivada identificada como tal.

## Contrato de API propuesto

Prefijo `/api/v1`; JSON. Fechas ISO 8601 UTC. Validación de tamaños, tipos, rangos y claves admitidas en todos los cuerpos.

| Método y ruta | Función |
|---|---|
| `POST /auth/register` | `{ username, password }`; crea cuenta, devuelve usuario público |
| `POST /auth/login` | Verifica credenciales, crea sesión y establece cookie |
| `GET /auth/me` | Sesión actual y token CSRF para las operaciones de escritura |
| `POST /auth/logout` | Revoca sesión y elimina cookie |
| `GET /students?cursor=...&limit=...` | Alumnos del profesional, paginados |
| `POST /students` | `{ pseudonym, avatar }`; devuelve UUID remoto |
| `POST /students/{id}/events` | Lote acotado de eventos con UUID estable; operación idempotente |
| `GET /students/{id}/events?from=...&to=...&cursor=...` | Historial cronológico paginado |
| `POST /students/{id}/assessments` | `{ eventIds, language, agreements, educationalNotes }`; verifica propiedad, calcula y guarda instantánea |
| `GET /students/{id}/assessments?cursor=...` | Resumen paginado de evaluaciones |
| `GET /students/{id}/assessments/{assessmentId}` | Instantánea histórica y evidencias |
| `DELETE /students/{id}` | Borra expediente, eventos y evaluaciones en una transacción |

El informe guardado debe calcularse con reglas versionadas en el servidor. No se debe aceptar como evaluación verificada un JSON arbitrario calculado por el navegador. Las evidencias importadas se identifican como registros de juego aportados por ese dispositivo, no como hechos clínicamente comprobados.

Ejemplo de registro, usando solo pseudónimos:

```json
{ "pseudonym": "Zorro Azul", "avatar": "🦊" }
```

Para eventos, añadir `eventId` y `schemaVersion` al contrato actual de `GameTelemetry`. Guardar identificadores de observaciones y parámetros, no frases traducidas: así el historial conserva una evidencia estable y puede mostrarla en ES o EN sin traducir notas libres.

## Sesiones y despliegue

Propuesta de implementación: contraseña con Argon2 mediante `pwdlib`, token de sesión aleatorio y revocable guardado como hash en SQLite, y cookie `HttpOnly`, `Secure` en producción y `SameSite=Lax`. Las escrituras requieren además token CSRF y comprobación de origen. Añadir límite de intentos de acceso y respuestas genéricas a credenciales incorrectas.

FastAPI documenta el uso de `pwdlib` y Argon2 en su [guía de seguridad](https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/). Starlette documenta los atributos de cookies en su [referencia de middleware](https://www.starlette.io/middleware/). La elección de sesiones revocables almacenadas en servidor es una propuesta propia para este caso; no exige usar JWT ni guardar sesiones sensibles en el navegador.

Para reducir configuración, servir frontend y API desde el mismo origen con HTTPS. En desarrollo, Vite puede redirigir `/api` a FastAPI. GitHub Pages puede seguir alojando la demo local; no ejecuta FastAPI. Si se mantiene el panel en Pages y la API en otro origen, habrá que diseñar expresamente CORS, cookies y CSRF, y probar las restricciones de cookies entre sitios.

El service worker debe **excluir `/api/**` y cualquier respuesta autenticada**. El backend debe responder a datos privados con `Cache-Control: no-store`. Nunca almacenar tokens o expedientes remotos en la caché compartida de la PWA.

SQLite necesita disco persistente en el despliegue; un sistema de archivos efímero perdería el historial. Definir copia de seguridad, borrado y caducidad de sesiones antes de usar datos reales. Todo ejemplo y prueba debe usar pseudónimos y notas educativas ficticias sin datos de salud.

## Orden de implementación y aceptación

1. Cuenta y sesión: registro, login, logout, caducidad, rechazo de CSRF y límites de intentos.
2. Expedientes: crear/listar/borrar alumno; probar aislamiento con dos cuentas, incluso consultando UUID conocidos de la otra.
3. Importación: seleccionar alumno y eventos; probar reenvío sin duplicados, lotes inválidos, desconexión y reconexión.
4. Evaluaciones: guardar dos versiones, consultar ambas y demostrar que jugar otra vez o cambiar las reglas no modifica las anteriores.
5. Integración: vista de alumnos registrados, ficha con línea temporal de actividades y evaluaciones, apertura de una evaluación por fecha.
6. Verificar reinicio del servidor con persistencia, cierre de sesión en dispositivo compartido y que ninguna petición autenticada se cachea offline.

No implementar sincronización automática, expedientes compartidos entre centros ni grabación de voz en este primer alcance. El endpoint de IA de la issue #10 puede añadirse después, siempre como redacción opcional sobre evidencias y con revisión humana.

## Decisiones pendientes del equipo

- Aprobar la ampliación frente a la propuesta de demo solo frontend de `docs/decisiones.md`.
- Elegir el alojamiento con almacenamiento persistente y mismo origen para el panel.
- Concretar consentimiento para pasar del almacenamiento local al expediente remoto, conservación y quién puede registrar cuentas profesionales.
- Coordinar con Miguel la issue #10: generación de informes y cuentas/historial son trabajos relacionados pero distintos.
