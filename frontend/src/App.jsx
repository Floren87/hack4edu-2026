import { useMemo, useState } from 'react'
import { traductor } from './i18n.js'
import { cargar, estadoDemo, estadoNuevo, guardar, jugadorNuevo } from './datos.js'
import { informeSinIA, resumenParaIA } from './informe.js'
import { JUEGOS, progresoDe, registrarPartida } from './progreso.js'
import Inicio from './pantallas/Inicio.jsx'
import Intereses from './pantallas/Intereses.jsx'
import Mapa from './pantallas/Mapa.jsx'
import Patrones from './pantallas/Patrones.jsx'
import Inventa from './pantallas/Inventa.jsx'
import Resultado from './pantallas/Resultado.jsx'
import Panel from './pantallas/Panel.jsx'
import Familia from './pantallas/Familia.jsx'

// Minijuegos disponibles. Para añadir uno: créalo en pantallas/, añádelo aquí y en progreso.js (JUEGOS).
const COMPONENTES = { patrones: Patrones, inventa: Inventa }

export default function App() {
  // Con #demo en la URL se cargan datos de ejemplo de un niño que ha jugado varios días
  // (#demo abre el panel del profesional; #demo-juego abre el mapa de juegos del niño)
  const esDemo = window.location.hash.startsWith('#demo')
  const [estado, setEstado] = useState(() => (esDemo ? estadoDemo() : cargar() ?? estadoNuevo('es')))
  const [pantalla, setPantalla] = useState(esDemo ? (window.location.hash === '#demo-juego' ? 'mapa' : 'panel') : 'inicio')
  const [partida, setPartida] = useState(null) // { juego, nivel, intento }
  const [resultado, setResultado] = useState(null)
  const [informeIA, setInformeIA] = useState(null)
  const [cargandoIA, setCargandoIA] = useState(false)

  const t = traductor(estado.idioma)
  const jugador = estado.jugadores.find((j) => j.id === estado.activo) ?? null

  function actualizar(cambios) {
    setEstado((e) => {
      const nuevo = { ...e, ...cambios }
      if (!esDemo) guardar(nuevo)
      return nuevo
    })
  }
  function actualizarJugador(j) {
    actualizar({ jugadores: estado.jugadores.map((x) => (x.id === j.id ? j : x)) })
  }

  function crearJugador(avatar) {
    const j = jugadorNuevo(avatar)
    actualizar({ jugadores: [...estado.jugadores, j], activo: j.id })
    setPantalla('intereses')
  }
  function elegirJugador(id, destino = 'mapa') {
    actualizar({ activo: id })
    setInformeIA(null)
    setPantalla(destino)
  }

  function jugar(juego, nivel) {
    setPartida({ juego, nivel, intento: Date.now() })
    setPantalla('juego')
  }

  function terminarPartida(p) {
    const antes = progresoDe(jugador, p.juego).estrellas[p.nivel] ?? 0
    const r = registrarPartida(jugador, p)
    actualizarJugador(r.jugador)
    setInformeIA(null)
    const info = JUEGOS.find((j) => j.id === p.juego)
    setResultado({
      partida: p,
      desbloqueado: r.desbloqueado,
      nuevasInsignias: r.nuevasInsignias,
      mejoro: antes > 0 && p.estrellas > antes,
      haySiguiente: p.nivel < info.niveles && p.nivel + 1 <= progresoDe(r.jugador, p.juego).desbloqueado,
    })
    setPantalla('resultado')
  }

  const informe = useMemo(
    () => (jugador ? informeIA ?? informeSinIA(jugador, estado.idioma) : null),
    [jugador, informeIA, estado.idioma],
  )

  async function generarIA() {
    // Solo se envía el resumen agregado: nunca el avatar ni ningún identificador.
    setCargandoIA(true)
    try {
      const r = await fetch(import.meta.env.VITE_API_URL + '/api/informe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idioma: estado.idioma, resumen: resumenParaIA(jugador) }),
      })
      if (!r.ok) throw new Error(r.status)
      setInformeIA({ ...informeSinIA(jugador, estado.idioma), ...(await r.json()), generadoConIA: true })
    } catch {
      alert('No se pudo conectar con la IA. Se mantiene el informe sin IA.')
    } finally {
      setCargandoIA(false)
    }
  }

  function borrarJugador() {
    const resto = estado.jugadores.filter((j) => j.id !== jugador.id)
    actualizar({ jugadores: resto, activo: null })
    setInformeIA(null)
    setPantalla('inicio')
  }

  const enJuego = ['juego', 'resultado', 'intereses'].includes(pantalla)
  const Juego = partida && COMPONENTES[partida.juego]

  return (
    <div className="app">
      <header>
        <button className="logo" onClick={() => setPantalla(jugador ? 'mapa' : 'inicio')}>⭐ TalentoSinFronteras</button>
        {!enJuego && estado.consentimiento && (
          <nav>
            {jugador && (
              <button className={pantalla === 'mapa' ? 'activo' : ''} onClick={() => setPantalla('mapa')} title={t('mapa_juegos')}>🗺️</button>
            )}
            <button className={pantalla === 'panel' ? 'activo' : ''} onClick={() => setPantalla('panel')} title={t('ver_panel')}>🧠</button>
            <button className={pantalla === 'familia' ? 'activo' : ''} onClick={() => setPantalla('familia')} title={t('ver_familia')}>🏫</button>
          </nav>
        )}
      </header>
      <main>
        {pantalla === 'inicio' && (
          <Inicio estado={estado} actualizar={actualizar} t={t} elegirJugador={elegirJugador} crearJugador={crearJugador} />
        )}
        {pantalla === 'intereses' && jugador && (
          <Intereses
            jugador={jugador}
            idioma={estado.idioma}
            t={t}
            guardarIntereses={(intereses) => actualizarJugador({ ...jugador, intereses })}
            siguiente={() => setPantalla('mapa')}
          />
        )}
        {pantalla === 'mapa' && jugador && (
          <Mapa jugador={jugador} idioma={estado.idioma} t={t} jugar={jugar} cambiarJugador={() => setPantalla('inicio')} />
        )}
        {pantalla === 'juego' && Juego && (
          <Juego key={partida.intento} nivel={partida.nivel} idioma={estado.idioma} t={t} terminar={terminarPartida} />
        )}
        {pantalla === 'resultado' && resultado && (
          <Resultado
            resultado={resultado}
            idioma={estado.idioma}
            t={t}
            repetir={() => jugar(partida.juego, partida.nivel)}
            siguienteNivel={() => jugar(partida.juego, partida.nivel + 1)}
            alMapa={() => setPantalla('mapa')}
          />
        )}
        {pantalla === 'panel' && (
          <Panel
            estado={estado}
            jugador={jugador ?? estado.jugadores[0]}
            informe={jugador ? informe : estado.jugadores[0] && informeSinIA(estado.jugadores[0], estado.idioma)}
            idioma={estado.idioma}
            t={t}
            elegirJugador={(id) => elegirJugador(id, 'panel')}
            validar={(cap, valor) => actualizarJugador({ ...jugador, validaciones: { ...jugador.validaciones, [cap]: valor } })}
            onGenerarIA={generarIA}
            cargandoIA={cargandoIA}
          />
        )}
        {pantalla === 'familia' && (
          <Familia jugador={jugador} informe={informe} idioma={estado.idioma} t={t} onBorrar={borrarJugador} />
        )}
      </main>
    </div>
  )
}
