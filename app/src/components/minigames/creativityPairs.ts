// Catálogo de parejas de «¿Qué inventas?».
//
// No hay parejas «correctas»: cualquier combinación vale. Este catálogo solo sirve para
// describir lo que hace el niño (fluidez, flexibilidad, originalidad y elaboración):
// - 'comun': asociación habitual (paraguas + lluvia). Es una idea válida, pero esperable.
// - 'sorprendente': combinación poco habitual que tiene sentido (paraguas + pez = barca).
// - Una pareja que no está aquí cuenta como «combinación libre», nunca como error.
// La clasificación es una propuesta del equipo, no un dato validado: en los informes se dice
// «poco habitual en este juego», no «original». TODO: verificar con un psicólogo.

export type PieceCategory = 'naturaleza' | 'seres_vivos' | 'objetos' | 'maquinas';
export type PairKind = 'comun' | 'sorprendente';

export const PIECE_CATEGORIES: Record<string, PieceCategory> = {
  part_umbrella: 'objetos',
  part_gear: 'maquinas',
  part_crystal: 'naturaleza',
  part_spring: 'maquinas',
  part_bulb: 'objetos',
  part_antenna: 'maquinas',
  part_wing: 'maquinas',
  part_wheel: 'maquinas',
  part_bell: 'objetos',
  part_leaf: 'naturaleza',
  part_rain: 'naturaleza',
  part_sun: 'naturaleza',
  part_wave: 'naturaleza',
  part_stone: 'naturaleza',
  part_fish: 'seres_vivos',
  part_bee: 'seres_vivos',
  part_bucket: 'objetos',
  part_rope: 'objetos',
};

export interface CreativePair {
  a: string;
  b: string;
  kind: PairKind;
  /** Qué podría ser el invento, en español (se traduce con english.json). */
  idea: string;
}

export const CREATIVE_PAIRS: CreativePair[] = [
  // Parejas comunes
  { a: 'part_umbrella', b: 'part_rain', kind: 'comun', idea: 'Paraguas para no mojarse con la lluvia' },
  { a: 'part_sun', b: 'part_wave', kind: 'comun', idea: 'Un día de playa' },
  { a: 'part_fish', b: 'part_wave', kind: 'comun', idea: 'Un pez nadando en el mar' },
  { a: 'part_bee', b: 'part_leaf', kind: 'comun', idea: 'Una abeja en una planta' },
  { a: 'part_rain', b: 'part_leaf', kind: 'comun', idea: 'La lluvia riega las plantas' },
  { a: 'part_bucket', b: 'part_wave', kind: 'comun', idea: 'Un cubo lleno de agua' },
  { a: 'part_sun', b: 'part_bulb', kind: 'comun', idea: 'Cosas que dan luz' },
  { a: 'part_wheel', b: 'part_gear', kind: 'comun', idea: 'Una máquina con ruedas' },
  { a: 'part_bell', b: 'part_rope', kind: 'comun', idea: 'Una campana que suena al tirar de la cuerda' },
  { a: 'part_sun', b: 'part_leaf', kind: 'comun', idea: 'El sol hace crecer las plantas' },

  // Parejas sorprendentes
  { a: 'part_umbrella', b: 'part_sun', kind: 'sorprendente', idea: 'Una sombrilla que da sombra' },
  { a: 'part_umbrella', b: 'part_fish', kind: 'sorprendente', idea: 'Un paraguas al revés que es una barca' },
  { a: 'part_umbrella', b: 'part_bulb', kind: 'sorprendente', idea: 'Un paraguas con luz para ver de noche' },
  { a: 'part_bucket', b: 'part_rain', kind: 'sorprendente', idea: 'Recoger agua de lluvia para beber o regar' },
  { a: 'part_wheel', b: 'part_bucket', kind: 'sorprendente', idea: 'Una carretilla para llevar agua' },
  { a: 'part_rope', b: 'part_wing', kind: 'sorprendente', idea: 'Una cometa que vuela con el viento' },
  { a: 'part_gear', b: 'part_wave', kind: 'sorprendente', idea: 'Un molino de agua que da energía' },
  { a: 'part_sun', b: 'part_crystal', kind: 'sorprendente', idea: 'Un cristal que guarda la luz del sol' },
  { a: 'part_spring', b: 'part_stone', kind: 'sorprendente', idea: 'Una catapulta' },
  { a: 'part_bell', b: 'part_rain', kind: 'sorprendente', idea: 'Una alarma que avisa cuando llega la tormenta' },
  { a: 'part_bee', b: 'part_antenna', kind: 'sorprendente', idea: 'Una abeja mensajera que lleva noticias' },
  { a: 'part_wing', b: 'part_fish', kind: 'sorprendente', idea: 'Un pez que puede volar' },
  { a: 'part_bulb', b: 'part_fish', kind: 'sorprendente', idea: 'Un pez linterna para ver en el fondo del mar' },
  { a: 'part_gear', b: 'part_leaf', kind: 'sorprendente', idea: 'Una máquina que planta árboles' },
];

/** Busca una pareja en el catálogo sin importar el orden de las piezas. */
export function findPair(pieceA: string, pieceB: string): CreativePair | undefined {
  return CREATIVE_PAIRS.find(p => (p.a === pieceA && p.b === pieceB) || (p.a === pieceB && p.b === pieceA));
}
