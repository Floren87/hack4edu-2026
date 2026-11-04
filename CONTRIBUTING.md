# Cómo contribuir

## Flujo de trabajo
```bash
git checkout main && git pull            # 1. traer lo último
git checkout -b feat/mi-tarea            # 2. rama para tu tarea
# ...trabajar, commits pequeños...
git add . && git commit -m "Añade X"
git push -u origin feat/mi-tarea         # 3. subir la rama
gh pr create --fill                      # 4. abrir el PR (o desde la web)
```
5. Otra persona del equipo revisa y pulsa **Approve**. Sin aprobación, GitHub no deja fusionar.
6. Quien abrió el PR lo fusiona (**Squash and merge**) y borra la rama.

## Reglas de `main`
- Prohibido el push directo y el force push.
- Hace falta 1 aprobación de otra persona.
- Si cambias algo después de la aprobación, hay que volver a aprobar.

## Revisiones cruzadas (diferencia horaria de 6 h)
Madrid revisa los PR de Ecuador y Colombia y al revés. Franja común: **15:00–19:00 Madrid = 9:00–13:00 Bogotá/Quito**.
