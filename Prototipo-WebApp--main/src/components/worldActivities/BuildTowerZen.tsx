import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundManager } from '../../utils/soundEffects';
import { AudioButton } from '../common/AudioButton';
import { ArrowLeft, Check, Layers, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BlockPiece {
  id: string;
  width: number;
  height: number;
  color: string;
  shapeName: string;
  icon: string;
}

const AVAILABLE_BLOCKS: BlockPiece[] = [
  { id: 'b_wide_rock', width: 140, height: 36, color: '#334155', shapeName: 'Piedra Base Ancha', icon: '🪨' },
  { id: 'b_wood_slab', width: 110, height: 28, color: '#92400e', shapeName: 'Tablón de Roble', icon: '🪵' },
  { id: 'b_jade_brick', width: 85, height: 32, color: '#065f46', shapeName: 'Bloque de Jade', icon: '🟩' },
  { id: 'b_crystal_gem', width: 60, height: 30, color: '#0284c7', shapeName: 'Gema Prisma', icon: '💎' },
  { id: 'b_feather_stone', width: 45, height: 26, color: '#a855f7', shapeName: 'Cúpula Liviana', icon: '🔮' },
];

export const BuildTowerZen: React.FC = () => {
  const { setView, logGameTelemetry, addStars } = useApp();
  const [stackedBlocks, setStackedBlocks] = useState<BlockPiece[]>([]);
  const [towerTilt, setTowerTilt] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [adjustmentsCount, setAdjustmentsCount] = useState(0);

  const handleAddBlock = (block: BlockPiece) => {
    soundManager.playClick();
    const newTower = [...stackedBlocks, block];
    setStackedBlocks(newTower);
    setAdjustmentsCount(prev => prev + 1);

    // Calculate stability based on whether narrower blocks are placed on wider ones
    let balancePenalty = 0;
    for (let i = 1; i < newTower.length; i++) {
      if (newTower[i].width > newTower[i - 1].width + 20) {
        balancePenalty += (newTower[i].width - newTower[i - 1].width) * 0.15;
      }
    }
    const tiltAngle = Math.min(18, balancePenalty * (Math.random() > 0.5 ? 1 : -1));
    setTowerTilt(tiltAngle);

    if (newTower.length >= 4) {
      soundManager.playSparkle();
    }
  };

  const handleReset = () => {
    soundManager.playPop();
    setStackedBlocks([]);
    setTowerTilt(0);
  };

  const handleFinish = () => {
    soundManager.playSparkle();
    const duration = Math.round((Date.now() - startTime) / 1000);

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}

    logGameTelemetry({
      gameId: 'world_build_tower',
      gameType: 'world_activity',
      worldId: 'build',
      durationSeconds: duration,
      attemptsCount: 1,
      originalMovesCount: stackedBlocks.length,
      successRate: 1,
      perseveranceScore: 0.9,
      notesObserved: [
        `Construyó una torre de ${stackedBlocks.length} niveles con inclinación de ${Math.abs(towerTilt).toFixed(1)}°.`,
        'Demostró intuición de física espacial y distribución de peso en la base.',
        `Realizó ${adjustmentsCount} decisiones de colocación táctil.`
      ],
      metrics: {
        towerHeight: stackedBlocks.length,
        tiltDegrees: towerTilt,
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
            🏗️ Mundo Construir: Torre de Equilibrio Zen
          </span>
          <AudioButton textToSpeak="Mundo Construir. Apila las piedras y maderas sobre el pedestal para crear una torre armónica. Siente el equilibrio y la gravedad." />
        </div>
      </div>

      {/* Intro Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-stone-900 p-5 border border-amber-800/40 shadow-xl">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <span>Torre de Equilibrio Zen</span>
          <Layers className="text-amber-400" size={20} />
        </h1>
        <p className="text-sm text-amber-200/80 mt-1">
          Actividad táctil y espacial. Apila bloques de diferentes masas y formas buscando la estabilidad natural.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tower Physics Arena */}
        <div className="md:col-span-2 rounded-3xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-end items-center min-h-[420px] relative overflow-hidden shadow-inner">
          
          <div className="absolute top-4 left-4 text-xs font-bold text-slate-400">
            Equilibrio: {Math.abs(towerTilt) < 8 ? '🟢 Estable y Centrado' : '🟡 Inclinación exploratoria'}
          </div>

          {/* Pedestal Base */}
          <div className="flex flex-col-reverse items-center transition-transform duration-500" style={{ transform: `rotate(${towerTilt}deg)` }}>
            
            {/* The Solid Pedestal */}
            <div className="w-48 h-8 rounded-xl bg-gradient-to-r from-slate-700 to-slate-800 border-2 border-slate-600 shadow-xl flex items-center justify-center text-[11px] font-bold text-slate-300">
              Pedestal Firme
            </div>

            {/* Stacked Blocks */}
            {stackedBlocks.map((block, idx) => (
              <div
                key={idx}
                style={{
                  width: `${block.width}px`,
                  height: `${block.height}px`,
                  backgroundColor: block.color,
                }}
                className="rounded-xl border border-white/20 shadow-md flex items-center justify-center text-xs font-bold text-white transition-all my-0.5 hover:scale-105 select-none"
              >
                <span className="mr-1">{block.icon}</span>
                <span className="text-[10px] opacity-90">{block.shapeName}</span>
              </div>
            ))}

          </div>

          {stackedBlocks.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-xs pointer-events-none">
              Toca las piezas de la derecha para apilarlas aquí.
            </div>
          )}

        </div>

        {/* Pieces tray */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Piezas Disponibles
            </span>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              title="Reiniciar torre"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          <div className="space-y-2">
            {AVAILABLE_BLOCKS.map(block => (
              <button
                key={block.id}
                onClick={() => handleAddBlock(block)}
                className="w-full p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left flex items-center justify-between transition-all active:scale-95"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{block.icon}</span>
                  <div>
                    <span className="text-xs font-bold text-white block">{block.shapeName}</span>
                    <span className="text-[10px] text-slate-400">Ancho: {block.width}px</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-400">+ Colocar</span>
              </button>
            ))}
          </div>

          {!completed ? (
            <button
              onClick={handleFinish}
              disabled={stackedBlocks.length < 2}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 disabled:opacity-40 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Check size={16} />
              <span>Guardar Estructura Zen (+2 ⭐)</span>
            </button>
          ) : (
            <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500 text-center space-y-2">
              <p className="text-xs font-bold text-emerald-200">¡Estructura guardada en el informe de habilidades espaciales!</p>
              <button
                onClick={() => setView('worlds_map')}
                className="w-full py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                Volver al Mapa de Mundos
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
