// Niveles, estrellas e insignias.
// Filosofía: se premia el ESFUERZO y la MEJORA (repetir para superarse), no ser el más rápido.
// Sin rachas que castiguen, sin rankings entre niños, sin anuncios ni compras.

export const JUEGOS = [
  { id: 'patrones', emoji: '🧩', capacidad: 'logica', niveles: 10, disponible: true },
  { id: 'inventa', emoji: '💡', capacidad: 'creatividad', niveles: 4, disponible: true },
  { id: 'historia', emoji: '📖', capacidad: 'comunicacion', niveles: 0, disponible: false },
  { id: 'robot', emoji: '🤖', capacidad: 'colaboracion', niveles: 0, disponible: false },
]

export const INSIGNIAS = {
  primera: '🌱', // primera partida
  perseverante: '💪', // repitió un nivel y lo mejoró
  explorador: '🧭', // jugó a todos los juegos disponibles
  constante: '📅', // jugó en 3 días distintos
}

export function progresoDe(jugador, juego) {
  return jugador.progreso[juego] ?? { desbloqueado: 1, estrellas: {} }
}

export function estrellasTotales(jugador) {
  return Object.values(jugador.progreso).reduce(
    (suma, p) => suma + Object.values(p.estrellas).reduce((a, b) => a + b, 0),
    0,
  )
}

// Devuelve { jugador actualizado, nuevasInsignias, desbloqueado (nivel nuevo o null) }
export function registrarPartida(jugador, partida) {
  const juego = JUEGOS.find((j) => j.id === partida.juego)
  const prog = progresoDe(jugador, partida.juego)
  const antes = prog.estrellas[partida.nivel] ?? 0
  const estrellas = { ...prog.estrellas, [partida.nivel]: Math.max(antes, partida.estrellas) }
  const desbloqueado =
    partida.estrellas > 0 && partida.nivel === prog.desbloqueado && prog.desbloqueado < juego.niveles
      ? prog.desbloqueado + 1
      : null

  const partidas = [...jugador.partidas, { ...partida, fecha: Date.now() }]
  const nuevo = {
    ...jugador,
    partidas,
    progreso: { ...jugador.progreso, [partida.juego]: { desbloqueado: desbloqueado ?? prog.desbloqueado, estrellas } },
  }

  const ganadas = []
  const tiene = (i) => nuevo.insignias.includes(i) || ganadas.includes(i)
  if (!tiene('primera')) ganadas.push('primera')
  if (!tiene('perseverante') && antes > 0 && partida.estrellas > antes) ganadas.push('perseverante')
  const disponibles = JUEGOS.filter((j) => j.disponible).map((j) => j.id)
  if (!tiene('explorador') && disponibles.every((id) => partidas.some((p) => p.juego === id))) ganadas.push('explorador')
  const dias = new Set(partidas.map((p) => new Date(p.fecha).toDateString()))
  if (!tiene('constante') && dias.size >= 3) ganadas.push('constante')
  nuevo.insignias = [...nuevo.insignias, ...ganadas]

  return { jugador: nuevo, nuevasInsignias: ganadas, desbloqueado }
}
