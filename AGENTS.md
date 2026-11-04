# AGENTS.md · Contexto compartido para cualquier IA del equipo

Este fichero lo leen las IAs de los 4 miembros del equipo (Claude Code, Copilot, Cursor, Codex…). Mantenlo al día: es lo que hace que todas trabajen con el mismo contexto.

## Proyecto
- Hackathon: #Hack4Edu 2026 (ProFuturo + UPSA). Desarrollo del **3 nov 09:00 al 5 nov 23:59** (hora local).
- Entregables: presentación de 5 min, vídeo de 3 min y enlace a este repo.
- Criterios (modalidad innovadora): creatividad 40 %, acabado 20 %, potencial de mercado 20 %, IA para la educación en países desfavorecidos 20 %.
- **Reto elegido: 20** (votación del equipo). Producto: juego intuitivo, visual y por niveles que identifica habilidades, aptitudes, intereses y fortalezas (**no personalidad**) de niños migrantes y refugiados. Es un apoyo para el psicólogo u orientador en su inserción escolar: **no diagnostica ni sustituye sus pruebas**; la IA sugiere y el profesional decide.
- Niños identificados solo con **pseudónimos**. Nunca nombres reales ni datos de salud en el código, los datos de prueba o los logs.
- No copiar ítems de tests con derechos (TAMAI, BAS, WISC…). Sí se puede citar en qué competencias se inspiran.
- Idea y decisiones vigentes: ver `docs/decisiones.md` (manda sobre cualquier otra cosa). Quién hace qué ahora: `docs/estado.md`.

## Stack
- **App (`app/`):** React 19 + TypeScript + Vite + Tailwind, PWA sin conexión. Datos en el navegador (`localStorage`), informes con reglas locales (`src/utils/aiPedagogy.ts`). Necesita **Node 22.12+**. Instalación y comandos: `README.md`.
- **Backend (`backend/`):** TypeScript + Fastify + SQLite/libSQL. Cuentas con usuario inventado, sesión profesional/niño y estado actual de alumnos. API implementada, frontend pendiente de integrar; contrato en `backend/README.md`, plan en `docs/integracion-backend.md`, despliegue en `docs/despliegue-demo.md`. Sin sincronización offline ni historial de evaluaciones.

## 🌿 Ramas
- `main`: versión entregable. **No se toca** hasta que `develop` esté comprobada; entonces se fusiona `develop` → `main` con un PR.
- `develop`: rama de trabajo del equipo. Todas las ramas de tarea salen de `develop` y vuelven a ella con un PR.

## 👥 Equipo (para saber con quién hablas)
| Persona | Usuario de GitHub | Zona | Fuerte en |
|---|---|---|---|
| Floren | `Floren87` | Madrid (UTC+1) | Programación, coordinación del repo |
| Miguel | `XxMigue03xX` | Colombia (UTC−5) | Programación, backend (FastAPI) |
| Delia | `deliainclusiveapps` | Ecuador (UTC−5) | Diseño de pantallas, accesibilidad |
| Cristina | _pendiente_ | Madrid (UTC+1) | Mercado, presentación, vídeo, investigación |

Para saber quién eres: `gh api user -q .login`. Si `gh` no está instalado, pregunta «¿Quién eres del equipo?».

## 🧭 Cuando la persona pregunte «¿con qué sigo?» (o empiece la sesión)
La persona pregunta y **tú recomiendas**. No le devuelvas la pregunta: haz lo siguiente y dale **una pista clara**.

1. **Sincronizar:** `git status`. Si hay cambios sin guardar, avisa y resuélvelo primero. Después `git checkout develop && git pull`.
2. **Ponerte al día:** lee `docs/estado.md`, `docs/decisiones.md` y `docs/propuesta.md`.
3. **Ver qué hay pendiente** (con `gh`; si no está instalado, pide a la persona que te pegue las listas de Issues y Pull requests):
   - `gh pr list` → PR abiertos y quién debe revisarlos
   - `gh issue list --state open` → todas las tareas, con sus responsables
4. **Elegir lo MÁS URGENTE para esta persona**, en este orden de prioridad:
   1. 🔴 **Algo que bloquea la entrega** (5 nov, 23:59 hora local): vídeo, presentación, demo que no funciona, formulario.
   2. 👀 **Un PR de otra persona esperando revisión** que esta persona pueda aprobar: desbloquea a un compañero en minutos.
   3. ❓ **Una decisión pendiente asignada a esta persona** (por ejemplo, la issue #11): sin ella otros no pueden avanzar.
   4. 📋 **Sus issues asignadas**, empezando por las del flujo principal de la demo.
   5. 🆓 **Una issue libre que encaje con lo que se le da bien** (tabla de Equipo).
   Ten en cuenta la hora de su zona y cuánto falta para la entrega.
5. **Responder con este formato** (corto):
   > 📥 He hecho `git pull`. Novedades: …
   > 👉 **Te recomiendo seguir con:** [tarea + enlace] — **por qué es lo más urgente ahora:** …
   > 🪜 **Primer paso concreto:** … (por ejemplo: «crea la rama `feat/estilo-visual` y empieza por `app/src/components/child/ChildHome.tsx`»)
   > 🔀 Otras opciones si prefieres: 1) … 2) …

Si la persona acepta, asígnale la issue (`gh issue edit N --add-assignee @me`), apunta en `docs/estado.md` que está con ella y empieza. Si elige otra, respeta su decisión.

## ⬆️ Antes de SUBIR algo (`git push` o abrir un PR)
Mientras trabajabas, otro compañero puede haber cambiado `develop`. Antes de subir:
1. `git pull origin develop` **en tu rama**: trae lo último de `develop` a tu trabajo.
2. Si hay **conflictos**, explícale a la persona qué choca y resuélvelo con ella; no borres el trabajo de otros.
3. Comprueba que todo sigue funcionando (en `app/`: `npm run lint`, `npm test` y `npm run build`).
4. Ahora sí: `git push` y, si no existe, abre el PR **contra `develop`** (`gh pr create --base develop`).

## 🔚 Protocolo al TERMINAR la sesión
1. Sigue los pasos de «Antes de SUBIR algo» y haz `git push` de la rama, aunque el trabajo esté a medias (si está a medias, abre el PR como borrador: `gh pr create --draft`).
2. Actualiza `docs/estado.md` con una línea: quién, qué hizo, qué queda pendiente.
3. Recuerda a la persona pedir revisión a alguien de la otra zona horaria.

## Reglas para la IA
1. **Nunca hagas commit ni push a `main` ni directamente a `develop`.** Trabaja en una rama `tipo/descripcion-corta` (`feat/`, `fix/`, `docs/`) creada desde `develop` y abre un Pull Request contra `develop`.
2. Commits pequeños y frecuentes, con mensaje claro en español. El historial de commits es nuestra prueba de trabajo durante el hackathon.
3. Antes de empezar, lee la Issue de la tarea y `docs/decisiones.md`. Si tomas una decisión de diseño, propón añadirla a `docs/decisiones.md` en el mismo PR.
4. **No inventes datos** (cifras, currículos, estudios). Si algo no tiene fuente, márcalo como `TODO: verificar`.
5. No subas secretos (claves de API, `.env`). Si hace falta configuración, añade un `.env.example` sin valores.
6. Todo el código debe poder publicarse con licencia MIT.
7. Prioriza que la demo funcione de punta a punta antes que añadir funciones.
