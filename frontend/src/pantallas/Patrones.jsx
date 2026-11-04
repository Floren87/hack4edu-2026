import { useMemo, useRef, useState } from 'react'
import { hablar } from '../i18n.js'

// Pensamiento lógico + resolución de problemas. Dificultad adaptativa (niveles 1-4).
// Para el niño no hay "fallos": solo "¡Casi! Prueba otra vez".
const FIGURAS = ['🔴', '🔵', '🟡', '🟢', '🟣', '🟠']
const ESQUEMAS = {
  1: ['AB'],
  2: ['ABC', 'AAB'],
  3: ['ABB', 'AABB', 'ABCB'],
  4: ['ABCD', 'AABC', 'ABBCC'],
}
const RONDAS = 6

function crearPregunta(nivel) {
  const esquemas = ESQUEMAS[nivel]
  const esquema = esquemas[Math.floor(Math.random() * esquemas.length)]
  const letras = [...new Set(esquema)]
  const figuras = [...FIGURAS].sort(() => Math.random() - 0.5)
  const mapa = Object.fromEntries(letras.map((l, i) => [l, figuras[i]]))
  const largo = esquema.length * 2 + 1
  const serie = Array.from({ length: largo }, (_, i) => mapa[esquema[i % esquema.length]])
  const respuesta = serie.pop()
  const opciones = [...new Set([respuesta, ...figuras.slice(0, 4)])].slice(0, 4).sort(() => Math.random() - 0.5)
  return { serie, respuesta, opciones }
}

export default function Patrones({ sesion, registrar, t, siguiente }) {
  const [nivel, setNivel] = useState(1)
  const [ronda, setRonda] = useState(0)
  const [mensaje, setMensaje] = useState(null)
  const stats = useRef({ nivelMax: 1, aciertos: 0, fallos: 0, reintentosTrasFallo: 0, tiempos: [], falloPendiente: false })
  const inicio = useRef(Date.now())
  const pregunta = useMemo(() => crearPregunta(nivel), [nivel, ronda])

  function terminar() {
    const s = stats.current
    registrar('patrones', {
      nivelMax: s.nivelMax,
      aciertos: s.aciertos,
      fallos: s.fallos,
      reintentosTrasFallo: s.reintentosTrasFallo,
      tiempoMedioMs: s.tiempos.length ? Math.round(s.tiempos.reduce((a, b) => a + b, 0) / s.tiempos.length) : null,
    })
    siguiente()
  }

  function responder(figura) {
    const s = stats.current
    if (s.falloPendiente) {
      s.reintentosTrasFallo++
      s.falloPendiente = false
    }
    if (figura === pregunta.respuesta) {
      s.aciertos++
      s.tiempos.push(Date.now() - inicio.current)
      const nuevoNivel = Math.min(4, nivel + 1)
      s.nivelMax = Math.max(s.nivelMax, nivel) // nivel más alto resuelto
      setMensaje(t('muy_bien'))
      setTimeout(() => {
        setMensaje(null)
        inicio.current = Date.now()
        if (ronda + 1 >= RONDAS) return terminar()
        setNivel(nuevoNivel)
        setRonda(ronda + 1)
      }, 700)
    } else {
      s.fallos++
      s.falloPendiente = true
      setMensaje(t('prueba_otra'))
    }
  }

  return (
    <div className="pantalla">
      <h1>
        {t('patrones_titulo')} <button className="altavoz" onClick={() => hablar(t('patrones_instr'), sesion.idioma)}>🔊</button>
      </h1>
      <p className="progreso">{'●'.repeat(ronda + 1)}{'○'.repeat(RONDAS - ronda - 1)}</p>
      <div className="serie">
        {pregunta.serie.map((f, i) => (
          <span key={i}>{f}</span>
        ))}
        <span className="hueco">❓</span>
      </div>
      <div className="rejilla">
        {pregunta.opciones.map((f) => (
          <button key={f} className="casilla grande" onClick={() => responder(f)}>
            {f}
          </button>
        ))}
      </div>
      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  )
}
