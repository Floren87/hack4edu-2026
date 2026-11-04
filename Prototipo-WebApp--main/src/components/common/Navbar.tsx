import React from 'react';
import { 
  Compass, 
  GraduationCap, 
  HeartHandshake, 
  Volume2, 
  VolumeX, 
  Users, 
  UserPlus, 
  Globe2 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';
import { Language } from '../../types';
import { PWAInstallButton } from './PWAInstallButton';
import { WorldLogo } from './WorldLogo';
import { soundManager } from '../../utils/soundEffects';

export const Navbar: React.FC = () => {
  const { 
    role, 
    setRole, 
    language, 
    setLanguage, 
    soundMuted, 
    toggleSound, 
    activeStudent, 
    setView,
    view,
    openOnboarding 
  } = useApp();

  const t = translations[language];

  const handleRoleChange = (newRole: 'child' | 'teacher' | 'family') => {
    soundManager.playClick();
    setRole(newRole);
  };

  const handleLangChange = (lang: Language) => {
    soundManager.playPop();
    setLanguage(lang);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/85 border-b border-slate-800/80 transition-all">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        
        {/* Brand & Child Quick Info */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setView('child_hub')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
            title="Ir a inicio de Talento sin Fronteras"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500/20 via-indigo-600/30 to-emerald-500/20 p-0.5 border border-sky-400/30 shadow-md shadow-sky-500/10 group-hover:scale-105 transition-transform flex items-center justify-center">
              <WorldLogo size={34} />
            </div>
            <div className="hidden sm:block">
              <span className="text-base font-black tracking-tight text-white block leading-none">
                Talento <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-indigo-400">sin Fronteras</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Inclusión & Potencial</span>
            </div>
          </button>

          {/* Active Student Pill (Click to open profile manager) */}
          <button
            onClick={() => setView('profile_manager')}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/70 hover:border-indigo-500/60 transition-all group"
            title="Cambiar de estudiante / perfil"
          >
            <span className="text-lg leading-none group-hover:scale-110 transition-transform">{activeStudent.avatar}</span>
            <span className="text-xs font-semibold text-slate-200 max-w-[80px] sm:max-w-[120px] truncate">
              {activeStudent.nameOrAlias}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-full">
              <span>⭐</span>
              <span>{activeStudent.starsCount || 0}</span>
            </div>
          </button>
        </div>

        {/* Center: Role Switcher */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => handleRoleChange('child')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              role === 'child'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass size={14} />
            <span className="hidden md:inline">{t.roleChild}</span>
            <span className="md:hidden">Juegos</span>
          </button>

          <button
            onClick={() => handleRoleChange('teacher')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              role === 'teacher'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap size={14} />
            <span className="hidden md:inline">{t.roleTeacher}</span>
            <span className="md:hidden">Profesional</span>
          </button>

          <button
            onClick={() => handleRoleChange('family')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              role === 'family'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HeartHandshake size={14} />
            <span className="hidden md:inline">{t.roleFamily}</span>
            <span className="md:hidden">Familia</span>
          </button>
        </div>

        {/* Right Tools: Language, Sound, PWA, Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* PWA Install */}
          <PWAInstallButton />

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleSound}
            aria-label={soundMuted ? 'Activar sonido' : 'Silenciar sonido'}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-700 transition"
            title={soundMuted ? 'Sonido desactivado' : 'Sonido activado'}
          >
            {soundMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative group">
            <button className="h-8 px-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1 text-xs font-semibold text-slate-300 hover:border-slate-700 transition">
              <Globe2 size={13} className="text-indigo-400" />
              <span className="uppercase">{language}</span>
            </button>
            <div className="absolute right-0 mt-1 w-36 py-1 bg-slate-900 border border-slate-800 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50">
              <button
                onClick={() => handleLangChange('es')}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${language === 'es' ? 'bg-indigo-600/20 text-indigo-300 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                <span>🇪🇸 Español</span>
                {language === 'es' && <span>✓</span>}
              </button>
              <button
                onClick={() => handleLangChange('en')}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${language === 'en' ? 'bg-indigo-600/20 text-indigo-300 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                <span>🇬🇧 English</span>
                {language === 'en' && <span>✓</span>}
              </button>
              <button
                onClick={() => handleLangChange('fr')}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${language === 'fr' ? 'bg-indigo-600/20 text-indigo-300 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                <span>🇫🇷 Français</span>
                {language === 'fr' && <span>✓</span>}
              </button>
              <button
                onClick={() => handleLangChange('ar')}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${language === 'ar' ? 'bg-indigo-600/20 text-indigo-300 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                <span>🇸🇦 العربية</span>
                {language === 'ar' && <span>✓</span>}
              </button>
              <button
                onClick={() => handleLangChange('uk')}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${language === 'uk' ? 'bg-indigo-600/20 text-indigo-300 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                <span>🇺🇦 Українська</span>
                {language === 'uk' && <span>✓</span>}
              </button>
            </div>
          </div>

          {/* Profile Switcher Icon */}
          <button
            onClick={() => setView('profile_manager')}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-indigo-400 hover:border-indigo-500/50 transition"
            title="Gestionar perfiles de estudiantes"
          >
            <Users size={15} />
          </button>

          {/* Return to Welcome / New Explorer Screen */}
          <button
            onClick={openOnboarding}
            className="h-8 px-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-amber-300 hover:border-amber-400/50 transition cursor-pointer"
            title="Pantalla de inicio / Crear nuevo explorador"
          >
            <UserPlus size={13} className="text-amber-400" />
            <span className="hidden sm:inline">Inicio</span>
          </button>
        </div>

      </div>
    </header>
  );
};
