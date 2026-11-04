import type { Language } from '../../types';
import { localizeText as text } from '../../i18n/localize';
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { soundManager } from '../../utils/soundEffects';
import { AudioButton } from '../common/AudioButton';
import { ArrowLeft, Check, Music, Palette, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Ripple {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
}

const getPALETTES = (language: Language) => ([
  { id: 'aurora', name: text(language, "Aurora Mágica"), colors: ['#06b6d4', '#10b981', '#8b5cf6', '#3b82f6'] },
  { id: 'sunset', name: text(language, "Atardecer Cálido"), colors: ['#f97316', '#ec4899', '#eab308', '#ef4444'] },
  { id: 'cosmic', name: text(language, "Espacio Infinito"), colors: ['#6366f1', '#a855f7', '#38bdf8', '#f43f5e'] },
]);

const CHIME_FREQS = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // Pentatonic C Major

export const ColorHarmonicsCanvas: React.FC = () => {
  const { setView, logGameTelemetry, addStars } = useApp();
  const { language } = useApp();
  const PALETTES = getPALETTES(language);
  const [selectedPaletteIdx, setSelectedPaletteIdx] = useState(0);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [ripplesCreatedCount, setRipplesCreatedCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const canvasRef = useRef<HTMLDivElement>(null);

  const currentPalette = PALETTES[selectedPaletteIdx];

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const randomColor = currentPalette.colors[Math.floor(Math.random() * currentPalette.colors.length)];
    const randomFreq = CHIME_FREQS[Math.floor(Math.random() * CHIME_FREQS.length)];
    soundManager.playChime(randomFreq);

    const newRipple: Ripple = {
      id: Date.now() + Math.random(),
      x,
      y,
      radius: 10,
      maxRadius: 70 + Math.random() * 40,
      color: randomColor,
    };

    setRipples(prev => [...prev.slice(-12), newRipple]);
    setRipplesCreatedCount(prev => prev + 1);
  };

  const handleFinish = () => {
    soundManager.playSparkle();
    const duration = Math.round((Date.now() - startTime) / 1000);

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}

    logGameTelemetry({
      gameId: 'world_create_harmonics',
      gameType: 'world_activity',
      worldId: 'create',
      durationSeconds: duration,
      attemptsCount: 1,
      originalMovesCount: ripplesCreatedCount,
      successRate: 1,
      perseveranceScore: 0.9,
      notesObserved: [
        text(language, "Creó {0} ondas cromáticas y armónicas en el lienzo sensorial.", [ripplesCreatedCount]),
        text(language, "Exploró la paleta \"{0}\" asociando color con estímulo auditivo relajante.", [currentPalette.name]),
        text(language, "Demostró capacidad de autorregulación sensorial y expresión estética libre.")
      ],
      metrics: {
        ripplesCount: ripplesCreatedCount,
        paletteChosen: currentPalette.id,
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
          <span className="text-xs font-semibold text-fuchsia-300 bg-fuchsia-950/80 px-2.5 py-1 rounded-full border border-fuchsia-800">{' '}{text(language, "🎨 Mundo Crear: Sinfonía Cromática Sensorial")}{' '}</span>
          <AudioButton textToSpeak={text(language, "Mundo Crear. Toca cualquier punto de la pantalla para crear ondas de luz de colores y campanas musicales. Disfruta del ritmo y la calma.")} />
        </div>
      </div>

      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-fuchsia-950 via-slate-900 to-indigo-950 p-5 border border-fuchsia-800/40 shadow-xl">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <span>{' '}{text(language, "Sinfonía Cromática Sensorial")}{' '}</span>
          <Music className="text-fuchsia-400" size={20} />
        </h1>
        <p className="text-sm text-fuchsia-200/80 mt-1">{' '}{text(language, "Espacio de autorregulación y creación audiovisual sin metas rígidas. Toca para generar ondas sonoras armónicas.")}{' '}</p>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Visual Ripple Canvas */}
        <div
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="md:col-span-2 rounded-3xl bg-slate-950 border-2 border-fuchsia-900/50 p-6 relative min-h-[380px] overflow-hidden cursor-pointer select-none shadow-2xl"
        >
          <div className="absolute top-4 left-4 text-xs font-bold text-slate-400 pointer-events-none">{' '}{text(language, "Toca o pulsa en cualquier lugar del lienzo 🎵")}{' '}</div>

          {/* Render Ripples */}
          {ripples.map(r => (
            <div
              key={r.id}
              style={{
                left: `${r.x}px`,
                top: `${r.y}px`,
                width: `${r.maxRadius * 2}px`,
                height: `${r.maxRadius * 2}px`,
                borderColor: r.color,
                boxShadow: `0 0 25px ${r.color}55`,
              }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full border-4 animate-ping pointer-events-none opacity-80 duration-1000"
            />
          ))}

          {ripples.length === 0 && (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs pointer-events-none mt-20">
              <span className="text-4xl mb-2">🌊</span>
              <span>{' '}{text(language, "Toca con el dedo o ratón para despertar notas de color")}{' '}</span>
            </div>
          )}

          <div className="absolute bottom-4 left-4 text-xs font-semibold text-fuchsia-300 pointer-events-none bg-slate-900/80 px-3 py-1 rounded-full border border-fuchsia-900">{' '}{text(language, "Ondas generadas:")}{' '}{ripplesCreatedCount}
          </div>
        </div>

        {/* Controls */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">{' '}{text(language, "Paletas de Color Sensorial")}{' '}</span>
            <div className="space-y-2">
              {PALETTES.map((pal, idx) => (
                <button
                  key={pal.id}
                  onClick={() => {
                    soundManager.playPop();
                    setSelectedPaletteIdx(idx);
                  }}
                  className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    selectedPaletteIdx === idx
                      ? 'bg-fuchsia-950/50 border-fuchsia-400 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold">{pal.name}</span>
                  <div className="flex gap-1">
                    {pal.colors.map((c, i) => (
                      <span key={i} style={{ backgroundColor: c }} className="w-3.5 h-3.5 rounded-full inline-block border border-white/20" />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            {!completed ? (
              <button
                onClick={handleFinish}
                disabled={ripplesCreatedCount < 3}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-slate-950 font-black text-xs shadow-lg shadow-fuchsia-500/20 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              >
                <Check size={16} />
                <span>{' '}{text(language, "Guardar Sinfonía (+2 ⭐)")}{' '}</span>
              </button>
            ) : (
              <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500 text-center space-y-2">
                <p className="text-xs font-bold text-emerald-200">{' '}{text(language, "¡Experiencia cromática guardada en el perfil pedagógico!")}{' '}</p>
                <button
                  onClick={() => setView('worlds_map')}
                  className="w-full py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                >{' '}{text(language, "Volver al Mapa de Mundos")}{' '}</button>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
