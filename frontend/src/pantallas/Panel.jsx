import { useState } from 'react'

// Panel del profesional. Reglas del Reto 20:
// - sin notas numéricas ni etiquetas; solo fortalezas con su evidencia y su evolución
// - la IA SUGIERE; el profesional valida cada observación (no hay decisiones automáticas)
export default function Panel({ estado, jugador, informe, t, elegirJugador, validar, onGenerarIA, cargandoIA }) {
  const [abierta, setAbierta] = useState(null)
  const hayAPI = Boolean(import.meta.env.VITE_API_URL)

  if (!jugador) return <div className="pantalla"><p>{t('sin_jugadores')}</p></div>

  return (
    <div className="pantalla ancha">
      {estado.jugadores.length > 1 && (
        <div className="idiomas">
          {estado.jugadores.map((j) => (
            <button key={j.id} className={'chip' + (j.id === jugador.id ? ' activo' : '')} onClick={() => elegirJugador(j.id)}>
              {j.avatar.emoji} {j.avatar.nombre}
            </button>
          ))}
        </div>
      )}
      <h1>
        {jugador.avatar.emoji} {t('panel_titulo')} · «{jugador.avatar.nombre}»
      </h1>
      <p className="aviso">⚠️ {t('panel_aviso')}</p>
      <p className="tarjeta">
        🎮 {informe.actividad.partidas} {t('partidas')} · 📅 {informe.actividad.dias} {t('dias')}
        {informe.actividad.preferido && (
          <> · ❤️ {t('prefiere')}: {t('juego_' + informe.actividad.preferido[0])}</>
        )}
      </p>
      <p className="etiqueta-ia">
        {informe.generadoConIA ? '✨ ' + t('con_ia') : '📴 ' + t('sin_ia')}
        {!informe.generadoConIA && hayAPI && (
          <button className="secundario" onClick={onGenerarIA} disabled={cargandoIA}>
            {cargandoIA ? '…' : '✨ ' + t('generar_ia')}
          </button>
        )}
      </p>

      {informe.capacidades.map((c) => (
        <div key={c.id} className={'tarjeta capacidad' + (c.destaca ? ' destaca' : '') + (c.observado ? '' : ' apagada')}>
          <h2>
            {c.destaca ? '⭐ ' : ''}
            {t('cap_' + c.id)}
          </h2>
          <p>{c.observado ? c.texto : t('no_observado')}</p>
          {c.observado && (
            <>
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
                <button className={'chip' + (jugador.validaciones[c.id] === 'coincide' ? ' activo' : '')} onClick={() => validar(c.id, 'coincide')}>
                  👍 {t('coincide')}
                </button>
                <button className={'chip' + (jugador.validaciones[c.id] === 'no_coincide' ? ' activo' : '')} onClick={() => validar(c.id, 'no_coincide')}>
                  👎 {t('no_coincide')}
                </button>
              </div>
            </>
          )}
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
