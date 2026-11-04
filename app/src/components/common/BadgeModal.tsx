import { localizeText as text } from '../../i18n/localize';
import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { soundManager } from '../../utils/soundEffects';
import { Award, X } from 'lucide-react';
import { AudioButton } from './AudioButton';

export const BadgeModal: React.FC = () => {
  const { badgeModal, closeBadgeModal } = useApp();
  const { language } = useApp();

  useEffect(() => {
    if (badgeModal) {
      soundManager.playSparkle();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // fallback
      }
    }
  }, [badgeModal]);

  if (!badgeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 border border-amber-400/40 p-6 text-center shadow-2xl">
        <button
          onClick={closeBadgeModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800/60"
        >
          <X size={18} />
        </button>

        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500/20 to-yellow-300/30 border-2 border-amber-400/60 shadow-inner mb-4 animate-bounce">
          <span className="text-5xl">{badgeModal.icon}</span>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Award size={16} />
          <span>{' '}{text(language, "¡Nueva Insignia Desbloqueada!")}{' '}</span>
        </div>

        <h3 className="text-xl font-black text-white mb-2">
          {' '}{text(language, badgeModal.name)}{' '}
        </h3>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          {' '}{text(language, badgeModal.description)}{' '}
        </p>

        <div className="flex items-center justify-center gap-3">
          <AudioButton textToSpeak={`${text(language, badgeModal.name)}. ${text(language, badgeModal.description)}`} size="lg" />
          <button
            onClick={closeBadgeModal}
            className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
          >{' '}{text(language, "¡Genial, a seguir jugando!")}{' '}</button>
        </div>
      </div>
    </div>
  );
};
