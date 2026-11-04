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

## Stack (provisional, ver decisiones)
- Frontend: React + Vite, PWA con modo sin conexión (IndexedDB).
- Backend: FastAPI (Python) + SQLite.

## 🔁 Protocolo al EMPEZAR cada sesión (obligatorio)
Antes de escribir código o proponer nada, haz esto y enséñale el resultado a la persona:

1. **Sincronizar:** `git status` → si hay cambios sin guardar, avisa y no sigas hasta resolverlo. Después `git checkout main && git pull`.
2. **Ponerse al día:** lee `docs/estado.md` y `docs/decisiones.md`.
3. **Ver qué hay pendiente** (si `gh` está instalado; si no, pide a la persona que mire la pestaña Issues y Pull requests):
   - `gh pr list` → PR abiertos. **Si hay alguno de otra persona esperando revisión, propón revisarlo primero**: desbloquear a un compañero es la prioridad.
   - `gh issue list --assignee @me` y `gh issue list --label tarea --search "no:assignee"` → tareas suyas y tareas libres.
4. **Resumir y preguntar.** Responde con este formato y espera a que la persona elija:
   > 📥 He hecho `git pull`. Novedades desde tu última sesión: …
   > 👀 PR esperando tu revisión: …
   > 📋 Tus tareas: … · Tareas libres: …
   > **¿Con qué seguimos ahora?**

No empieces una tarea sin que la persona la haya elegido.

## 🔚 Protocolo al TERMINAR la sesión
1. Commit y `git push` de la rama, aunque el trabajo esté a medias (si está a medias, abre el PR como borrador: `gh pr create --draft`).
2. Actualiza `docs/estado.md` con una línea: quién, qué hizo, qué queda pendiente.
3. Recuerda a la persona pedir revisión a alguien de la otra zona horaria.

## Reglas para la IA
1. **Nunca hagas commit ni push a `main`.** Trabaja en una rama `tipo/descripcion-corta` (`feat/`, `fix/`, `docs/`) y abre un Pull Request.
2. Commits pequeños y frecuentes, con mensaje claro en español. El historial de commits es nuestra prueba de trabajo durante el hackathon.
3. Antes de empezar, lee la Issue de la tarea y `docs/decisiones.md`. Si tomas una decisión de diseño, propón añadirla a `docs/decisiones.md` en el mismo PR.
4. **No inventes datos** (cifras, currículos, estudios). Si algo no tiene fuente, márcalo como `TODO: verificar`.
5. No subas secretos (claves de API, `.env`). Usa `.env.example`.
6. Todo el código debe poder publicarse con licencia MIT.
7. Prioriza que la demo funcione de punta a punta antes que añadir funciones.
