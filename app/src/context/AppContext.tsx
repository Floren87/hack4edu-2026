import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { Badge, GameTelemetry, Language, StudentProfile, UserRole, WorldId } from '../types';
import { soundManager } from '../utils/soundEffects';
import { speechManager } from '../utils/speech';
import { translations } from '../i18n/translations';
import { localizeEvidence, languages, direction } from '../i18n/localize';
import { api, ApiError, setCsrfToken } from '../utils/api';
export type ActiveView = 'child_hub' | 'worlds_map' | 'minigame' | 'world_activity' | 'teacher_dashboard' | 'family_portal' | 'passport' | 'profile_manager';
export const EFFORT_BADGES: Record<string, Badge> = {
 perseverance: { id: 'perseverance', name: '💪 Gran Perseverancia', description: 'No te rendiste y probaste varias alternativas ante el reto.', icon: '💪', category: 'effort' },
 explorer: { id: 'explorer', name: '🧭 Explorador Curioso', description: 'Viajaste por distintos mundos para descubrir cosas nuevas.', icon: '🧭', category: 'exploration' },
 constant: { id: 'constant', name: '📅 Práctica Constante', description: 'Regresaste a jugar y pulir tus habilidades.', icon: '📅', category: 'effort' },
 creative: { id: 'creative', name: '🎨 Mente Original', description: 'Creaste combinaciones ingeniosas e inventos únicos.', icon: '🎨', category: 'creativity' },
 empathy: { id: 'empathy', name: '🤝 Compañero Solidario', description: 'Mostraste atención y cuidado hacia los demás.', icon: '🤝', category: 'empathy' },
};
interface Session { account: { id: string; username: string }; mode: 'professional' | 'child'; studentId: string | null; csrfToken: string }
interface Envelope { student: StudentProfile; version: number }
function gameState(s: StudentProfile) {
 return { starsCount: s.starsCount, unlockedLevels: s.unlockedLevels, unlockedBadges: s.unlockedBadges, worldVisits: s.worldVisits, telemetryLog: s.telemetryLog };
}
function useModel() {
 const [session, setSession] = useState<Session | null>(null);
 const sessionRef = useRef<Session | null>(null);
 const [loading, setLoading] = useState(true);
 const [connectionError, setConnectionError] = useState(false);
 const [busy, setBusy] = useState(false);
 const [error, setError] = useState('');
 const [saveStatus, setSaveStatus] = useState<'saved' | 'pending' | 'saving' | 'error'>('saved');
 const [language, setLanguage] = useState<Language>(() => {
  const saved = localStorage.getItem('talento_sf_lang_v1');
  return languages.includes(saved as Language) ? saved as Language : 'es';
 });
 const [students, setStudents] = useState<StudentProfile[]>([]);
 const data = useRef<StudentProfile[]>([]);
 const versions = useRef<Record<string, number>>({});
 const [activeId, setActiveId] = useState('');
 const activeRef = useRef('');
 const [view, setViewState] = useState<ActiveView>('profile_manager');
 const [activeGameId, setActiveGameId] = useState<string | null>(null);
 const [activeWorldId, setActiveWorldId] = useState<WorldId | null>(null);
 const [badgeModal, setBadgeModal] = useState<Badge | null>(null);
 const [soundMuted, setSoundMuted] = useState(false);
 const pending = useRef(new Map<string, StudentProfile>());
 const running = useRef<Promise<void> | null>(null);
 const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
 const channel = useRef<BroadcastChannel | null>(null);
 const generation = useRef(0);
 const putStudents = (next: StudentProfile[]) => { data.current = next; setStudents(next); };
 const select = (id: string) => { activeRef.current = id; setActiveId(id); };
 const notify = () => channel.current?.postMessage('session');
 const activeStudent = students.find(s => s.id === activeId) ?? students[0];
 async function refresh() {
  const gen = ++generation.current;
  setLoading(true); setConnectionError(false); setError(''); setBadgeModal(null);
  pending.current.clear(); if (timer.current) clearTimeout(timer.current);
  putStudents([]); versions.current = {}; setSaveStatus('saved');
  try {
   const next = await api<Session>('/auth/me');
   if (gen !== generation.current) return;
   setCsrfToken(next.csrfToken);
   const rows = next.mode === 'professional'
    ? (await api<{ students: Envelope[] }>('/students')).students
    : [await api<Envelope>(`/students/${next.studentId}`)];
   if (gen !== generation.current) return;
   sessionRef.current = next; setSession(next);
   putStudents(rows.map(r => r.student)); versions.current = Object.fromEntries(rows.map(r => [r.student.id, r.version]));
   select(next.mode === 'child' ? next.studentId! : rows[0]?.student.id ?? '');
   if(next.mode==='child' && rows[0])setLanguage(rows[0].student.preferredLanguage);
   setViewState(next.mode === 'child' ? 'child_hub' : 'profile_manager');
  } catch (e) {
   if (gen !== generation.current) return;
   sessionRef.current = null; setSession(null); setCsrfToken('');
   if (!(e instanceof ApiError && e.status === 401)) setConnectionError(true);
  } finally { if (gen === generation.current) setLoading(false); }
 }
 useEffect(() => {
  // Discard only the legacy local demo's profile copies, never import them into an account.
  localStorage.removeItem('talento_sf_profiles_v1'); localStorage.removeItem('talento_sf_active_id_v1');
  void refresh();
  channel.current = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('talento-session') : null;
  const sync = () => { void refresh(); };
  if (channel.current) channel.current.onmessage = sync;
  const focus = async () => { if(!sessionRef.current || pending.current.size || running.current) return; try { const current=await api<Session>('/auth/me'); if(current.mode!==sessionRef.current?.mode || current.account.id!==sessionRef.current?.account.id || current.studentId!==sessionRef.current?.studentId) await refresh(); } catch(e) { if(e instanceof ApiError && e.status===401) await refresh(); } };
  window.addEventListener('session-invalid', sync); window.addEventListener('focus', focus);
  const unload = (e: BeforeUnloadEvent) => { if (pending.current.size || running.current) { e.preventDefault(); e.returnValue = ''; } };
  window.addEventListener('beforeunload', unload);
  return () => { generation.current++; channel.current?.close(); if(timer.current) clearTimeout(timer.current); window.removeEventListener('session-invalid',sync); window.removeEventListener('focus',focus); window.removeEventListener('beforeunload',unload); };
 }, []);
 useEffect(() => { localStorage.setItem('talento_sf_lang_v1', language); document.documentElement.lang = language; document.documentElement.dir = direction(language); document.title = translations[language].appName; speechManager.stop(); }, [language]);
 function code(e: unknown) { return e instanceof ApiError ? e.code : 'NETWORK'; }
 async function action<T>(work: () => Promise<T>): Promise<T> {
  setBusy(true); setError('');
  try { return await work(); } catch(e) { setError(code(e)); throw e; } finally { setBusy(false); }
 }
 async function flush(): Promise<void> {
  if (timer.current) clearTimeout(timer.current);
  if (running.current) { await running.current; if (pending.current.size) return flush(); return; }
  const gen = generation.current;
  const job = (async () => {
   while (pending.current.size && gen === generation.current) {
    const [id, snapshot] = pending.current.entries().next().value!;
    pending.current.delete(id); setSaveStatus('saving');
    try {
     const result = await api<{version: number}>(`/students/${id}/progress`, 'PUT', { ...gameState(snapshot), version: versions.current[id] });
     if (gen !== generation.current) return;
     versions.current[id] = result.version;
    } catch(e) {
     if (gen === generation.current) { if (!pending.current.has(id)) pending.current.set(id, snapshot); setSaveStatus('error'); setError(code(e)); }
     throw e;
    }
   }
   if(gen === generation.current) { setSaveStatus('saved'); setError(''); }
  })();
  running.current = job;
  try { await job; } finally { if(running.current === job) running.current = null; }
 }
 function mutate(update: (student: StudentProfile) => StudentProfile) {
  if (sessionRef.current?.mode !== 'child') return;
  const id = activeRef.current;
  const next = data.current.map(s => s.id === id ? update(s) : s);
  const s = next.find(s => s.id === id); if(!s) return;
  s.teacherValidation = { reviewed: false, agreements: {}, teacherNotes: '' };
  putStudents(next); pending.current.set(id,s); setSaveStatus('pending');
  if(timer.current) clearTimeout(timer.current);
  timer.current = setTimeout(() => { void flush().catch(()=>{}); }, 350);
 }
 async function loadStudent(id: string) {
  const row = await api<Envelope>(`/students/${id}`);
  versions.current[id] = row.version;
  putStudents(data.current.map(s => s.id === id ? row.student : s));
 }
 async function startPlaying(id: string) { await action(async()=>{
  await flush(); await api('/mode/child', 'POST', {studentId:id}); notify(); await refresh();
 }); }
 async function unlock(password: string) { await action(async()=>{ await flush(); await api('/mode/professional','POST',{password}); notify(); await refresh(); }); }
 async function login(username: string,password: string,register: boolean) { await action(async()=>{
  if(register) await api('/auth/register','POST',{username,password});
  const next = await api<Session>('/auth/login','POST',{username,password}); setCsrfToken(next.csrfToken); notify(); await refresh();
 }); }
 async function logout() { await action(async()=>{ await flush(); await api('/auth/logout','POST',{}); notify(); await refresh(); }); }
 async function saveStudent(input: {nameOrAlias:string;avatar:string;preferredLanguage:Language;age:number}, id?: string) { await action(async()=>{
  await flush();
  if(id) { const result = await api<{version:number}>(`/students/${id}`, 'PUT', {...input,version:versions.current[id]}); versions.current[id] = result.version; await loadStudent(id); }
  else { const row = await api<Envelope>('/students','POST',input); versions.current[row.student.id] = row.version; putStudents([...data.current,row.student]); select(row.student.id); }
 }); }
 async function deleteStudent(id: string) { await action(async()=>{ await flush(); await api(`/students/${id}`,'DELETE'); putStudents(data.current.filter(s=>s.id!==id)); if(activeRef.current===id)select(data.current[0]?.id??''); setViewState('profile_manager'); }); }
 async function updateTeacherValidation(agreements:Record<string,boolean>,notes:string) { await action(async()=>{
  await flush(); const id=activeRef.current;
  const result=await api<{version:number}>(`/students/${id}/review`,'PUT',{version:versions.current[id],agreements,teacherNotes:notes}); versions.current[id]=result.version; await loadStudent(id);
 }); }
 function setView(next: ActiveView, extra?:{gameId?:string;worldId?:WorldId}) {
  const childViews: ActiveView[]=['child_hub','worlds_map','minigame','world_activity'];
  if(!sessionRef.current || (sessionRef.current.mode==='child') !== childViews.includes(next)) return;
  if(extra?.gameId)setActiveGameId(extra.gameId);
  if(extra?.worldId){setActiveWorldId(extra.worldId);mutate(s=>({...s,worldVisits:{...s.worldVisits,[extra.worldId!]:s.worldVisits[extra.worldId!]+1}}));}
  setViewState(next); window.scrollTo(0,0);
 }
 function switchStudent(id:string) { if(sessionRef.current?.mode!=='professional')return; if(pending.current.size||running.current){setError('PENDING');return;} select(id);setBadgeModal(null); }
 function logGameTelemetry(event: Omit<GameTelemetry,'timestamp'>) { mutate(s=>{
  // Persist authored observations canonically, so the report language can change later.
  const record={...event,notesObserved:event.notesObserved.map(note=>localizeEvidence('es',note)),timestamp:new Date().toISOString()}; const telemetryLog=[record,...s.telemetryLog]; const badges=[...s.unlockedBadges];
  const award=(id:string,condition:boolean)=>{if(condition&&!badges.includes(id)){badges.push(id);setBadgeModal(EFFORT_BADGES[id]);}};
  award('perseverance',event.perseveranceScore>=.7); award('explorer',new Set(telemetryLog.map(t=>t.gameId)).size>=3); award('creative',event.originalMovesCount>=3); award('empathy',event.category==='collaboration');award('constant',telemetryLog.length>=5);
  return {...s,telemetryLog,unlockedBadges:badges};
 }); }
 return { session,loading,connectionError,busy,error,setError,saveStatus,refresh,flush,login,logout,startPlaying,unlock,saveStudent,deleteStudent,
  language,setLanguage,students,activeStudent,view,setView,activeGameId,activeWorldId,badgeModal,closeBadgeModal:()=>setBadgeModal(null),
  soundMuted,toggleSound:()=>setSoundMuted(m=>{soundManager.setMuted(!m);return !m;}),switchStudent,logGameTelemetry,updateTeacherValidation,
  addStars:(count:number)=>mutate(s=>({...s,starsCount:s.starsCount+count})),
  awardBadge:(id:string)=>mutate(s=>({...s,unlockedBadges:s.unlockedBadges.includes(id)?s.unlockedBadges:[...s.unlockedBadges,id]})),
  role: (session?.mode==='child'?'child':'teacher') as UserRole,
  setRole:(role:UserRole)=>{ if(sessionRef.current?.mode==='professional'&&role!=='child')setView(role==='family'?'family_portal':'teacher_dashboard'); },
 };
}
const AppContext=createContext<ReturnType<typeof useModel>|undefined>(undefined);
export function AppProvider({children}:{children:React.ReactNode}) { const model=useModel();return <AppContext.Provider value={model}>{children}</AppContext.Provider>; }
export function useApp(){ const context=useContext(AppContext);if(!context)throw new Error('AppProvider required');return context; }
