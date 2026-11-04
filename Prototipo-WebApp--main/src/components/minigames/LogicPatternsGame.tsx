import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';
import { soundManager } from '../../utils/soundEffects';
import { AudioButton } from '../common/AudioButton';
import { ArrowLeft, Check, Puzzle, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PatternLevel {
  id: number;
  title: string;
  sequence: { icon: string; label: string; color: string }[];
  missingIndex: number;
  options: { id: string; icon: string; label: string; isCorrect: boolean }[];
  hint: string;
}

const PATTERN_LEVELS: PatternLevel[] = [
  {
    id: 1,
    title: 'Secuencia Cíclica de Formas y Colores',
    sequence: [
      { icon: '🔴', label: 'Círculo Rojo', color: '#ef4444' },
      { icon: '🔷', label: 'Rombo Azul', color: '#3b82f6' },
      { icon: '🟩', label: 'Cuadrado Verde', color: '#10b981' },
      { icon: '🔴', label: 'Círculo Rojo', color: '#ef4444' },
      { icon: '🔷', label: 'Rombo Azul', color: '#3b82f6' },
      { icon: '❓', label: '¿Cuál sigue?', color: '#6366f1' },
    ],
    missingIndex: 5,
    options: [
      { id: 'opt_1', icon: '🟩', label: 'Cuadrado Verde', isCorrect: true },
      { id: 'opt_2', icon: '🟡', label: 'Círculo Amarillo', isCorrect: false },
      { id: 'opt_3', icon: '🔴', label: 'Círculo Rojo', isCorrect: false },
      { id: 'opt_4', icon: '🔷', label: 'Rombo Azul', isCorrect: false },
    ],
    hint: 'Mira el orden: rojo, azul, verde... y vuelve a empezar: rojo, azul...'
  },
  {
    id: 2,
    title: 'Matriz 2x2 de Simbolismo y Cantidad',
    sequence: [
      { icon: '⭐', label: 'Estrella solitaria', color: '#fbbf24' },
      { icon: '⭐⭐', label: 'Dos estrellas', color: '#fbbf24' },
      { icon: '🌙', label: 'Luna solitaria', color: '#818cf8' },
      { icon: '❓', label: '¿Qué completa la regla?', color: '#6366f1' },
    ],
    missingIndex: 3,
    options: [
      { id: 'opt_1', icon: '☀️', label: 'Sol', isCorrect: false },
      { id: 'opt_2', icon: '🌙🌙', label: 'Dos lunas', isCorrect: true },
      { id: 'opt_3', icon: '⭐', label: 'Una estrella', isCorrect: false },
      { id: 'opt_4', icon: '🪐', label: 'Planeta', isCorrect: false },
    ],
    hint: 'Si la estrella pasa de 1 a 2, ¿qué le ocurrirá a la luna?'
  },
  {
    id: 3,
    title: 'Transformación de Estado: Contorno vs Relleno',
    sequence: [
      { icon: '⚪', label: 'Círculo claro', color: '#94a3b8' },
      { icon: '⚫', label: 'Círculo oscuro lleno', color: '#0f172a' },
      { icon: '▫️', label: 'Cuadro claro', color: '#94a3b8' },
      { icon: '❓', label: '¿Cuál es la transformación?', color: '#6366f1' },
    ],
    missingIndex: 3,
    options: [
      { id: 'opt_1', icon: '🔺', label: 'Triángulo rojo', isCorrect: false },
      { id: 'opt_2', icon: '▪️', label: 'Cuadro oscuro lleno', isCorrect: true },
      { id: 'opt_3', icon: '⚪', label: 'Círculo blanco', isCorrect: false },
      { id: 'opt_4', icon: '🔷', label: 'Rombo', isCorrect: false },
    ],
    hint: 'El círculo claro se convirtió en oscuro. El cuadro claro se convertirá en...'
  }
];

export const LogicPatternsGame: React.FC = () => {
  const { language, setView, logGameTelemetry, addStars } = useApp();
  const t = translations[language];

  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isWrongAttempt, setIsWrongAttempt] = useState(false);
  const [attemptsThisRound, setAttemptsThisRound] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [startTime] = useState(Date.now());

  const currentLevel = PATTERN_LEVELS[currentLevelIdx];

  const handleSelectOption = (option: typeof currentLevel.options[0]) => {
    soundManager.playClick();
    setSelectedOptionId(option.id);
    setAttemptsThisRound(prev => prev + 1);
    setTotalAttempts(prev => prev + 1);

    if (option.isCorrect) {
      soundManager.playSparkle();
      setIsWrongAttempt(false);

      if (currentLevelIdx < PATTERN_LEVELS.length - 1) {
        setTimeout(() => {
          setCurrentLevelIdx(prev => prev + 1);
          setSelectedOptionId(null);
          setShowHint(false);
          setAttemptsThisRound(0);
        }, 800);
      } else {
        // All rounds complete
        const duration = Math.round((Date.now() - startTime) / 1000);
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        } catch {}

        logGameTelemetry({
          gameId: 'logic_game',
          gameType: 'core_minigame',
          category: 'logic',
          durationSeconds: duration,
          attemptsCount: totalAttempts + 1,
          originalMovesCount: 0,
          successRate: 3 / (totalAttempts + 1),
          perseveranceScore: 0.9,
          notesObserved: [
            'Completó exitosamente los 3 niveles de secuencias y matrices espaciales.',
            `Resolvió el reto en ${duration} segundos tras ${totalAttempts + 1} elecciones en total.`,
            'Demostró capacidad de inferencia de patrones visuales sin texto.'
          ],
          metrics: {
            levelsCompleted: 3,
            totalAttempts: totalAttempts + 1,
            timeSec: duration
          }
        });

        addStars(3);
        setGameFinished(true);
      }
    } else {
      soundManager.playPop();
      setIsWrongAttempt(true);
    }
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
          <span className="text-xs font-semibold text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-800">
            🧩 Minijuego 2: Pensamiento Lógico
          </span>
          <AudioButton textToSpeak={`${t.gameLogicTitle}. ${t.gameLogicInstructions}. ${currentLevel.hint}`} />
        </div>
      </div>

      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 p-5 border border-cyan-800/40 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <span>{t.gameLogicTitle}</span>
              <Puzzle className="text-cyan-400" size={20} />
            </h1>
            <p className="text-sm text-cyan-200/80 mt-1">
              {t.gameLogicInstructions}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-cyan-400 block">Nivel {currentLevelIdx + 1} de {PATTERN_LEVELS.length}</span>
            <div className="flex gap-1 mt-1">
              {PATTERN_LEVELS.map((_, i) => (
                <div
                  key={i}
                  className={`w-6 h-2 rounded-full transition-all ${
                    i <= currentLevelIdx ? 'bg-cyan-400 shadow-sm shadow-cyan-400/50' : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Game Card */}
      {!gameFinished ? (
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-8 shadow-xl">
          
          {/* Visual Sequence Display */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
              Observa el patrón y halla la pieza faltante:
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 min-h-[140px]">
              {currentLevel.sequence.map((item, idx) => {
                const isTarget = idx === currentLevel.missingIndex;
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-center rounded-2xl transition-all duration-300 ${
                      isTarget
                        ? 'w-20 h-20 bg-cyan-950/60 border-2 border-dashed border-cyan-400/70 animate-pulse text-3xl font-black text-cyan-300 shadow-lg shadow-cyan-500/20'
                        : 'w-16 h-16 sm:w-20 sm:h-20 bg-slate-900 border border-slate-700/60 text-3xl sm:text-4xl shadow-md hover:scale-105'
                    }`}
                  >
                    <span>{item.icon}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feedback message if wrong */}
          {isWrongAttempt && (
            <div className="p-3 rounded-2xl bg-amber-950/60 border border-amber-600/40 text-amber-200 text-xs flex items-center justify-between animate-shake">
              <div className="flex items-center gap-2">
                <span>💡</span>
                <span>¡Buen intento! Cada prueba te acerca a la regla. Vuelve a mirar la secuencia con calma.</span>
              </div>
              <button
                onClick={() => setShowHint(true)}
                className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px] shrink-0"
              >
                Ver pista
              </button>
            </div>
          )}

          {showHint && (
            <div className="p-3 rounded-2xl bg-cyan-950/60 border border-cyan-700 text-cyan-200 text-xs flex items-center gap-2">
              <HelpCircle size={16} />
              <span>{currentLevel.hint}</span>
            </div>
          )}

          {/* Interactive Options */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider text-center">
              Elige tu respuesta:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {currentLevel.options.map(opt => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt)}
                    className={`p-5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 active:scale-95 ${
                      isSelected && opt.isCorrect
                        ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/40'
                        : isSelected && !opt.isCorrect
                        ? 'bg-rose-950/60 border-rose-600 text-rose-200'
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-100 hover:border-cyan-400'
                    }`}
                  >
                    <span className="text-4xl">{opt.icon}</span>
                    <span className="text-xs font-semibold text-slate-300">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      ) : (
        /* Completion Card */
        <div className="rounded-3xl bg-slate-900 border border-emerald-500/60 p-8 text-center space-y-4 shadow-2xl">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-4xl">
            🎉
          </div>
          <h2 className="text-2xl font-black text-white">{t.gameLogicSuccess}</h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            Has demostrado una gran capacidad para deducir patrones y reglas visuales. ¡Se ha añadido evidencia positiva a tu perfil!
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setView('child_hub')}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20"
            >
              Volver a la Zona de Juegos
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
