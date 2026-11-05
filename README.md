# KoraMAP

Juego visual, por niveles y en varios idiomas que ayuda a descubrir las **habilidades, intereses y fortalezas** de niños y niñas migrantes y refugiados (de 7 a 14 años). Sirve de apoyo al psicólogo, orientador o docente en su inserción escolar: **no diagnostica ni sustituye sus pruebas**. El profesional valida cada observación.

**Demo:** https://floren87.github.io/hack4edu-2026/ (crea una cuenta con un usuario inventado).

**Requiere Internet. No funciona offline.** Es una aplicación web con frontend en GitHub Pages, API externa TypeScript/Fastify en Render y base SQLite/libSQL remota en Turso. Instalar un acceso directo no habilita guardado ni uso completo sin conexión.

Proyecto del equipo para el **#Hack4Edu 2026** (ProFuturo + UPSA), **Reto 20**. Desarrollado del 3 al 5 de noviembre de 2026.

> ⚠️ **Prototipo.** Los porcentajes no son puntuaciones psicométricas validadas. Usa siempre **pseudónimos**, nunca nombres reales ni datos de salud de menores.

## Qué hace la app
| Para quién | Qué encuentra |
|---|---|
| 👧 **Niño o niña** | Juega con el pseudónimo y avatar registrados por el profesional. Dispone de 4 retos: **creatividad** («¿Qué inventas?»), **patrones** (lógica), **cuenta la historia** (comunicación) y **ayuda al robot Bobi** (colaboración). Explora 6 mundos (construir, explorar, crear, ayudar, organizar y contar) que muestran sus intereses. Gana estrellas, niveles e insignias. |
| 🧑‍🏫 **Profesional** | Panel con las actividades hechas y pendientes, las evidencias de cada fortaleza y sugerencias para el aula. Marca si cada observación coincide con lo que ve y añade sus notas. Informe técnico imprimible. |
| 👨‍👩‍👧 **Familia** | Resumen sencillo y en positivo, con ideas para casa, descargable e imprimible. |

- **Idiomas:** español, inglés, francés, árabe (de derecha a izquierda) y ucraniano, en acceso, gestión, juegos, observaciones e informes descargados. Textos con voz mediante la síntesis de voz del dispositivo.
- **Acceso:** login como primera pantalla. Cuenta con usuario inventado y contraseña; sin email ni datos reales.
- **Profesional:** alta, edición y borrado de alumnos con pseudónimos; consulta/exportación de resultados y última revisión.
- **Niño:** solo juegos del alumno seleccionado. No hay paneles, familia ni selector de alumnos. Volver al Perfil Docente requiere contraseña comprobada por el servidor y conexión.
- **Conectado:** estado guardado en SQLite/libSQL; no se utiliza localStorage para expedientes ni service worker para cachear la aplicación.
- **Desacoplado:** una URL pública `VITE_API_BASE_URL` conecta la interfaz con la API local o publicada, sin proxy. Sesión Bearer de servidor; el token se guarda por pestaña en sessionStorage.
- **Informes:** siguen generándose con reglas locales sobre los datos del alumno; no hay IA externa ni histórico de evaluaciones.

[API y configuración](backend/README.md) · [Integración realizada](docs/integracion-backend.md) · [Despliegue gratuito](docs/despliegue-demo.md) · [Traspaso para Floren y Claude Code](docs/traspaso-floren.md)

## Tecnologías, arquitectura y límites

| Parte | Implementación |
|---|---|
| Interfaz | React 19 + TypeScript + Vite + Tailwind; ES/EN/FR/AR/UK. |
| API externa | Node 22.12+, TypeScript, Fastify y validación Zod; sesiones de servidor con Bearer. |
| Persistencia | SQLite/libSQL con `@libsql/client`; Turso remoto en la demo y archivo local en desarrollo. |
| Informes | Reglas interpretables en el navegador y exportación HTML/PDF con html2pdf.js. No se consulta un modelo de IA externo. |
| Pruebas | node:test, Playwright y GitHub Actions; API/base en memoria en E2E. |

La [arquitectura final](docs/arquitectura.md) incluye diagrama, flujo de datos, tablas y límites. No hay sincronización offline, historial versionado de evaluaciones, recuperación de contraseña ni administración compartida de centros. La información pendiente de guardar vive en memoria y puede perderse al cerrar/recargar; esperar la confirmación «Guardado». Los informes descargados pueden conservarse localmente, pero eso no convierte la aplicación en offline.

### Datos y protección

No se solicitan nombres reales, email, documentos, fotos ni datos de salud. Se usan usuarios inventados y pseudónimos, con edad opcional, progreso y observaciones educativas. **No se garantiza anonimización irreversible:** un centro podría relacionar el pseudónimo con un niño, y los campos libres no eliminan datos identificativos automáticamente.

Las contraseñas se guardan como **hash scrypt con sal aleatoria**, nunca en texto original; los tokens de sesión se guardan como SHA-256 en el servidor. La API verifica propietario y modo, exige contraseña para volver al profesional y limita intentos. El prototipo necesita revisión operativa y de protección de datos antes de usar información de menores reales. Ver [datos y seguridad](docs/datos-y-seguridad.md) y la [política pública](app/public/privacidad.html); no se declara una certificación de cumplimiento.

## Marco de referencia

- **Diseño Universal para el Aprendizaje (DUA / UDL)**, de David Rose y Anne Meyer (CAST): aplicamos su tercer principio, **«Múltiples formas de acción y expresión»**. El niño demuestra sus habilidades jugando, no con pruebas en papel o con texto.
- **ODS 4 – Educación de calidad:**
  - **Meta 4.5:** acceso igualitario a la educación para las personas vulnerables, incluidos los niños en situaciones de vulnerabilidad. Es la más ligada al Reto 20.
  - **Meta 4.a:** entornos de aprendizaje seguros, no violentos, inclusivos y eficaces para todos.

Textos completos y fuentes en [`docs/propuesta.md`](docs/propuesta.md#3-bis-marco-de-referencia).

**Privacidad:** [política de privacidad](https://floren87.github.io/hack4edu-2026/privacidad.html). Solo pseudónimos, sin nombres reales ni datos de salud, y para niños y niñas desde 7 años.

## Instalación y uso
**Requisitos:** [Node.js](https://nodejs.org/) **22.12 o posterior** (con npm) y Git. Con Node 18 o 20 el build falla.

Para usar la API de la demo, solo hace falta iniciar la interfaz:

```powershell
cd app
npm ci
npm run dev
```

Abrir **http://localhost:3000/**. Esta rama apunta por defecto a **`https://hack4edu-2026.onrender.com/api`**, publicada por Miguel en Render con libSQL/Turso. No requiere `.env.local` ni backend local. [Comprobar disponibilidad](https://hack4edu-2026.onrender.com/api/health); el arranque del servicio gratuito puede tardar. La URL base termina en `/api`, nunca en `/api/health`.

Para desarrollar con una API local, iniciar también `backend/` siguiendo su [README](backend/README.md), definir en **`app/.env.local`** y reiniciar Vite:

```dotenv
VITE_API_BASE_URL=http://localhost:3001/api
```

La API debe autorizar `http://localhost:3000` y, cuando se publique la interfaz, el origen HTTPS exacto de esa interfaz. No se comparte el token de BBDD con el frontend. En un despliegue estático, definir la variable antes del build y reconstruir al cambiarla.

Crear una cuenta y un alumno con pseudónimos. El usuario de la cuenta aparece en «Mis alumnos» y en la cabecera profesional, bajo «Perfil Docente». Pulsar «Comenzar juego» para entregar el dispositivo al niño y «Volver al Perfil Docente» para introducir la contraseña. La identidad docente se oculta en modo niño. Las sesiones vigentes recuperan su modo al recargar. Una pestaña nueva independiente requiere login; una pestaña duplicada puede compartir la sesión y el bloqueo. Se necesita conexión; una partida sin confirmar muestra «Cambios sin guardar» y permite reintentar o descartar/cargar el estado del servidor.

No hay recuperación de contraseña en esta demo. Las descargas son HTML imprimible; para obtener PDF usar «Imprimir / Guardar PDF» del navegador.

### Comandos
Todos se ejecutan dentro de `app/`:

| Comando | Para qué |
|---|---|
| `npm run dev` | Servidor de desarrollo (puerto 3000) |
| `npm run lint` | Comprobación de tipos con TypeScript |
| `npm test` | Reglas, idiomas, exportaciones y cliente HTTP/sesión/configuración de API |
| `npm run test:e2e` | Recorridos con API real y base temporal, en puertos 3100/3101 libres. En Windows usa Edge; en Linux instalar Chromium con `npx playwright install chromium`. Instalar antes las dependencias de `backend/`. |
| `npm run build` | Versión de producción en `app/dist/` |
| `npm run brand:generate` | Regenera SVG/PNG del logo aprobado sin recortarlo; requiere Edge/Chromium de Playwright. |
| `npm run preview` | Sirve el build estático; la API es independiente. Autorizar el origen de preview (habitualmente localhost:4173) en el backend |

### Problemas habituales
- **`Cannot find native binding` o `styleText` al hacer el build:** tu Node es antiguo, o `node_modules` se instaló con otra versión. Actualiza a Node 22+, borra `node_modules` y vuelve a ejecutar `npm ci`.
- **La app no se actualiza después de instalarla como PWA:** borra la caché del sitio en el navegador.

## Despliegue
La **API Render y BBDD Turso ya están publicadas** por Miguel; el frontend está en **[GitHub Pages](https://floren87.github.io/hack4edu-2026/)** y se actualiza al integrar en `main`. El build usa Render por defecto y admite `VITE_API_BASE_URL` como override público. CORS permite `http://localhost:3000,https://floren87.github.io`, sin `/hack4edu-2026/` en el origen. `develop` fue integrada y eliminada después del PR #36: antes del próximo redeploy de Render, revisar que su Branch apunte a `main`. No se cambia Render ni Turso en esta entrega. No se necesita proxy ni secretos en el frontend. La CI comprueba tipos, unitarios, build y navegador con API/base en memoria de [app](.github/workflows/ci.yml), y tipos/tests/build de [backend](.github/workflows/backend.yml). Seguir [operación y despliegue](docs/despliegue-demo.md).

## Estructura
```
app/                      La aplicación conectada (React 19 + TypeScript + Vite + Tailwind)
  src/components/         Pantallas: auth, child, minigames, worldActivities, teacher, family, profiles, common
  src/context/AppContext  Sesión, modo, alumnos remotos y guardado en memoria
  src/utils/api           Cliente HTTP directo con Bearer y URL pública configurable
  src/utils/session       Credencial y caducidad por pestaña (sessionStorage)
  src/utils/aiPedagogy    Reglas que generan las fortalezas, evidencias y sugerencias
  src/utils/printReport   Informes imprimibles (profesional y familia)
  src/i18n/               Catálogos completos ES/EN/FR/AR/UK, idiomas y traductor compartido
  tests/                  Tests unitarios (node:test) y de navegador (Playwright)
backend/                  API TypeScript + Fastify + SQLite/libSQL
docs/                     Documentación del proyecto (ver abajo)
```

### Añadir o cambiar textos
- Catálogos: `translations.ts` (claves del prototipo), `account/*.json` (controles de cuenta) y `messages/*.json` (juegos, observaciones e informes), dentro de `app/src/i18n/`.
- `localizeText(idioma, mensaje, valores)` traduce mensajes escritos por la aplicación y rellena sus parámetros. `localizeEvidence` reconoce observaciones guardadas en cualquiera de los cinco idiomas. Cada frase nueva requiere traducción en todos los idiomas; `npm test` comprueba la cobertura. Guía: [docs/i18n.md](docs/i18n.md).
- Los pseudónimos y las notas libres del profesional no se traducen. Los identificadores de actividades y métricas no dependen del idioma.

## Documentación
| Documento | Qué contiene |
|---|---|
| [`docs/arquitectura.md`](docs/arquitectura.md) | Arquitectura final online, tecnologías, despliegue, esquema y límites del prototipo |
| [`docs/datos-y-seguridad.md`](docs/datos-y-seguridad.md) | Datos almacenados, pseudónimos, hash de contraseñas, controles y pendientes de protección de datos |
| [`docs/propuesta.md`](docs/propuesta.md) | Propuesta de producto: usuarios, cumplimiento del Reto 20 frase a frase, criterios del jurado, minijuegos, IA ética y alcance |
| [`docs/decisiones.md`](docs/decisiones.md) | Registro de decisiones del equipo (manda sobre todo lo demás) |
| [`docs/estado.md`](docs/estado.md) | Quién hace qué ahora y diario de sesiones |
| [`docs/traspaso-floren.md`](docs/traspaso-floren.md) | Resumen de todos los cambios desde el backend y pendientes para la integración del equipo |
| [`docs/i18n.md`](docs/i18n.md) | Arquitectura, mantenimiento y pruebas de los cinco idiomas |
| [`docs/backend-profesionales.md`](docs/backend-profesionales.md) | Propuesta histórica FastAPI/historial, sustituida por el alcance implementado de [backend/README.md](backend/README.md) |
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
| Delia (`deliainclusiveapps`) | Ecuador 🇪🇨 | Diseño, Frontend, accesibilidad y prototipo de la app |
| Miguel (`XxMigue03xX`) | Colombia 🇨🇴 | Programación y backend |

## Cómo contribuir
Tras integrar el PR #36, `develop` fue eliminada y `main` contiene el trabajo del equipo. Esta entrega parte de `origin/main` en una rama independiente y vuelve mediante **PR revisado hacia `main`**, por autorización de Miguel. No se hacen commits ni push directos a ramas protegidas. Si el equipo restaura `develop`, actualizar la base de trabajo. Detalles en [`CONTRIBUTING.md`](CONTRIBUTING.md) y [`AGENTS.md`](AGENTS.md).

## Licencia
Código: [MIT](LICENSE). Documentación: CC BY-NC-SA 3.0 (según las bases del hackathon).
