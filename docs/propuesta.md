# Propuesta de producto · v1 (para revisar en equipo)

> **TalentoSinFronteras** (nombre de trabajo): un juego visual, sin necesidad de leer ni de hablar el idioma del país, que ayuda al psicólogo, orientador o docente a **descubrir las fortalezas e intereses de niños y niñas que llegan desplazados a otro país**: creatividad, lógica, comunicación, colaboración y resolución de problemas. Los talentos que no salen en las notas.

## 1. Para quién
| Persona | Qué necesita | Qué recibe |
|---|---|---|
| 👧 **Niño o niña de 7 a 14 años** recién llegado (migrante o refugiado) | Que le vean por lo que **sabe hacer**, no por el idioma ni por los papeles que no trae | Un juego de unos 10 min, con dibujos y voz, en su idioma |
| 🧑‍🏫 **Profesional**: psicólogo, orientador o docente | Un punto de partida rápido, sin intérprete, antes de sus pruebas formales | Un perfil de fortalezas **con evidencias** y sugerencias para el aula |
| 👨‍👩‍👧 **Familia** | Entender el proceso y sentirse parte | Un resumen positivo en su idioma con ideas para casa |

Contexto: en las escuelas se les ubica por edad («nadie comprueba el nivel», ver `investigacion/entrevistas.md`), y los tests profesionales (TAMAI, MP-R…) son de pago y dependen del idioma (ver `investigacion/tests-de-referencia.md`). **No competimos con ellos: somos el paso previo.**

## 2. Comprobación del Reto 20 frase a frase
Texto oficial: *«…identificar habilidades, intereses y fortalezas que muchas veces no aparecen en las evaluaciones tradicionales, especialmente en estudiantes de contextos vulnerables. Mediante actividades, retos prácticos, juegos o IA, la herramienta podrá detectar capacidades como creatividad, pensamiento lógico, comunicación, colaboración o resolución de problemas y ofrecer al docente información para orientar y personalizar el aprendizaje, evitando etiquetas o decisiones automatizadas sobre el alumnado.»*

| # | Lo que pide el reto | Cómo lo cumplimos | Se ve en la demo |
|---|---|---|---|
| R1 | Habilidades | 4 minijuegos, uno por capacidad (sección 4) | Pantalla del niño |
| R2 | **Intereses** | «Mapa de mundos»: el niño elige a dónde viajar (construir, explorar, crear, ayudar, organizar, contar) | Inicio del juego y perfil |
| R3 | Fortalezas | El perfil solo habla en positivo: «destaca en…», «aún no observado» (nunca «bajo» ni «suspenso») | Panel del profesional |
| R4 | Que no aparecen en evaluaciones tradicionales | Se mide **cómo** juega (estrategias, intentos, ideas originales), no respuestas de examen ni contenidos del currículo | Panel: «evidencias» |
| R5 | Contextos vulnerables | Sin leer, sin idioma común, en móvil barato, **sin conexión**, multidioma (ES, EN, FR, AR, UK) | Cambio de idioma en directo |
| R6 | Actividades, retos prácticos, juegos **o IA** | Juegos + IA que redacta el informe y las sugerencias (sección 5) | Panel |
| R7 | **Creatividad** | Minijuego «¿Qué inventas?» | ✅ |
| R8 | **Pensamiento lógico** | Minijuego «Patrones» | ✅ |
| R9 | **Comunicación** | Minijuego «Cuenta la historia» | ✅ |
| R10 | **Colaboración** | Minijuego «Ayuda al robot» + observación del profesional | ✅ |
| R11 | **Resolución de problemas** | Se mide en todos los juegos: reintentos, cambio de estrategia, perseverancia | ✅ |
| R12 | Información **al docente** | Panel con perfil, evidencias y lo que la IA sugiere | ✅ |
| R13 | **Orientar y personalizar** el aprendizaje | 3 sugerencias concretas para el aula por niño («proponle ser el encargado de…», «trabaja mejor con material manipulativo») | ✅ |
| R14 | **Evitar etiquetas** | Sin puntuaciones numéricas ni rankings, sin palabras como «superdotado» o «déficit». Cada fortaleza enlaza con la evidencia que la apoya | ✅ |
| R15 | **Evitar decisiones automatizadas** | La IA **sugiere**; el profesional marca cada observación como «coincide / no coincide con lo que veo» y solo entonces se guarda. Nada se decide solo | ✅ Botones de validación |

## 3. Comprobación de los criterios del jurado
**Modalidad innovadora** (la nuestra; hay que confirmarla en la inscripción):
| Criterio | Peso | Nuestra respuesta |
|---|---|---|
| Creatividad e innovación | 40 % | Evaluar sin idioma común y a través del juego, para niños desplazados. Mide el proceso, no solo el resultado |
| Grado de acabado | 20 % | Demo que funciona de punta a punta en el móvil desde un QR |
| Transferencia al mercado | 20 % | Gratis para niños, familias y ONG; licencias para administraciones y servicios de acogida (lo investiga Cristina: TAM/SAM/SOM) |
| IA en países desfavorecidos | 20 % | Funciona sin conexión y en móviles baratos; idiomas de las rutas reales (árabe, francés, ucraniano); pensado para campos y escuelas de acogida en América Latina, África y Europa |
| ⚠️ Evidencias del 3 al 5 de noviembre | −20 % si faltan | Commits y PR fechados en este repo |

**Premio Retos ProFuturo** (⚠️ hay que confirmar si el Reto 20 lleva la etiqueta «Reto ProFuturo» en la web):
| Criterio | Peso | Nuestra respuesta |
|---|---|---|
| Impacto social en contextos vulnerables | 25 % | Niños desplazados: ubicados por edad, sin documentos ni idioma |
| Inclusión y equidad | 25 % | Sin leer, con voz, pictogramas, accesible, multidioma |
| Sostenibilidad y escalabilidad | 25 % | Código abierto, sin servidor obligatorio, coste casi cero por niño |
| IA ética y responsable | 25 % | Sección 6 |

**Entregables (5 nov, 23:59):** ☐ vídeo de 3 min (niño → familia → profesional, QR al final) ☐ presentación de 5 min (reutiliza el guion del vídeo) ☐ enlace a este repo ☐ código con licencia libre ✅

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
1. **Informe para el profesional:** la IA (Claude) recibe solo las **evidencias agregadas y anónimas** (ningún nombre ni pseudónimo) y redacta el perfil en lenguaje claro, citando la evidencia de cada afirmación, con 3 sugerencias para el aula.
2. **Resumen para la familia** en su idioma, en positivo.
3. **Originalidad en «¿Qué inventas?»:** valora qué ideas son poco habituales.
4. **Sin conexión:** si no hay internet, el informe se genera con plantillas y reglas en el propio móvil y se marca «generado sin IA». La app nunca deja de funcionar.

## 6. Lo que NO hace (IA ética)
- ❌ No diagnostica ni da un CI ni etiquetas clínicas. No sustituye los tests profesionales.
- ❌ No decide curso, grupo ni ubicación: lo decide el profesional.
- ❌ No usa cámara, reconocimiento facial ni grabación de voz del niño.
- ✅ Pseudónimo («Zorro Azul 🦊») elegido por el niño; los datos se quedan **en el dispositivo**; el profesional puede borrarlos con un botón.
- ✅ Consentimiento de la familia en la primera pantalla (con voz y en su idioma).
- ✅ Cada frase del informe se puede comprobar con su evidencia; la IA explica sus límites («basado en 10 minutos de juego; contrástalo con tu observación»).

## 7. Arquitectura y alcance para el hackathon
- **Frontend:** React + Vite como PWA (funciona sin conexión). Datos en el navegador (IndexedDB/localStorage). Publicado en **GitHub Pages**, que es el destino del QR.
- **Backend mínimo:** FastAPI con **un solo endpoint**, `POST /api/informe`, que llama a Claude con las evidencias agregadas. Se despliega en un servicio gratuito. La clave de la API solo está en el servidor, nunca en el repo.
- **Idiomas:** ficheros JSON de textos (`es`, `en`, `fr`, `ar`, `uk`); audio con la síntesis de voz del navegador.

| Prioridad | Qué entra |
|---|---|
| **Imprescindible** (demo de punta a punta) | Consentimiento + avatar → Mapa de mundos → Patrones → ¿Qué inventas? → Panel del profesional con validación → Resumen para la familia · Modo sin IA · ES + otro idioma |
| **Si da tiempo** | Cuenta la historia · Ayuda al robot · IA real en el informe · árabe con escritura de derecha a izquierda |
| **Después del hackathon** | Varios niños por profesional y sincronización, panel por centro, estudios de validez con psicólogos |

## 8. Reparto y calendario propuestos (hora de Madrid)
| Cuándo | Floren | Miguel | Cristina | Delia |
|---|---|---|---|---|
| Hoy hasta las 15:00 | Esqueleto de la app + despliegue | Revisar esta propuesta, montar el backend | Investigación de mercado | Pantallas |
| Llamada de 15:00 a 19:00 | Validar propuesta y diseño | | Guion del vídeo | Diseño final |
| Hoy, noche | Minijuegos | Panel del profesional + IA | Presentación | Ilustraciones y textos |
| Mañana | Pulir y probar | Pulir y probar | **Grabar vídeo** | Textos en otros idiomas |
| **Mañana, 23:59** | **ENTREGA** | | | |

## 9. Preguntas para Cristina y Delia
1. ¿Rango de edad 7-14 años? ¿O lo separamos en dos versiones (7-10 y 11-14)?
2. Además de las 5 capacidades del reto, ¿queréis medir algo más? (Por ejemplo, perseverancia o curiosidad.)
3. ¿Quién usa el panel: el psicólogo, el orientador o el docente? ¿Hay que adaptar el lenguaje del informe para cada uno?
4. ¿Qué idiomas y rutas contamos en el vídeo? (Por ejemplo: Ucrania → España, Venezuela → Colombia, Sudán → Chad.)
5. ¿Os encaja el estilo visual de los bocetos con estos 5 minijuegos?
