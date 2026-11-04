// Informe SIN IA (modo sin conexión): reglas simples y explicables.
// Reglas de oro del Reto 20: sin notas numéricas, sin etiquetas, solo fortalezas con su evidencia.
// El informe CON IA lo genera el backend (POST /api/informe) a partir de las mismas evidencias.

import { ISLAS } from './pantallas/MapaMundos.jsx'
import { IDEAS } from './pantallas/Inventa.jsx'

const SUGERENCIAS_INTERES = {
  taller: { es: 'Proponle retos de construir con material manipulativo.', en: 'Offer hands-on building challenges.' },
  selva: { es: 'Aprovecha su curiosidad por la naturaleza: observación, experimentos al aire libre.', en: 'Use their curiosity for nature: outdoor observation and experiments.' },
  arte: { es: 'Deja que explique lo que aprende con dibujos o maquetas.', en: 'Let them show what they learn through drawings or models.' },
  hospital: { es: 'Dale un papel de ayudante o mentor de un compañero.', en: 'Give them a helper or peer-mentor role.' },
  mercado: { es: 'Usa situaciones de compra y venta para las matemáticas.', en: 'Use buying and selling situations for maths.' },
  escenario: { es: 'Ofrécele contar o representar historias ante el grupo.', en: 'Invite them to tell or act out stories for the group.' },
}

export function informeSinIA(sesion) {
  const { patrones, inventa, intereses } = sesion.evidencias
  const en = sesion.idioma === 'en'
  const capacidades = []

  if (patrones) {
    const destaca = patrones.nivelMax >= 3
    capacidades.push({
      id: 'logica',
      observado: patrones.aciertos > 0,
      destaca,
      texto: destaca
        ? en ? 'Spots and continues complex patterns.' : 'Reconoce y continúa patrones complejos.'
        : en ? 'Starting to work with patterns.' : 'Empieza a trabajar con patrones.',
      evidencias: [
        en ? `Reached level ${patrones.nivelMax} of 4 in “Patterns”` : `Llegó al nivel ${patrones.nivelMax} de 4 en «Patrones»`,
        en ? `${patrones.aciertos} sequences completed` : `${patrones.aciertos} secuencias completadas`,
      ],
    })
    capacidades.push({
      id: 'perseverancia',
      observado: patrones.fallos > 0,
      destaca: patrones.fallos > 0 && patrones.reintentosTrasFallo >= patrones.fallos,
      texto: en ? 'Keeps trying after a mistake.' : 'Sigue intentándolo después de equivocarse.',
      evidencias: [
        en ? `Tried again after ${patrones.reintentosTrasFallo} of ${patrones.fallos} mistakes` : `Volvió a intentarlo tras ${patrones.reintentosTrasFallo} de ${patrones.fallos} errores`,
      ],
    })
  }

  if (inventa) {
    const elegidas = IDEAS.filter((i) => inventa.ideas.includes(i.id))
    const raras = elegidas.filter((i) => i.rareza >= 2)
    const categorias = new Set(elegidas.map((i) => i.categoria))
    const destaca = elegidas.length >= 5 || raras.length >= 2
    capacidades.push({
      id: 'creatividad',
      observado: elegidas.length > 0,
      destaca,
      texto: destaca
        ? en ? 'Comes up with many and unusual ideas.' : 'Propone muchas ideas, algunas poco habituales.'
        : en ? 'Proposes ideas for everyday objects.' : 'Propone usos para objetos cotidianos.',
      evidencias: [
        en ? `${elegidas.length} ideas for a box, in ${categorias.size} different areas` : `${elegidas.length} ideas para una caja, de ${categorias.size} tipos distintos`,
        raras.length
          ? (en ? 'Unusual: ' : 'Poco habituales: ') + raras.map((i) => i.emoji).join(' ')
          : en ? 'Mostly common ideas' : 'Ideas sobre todo habituales',
      ],
    })
  }

  const sugerencias = intereses
    .slice(0, 3)
    .map((id) => SUGERENCIAS_INTERES[id]?.[en ? 'en' : 'es'])
    .filter(Boolean)

  return {
    generadoConIA: false,
    capacidades,
    intereses: intereses.map((id) => ISLAS.find((i) => i.id === id)).filter(Boolean),
    sugerencias,
  }
}
