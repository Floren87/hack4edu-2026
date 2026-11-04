import React from 'react';
import { useApp, EFFORT_BADGES } from '../../context/AppContext';
import { translations } from '../../i18n/translations';
import { soundManager } from '../../utils/soundEffects';
import { AudioButton } from '../common/AudioButton';
import { 
  Gamepad2, 
  MapPin, 
  Star, 
  Award, 
  ArrowRight, 
  Lightbulb, 
  Puzzle, 
  MessageSquare, 
  Users 
} from 'lucide-react';

export const ChildHome: React.FC = () => {
  const { language, setView, activeStudent } = useApp();
  const t = translations[language];

  const handleLaunchGame = (gameId: string) => {
    soundManager.playSparkle();
    setView('minigame', { gameId });
  };

  const handleOpenWorlds = () => {
    soundManager.playClick();
    setView('worlds_map');
  };

  const coreGames = [
    {
      id: 'creativity_game',
      title: t.gameCreativityTitle,
      subtitle: t.gameCreativitySubtitle,
      icon: '🎨',
      lucide: Lightbulb,
      color: 'from-purple-900/60 to-indigo-950/80',
      border: 'hover:border-purple-400',
      tag: 'Creatividad',
      starsBonus: '+3 ⭐',
    },
    {
      id: 'logic_game',
      title: t.gameLogicTitle,
      subtitle: t.gameLogicSubtitle,
      icon: '🧩',
      lucide: Puzzle,
      color: 'from-cyan-900/60 to-blue-950/80',
      border: 'hover:border-cyan-400',
      tag: 'Pensamiento Lógico',
      starsBonus: '+3 ⭐',
    },
    {
      id: 'story_game',
      title: t.gameStoryTitle,
      subtitle: t.gameStorySubtitle,
      icon: '📖',
      lucide: MessageSquare,
      color: 'from-rose-900/60 to-pink-950/80',
      border: 'hover:border-rose-400',
      tag: 'Comunicación',
      starsBonus: '+3 ⭐',
    },
    {
      id: 'robot_game',
      title: t.gameRobotTitle,
      subtitle: t.gameRobotSubtitle,
      icon: '🤝',
      lucide: Users,
      color: 'from-emerald-900/60 to-teal-950/80',
      border: 'hover:border-emerald-400',
      tag: 'Colaboración',
      starsBonus: '+3 ⭐',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 p-6 sm:p-8 border border-indigo-800/40 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-3xl sm:text-4xl">{activeStudent.avatar}</span>
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  ¡Hola de nuevo, explorador/a!
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  {activeStudent.nameOrAlias}
                </h1>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-indigo-200/90 max-w-lg leading-relaxed">
              Juega a tu ritmo. No hay exámenes ni notas. Cada intento descubre tus talentos únicos.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <AudioButton textToSpeak={`¡Hola de nuevo, ${activeStudent.nameOrAlias}! Juega a tu ritmo. No hay exámenes ni notas. Cada intento descubre tus talentos únicos.`} size="lg" />
            <div className="px-4 py-2.5 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center gap-2 text-amber-300 font-black">
              <Star className="text-amber-400 fill-amber-400" size={20} />
              <span className="text-lg">{activeStudent.starsCount || 0}</span>
              <span className="text-xs font-medium text-amber-200/80">Estrellas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: 4 Core Minigames (R1, R7, R8, R9, R10) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <span>{t.navGames}</span>
              <Gamepad2 size={18} className="text-amber-400" />
            </h2>
            <p className="text-xs text-slate-400">
              Desafíos de ingenio, secuencias, historias y cooperación
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {coreGames.map(game => (
            <button
              key={game.id}
              onClick={() => handleLaunchGame(game.id)}
              className={`rounded-3xl bg-gradient-to-br ${game.color} border border-slate-800 ${game.border} p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-95 flex flex-col justify-between min-h-[170px] group`}
            >
              <div className="flex items-start justify-between">
                <span className="text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform">
                  {game.icon}
                </span>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                  {game.starsBonus}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">
                  {game.tag}
                </span>
                <h3 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
                  {game.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                  {game.subtitle}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-white">
                <span>Jugar ahora</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Section 2: Worlds of Interests (R2 & 6 Activities) */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-900/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <MapPin size={16} />
            <span>Mundos de Curiosidad e Intereses (R2)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {t.worldsMapTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
            Visita libremente: <strong>Construir</strong>, <strong>Explorar</strong>, <strong>Crear</strong>, <strong>Ayudar</strong>, <strong>Organizar</strong> o <strong>Contar</strong> con retos táctiles para neurodivergentes.
          </p>
        </div>

        <button
          onClick={handleOpenWorlds}
          className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/20 transition-all active:scale-95 shrink-0 flex items-center gap-2"
        >
          <span>Abrir Mapa de Mundos</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Section 3: Effort Badges & Replayability (R1 bis) */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="text-amber-400" size={20} />
            <h3 className="text-base font-black text-white">{t.badges}</h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {activeStudent.unlockedBadges.length} de {Object.keys(EFFORT_BADGES).length} obtenidas
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.values(EFFORT_BADGES).map(badge => {
            const isUnlocked = activeStudent.unlockedBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isUnlocked
                    ? 'bg-amber-500/10 border-amber-400/40 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 opacity-40'
                }`}
              >
                <div className="text-3xl mb-1">{badge.icon}</div>
                <span className="text-xs font-bold text-white block truncate">{badge.name}</span>
                <span className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{badge.description}</span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
