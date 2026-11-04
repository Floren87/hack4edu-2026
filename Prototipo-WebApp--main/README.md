# Talento sin Fronteras · Prototipo de Delia

Juego visual de apoyo a la observación de habilidades, intereses y fortalezas. No diagnostica ni sustituye las pruebas de un profesional. Usar **pseudónimos**, nunca nombres reales ni datos de salud.

Esta versión parte de `deliainclusiveapps-patch-1` (`3f1c457`). El desarrollo de ES/EN y la propuesta de historial viven en `feat/ingles-historial-profesional`; no se debe hacer push directo a `main` ni a la rama de Delia.

## Arranque local

Requisitos: Node.js 22.12 o posterior; se ha comprobado con Node 26.13 y npm 11.20 en Windows.

Desde la raíz del repositorio:

```powershell
cd Prototipo-WebApp--main
npm ci
npm run dev -- --host 127.0.0.1
```

Abrir la dirección que muestra Vite, normalmente `http://127.0.0.1:3000/`. Si el puerto está ocupado, Vite muestra el siguiente disponible. No requiere claves de API, `.env` ni backend.

```powershell
npm run lint     # TypeScript
npm test         # reglas, traducción de evidencias y exportaciones seguras
npm run build    # producción en dist/
npm run preview  # comprobar el build
npm run test:e2e # recorrido de pantallas, informes y cambio de alumno en navegador
```

Las pruebas de navegador usan Edge en Windows. En otros sistemas instalar Chromium con `npx playwright install chromium`. Playwright utiliza el puerto 3000 y puede reutilizar un servidor de desarrollo existente.

## Cómo funciona

1. Elegir idioma en la bienvenida. ES/EN cubre los textos añadidos en esta rama; los otros idiomas conservan el alcance del prototipo original.
2. Crear un pseudónimo y elegir avatar, o entrar con los perfiles de muestra. Los ejemplos son ficticios.
3. Jugar los cuatro retos: creatividad, patrones, historias y colaboración. Explorar seis mundos: construir, explorar, crear, ayudar, organizar y contar.
4. Abrir el panel profesional para consultar actividades realizadas y pendientes, evidencias, sugerencias y revisión del profesional.
5. Abrir el espacio familiar para consultar ideas para casa y descargar un resumen. Las descargas son documentos HTML imprimibles; el PDF se obtiene con «Imprimir / Guardar PDF» en el navegador.

`AppContext.tsx` mantiene los perfiles y sus registros de juego en localStorage. `aiPedagogy.ts` genera informes mediante reglas locales, sin llamar a un servicio de IA. Los porcentajes del prototipo no son puntuaciones psicométricas validadas. El panel profesional actual es una vista local: **no tiene autenticación ni aislamiento entre cuentas**.

Cada guardado actual sustituye la última validación del alumno. El backend y el historial de evaluaciones versionadas están propuestos en [el diseño del backend](../docs/backend-profesionales.md), todavía sin implementar.

## Inglés

- El diccionario original está en `src/i18n/translations.ts`; los mensajes que antes estaban fijos en español están en `src/i18n/english.json`.
- `localizeText(language, mensaje, valores)` interpola parámetros y traduce las plantillas conocidas de observaciones antiguas guardadas en español. Para añadir una frase, mantener su plantilla ES y añadir EN al catálogo.
- No se traducen automáticamente pseudónimos ni notas libres del profesional.
- Los identificadores de actividades, estados y métricas no cambian con el idioma. El panel mantiene el idioma del profesional al cambiar de alumno.
- La síntesis de voz utiliza las voces disponibles en el dispositivo; disponer de una traducción no garantiza tener una voz inglesa instalada o disponible sin conexión.

## Producción y PWA

`npm run build` produce archivos estáticos en `dist/`. El service worker se registra solo en producción para evitar cachear archivos de desarrollo. No hay un workflow de GitHub Pages integrado en esta rama; su despliegue debe prepararse en un PR separado siguiendo `CONTRIBUTING.md`.

La cobertura completa sin conexión requiere una prueba de producción específica. Para probar una nueva versión, retirar la caché antigua del sitio si se había instalado la PWA anterior. Las futuras respuestas autenticadas de `/api` deben quedar excluidas del service worker, como indica la propuesta del backend.
