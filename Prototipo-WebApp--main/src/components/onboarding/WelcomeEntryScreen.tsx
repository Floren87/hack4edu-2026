import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';
import { Language } from '../../types';
import { WorldLogo } from '../common/WorldLogo';
import { AudioButton } from '../common/AudioButton';
import { soundManager } from '../../utils/soundEffects';
import { 
  ArrowRight, 
  Globe2, 
  GraduationCap, 
  HeartHandshake, 
  Check, 
  Shuffle, 
  ShieldCheck 
} from 'lucide-react';

interface AnimalOption {
  icon: string;
  name: string;
  trait: string;
}

const ANIMAL_AVATARS: AnimalOption[] = [
  { icon: '🦊', name: 'Zorro', trait: 'Curioso e ingenioso' },
  { icon: '🐬', name: 'Delfín', trait: 'Alegre y cooperativo' },
  { icon: '🦁', name: 'León', trait: 'Valiente y perseverante' },
  { icon: '🐼', name: 'Panda', trait: 'Tranquilo y observador' },
  { icon: '🦉', name: 'Búho', trait: 'Reflexivo y atento' },
  { icon: '🦋', name: 'Mariposa', trait: 'Creativa y sensible' },
  { icon: '🐢', name: 'Tortuga', trait: 'Paciente y constante' },
  { icon: '🐨', name: 'Koala', trait: 'Amable y calmado' },
  { icon: '🦔', name: 'Erizo', trait: 'Minucioso y detallista' },
  { icon: '🐰', name: 'Conejo', trait: 'Ágil y rápido' },
  { icon: '🐧', name: 'Pingüino', trait: 'Solidario y leal' },
  { icon: '🦌', name: 'Ciervo', trait: 'Noble y perceptivo' },
];

const SUGGESTED_NICKNAMES = [
  'Lince Ágil',
  'Explorador Cósmico',
  'Gacela Veloz',
  'Halcón Sabio',
  'Nutria Creativa',
  'Lobo Amable',
  'Estrella Guía',
  'Hormiga Fuerte'
];

export const WelcomeEntryScreen: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    completeOnboarding, 
    skipOnboarding, 
    students 
  } = useApp();
  const t = translations[language];

  const [nickname, setNickname] = useState('Zorro Curioso');
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'other'>('male');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('🦊');

  const audioPrompt = language === 'es'
    ? '¡Bienvenido a Talento sin Fronteras! Escribe tu apodo secreto, dinos si eres niño o niña, y elige el animalito que más te represente para comenzar tu viaje.'
    : 'Welcome to Talent Without Borders! Choose your secret nickname, whether you are a boy or girl, and select your favorite animal avatar to start.';

  const handleRandomNickname = () => {
    soundManager.playPop();
    const randomName = SUGGESTED_NICKNAMES[Math.floor(Math.random() * SUGGESTED_NICKNAMES.length)];
    setNickname(randomName);
  };

  const handleSelectAnimal = (animal: AnimalOption) => {
    soundManager.playClick();
    setSelectedAvatar(animal.icon);
  };

  const handleStartAdventure = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playSparkle();
    const finalName = nickname.trim() || 'Nuevo Explorador';
    completeOnboarding(finalName, selectedGender, selectedAvatar, language);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-indigo-600/15 via-sky-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Header bar: Language selector and Audio Read-Aloud */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex items-center justify-center">
            <WorldLogo size={32} />
          </div>
          <span className="text-sm font-black text-white tracking-tight hidden sm:inline">
            Talento <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-indigo-400">sin Fronteras</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <AudioButton textToSpeak={audioPrompt} size="md" />

          {/* Quick Language Flags */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-800">
            {(['es', 'en', 'fr', 'ar', 'uk'] as Language[]).map(lang => (
              <button
                key={lang}
                type="button"
                onClick={() => {
                  soundManager.playPop();
                  setLanguage(lang);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold uppercase transition ${
                  language === lang
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title={`Idioma: ${lang.toUpperCase()}`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Form Box */}
      <main className="max-w-2xl w-full mx-auto my-6 z-10">
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
          
          {/* Welcome title */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-indigo-950/60 border border-indigo-500/40 shadow-inner mb-1">
              <span className="text-4xl">{selectedAvatar}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ¡Crea tu Perfil Secreto de Explorador!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              No necesitas dar tu nombre real ni responder preguntas de examen. Juega con total tranquilidad y descubre tus talentos.
            </p>
          </div>

          <form onSubmit={handleStartAdventure} className="space-y-6">
            
            {/* Step 1: Anonymous Nickname */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  1. Elige tu apodo secreto o alias anónimo:
                </label>
                <button
                  type="button"
                  onClick={handleRandomNickname}
                  className="flex items-center gap-1 text-[11px] font-bold text-indigo-300 hover:text-indigo-200 transition"
                  title="Sugerir apodo al azar"
                >
                  <Shuffle size={12} />
                  <span>Sugerir otro</span>
                </button>
              </div>

              <input
                type="text"
                required
                maxLength={30}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="ej. Zorro Curioso, Explorador del Bosque..."
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-2xl px-4 py-3 text-sm font-bold text-white placeholder-slate-500 focus:outline-none transition shadow-inner"
              />

              {/* Quick suggestion tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {SUGGESTED_NICKNAMES.slice(0, 4).map(sug => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => {
                      soundManager.playPop();
                      setNickname(sug);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Gender Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                2. ¿Eres niño o niña? (Hombre / Mujer):
              </label>
              
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedGender('male');
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    selectedGender === 'male'
                      ? 'bg-blue-600/30 border-blue-400 text-white shadow-md'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-2xl">👦</span>
                  <span className="text-xs font-bold">Hombre / Niño</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedGender('female');
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    selectedGender === 'female'
                      ? 'bg-rose-600/30 border-rose-400 text-white shadow-md'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-2xl">👧</span>
                  <span className="text-xs font-bold">Mujer / Niña</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedGender('other');
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    selectedGender === 'other'
                      ? 'bg-amber-600/30 border-amber-400 text-white shadow-md'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-2xl">🌟</span>
                  <span className="text-xs font-bold">Sin definir</span>
                </button>
              </div>
            </div>

            {/* Step 3: Pick cute animal avatar (at least 10 animal icons) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                3. Elige el animalito que más te represente:
              </label>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {ANIMAL_AVATARS.map(animal => {
                  const isSelected = selectedAvatar === animal.icon;
                  return (
                    <button
                      key={animal.name}
                      type="button"
                      onClick={() => handleSelectAnimal(animal)}
                      className={`p-2.5 rounded-2xl border transition-all flex flex-col items-center justify-center text-center group ${
                        isSelected
                          ? 'bg-gradient-to-tr from-amber-500/20 to-indigo-600/30 border-2 border-amber-400 scale-105 shadow-md shadow-amber-400/20 z-10'
                          : 'bg-slate-800/70 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                      }`}
                      title={`${animal.name}: ${animal.trait}`}
                    >
                      <span className="text-3xl filter drop-shadow group-hover:scale-110 transition-transform">
                        {animal.icon}
                      </span>
                      <span className="text-[10px] font-bold text-slate-300 mt-1 truncate max-w-full">
                        {animal.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Launch App Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-indigo-600 hover:from-amber-300 hover:to-indigo-500 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>¡Entrar y Comenzar mi Aventura!</span>
                <ArrowRight size={18} />
              </button>
            </div>

          </form>

          {/* Privacy & R14 notice */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center pt-1 border-t border-slate-800/80">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Tus datos son anónimos, seguros y libres de pruebas formales o etiquetas clínicas.</span>
          </div>

        </div>

        {/* Secondary entry buttons for Teachers & Families */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-xs">
          <button
            type="button"
            onClick={() => skipOnboarding('teacher')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500 transition"
          >
            <GraduationCap size={15} className="text-indigo-400" />
            <span>Acceso directo al Panel Profesional</span>
          </button>

          <button
            type="button"
            onClick={() => skipOnboarding('family')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-rose-500 transition"
          >
            <HeartHandshake size={15} className="text-rose-400" />
            <span>Acceso directo al Espacio Familiar</span>
          </button>

          {students.length > 0 && (
            <button
              type="button"
              onClick={() => skipOnboarding('child')}
              className="px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-slate-200 transition"
            >
              Usar perfiles de muestra ({students.length})
            </button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[11px] text-slate-500 z-10 py-2">
        Talento sin Fronteras • Inclusión para estudiantes migrantes, refugiados y neurodivergentes
      </footer>

    </div>
  );
};
