import type { Language } from '../../types';
import { localizeText as text } from '../../i18n/localize';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundManager } from '../../utils/soundEffects';
import { AudioButton } from '../common/AudioButton';
import { ArrowLeft, Check, FolderKanban } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TactileItem {
  id: string;
  name: string;
  icon: string;
  texture: string;
  colorType: 'earth' | 'glow' | 'water';
}

const getTACTILE_ITEMS = (language: Language): TactileItem[] => ([
  { id: 'item_stone', name: text(language, "Canto Rodado Suave"), icon: '🪨', texture: text(language, "Pulido y fresco"), colorType: 'earth' },
  { id: 'item_amber', name: text(language, "Gema de Ámbar Solar"), icon: '🔶', texture: text(language, "Cálido y brillante"), colorType: 'glow' },
  { id: 'item_shell', name: text(language, "Concha Espiral Nácar"), icon: '🐚', texture: text(language, "Líneas marinas"), colorType: 'water' },
  { id: 'item_leaf', name: text(language, "Hoja de Roble Otoño"), icon: '🍂', texture: text(language, "Seca y crujiente"), colorType: 'earth' },
  { id: 'item_pearl', name: text(language, "Perla Iridiscente"), icon: '⚪', texture: text(language, "Esférica y lisa"), colorType: 'water' },
  { id: 'item_crystal', name: text(language, "Cristal Amatista"), icon: '🔮', texture: text(language, "Facetas geométricas"), colorType: 'glow' },
]);

export const TactileSortingMandala: React.FC = () => {
  const { setView, logGameTelemetry, addStars } = useApp();
  const { language } = useApp();
  const TACTILE_ITEMS = getTACTILE_ITEMS('es');
  const [baskets, setBaskets] = useState<Record<number, TactileItem[]>>({
    1: [],
    2: [],
    3: [],
  });
  const [unplacedItems, setUnplacedItems] = useState<TactileItem[]>(TACTILE_ITEMS);
  const [selectedCriteria, setSelectedCriteria] = useState<string>('textura');
  const [completed, setCompleted] = useState(false);
  const [startTime] = useState(Date.now());

  const handlePlaceInBasket = (item: TactileItem, basketNum: number) => {
    soundManager.playClick();
    setUnplacedItems(prev => prev.filter(i => i.id !== item.id));
    setBaskets(prev => ({
      ...prev,
      [basketNum]: [...prev[basketNum], item]
    }));
  };

  const handleReset = () => {
    soundManager.playPop();
    setBaskets({ 1: [], 2: [], 3: [] });
    setUnplacedItems(TACTILE_ITEMS);
  };

  const totalPlaced = Object.values(baskets).reduce((sum, b) => sum + b.length, 0);

  const handleFinish = () => {
    soundManager.playSparkle();
    const duration = Math.round((Date.now() - startTime) / 1000);

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}

    logGameTelemetry({
      gameId: 'world_organize_mandala',
      gameType: 'world_activity',
      worldId: 'organize',
      durationSeconds: duration,
      attemptsCount: 1,
      originalMovesCount: totalPlaced,
      successRate: 1,
      perseveranceScore: 0.9,
      notesObserved: [
        text(language, "Organizó libremente {0} objetos según criterio autoelegido (\"{1}\").", [totalPlaced, selectedCriteria]),
        text(language, "Demostró capacidad de estructuración, taxonomía personal y flexibilidad cognitiva sin modelos impuestos."),
        text(language, "Tiempo de clasificación táctil: {0}s.", [duration])
      ],
      metrics: {
        totalPlaced,
        criteria: selectedCriteria,
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
          <span className="text-xs font-semibold">{' '}{text(language, "Volver a Mundos")}{' '}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">{' '}{text(language, "📦 Mundo Organizar: Clasificación Libre y Mándala")}{' '}</span>
          <AudioButton textToSpeak={text(language, "Mundo Organizar. Agrupa estos tesoros en los tres cuencos como tú prefieras: por su tacto, por sus colores o por su forma. Aquí tu orden es perfecto.")} />
        </div>
      </div>

      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-5 border border-emerald-800/40 shadow-xl">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <span>{' '}{text(language, "Clasificación Libre & Mándala Táctil")}{' '}</span>
          <FolderKanban className="text-emerald-400" size={20} />
        </h1>
        <p className="text-sm text-emerald-200/80 mt-1">{' '}{text(language, "Sistematización y orden intuitivo sin una única respuesta prefijada. Respeta el criterio de ordenamiento del estudiante.")}{' '}</p>
      </div>

      {/* Unplaced Items Tray */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">{' '}{text(language, "Tesoros para Clasificar (")}{' '}{unplacedItems.length}{' '}{text(language, "restantes):")}{' '}</span>
        <div className="flex flex-wrap gap-3">
          {unplacedItems.map(item => (
            <div
              key={item.id}
              className="p-3 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center gap-3 shadow-md"
            >
              <span className="text-2xl">{item.icon}</span>
              <div>
                <span className="text-xs font-bold text-white block">{text(language, item.name)}</span>
                <span className="text-[10px] text-slate-400">{text(language, item.texture)}</span>
              </div>
              <div className="flex gap-1 pl-2">
                {[1, 2, 3].map(num => (
                  <button
                    key={num}
                    onClick={() => handlePlaceInBasket(item, num)}
                    className="w-7 h-7 rounded-xl bg-indigo-900/60 hover:bg-indigo-600 border border-indigo-500/50 text-[11px] font-bold text-indigo-200 flex items-center justify-center transition"
                    title={text(language, 'Mover al Cuenco {0}', [num])}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {unplacedItems.length === 0 && (
            <div className="text-xs text-emerald-300 font-semibold py-2">{' '}{text(language, "¡Todos los tesoros han encontrado su cuenco armónico!")}{' '}</div>
          )}
        </div>
      </div>

      {/* The 3 Organizing Bowls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(num => (
          <div
            key={num}
            className="rounded-3xl bg-slate-900/80 border-2 border-dashed border-slate-700 p-5 min-h-[200px] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-black text-amber-400">{' '}{text(language, "Cuenco")}{' '} {num}</span>
              <span className="text-[11px] text-slate-400">{baskets[num].length} {' '}{text(language, "objetos")}{' '}</span>
            </div>

            <div className="space-y-2 py-3 flex-1">
              {baskets[num].map(item => (
                <div key={item.id} className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-xs text-slate-200 font-medium">{text(language, item.name)}</span>
                </div>
              ))}
              {baskets[num].length === 0 && (
                <div className="h-full flex items-center justify-center text-[11px] text-slate-600">{' '}{text(language, "Cuenco vacío")}{' '}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Criteria Selection & Completion */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-slate-300 block">{' '}{text(language, "¿Qué regla inspiró tu orden?")}{' '}</span>
          <div className="flex gap-2">
            {[
              { id: 'textura', label: text(language, "Por textura y tacto") },
              { id: 'color', label: text(language, "Por color y luz") },
              { id: 'origen', label: text(language, "Por origen de la naturaleza") }
            ].map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCriteria(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                  selectedCriteria === c.id
                    ? 'bg-emerald-600 border-emerald-400 text-white font-bold'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {!completed ? (
          <button
            onClick={handleFinish}
            disabled={totalPlaced < 3}
            className="py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 disabled:opacity-40 transition-all flex items-center gap-2"
          >
            <Check size={16} />
            <span>{' '}{text(language, "Guardar Clasificación (+2 ⭐)")}{' '}</span>
          </button>
        ) : (
          <button
            onClick={() => setView('worlds_map')}
            className="py-3 px-6 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs"
          >{' '}{text(language, "Volver a Mundos")}{' '}</button>
        )}
      </div>

    </div>
  );
};
