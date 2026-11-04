import { useState } from 'react'

// Panel del profesional. Reglas del Reto 20:
// - sin notas numéricas ni etiquetas; solo fortalezas con su evidencia
// - la IA SUGIERE; el profesional valida cada observación (no hay decisiones automáticas)
export default function Panel({ sesion, informe, t, validar, onGenerarIA, cargandoIA }) {
  const [abierta, setAbierta] = useState(null)
  const hayAPI = Boolean(import.meta.env.VITE_API_URL)

  return (
    <div className="pantalla ancha">
      <h1>
        {sesion.avatar?.emoji} {t('panel_titulo')} · «{sesion.avatar?.nombre}»
      </h1>
      <p className="aviso">⚠️ {t('panel_aviso')}</p>
      <p className="etiqueta-ia">
        {informe.generadoConIA ? '✨ ' + t('con_ia') : '📴 ' + t('sin_ia')}
        {!informe.generadoConIA && hayAPI && (
          <button className="secundario" onClick={onGenerarIA} disabled={cargandoIA}>
            {cargandoIA ? '…' : '✨ ' + t('generar_ia')}
          </button>
        )}
      </p>

      {informe.capacidades.map((c) => (
        <div key={c.id} className={'tarjeta capacidad' + (c.destaca ? ' destaca' : '')}>
          <h2>
            {c.destaca ? '⭐ ' : ''}
            {t('cap_' + c.id)}
          </h2>
          <p>{c.observado ? c.texto : t('no_observado')}</p>
          <button className="enlace" onClick={() => setAbierta(abierta === c.id ? null : c.id)}>
            {t('evidencias')} {abierta === c.id ? '▲' : '▼'}
          </button>
          {abierta === c.id && (
            <ul>
              {c.evidencias.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          )}
          <div className="validacion">
            <button
              className={'chip' + (sesion.validaciones[c.id] === 'coincide' ? ' activo' : '')}
              onClick={() => validar(c.id, 'coincide')}
            >
              👍 {t('coincide')}
            </button>
            <button
              className={'chip' + (sesion.validaciones[c.id] === 'no_coincide' ? ' activo' : '')}
              onClick={() => validar(c.id, 'no_coincide')}
            >
              👎 {t('no_coincide')}
            </button>
          </div>
        </div>
      ))}

      <div className="tarjeta">
        <h2>{t('intereses')}</h2>
        <p className="grande">{informe.intereses.map((i) => i.emoji + ' ' + t(i.clave)).join('  ·  ')}</p>
      </div>

      <div className="tarjeta">
        <h2>💡 {t('sugerencias')}</h2>
        <ul>
          {informe.sugerencias.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
