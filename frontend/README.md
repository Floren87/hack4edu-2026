# App (frontend)

React + Vite, PWA (funciona sin conexión). Los datos se guardan solo en el navegador.

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```
> Con Node 18, `npm run build` necesita `NODE_OPTIONS=--experimental-global-webcrypto`. Con Node 20 o superior no hace falta.

- **Demo con datos de ejemplo:** añade `#demo` a la URL; se abre directamente el panel del profesional.
- **IA:** si defines `VITE_API_URL` (ver `.env.example`), el panel muestra el botón «Redactar con IA», que llama a `POST {VITE_API_URL}/api/informe` con `{ idioma, evidencias }` y espera el mismo formato que devuelve `informeSinIA()` en `src/informe.js`. Sin `VITE_API_URL`, se usa el informe por reglas.

## Estructura
| Fichero | Qué hace |
|---|---|
| `src/App.jsx` | Recorrido del juego y navegación |
| `src/pantallas/` | Una pantalla por paso: `Inicio` (idioma, consentimiento, avatar), `MapaMundos` (intereses), `Patrones` (lógica), `Inventa` (creatividad), `Panel` (profesional), `Familia` |
| `src/informe.js` | Informe sin IA: reglas explicables, solo fortalezas con su evidencia |
| `src/i18n.js` | Textos por idioma y lectura en voz alta |
| `src/datos.js` | Sesión en localStorage (sin nombres reales) y datos de demo |

## Pendiente (ver Issues)
Minijuegos «Cuenta la historia» (comunicación) y «Ayuda al robot» (colaboración), backend con IA, más idiomas.
