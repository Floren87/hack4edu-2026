import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundManager } from '../../utils/soundEffects';
import { AudioButton } from '../common/AudioButton';
import { ArrowLeft, Check, Scale, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BalanceWeight {
  id: string;
  name: string;
  icon: string;
  mass: number;
}

const AVAILABLE_WEIGHTS: BalanceWeight[] = [
  { id: 'sun_crystal', name: 'Cristal Solar Grande', icon: '☀️', mass: 4 },
  { id: 'star_gem', name: 'Estrella Dorada', icon: '⭐', mass: 2 },
  { id: 'moon_drop', name: 'Gota de Luna', icon: '💧', mass: 1 },
];

export const MagicScaleBalance: React.FC = () => {
  const { setView, logGameTelemetry, addStars } = useApp();
  
  // Left pan has fixed target mass (e.g. 4)
  const [leftPanItems, setLeftPanItems] = useState<BalanceWeight[]>([AVAILABLE_WEIGHTS[0]]);
  const [rightPanItems, setRightPanItems] = useState<BalanceWeight[]>([]);
  const [completed, setCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [adjustmentsCount, setAdjustmentsCount] = useState(0);

  const leftMass = leftPanItems.reduce((acc, w) => acc + w.mass, 0);
  const rightMass = rightPanItems.reduce((acc, w) => acc + w.mass, 0);

  // Tilt in degrees: -15 to +15
  const diff = rightMass - leftMass;
  const tiltDeg = Math.max(-14, Math.min(14, diff * 3.5));
  const isBalanced = leftMass === rightMass && rightPanItems.length > 0;

  const handleAddRight = (w: BalanceWeight) => {
    soundManager.playClick();
    setRightPanItems(prev => [...prev, w]);
    setAdjustmentsCount(prev => prev + 1);

    if (rightMass + w.mass === leftMass) {
      soundManager.playSparkle();
    }
  };

  const handleRemoveRight = (idx: number) => {
    soundManager.playPop();
    setRightPanItems(prev => prev.filter((_, i) => i !== idx));
    setAdjustmentsCount(prev => prev + 1);
  };

  const handleFinish = () => {
    soundManager.playSparkle();
    const duration = Math.round((Date.now() - startTime) / 1000);

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}

    logGameTelemetry({
      gameId: 'world_count_scale',
      gameType: 'world_activity',
      worldId: 'count',
      durationSeconds: duration,
      attemptsCount: adjustmentsCount,
      originalMovesCount: rightPanItems.length,
      successRate: isBalanced ? 1 : 0.8,
      perseveranceScore: 0.9,
      notesObserved: [
        `Equilibró la balanza mágica logrando una masa de ${leftMass} unidades sin usar números escritos.`,
        'Demostró intuición de conservación de cantidad y pesos relativos mediante ensayo perceptivo.',
        `Realizó ${adjustmentsCount} ajustes de masa en ${duration}s.`
      ],
      metrics: {
        balanced: isBalanced,
        adjustments: adjustmentsCount,
        durationSec: duration,
      }
    });

    addStars(2);
    setCompleted(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setView('worlds_map')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
        >
          <ArrowLeft size={16} />
          <span className="text-xs font-semibold">Volver a Mundos</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-800">
            🔢 Mundo Contar: Balanza de Cristales Mágicos
          </span>
          <AudioButton textToSpeak="Mundo Contar. Coloca cristales en el platillo derecho hasta que la balanza quede perfectamente nivelada y en equilibrio." />
        </div>
      </div>

      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 p-5 border border-amber-800/40 shadow-xl">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <span>Balanza de Cristales Mágicos</span>
          <Scale className="text-amber-400" size={20} />
        </h1>
        <p className="text-sm text-amber-200/80 mt-1">
          Sentido intuitivo de cantidad y conservación de masa sin números abstractos ni pruebas de cálculo escolar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Scale Stage */}
        <div className="md:col-span-2 rounded-3xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between items-center min-h-[380px] shadow-xl relative overflow-hidden">
          
          <div className="text-xs font-bold text-slate-400">
            {isBalanced ? '⚖️ ¡Equilibrio Perfecto!' : diff < 0 ? '◀ El lado izquierdo pesa más' : '▶ El lado derecho pesa más'}
          </div>

          {/* Scale Graphic Representation */}
          <div className="w-full max-w-md my-auto flex flex-col items-center">
            
            {/* Fulcrum Top Point */}
            <div className="w-6 h-6 rounded-full bg-amber-400 border-2 border-slate-900 shadow-md z-20" />

            {/* Tilting Beam */}
            <div
              className="w-full h-3 bg-gradient-to-r from-slate-600 via-amber-400 to-slate-600 rounded-full transition-transform duration-500 origin-center shadow-lg relative"
              style={{ transform: `rotate(${tiltDeg}deg)` }}
            >
              {/* Left Pan Chain & Plate */}
              <div className="absolute -left-2 top-2 flex flex-col items-center transition-all duration-300">
                <div className="w-0.5 h-20 bg-slate-500" />
                <div className="w-28 min-h-[50px] rounded-b-2xl bg-slate-800/95 border-2 border-amber-400/80 p-2 flex flex-wrap items-center justify-center gap-1 shadow-lg">
                  {leftPanItems.map((item, i) => (
                    <span key={i} className="text-2xl" title={item.name}>{item.icon}</span>
                  ))}
                </div>
              </div>

              {/* Right Pan Chain & Plate */}
              <div className="absolute -right-2 top-2 flex flex-col items-center transition-all duration-300">
                <div className="w-0.5 h-20 bg-slate-500" />
                <div className="w-28 min-h-[50px] rounded-b-2xl bg-slate-800/95 border-2 border-cyan-400/80 p-2 flex flex-wrap items-center justify-center gap-1 shadow-lg">
                  {rightPanItems.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => handleRemoveRight(i)}
                      className="text-2xl hover:scale-125 transition-transform"
                      title="Toca para quitar"
                    >
                      {item.icon}
                    </button>
                  ))}
                  {rightPanItems.length === 0 && (
                    <span className="text-[10px] text-slate-500">Vacío</span>
                  )}
                </div>
              </div>

            </div>

            {/* Stand Post & Base */}
            <div className="w-4 h-28 bg-slate-700 -mt-1 shadow-inner" />
            <div className="w-40 h-6 rounded-t-2xl bg-slate-800 border-t-2 border-slate-600 shadow-xl" />

          </div>

          <div className="text-[11px] text-slate-400">
            Toca los objetos del plato derecho si deseas retirarlos.
          </div>

        </div>

        {/* Weights Selector */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Añadir Cristales al Plato Derecho:
          </span>

          <div className="space-y-2">
            {AVAILABLE_WEIGHTS.map(weight => (
              <button
                key={weight.id}
                onClick={() => handleAddRight(weight)}
                className="w-full p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-400 text-left flex items-center justify-between transition-all active:scale-95"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{weight.icon}</span>
                  <div>
                    <span className="text-xs font-bold text-white block">{weight.name}</span>
                    <span className="text-[10px] text-slate-400">Masa equivalente: {'●'.repeat(weight.mass)}</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-cyan-400">+ Colocar</span>
              </button>
            ))}
          </div>

          {!completed ? (
            <button
              onClick={handleFinish}
              disabled={!isBalanced}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-400/20 disabled:opacity-40 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Check size={16} />
              <span>{isBalanced ? '¡Balanza Equilibrada! Guardar (+2 ⭐)' : 'Nivela la balanza para guardar'}</span>
            </button>
          ) : (
            <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500 text-center space-y-2">
              <p className="text-xs font-bold text-emerald-200">¡Equilibrio registrado en el informe de habilidades cuantitativas!</p>
              <button
                onClick={() => setView('worlds_map')}
                className="w-full py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                Volver a Mundos
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
