import type { Language } from '../../types';
import { localizeText as text } from '../../i18n/localize';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundManager } from '../../utils/soundEffects';
import { AudioButton } from '../common/AudioButton';
import { ArrowLeft, Check, Compass, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Constellation {
  id: string;
  name: string;
  icon: string;
  starsCoords: { x: number; y: number }[];
  discovered: boolean;
  meaning: string;
}

const getINITIAL_CONSTELLATIONS = (language: Language): Constellation[] => ([
  {
    id: 'fox',
    name: text(language, "Zorro Estelar"),
    icon: '🦊',
    starsCoords: [{ x: 22, y: 30 }, { x: 30, y: 22 }, { x: 38, y: 32 }, { x: 32, y: 44 }],
    discovered: false,
    meaning: text(language, "Agilidad mental y observación atenta"),
  },
  {
    id: 'owl',
    name: text(language, "Búho Sabio"),
    icon: '🦉',
    starsCoords: [{ x: 68, y: 20 }, { x: 78, y: 24 }, { x: 82, y: 38 }, { x: 70, y: 36 }],
    discovered: false,
    meaning: text(language, "Capacidad de reflexión profunda"),
  },
  {
    id: 'dolphin',
    name: text(language, "Delfín Cósmico"),
    icon: '🐬',
    starsCoords: [{ x: 25, y: 70 }, { x: 35, y: 64 }, { x: 45, y: 72 }, { x: 50, y: 82 }],
    discovered: false,
    meaning: text(language, "Alegría y espíritu de juego"),
  },
  {
    id: 'butterfly',
    name: text(language, "Mariposa de Luz"),
    icon: '🦋',
    starsCoords: [{ x: 70, y: 65 }, { x: 80, y: 58 }, { x: 88, y: 70 }, { x: 76, y: 78 }],
    discovered: false,
    meaning: text(language, "Sensibilidad a la transformación y la belleza"),
  },
]);

export const ConstellationTracker: React.FC = () => {
  const { setView, logGameTelemetry, addStars } = useApp();
  const { language } = useApp();
  const INITIAL_CONSTELLATIONS = getINITIAL_CONSTELLATIONS('es');
  const [constellations, setConstellations] = useState(INITIAL_CONSTELLATIONS);
  const [completed, setCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [clicksCount, setClicksCount] = useState(0);

  const handleDiscoverConstellation = (cId: string) => {
    soundManager.playSparkle();
    setClicksCount(prev => prev + 1);

    setConstellations(prev => prev.map(c => {
      if (c.id === cId) {
        return { ...c, discovered: true };
      }
      return c;
    }));
  };

  const discoveredCount = constellations.filter(c => c.discovered).length;

  const handleFinish = () => {
    soundManager.playSparkle();
    const duration = Math.round((Date.now() - startTime) / 1000);

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}

    logGameTelemetry({
      gameId: 'world_explore_constellations',
      gameType: 'world_activity',
      worldId: 'explore',
      durationSeconds: duration,
      attemptsCount: clicksCount,
      originalMovesCount: discoveredCount,
      successRate: 1,
      perseveranceScore: 0.9,
      notesObserved: [
        text(language, "Descubrió {0} de 4 constelaciones celestes ocultas.", [discoveredCount]),
        text(language, "Demostró alta discriminación perceptiva de detalles visuales y búsqueda sistemática."),
        text(language, "Tiempo de exploración atenta: {0}s.", [duration])
      ],
      metrics: {
        discoveredCount,
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
          <span className="text-xs font-semibold text-sky-300 bg-sky-950/80 px-2.5 py-1 rounded-full border border-sky-800">{' '}{text(language, "🧭 Mundo Explorar: Rastreador de Constelaciones")}{' '}</span>
          <AudioButton textToSpeak={text(language, "Mundo Explorar. Mira el cielo nocturno y busca las estrellas secretas. Al tocarlas, revelarás animales cósmicos ocultos.")} />
        </div>
      </div>

      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 p-5 border border-sky-800/40 shadow-xl">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <span>{' '}{text(language, "Constelaciones Ocultas")}{' '}</span>
          <Compass className="text-sky-400" size={20} />
        </h1>
        <p className="text-sm text-sky-200/80 mt-1">{' '}{text(language, "Atención al detalle y curiosidad visual. Explora el firmamento oscuro y activa los grupos de estrellas brillantes.")}{' '}</p>
      </div>

      {/* Interactive Sky Canvas */}
      <div className="rounded-3xl bg-slate-950 border-2 border-indigo-900/60 p-6 relative min-h-[380px] overflow-hidden shadow-2xl">
        
        {/* Subtle background stars */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-12 left-20 animate-ping" />
          <div className="w-1 h-1 rounded-full bg-white absolute top-40 left-80" />
          <div className="w-2 h-2 rounded-full bg-indigo-300 absolute top-72 left-44 opacity-60" />
          <div className="w-1 h-1 rounded-full bg-white absolute top-24 right-32" />
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-200 absolute bottom-16 right-72" />
        </div>

        {/* Constellation Clusters */}
        {constellations.map(c => {
          return (
            <div key={c.id}>
              {/* Star dots */}
              {c.starsCoords.map((coord, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDiscoverConstellation(c.id)}
                  style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ${
                    c.discovered
                      ? 'w-6 h-6 bg-amber-400 border-2 border-white shadow-lg shadow-amber-400/80 scale-125 z-20'
                      : 'w-4 h-4 bg-sky-300/80 hover:bg-amber-300 hover:scale-150 animate-pulse z-10'
                  }`}
                  title={text(language, "Toca para despertar la constelación")}
                />
              ))}

              {/* Revealed Constellation Banner */}
              {c.discovered && (
                <div
                  style={{
                    left: `${c.starsCoords[0].x}%`,
                    top: `${c.starsCoords[0].y + 10}%`,
                  }}
                  className="absolute transform -translate-x-1/2 z-30 bg-slate-900/90 border border-amber-400/80 px-3 py-1.5 rounded-2xl shadow-xl flex items-center gap-2 pointer-events-none animate-in fade-in zoom-in"
                >
                  <span className="text-xl">{c.icon}</span>
                  <div>
                    <span className="text-xs font-bold text-amber-300 block">{text(language, c.name)}</span>
                    <span className="text-[10px] text-slate-300">{text(language, c.meaning)}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Status Indicator */}
        <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700">
          <Eye size={14} className="text-sky-400" />
          <span className="text-xs font-semibold text-slate-300">{' '}{text(language, "Descubiertas:")}{' '}<strong className="text-amber-400">{discoveredCount}</strong> / {constellations.length}
          </span>
        </div>

        {discoveredCount >= 2 && !completed && (
          <div className="absolute bottom-4 right-4 z-30">
            <button
              onClick={handleFinish}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-slate-950 font-black text-xs shadow-lg shadow-sky-500/20 active:scale-95 flex items-center gap-1.5"
            >
              <Check size={16} />
              <span>{' '}{text(language, "Guardar Exploración (+2 ⭐)")}{' '}</span>
            </button>
          </div>
        )}

      </div>

      {completed && (
        <div className="p-4 rounded-3xl bg-emerald-950/60 border border-emerald-500 text-center space-y-2">
          <p className="text-xs font-bold text-emerald-200">{' '}{text(language, "¡Descubrimiento visual completado! La capacidad de atención al detalle quedó registrada.")}{' '}</p>
          <button
            onClick={() => setView('worlds_map')}
            className="py-2.5 px-6 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
          >{' '}{text(language, "Volver al Mapa de Mundos")}{' '}</button>
        </div>
      )}

    </div>
  );
};
