import { useRef } from 'react'
import { hablar } from '../i18n.js'

// Creatividad, inspirado en la tarea clásica de "usos alternativos" (diseño propio).
// fluidez = cuántas ideas · flexibilidad = de cuántas categorías · originalidad = rareza
// rareza: 0 = muy habitual, 1 = algo habitual, 2 = poco habitual
export const IDEAS = [
  { id: 'guardar', emoji: '🧸', categoria: 'guardar', rareza: 0 },
  { id: 'regalo', emoji: '🎁', categoria: 'guardar', rareza: 0 },
  { id: 'casa_gato', emoji: '🐱', categoria: 'hogar', rareza: 1 },
  { id: 'silla', emoji: '🪑', categoria: 'hogar', rareza: 1 },
  { id: 'coche', emoji: '🚗', categoria: 'transporte', rareza: 1 },
  { id: 'barco', emoji: '⛵', categoria: 'transporte', rareza: 2 },
  { id: 'tambor', emoji: '🥁', categoria: 'musica', rareza: 2 },
  { id: 'cohete', emoji: '🚀', categoria: 'imaginacion', rareza: 2 },
  { id: 'mascara', emoji: '🎭', categoria: 'imaginacion', rareza: 2 },
  { id: 'teatro', emoji: '🎪', categoria: 'juego', rareza: 2 },
  { id: 'maceta', emoji: '🌱', categoria: 'naturaleza', rareza: 2 },
  { id: 'escondite', emoji: '🙈', categoria: 'juego', rareza: 1 },
]

export default function Inventa({ sesion, registrar, t, siguiente }) {
  const inicio = useRef(Date.now())
  const elegidas = sesion.evidencias.inventa?.ideas ?? []

  function tocar(id) {
    const ideas = elegidas.includes(id) ? elegidas.filter((x) => x !== id) : [...elegidas, id]
    registrar('inventa', { ideas, tiempoMs: Date.now() - inicio.current })
  }

  return (
    <div className="pantalla">
      <h1>
        📦 {t('inventa_titulo')}{' '}
        <button className="altavoz" onClick={() => hablar(t('inventa_titulo') + ' ' + t('inventa_instr'), sesion.idioma)}>🔊</button>
      </h1>
      <p>{t('inventa_instr')} · 💡 {elegidas.length}</p>
      <div className="rejilla">
        {IDEAS.map((idea) => (
          <button
            key={idea.id}
            className={'casilla grande' + (elegidas.includes(idea.id) ? ' activo' : '')}
            onClick={() => tocar(idea.id)}
          >
            {idea.emoji}
          </button>
        ))}
      </div>
      <button className="principal" disabled={elegidas.length === 0} onClick={siguiente}>
        {t('terminado')} ✓
      </button>
    </div>
  )
}
