# App (frontend)

React + Vite, PWA (funciona sin conexión). Los datos se guardan solo en el navegador.

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```
> Con Node 18, `npm run build` necesita `NODE_OPTIONS=--experimental-global-webcrypto`. Con Node 20 o superior no hace falta.

- **Demo con datos de ejemplo** (un niño que ha jugado 6 días): `#demo` abre el panel del profesional y `#demo-juego` el mapa de juegos del niño.
- **IA:** si defines `VITE_API_URL` (ver `.env.example`), el panel muestra el botón «Redactar con IA», que llama a `POST {VITE_API_URL}/api/informe` con `{ idioma, resumen }` (resumen agregado y anónimo de `resumenParaIA()` en `src/informe.js`) y espera un JSON con los campos de `informeSinIA()` que quiera sustituir (`capacidades`, `sugerencias`). Sin `VITE_API_URL`, se usa el informe por reglas.

## Estructura
| Fichero | Qué hace |
|---|---|
| `src/App.jsx` | Navegación y registro de partidas |
| `src/progreso.js` | Juegos, niveles, estrellas e insignias (premian el esfuerzo y la mejora) |
| `src/pantallas/` | `Inicio` (idioma, consentimiento, ¿quién juega?, avatar), `Intereses`, `Mapa` (juegos y niveles), `Patrones` (lógica, 10 niveles), `Inventa` (creatividad, 4 objetos), `Resultado`, `Panel` (profesional), `Familia` |
| `src/informe.js` | Perfil a partir de TODO el historial (evolución), con reglas explicables; `resumenParaIA()` para el backend |
| `src/i18n.js` | Textos por idioma y lectura en voz alta |
| `src/datos.js` | Estado en localStorage: varios niños por dispositivo, sin nombres reales; datos de demo |

## Pendiente (ver Issues)
Minijuegos «Cuenta la historia» (comunicación) y «Ayuda al robot» (colaboración), backend con IA, más idiomas.
