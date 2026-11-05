# Datos, protección y seguridad del prototipo

Estado técnico al **5 de noviembre de 2026**. Complementa la [arquitectura](arquitectura.md), el [contrato de API](../backend/README.md) y la [política pública](../app/public/privacidad.html). Describe medidas implementadas y límites; no declara una auditoría, certificación ni cumplimiento legal completo.

## Identificación mínima y pseudónimos

El prototipo no solicita nombres reales, email, documentos, fotografías, grabaciones de voz, ubicación ni datos de salud. El profesional crea un usuario inventado —la interfaz lo llama «Usuario anónimo»— y registra alumnos mediante pseudónimo, avatar, idioma y edad opcional. Las cuentas y los expedientes tienen identificadores internos para relacionar propietario, sesión y alumno.

**Esto no garantiza anonimización irreversible.** Los pseudónimos, la edad y las observaciones podrían relacionarse con un niño mediante información adicional que conserve el centro. Es más preciso hablar de minimización de identificadores y datos asociados a pseudónimos que de «no almacenar nunca datos personales». El [Comité Europeo de Protección de Datos distingue pseudonimización y anonimización](https://www.edpb.europa.eu/topics/ai-and-technology/anonymisation-pseudonymisation_en): reducir el vínculo con una persona no implica eliminarlo completamente.

Los campos libres no detectan ni eliminan automáticamente información identificativa: no introducir datos reales, diagnósticos o situación administrativa en pseudónimos, comentarios ni notas. Para la demo y las pruebas se utilizan datos ficticios.

## Qué se almacena y dónde

| Información | Almacenamiento y finalidad |
|---|---|
| Usuario, ID y fecha de cuenta | Turso en la demo; identificar la cuenta profesional sin solicitar identidad real. |
| Contraseña | Solo sal aleatoria y derivación scrypt en `accounts.password_hash`. No se guarda su texto original. |
| Sesión | Token/caducidad en `sessionStorage`; en la BBDD solo SHA-256 del token, cuenta, modo, alumno y vencimiento. |
| Alumno | Pseudónimo, avatar, idioma, edad opcional, estrellas, niveles, insignias, visitas y registro de partidas en `students.profile`. |
| Registro de juego | Actividad, fecha, duración, intentos, métricas y observaciones automáticas; alimentan el informe. No es analítica de terceros. |
| Revisión profesional | Acuerdos con las observaciones y notas educativas, guardados en Turso como parte del perfil. |
| Comentario libre del niño | Solo `sessionStorage`, separado del perfil/API. Hasta 10 comentarios por alumno y 200 caracteres de texto; se borra al iniciar/cerrar sesión o manualmente. Puede incluirse en el informe exportado. |
| Idioma de interfaz | `localStorage`; no se usa ese almacenamiento para expedientes ni contraseñas. |
| Informes descargados | Archivos locales bajo control de quien los exporta. El borrado del alumno en la API no borra estas copias. |

No se envían expedientes a Claude ni a otro proveedor de IA. Los informes se calculan en el navegador con reglas locales y exportación HTML/PDF.

## Medidas de seguridad implementadas

- **Contraseñas hasheadas, no cifrado reversible:** scrypt con sal aleatoria de 16 bytes por contraseña (`N=32768`, `r=8`, `p=1`, salida de 64 bytes). La verificación utiliza `timingSafeEqual`. No hay contraseñas predeterminadas ni recuperación de la original.
- **Sesiones de servidor:** token opaco aleatorio de 256 bits, almacenado como SHA-256 en BBDD, con vencimiento de ocho horas. Logout revoca la sesión. No es JWT ni cookie de autenticación.
- **Autorización por propietario y modo:** cada profesional accede solo a sus alumnos. En niño, el servidor permite solo al alumno fijado y oculta notas profesionales; listado, CRUD y revisión profesional están protegidos. Salir exige contraseña comprobada por servidor.
- **Entrada y transporte:** Zod valida cuerpos; SQL usa parámetros. La demo pública usa HTTPS, lista exacta de orígenes CORS y respuestas de API `Cache-Control: no-store`. CORS no sustituye autenticación ni autorización.
- **Abuso y exposición:** límites de peticiones e intentos de autenticación, límites de tamaño/cantidad, errores sin SQL/trazas y logger de aplicación desactivado. El hash reduce el riesgo ante una filtración, pero no garantiza seguridad absoluta.
- **Interfaz:** CSP en el build de producción, escape de textos al generar HTML, logo incluido en los informes sin depender de un servidor de imágenes externo y retirada del antiguo service worker de caché.

Las credenciales de Turso permanecen únicamente en el servidor (`DATABASE_AUTH_TOKEN`); no se incluyen en variables `VITE_`, código público, informes ni archivos `.env` versionados. La URL pública de la API no es un secreto.

## Conservación y borrado actuales

El profesional puede borrar un alumno: la API elimina su perfil/progreso/revisión y las sesiones ligadas a ese alumno. No existe un calendario automático de eliminación de expedientes. El profesional debe gestionar las copias HTML/PDF y cualquier correspondencia externa entre pseudónimo y niño.

Las sesiones vencidas dejan de ser válidas a las ocho horas, pero no hay un job que borre cada fila justo al vencer: login limpia sesiones expiradas y logout elimina su token. No existe borrado de cuenta por autoservicio ni una interfaz para administrar copias de seguridad o retención del proveedor. Borrar una cuenta requiere un procedimiento administrativo privado pendiente de formalizar; el repositorio público no debe recibir expedientes ni contraseñas.

## Proveedores y límites pendientes

GitHub Pages sirve la web, Render ejecuta la API y Turso conserva la base. Aunque la aplicación no incluye anuncios ni analítica de terceros, los proveedores pueden registrar metadatos técnicos de conexión, como IP, conforme a sus políticas. No se ha verificado en este sprint su región efectiva, copias de seguridad o plazos de sus logs; se conservan como **TODO: verificar**.

El token del navegador es accesible al JavaScript del origen: `sessionStorage` no protege frente a XSS. Los datos del perfil en la BBDD no están cifrados campo a campo por la aplicación. No se ha realizado auditoría de seguridad, ensayo de carga ni certificación para uso escolar real o publicación en tiendas. El alcance no incluye consentimiento digital implementado, recuperación de cuentas, MFA, administración de centros ni ejecución offline.

Antes de usar datos de menores reales, el equipo/centro debe cerrar la identificación del responsable, contacto privado, condiciones de uso, base de legitimación y conservación aplicables, gestión de derechos y revisión de proveedores. Es trabajo pendiente de producción; el prototipo de hackathon con datos ficticios no lo sustituye.

## Cómo verificar estas afirmaciones

Código principal: `backend/src/security.ts` (hash/token), `app.ts` (permisos/validación/límites), `db.ts` (tablas), `app/src/utils/session.ts`, `childComments.ts`, `api.ts` y `main.tsx` (almacenamiento y caché).

Los tests de API comprueban aislamiento, modo niño, hashes de sesiones, caducidad, revocación y límites. Las E2E usan una API/base en memoria y verifican errores de red y que no se desbloquee profesional sin conexión. `test:live` es opt-in y no forma parte de la CI; no se deben enviar datos reales a ninguna prueba.
