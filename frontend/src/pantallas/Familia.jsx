import { hablar } from '../i18n.js'
import { INSIGNIAS, estrellasTotales } from '../progreso.js'

// Informe sencillo para el docente y la familia (decisión de Delia, 4 nov):
// solo en positivo, sin términos técnicos, en su idioma y con voz.
export default function Familia({ jugador, informe, idioma, t, onBorrar }) {
  if (!jugador) return <div className="pantalla"><p>{t('sin_jugadores')}</p></div>
  const fortalezas = informe.capacidades.filter((c) => c.destaca)
  const texto = [
    t('familia_titulo') + ':',
    ...fortalezas.map((c) => t('cap_' + c.id)),
    ...informe.intereses.map((i) => t(i.clave)),
  ].join('. ')

  return (
    <div className="pantalla">
      <h1>
        {jugador.avatar.emoji} {t('familia_titulo')}{' '}
        <button className="altavoz" onClick={() => hablar(texto, idioma)}>🔊</button>
      </h1>
      <div className="tarjeta">
        <p className="grande">
          ⭐ {estrellasTotales(jugador)} · {jugador.insignias.map((i) => INSIGNIAS[i]).join(' ')}
        </p>
        {fortalezas.map((c) => (
          <p key={c.id} className="grande">⭐ {t('cap_' + c.id)}</p>
        ))}
        <p className="grande">{informe.intereses.map((i) => i.emoji).join(' ')}</p>
      </div>
      <div className="tarjeta">
        <h2>🏫 {t('sugerencias')}</h2>
        <ul>
          {informe.sugerencias.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
      <div className="tarjeta">
        <h2>🏠 {t('familia_casa')}</h2>
        <ul>
          {informe.casa.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
      <button className="peligro" onClick={onBorrar}>🗑️ {t('borrar')}</button>
    </div>
  )
}
