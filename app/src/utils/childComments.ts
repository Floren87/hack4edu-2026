// Comentarios que el niño deja sobre su invento en «¿Qué inventas?».
//
// Privacidad: NO se guardan en el perfil (localStorage) ni en la telemetría. Viven solo en
// sessionStorage, que el navegador borra al cerrar la pestaña, el tiempo justo para que el
// profesional o la familia los vean e impriman en el informe. También se pueden borrar a mano.

export interface ChildComment {
  createdAt: number;
  /** Iconos de las piezas del invento, para dar contexto al comentario. */
  pieces: string[];
  purpose: string | null;
  emojis: string[];
  text: string;
}

export const CHILD_COMMENT_MAX_LENGTH = 200;
const STORAGE_KEY = 'talento_sf_comentarios_sesion_v1';
const MAX_PER_STUDENT = 10;

function readAll(): Record<string, ChildComment[]> {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function writeAll(all: Record<string, ChildComment[]>) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Sin sessionStorage (modo privado estricto): el comentario simplemente no se conserva.
  }
}

export function addChildComment(studentId: string, comment: ChildComment) {
  const text = comment.text.trim().slice(0, CHILD_COMMENT_MAX_LENGTH);
  if (!text && comment.emojis.length === 0) return;
  const all = readAll();
  all[studentId] = [...(all[studentId] ?? []), { ...comment, text }].slice(-MAX_PER_STUDENT);
  writeAll(all);
}

export function getChildComments(studentId: string): ChildComment[] {
  return readAll()[studentId] ?? [];
}

export function clearChildComments(studentId: string) {
  const all = readAll();
  delete all[studentId];
  writeAll(all);
}

/** Opciones para los niños que no escriben (o no en este idioma). */
export const COMMENT_EMOJIS = [
  { emoji: '😄', label: 'Me gusta mucho' },
  { emoji: '🌟', label: 'Estoy orgulloso u orgullosa' },
  { emoji: '🤔', label: 'Lo voy a mejorar' },
  { emoji: '💪', label: 'Me costó, pero lo logré' },
  { emoji: '🎁', label: 'Es para alguien' },
];
