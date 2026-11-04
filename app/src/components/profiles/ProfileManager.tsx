import React,{useState} from 'react';
import {useApp} from '../../context/AppContext';
import {ui} from '../../i18n/account';
import type {Language,StudentProfile} from '../../types';
export function ProfileManager(){
 const {students,activeStudent,switchStudent,setView,language,saveStudent,deleteStudent,startPlaying,busy}=useApp();const t=ui(language);
 const [form,setForm]=useState<{id?:string;nameOrAlias:string;avatar:string;age:number;preferredLanguage:Language}|null>(null);
 const edit=(s?:StudentProfile)=>setForm({id:s?.id,nameOrAlias:s?.nameOrAlias??'',avatar:s?.avatar??'🦊',age:s?.age??9,preferredLanguage:s?.preferredLanguage??language});
 return <section className="max-w-5xl mx-auto space-y-6 p-4">
  <div className="flex justify-between gap-3 items-center"><h1 className="text-2xl font-bold">{t.students}</h1><button className="account-button" disabled={busy} onClick={()=>edit()}>{t.newStudent}</button></div>
  <p className="text-sm text-slate-400">{t.privacy}</p>
  {form&&<form className="rounded-2xl border border-indigo-500 bg-slate-900 p-5 space-y-4" onSubmit={async e=>{e.preventDefault();const {id,...input}=form;try{await saveStudent(input,id);setForm(null);}catch{}}}>
   <label className="block">{t.alias}<input className="account-field" autoFocus required maxLength={40} value={form.nameOrAlias} onChange={e=>setForm({...form,nameOrAlias:e.target.value})}/></label>
   <div className="grid sm:grid-cols-3 gap-4"><label>{t.avatar}<select className="account-field" value={form.avatar} onChange={e=>setForm({...form,avatar:e.target.value})}>{['🦊','🐬','🦁','🐼','🦉','🦋','🐢','🐨','🐾','🌟'].map(a=><option key={a}>{a}</option>)}</select></label>
   <label>{t.age}<input className="account-field" type="number" min={7} max={14} required value={form.age} onChange={e=>setForm({...form,age:Number(e.target.value)})}/></label>
   <label>{t.language}<select className="account-field" value={form.preferredLanguage} onChange={e=>setForm({...form,preferredLanguage:e.target.value as Language})}>{['es','en','fr','ar','uk'].map(l=><option key={l}>{l}</option>)}</select></label></div>
   <div className="flex gap-4"><button className="account-button" disabled={busy}>{t.save}</button><button type="button" disabled={busy} onClick={()=>setForm(null)}>{t.cancel}</button></div>
  </form>}
  {!students.length&&<p className="bg-slate-900 rounded-2xl p-8">{t.empty}</p>}
  <div className="grid sm:grid-cols-2 gap-5">{students.map(s=><article className="bg-slate-900 border border-slate-700 p-5 rounded-2xl space-y-4" key={s.id}>
   <h2 className="text-xl font-bold">{s.avatar} {s.nameOrAlias}</h2><p className="text-sm text-slate-400">⭐ {s.starsCount} · 🎮 {s.telemetryLog.length}</p>
   <div className="flex gap-4 flex-wrap">
    <button disabled={busy} onClick={()=>{switchStudent(s.id);setView('teacher_dashboard');}}>{t.results}</button>
    <button className="account-button" disabled={busy} onClick={()=>{void startPlaying(s.id).catch(()=>{});}}>{t.play}</button>
    <button disabled={busy} onClick={()=>edit(s)}>{t.edit}</button>
    <button className="text-rose-300" disabled={busy} onClick={()=>{if(confirm(t.deleteConfirm))void deleteStudent(s.id).catch(()=>{});}}>{t.remove}</button>
   </div>
  </article>)}</div>
 </section>;
}
