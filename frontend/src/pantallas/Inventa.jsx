import { useRef, useState } from 'react'
import { hablar } from '../i18n.js'

// Creatividad, inspirado en la tarea clásica de "usos alternativos" (diseño propio).
// Un objeto distinto por nivel. Se mide: fluidez (nº de ideas), flexibilidad (nº de tipos)
// y originalidad (rareza: 0 muy habitual, 1 algo habitual, 2 poco habitual).
// Limitación conocida del prototipo: el niño elige entre ideas dibujadas. Siguiente versión:
// que dibuje o diga su idea y la IA valore la originalidad.
export const OBJETOS = [
  {
    objeto: '📦',
    ideas: [
      { id: 'guardar', emoji: '🧸', categoria: 'guardar', rareza: 0 },
      { id: 'regalo', emoji: '🎁', categoria: 'guardar', rareza: 0 },
      { id: 'casa_gato', emoji: '🐱', categoria: 'hogar', rareza: 1 },
      { id: 'silla', emoji: '🪑', categoria: 'hogar', rareza: 1 },
      { id: 'coche', emoji: '🚗', categoria: 'transporte', rareza: 1 },
      { id: 'barco', emoji: '⛵', categoria: 'transporte', rareza: 2 },
      { id: 'tambor', emoji: '🥁', categoria: 'musica', rareza: 2 },
      { id: 'cohete', emoji: '🚀', categoria: 'imaginacion', rareza: 2 },
      { id: 'mascara', emoji: '🎭', categoria: 'imaginacion', rareza: 2 },
    ],
  },
  {
    objeto: '🍾',
    ideas: [
      { id: 'beber', emoji: '💧', categoria: 'guardar', rareza: 0 },
      { id: 'regar', emoji: '🪴', categoria: 'naturaleza', rareza: 1 },
      { id: 'flor', emoji: '🌷', categoria: 'hogar', rareza: 1 },
      { id: 'maraca', emoji: '🎵', categoria: 'musica', rareza: 2 },
      { id: 'lampara', emoji: '💡', categoria: 'hogar', rareza: 2 },
      { id: 'bolos', emoji: '🎳', categoria: 'juego', rareza: 2 },
      { id: 'mensaje', emoji: '📜', categoria: 'imaginacion', rareza: 2 },
      { id: 'cohete', emoji: '🚀', categoria: 'imaginacion', rareza: 2 },
      { id: 'hucha', emoji: '🪙', categoria: 'guardar', rareza: 1 },
    ],
  },
  {
    objeto: '🧵',
    ideas: [
      { id: 'atar', emoji: '🎀', categoria: 'guardar', rareza: 0 },
      { id: 'saltar', emoji: '🤸', categoria: 'juego', rareza: 0 },
      { id: 'pulsera', emoji: '📿', categoria: 'arte', rareza: 1 },
      { id: 'tendedero', emoji: '👕', categoria: 'hogar', rareza: 1 },
      { id: 'telefono', emoji: '☎️', categoria: 'imaginacion', rareza: 2 },
      { id: 'pescar', emoji: '🎣', categoria: 'naturaleza', rareza: 2 },
      { id: 'columpio', emoji: '🌳', categoria: 'juego', rareza: 2 },
      { id: 'guitarra', emoji: '🎸', categoria: 'musica', rareza: 2 },
      { id: 'medir', emoji: '📏', categoria: 'ciencia', rareza: 2 },
    ],
  },
  {
    objeto: '🥄',
    ideas: [
      { id: 'comer', emoji: '🍲', categoria: 'hogar', rareza: 0 },
      { id: 'remover', emoji: '☕', categoria: 'hogar', rareza: 0 },
      { id: 'cavar', emoji: '🌱', categoria: 'naturaleza', rareza: 1 },
      { id: 'tocar', emoji: '🎶', categoria: 'musica', rareza: 1 },
      { id: 'espejo', emoji: '🪞', categoria: 'ciencia', rareza: 2 },
      { id: 'catapulta', emoji: '🏹', categoria: 'juego', rareza: 2 },
      { id: 'titere', emoji: '🎎', categoria: 'imaginacion', rareza: 2 },
      { id: 'remo', emoji: '🛶', categoria: 'transporte', rareza: 2 },
      { id: 'abrir', emoji: '🥫', categoria: 'hogar', rareza: 1 },
    ],
  },
]

export const todasLasIdeas = () => OBJETOS.flatMap((o) => o.ideas)

export default function Inventa({ nivel, idioma, t, terminar }) {
  const { objeto, ideas } = OBJETOS[nivel - 1]
  const [elegidas, setElegidas] = useState([])
  const inicio = useRef(Date.now())

  const tocar = (id) => setElegidas((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]))

  function acabar() {
    const n = elegidas.length
    terminar({
      juego: 'inventa',
      nivel,
      estrellas: n >= 6 ? 3 : n >= 4 ? 2 : 1,
      ideas: elegidas,
      tiempoMs: Date.now() - inicio.current,
    })
  }

  return (
    <div className="pantalla">
      <div className="emoji-gigante">{objeto}</div>
      <h1>
        {t('inventa_titulo')}{' '}
        <button className="altavoz" onClick={() => hablar(t('inventa_titulo') + ' ' + t('inventa_instr'), idioma)}>🔊</button>
      </h1>
      <p>
        {t('nivel')} {nivel} · {t('inventa_instr')} · 💡 {elegidas.length}
      </p>
      <div className="rejilla">
        {ideas.map((idea) => (
          <button
            key={idea.id}
            className={'casilla grande' + (elegidas.includes(idea.id) ? ' activo' : '')}
            onClick={() => tocar(idea.id)}
          >
            {idea.emoji}
          </button>
        ))}
      </div>
      <button className="principal" disabled={elegidas.length === 0} onClick={acabar}>
        {t('terminado')} ✓
      </button>
    </div>
  )
}
