# Integración del frontend · siguiente paso

Estado: **diseño pendiente de implementar**. Esta rama no cambia ningún archivo de `app/`. Backend operativo y contrato en `backend/README.md`. La UI actual continúa siendo una demo local; sus botones de roles todavía no utilizan la sesión del servidor.

## Alcance aprobado

Una cuenta profesional con usuario inventado y contraseña, alumnos con pseudónimos, estado actual por alumno y alternancia profesional/niño en la misma sesión. Sin sincronización offline, recuperación por email, instituciones, historial de evaluaciones ni IA externa.

## Cambios por archivo

| Área | Cambio necesario |
|---|---|
| `src/context/AuthContext.tsx` (nuevo) | Inicializar con `/api/auth/me`; mantener cuenta, modo, alumno activo y CSRF solo en memoria. Separar «cargando» de «sin sesión» para no mostrar datos anteriores mientras se consulta |
| `src/utils/api.ts` (nuevo) | `fetch('/api/...', { credentials: 'include' })`; JSON, cabecera CSRF para escrituras, manejo común de 400/401/403/409/413/429 y fallos de conexión |
| Pantallas de acceso (nuevas) | Registro y login ES/EN: usuario inventado y contraseña, sin identidad real; aclarar ausencia de recuperación. Registro seguido de login explícito |
| `AppContext.tsx` | Cargar alumnos desde servidor; crear alumno vía API y usar UUID devuelto. No inicializar cuentas reales con `INITIAL_PROFILES`. Mantener en memoria `version` por alumno |
| `Navbar.tsx` | Modo profesional muestra alumnos y «Comenzar juego con…». Modo niño oculta profesional, familia, selector de alumno y gestión; muestra solo «Volver al profesional» |
| Modal de salida (nuevo) | Solicitar contraseña y llamar `/mode/professional`. Limpiar la contraseña tras usarla. No desbloquear por un booleano local ni guardar un PIN |
| `ProfileManager.tsx` | Crear/listar/borrar alumnos remotos. Informar que el borrado elimina su estado actual; no hay recuperación |
| `ChildHome`, juegos y mundos | Conservar UI y mecánicas. Guardar el estado final a través de `/students/:id/progress`, incluyendo visitas a mundos, estrellas, niveles e insignias |
| `TeacherDashboard.tsx` | Conservar cálculo por reglas y panel actual. Guardar última revisión con `/review`. No añadir gráficas ni histórico de evaluaciones |
| `FamilyPortal.tsx` | Accesible solo en modo profesional para evitar exponer expedientes desde modo niño |
| `main.tsx`, `index.html`, `public/sw.js` | Desactivar el registro de PWA/service worker para el recorrido conectado y retirar el worker antiguo de este sitio. Nunca cachear `/api`, aunque devuelva `no-store` |
| `vite.config.ts` | Proxy de desarrollo `/api` → `http://127.0.0.1:3001`. Abrir la UI en `http://localhost:3000`, coincidente con `APP_ORIGIN` |

## Flujo de sesión y carga

1. Consultar `/auth/me`. 401 lleva a login. Un error de red muestra «No se pudo conectar» con reintento; no se interpreta como cierre de sesión ni carga ejemplos.
2. En profesional, consultar `/students`, seleccionar alumno y cargar su estado. Si está vacío, ofrecer crear el primero.
3. Antes de entrar al niño, terminar cualquier guardado pendiente. Llamar `/mode/child` con UUID y confirmar la respuesta; después retirar de la memoria los demás alumnos y las notas. Obtener el alumno activo con `/students/:id` (respuesta sin revisión profesional).
4. Recargar una pestaña mantiene el modo del servidor. En niño no llamar al listado de alumnos ni habilitar accesos por URL. Un `403 PROFESSIONAL_REQUIRED` también debe cerrar cualquier vista profesional abierta en otra pestaña.
5. Salir requiere `/mode/professional` con contraseña correcta; entonces recargar el listado y las notas, que el estado de niño no contiene. Contraseña incorrecta mantiene el modo niño.
6. Logout elimina estado en memoria; no guardar copias remotas en localStorage, IndexedDB ni cache del navegador. Otras pestañas pueden notificar cambio con BroadcastChannel, pero la autoridad sigue siendo la API.

## Guardado del estado actual

- La interfaz debe indicar «Guardando», «Guardado» o «No guardado; reintentar». No mostrar éxito antes del 200 del servidor.
- Serializar escrituras por alumno. Un juego actual dispara `logGameTelemetry`, `addStars` y a veces insignias en actualizaciones separadas: coalescer el estado final antes de enviar, para no mandar versiones incompatibles ni perder estrellas.
- Enviar la instantánea completa de los campos aceptados por `/progress`, no todo el objeto del contexto. Nunca incluir `teacherValidation`, propietario o UUID en el cuerpo.
- El backend devuelve solo `{version}`. Conservar el estado enviado y esa versión, o recargar el alumno antes de otra modificación.
- Error 409: cargar estado del servidor y ofrecer continuar desde él; no aplicar automáticamente un cambio local sobre la nueva versión. Cambiar de dispositivo simultáneamente no incluye fusión.
- Caída de red: conservar solo el intento actual en memoria y permitir reintentar; bloquear cambios de alumno/modo mientras no se haya guardado o descartado explícitamente. No implementar cola offline persistente. Recargar antes de guardar puede perder ese intento: explicar el estado sin prometer sincronización.
- Tras nuevo progreso, `reviewed=false`; las notas anteriores permanecen como borrador para revisión. `/review` sustituye la última validación.
- Identificar explícitamente «pseudónimo», no pedir nombre real. Notas exclusivamente educativas, sin datos de salud. `gender` es opcional en el frontend y el alta backend no lo solicita.

## Pruebas de aceptación de la integración

1. Dos cuentas en contextos de navegador separados ven únicamente sus propios alumnos.
2. Registro → login → alumno → juego completo → guardar → recargar → mismo progreso y panel.
3. Modo niño: recargar y visitar rutas directamente no abre panel ni permite otro alumno; contraseña incorrecta no desbloquea.
4. Guardar notas en dos alumnos no las mezcla. Una nueva partida marca revisión pendiente y conserva notas.
5. Cerrar sesión y entrar con otra cuenta no muestra perfiles ni notas de la anterior.
6. Cortar conexión y provocar un 409 muestran estados recuperables y no un falso «Guardado».
7. DevTools confirma ausencia de service worker controlando el recorrido y de respuestas `/api` cacheadas.
8. ES/EN, móvil y navegador de escritorio. La misma URL HTTPS sirve UI y API en producción.

## Demo pública

Cada asistente crea su propia cuenta y pseudónimos ficticios. No compartir una cuenta entre todo el público: la sesión y modo serían confusos y los alumnos quedarían mezclados. El código no puede comprobar que un usuario es docente: es un registro autodeclarado para la demo, sin verificación profesional.
