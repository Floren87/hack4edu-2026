## Qué hace este PR

El botón, título e instrucciones de salida del modo niño pasan de «Volver al adulto» a **«Volver al Perfil Docente»**, con traducciones en ES/EN/FR/AR/UK. La salida sigue requiriendo la contraseña del profesional.

El **usuario inventado de la cuenta actual** aparece bajo «Perfil Docente» en la cabecera profesional y en «Mis alumnos», también cuando la cuenta aún no tiene alumnos. Miguel confirmó ese alcance: no se añade un nombre real, edición del perfil ni un listado compartido de profesores. Un componente `TeacherIdentity` reutiliza los estilos existentes, aísla la dirección del usuario y dispone de espacio propio en la cabecera móvil. La identidad se oculta en modo niño y desaparece al cerrar sesión. No cambia la API, las sesiones ni la BBDD.

## Cómo probarlo

1. Desde `app/`, `npm ci` y `npm run dev`. Registrar o iniciar sesión con un usuario ficticio: debe verse en la cabecera y en «Mis alumnos».
2. Crear alumno → Comenzar juego: la identidad docente desaparece. «Volver al Perfil Docente» abre el diálogo; solo la contraseña correcta permite regresar. El usuario vuelve a aparecer al salir.
3. Repetir cambios de idioma en profesional y niño, y comprobar móvil/árabe RTL. Cerrar sesión y confirmar que la identidad anterior desaparece.

**Validado:** tipos, **18 tests unitarios**, **build de producción y 18 E2E** correctos en [CI sobre `fd3cc7d`](https://github.com/Floren87/hack4edu-2026/actions/runs/42036535831). Las E2E cubren además CRUD, guardado, permisos, informes, juegos y distribución. La nueva prueba recorre los cinco idiomas, usuario de longitud máxima, recarga, panel vacío, resultados, móvil, retorno con contraseña y logout.

La CI de frontend se ejecuta también al subir ramas `feat/` y `fix/`, instala la API de pruebas y Chromium y conserva capturas tres días. Utiliza únicamente una base en memoria; la suite remota `test:live` sigue excluida. Referencia del procedimiento: [Playwright en CI](https://playwright.dev/docs/ci-intro). No se escriben datos en Render/Turso. En Windows pasan tipos y unitarios; el módulo nativo de Tailwind está bloqueado por el sistema y por eso build/E2E se verifican en Ubuntu/Node 22/Chromium.

## Checklist

- [x] Parte de `develop` actualizado; sin commits directos en ramas protegidas.
- [x] Validación completa en CI; decisión y estado documentados.
- [x] Sin secretos ni datos personales en el repositorio.
- [x] Código generado con IA, revisado y probado. Integración/merge a cargo de Floren.
