// Informe SIN IA (modo sin conexión): reglas simples y explicables, a partir de TODO el historial.
// Reglas del Reto 20: sin notas numéricas, sin etiquetas, solo fortalezas con su evidencia.
// Cuantas más partidas, más evidencias: el perfil muestra la EVOLUCIÓN, no una foto fija.
// El informe CON IA lo genera el backend (POST /api/informe) a partir de resumenParaIA().

import { ISLAS } from './pantallas/Intereses.jsx'
import { todasLasIdeas } from './pantallas/Inventa.jsx'
import { JUEGOS } from './progreso.js'

const SUGERENCIAS_INTERES = {
  taller: { es: 'Proponle retos de construir con material manipulativo.', en: 'Offer hands-on building challenges.' },
  selva: { es: 'Aprovecha su curiosidad por la naturaleza: observación y experimentos al aire libre.', en: 'Use their curiosity for nature: outdoor observation and experiments.' },
  arte: { es: 'Deja que explique lo que aprende con dibujos o maquetas.', en: 'Let them show what they learn through drawings or models.' },
  hospital: { es: 'Dale un papel de ayudante o mentor de un compañero.', en: 'Give them a helper or peer-mentor role.' },
  mercado: { es: 'Usa situaciones de compra y venta para las matemáticas.', en: 'Use buying and selling situations for maths.' },
  escenario: { es: 'Ofrécele contar o representar historias ante el grupo.', en: 'Invite them to tell or act out stories for the group.' },
}

// Ideas para casa (informe sencillo para docente y familia)
const CASA_INTERES = {
  taller: { es: 'Construid juntos algo con materiales de casa (cajas, tapones, cuerdas).', en: 'Build something together with household materials.' },
  selva: { es: 'Salid a observar plantas o animales y que os cuente lo que ve.', en: 'Go outside to observe plants or animals and let them tell you what they see.' },
  arte: { es: 'Dejad papel y colores a mano: que dibuje lo que ha hecho en el día.', en: 'Keep paper and colours handy: let them draw their day.' },
  hospital: { es: 'Dadle pequeñas responsabilidades de cuidado (una planta, ayudar a un hermano).', en: 'Give them small caring tasks (a plant, helping a sibling).' },
  mercado: { es: 'Que os ayude con la compra: contar dinero, comparar precios.', en: 'Let them help with shopping: counting money, comparing prices.' },
  escenario: { es: 'Pedidle que os cuente cuentos o historias de vuestro país.', en: 'Ask them to tell you stories from your home country.' },
}

// Vocabulario técnico para el informe del psicólogo o psicopedagogo
// (áreas de referencia: escalas de desarrollo tipo MP-R, competencias CASEL, pensamiento divergente)
export const TERMINO_TECNICO = {
  logica: { es: 'Área cognitiva · razonamiento lógico y reconocimiento de patrones', en: 'Cognitive · logical reasoning and pattern recognition' },
  perseverancia: { es: 'Persistencia en la tarea · autorregulación ante el error', en: 'Task persistence · self-regulation after errors' },
  creatividad: { es: 'Pensamiento divergente · fluidez, flexibilidad y originalidad', en: 'Divergent thinking · fluency, flexibility and originality' },
  comunicacion: { es: 'Lenguaje y comunicación · reconocimiento emocional y toma de perspectiva', en: 'Language and communication · emotion recognition and perspective taking' },
  colaboracion: { es: 'Área socioemocional · cooperación y conducta prosocial', en: 'Social-emotional · cooperation and prosocial behaviour' },
}

// Resumen agregado y anónimo: es lo único que se enviaría a la IA (sin avatar ni identificadores)
export function resumenParaIA(jugador) {
  const p = jugador.partidas
  const pat = p.filter((x) => x.juego === 'patrones')
  const inv = p.filter((x) => x.juego === 'inventa')
  const ideas = todasLasIdeas()
  const elegidas = inv.flatMap((x) => x.ideas ?? []).map((id) => ideas.find((i) => i.id === id)).filter(Boolean)
  // Repeticiones para mejorar: veces que volvió a un nivel ya jugado y sacó más estrellas
  let mejoras = 0
  const mejor = {}
  for (const x of p) {
    const k = x.juego + x.nivel
    if (mejor[k] !== undefined && x.estrellas > mejor[k]) mejoras++
    mejor[k] = Math.max(mejor[k] ?? 0, x.estrellas)
  }
  const dias = new Set(p.map((x) => new Date(x.fecha).toDateString())).size
  const partidasPorJuego = Object.fromEntries(JUEGOS.map((j) => [j.id, p.filter((x) => x.juego === j.id).length]))

  return {
    partidas: p.length,
    dias,
    interesesDeclarados: jugador.intereses,
    partidasPorJuego,
    patrones: pat.length
      ? {
          partidas: pat.length,
          nivelInicial: pat[0].nivel,
          nivelMax: Math.max(...pat.filter((x) => x.estrellas > 0).map((x) => x.nivel)),
          errores: pat.reduce((a, x) => a + (x.errores ?? 0), 0),
          reintentos: pat.reduce((a, x) => a + (x.reintentos ?? 0), 0),
          trayectoria: pat.map((x) => x.nivel),
        }
      : null,
    inventa: inv.length
      ? {
          partidas: inv.length,
          mediaIdeas: +(elegidas.length / inv.length).toFixed(1),
          tipos: new Set(elegidas.map((i) => i.categoria)).size,
          pocoHabituales: elegidas.filter((i) => i.rareza >= 2).length,
        }
      : null,
    mejorasRepitiendo: mejoras,
  }
}

export function informeSinIA(jugador, idioma) {
  const r = resumenParaIA(jugador)
  const en = idioma === 'en'
  const capacidades = []

  if (r.patrones) {
    const { nivelInicial, nivelMax, partidas, trayectoria } = r.patrones
    const destaca = nivelMax >= 5 || nivelMax - nivelInicial >= 3
    capacidades.push({
      id: 'logica',
      observado: true,
      destaca,
      texto: destaca
        ? en ? 'Spots and continues increasingly complex patterns, and keeps progressing.' : 'Reconoce y continúa patrones cada vez más complejos, y sigue progresando.'
        : en ? 'Working with patterns at their own pace.' : 'Trabaja con patrones a su ritmo.',
      evidencias: [
        en ? `From level ${nivelInicial} to level ${nivelMax} of 10 in ${partidas} games` : `Del nivel ${nivelInicial} al ${nivelMax} de 10 en ${partidas} partidas`,
        (en ? 'Levels played: ' : 'Niveles jugados: ') + trayectoria.join(' → '),
      ],
    })
    const { errores, reintentos } = r.patrones
    capacidades.push({
      id: 'perseverancia',
      observado: errores > 0 || r.mejorasRepitiendo > 0,
      destaca: r.mejorasRepitiendo >= 1 || (errores >= 2 && reintentos >= errores),
      texto: en ? 'Keeps trying after mistakes and replays levels to improve.' : 'Sigue intentándolo tras equivocarse y repite niveles para mejorar.',
      evidencias: [
        en ? `Tried again after ${reintentos} of ${errores} mistakes` : `Volvió a intentarlo tras ${reintentos} de ${errores} errores`,
        en ? `${r.mejorasRepitiendo} times replayed a level and improved` : `${r.mejorasRepitiendo} veces repitió un nivel y lo mejoró`,
      ],
    })
  }

  if (r.inventa) {
    const { mediaIdeas, tipos, pocoHabituales, partidas } = r.inventa
    const destaca = mediaIdeas >= 5 || pocoHabituales >= 3
    capacidades.push({
      id: 'creatividad',
      observado: true,
      destaca,
      texto: destaca
        ? en ? 'Comes up with many ideas, several of them unusual.' : 'Propone muchas ideas, varias poco habituales.'
        : en ? 'Proposes uses for everyday objects.' : 'Propone usos para objetos cotidianos.',
      evidencias: [
        en ? `${mediaIdeas} ideas per object on average (${partidas} objects)` : `${mediaIdeas} ideas por objeto de media (${partidas} objetos)`,
        en ? `${tipos} different kinds of ideas, ${pocoHabituales} unusual` : `${tipos} tipos de ideas distintos, ${pocoHabituales} poco habituales`,
      ],
    })
  }

  for (const j of JUEGOS.filter((x) => !x.disponible)) {
    capacidades.push({ id: j.capacidad, observado: false, destaca: false, texto: '', evidencias: [] })
  }

  // Intereses: lo que dijo al empezar + lo que ELIGE jugar más a menudo
  const preferido = Object.entries(r.partidasPorJuego).sort((a, b) => b[1] - a[1])[0]
  const sugerencias = jugador.intereses.map((id) => SUGERENCIAS_INTERES[id]?.[en ? 'en' : 'es']).filter(Boolean)
  if (r.mejorasRepitiendo > 0) {
    sugerencias.push(en ? 'Responds well to challenges they can retry: give chances to improve their own work.' : 'Responde bien a retos que puede repetir: dale oportunidades de mejorar su propio trabajo.')
  }

  const casa = jugador.intereses.map((id) => CASA_INTERES[id]?.[en ? 'en' : 'es']).filter(Boolean)

  return {
    generadoConIA: false,
    casa,
    actividad: { partidas: r.partidas, dias: r.dias, preferido: preferido && preferido[1] > 0 ? preferido : null },
    capacidades,
    intereses: jugador.intereses.map((id) => ISLAS.find((i) => i.id === id)).filter(Boolean),
    sugerencias,
  }
}
