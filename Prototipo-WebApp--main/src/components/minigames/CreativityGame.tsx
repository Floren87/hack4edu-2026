import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';
import { soundManager } from '../../utils/soundEffects';
import { AudioButton } from '../common/AudioButton';
import { ArrowLeft, Check, Palette, RefreshCw, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WorkshopItem {
  id: string;
  name: string;
  icon: string;
  category: string;
  rotation: number;
  x: number;
  y: number;
}

const AVAILABLE_PARTS = [
  { id: 'part_umbrella', name: 'Paraguas Solar', icon: '☂️', label: 'Paraguas' },
  { id: 'part_gear', name: 'Engranaje de Oro', icon: '⚙️', label: 'Engranaje' },
  { id: 'part_crystal', name: 'Cristal Cuántico', icon: '💎', label: 'Cristal' },
  { id: 'part_spring', name: 'Muelle Saltarín', icon: '🌀', label: 'Muelle' },
  { id: 'part_bulb', name: 'Bombilla de Ideas', icon: '💡', label: 'Bombilla' },
  { id: 'part_antenna', name: 'Antena Cósmica', icon: '📡', label: 'Antena' },
  { id: 'part_wing', name: 'Ala Mecánica', icon: '🪽', label: 'Ala' },
  { id: 'part_wheel', name: 'Rueda Flotante', icon: '🛞', label: 'Rueda' },
  { id: 'part_bell', name: 'Campana Sonora', icon: '🔔', label: 'Campana' },
  { id: 'part_leaf', name: 'Hoja Viva', icon: '🌿', label: 'Hoja' },
];

const INVENTION_PURPOSES = [
  { id: 'flying', label: '🚀 Transporte volador o espacial', icon: '🚀' },
  { id: 'nature', label: '🌱 Sanador de plantas y animales', icon: '🌱' },
  { id: 'friend', label: '🤖 Amigo robot que cuida emociones', icon: '🤖' },
  { id: 'music', label: '🎶 Música mágica para calmar el ambiente', icon: '🎶' },
  { id: 'vision', label: '🔍 Lupa para descubrir mundos secretos', icon: '🔍' },
];

export const CreativityGame: React.FC = () => {
  const { language, setView, logGameTelemetry, addStars, activeStudent } = useApp();
  const t = translations[language];

  const [placedItems, setPlacedItems] = useState<WorkshopItem[]>([]);
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [inventoName, setInventoName] = useState('Super Invento');
  const [completed, setCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [originalMovesCount, setOriginalMovesCount] = useState(0);

  // Add initial item
  useEffect(() => {
    setPlacedItems([
      { id: 'part_umbrella', name: 'Paraguas', icon: '☂️', category: 'base', rotation: 0, x: 180, y: 140 },
      { id: 'part_gear', name: 'Engranaje', icon: '⚙️', category: 'motor', rotation: 0, x: 230, y: 190 },
    ]);
  }, []);

  const handleAddPart = (part: typeof AVAILABLE_PARTS[0]) => {
    soundManager.playPop();
    const newItem: WorkshopItem = {
      id: `${part.id}_${Date.now()}`,
      name: part.name,
      icon: part.icon,
      category: 'part',
      rotation: 0,
      x: 120 + Math.floor(Math.random() * 160),
      y: 100 + Math.floor(Math.random() * 120),
    };
    setPlacedItems(prev => [...prev, newItem]);
    setSelectedItemIndex(placedItems.length);
    setOriginalMovesCount(prev => prev + 1);
  };

  const handleRotateSelected = () => {
    if (selectedItemIndex === null || !placedItems[selectedItemIndex]) return;
    soundManager.playClick();
    setPlacedItems(prev => prev.map((item, idx) => {
      if (idx !== selectedItemIndex) return item;
      return { ...item, rotation: (item.rotation + 45) % 360 };
    }));
    setOriginalMovesCount(prev => prev + 1);
  };

  const handleRemoveSelected = () => {
    if (selectedItemIndex === null) return;
    soundManager.playPop();
    setPlacedItems(prev => prev.filter((_, idx) => idx !== selectedItemIndex));
    setSelectedItemIndex(null);
  };

  const handleSaveInvention = () => {
    soundManager.playSparkle();
    const duration = Math.round((Date.now() - startTime) / 1000);
    const purposeObj = INVENTION_PURPOSES.find(p => p.id === selectedPurpose);

    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch {
      // fallback
    }

    logGameTelemetry({
      gameId: 'creativity_game',
      gameType: 'core_minigame',
      category: 'creativity',
      durationSeconds: duration,
      attemptsCount: 1,
      originalMovesCount: Math.max(originalMovesCount, placedItems.length),
      successRate: 1,
      perseveranceScore: duration > 45 ? 0.9 : 0.75,
      notesObserved: [
        `Ensambló un artefacto con ${placedItems.length} piezas no convencionales.`,
        purposeObj ? `Asignó propósito creativo: "${purposeObj.label}"` : 'Exploró combinación libre de piezas.',
        `Tiempo dedicado a la experimentación visual: ${duration}s.`
      ],
      metrics: {
        partsCount: placedItems.length,
        purposeSelected: selectedPurpose || 'libre',
        durationSec: duration,
      }
    });

    addStars(3);
    setCompleted(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setView('child_hub')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
        >
          <ArrowLeft size={16} />
          <span className="text-xs font-semibold">{t.backToHub}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-indigo-300 bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-800">
            🎨 Minijuego 1: Creatividad
          </span>
          <AudioButton textToSpeak={`${t.gameCreativityTitle}. ${t.gameCreativityInstructions}`} />
        </div>
      </div>

      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-5 border border-purple-800/40 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <span>{t.gameCreativityTitle}</span>
              <Palette className="text-amber-400" size={20} />
            </h1>
            <p className="text-sm text-purple-200/80 mt-1">
              {t.gameCreativityInstructions}
            </p>
          </div>
        </div>
      </div>

      {/* Main Game Stage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left: Workbench Canvas */}
        <div className="md:col-span-2 rounded-3xl bg-slate-900/90 border-2 border-dashed border-indigo-700/50 p-4 relative min-h-[380px] flex flex-col justify-between overflow-hidden shadow-inner">
          <div className="absolute top-3 left-4 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <span>🛠️ Mesa de Inventos</span>
            <span className="text-[11px] font-normal text-slate-500">(Toca las piezas para rotar o mover)</span>
          </div>

          {/* Interactive Workshop Area */}
          <div className="relative w-full h-[300px] mt-6 bg-slate-950/60 rounded-2xl border border-slate-800/60 overflow-hidden">
            {placedItems.map((item, idx) => {
              const isSelected = selectedItemIndex === idx;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    soundManager.playPop();
                    setSelectedItemIndex(idx);
                  }}
                  style={{
                    left: `${item.x}px`,
                    top: `${item.y}px`,
                    transform: `rotate(${item.rotation}deg)`,
                  }}
                  className={`absolute cursor-pointer select-none transition-all duration-150 p-2 rounded-2xl flex items-center justify-center ${
                    isSelected 
                      ? 'ring-4 ring-amber-400 bg-indigo-900/40 scale-110 z-20' 
                      : 'hover:scale-105 z-10'
                  }`}
                >
                  <span className="text-4xl filter drop-shadow-lg">{item.icon}</span>
                </div>
              );
            })}

            {placedItems.length === 0 && (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs">
                <span>Añade piezas desde la bandeja derecha para armar tu invento.</span>
              </div>
            )}
          </div>

          {/* Controls for Selected Item */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={handleRotateSelected}
                disabled={selectedItemIndex === null}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700 disabled:opacity-40 transition flex items-center gap-1.5"
              >
                <RefreshCw size={13} />
                <span>Girar 45°</span>
              </button>
              <button
                onClick={handleRemoveSelected}
                disabled={selectedItemIndex === null}
                className="px-3 py-1.5 rounded-xl bg-rose-950/50 border border-rose-800/50 text-xs font-semibold text-rose-300 hover:bg-rose-900/50 disabled:opacity-40 transition"
              >
                Quitar pieza
              </button>
            </div>

            <span className="text-xs font-medium text-slate-400">
              Piezas en tu invento: <strong className="text-amber-400">{placedItems.length}</strong>
            </span>
          </div>
        </div>

        {/* Right: Available Parts Picker & Purpose */}
        <div className="space-y-4">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Bandeja de Piezas Mágicas</span>
              <span className="text-[10px] text-slate-500">Toca para añadir</span>
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {AVAILABLE_PARTS.map(part => (
                <button
                  key={part.id}
                  onClick={() => handleAddPart(part)}
                  className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-800 hover:bg-indigo-600/30 border border-slate-700/60 hover:border-indigo-500 active:scale-95 transition-all"
                  title={part.name}
                >
                  <span className="text-2xl">{part.icon}</span>
                  <span className="text-[9px] text-slate-400 mt-1 truncate max-w-full">{part.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Superpower Purpose Selector */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 space-y-2">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
              <span>{t.gameCreativityPrompt}</span>
            </h3>
            <div className="space-y-1.5">
              {INVENTION_PURPOSES.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedPurpose(p.id);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
                    selectedPurpose === p.id
                      ? 'bg-gradient-to-r from-amber-500/20 to-indigo-500/20 border-2 border-amber-400 text-white'
                      : 'bg-slate-800/70 border border-slate-700/50 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-base">{p.icon}</span>
                  <span className="leading-tight">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Complete Button */}
          {!completed ? (
            <button
              onClick={handleSaveInvention}
              disabled={placedItems.length < 2}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 disabled:opacity-40 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Check size={18} />
              <span>{t.gameCreativityFinish}</span>
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/60 text-center space-y-2">
              <span className="text-2xl block">🎉</span>
              <p className="text-xs font-bold text-emerald-200">¡Invento registrado en tu pasaporte y en el informe pedagógico!</p>
              <button
                onClick={() => setView('child_hub')}
                className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                Volver a la Zona de Juegos
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
