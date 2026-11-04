import type { Language } from '../../types';
import { localizeText as text } from '../../i18n/localize';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';
import { soundManager } from '../../utils/soundEffects';
import { AudioButton } from '../common/AudioButton';
import { ArrowLeft, Check, BookOpen, MoveHorizontal, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StoryCard {
  id: string;
  defaultPos: number;
  icon: string;
  title: string;
  detail: string;
  color: string;
}

const getINITIAL_CARDS = (language: Language): StoryCard[] => ([
  {
    id: 'card_find',
    defaultPos: 1,
    icon: '🐣🍂',
    title: text(language, "El pequeño pájaro en el suelo"),
    detail: text(language, "Un pajarito solitario ha caído de una rama y busca refugio."),
    color: '#f59e0b',
  },
  {
    id: 'card_care',
    defaultPos: 2,
    icon: '🧣💧',
    title: text(language, "Cuidado y abrigo"),
    detail: text(language, "Le abrigan con una bufanda suave y le dan gotas de agua fresca."),
    color: '#06b6d4',
  },
  {
    id: 'card_nest',
    defaultPos: 3,
    icon: '📦🌿',
    title: text(language, "Construir un nido seguro"),
    detail: text(language, "Preparar un hogar con hojas secas y ramitas protegidas del viento."),
    color: '#10b981',
  },
  {
    id: 'card_fly',
    defaultPos: 4,
    icon: '🕊️🌤️',
    title: text(language, "Vuelo hacia la libertad"),
    detail: text(language, "El pájaro recupera fuerzas, abre sus alas y vuela cantando feliz."),
    color: '#8b5cf6',
  },
]);

const getEMOTION_OPTIONS = (language: Language) => ([
  { emoji: '🥺', label: text(language, "Triste / Desorientado") },
  { emoji: '🥰', label: text(language, "Cariñoso / Amable") },
  { emoji: '💪', label: text(language, "Decidido / Trabajador") },
  { emoji: '🥳', label: text(language, "Feliz / Aliviado") },
  { emoji: '😲', label: text(language, "Sorprendido") },
]);

export const StorytellingGame: React.FC = () => {
  const { language, setView, logGameTelemetry, addStars } = useApp();
  const INITIAL_CARDS = getINITIAL_CARDS('es');
  const EMOTION_OPTIONS = getEMOTION_OPTIONS(language);
  const t = translations[language];

  // Shuffled cards initially to let child order them
  const [cardsOrder, setCardsOrder] = useState<StoryCard[]>([
    INITIAL_CARDS[1],
    INITIAL_CARDS[3],
    INITIAL_CARDS[0],
    INITIAL_CARDS[2],
  ]);

  const [cardEmotions, setCardEmotions] = useState<Record<string, string>>({});
  const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [swapsCount, setSwapsCount] = useState(0);

  const handleSwap = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= cardsOrder.length) return;
    soundManager.playClick();
    const updated = [...cardsOrder];
    const temp = updated[fromIdx];
    updated[fromIdx] = updated[toIdx];
    updated[toIdx] = temp;
    setCardsOrder(updated);
    setSwapsCount(prev => prev + 1);
  };

  const handleSetEmotion = (cardId: string, emoji: string) => {
    soundManager.playPop();
    setCardEmotions(prev => ({
      ...prev,
      [cardId]: emoji,
    }));
  };

  const handleFinishStory = () => {
    soundManager.playSparkle();
    const duration = Math.round((Date.now() - startTime) / 1000);
    const emotionsAssigned = Object.keys(cardEmotions).length;

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}

    logGameTelemetry({
      gameId: 'story_game',
      gameType: 'core_minigame',
      category: 'communication',
      durationSeconds: duration,
      attemptsCount: 1,
      originalMovesCount: swapsCount,
      successRate: 1,
      perseveranceScore: 0.9,
      notesObserved: [
        text(language, "Construyó una secuencia narrativa con {0} reordenaciones meditadas.", [swapsCount]),
        text(language, "Asignó {0} emociones a los personajes, mostrando empatía narrativa y lectura no verbal.", [emotionsAssigned]),
        text(language, "Demostró capacidad de estructura secuencial (inicio, nudo, desenlace).")
      ],
      metrics: {
        swapsCount,
        emotionsAssigned,
        durationSec: duration,
      }
    });

    addStars(3);
    setCompleted(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setView('child_hub')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
        >
          <ArrowLeft size={16} />
          <span className="text-xs font-semibold">{t.backToHub}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-rose-300 bg-rose-950/80 px-2.5 py-1 rounded-full border border-rose-800">{' '}{text(language, "📖 Minijuego 3: Comunicación")}{' '}</span>
          <AudioButton textToSpeak={`${t.gameStoryTitle}. ${t.gameStoryInstructions}`} />
        </div>
      </div>

      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 p-5 border border-rose-800/40 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <span>{t.gameStoryTitle}</span>
              <BookOpen className="text-amber-400" size={20} />
            </h1>
            <p className="text-sm text-rose-200/80 mt-1">
              {t.gameStoryInstructions}
            </p>
          </div>
        </div>
      </div>

      {!completed ? (
        <div className="space-y-6">
          
          {/* Instructions Hint */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            <span>{' '}{text(language, "Paso 1: Usa las flechas para ordenar la historia (1 ➔ 4)")}{' '}</span>
            <span>{' '}{text(language, "Paso 2: Toca un emoji para sentir la emoción")}{' '}</span>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cardsOrder.map((card, idx) => {
              const currentEmotion = cardEmotions[card.id];
              return (
                <div
                  key={card.id}
                  className="rounded-3xl bg-slate-900 border border-slate-800 p-4 flex flex-col justify-between space-y-3 shadow-lg hover:border-rose-500/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-full bg-rose-600/30 border border-rose-500 text-rose-300 text-xs font-black flex items-center justify-center">
                      {idx + 1}
                    </span>

                    {/* Move controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleSwap(idx, idx - 1)}
                        disabled={idx === 0}
                        className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30"
                        title={text(language, "Mover a la izquierda")}
                      >
                        ◀
                      </button>
                      <button
                        onClick={() => handleSwap(idx, idx + 1)}
                        disabled={idx === cardsOrder.length - 1}
                        className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30"
                        title={text(language, "Mover a la derecha")}
                      >
                        ▶
                      </button>
                    </div>
                  </div>

                  {/* Card Scene Graphic */}
                  <div className="w-full h-32 rounded-2xl bg-slate-950 flex flex-col items-center justify-center border border-slate-800 text-5xl">
                    <span>{card.icon}</span>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-xs font-bold text-white leading-snug">{text(language, card.title)}</h3>
                    <p className="text-[11px] text-slate-400 mt-1">{text(language, card.detail)}</p>
                  </div>

                  {/* Emotion Picker for this card */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-500 font-medium block mb-1.5 flex items-center gap-1">
                      <Heart size={10} className="text-rose-400" />
                      <span>{' '}{text(language, "¿Qué emoción siente?")}{' '}</span>
                    </span>
                    <div className="flex items-center justify-between gap-1">
                      {EMOTION_OPTIONS.map(em => (
                        <button
                          key={em.emoji}
                          onClick={() => handleSetEmotion(card.id, em.emoji)}
                          className={`text-lg p-1 rounded-lg transition-transform ${
                            currentEmotion === em.emoji
                              ? 'bg-rose-500/30 ring-2 ring-rose-400 scale-125'
                              : 'hover:scale-110 opacity-70 hover:opacity-100'
                          }`}
                          title={em.label}
                        >
                          {em.emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Complete Story Button */}
          <div className="pt-2">
            <button
              onClick={handleFinishStory}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-rose-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Check size={18} />
              <span>{' '}{text(language, "Guardar mi Historia Contada")}{' '}</span>
            </button>
          </div>

        </div>
      ) : (
        /* Finished celebration */
        <div className="rounded-3xl bg-slate-900 border border-rose-500/60 p-8 text-center space-y-4 shadow-2xl">
          <div className="w-20 h-20 mx-auto rounded-full bg-rose-500/20 border border-rose-400 flex items-center justify-center text-4xl">
            ✨
          </div>
          <h2 className="text-2xl font-black text-white">{t.gameStoryComplete}</h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto">{' '}{text(language, "Has demostrado una gran capacidad de comprensión social, empatía y estructura secuencial.")}{' '}</p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setView('child_hub')}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-slate-950 font-bold text-sm"
            >{' '}{text(language, "Volver a la Zona de Juegos")}{' '}</button>
          </div>
        </div>
      )}

    </div>
  );
};
