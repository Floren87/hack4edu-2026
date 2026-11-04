# Registro de decisiones

Una línea por decisión, la más reciente arriba. Las IAs del equipo leen este fichero.

| Fecha | Decisión | Quién |
|---|---|---|
| 2026-11-04 | **Alcance aprobado en sesión:** backend TypeScript en `feat/backend`, basado en lo último de `develop`. Registro con usuario inventado y contraseña, alumnos con pseudónimos y estado actual. Misma cuenta en modo profesional/niño; salir del niño requiere contraseña comprobada por servidor. Sin offline ni historial complejo. Frontend sin modificar en este paso; integración posterior documentada. SQLite/libSQL local y remoto para despliegue gratuito Render + Turso. | Usuario + Codex |
| 2026-11-04 | **Ramas:** `main` no se toca hasta tener una versión comprobada. Todo el trabajo entra por PR en `develop`, que ya reúne todas las ramas abiertas (PR #1, #2, #13, #14 y #15, más `feat/ingles-historial-profesional`). Al final, `develop` → `main`. | Floren |
| 2026-11-04 | **Una sola app:** la oficial es el prototipo de Delia, ahora en `app/`. Se retira el esqueleto `frontend/` (PR #2). GitHub Pages despliega `app/`. | Floren |
| 2026-11-04 | _Propuesta para revisión_: continuar el prototipo de Delia en una rama independiente, completar ES/EN y valorar FastAPI + SQLite para cuentas profesionales e historial de evaluaciones versionadas. Backend todavía no implementado; alcance y contrato en `docs/backend-profesionales.md`. | Sesión con Codex |
| 2026-11-04 | **Rutas e idiomas del vídeo:** Sudán → Chad (Amira; árabe y francés; África), Venezuela → Colombia (español; América Latina) y Ucrania → España (ucraniano; entrevista E1). | Floren (Delia lo deja a criterio del equipo) |
| 2026-11-04 | **Dos informes:** uno técnico para el psicólogo o psicopedagogo y otro sencillo para el docente y la familia. | Delia |
| 2026-11-04 | Se miden las **5 capacidades del reto** (más intereses y perseverancia). Otras capacidades, en futuras actualizaciones. | Delia |
| 2026-11-04 | **Rango de edad: un solo rango, desde los 7 años** (7-14), entre otras cosas por las políticas de Google Play. | Delia |
| 2026-11-04 | El estilo visual de los bocetos ya está adaptado a los minijuegos. | Delia |
| 2026-11-04 | _Propuesta_: prototipo **solo frontend** (React + Vite, PWA, datos en el navegador), publicado en GitHub Pages. Así el QR funciona sin servidor, sin conexión y sin guardar datos de menores en ningún sitio. FastAPI queda para después del hackathon. | Floren |
| 2026-11-04 | El **vídeo de 3 min** enseña la herramienta desde la mirada del **niño, la familia y el educador**, contando el contexto por el camino, y termina con un **QR al prototipo**. Las bases piden además la presentación de 5 min: se reutiliza el guion y las capturas del vídeo. | Cristina |
| 2026-11-04 | _Pendiente_: ¿incluimos el mapa de currículos de Puente como módulo extra (Retos 15 y 11) o solo Reto 20? | Equipo |
| 2026-11-03 | Usuarios identificados con **pseudónimos**: nada de nombres reales de menores. Miguel concreta cómo. | Equipo |
| 2026-11-03 | Es una herramienta **de apoyo al psicólogo/orientador** en la inserción y adaptación del niño. Se basa en los instrumentos que ya se usan, **sin reemplazarlos**. Mide **habilidades, aptitudes, intereses y fortalezas, no personalidad**. | Equipo |
| 2026-11-03 | **Reto 20** por votación del equipo: juego intuitivo, dinámico y visual, con niveles que identifican habilidades, intereses y fortalezas del niño. | Equipo |
| 2026-11-04 | Repo público con licencia MIT; `main` protegida (PR + 1 aprobación). | Equipo |
