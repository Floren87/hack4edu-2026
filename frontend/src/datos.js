// Estado de la app: se guarda SOLO en este dispositivo (localStorage).
// Varios niños pueden compartir el mismo móvil o tablet (habitual en escuelas y campos de acogida).
// Nunca se guarda el nombre real: cada jugador es un avatar (pseudónimo).

const CLAVE = 'tsf-v2'

export function estadoNuevo(idioma = 'es') {
  return { idioma, consentimiento: false, jugadores: [], activo: null }
}

export function jugadorNuevo(avatar) {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
    avatar, // { emoji, nombre }
    creado: Date.now(),
    intereses: [], // islas elegidas al empezar, en orden
    progreso: {}, // { [juego]: { desbloqueado: n, estrellas: { [nivel]: 0-3 } } }
    partidas: [], // historial completo: { juego, nivel, fecha, estrellas, ...evidencias }
    insignias: [], // logros de esfuerzo, no de "ser el mejor"
    validaciones: {}, // del profesional: { [capacidad]: 'coincide' | 'no_coincide' }
  }
}

export function cargar() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE))
  } catch {
    return null
  }
}

export function guardar(estado) {
  localStorage.setItem(CLAVE, JSON.stringify(estado))
}

export function borrar() {
  localStorage.removeItem(CLAVE)
}

// Datos inventados para la demo (#demo en la URL): un niño que ha jugado varios días
export function estadoDemo() {
  const dia = 24 * 3600 * 1000
  const hace = (d) => Date.now() - d * dia
  const zorro = {
    ...jugadorNuevo({ emoji: '🦊', nombre: 'Zorro' }),
    id: 'demo',
    creado: hace(6),
    intereses: ['taller', 'arte', 'hospital'],
    progreso: {
      patrones: { desbloqueado: 6, estrellas: { 1: 3, 2: 3, 3: 2, 4: 3, 5: 1 } },
      inventa: { desbloqueado: 3, estrellas: { 1: 2, 2: 3 } },
    },
    partidas: [
      { juego: 'patrones', nivel: 1, fecha: hace(6), estrellas: 3, errores: 0, reintentos: 0 },
      { juego: 'patrones', nivel: 2, fecha: hace(6), estrellas: 2, errores: 2, reintentos: 2 },
      { juego: 'inventa', nivel: 1, fecha: hace(5), estrellas: 2, ideas: ['guardar', 'barco', 'tambor', 'casa_gato'] },
      { juego: 'patrones', nivel: 2, fecha: hace(4), estrellas: 3, errores: 0, reintentos: 0 },
      { juego: 'patrones', nivel: 3, fecha: hace(4), estrellas: 1, errores: 4, reintentos: 4 },
      { juego: 'patrones', nivel: 3, fecha: hace(3), estrellas: 2, errores: 2, reintentos: 2 },
      { juego: 'patrones', nivel: 4, fecha: hace(2), estrellas: 3, errores: 0, reintentos: 0 },
      { juego: 'inventa', nivel: 2, fecha: hace(2), estrellas: 3, ideas: ['flor', 'cohete', 'maraca', 'lampara', 'regar', 'bolos'] },
      { juego: 'patrones', nivel: 5, fecha: hace(1), estrellas: 1, errores: 3, reintentos: 3 },
    ],
    insignias: ['primera', 'perseverante', 'explorador', 'constante'],
  }
  return { idioma: 'es', consentimiento: true, jugadores: [zorro], activo: 'demo' }
}
