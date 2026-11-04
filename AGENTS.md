# AGENTS.md · Contexto compartido para cualquier IA del equipo

Este fichero lo leen las IAs de los 4 miembros del equipo (Claude Code, Copilot, Cursor, Codex…). Mantenlo al día: es lo que hace que todas trabajen con el mismo contexto.

## Proyecto
- Hackathon: #Hack4Edu 2026 (ProFuturo + UPSA). Desarrollo del **3 nov 09:00 al 5 nov 23:59** (hora local).
- Entregables: presentación de 5 min, vídeo de 3 min y enlace a este repo.
- Criterios (modalidad innovadora): creatividad 40 %, acabado 20 %, potencial de mercado 20 %, IA para la educación en países desfavorecidos 20 %.
- El proyecto debe responder a retos oficiales (candidatos: Reto 15 educación en emergencias, Reto 11 recuperar aprendizajes, Reto 20).
- Idea y decisiones vigentes: ver `docs/decisiones.md` (manda sobre cualquier otra cosa).

## Stack (provisional, ver decisiones)
- Frontend: React + Vite, PWA con modo sin conexión (IndexedDB).
- Backend: FastAPI (Python) + SQLite.

## Reglas para la IA
1. **Nunca hagas commit ni push a `main`.** Trabaja en una rama `tipo/descripcion-corta` (`feat/`, `fix/`, `docs/`) y abre un Pull Request.
2. Commits pequeños y frecuentes, con mensaje claro en español. El historial de commits es nuestra prueba de trabajo durante el hackathon.
3. Antes de empezar, lee la Issue de la tarea y `docs/decisiones.md`. Si tomas una decisión de diseño, propón añadirla a `docs/decisiones.md` en el mismo PR.
4. **No inventes datos** (cifras, currículos, estudios). Si algo no tiene fuente, márcalo como `TODO: verificar`.
5. No subas secretos (claves de API, `.env`). Usa `.env.example`.
6. Todo el código debe poder publicarse con licencia MIT.
7. Prioriza que la demo funcione de punta a punta antes que añadir funciones.
