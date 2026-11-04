# Talento sin Fronteras

**Talento sin Fronteras** es una herramienta lúdica, inclusiva y libre de etiquetas diseñada para detectar habilidades, fortalezas e intereses en estudiantes de 7 a 14 años en contextos vulnerables (migrantes, refugiados y alumnado neurodivergente), sin barreras de idioma ni pruebas punitivas.

---

## Cumplimiento Integral del Reto 20 (R1 a R15)

| # | Requisito del Reto | Cómo lo cumple Talento sin Fronteras |
|---|---|---|
| **R1** | **Habilidades** | 4 minijuegos nucleares estructurados por capacidad. |
| **R2** | **Intereses** | «Mapa de 6 Mundos» (Construir, Explorar, Crear, Ayudar, Organizar, Contar) que registra la curiosidad espontánea. |
| **R3** | **Fortalezas** | Perfil 100% en positivo («destaca en...», «en fase de observación»). Nunca «bajo» ni palabras de déficit. |
| **R4** | **No tradicional** | Se mide el proceso de juego (reintentos, estrategias, combinaciones originales), no preguntas de examen. |
| **R5** | **Contextos vulnerables** | Sin texto obligatorio, con síntesis de voz en 5 idiomas (ES, EN, FR, AR con RTL, UK), bajo consumo y modo PWA offline. |
| **R6** | **IA + Juegos** | Sistema de IA pedagógica que redacta el informe con evidencias empíricas observables. |
| **R7** | **Creatividad** | Minijuego *¿Qué inventas?* (ensamblaje y usos alternativos de objetos). |
| **R8** | **Pensamiento Lógico** | Minijuego *Patrones y Secuencias* (matrices visuales sin números). |
| **R9** | **Comunicación** | Minijuego *Cuenta la Historia* (secuencia temporal y atribución emocional con emojis). |
| **R10** | **Colaboración** | Minijuego *Ayuda al Robot Bobi* (compartir energía, herramientas y calma no verbal). |
| **R11** | **Resolución de problemas** | Medido transversalmente en todos los juegos (resiliencia, reintentos constructivos). |
| **R12** | **Información al docente** | Panel completo para orientadores, psicólogos y docentes con evidencias cronológicas. |
| **R13** | **Personalizar aprendizaje** | 3 sugerencias concretas para el aula por estudiante (ej. material manipulativo, apoyos visuales). |
| **R14** | **Evitar etiquetas** | Sin coeficientes numéricos de CI, sin clasificaciones patologizantes. Cada fortaleza enlaza con su evidencia. |
| **R15** | **Evitar decisiones automáticas** | La IA sugiere; el docente valida cada elemento con botones («Coincide con el aula» / «En observación»). |

---

## Los 6 Mundos y sus Actividades para Neurodivergentes

Todo lo interactuado en los mundos se registra automáticamente en el informe pedagógico:

1. **Mundo Construir ** ➔ *Torre de Equilibrio Zen*: Física táctil y estabilidad espacial apilando piezas orgánicas sin penalización de fallo.
2. **Mundo Explorar ** ➔ *Constelaciones Ocultas*: Discriminación visual fina y búsqueda de patrones celestes en modo oscuro relajante.
3. **Mundo Crear ** ➔ *Sinfonía Cromática Sensorial*: Lienzo audio-visual interactivo con notas pentatónicas y ondas de color para la autorregulación.
4. **Mundo Ayudar ** ➔ *El Refugio de Criaturas*: Empatía no verbal y comprensión de diversas sensibilidades sensoriales (acústicas, térmicas e hidratación).
5. **Mundo Organizar ** ➔ *Clasificación Libre & Mándala*: Sistematización taxonómica libre según criterios propios (textura, luz, origen) sin una única respuesta impuesta.
6. **Mundo Contar ** ➔ *Balanza de Cristales Mágicos*: Sentido cuantitativo y conservación de masa sin números abstractos ni estrés de cálculo.

---

## Despliegue en GitHub Pages (HTML, CSS, JavaScript y Manifest)

Esta aplicación está desarrollada para funcionar 100% del lado del cliente en cualquier navegador moderno y desplegarse directamente en **GitHub Pages**:

1. **Subir el código a GitHub**:
   ```bash
   git add .
   git commit -m "Talento sin Fronteras: Release GitHub Pages"
   git push origin main
   ```
2. **Habilitar GitHub Pages**:
   - En tu repositorio de GitHub, ve a **Settings** ➔ **Pages**.
   - En *Build and deployment* ➔ *Source*, selecciona **GitHub Actions**.
   - El workflow `.github/workflows/deploy.yml` compilará y desplegará automáticamente la aplicación.
3. **Despliegue local o manual**:
   ```bash
   npm run build
   # El directorio /dist contiene el index.html, manifest.json, sw.js y los bundles JS/CSS estáticos
   ```
