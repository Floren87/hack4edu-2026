# Estado del proyecto

Qué está pasando ahora mismo. Cada persona (o su IA) añade una línea al terminar su sesión, la más reciente arriba.

## En curso
| Quién | Tarea / rama | Estado |
|---|---|---|
| Cristina | Cómo vender a gobiernos y ONG; estructura de la presentación; TAM/SAM/SOM | En curso |
| Cristina y Delia | Habilidades y fortalezas que se usan a nivel mundial para evaluar a niños | En curso |
| Delia | Propuesta de pantallas del juego | En curso |
| Miguel | Perfil docente / `feat/perfil-docente` desde `develop` | «Volver al Perfil Docente» en 5 idiomas; usuario actual visible solo en cabecera profesional y «Mis alumnos». Tipos, 18 tests unitarios, build y 18 E2E correctos en CI Linux. PR contra `develop` en preparación. |
| Miguel | API Render + libSQL/Turso / `feat/backend` | Publicada y validada desde localhost; frontend apunta a Render por defecto. Entrega validada para PR contra `develop`. Tras integrar: autorizar origen exacto de Netlify y redesplegar API. |
| Floren | Repo, reglas y coordinación de las IAs | En curso |

## Próximos pasos (hasta el 5 nov, 23:59)
1. ✅ Mejoras integradas en `develop` y comprobadas (lint, tests, 15 e2e, build de producción como en Pages).
2. ⛔ Miguel: autorizar `https://floren87.github.io` en `ALLOWED_ORIGINS` de Render (hoy responde 403 desde Pages).
3. PR #24 `develop` → `main` (1 aprobación), que publica la app en GitHub Pages.
4. QR a `https://floren87.github.io/hack4edu-2026/` (Floren y Miguel).
5. Entrega: vídeo de 3 min, presentación de 5 min (Cristina) y formulario (#9) antes de las 23:59.

### Tareas que pidió Cristina (PR #20)
- [x] Cambiar el nombre a **KoraMAP**.
- [x] «Habilidades, intereses y fortalezas» en la descripción del producto: título y descripción de la web, manifiesto y README.
- [x] README con los pasos concretos de la instalación.
- [ ] QR (Floren y Miguel), cuando funcione Render desde Pages.
- [ ] Presentación (Cristina).

## Mejoras futuras (después del hackathon)
- **Diversificar los juegos:** más minijuegos y actividades para observar cada habilidad desde varios ángulos.
- **Muchos niveles de dificultad** dentro de cada juego.
- **Clasificar los juegos por edades**, dentro del rango de 7 a 14 años.
- **Ampliar el campo de estudio** a nuevas habilidades, aptitudes e intereses.
- **Ampliar los mapas de empatía** (`docs/investigacion/mapas-de-empatia.md`) para descubrir nuevas habilidades que observar.
- **Informes cada vez más completos**, según las sugerencias de los profesionales y de los expertos del sector.
- **Evaluación final: «¿Qué es lo que más te gusta hacer?»**, como última actividad antes del informe final. Detectar desde pequeños lo que más le gusta hacer al niño, o lo que más le gustaría hacer, ayuda mucho al profesional y también a los padres.
  - Una encuesta **visual**, con dibujos, imágenes o actividades entre las que el niño elige. No hace falta leer ni hablar el idioma.
  - Si no elige ninguna, **pasa a la siguiente** sin penalizar: no elegir también es una respuesta válida.
  - Sus elecciones se suman a los intereses que ya se observan en los juegos y los mundos, y aparecen en el informe del profesional y en el **resumen para la familia**.

## Diario
| Fecha y hora (zona) | Quién | Qué hizo | Qué queda |
|---|---|---|---|
| 2026-11-05 (Bogotá) | Miguel + Codex | Desde `develop` actualizado, cambia retorno a «Perfil Docente» en ES/EN/FR/AR/UK y muestra el usuario existente en cabecera y «Mis alumnos», solo en profesional. Componente compartido, aislamiento visual del niño y contraseña conservados. CI de app incorpora build y E2E con API en memoria; validación en `fd3cc7d`: tipos, 18 tests unitarios y 18 E2E correctos. Windows bloquea Tailwind nativo; las pruebas completas se ejecutan en Ubuntu/Node 22/Chromium sin cambiar políticas locales. | Revisar PR de `feat/perfil-docente` contra `develop` con Floren, integrar y publicar el frontend. Descripción y recorrido en `docs/pr-perfil-docente.md`. |
| 2026-11-05 (Madrid) | Floren + Claude | Integra #19 (backend), #21, #17, #22 y #23 en `develop` y lo comprueba completo (también el build de producción en subcarpeta). Renombra la app a KoraMAP. PR #24 `develop` → `main` preparado; la versión anterior queda en la etiqueta `v0-prototipo-delia`. | Render debe autorizar el origen de Pages; aprobar #24; QR. |
| 2026-11-04 (Bogotá) | Miguel + Codex | Miguel publica API Render conectada a Turso; esta rama apunta por defecto a `https://hack4edu-2026.onrender.com/api` y conserva override local. Lint/build de ambos proyectos, 18 tests frontend, 9 API, 11 E2E aisladas y 1 E2E real aprobados. Smoke remoto: CRUD, guardado/recarga/nuevo login, modo niño y contraseña, aislamiento y ambos informes árabes; alumno QA eliminado y sesiones revocadas. Actualiza traspaso, despliegue y descripción revisable del PR. | Floren revisa PR contra `develop`, reconcilia ramas y despliega frontend. Miguel añade origen final de Netlify a `ALLOWED_ORIGINS` y redespliega API; luego probar dominio/red finales y persistencia a reinicio. |
| 2026-11-04 (Bogotá) | Miguel + Codex | Desacopla `feat/backend`: `VITE_API_BASE_URL`, CORS con `ALLOWED_ORIGINS`, sesiones Bearer opacas en sessionStorage por pestaña; sin proxy ni cookies. Conserva datos, permisos niño/profesional, estilos e idiomas. Lint/build de ambos proyectos, 18 tests frontend, 9 API y 11 E2E entre hosts distintos correctos. Actualiza API, integración, traspaso y despliegue. | Miguel publica API Render + base libSQL Turso y prueba localhost contra API pública; Floren/Delia configuran URL de API en el frontend y comunican su origen para autorizarlo. Integración/merge a cargo de Floren, sin PR en este sprint. |
| 2026-11-04 (Bogotá) | Codex | Completa traducción ES/EN/FR/AR/UK en `feat/backend`: catálogos tipados, juegos, mensajes, evidencias e informes/exportación; conserva estilos. Valida lint/build de ambos proyectos, 10 tests frontend, 6 API y 9 E2E (50 partidas multilingües). Deja traspaso acumulado desde backend en `docs/traspaso-floren.md` y guía `docs/i18n.md`; usuario autoriza push de todos los commits de esta rama. | Floren/Claude Code: revisar cruces con ramas de creatividad/selector, integrar y probar despliegue público. Sin merge ni PR durante este sprint; preparar PR al cerrar el día. |
| 2026-11-04 (Bogotá) | Codex | Recupera estilo del prototipo previo en login, idiomas, barra y alta/edición de alumnos: avatares visuales, degradados, tarjetas y sección activa. Corrige distribución móvil de informes con pseudónimos largos. | Usuario revisa aspecto y gestiona GitHub; sin PR ni push en esta sesión. |
| 2026-11-04 (Bogotá) | Codex | Integra frontend en feat/backend: login primero, CRUD profesional, juegos aislados en niño, contraseña para salir, guardado remoto e idiomas. | Probar despliegue público; usuario gestiona GitHub y reconciliación. Sin PR por instrucción explícita. |
| 2026-11-04 (Bogotá) | Codex | Implementa `feat/backend`: TypeScript/Fastify, cuentas, alumnos aislados, estado actual y modo niño protegido por contraseña. API, plan de integración y despliegue gratuito documentados; frontend sin cambios. | Revisar PR; integrar frontend online; desplegar y probar con público. |
| 2026-11-04 (Madrid) | Floren + Claude | Crea `develop` y fusiona todas las ramas. Deja una sola app (`app/`, la de Delia), borra `frontend/` y restos de AI Studio, añade CI y rehace README, AGENTS, CONTRIBUTING y propuesta. Verificado con Node 22: lint, 3 tests, build y 2 e2e en verde. | Cerrar los PR antiguos (ya están en `develop`), proteger `develop` y empezar las mejoras. |
| 2026-11-04 (Bogotá) | Codex, sesión local | Parte del prototipo de Delia (`3f1c457`) en `feat/ingles-historial-profesional`; completa textos ES/EN, adapta exportaciones e incorpora propuesta de cuentas e historial. | Revisar PR y aprobar alcance del backend antes de implementarlo. |
| 2026-11-04 (Madrid) | Floren | Crea el repo: README, AGENTS.md, plantillas y reglas de `main`. | Invitar a Cristina, Delia y Miguel; decidir la idea en la llamada. |
