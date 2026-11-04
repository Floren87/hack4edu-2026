# Estado del proyecto

Qué está pasando ahora mismo. Cada persona (o su IA) añade una línea al terminar su sesión, la más reciente arriba.

## En curso
| Quién | Tarea / rama | Estado |
|---|---|---|
| Cristina | Cómo vender a gobiernos y ONG; estructura de la presentación; TAM/SAM/SOM | En curso |
| Cristina y Delia | Habilidades y fortalezas que se usan a nivel mundial para evaluar a niños | En curso |
| Delia | Propuesta de pantallas del juego | En curso |
| Miguel | Cómo trabajar con pseudónimos | En curso |
| Floren | Repo, reglas y coordinación de las IAs | En curso |

## Próximos pasos (hasta el 5 nov, 23:59)
1. Mejoras en ramas desde `develop`, con PR contra `develop`.
2. Comprobar `develop` (lint, tests, e2e y prueba en el móvil).
3. PR `develop` → `main`, que publica la app en GitHub Pages; QR para el vídeo.
4. Entrega: vídeo de 3 min + presentación de 5 min + enlace al repo.

## Diario
| Fecha y hora (zona) | Quién | Qué hizo | Qué queda |
|---|---|---|---|
| 2026-11-04 (Bogotá) | Codex | Integra frontend en feat/backend: login primero, CRUD profesional, juegos aislados en niño, contraseña para salir, guardado remoto e idiomas. | Probar despliegue público; usuario gestiona GitHub y reconciliación. Sin PR por instrucción explícita. |
| 2026-11-04 (Bogotá) | Codex | Implementa `feat/backend`: TypeScript/Fastify, cuentas, alumnos aislados, estado actual y modo niño protegido por contraseña. API, plan de integración y despliegue gratuito documentados; frontend sin cambios. | Revisar PR; integrar frontend online; desplegar y probar con público. |
| 2026-11-04 (Madrid) | Floren + Claude | Crea `develop` y fusiona todas las ramas. Deja una sola app (`app/`, la de Delia), borra `frontend/` y restos de AI Studio, añade CI y rehace README, AGENTS, CONTRIBUTING y propuesta. Verificado con Node 22: lint, 3 tests, build y 2 e2e en verde. | Cerrar los PR antiguos (ya están en `develop`), proteger `develop` y empezar las mejoras. |
| 2026-11-04 (Bogotá) | Codex, sesión local | Parte del prototipo de Delia (`3f1c457`) en `feat/ingles-historial-profesional`; completa textos ES/EN, adapta exportaciones e incorpora propuesta de cuentas e historial. | Revisar PR y aprobar alcance del backend antes de implementarlo. |
| 2026-11-04 (Madrid) | Floren | Crea el repo: README, AGENTS.md, plantillas y reglas de `main`. | Invitar a Cristina, Delia y Miguel; decidir la idea en la llamada. |
