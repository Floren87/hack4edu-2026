import { useEffect } from 'react'
import { hablar } from '../i18n.js'
import { INSIGNIAS } from '../progreso.js'

// Después de cada partida: estrellas, nivel desbloqueado, insignias y la invitación a seguir.
// Si no sacó 3 estrellas, se le anima a repetir para mejorar (perseverancia), nunca se le penaliza.
export default function Resultado({ resultado, idioma, t, repetir, siguienteNivel, alMapa }) {
  const { partida, desbloqueado, nuevasInsignias, mejoro, haySiguiente } = resultado
  const frase = partida.estrellas === 3 ? t('res_genial') : mejoro ? t('res_mejoraste') : t('res_animo')

  useEffect(() => hablar(frase, idioma), [frase, idioma])

  return (
    <div className="pantalla">
      <div className="emoji-gigante">{'⭐'.repeat(partida.estrellas)}{'☆'.repeat(3 - partida.estrellas)}</div>
      <h1>{frase}</h1>
      {desbloqueado && <p className="tarjeta grande">🔓 {t('desbloqueado')} {desbloqueado}</p>}
      {nuevasInsignias.map((i) => (
        <p key={i} className="tarjeta grande">
          {INSIGNIAS[i]} {t('insignia_' + i)}
        </p>
      ))}
      {partida.estrellas < 3 && (
        <button className="principal" onClick={repetir}>🔁 {t('repetir')}</button>
      )}
      {haySiguiente && (
        <button className={partida.estrellas < 3 ? 'secundario' : 'principal'} onClick={siguienteNivel}>
          ➡️ {t('siguiente_nivel')}
        </button>
      )}
      <button className="secundario" onClick={alMapa}>🗺️ {t('al_mapa')}</button>
    </div>
  )
}
