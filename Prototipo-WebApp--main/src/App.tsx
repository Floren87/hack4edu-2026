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
import { WelcomeEntryScreen } from './components/onboarding/WelcomeEntryScreen';

const AppContent: React.FC = () => {
  const { view, activeGameId, activeWorldId, isOnboarding } = useApp();

  if (isOnboarding) {
    return <WelcomeEntryScreen />;
  }

  const renderCurrentView = () => {
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
        return <TeacherDashboard />;

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

      {/* Main View Container */}
      <main className="flex-1 py-4 sm:py-6 px-3 sm:px-4">
        {renderCurrentView()}
      </main>

      {/* Subtle Accessible Footer */}
      <footer className="border-t border-slate-900 py-4 px-4 text-center text-[11px] text-slate-500 print:hidden">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Talento sin Fronteras • Evaluación sin etiquetas ni barreras de idioma</span>
          <span className="text-slate-600">Listo para PWA y despliegue estático en GitHub Pages (HTML/CSS/JS)</span>
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
