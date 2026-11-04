import { useMemo, useRef, useState } from 'react'
import { hablar } from '../i18n.js'

// Pensamiento lógico + resolución de problemas. 10 niveles de dificultad creciente.
// Para el niño no hay "fallos": solo "¡Casi! Prueba otra vez".
const FIGURAS = ['🔴', '🔵', '🟡', '🟢', '🟣', '🟠', '⬛', '🔺']
const ESQUEMAS = {
  1: ['AB'],
  2: ['ABC', 'AAB'],
  3: ['ABB', 'AABB', 'ABCB'],
  4: ['ABCD', 'AABC', 'ABBCC', 'ABACD'],
}
const PREGUNTAS = 5

function dificultad(nivel) {
  return {
    tipo: Math.min(4, Math.ceil(nivel * 0.4)), // niveles 1-2 → 1, 3-5 → 2, 6-7 → 3, 8-10 → 4
    opciones: nivel <= 3 ? 3 : nivel <= 7 ? 4 : 5,
    repeticiones: nivel % 2 === 0 ? 2 : 3, // menos pistas en niveles pares
  }
}

function crearPregunta(nivel) {
  const d = dificultad(nivel)
  const esquemas = ESQUEMAS[d.tipo]
  const esquema = esquemas[Math.floor(Math.random() * esquemas.length)]
  const letras = [...new Set(esquema)]
  const figuras = [...FIGURAS].sort(() => Math.random() - 0.5)
  const mapa = Object.fromEntries(letras.map((l, i) => [l, figuras[i]]))
  const largo = esquema.length * d.repeticiones + 1
  const serie = Array.from({ length: largo }, (_, i) => mapa[esquema[i % esquema.length]])
  const respuesta = serie.pop()
  const opciones = [...new Set([respuesta, ...figuras.slice(0, d.opciones + 1)])]
    .slice(0, d.opciones)
    .sort(() => Math.random() - 0.5)
  if (!opciones.includes(respuesta)) opciones[0] = respuesta
  return { serie, respuesta, opciones: opciones.sort(() => Math.random() - 0.5) }
}

export default function Patrones({ nivel, idioma, t, terminar }) {
  const [pregunta_n, setPreguntaN] = useState(0)
  const [mensaje, setMensaje] = useState(null)
  const s = useRef({ errores: 0, reintentos: 0, falloPendiente: false, tiempos: [], inicio: Date.now() })
  const pregunta = useMemo(() => crearPregunta(nivel), [nivel, pregunta_n])

  function responder(figura) {
    const st = s.current
    if (mensaje === t('muy_bien')) return
    if (st.falloPendiente) {
      st.reintentos++
      st.falloPendiente = false
    }
    if (figura !== pregunta.respuesta) {
      st.errores++
      st.falloPendiente = true
      setMensaje(t('prueba_otra'))
      return
    }
    st.tiempos.push(Date.now() - st.inicio)
    setMensaje(t('muy_bien'))
    setTimeout(() => {
      setMensaje(null)
      st.inicio = Date.now()
      if (pregunta_n + 1 < PREGUNTAS) return setPreguntaN(pregunta_n + 1)
      terminar({
        juego: 'patrones',
        nivel,
        estrellas: st.errores === 0 ? 3 : st.errores <= 2 ? 2 : 1,
        errores: st.errores,
        reintentos: st.reintentos,
        tiempoMedioMs: Math.round(st.tiempos.reduce((a, b) => a + b, 0) / st.tiempos.length),
      })
    }, 700)
  }

  return (
    <div className="pantalla">
      <h1>
        🧩 {t('patrones_titulo')} <button className="altavoz" onClick={() => hablar(t('patrones_instr'), idioma)}>🔊</button>
      </h1>
      <p className="progreso">
        {t('nivel')} {nivel} · {'●'.repeat(pregunta_n + 1)}{'○'.repeat(PREGUNTAS - pregunta_n - 1)}
      </p>
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
