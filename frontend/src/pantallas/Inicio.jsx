import { useState } from 'react'
import { IDIOMAS, hablar } from '../i18n.js'

const AVATARES = [
  { emoji: '🦊', nombre: 'Zorro' },
  { emoji: '🐢', nombre: 'Tortuga' },
  { emoji: '🦁', nombre: 'León' },
  { emoji: '🐙', nombre: 'Pulpo' },
  { emoji: '🦉', nombre: 'Búho' },
  { emoji: '🐬', nombre: 'Delfín' },
]

// Paso 1: idioma + consentimiento de la familia. Paso 2: el niño elige su avatar (pseudónimo).
export default function Inicio({ sesion, actualizar, t, siguiente }) {
  const [paso, setPaso] = useState(sesion.consentimiento ? 2 : 1)

  if (paso === 1) {
    return (
      <div className="pantalla">
        <div className="idiomas">
          {Object.entries(IDIOMAS).map(([id, i]) => (
            <button
              key={id}
              className={'chip' + (sesion.idioma === id ? ' activo' : '')}
              onClick={() => actualizar({ idioma: id })}
            >
              {i.bandera} {i.nombre}
            </button>
          ))}
        </div>
        <h1>{t('consentimiento_titulo')}</h1>
        <p className="tarjeta">
          {t('consentimiento_texto')}{' '}
          <button className="altavoz" onClick={() => hablar(t('consentimiento_texto'), sesion.idioma)} aria-label="Escuchar">
            🔊
          </button>
        </p>
        <button
          className="principal"
          onClick={() => {
            actualizar({ consentimiento: true })
            setPaso(2)
          }}
        >
          ✅ {t('acepto')}
        </button>
      </div>
    )
  }

  return (
    <div className="pantalla">
      <h1>
        {t('bienvenida')} <button className="altavoz" onClick={() => hablar(t('elige_avatar'), sesion.idioma)}>🔊</button>
      </h1>
      <p>{t('elige_avatar')}</p>
      <div className="rejilla">
        {AVATARES.map((a) => (
          <button
            key={a.emoji}
            className={'casilla grande' + (sesion.avatar?.emoji === a.emoji ? ' activo' : '')}
            onClick={() => actualizar({ avatar: a })}
            aria-label={a.nombre}
          >
            {a.emoji}
          </button>
        ))}
      </div>
      <button className="principal" disabled={!sesion.avatar} onClick={siguiente}>
        {t('empezar')}
      </button>
    </div>
  )
}
