import React, { useState } from 'react';
import { Check, GraduationCap, Pencil, Play, ShieldCheck, Trash2, UserPlus, Users, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ui } from '../../i18n/account';
import { translations } from '../../i18n/translations';
import { LanguagePicker } from '../common/LanguagePicker';
import type { Language, StudentProfile } from '../../types';

const AVATARS = ['🦊', '🐬', '🦁', '🐼', '🦉', '🦋', '🚀', '🌟', '🦄', '🐲'];
interface StudentForm { id?: string; nameOrAlias: string; avatar: string; age: number; preferredLanguage: Language }

export function ProfileManager() {
  const { students, activeStudent, switchStudent, setView, language, saveStudent, deleteStudent, startPlaying, busy } = useApp();
  const t = ui(language);
  const labels = translations[language];
  const [form, setForm] = useState<StudentForm | null>(null);
  const edit = (student?: StudentProfile) => setForm({
    id: student?.id, nameOrAlias: student?.nameOrAlias ?? '', avatar: student?.avatar ?? '🦊',
    age: student?.age ?? 9, preferredLanguage: student?.preferredLanguage ?? language,
  });
  const avatarOptions = form && !AVATARS.includes(form.avatar) ? [...AVATARS, form.avatar] : AVATARS;

  return (
    <section className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <h1 className="flex items-center gap-2 text-xl font-black text-white sm:text-2xl"><Users size={22} className="text-amber-400" />{t.students}</h1>
          <p className="flex max-w-xl items-start gap-2 text-xs leading-relaxed text-slate-400"><ShieldCheck size={14} className="mt-0.5 shrink-0 text-indigo-400" />{t.privacy}</p>
        </div>
        <button className="flex shrink-0 items-center gap-1.5 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-indigo-500 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400" disabled={busy} onClick={() => edit()}>
          <UserPlus size={15} />{t.newStudent}
        </button>
      </div>

      {form && (
        <form aria-label={form.id ? t.edit : t.newStudent} className="space-y-5 rounded-3xl border-2 border-indigo-500/60 bg-slate-900 p-5 shadow-2xl sm:p-6" onSubmit={async event => {
          event.preventDefault();
          const { id, ...input } = form;
          try { await saveStudent(input, id); setForm(null); }
          catch { /* The shared alert displays the localized API error. */ }
        }}>
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex min-w-0 items-center gap-3">
              <div aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-indigo-500/40 bg-indigo-950/60 text-3xl shadow-inner">{form.avatar}</div>
              <h2 className="min-w-0 text-base font-black text-white">{form.id ? t.edit : t.newStudent}</h2>
            </div>
            <button type="button" disabled={busy} aria-label={t.close} onClick={() => setForm(null)} className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"><X size={16} /></button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <label className="block space-y-2 text-xs font-bold text-amber-400">{t.alias}
              <input className="account-field" autoFocus required maxLength={40} placeholder={t.aliasExample} value={form.nameOrAlias} disabled={busy} onChange={event => setForm({ ...form, nameOrAlias: event.target.value })} />
            </label>
            <label className="block space-y-2 text-xs font-bold text-slate-300">{t.age}
              <input className="account-field" type="number" min={7} max={14} required value={form.age} disabled={busy} onChange={event => setForm({ ...form, age: Number(event.target.value) })} />
            </label>
          </div>

          <fieldset disabled={busy} className="space-y-3">
            <legend className="mb-3 text-xs font-bold text-slate-300">{t.avatar}</legend>
            <div className="flex max-w-xl flex-wrap gap-2">
              {avatarOptions.map(avatar => (
                <button
                  key={avatar} type="button" disabled={busy} aria-label={`${t.avatar} ${avatar}`} aria-pressed={form.avatar === avatar}
                  onClick={() => setForm({ ...form, avatar })}
                  className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-2xl transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 ${form.avatar === avatar
                    ? 'border-amber-400 bg-indigo-600 shadow-lg shadow-indigo-500/20 ring-1 ring-amber-400'
                    : 'border-slate-700 bg-slate-800 hover:border-indigo-400/60 hover:bg-slate-700'}`}
                >
                  <span aria-hidden="true">{avatar}</span>
                  {form.avatar === avatar && <Check size={10} className="absolute end-1 top-1 text-amber-300" />}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-300">{t.language}</p>
            <LanguagePicker variant="inline" value={form.preferredLanguage} onChange={preferredLanguage => setForm({ ...form, preferredLanguage })} disabled={busy} />
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-800 pt-4">
            <button type="button" disabled={busy} onClick={() => setForm(null)} className="rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-700">{t.cancel}</button>
            <button className="account-button flex items-center gap-1.5" disabled={busy}><Check size={15} />{t.save}</button>
          </div>
        </form>
      )}

      {!students.length && !form && <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/60 p-8 text-center">
        <Users size={32} className="mx-auto mb-3 text-indigo-400" /><p className="text-sm leading-relaxed text-slate-300">{t.empty}</p>
      </div>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {students.map(student => {
          const selected = activeStudent?.id === student.id;
          return <article key={student.id} className={`flex min-w-0 flex-col justify-between space-y-4 rounded-3xl border p-5 transition ${selected
            ? 'border-indigo-500 bg-indigo-950/40 shadow-xl shadow-indigo-500/10'
            : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-center gap-3">
                <span className="shrink-0 text-4xl" aria-hidden="true">{student.avatar}</span>
                <div className="min-w-0 space-y-1">
                  <h2 className="break-words text-base font-black text-white [overflow-wrap:anywhere]">{student.nameOrAlias}</h2>
                  <span className="text-xs text-slate-400">{t.ageLabel}: {student.age ?? '—'}</span>
                </div>
              </div>
              {selected && <span className="flex shrink-0 items-center gap-1 rounded-full border border-indigo-400/30 bg-indigo-500/20 px-2 py-1 text-[10px] font-bold text-indigo-300"><Check size={10} />{t.selected}</span>}
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3 text-center">
              <div className="min-w-0"><span className="text-[10px] text-slate-400">⭐ {labels.stars}</span><strong className="mt-1 block text-sm text-amber-300">{student.starsCount}</strong></div>
              <div className="min-w-0"><span className="text-[10px] text-slate-400">🏅 {labels.badges}</span><strong className="mt-1 block text-sm text-indigo-300">{student.unlockedBadges.length}</strong></div>
              <div className="min-w-0"><span className="text-[10px] text-slate-400">🎮 {t.sessions}</span><strong className="mt-1 block text-sm text-slate-200">{student.telemetryLog.length}</strong></div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button disabled={busy} onClick={() => { switchStudent(student.id); setView('teacher_dashboard'); }} className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-indigo-200 transition hover:border-indigo-500/60 hover:bg-indigo-600/20 focus-visible:outline-2 focus-visible:outline-amber-400"><GraduationCap size={15} className="shrink-0" />{t.results}</button>
                <button disabled={busy} onClick={() => { void startPlaying(student.id).catch(() => {}); }} className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-2 text-xs font-bold text-white shadow-md transition hover:from-indigo-400 hover:to-purple-500 focus-visible:outline-2 focus-visible:outline-amber-400"><Play size={14} className="shrink-0" />{t.play}</button>
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-slate-800/80 pt-3">
                <button disabled={busy} onClick={() => edit(student)} className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-700 hover:text-white"><Pencil size={13} />{t.edit}</button>
                <button disabled={busy} onClick={() => { if (confirm(t.deleteConfirm)) void deleteStudent(student.id).catch(() => {}); }} className="flex items-center gap-1.5 rounded-xl border border-transparent px-3 py-2 text-xs font-semibold text-slate-400 transition hover:border-rose-900/60 hover:bg-rose-950/40 hover:text-rose-300"><Trash2 size={13} />{t.remove}</button>
              </div>
            </div>
          </article>;
        })}
      </div>
    </section>
  );
}
