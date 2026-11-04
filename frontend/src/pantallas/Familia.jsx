import { hablar } from '../i18n.js'

// Resumen para la familia: solo en positivo, en su idioma, con voz.
export default function Familia({ sesion, informe, t, onBorrar }) {
  const fortalezas = informe.capacidades.filter((c) => c.destaca)
  const texto = [
    t('familia_titulo') + ':',
    ...fortalezas.map((c) => t('cap_' + c.id)),
    ...informe.intereses.map((i) => t(i.clave)),
  ].join('. ')

  return (
    <div className="pantalla">
      <h1>
        {sesion.avatar?.emoji} {t('familia_titulo')}{' '}
        <button className="altavoz" onClick={() => hablar(texto, sesion.idioma)}>🔊</button>
      </h1>
      <div className="tarjeta">
        {fortalezas.map((c) => (
          <p key={c.id} className="grande">⭐ {t('cap_' + c.id)}</p>
        ))}
        <p className="grande">{informe.intereses.map((i) => i.emoji).join(' ')}</p>
      </div>
      <div className="tarjeta">
        <h2>🏠 {t('familia_casa')}</h2>
        <ul>
          {informe.sugerencias.slice(0, 2).map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
      <button className="peligro" onClick={onBorrar}>🗑️ {t('borrar')}</button>
    </div>
  )
}
