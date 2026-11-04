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
- **Sin servidor ni cuentas:** todo se guarda en el navegador (`localStorage`). Nada sale del dispositivo.
- **Sin conexión:** es una PWA instalable. En producción, un *service worker* guarda la app en caché.
- **Informes por reglas locales** (`src/utils/aiPedagogy.ts`): no se llama a ningún servicio de IA externo.

## Instalación y uso
**Requisitos:** [Node.js](https://nodejs.org/) **22.12 o posterior** (con npm) y Git. Con Node 18 o 20 el build falla.

```bash
git clone https://github.com/Floren87/hack4edu-2026.git
cd hack4edu-2026/app
npm ci                 # instala exactamente las versiones del package-lock.json
npm run dev            # arranca en http://localhost:3000
```

Abre la dirección que muestra Vite en el navegador. No hacen falta claves de API, `.env` ni backend. Para probarla desde el móvil en la misma red wifi, usa la IP del ordenador (Vite la muestra como `Network`).

### Recorrido de prueba
1. Elige el idioma en la pantalla de bienvenida.
2. Crea un pseudónimo y un avatar, o entra con uno de los perfiles de muestra (son ficticios).
3. Juega los retos y visita los mundos.
4. Abre el **panel profesional** para ver evidencias y sugerencias, validarlas y descargar el informe técnico.
5. Abre el **espacio familiar** y descarga el resumen. Las descargas son HTML imprimibles: el PDF se obtiene con «Imprimir / Guardar PDF» del navegador.

### Comandos
Todos se ejecutan dentro de `app/`:

| Comando | Para qué |
|---|---|
| `npm run dev` | Servidor de desarrollo (puerto 3000) |
| `npm run lint` | Comprobación de tipos con TypeScript |
| `npm test` | Tests de reglas, traducción de evidencias y exportaciones seguras |
| `npm run test:e2e` | Recorrido completo en el navegador con Playwright. La primera vez, ejecuta `npx playwright install chromium` (en Windows usa Edge). Necesita el puerto 3000 libre: si ya hay un servidor ahí, lo reutiliza. |
| `npm run build` | Versión de producción en `app/dist/` |
| `npm run preview` | Sirve el build para probarlo (aquí funciona el modo sin conexión) |

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
