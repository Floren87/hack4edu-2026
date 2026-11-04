import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ui } from '../../i18n/account';
import { translations } from '../../i18n/translations';
export function LanguagePicker() {
 const {language,setLanguage}=useApp(); const t=ui(language);
 return <select className="account-field account-language" aria-label={t.language} value={language} onChange={e=>setLanguage(e.target.value as typeof language)}>
  <option value="es">Español</option><option value="en">English</option><option value="fr">Français</option><option value="ar">العربية</option><option value="uk">Українська</option>
 </select>;
}
export function LoginScreen() {
 const {language,login,busy}=useApp();const t=ui(language);const [register,setRegister]=useState(false);const [username,setUsername]=useState('');const [password,setPassword]=useState('');
 return <main className="min-h-screen grid place-items-center p-4 bg-slate-950 text-white">
  <section className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-6 space-y-5">
   <div className="flex flex-wrap justify-between items-center gap-3"><span className="font-bold">⭐ {translations[language].appName}</span><LanguagePicker/></div>
   <h1 className="text-2xl font-bold">{register?t.register:t.login}</h1><p className="text-sm text-slate-300">{register?t.registerHint:t.loginHint}</p>
   <form className="space-y-4" onSubmit={async e=>{e.preventDefault();try{await login(username.trim().toLowerCase(),password,register);}catch{}finally{setPassword('');}}}>
    <label className="block">{t.username}<input className="account-field" autoComplete="username" required minLength={3} maxLength={32} pattern="[a-zA-Z0-9_-]+" value={username} onChange={e=>setUsername(e.target.value)}/></label>
    <label className="block">{t.password}<input className="account-field" type="password" autoComplete={register?'new-password':'current-password'} required minLength={10} maxLength={128} value={password} onChange={e=>setPassword(e.target.value)}/></label>
    <button className="account-button w-full" disabled={busy}>{register?t.register:t.login}</button>
   </form>
   <button className="underline text-indigo-300" disabled={busy} onClick={()=>{setRegister(!register);setPassword('');}}>{register?t.login:t.register}</button>
   <p className="text-xs text-slate-400">{t.noRecovery}</p>
  </section>
 </main>;
}
