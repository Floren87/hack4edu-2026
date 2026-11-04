// Textos de la app por idioma. Para añadir un idioma, copia el bloque "es" y tradúcelo.
// Si falta una clave en un idioma, se usa la versión en español.

export const IDIOMAS = {
  es: { nombre: 'Español', bandera: '🇪🇸', voz: 'es-ES' },
  en: { nombre: 'English', bandera: '🇬🇧', voz: 'en-GB' },
  fr: { nombre: 'Français', bandera: '🇫🇷', voz: 'fr-FR' },
}

const TEXTOS = {
  es: {
    bienvenida: '¡Hola! Vamos a jugar',
    consentimiento_titulo: 'Antes de empezar (para la familia)',
    consentimiento_texto:
      'Este juego ayuda al profesional a conocer las fortalezas de vuestro hijo o hija. No es un examen. No guardamos su nombre ni fotos. Los datos se quedan en este dispositivo y se pueden borrar.',
    acepto: 'Estamos de acuerdo',
    elige_avatar: 'Elige tu personaje',
    empezar: '¡Empezar!',
    siguiente: 'Siguiente',
    mapa_titulo: '¿A qué islas quieres viajar?',
    mapa_instr: 'Elige 3 islas',
    isla_taller: 'Taller',
    isla_selva: 'Selva',
    isla_arte: 'Arte',
    isla_hospital: 'Cuidar',
    isla_mercado: 'Mercado',
    isla_escenario: 'Escenario',
    patrones_titulo: '¿Qué viene después?',
    patrones_instr: 'Toca la figura que sigue',
    muy_bien: '¡Muy bien!',
    prueba_otra: '¡Casi! Prueba otra vez',
    inventa_titulo: '¿Para qué puedes usar una caja?',
    inventa_instr: 'Toca todas las ideas que se te ocurran',
    terminado: 'He terminado',
    fin_titulo: '¡Gracias por jugar!',
    fin_texto: 'Lo has hecho genial. Ahora el profesor o profesora verá lo que has descubierto.',
    ver_panel: 'Panel del profesional',
    ver_familia: 'Resumen para la familia',
    panel_titulo: 'Perfil de fortalezas',
    panel_aviso:
      'Basado en unos minutos de juego. Es un punto de partida, no un diagnóstico: contrástalo con tu observación. Tú decides.',
    sin_ia: 'Generado sin IA (modo sin conexión)',
    con_ia: 'Redactado con IA a partir de las evidencias',
    generar_ia: 'Redactar con IA',
    evidencias: 'Evidencias',
    coincide: 'Coincide con lo que veo',
    no_coincide: 'No coincide',
    intereses: 'Intereses',
    sugerencias: 'Ideas para el aula',
    no_observado: 'Aún no observado en este juego',
    familia_titulo: 'Lo que hemos descubierto',
    familia_casa: 'Ideas para casa',
    borrar: 'Borrar todos los datos',
    volver: 'Volver al inicio',
    cap_logica: 'Pensamiento lógico',
    cap_creatividad: 'Creatividad',
    cap_perseverancia: 'Resolución de problemas',
  },
  en: {
    bienvenida: "Hi! Let's play",
    consentimiento_titulo: 'Before we start (for the family)',
    consentimiento_texto:
      "This game helps the professional discover your child's strengths. It is not a test. We do not store their name or photos. Data stays on this device and can be deleted.",
    acepto: 'We agree',
    elige_avatar: 'Choose your character',
    empezar: 'Start!',
    siguiente: 'Next',
    mapa_titulo: 'Which islands do you want to visit?',
    mapa_instr: 'Choose 3 islands',
    isla_taller: 'Workshop',
    isla_selva: 'Jungle',
    isla_arte: 'Art',
    isla_hospital: 'Caring',
    isla_mercado: 'Market',
    isla_escenario: 'Stage',
    patrones_titulo: 'What comes next?',
    patrones_instr: 'Tap the shape that follows',
    muy_bien: 'Great job!',
    prueba_otra: 'Almost! Try again',
    inventa_titulo: 'What can you do with a box?',
    inventa_instr: 'Tap every idea you can think of',
    terminado: "I'm done",
    fin_titulo: 'Thanks for playing!',
    fin_texto: 'You did great. Now your teacher will see what you discovered.',
    ver_panel: 'Professional panel',
    ver_familia: 'Family summary',
    panel_titulo: 'Strengths profile',
    panel_aviso:
      'Based on a few minutes of play. A starting point, not a diagnosis: compare it with your own observation. You decide.',
    sin_ia: 'Generated without AI (offline mode)',
    con_ia: 'Written by AI from the evidence',
    generar_ia: 'Write with AI',
    evidencias: 'Evidence',
    coincide: 'Matches what I see',
    no_coincide: "Doesn't match",
    intereses: 'Interests',
    sugerencias: 'Classroom ideas',
    no_observado: 'Not yet observed in this game',
    familia_titulo: 'What we discovered',
    familia_casa: 'Ideas for home',
    borrar: 'Delete all data',
    volver: 'Back to start',
    cap_logica: 'Logical thinking',
    cap_creatividad: 'Creativity',
    cap_perseverancia: 'Problem solving',
  },
  fr: {
    bienvenida: 'Salut ! On joue ?',
    acepto: "Nous sommes d'accord",
    elige_avatar: 'Choisis ton personnage',
    empezar: 'On commence !',
    siguiente: 'Suivant',
    mapa_titulo: 'Quelles îles veux-tu visiter ?',
    mapa_instr: 'Choisis 3 îles',
    patrones_titulo: 'Qu’est-ce qui vient après ?',
    muy_bien: 'Très bien !',
    prueba_otra: 'Presque ! Essaie encore',
    inventa_titulo: 'Que peux-tu faire avec une boîte ?',
    terminado: "J'ai fini",
    fin_titulo: "Merci d'avoir joué !",
  },
}

export function traductor(idioma) {
  return (clave) => TEXTOS[idioma]?.[clave] ?? TEXTOS.es[clave] ?? clave
}

// Lee un texto en voz alta (para niños que aún no leen o no conocen el idioma)
export function hablar(texto, idioma) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(texto)
  u.lang = IDIOMAS[idioma]?.voz ?? 'es-ES'
  u.rate = 0.9
  window.speechSynthesis.speak(u)
}
