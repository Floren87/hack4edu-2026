// Sesión de juego: se guarda SOLO en este dispositivo (localStorage).
// Nunca se guarda el nombre real del niño: solo el avatar/pseudónimo que elige.

const CLAVE = 'tsf-sesion'

export function sesionNueva(idioma) {
  return {
    idioma,
    avatar: null, // { emoji, nombre } p. ej. { emoji: '🦊', nombre: 'Zorro' }
    consentimiento: false,
    evidencias: {
      intereses: [], // ids de islas en el orden elegido
      patrones: null, // { nivelMax, aciertos, fallos, reintentosTrasFallo, tiempoMedioMs }
      inventa: null, // { ideas: [ids], tiempoMs }
    },
    validaciones: {}, // { [capacidad]: 'coincide' | 'no_coincide' }
  }
}

export function cargar() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE))
  } catch {
    return null
  }
}

export function guardar(sesion) {
  localStorage.setItem(CLAVE, JSON.stringify(sesion))
}

export function borrar() {
  localStorage.removeItem(CLAVE)
}

// Datos inventados para la demo (#demo en la URL)
export function sesionDemo() {
  return {
    ...sesionNueva('es'),
    consentimiento: true,
    avatar: { emoji: '🦊', nombre: 'Zorro' },
    evidencias: {
      intereses: ['taller', 'arte', 'hospital'],
      patrones: { nivelMax: 4, aciertos: 6, fallos: 2, reintentosTrasFallo: 2, tiempoMedioMs: 5200 },
      inventa: { ideas: ['guardar', 'barco', 'tambor', 'cohete', 'maceta', 'silla'], tiempoMs: 48000 },
    },
  }
}
