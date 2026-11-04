import { useMemo, useState } from 'react'
import { traductor } from './i18n.js'
import { borrar, cargar, guardar, sesionDemo, sesionNueva } from './datos.js'
import { informeSinIA } from './informe.js'
import Inicio from './pantallas/Inicio.jsx'
import MapaMundos from './pantallas/MapaMundos.jsx'
import Patrones from './pantallas/Patrones.jsx'
import Inventa from './pantallas/Inventa.jsx'
import Panel from './pantallas/Panel.jsx'
import Familia from './pantallas/Familia.jsx'

// Recorrido del niño. Para añadir un minijuego: créalo en pantallas/ y añádelo aquí.
const JUEGO = ['inicio', 'mapa', 'patrones', 'inventa', 'fin']

export default function App() {
  // Con #demo en la URL se cargan datos de ejemplo y se abre el panel (para el vídeo y el jurado)
  const esDemo = window.location.hash === '#demo'
  const [sesion, setSesion] = useState(() => (esDemo ? sesionDemo() : cargar() ?? sesionNueva('es')))
  const [pantalla, setPantalla] = useState(esDemo ? 'panel' : 'inicio')
  const [informeIA, setInformeIA] = useState(null)
  const [cargandoIA, setCargandoIA] = useState(false)
  const t = traductor(sesion.idioma)

  function actualizar(cambios) {
    setSesion((s) => {
      const nueva = { ...s, ...cambios }
      guardar(nueva)
      return nueva
    })
  }
  const registrar = (clave, valor) => actualizar({ evidencias: { ...sesion.evidencias, [clave]: valor } })
  const validar = (capacidad, valor) => actualizar({ validaciones: { ...sesion.validaciones, [capacidad]: valor } })
  const siguiente = () => setPantalla(JUEGO[JUEGO.indexOf(pantalla) + 1])

  const informe = useMemo(() => informeIA ?? informeSinIA(sesion), [sesion, informeIA])

  async function generarIA() {
    // Solo se envían evidencias agregadas: nunca el avatar ni datos identificativos.
    setCargandoIA(true)
    try {
      const r = await fetch(import.meta.env.VITE_API_URL + '/api/informe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idioma: sesion.idioma, evidencias: sesion.evidencias }),
      })
      if (!r.ok) throw new Error(r.status)
      setInformeIA({ ...(await r.json()), generadoConIA: true })
    } catch {
      alert('No se pudo conectar con la IA. Se mantiene el informe sin IA.')
    } finally {
      setCargandoIA(false)
    }
  }

  function reiniciar() {
    borrar()
    setInformeIA(null)
    setSesion(sesionNueva(sesion.idioma))
    setPantalla('inicio')
  }

  const props = { sesion, actualizar, registrar, t, siguiente }
  const enJuego = JUEGO.includes(pantalla) && pantalla !== 'fin'

  return (
    <div className="app">
      <header>
        <button className="logo" onClick={() => setPantalla('inicio')}>⭐ TalentoSinFronteras</button>
        {!enJuego && (
          <nav>
            <button className={pantalla === 'panel' ? 'activo' : ''} onClick={() => setPantalla('panel')}>🧑‍🏫</button>
            <button className={pantalla === 'familia' ? 'activo' : ''} onClick={() => setPantalla('familia')}>👨‍👩‍👧</button>
          </nav>
        )}
      </header>
      <main>
        {pantalla === 'inicio' && <Inicio {...props} />}
        {pantalla === 'mapa' && <MapaMundos {...props} />}
        {pantalla === 'patrones' && <Patrones {...props} />}
        {pantalla === 'inventa' && <Inventa {...props} />}
        {pantalla === 'fin' && (
          <div className="pantalla">
            <div className="emoji-gigante">{sesion.avatar?.emoji}🎉</div>
            <h1>{t('fin_titulo')}</h1>
            <p>{t('fin_texto')}</p>
            <button className="principal" onClick={() => setPantalla('panel')}>🧑‍🏫 {t('ver_panel')}</button>
            <button className="secundario" onClick={() => setPantalla('familia')}>👨‍👩‍👧 {t('ver_familia')}</button>
          </div>
        )}
        {pantalla === 'panel' && (
          <Panel sesion={sesion} informe={informe} t={t} validar={validar} onGenerarIA={generarIA} cargandoIA={cargandoIA} />
        )}
        {pantalla === 'familia' && <Familia sesion={sesion} informe={informe} t={t} onBorrar={reiniciar} />}
      </main>
    </div>
  )
}
