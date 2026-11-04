import { useState } from 'react'
import { hablar } from '../i18n.js'
import { INSIGNIAS, JUEGOS, estrellasTotales, progresoDe } from '../progreso.js'

// Pantalla principal del niño: sus islas (juegos), niveles y estrellas.
// Puede repetir cualquier nivel ya abierto para mejorar, o avanzar al siguiente.
export default function Mapa({ jugador, idioma, t, jugar, cambiarJugador }) {
  const [juego, setJuego] = useState(null)

  if (juego) {
    const info = JUEGOS.find((j) => j.id === juego)
    const prog = progresoDe(jugador, juego)
    return (
      <div className="pantalla">
        <h1>
          {info.emoji} {t('juego_' + juego)}
        </h1>
        <p>{t('elige_nivel')}</p>
        <div className="rejilla niveles">
          {Array.from({ length: info.niveles }, (_, i) => i + 1).map((n) => {
            const abierto = n <= prog.desbloqueado
            const e = prog.estrellas[n] ?? 0
            return (
              <button key={n} className={'casilla nivel' + (abierto ? '' : ' cerrado')} disabled={!abierto} onClick={() => jugar(juego, n)}>
                <span className="numero">{abierto ? n : '🔒'}</span>
                <span className="estrellas">{abierto ? '⭐'.repeat(e) + '☆'.repeat(3 - e) : ''}</span>
              </button>
            )
          })}
        </div>
        <button className="secundario" onClick={() => setJuego(null)}>← {t('al_mapa')}</button>
      </div>
    )
  }

  return (
    <div className="pantalla">
      <div className="perfil-nino">
        <button className="avatar" onClick={cambiarJugador} title={t('quien_juega')}>
          {jugador.avatar.emoji}
        </button>
        <div>
          <div className="grande">⭐ {estrellasTotales(jugador)}</div>
          <div className="insignias">{jugador.insignias.map((i) => INSIGNIAS[i]).join(' ')}</div>
        </div>
      </div>
      <h1>
        {t('mapa_juegos')} <button className="altavoz" onClick={() => hablar(t('mapa_juegos'), idioma)}>🔊</button>
      </h1>
      <div className="islas">
        {JUEGOS.map((j) => {
          const prog = progresoDe(jugador, j.id)
          return (
            <button key={j.id} className={'isla-juego' + (j.disponible ? '' : ' cerrado')} disabled={!j.disponible} onClick={() => setJuego(j.id)}>
              <span className="emoji">{j.emoji}</span>
              <span className="nombre">{t('juego_' + j.id)}</span>
              <span className="detalle">{j.disponible ? `${t('nivel')} ${prog.desbloqueado}/${j.niveles}` : t('pronto')}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
