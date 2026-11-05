# Documentación de KoraMAP

## Empieza por aquí
1. **[Propuesta de producto](propuesta.md):** para quién es, cómo cumple el Reto 20 frase a frase, los criterios del jurado, el marco de referencia (DUA y ODS 4), los minijuegos y la IA ética.
2. **[Arquitectura](arquitectura.md):** cómo está construida la app (web, API y base de datos) y sus límites.
3. **[Datos y seguridad](datos-y-seguridad.md):** qué datos se guardan y cómo se protegen. Hay también una [política de privacidad pública](https://floren87.github.io/hack4edu-2026/privacidad.html), que en el repo está en [`app/public/privacidad.html`](../app/public/privacidad.html).
4. **Investigación**, en la que se basa la propuesta:
   - [Entrevistas](investigacion/entrevistas.md)
   - [Mapas de empatía](investigacion/mapas-de-empatia.md) del niño, la familia y el profesional
   - [Tests de referencia](investigacion/tests-de-referencia.md) y cómo nos situamos frente a ellos
5. **[Decisiones](decisiones.md):** registro de lo que decidió el equipo, con fecha y responsable.
6. **[Estado](estado.md):** quién hace qué, próximos pasos, mejoras futuras y diario de sesiones.

## Notas técnicas del equipo (`equipo/`)
Documentos de trabajo para quien desarrolla:

| Documento | Qué contiene |
|---|---|
| [integracion-backend.md](equipo/integracion-backend.md) | Cómo se conecta la app con la API |
| [despliegue-demo.md](equipo/despliegue-demo.md) | Despliegue y comprobación de la API (Render) y la base de datos (Turso) |
| [i18n.md](equipo/i18n.md) | Arquitectura, mantenimiento y pruebas de los cinco idiomas |
| [traspaso-floren.md](equipo/traspaso-floren.md) | Resumen de los cambios del backend para integrarlos |
| [pr-backend.md](equipo/pr-backend.md), [pr-perfil-docente.md](equipo/pr-perfil-docente.md), [pr-logo-arquitectura-online.md](equipo/pr-logo-arquitectura-online.md) | Descripciones de PR de Miguel |
| [backend-profesionales.md](equipo/backend-profesionales.md) | Propuesta histórica (FastAPI). Se sustituyó por el [backend actual](../backend/README.md) |
