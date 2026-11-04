# Talento sin Fronteras

Juego visual, por niveles y en varios idiomas que ayuda a descubrir las **habilidades, intereses y fortalezas** de niños y niñas migrantes y refugiados (de 7 a 14 años). Sirve de apoyo al psicólogo, orientador o docente en su inserción escolar: **no diagnostica ni sustituye sus pruebas**. El profesional valida cada observación.

Proyecto del equipo para el **#Hack4Edu 2026** (ProFuturo + UPSA), **Reto 20**. Desarrollado del 3 al 5 de noviembre de 2026.

> ⚠️ **Prototipo.** Los porcentajes no son puntuaciones psicométricas validadas. Usa siempre **pseudónimos**, nunca nombres reales ni datos de salud de menores.

## Qué hace la app
| Para quién | Qué encuentra |
|---|---|
| 👧 **Niño o niña** | Crea un pseudónimo y un avatar. Juega 4 retos: **creatividad** («¿Qué inventas?»), **patrones** (lógica), **cuenta la historia** (comunicación) y **ayuda al robot Bobi** (colaboración). Explora 6 mundos (construir, explorar, crear, ayudar, organizar y contar) que muestran sus intereses. Gana estrellas, niveles e insignias. |
| 🧑‍🏫 **Profesional** | Panel con las actividades hechas y pendientes, las evidencias de cada fortaleza y sugerencias para el aula. Marca si cada observación coincide con lo que ve y añade sus notas. Informe técnico imprimible. |
| 👨‍👩‍👧 **Familia** | Resumen sencillo y en positivo, con ideas para casa, descargable e imprimible. |

- **Idiomas:** español, inglés, francés, árabe (de derecha a izquierda) y ucraniano. Textos con voz, usando la síntesis de voz del dispositivo. El inglés está completo; FR, AR y UK cubren los textos del prototipo original.
- **Acceso:** login como primera pantalla. Cuenta con usuario inventado y contraseña; sin email ni datos reales.
- **Profesional:** alta, edición y borrado de alumnos con pseudónimos; consulta/exportación de resultados y última revisión.
- **Niño:** solo juegos del alumno seleccionado. No hay paneles, familia ni selector de alumnos. Volver al adulto requiere contraseña comprobada por el servidor.
- **Conectado:** estado guardado en SQLite/libSQL; no se utiliza localStorage para expedientes ni service worker para cachear la aplicación.
- **Idiomas:** las pantallas nuevas de acceso y gestión están traducidas a ES/EN/FR/AR/UK; los juegos mantienen las traducciones existentes.
- **Informes:** siguen generándose con reglas locales sobre los datos del alumno; no hay IA externa ni histórico de evaluaciones.

[API y configuración](backend/README.md) · [Integración realizada](docs/integracion-backend.md) · [Despliegue gratuito](docs/despliegue-demo.md)

## Instalación y uso
**Requisitos:** [Node.js](https://nodejs.org/) **22.12 o posterior** (con npm) y Git. Con Node 18 o 20 el build falla.

Desde la raíz del repositorio, abrir dos terminales:

Terminal 1 — API:

```powershell
cd backend
npm ci
Copy-Item .env.example .env # solo la primera vez; no sobrescribir una configuración existente
npm run dev
```

Terminal 2 — interfaz:

```powershell
cd app
npm ci
npm run dev
```

Abrir **http://localhost:3000/**. Vite redirige `/api` al backend en 127.0.0.1:3001. Usar localhost, no alternar con 127.0.0.1: el origen debe coincidir con `APP_ORIGIN`. Sin backend se muestra error de conexión, nunca datos de muestra.

Crear una cuenta y un alumno con pseudónimos. Pulsar «Comenzar juego» para entregar el dispositivo al niño y «Volver al adulto» para introducir la contraseña. Las sesiones vigentes recuperan su modo al recargar. Se necesita conexión; una partida sin confirmar muestra «Cambios sin guardar» y permite reintentar o descartar/cargar el estado del servidor.

No hay recuperación de contraseña en esta demo. Las descargas son HTML imprimible; para obtener PDF usar «Imprimir / Guardar PDF» del navegador.

### Comandos
Todos se ejecutan dentro de `app/`:

| Comando | Para qué |
|---|---|
| `npm run dev` | Servidor de desarrollo (puerto 3000) |
| `npm run lint` | Comprobación de tipos con TypeScript |
| `npm test` | Tests de reglas, traducción de evidencias y exportaciones seguras |
| `npm run test:e2e` | Recorridos con API real y base temporal, en puertos 3100/3101 libres. En Windows usa Edge; en Linux instalar Chromium con `npx playwright install chromium`. Instalar antes las dependencias de `backend/`. |
| `npm run build` | Versión de producción en `app/dist/` |
| `npm run preview` | Sirve el build estático; para el flujo conectado en producción usar el servidor backend y seguir la guía de despliegue |

### Problemas habituales
- **`Cannot find native binding` o `styleText` al hacer el build:** tu Node es antiguo, o `node_modules` se instaló con otra versión. Actualiza a Node 22+, borra `node_modules` y vuelve a ejecutar `npm ci`.
- **La app no se actualiza después de instalarla como PWA:** borra la caché del sitio en el navegador.

## Despliegue
Al fusionar en `main`, GitHub Actions publica `app/` en **GitHub Pages** ([`.github/workflows/pages.yml`](.github/workflows/pages.yml)). Cada PR a `develop` o `main` comprueba tipos, tests y build ([`ci.yml`](.github/workflows/ci.yml)).

## Estructura
```
app/                      La aplicación (React 19 + TypeScript + Vite + Tailwind, PWA)
  src/components/         Pantallas: onboarding, child, minigames, worldActivities, teacher, family, profiles, common
  src/context/AppContext  Perfiles y registros de juego (localStorage)
  src/utils/aiPedagogy    Reglas que generan las fortalezas, evidencias y sugerencias
  src/utils/printReport   Informes imprimibles (profesional y familia)
  src/i18n/               translations.ts (5 idiomas) + english.json y localize.ts (inglés)
  tests/                  Tests unitarios (node:test) y de navegador (Playwright)
docs/                     Documentación del proyecto (ver abajo)
```

### Añadir o cambiar textos
- El diccionario de los 5 idiomas está en `src/i18n/translations.ts`. Los mensajes que estaban fijos en español se traducen al inglés en `src/i18n/english.json`.
- `localizeText(idioma, mensaje, valores)` rellena los parámetros y traduce también las observaciones antiguas guardadas en español. Para una frase nueva, escribe la plantilla en español y añade su traducción al catálogo.
- Los pseudónimos y las notas libres del profesional no se traducen. Los identificadores de actividades y métricas no dependen del idioma.

## Documentación
| Documento | Qué contiene |
|---|---|
| [`docs/propuesta.md`](docs/propuesta.md) | Propuesta de producto: usuarios, cumplimiento del Reto 20 frase a frase, criterios del jurado, minijuegos, IA ética y alcance |
| [`docs/decisiones.md`](docs/decisiones.md) | Registro de decisiones del equipo (manda sobre todo lo demás) |
| [`docs/estado.md`](docs/estado.md) | Quién hace qué ahora y diario de sesiones |
| [`docs/backend-profesionales.md`](docs/backend-profesionales.md) | Propuesta, **sin implementar**, de cuentas profesionales e historial con FastAPI + SQLite |
| [`docs/investigacion/entrevistas.md`](docs/investigacion/entrevistas.md) | Entrevistas con familias |
| [`docs/investigacion/mapas-de-empatia.md`](docs/investigacion/mapas-de-empatia.md) | Mapas de empatía del niño, la familia y el profesional |
| [`docs/investigacion/tests-de-referencia.md`](docs/investigacion/tests-de-referencia.md) | Tests profesionales de referencia y cómo nos situamos frente a ellos |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Ramas, Pull Requests y revisiones |
| [`AGENTS.md`](AGENTS.md) | Contexto y reglas para las IAs del equipo (`CLAUDE.md` lo importa) |

## Equipo
| Persona | Ubicación | Rol |
|---|---|---|
| Floren (`Floren87`) | Madrid 🇪🇸 | Programación y repo |
| Cristina | Madrid 🇪🇸 | Mercado, presentación y vídeo |
| Delia (`deliainclusiveapps`) | Ecuador 🇪🇨 | Diseño, accesibilidad y prototipo de la app |
| Miguel (`XxMigue03xX`) | Colombia 🇨🇴 | Programación y backend |

## Cómo contribuir
Trabajamos en la rama **`develop`**. Cada tarea va en su propia rama, que sale de `develop` y vuelve a ella con un Pull Request revisado. `main` solo recibe versiones ya comprobadas. Detalles en [`CONTRIBUTING.md`](CONTRIBUTING.md). Si usas una IA, haz que lea [`AGENTS.md`](AGENTS.md) y pregúntale «¿con qué sigo?».

## Licencia
Código: [MIT](LICENSE). Documentación: CC BY-NC-SA 3.0 (según las bases del hackathon).
