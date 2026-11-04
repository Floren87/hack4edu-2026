import { hablar } from '../i18n.js'

// Intereses (inspirado en el modelo RIASEC, con pictogramas). Diseño propio.
export const ISLAS = [
  { id: 'taller', emoji: '🔧', clave: 'isla_taller' }, // construir (realista)
  { id: 'selva', emoji: '🌿', clave: 'isla_selva' }, // explorar (investigador)
  { id: 'arte', emoji: '🎨', clave: 'isla_arte' }, // crear (artístico)
  { id: 'hospital', emoji: '🩹', clave: 'isla_hospital' }, // ayudar (social)
  { id: 'mercado', emoji: '🛒', clave: 'isla_mercado' }, // organizar/negociar (emprendedor)
  { id: 'escenario', emoji: '🎤', clave: 'isla_escenario' }, // contar/comunicar
]

// Se pregunta una vez al crear el jugador. Después, los intereses también se observan
// en lo que el niño ELIGE jugar una y otra vez (ver informe.js).
export default function Intereses({ jugador, idioma, t, guardarIntereses, siguiente }) {
  const elegidas = jugador.intereses

  function tocar(id) {
    const nuevas = elegidas.includes(id)
      ? elegidas.filter((x) => x !== id)
      : elegidas.length < 3
        ? [...elegidas, id]
        : elegidas
    guardarIntereses(nuevas)
  }

  return (
    <div className="pantalla">
      <h1>
        {t('mapa_titulo')} <button className="altavoz" onClick={() => hablar(t('mapa_titulo') + ' ' + t('mapa_instr'), idioma)}>🔊</button>
      </h1>
      <p>{t('mapa_instr')} · {elegidas.length}/3</p>
      <div className="rejilla">
        {ISLAS.map((isla) => {
          const orden = elegidas.indexOf(isla.id)
          return (
            <button key={isla.id} className={'casilla isla' + (orden >= 0 ? ' activo' : '')} onClick={() => tocar(isla.id)}>
              <span className="emoji">{isla.emoji}</span>
              <span>{t(isla.clave)}</span>
              {orden >= 0 && <span className="insignia">{orden + 1}</span>}
            </button>
          )
        })}
      </div>
      <button className="principal" disabled={elegidas.length < 3} onClick={siguiente}>
        {t('siguiente')} →
      </button>
    </div>
  )
}
