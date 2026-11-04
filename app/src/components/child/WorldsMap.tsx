import type { Language } from '../../types';
import { localizeText as text } from '../../i18n/localize';
import React from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';
import { WorldId } from '../../types';
import { soundManager } from '../../utils/soundEffects';
import { AudioButton } from '../common/AudioButton';
import { ArrowLeft, Globe, Star } from 'lucide-react';

interface WorldCardData {
  id: WorldId;
  titleKey: keyof typeof translations['es'];
  descKey: keyof typeof translations['es'];
  icon: string;
  bgGradient: string;
  borderColor: string;
  activityName: string;
  tag: string;
}

const getWORLDS_DATA = (language: Language): WorldCardData[] => ([
  {
    id: 'build',
    titleKey: 'worldBuildTitle',
    descKey: 'worldBuildDesc',
    icon: '🏗️',
    bgGradient: 'from-amber-950/80 via-slate-900 to-amber-900/40',
    borderColor: 'hover:border-amber-400',
    activityName: text(language, "Torre de Equilibrio Zen"),
    tag: text(language, "Física y Espacio"),
  },
  {
    id: 'explore',
    titleKey: 'worldExploreTitle',
    descKey: 'worldExploreDesc',
    icon: '🧭',
    bgGradient: 'from-sky-950/80 via-slate-900 to-sky-900/40',
    borderColor: 'hover:border-sky-400',
    activityName: text(language, "Constelaciones Ocultas"),
    tag: text(language, "Atención Visual"),
  },
  {
    id: 'create',
    titleKey: 'worldCreateTitle',
    descKey: 'worldCreateDesc',
    icon: '🎨',
    bgGradient: 'from-fuchsia-950/80 via-slate-900 to-fuchsia-900/40',
    borderColor: 'hover:border-fuchsia-400',
    activityName: text(language, "Sinfonía Cromática"),
    tag: text(language, "Sensorial & Ritmo"),
  },
  {
    id: 'help',
    titleKey: 'worldHelpTitle',
    descKey: 'worldHelpDesc',
    icon: '🤝',
    bgGradient: 'from-rose-950/80 via-slate-900 to-rose-900/40',
    borderColor: 'hover:border-rose-400',
    activityName: text(language, "Refugio de Criaturas"),
    tag: text(language, "Empatía No Verbal"),
  },
  {
    id: 'organize',
    titleKey: 'worldOrganizeTitle',
    descKey: 'worldOrganizeDesc',
    icon: '📦',
    bgGradient: 'from-emerald-950/80 via-slate-900 to-emerald-900/40',
    borderColor: 'hover:border-emerald-400',
    activityName: text(language, "Clasificación Libre"),
    tag: text(language, "Sistematización"),
  },
  {
    id: 'count',
    titleKey: 'worldCountTitle',
    descKey: 'worldCountDesc',
    icon: '🔢',
    bgGradient: 'from-yellow-950/80 via-slate-900 to-yellow-900/40',
    borderColor: 'hover:border-yellow-400',
    activityName: text(language, "Balanza de Cristales"),
    tag: text(language, "Cantidad Intuitiva"),
  },
]);

export const WorldsMap: React.FC = () => {
  const { language, setView, activeStudent } = useApp();
  const WORLDS_DATA = getWORLDS_DATA(language);
  const t = translations[language];

  const handleOpenWorld = (worldId: WorldId) => {
    soundManager.playSparkle();
    setView('world_activity', { worldId });
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      
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
          <AudioButton textToSpeak={`${t.worldsMapTitle}. ${t.worldsMapSubtitle}`} />
        </div>
      </div>

      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 p-6 border border-indigo-800/50 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Globe size={14} />
            <span>{' '}{text(language, "Mapa de Intereses y Curiosidad (R2)")}{' '}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {t.worldsMapTitle}
          </h1>
          <p className="text-sm text-indigo-200/90 mt-1 max-w-xl">
            {t.worldsMapSubtitle}{' '}{text(language, ". Al pulsar sobre cualquier mundo iniciarás su actividad visual y sensorial especialmente pensada para la neurodiversidad.")}{' '}</p>
        </div>
      </div>

      {/* 6 Worlds Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {WORLDS_DATA.map(world => {
          const visits = activeStudent.worldVisits[world.id] || 0;
          return (
            <button
              key={world.id}
              onClick={() => handleOpenWorld(world.id)}
              className={`rounded-3xl bg-gradient-to-br ${world.bgGradient} border border-slate-800 ${world.borderColor} p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 active:scale-95 flex flex-col justify-between min-h-[220px] group`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-5xl filter drop-shadow-md group-hover:scale-110 transition-transform">
                    {world.icon}
                  </span>
                  <span className="text-[10px] font-bold text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-700">
                    {world.tag}
                  </span>
                </div>

                <h3 className="text-lg font-black text-white mt-4 group-hover:text-amber-300 transition-colors">
                  {String(t[world.titleKey])}
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed line-clamp-2">
                  {String(t[world.descKey])}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between mt-3">
                <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                  <span>{' '}{text(language, "🎮 Actividad:")}{' '}</span>
                  <span className="text-slate-200">{world.activityName}</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  {visits > 0 ? text(language, 'Visitado: {0}x', [visits]) : text(language, 'Nuevo')}
                </span>
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
};
