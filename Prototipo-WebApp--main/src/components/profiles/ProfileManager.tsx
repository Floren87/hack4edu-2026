import { localizeText as text } from '../../i18n/localize';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';
import { soundManager } from '../../utils/soundEffects';
import { Language } from '../../types';
import { ArrowLeft, UserPlus, Users, Check, Trash2 } from 'lucide-react';

const AVATAR_OPTIONS = ['🦊', '🐬', '🦁', '🐼', '🦉', '🦋', '🚀', '🌟', '🦄', '🐲'];

export const ProfileManager: React.FC = () => {
  const { 
    students, 
    activeStudent, 
    switchStudent, 
    createStudent, 
    setView, 
    language, 
    resetStudentProgress 
  } = useApp();

  const t = translations[language];

  const [isCreating, setIsCreating] = useState(false);
  const [nameOrAlias, setNameOrAlias] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🦊');
  const [studentAge, setStudentAge] = useState(9);
  const [preferredLang, setPreferredLang] = useState<Language>(language);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameOrAlias.trim()) return;
    createStudent(nameOrAlias, selectedAvatar, preferredLang, studentAge);
    setNameOrAlias('');
    setIsCreating(false);
    setView('child_hub');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setView('child_hub')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
        >
          <ArrowLeft size={16} />
          <span className="text-xs font-semibold">{t.backToHub}</span>
        </button>

        <h1 className="text-base font-black text-white">{' '}{text(language, "Gestor de Perfiles de Alumnos")}{' '}</h1>
      </div>

      {/* Profiles Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <span>{' '}{text(language, "Alumnos en este dispositivo")}{' '}</span>
              <Users size={18} className="text-amber-400" />
            </h2>
            <p className="text-xs text-slate-400">{' '}{text(language, "Varios niños pueden turnarse en el mismo móvil o tableta sin mezclar sus progresos.")}{' '}</p>
          </div>

          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md"
          >
            <UserPlus size={14} />
            <span>{' '}{text(language, "Nuevo Estudiante")}{' '}</span>
          </button>
        </div>

        {/* Create Student Modal / Drawer */}
        {isCreating && (
          <form
            onSubmit={handleCreateSubmit}
            className="rounded-3xl bg-slate-900 border-2 border-indigo-500/60 p-6 space-y-4 shadow-2xl animate-in fade-in"
          >
            <h3 className="text-base font-black text-white">{' '}{text(language, "Crear nuevo perfil de estudiante")}{' '}</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">{' '}{text(language, "Alias del estudiante (nunca su nombre real):")}{' '}</label>
                <input
                  type="text"
                  required
                  placeholder={text(language, "ej. Lince Audaz, Zorro Curioso")}
                  value={nameOrAlias}
                  onChange={(e) => setNameOrAlias(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">{' '}{text(language, "Edad aproximada (7 a 14 años):")}{' '}</label>
                <input
                  type="number"
                  min={7}
                  max={14}
                  value={studentAge}
                  onChange={(e) => setStudentAge(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Avatar selector */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">{' '}{text(language, "Elige un avatar divertido:")}{' '}</label>
              <div className="flex flex-wrap gap-2">
                {AVATAR_OPTIONS.map(av => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setSelectedAvatar(av)}
                    className={`w-11 h-11 text-2xl rounded-2xl flex items-center justify-center transition ${
                      selectedAvatar === av
                        ? 'bg-indigo-600 border-2 border-amber-400 scale-110 shadow-lg'
                        : 'bg-slate-800 border border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >{' '}{text(language, "Cancelar")}{' '}</button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-md"
              >{' '}{text(language, "Guardar y Activar")}{' '}</button>
            </div>
          </form>
        )}

        {/* Existing Students List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {students.map(s => {
            const isActive = s.id === activeStudent.id;
            return (
              <div
                key={s.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                  isActive
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-xl shadow-indigo-500/10'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{s.avatar}</span>
                    <div>
                      <h3 className="text-base font-black text-white">{s.nameOrAlias}</h3>
                      <span className="text-xs text-slate-400">{' '}{text(language, "Edad:")}{' '} {s.age || 9} {' '}{text(language, "años")}{' '}</span>
                    </div>
                  </div>

                  {isActive && (
                    <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/20 px-2.5 py-1 rounded-full border border-indigo-400/30">{' '}{text(language, "Activo ahora")}{' '}</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                  <span>{' '}{text(language, "⭐ Estrellas:")}{' '} <strong>{s.starsCount || 0}</strong></span>
                  <span>{' '}{text(language, "🏅 Insignias:")}{' '} <strong>{s.unlockedBadges.length}</strong></span>
                  <span>{' '}{text(language, "📊 Sesiones:")}{' '} <strong>{s.telemetryLog.length}</strong></span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  {!isActive ? (
                    <button
                      onClick={() => {
                        switchStudent(s.id);
                        setView('child_hub');
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition text-center"
                    >{' '}{text(language, "Seleccionar este Alumno")}{' '}</button>
                  ) : (
                    <button
                      onClick={() => setView('child_hub')}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-800 text-xs font-bold text-indigo-300 text-center"
                    >{' '}{text(language, "Ir a jugar con este alumno")}{' '}</button>
                  )}

                  <button
                    onClick={() => {
                      if (confirm(text(language, "¿Reiniciar progreso de juego para {0}?", [s.nameOrAlias]))) {
                        resetStudentProgress(s.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-rose-400"
                    title={text(language, "Reiniciar progreso")}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
