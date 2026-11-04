import React,{useState} from 'react';
import {useApp} from '../../context/AppContext';
import {ui} from '../../i18n/account';
import {translations} from '../../i18n/translations';
import {LanguagePicker} from '../auth/LoginScreen';
export function Navbar(){
 const {session,activeStudent,language,setView,logout,unlock,busy,soundMuted,toggleSound}=useApp();const t=ui(language);
 const [showUnlock,setShowUnlock]=useState(false);const [password,setPassword]=useState('');
 const child=session?.mode==='child';
 return <>
  <header className="sticky top-0 z-40 bg-slate-950 border-b border-slate-700 p-3 print:hidden">
   <div className="max-w-6xl mx-auto flex items-center flex-wrap gap-3 justify-between">
    <button className="font-bold" onClick={()=>setView(child?'child_hub':'profile_manager')}>⭐ {translations[language].appName}</button>
    {child?<span>{activeStudent?.avatar} {activeStudent?.nameOrAlias} · ⭐ {activeStudent?.starsCount??0}</span>:<nav className="flex gap-2 flex-wrap">
     <button disabled={busy} className="account-button" onClick={()=>setView('profile_manager')}>{t.students}</button>
     <button disabled={!activeStudent||busy} onClick={()=>setView('teacher_dashboard')}>{t.results}</button>
     <button disabled={!activeStudent||busy} onClick={()=>setView('family_portal')}>{t.family}</button>
    </nav>}
    <div className="flex gap-3 items-center"><LanguagePicker/>
     <button onClick={toggleSound} aria-label={t.sound}>{soundMuted?'🔇':'🔊'}</button>
     {child?<button className="text-xs text-slate-300" onClick={()=>setShowUnlock(true)}>🔒 {t.back}</button>:<button disabled={busy} onClick={()=>{void logout().catch(()=>{});}}>{t.logout}</button>}
    </div>
   </div>
  </header>
  {child&&showUnlock&&<div className="fixed inset-0 z-50 bg-black/80 grid place-items-center p-4" role="dialog" aria-modal="true" aria-label={t.back}>
   <form className="bg-slate-900 border border-slate-600 rounded-2xl p-6 max-w-sm space-y-4" onSubmit={async e=>{e.preventDefault();try{await unlock(password);setShowUnlock(false);}catch{}finally{setPassword('');}}}>
    <p>{t.unlock}</p><label className="block">{t.password}<input autoFocus required type="password" autoComplete="current-password" className="account-field" maxLength={128} value={password} onChange={e=>setPassword(e.target.value)}/></label>
    <div className="flex gap-4"><button className="account-button" disabled={busy}>{t.back}</button><button type="button" disabled={busy} onClick={()=>{setShowUnlock(false);setPassword('');}}>{t.cancel}</button></div>
   </form>
  </div>}
 </>;
}
