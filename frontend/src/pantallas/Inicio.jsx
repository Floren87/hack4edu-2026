import { useState } from 'react'
import { IDIOMAS, hablar } from '../i18n.js'

const AVATARES = [
  { emoji: '🦊', nombre: 'Zorro' },
  { emoji: '🐢', nombre: 'Tortuga' },
  { emoji: '🦁', nombre: 'León' },
  { emoji: '🐙', nombre: 'Pulpo' },
  { emoji: '🦉', nombre: 'Búho' },
  { emoji: '🐬', nombre: 'Delfín' },
  { emoji: '🐼', nombre: 'Panda' },
  { emoji: '🦒', nombre: 'Jirafa' },
  { emoji: '🐸', nombre: 'Rana' },
]

// 1) idioma + consentimiento (solo la primera vez en este dispositivo)
// 2) ¿quién juega? (varios niños pueden compartir el mismo dispositivo)
// 3) jugador nuevo: elige su avatar (pseudónimo)
export default function Inicio({ estado, actualizar, t, elegirJugador, crearJugador }) {
  const [nuevo, setNuevo] = useState(false)
  const idioma = estado.idioma

  if (!estado.consentimiento) {
    return (
      <div className="pantalla">
        <div className="idiomas">
          {Object.entries(IDIOMAS).map(([id, i]) => (
            <button key={id} className={'chip' + (idioma === id ? ' activo' : '')} onClick={() => actualizar({ idioma: id })}>
              {i.bandera} {i.nombre}
            </button>
          ))}
        </div>
        <h1>{t('consentimiento_titulo')}</h1>
        <p className="tarjeta">
          {t('consentimiento_texto')}{' '}
          <button className="altavoz" onClick={() => hablar(t('consentimiento_texto'), idioma)} aria-label="Escuchar">
            🔊
          </button>
        </p>
        <button className="principal" onClick={() => actualizar({ consentimiento: true })}>
          ✅ {t('acepto')}
        </button>
      </div>
    )
  }

  const usados = estado.jugadores.map((j) => j.avatar.emoji)

  if (nuevo || estado.jugadores.length === 0) {
    return (
      <div className="pantalla">
        <h1>
          {t('bienvenida')} <button className="altavoz" onClick={() => hablar(t('elige_avatar'), idioma)}>🔊</button>
        </h1>
        <p>{t('elige_avatar')}</p>
        <div className="rejilla">
          {AVATARES.filter((a) => !usados.includes(a.emoji)).map((a) => (
            <button key={a.emoji} className="casilla grande" onClick={() => crearJugador(a)} aria-label={a.nombre}>
              {a.emoji}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="pantalla">
      <h1>
        {t('quien_juega')} <button className="altavoz" onClick={() => hablar(t('quien_juega'), idioma)}>🔊</button>
      </h1>
      <div className="rejilla">
        {estado.jugadores.map((j) => (
          <button key={j.id} className="casilla grande" onClick={() => elegirJugador(j.id)} aria-label={j.avatar.nombre}>
            {j.avatar.emoji}
          </button>
        ))}
        <button className="casilla grande nuevo" onClick={() => setNuevo(true)} aria-label={t('nuevo_jugador')}>
          ➕
        </button>
      </div>
    </div>
  )
}
