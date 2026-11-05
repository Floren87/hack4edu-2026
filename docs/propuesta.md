# Propuesta de producto · alcance final del prototipo

**Actualización 5 de noviembre de 2026:** la demo implementada es **online**, con frontend en GitHub Pages, API TypeScript/Fastify externa en Render y datos persistentes en Turso. No funciona offline ni llama a modelos de IA externos. Referencias vigentes: [arquitectura, tecnologías y límites](arquitectura.md) y [datos y seguridad](datos-y-seguridad.md).

> **KoraMAP**: un juego visual, sin necesidad de leer ni de hablar el idioma del país, que ayuda al psicólogo, orientador o docente a **descubrir las fortalezas e intereses de niños y niñas que llegan desplazados a otro país**: creatividad, lógica, comunicación, colaboración y resolución de problemas. Los talentos que no salen en las notas.

## 1. Para quién
| Persona | Qué necesita | Qué recibe |
|---|---|---|
| 👧 **Niño o niña de 7 a 14 años** recién llegado (migrante o refugiado) | Que le vean por lo que **sabe hacer**, no por el idioma ni por los papeles que no trae | Un juego de unos 10 min, con dibujos y voz, en su idioma |
| 🧑‍🏫 **Profesional**: psicólogo, orientador o docente | Un punto de partida rápido, sin intérprete, antes de sus pruebas formales | Un perfil de fortalezas **con evidencias** y sugerencias para el aula |
| 👨‍👩‍👧 **Familia** | Entender el proceso y sentirse parte | Un resumen positivo en su idioma con ideas para casa |

Contexto: en las escuelas se les ubica por edad («nadie comprueba el nivel», ver `investigacion/entrevistas.md`), y los tests profesionales (TAMAI, MP-R…) son de pago y dependen del idioma (ver `investigacion/tests-de-referencia.md`). **No competimos con ellos: somos el paso previo.**

## 1 bis. No es un test de un solo uso: es un juego para volver
El niño puede **repetir y subir de nivel** cuando quiera: cada juego tiene niveles que se desbloquean, estrellas que se mejoran repitiendo e insignias que premian el **esfuerzo** (💪 perseverante, 🧭 explorador, 📅 constante), no ser el mejor. Varios niños pueden compartir el mismo móvil o tablet.
- **Para el niño:** practica y mejora sus habilidades, y ve su propio progreso.
- **Para el profesional:** ve la **evolución** a lo largo de los días, no una foto de un día. Más partidas significan más evidencias y menos riesgo de etiquetar (refuerza R14 y R15). Los intereses también se observan en lo que el niño **elige jugar** una y otra vez.
- **Sin trampas de diseño:** no hay rankings entre niños, ni rachas que castiguen, ni anuncios, ni compras.

## 2. Comprobación del Reto 20 frase a frase
Texto oficial: *«…identificar habilidades, intereses y fortalezas que muchas veces no aparecen en las evaluaciones tradicionales, especialmente en estudiantes de contextos vulnerables. Mediante actividades, retos prácticos, juegos o IA, la herramienta podrá detectar capacidades como creatividad, pensamiento lógico, comunicación, colaboración o resolución de problemas y ofrecer al docente información para orientar y personalizar el aprendizaje, evitando etiquetas o decisiones automatizadas sobre el alumnado.»*

| # | Lo que pide el reto | Cómo lo cumplimos | Se ve en la demo |
|---|---|---|---|
| R1 | Habilidades | 4 minijuegos, uno por capacidad (sección 4) | Pantalla del niño |
| R2 | **Intereses** | «Mapa de mundos»: el niño elige a dónde viajar (construir, explorar, crear, ayudar, organizar, contar) | Inicio del juego y perfil |
| R3 | Fortalezas | El perfil solo habla en positivo: «destaca en…», «aún no observado» (nunca «bajo» ni «suspenso») | Panel del profesional |
| R4 | Que no aparecen en evaluaciones tradicionales | Se mide **cómo** juega (estrategias, intentos, ideas originales), no respuestas de examen ni contenidos del currículo | Panel: «evidencias» |
| R5 | Contextos vulnerables | Interfaz visual y multidioma (ES, EN, FR, AR, UK). **La demo requiere Internet; offline queda fuera del alcance.** No se ha medido rendimiento en todos los móviles de bajo coste. | Cambio de idioma en directo y prueba de red |
| R6 | Actividades, retos prácticos, juegos **o IA** | Juegos y reglas locales que generan el informe y las sugerencias (sección 5) | Panel |
| R7 | **Creatividad** | Minijuego «¿Qué inventas?» | ✅ |
| R8 | **Pensamiento lógico** | Minijuego «Patrones» | ✅ |
| R9 | **Comunicación** | Minijuego «Cuenta la historia» | ✅ |
| R10 | **Colaboración** | Minijuego «Ayuda al robot» + observación del profesional | ✅ |
| R11 | **Resolución de problemas** | Se mide en todos los juegos: reintentos, cambio de estrategia, perseverancia | ✅ |
| R12 | Información **al docente** | Panel con perfil, evidencias y lo que la IA sugiere | ✅ |
| R13 | **Orientar y personalizar** el aprendizaje | 3 sugerencias concretas para el aula por niño («proponle ser el encargado de…», «trabaja mejor con material manipulativo») | ✅ |
| R14 | **Evitar etiquetas** | Métricas descriptivas del juego, sin rankings ni etiquetas clínicas. Los porcentajes no son puntuaciones psicométricas validadas; cada fortaleza enlaza con su evidencia. | ✅ |
| R15 | **Evitar decisiones automatizadas** | La IA **sugiere**; el profesional marca cada observación como «coincide / no coincide con lo que veo» y solo entonces se guarda. Nada se decide solo | ✅ Botones de validación |

## 3. Comprobación de los criterios del jurado
**Modalidad innovadora** (la nuestra; hay que confirmarla en la inscripción):
| Criterio | Peso | Nuestra respuesta |
|---|---|---|
| Creatividad e innovación | 40 % | Evaluar sin idioma común y a través del juego, para niños desplazados. Mide el proceso, no solo el resultado |
| Grado de acabado | 20 % | Demo que funciona de punta a punta en el móvil desde un QR |
| Transferencia al mercado | 20 % | Gratis para niños, familias y ONG; licencias para administraciones y servicios de acogida (lo investiga Cristina: TAM/SAM/SOM) |
| IA en países desfavorecidos | 20 % | Diseño visual y cinco idiomas, incluidos árabe, francés y ucraniano; reglas locales interpretables sin llamadas a un modelo de pago. La demo es online: necesita conectividad y hosting disponible. Offline y validación de campo quedan pendientes. |
| ⚠️ Evidencias del 3 al 5 de noviembre | −20 % si faltan | Commits y PR fechados en este repo |

**Premio Retos ProFuturo** (⚠️ hay que confirmar si el Reto 20 lleva la etiqueta «Reto ProFuturo» en la web):
| Criterio | Peso | Nuestra respuesta |
|---|---|---|
| Impacto social en contextos vulnerables | 25 % | Niños desplazados: ubicados por edad, sin documentos ni idioma |
| Inclusión y equidad | 25 % | Sin leer, con voz, pictogramas, accesible, multidioma |
| Sostenibilidad y escalabilidad | 25 % | Código abierto, sin servidor obligatorio, coste casi cero por niño |
| IA ética y responsable | 25 % | Sección 6 |

**Entregables (5 nov, 23:59):** ☐ vídeo de 3 min (niño → familia → profesional, QR al final) ☐ presentación de 5 min (reutiliza el guion del vídeo) ☐ enlace a este repo ☐ código con licencia libre ✅

## 3 bis. Marco de referencia

**1. Diseño Universal para el Aprendizaje (DUA / UDL).** Autores: David Rose y Anne Meyer, CAST (Center for Applied Special Technology). Fuente: [udlguidelines.cast.org](https://udlguidelines.cast.org/).
KoraMAP aplica el **tercer principio del DUA, «Múltiples formas de acción y expresión»**: el niño demuestra lo que sabe y sus habilidades jugando, sin la barrera de las evaluaciones tradicionales en papel o con texto.

**2. ODS 4 – Educación de calidad, meta 4.a (entornos de aprendizaje inclusivos y seguros).** Fuente: [Naciones Unidas, ODS 4](https://www.un.org/sustainabledevelopment/es/education/).
Texto oficial: «Construir y adecuar instalaciones educativas que tengan en cuenta las necesidades de los niños y las personas con discapacidad y las diferencias de género, y que ofrezcan entornos de aprendizaje seguros, no violentos, inclusivos y eficaces para todos».

**3. ODS 4 – meta 4.5 (igualdad y no discriminación en la educación).** Es la meta más directamente ligada al Reto 20.
Texto oficial: «De aquí a 2030, eliminar las disparidades de género en la educación y asegurar el acceso igualitario a todos los niveles de la enseñanza y la formación profesional para las personas vulnerables, incluidas las personas con discapacidad, los pueblos indígenas y los niños en situaciones de vulnerabilidad».

## 4. Los minijuegos
Cada uno dura 1-2 min, tiene instrucciones con voz y animación y **ninguna respuesta es «incorrecta»** para el niño (siempre hay refuerzo positivo).

| Minijuego | Capacidad | Mecánica | Evidencias que se registran |
|---|---|---|---|
| 🗺️ **Mapa de mundos** | Intereses | Elige 3 de 6 islas (taller, selva, estudio de arte, hospital, mercado, escenario) | Orden de elección y tiempo en cada una |
| 🧩 **Patrones** | Lógica | Completar secuencias de figuras y colores de dificultad creciente (adaptativa) | Nivel alcanzado, aciertos y tiempo |
| 💡 **¿Qué inventas?** | Creatividad | «¿Para qué puedes usar esta caja?»: combina objetos dibujados para inventar usos | Número de ideas (fluidez), variedad (flexibilidad) y rareza respecto al resto (originalidad) |
| 📖 **Cuenta la historia** | Comunicación | Ordena 4 viñetas y elige cómo se siente cada personaje | Coherencia de la secuencia y reconocimiento de emociones |
| 🤖 **Ayuda al robot** | Colaboración | El robot y el niño comparten piezas para construir algo; el niño decide cuándo pedir o dar ayuda | Turnos, piezas compartidas y peticiones de ayuda |
| 🔁 Transversal | Resolución de problemas | — | Reintentos tras fallar, cambio de estrategia, perseverancia |

Diseño propio: **no se copia ningún ítem de tests con derechos**. Los marcos de inspiración son las áreas del MP-R y CASEL, y el modelo RIASEC para los intereses.

## 5. Dónde está la IA
Los informes profesional y familiar se generan **solo con reglas locales interpretables** en `app/src/utils/aiPedagogy.ts`, usando las evidencias del juego. Se muestran en el idioma elegido, con sugerencias y revisión del profesional. No se envían expedientes a Claude ni a ningún modelo externo y no se calcula una rareza estadística frente a una población validada.

Integrar en el futuro un modelo que redacte sugerencias requeriría definir datos mínimos, proveedor, evaluación y protección de datos. Es una mejora propuesta, no una función entregada.

**Las reglas locales no hacen offline a la aplicación:** login, carga, permisos y guardado dependen de la API remota. Un HTML ya descargado puede abrirse posteriormente; no permite usar toda la app sin Internet.

## 6. Lo que NO hace (IA ética)
- ❌ No diagnostica ni da un CI ni etiquetas clínicas. No sustituye los tests profesionales.
- ❌ No decide curso, grupo ni ubicación: lo decide el profesional.
- ❌ No usa cámara, reconocimiento facial ni grabación de voz del niño.
- ✅ Alumnos mediante pseudónimo («Zorro Azul 🦊»), sin solicitar nombre real. Perfil, progreso y notas educativas se guardan en Turso a través de la API y se pueden borrar desde el panel. Los pseudónimos no garantizan anonimización irreversible; ver [datos y seguridad](datos-y-seguridad.md).
- ⏳ Consentimiento de la familia en la primera pantalla (con voz y en su idioma). **Pendiente:** la app aún no lo tiene.
- ✅ Cada frase del informe se puede comprobar con su evidencia; la IA explica sus límites («basado en 10 minutos de juego; contrástalo con tu observación»).

## 7. Arquitectura y alcance para el hackathon
- **App (`app/`):** React 19 + TypeScript + Vite + Tailwind. Web **online** en GitHub Pages; el QR abre esa web. Sin service worker de caché, expedientes en localStorage ni sincronización offline. El manifiesto permite acceso directo/pantalla completa cuando el navegador lo ofrece.
- **Idiomas:** ES/EN/FR/AR/UK en acceso, gestión, juegos e informes; árabe RTL y voz según las voces disponibles en el dispositivo.
- **Reglas:** informe calculado localmente, con evidencias y sugerencias orientativas; sin modelo externo ni diagnóstico. Los datos que necesita se cargan mediante la API.
- **Backend (`backend/`):** TypeScript + Fastify + Zod, sesiones Bearer y SQLite/libSQL. API en Render y base remota en Turso. Cuentas con usuario inventado y hash scrypt, alumnos aislados por propietario y estado actual con revisión profesional. FastAPI fue una propuesta histórica sustituida.

| Prioridad | Qué entra | Estado |
|---|---|---|
| **Entregado** (demo online de punta a punta) | Login/registro → alumnos con pseudónimos → juegos → guardado remoto → salida con contraseña → resultados/revisión → resumen familiar y exportación HTML/PDF. Cinco idiomas y frontend publicado en Pages. | ✅ `app/` + `backend/` |
| **Pendiente operativo de cierre** | Revisar PR final, comprobar publicación del logo/documentación y la red del evento; QR, vídeo y presentación del equipo | Revisar `estado.md` |
| **Después del hackathon** | Consentimiento/gestión de derechos, recuperación y borrado de cuentas, historial versionado, panel por centro, evaluación de IA externa, estudios de validez y posible diseño offline | Fuera del MVP |

## 8. Respuestas de Delia (4 nov)
1. **Edad:** un solo rango, **desde los 7 años** (7-14 en la validación de la API). La publicación en tiendas no forma parte de la demo y requeriría revisar sus políticas; no se declara una certificación para Google Play.
2. **Capacidades:** las 5 del reto. Otras, en futuras actualizaciones.
3. **Informes:** uno **técnico para el psicólogo o psicopedagogo** y otro **sencillo para el docente y la familia** → hecho: informe técnico en el panel profesional y resumen en el espacio familiar.
4. **Rutas del vídeo:** Sudán → Chad (Amira; árabe y francés), Venezuela → Colombia (español) y Ucrania → España (ucraniano).
5. **Estilo visual:** los bocetos ya están adaptados a los minijuegos.
