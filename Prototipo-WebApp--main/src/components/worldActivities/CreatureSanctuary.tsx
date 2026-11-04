import type { Language } from '../../types';
import { localizeText as text } from '../../i18n/localize';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundManager } from '../../utils/soundEffects';
import { AudioButton } from '../common/AudioButton';
import { ArrowLeft, Check, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Creature {
  id: string;
  name: string;
  avatar: string;
  needDescription: string;
  cueIcon: string;
  solved: boolean;
  correctCareId: string;
}

const getCREATURES = (language: Language): Creature[] => ([
  {
    id: 'pip',
    name: text(language, "Pip, el polluelo cósmico"),
    avatar: '🐥',
    needDescription: text(language, "Se tapa las orejitas: los sonidos fuertes le abruman."),
    cueIcon: '📢💥',
    solved: false,
    correctCareId: 'headphones',
  },
  {
    id: 'lumi',
    name: text(language, "Lumi, la medusa de cristal"),
    avatar: '🪼',
    needDescription: text(language, "Tiembla despacio: la brisa del bosque está muy fría."),
    cueIcon: '🥶❄️',
    solved: false,
    correctCareId: 'blanket',
  },
  {
    id: 'bramble',
    name: text(language, "Bramble, el erizo del musgo"),
    avatar: '🦔',
    needDescription: text(language, "Tiene la lengua seca y busca frutos frescos tras caminar."),
    cueIcon: '☀️🏜️',
    solved: false,
    correctCareId: 'water_berry',
  },
]);

const getCARE_ITEMS = (language: Language) => ([
  { id: 'headphones', name: text(language, "Auriculares de Algodón Silencioso"), icon: '🎧', desc: text(language, "Protección para ruidos fuertes") },
  { id: 'blanket', name: text(language, "Manta Suave de Lana Cálida"), icon: '🧣', desc: text(language, "Abrigo suave y reconfortante") },
  { id: 'water_berry', name: text(language, "Frasco de Agua Fresca con Bayas"), icon: '🍓💧', desc: text(language, "Hidratación nutritiva") },
  { id: 'flashlight', name: text(language, "Linterna Brillante"), icon: '🔦', desc: text(language, "Luz intensa") },
]);

export const CreatureSanctuary: React.FC = () => {
  const { setView, logGameTelemetry, addStars } = useApp();
  const { language } = useApp();
  const CREATURES = getCREATURES('es');
  const CARE_ITEMS = getCARE_ITEMS(language);
  const [creatures, setCreatures] = useState(CREATURES);
  const [selectedCreatureId, setSelectedCreatureId] = useState<string>('pip');
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState(text('es', "Observa cómo se siente cada criatura y dale el cuidado que necesita."));
  const [startTime] = useState(Date.now());
  const [caredCount, setCaredCount] = useState(0);

  const activeCreature = creatures.find(c => c.id === selectedCreatureId) || creatures[0];

  const handleApplyCare = (careId: string) => {
    if (activeCreature.solved) {
      setFeedback(text('es', "¡Esta criatura ya está tranquila y agradecida!"));
      return;
    }

    if (careId === activeCreature.correctCareId) {
      soundManager.playSparkle();
      const nextCount = caredCount + 1;
      setCaredCount(nextCount);

      setCreatures(prev => prev.map(c => {
        if (c.id === activeCreature.id) {
          return { ...c, solved: true };
        }
        return c;
      }));

      setFeedback(text('es', "¡Maravilloso! {0} se siente calmado/a y protegido/a.", [activeCreature.name]));

      // If all solved
      if (nextCount >= 3) {
        soundManager.playSparkle();
        const duration = Math.round((Date.now() - startTime) / 1000);

        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        } catch {}

        logGameTelemetry({
          gameId: 'world_help_sanctuary',
          gameType: 'world_activity',
          worldId: 'help',
          durationSeconds: duration,
          attemptsCount: nextCount,
          originalMovesCount: nextCount,
          successRate: 1,
          perseveranceScore: 0.95,
          notesObserved: [
            text(language, "Comprendió las señales sensoriales de las 3 criaturas (hipersensibilidad acústica, regulación térmica, hidratación)."),
            text(language, "Demostró empatía hacia la neurodiversidad y las necesidades de calma de otros."),
            text(language, "Resolvió el refugio con delicadeza en {0}s.", [duration])
          ],
          metrics: {
            creaturesHelped: 3,
            durationSec: duration,
          }
        });

        addStars(2);
        setCompleted(true);
      }
    } else {
      soundManager.playPop();
      setFeedback(text('es', "Ese objeto no es el que más alivia su molestia en este momento. Vuelve a observar su gesto."));
    }
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
          <span className="text-xs font-semibold text-rose-300 bg-rose-950/80 px-2.5 py-1 rounded-full border border-rose-800">{' '}{text(language, "🤝 Mundo Ayudar: El Refugio de Criaturas")}{' '}</span>
          <AudioButton textToSpeak={text(language, "Mundo Ayudar. En el refugio, cada criatura tiene una necesidad sensorial diferente. Mira sus gestos y ofréceles cuidado amoroso.")} />
        </div>
      </div>

      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 p-5 border border-rose-800/40 shadow-xl">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <span>{' '}{text(language, "El Refugio de Criaturas")}{' '}</span>
          <Heart className="text-rose-400" size={20} />
        </h1>
        <p className="text-sm text-rose-200/80 mt-1">{' '}{text(language, "Empatía y respeto a las diversas necesidades sensoriales. Cuida de seres amables prestando atención a sus señales corporales.")}{' '}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Creature Stage */}
        <div className="md:col-span-2 rounded-3xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between items-center min-h-[380px] shadow-xl space-y-4">
          
          {/* Creature Tabs */}
          <div className="flex items-center gap-3">
            {creatures.map(c => (
              <button
                key={c.id}
                onClick={() => {
                  soundManager.playPop();
                  setSelectedCreatureId(c.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all ${
                  selectedCreatureId === c.id
                    ? 'bg-rose-950/60 border-rose-400 text-white shadow-md'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <span className="text-xl">{c.avatar}</span>
                <span className="hidden sm:inline">{text(language, c.name).split(',')[0]}</span>
                {c.solved && <span className="text-emerald-400">✓</span>}
              </button>
            ))}
          </div>

          {/* Active Creature Visual Area */}
          <div className="text-center space-y-3 py-6">
            <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center text-7xl transition-all duration-300 ${
              activeCreature.solved 
                ? 'bg-emerald-950/50 border-4 border-emerald-400 shadow-xl shadow-emerald-500/20 scale-105'
                : 'bg-slate-800/80 border-4 border-slate-700'
            }`}>
              {activeCreature.avatar}
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-white">{text(language, activeCreature.name)}</h3>
              <p className="text-xs text-rose-200/90 max-w-sm mx-auto">{text(language, activeCreature.needDescription)}</p>
              <div className="text-xs text-slate-400">{' '}{text(language, "Señal corporal visible:")}{' '}<span className="text-base">{activeCreature.cueIcon}</span>
              </div>
            </div>
          </div>

          {/* Feedback note */}
          <div className="w-full p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center text-xs text-rose-300 font-medium">
            {text(language, feedback)}
          </div>

        </div>

        {/* Care Items Palette */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">{' '}{text(language, "Cofre de Cuidados")}{' '}</span>

          <div className="space-y-2">
            {CARE_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => handleApplyCare(item.id)}
                className="w-full p-3 rounded-2xl bg-slate-800 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-400 text-left flex items-center gap-3 transition-all active:scale-95"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <span className="text-xs font-bold text-white block">{text(language, item.name)}</span>
                  <span className="text-[10px] text-slate-400">{item.desc}</span>
                </div>
              </button>
            ))}
          </div>

          {completed && (
            <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500 text-center space-y-2">
              <p className="text-xs font-bold text-emerald-200">{' '}{text(language, "¡Todas las criaturas están tranquilas y felices!")}{' '}</p>
              <button
                onClick={() => setView('worlds_map')}
                className="w-full py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
              >{' '}{text(language, "Volver al Mapa de Mundos")}{' '}</button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
