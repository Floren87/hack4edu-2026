# Cómo contribuir

**Estado al 5 de noviembre, después del PR #36:** `develop` quedó integrada y fue eliminada. Para esta entrega, Miguel autoriza rama de tarea desde `origin/main` y PR hacia `main`; no se recrea `develop` ni se hace push directo a `main`. Las instrucciones con `develop` de abajo describen el flujo previo y solo vuelven a aplicar si el equipo restaura esa rama. La revisión por otra persona sigue siendo obligatoria. Base vigente: [AGENTS.md](AGENTS.md).

## Ramas
| Rama | Para qué | Quién escribe |
|---|---|---|
| `main` | Versión entregable y la que se publica en GitHub Pages | Solo recibe `develop` cuando todo está comprobado |
| `develop` | Rama de trabajo del equipo | Solo por Pull Request |
| `feat/…`, `fix/…`, `docs/…` | Una tarea cada una | Quien hace la tarea |

## Flujo de trabajo
```bash
git checkout develop && git pull            # 1. traer lo último
git checkout -b feat/mi-tarea               # 2. rama para tu tarea
# ...trabajar, commits pequeños...
git add . && git commit -m "Añade X"
git pull origin develop                     # 3. traer cambios de otros antes de subir
cd app && npm run lint && npm test && npm run build && cd ..   # 4. comprobar
git push -u origin feat/mi-tarea            # 5. subir la rama
gh pr create --base develop --fill          # 6. abrir el PR contra develop (o desde la web)
```
7. Otra persona del equipo revisa y pulsa **Approve**. GitHub Actions comprueba tipos, tests y build en el PR.
8. Quien abrió el PR lo fusiona (**Squash and merge**) y borra la rama.

## Pasar de `develop` a `main`
Cuando `develop` está lista (demo de punta a punta, `npm run test:e2e` en verde y probada en el móvil), se abre un PR `develop` → `main`. Al fusionarlo, la app se publica en GitHub Pages.

## Reglas de `main`
- Prohibido el push directo y el force push.
- Hace falta 1 aprobación de otra persona.
- Si cambias algo después de la aprobación, hay que volver a aprobar.

## Revisiones cruzadas (diferencia horaria de 6 h)
Madrid revisa los PR de Ecuador y Colombia y al revés. Franja común: **15:00–19:00 Madrid = 9:00–13:00 Bogotá/Quito**.
