import React, { useState } from 'react';
import { MessageCircle, Trash2 } from 'lucide-react';
import { localizeText as text } from '../../i18n/localize';
import type { Language } from '../../types';
import { clearChildComments, getChildComments } from '../../utils/childComments';

interface Props {
  studentId: string;
  language: Language;
}

/** Muestra «En palabras del niño» en el panel profesional y en el espacio familiar. */
export const ChildCommentsCard: React.FC<Props> = ({ studentId, language }) => {
  const [comments, setComments] = useState(() => getChildComments(studentId));
  const [shownFor, setShownFor] = useState(studentId);
  if (shownFor !== studentId) {
    setShownFor(studentId);
    setComments(getChildComments(studentId));
  }
  if (comments.length === 0) return null;

  const handleClear = () => {
    clearChildComments(studentId);
    setComments([]);
  };

  return (
    <div data-testid="child-comments" className="rounded-3xl bg-slate-900 border border-amber-500/30 p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <MessageCircle className="text-amber-400" size={18} />
          <span>{text(language, "En palabras del niño o la niña")}</span>
        </h3>
        <button
          onClick={handleClear}
          className="print:hidden shrink-0 px-2.5 py-1 rounded-xl bg-slate-800 text-[11px] font-semibold text-slate-300 hover:bg-slate-700 transition flex items-center gap-1"
        >
          <Trash2 size={12} />
          <span>{text(language, "Borrar ahora")}</span>
        </button>
      </div>
      <ul className="space-y-2">
        {comments.map(comment => (
          <li key={comment.createdAt} className="rounded-2xl bg-slate-950/60 border border-slate-800 p-3">
            <div className="text-xl leading-none">{comment.pieces.join(' ')}</div>
            {comment.purpose && <div className="text-[11px] text-slate-400 mt-1">{comment.purpose}</div>}
            {comment.text && <p dir="auto" className="text-sm text-amber-100 italic mt-2">«{comment.text}»</p>}
            {comment.emojis.length > 0 && <div className="text-lg mt-1">{comment.emojis.join(' ')}</div>}
          </li>
        ))}
      </ul>
      <p className="text-[11px] text-slate-500 print:hidden">
        {text(language, "Tal como lo escribió, sin traducir ni puntuar. No se guarda en el perfil: solo está en esta pestaña del navegador y se borra al cerrarla. Imprime o descarga el informe para conservarlo.")}
      </p>
    </div>
  );
};
