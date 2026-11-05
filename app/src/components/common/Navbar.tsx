import React, { useState } from 'react';
import { GraduationCap, HeartHandshake, KeyRound, LockKeyhole, LogOut, Users, Volume2, VolumeX, X } from 'lucide-react';
import { useApp, type ActiveView } from '../../context/AppContext';
import { ui } from '../../i18n/account';
import { translations } from '../../i18n/translations';
import { LanguagePicker } from './LanguagePicker';
import { WorldLogo } from './WorldLogo';
import { TeacherIdentity } from './TeacherIdentity';

export function Navbar() {
  const { session, activeStudent, language, view, setView, logout, unlock, busy, soundMuted, toggleSound } = useApp();
  const t = ui(language);
  const [showUnlock, setShowUnlock] = useState(false);
  const [password, setPassword] = useState('');
  const child = session?.mode === 'child';
  const navigation = [
    { view: 'profile_manager' as ActiveView, label: t.students, icon: Users },
    { view: 'teacher_dashboard' as ActiveView, label: t.results, icon: GraduationCap },
    { view: 'family_portal' as ActiveView, label: t.family, icon: HeartHandshake },
  ];

  return <>
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md print:hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3 px-3 py-3 sm:px-6 xl:grid-cols-[minmax(0,1fr)_auto_auto]">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button disabled={busy} aria-label={translations[language].appName} onClick={() => setView(child ? 'child_hub' : 'profile_manager')} className="group flex shrink-0 items-center gap-2.5 rounded-2xl text-start focus-visible:outline-2 focus-visible:outline-amber-400">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-400/30 bg-gradient-to-tr from-sky-500/20 via-indigo-600/30 to-emerald-500/20 shadow-md shadow-sky-500/10 transition-transform group-hover:scale-105">
              <WorldLogo size={34} />
            </span>
            <span className="hidden max-w-44 bg-gradient-to-r from-white via-white to-indigo-300 bg-clip-text text-sm font-black tracking-tight text-transparent md:block">{translations[language].appName}</span>
          </button>
          {activeStudent && (child ? (
            <div className="flex min-w-0 items-center gap-1.5 rounded-full border border-slate-700/70 bg-slate-900 px-2.5 py-1.5">
              <span className="text-lg">{activeStudent.avatar}</span>
              <span className="max-w-24 truncate text-xs font-semibold text-slate-200">{activeStudent.nameOrAlias}</span>
              <span className="hidden rounded-full bg-amber-400/10 px-1.5 py-0.5 text-[11px] font-bold text-amber-400 sm:inline">⭐ {activeStudent.starsCount}</span>
            </div>
          ) : (
            <button disabled={busy} onClick={() => setView('profile_manager')} title={t.students} className="flex min-w-0 items-center gap-1.5 rounded-full border border-slate-700/70 bg-slate-900 px-2.5 py-1.5 transition hover:border-indigo-500/60 focus-visible:outline-2 focus-visible:outline-amber-400">
              <span className="text-lg">{activeStudent.avatar}</span><span className="max-w-24 truncate text-xs font-semibold text-slate-200">{activeStudent.nameOrAlias}</span>
            </button>
          ))}
        </div>

        {!child && <nav aria-label={t.students} className="order-last col-span-2 grid grid-cols-3 gap-1 rounded-2xl border border-slate-800 bg-slate-900/90 p-1 xl:order-none xl:col-span-1">
          {navigation.map(item => {
            const selected = view === item.view;
            const Icon = item.icon;
            return <button
              key={item.view} disabled={busy || (!activeStudent && item.view !== 'profile_manager')}
              aria-current={selected ? 'page' : undefined} onClick={() => setView(item.view)}
              className={`flex min-h-10 items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs font-bold transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 sm:px-3 ${selected
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'}`}
            >
              <Icon size={15} className="hidden shrink-0 min-[360px]:block" /><span>{item.label}</span>
            </button>;
          })}
        </nav>}

        <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2">
          <LanguagePicker disabled={busy} />
          <button onClick={toggleSound} aria-label={t.sound} aria-pressed={!soundMuted} title={t.sound} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-slate-600 hover:text-white focus-visible:outline-2 focus-visible:outline-amber-400">
            {soundMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
          {child ? (
            <button disabled={busy} aria-label={t.back} title={t.back} onClick={() => setShowUnlock(true)} className="flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-2.5 text-xs font-semibold text-slate-300 transition hover:border-amber-400/50 hover:text-amber-300 focus-visible:outline-2 focus-visible:outline-amber-400">
              <LockKeyhole size={14} /><span className="hidden sm:inline">{t.back}</span>
            </button>
          ) : (
            <button disabled={busy} aria-label={t.logout} title={t.logout} onClick={() => { void logout().catch(() => {}); }} className="flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-2.5 text-xs font-semibold text-slate-300 transition hover:border-rose-500/50 hover:text-rose-300 focus-visible:outline-2 focus-visible:outline-amber-400">
              <LogOut size={14} /><span className="hidden sm:inline">{t.logout}</span>
            </button>
          )}
        </div>
        {session?.mode === 'professional' && <div className="order-last col-span-2 flex min-w-0 xl:col-span-3"><TeacherIdentity username={session.account.username} label={t.teacherProfile} /></div>}
      </div>
    </header>

    {child && showUnlock && <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="unlock-title">
      <form className="relative w-full max-w-sm space-y-5 rounded-3xl border border-indigo-500/40 bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 p-6 shadow-2xl" onSubmit={async event => {
        event.preventDefault();
        try { await unlock(password); setShowUnlock(false); }
        catch { /* The shared alert displays the localized error. */ }
        finally { setPassword(''); }
      }}>
        <button type="button" disabled={busy} aria-label={t.close} onClick={() => { setShowUnlock(false); setPassword(''); }} className="absolute end-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"><X size={16} /></button>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/40 bg-indigo-500/15 text-indigo-300"><KeyRound size={24} /></div>
        <h2 id="unlock-title" className="text-lg font-black text-white">{t.back}</h2>
        <p className="text-xs leading-relaxed text-slate-300">{t.unlock}</p>
        <label className="block space-y-2 text-xs font-bold text-amber-400">{t.password}<input autoFocus required type="password" autoComplete="current-password" className="account-field" maxLength={128} value={password} disabled={busy} onChange={event => setPassword(event.target.value)} /></label>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <button type="button" disabled={busy} onClick={() => { setShowUnlock(false); setPassword(''); }} className="rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700">{t.cancel}</button>
          <button className="account-button" disabled={busy}>{t.back}</button>
        </div>
      </form>
    </div>}
  </>;
}
