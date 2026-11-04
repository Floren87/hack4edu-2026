import { localizeText as text } from './i18n/localize';
import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { BadgeModal } from './components/common/BadgeModal';
import { ChildHome } from './components/child/ChildHome';
import { WorldsMap } from './components/child/WorldsMap';
import { CreativityGame } from './components/minigames/CreativityGame';
import { LogicPatternsGame } from './components/minigames/LogicPatternsGame';
import { StorytellingGame } from './components/minigames/StorytellingGame';
import { RobotCollabGame } from './components/minigames/RobotCollabGame';
import { BuildTowerZen } from './components/worldActivities/BuildTowerZen';
import { ConstellationTracker } from './components/worldActivities/ConstellationTracker';
import { ColorHarmonicsCanvas } from './components/worldActivities/ColorHarmonicsCanvas';
import { CreatureSanctuary } from './components/worldActivities/CreatureSanctuary';
import { TactileSortingMandala } from './components/worldActivities/TactileSortingMandala';
import { MagicScaleBalance } from './components/worldActivities/MagicScaleBalance';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { FamilyPortal } from './components/family/FamilyPortal';
import { ProfileManager } from './components/profiles/ProfileManager';
import { LoginScreen } from './components/auth/LoginScreen';
import { ui, errorText } from './i18n/account';

const AppContent: React.FC = () => {
  const { view, activeGameId, activeWorldId, activeStudent, session, loading, connectionError, refresh, error, setError, saveStatus, flush } = useApp();
  const { language } = useApp();

  const t = ui(language);
  const notice = error && <div role="alert" className="fixed bottom-4 inset-x-4 z-[60] bg-rose-950 border border-rose-500 p-4 rounded-2xl text-white print:hidden">{errorText(error,language)} <button onClick={()=>setError('')}>×</button></div>;
  if (loading) return <main className="min-h-screen bg-slate-950 text-white grid place-items-center" role="status">{t.loading}</main>;
  if (connectionError) return <main className="min-h-screen bg-slate-950 text-white grid place-items-center"><div><p>{t.error}</p><button className="account-button" onClick={()=>void refresh()}>{t.retry}</button></div></main>;
  if (!session) return <><LoginScreen/>{notice}</>;
  const child = session.mode === 'child';


  const renderCurrentView = () => {
    if (child && !['child_hub','worlds_map','minigame','world_activity'].includes(view)) return activeStudent ? <ChildHome/> : null;
    if (!child && (['child_hub','worlds_map','minigame','world_activity'].includes(view) || !activeStudent)) return <ProfileManager/>;
    switch (view) {
      case 'child_hub':
        return <ChildHome />;

      case 'worlds_map':
        return <WorldsMap />;

      case 'minigame':
        if (activeGameId === 'creativity_game') return <CreativityGame />;
        if (activeGameId === 'logic_game') return <LogicPatternsGame />;
        if (activeGameId === 'story_game') return <StorytellingGame />;
        if (activeGameId === 'robot_game') return <RobotCollabGame />;
        return <ChildHome />;

      case 'world_activity':
        if (activeWorldId === 'build') return <BuildTowerZen />;
        if (activeWorldId === 'explore') return <ConstellationTracker />;
        if (activeWorldId === 'create') return <ColorHarmonicsCanvas />;
        if (activeWorldId === 'help') return <CreatureSanctuary />;
        if (activeWorldId === 'organize') return <TactileSortingMandala />;
        if (activeWorldId === 'count') return <MagicScaleBalance />;
        return <WorldsMap />;

      case 'teacher_dashboard':
        return <TeacherDashboard key={activeStudent.id} />;

      case 'family_portal':
        return <FamilyPortal />;

      case 'profile_manager':
        return <ProfileManager />;

      default:
        return <ChildHome />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar />
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-end gap-2 px-3 pt-3 text-[11px] text-slate-400 sm:px-6 print:hidden" role="status"><span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${saveStatus==='saved'?'bg-emerald-400':saveStatus==='error'?'bg-rose-400':'bg-amber-400'}`} />{saveStatus==='saving'?t.saving:saveStatus==='pending'?t.pending:saveStatus==='saved'?t.saved:t.pending}
        {(saveStatus==='error'||error==='VERSION_CONFLICT')&&<><button className="underline mx-3" disabled={error==='VERSION_CONFLICT'} onClick={()=>void flush().catch(()=>{})}>{t.retry}</button><button className="underline" onClick={()=>{if(confirm(t.discard))void refresh();}}>{t.reload}</button></>}
      </div>
      {notice}

      {/* Main View Container */}
      <main className="flex-1 py-4 sm:py-6 px-3 sm:px-4">
        {renderCurrentView()}
      </main>

      {/* Subtle Accessible Footer */}
      <footer className="border-t border-slate-900 py-4 px-4 text-center text-[11px] text-slate-500 print:hidden">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>{text(language, "Talento sin Fronteras • Evaluación sin etiquetas ni barreras de idioma")}</span>

        </div>
      </footer>

      {/* Global Celebratory Badge Modal */}
      <BadgeModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
