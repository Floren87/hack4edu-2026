import React, { useState } from 'react';
import { ArrowRight, KeyRound, ShieldCheck, UserRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ui } from '../../i18n/account';
import { translations } from '../../i18n/translations';
import { localizeText as text } from '../../i18n/localize';
import { LanguagePicker } from '../common/LanguagePicker';
import { WorldLogo } from '../common/WorldLogo';

export function LoginScreen() {
  const { language, login, busy } = useApp();
  const t = ui(language);
  const brand = translations[language];
  const [register, setRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-950 px-4 py-5 text-slate-100 sm:p-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-72 max-w-2xl rounded-full bg-gradient-to-b from-indigo-600/15 via-sky-600/10 to-transparent blur-3xl" />
      <header className="relative mx-auto flex w-full max-w-4xl flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-sky-400/30 bg-gradient-to-tr from-sky-500/20 via-indigo-600/30 to-emerald-500/20 shadow-md shadow-sky-500/10">
            <WorldLogo size={34} />
          </div>
          <span className="bg-gradient-to-r from-white via-white to-indigo-300 bg-clip-text text-sm font-black tracking-tight text-transparent">{brand.appName}</span>
        </div>
        <LanguagePicker variant="inline" disabled={busy} />
      </header>

      <main className="relative mx-auto flex w-full max-w-lg flex-1 items-center py-8 sm:py-12">
        <section className="w-full space-y-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-md sm:p-8">
          <div className="space-y-3 text-center">
            <p className="mx-auto max-w-sm text-sm font-semibold leading-relaxed text-indigo-200">{text(language, "Descubre las habilidades, intereses y fortalezas de cada niño o niña, sin etiquetas ni barreras de idioma.")}</p>
            <div className="mb-1 inline-flex h-16 w-16 items-center justify-center rounded-3xl border border-indigo-500/40 bg-indigo-950/60 text-indigo-300 shadow-inner">
              <ShieldCheck size={30} />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">{register ? t.register : t.login}</h1>
            <p className="mx-auto max-w-sm text-xs leading-relaxed text-slate-300 sm:text-sm">{register ? t.registerHint : t.loginHint}</p>
          </div>
          <form className="space-y-5" onSubmit={async event => {
            event.preventDefault();
            try { await login(username.trim().toLowerCase(), password, register); }
            catch { /* The shared alert displays the localized API error. */ }
            finally { setPassword(''); }
          }}>
            <label className="block space-y-2 text-xs font-bold text-amber-400">
              <span className="flex items-center gap-1.5"><UserRound size={14} />{t.username}</span>
              <input className="account-field" autoComplete="username" required minLength={3} maxLength={32} pattern="[a-zA-Z0-9_\-]+" value={username} disabled={busy} onChange={event => setUsername(event.target.value)} />
            </label>
            <label className="block space-y-2 text-xs font-bold text-amber-400">
              <span className="flex items-center gap-1.5"><KeyRound size={14} />{t.password}</span>
              <input className="account-field" type="password" autoComplete={register ? 'new-password' : 'current-password'} required minLength={10} maxLength={128} value={password} disabled={busy} onChange={event => setPassword(event.target.value)} />
            </label>
            <button className="account-button flex w-full items-center justify-center gap-2" disabled={busy}>
              {register ? t.register : t.login}<ArrowRight size={16} className="rtl:rotate-180" />
            </button>
          </form>
          <div className="space-y-4 border-t border-slate-800 pt-4 text-center">
            <button className="rounded-xl px-3 py-1 text-xs font-bold text-indigo-300 transition hover:bg-indigo-500/10 hover:text-indigo-200 focus-visible:outline-2 focus-visible:outline-amber-400" disabled={busy} onClick={() => { setRegister(!register); setPassword(''); }}>
              {register ? t.login : t.register}
            </button>
            <p className="text-[11px] leading-relaxed text-slate-400">{t.noRecovery}</p>
          </div>
        </section>
      </main>
      <footer className="relative mx-auto flex max-w-2xl items-start justify-center gap-2 text-center text-[11px] leading-relaxed text-slate-500">
        <ShieldCheck size={14} className="shrink-0 text-indigo-400" /><span>{t.privacy}</span>
      </footer>
    </div>
  );
}
