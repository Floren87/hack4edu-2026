import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Badge, 
  GameTelemetry, 
  Language, 
  StudentProfile, 
  UserRole, 
  WorldId 
} from '../types';
import { soundManager } from '../utils/soundEffects';

export type ActiveView = 
  | 'child_hub' 
  | 'worlds_map' 
  | 'minigame' 
  | 'world_activity' 
  | 'teacher_dashboard' 
  | 'family_portal' 
  | 'passport' 
  | 'profile_manager';

export const EFFORT_BADGES: Record<string, Badge> = {
  perseverance: {
    id: 'perseverance',
    name: '💪 Gran Perseverancia',
    description: 'No te rendiste y probaste varias alternativas ante el reto.',
    icon: '💪',
    category: 'effort'
  },
  explorer: {
    id: 'explorer',
    name: '🧭 Explorador Curioso',
    description: 'Viajaste por distintos mundos para descubrir cosas nuevas.',
    icon: '🧭',
    category: 'exploration'
  },
  constant: {
    id: 'constant',
    name: '📅 Práctica Constante',
    description: 'Regresaste a jugar y pulir tus habilidades.',
    icon: '📅',
    category: 'effort'
  },
  creative: {
    id: 'creative',
    name: '🎨 Mente Original',
    description: 'Creaste combinaciones ingeniosas e inventos únicos.',
    icon: '🎨',
    category: 'creativity'
  },
  empathy: {
    id: 'empathy',
    name: '🤝 Compañero Solidario',
    description: 'Mostraste atención y cuidado hacia los demás.',
    icon: '🤝',
    category: 'empathy'
  }
};

const INITIAL_PROFILES: StudentProfile[] = [
  {
    id: 'student_1',
    nameOrAlias: 'Amira (Estudiante A)',
    avatar: '🦊',
    preferredLanguage: 'es',
    createdAt: new Date().toISOString(),
    age: 9,
    starsCount: 18,
    unlockedLevels: {
      creativity_game: 2,
      logic_game: 2,
      story_game: 2,
      robot_game: 2,
      world_build: 2,
      world_explore: 1,
      world_create: 2,
      world_help: 1,
      world_organize: 1,
      world_count: 2
    },
    unlockedBadges: ['perseverance', 'creative', 'explorer'],
    worldVisits: {
      build: 4,
      create: 5,
      explore: 2,
      help: 3,
      organize: 2,
      count: 3
    },
    telemetryLog: [
      {
        gameId: 'creativity_game',
        gameType: 'core_minigame',
        category: 'creativity',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        durationSeconds: 180,
        attemptsCount: 3,
        originalMovesCount: 5,
        successRate: 1,
        perseveranceScore: 0.9,
        notesObserved: ['Transformó paraguas y engranaje en antena parabólica exploradora', 'Ideó 3 funciones alternativas sin dudar'],
        metrics: { creativeFluency: 5, uniqueness: 'alta' }
      },
      {
        gameId: 'logic_game',
        gameType: 'core_minigame',
        category: 'logic',
        timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
        durationSeconds: 140,
        attemptsCount: 2,
        originalMovesCount: 0,
        successRate: 0.85,
        perseveranceScore: 0.8,
        notesObserved: ['Descubrió la rotación de 90 grados en la matriz visual', 'Reintentó sin frustración al fallar la primera opción'],
        metrics: { patternRecognition: 'avanzado' }
      },
      {
        gameId: 'world_build',
        gameType: 'world_activity',
        worldId: 'build',
        timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
        durationSeconds: 210,
        attemptsCount: 4,
        originalMovesCount: 4,
        successRate: 1,
        perseveranceScore: 0.95,
        notesObserved: ['Ajustó la base de la torre con piedras anchas para mayor estabilidad', 'Atención táctil a la gravedad'],
        metrics: { balanceIntuition: 'destaca' }
      }
    ],
    teacherValidation: {
      reviewed: false,
      agreements: {
        str_creativity: true,
        str_logic: true,
        str_resilience: true,
        str_collaboration: true
      },
      teacherNotes: 'En clase de arte y proyectos manuales se concentra intensamente con materiales visuales. Muy receptiva a apoyos sin texto.'
    }
  },
  {
    id: 'student_2',
    nameOrAlias: 'Mateo (Estudiante B)',
    avatar: '🐬',
    preferredLanguage: 'es',
    createdAt: new Date().toISOString(),
    age: 11,
    starsCount: 12,
    unlockedLevels: {
      creativity_game: 1,
      logic_game: 2,
      story_game: 1,
      robot_game: 2,
      world_build: 1,
      world_explore: 2,
      world_create: 1,
      world_help: 2,
      world_organize: 2,
      world_count: 1
    },
    unlockedBadges: ['explorer', 'empathy'],
    worldVisits: {
      build: 1,
      create: 1,
      explore: 3,
      help: 4,
      organize: 2,
      count: 1
    },
    telemetryLog: [
      {
        gameId: 'robot_game',
        gameType: 'core_minigame',
        category: 'collaboration',
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
        durationSeconds: 150,
        attemptsCount: 1,
        originalMovesCount: 2,
        successRate: 1,
        perseveranceScore: 0.85,
        notesObserved: ['Anticipó la necesidad de batería del robot observando sus luces parpadeantes'],
        metrics: { nonVerbalEmpathy: 'alta' }
      }
    ],
    teacherValidation: {
      reviewed: false,
      agreements: {},
      teacherNotes: ''
    }
  }
];

interface AppContextType {
  role: UserRole;
  view: ActiveView;
  language: Language;
  soundMuted: boolean;
  students: StudentProfile[];
  activeStudent: StudentProfile;
  activeGameId: string | null;
  activeWorldId: WorldId | null;
  badgeModal: Badge | null;

  setRole: (role: UserRole) => void;
  setView: (view: ActiveView, extra?: { gameId?: string; worldId?: WorldId }) => void;
  setLanguage: (lang: Language) => void;
  toggleSound: () => void;
  switchStudent: (studentId: string) => void;
  isOnboarding: boolean;
  completeOnboarding: (nameOrAlias: string, gender: 'male' | 'female' | 'other', avatar: string, preferredLang?: Language) => void;
  skipOnboarding: (targetRole?: UserRole) => void;
  openOnboarding: () => void;
  createStudent: (nameOrAlias: string, avatar: string, preferredLang?: Language, age?: number, gender?: 'male' | 'female' | 'other') => void;
  logGameTelemetry: (telemetry: Omit<GameTelemetry, 'timestamp'>) => void;
  awardBadge: (badgeId: string) => void;
  addStars: (count: number) => void;
  closeBadgeModal: () => void;
  updateTeacherValidation: (agreements: Record<string, boolean>, notes: string) => void;
  resetStudentProgress: (studentId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PROFILES = 'talento_sf_profiles_v1';
const STORAGE_KEY_ACTIVE = 'talento_sf_active_id_v1';
const STORAGE_KEY_LANG = 'talento_sf_lang_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnboarding, setIsOnboarding] = useState<boolean>(true);
  const [role, setRoleState] = useState<UserRole>('child');
  const [view, setViewState] = useState<ActiveView>('child_hub');
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_LANG);
      if (saved && ['es', 'en', 'fr', 'ar', 'uk'].includes(saved)) {
        return saved as Language;
      }
    }
    return 'es';
  });
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [activeWorldId, setActiveWorldId] = useState<WorldId | null>(null);
  const [badgeModal, setBadgeModal] = useState<Badge | null>(null);

  const [students, setStudents] = useState<StudentProfile[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_PROFILES);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_PROFILES;
  });

  const [activeStudentId, setActiveStudentId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE);
      if (saved) return saved;
    }
    return INITIAL_PROFILES[0].id;
  });

  // Save to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(students));
    }
  }, [students]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_ACTIVE, activeStudentId);
    }
  }, [activeStudentId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_LANG, language);
      // Set document dir for Arabic RTL
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  const activeStudent = students.find(s => s.id === activeStudentId) || students[0];

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'child') {
      setViewState('child_hub');
    } else if (newRole === 'teacher') {
      setViewState('teacher_dashboard');
    } else if (newRole === 'family') {
      setViewState('family_portal');
    }
  };

  const setView = (newView: ActiveView, extra?: { gameId?: string; worldId?: WorldId }) => {
    if (extra?.gameId !== undefined) setActiveGameId(extra.gameId);
    if (extra?.worldId !== undefined) {
      setActiveWorldId(extra.worldId);
      // Increment world visit telemetry for interests (R2)
      if (extra.worldId && activeStudent) {
        setStudents(prev => prev.map(s => {
          if (s.id !== activeStudent.id) return s;
          const currentVisits = s.worldVisits[extra.worldId!] || 0;
          return {
            ...s,
            worldVisits: {
              ...s.worldVisits,
              [extra.worldId!]: currentVisits + 1
            }
          };
        }));
      }
    }
    setViewState(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleSound = () => {
    setSoundMuted(prev => {
      const next = !prev;
      soundManager.setMuted(next);
      return next;
    });
  };

  const switchStudent = (studentId: string) => {
    const found = students.find(s => s.id === studentId);
    if (found) {
      setActiveStudentId(studentId);
      if (found.preferredLanguage) {
        setLanguageState(found.preferredLanguage);
      }
      soundManager.playPop();
    }
  };

  const createStudent = (
    nameOrAlias: string, 
    avatar: string, 
    preferredLang?: Language, 
    age = 9, 
    gender?: 'male' | 'female' | 'other'
  ) => {
    const newStudent: StudentProfile = {
      id: `student_${Date.now()}`,
      nameOrAlias: nameOrAlias.trim() || 'Nuevo Explorador',
      avatar: avatar || '🦊',
      gender: gender || 'other',
      preferredLanguage: preferredLang || language,
      createdAt: new Date().toISOString(),
      age,
      starsCount: 0,
      unlockedLevels: {
        creativity_game: 1,
        logic_game: 1,
        story_game: 1,
        robot_game: 1,
        world_build: 1,
        world_explore: 1,
        world_create: 1,
        world_help: 1,
        world_organize: 1,
        world_count: 1
      },
      unlockedBadges: [],
      worldVisits: {
        build: 0,
        explore: 0,
        create: 0,
        help: 0,
        organize: 0,
        count: 0
      },
      telemetryLog: [],
      teacherValidation: {
        reviewed: false,
        agreements: {},
        teacherNotes: ''
      }
    };
    setStudents(prev => [...prev, newStudent]);
    setActiveStudentId(newStudent.id);
    soundManager.playSparkle();
  };

  const completeOnboarding = (
    nameOrAlias: string, 
    gender: 'male' | 'female' | 'other', 
    avatar: string, 
    preferredLang?: Language
  ) => {
    if (preferredLang) {
      setLanguageState(preferredLang);
    }
    createStudent(nameOrAlias, avatar, preferredLang || language, 9, gender);
    setIsOnboarding(false);
    setRoleState('child');
    setViewState('child_hub');
  };

  const skipOnboarding = (targetRole: UserRole = 'child') => {
    setIsOnboarding(false);
    setRole(targetRole);
  };

  const openOnboarding = () => {
    setIsOnboarding(true);
  };

  const logGameTelemetry = (telemetryData: Omit<GameTelemetry, 'timestamp'>) => {
    const record: GameTelemetry = {
      ...telemetryData,
      timestamp: new Date().toISOString()
    };

    setStudents(prev => prev.map(s => {
      if (s.id !== activeStudent.id) return s;
      const updatedLog = [record, ...s.telemetryLog];
      
      // Auto-unlock effort badges based on real behavior (R1 bis)
      const newBadges = [...s.unlockedBadges];

      // Perseverance badge: retried or stayed > 90s
      if (record.perseveranceScore >= 0.7 && !newBadges.includes('perseverance')) {
        newBadges.push('perseverance');
        setBadgeModal(EFFORT_BADGES.perseverance);
      }

      // Explorer badge: played at least 3 distinct games/worlds
      const distinctGames = new Set(updatedLog.map(l => l.gameId)).size;
      if (distinctGames >= 3 && !newBadges.includes('explorer')) {
        newBadges.push('explorer');
        setBadgeModal(EFFORT_BADGES.explorer);
      }

      // Creative badge
      if (record.originalMovesCount >= 3 && !newBadges.includes('creative')) {
        newBadges.push('creative');
        setBadgeModal(EFFORT_BADGES.creative);
      }

      // Empathy badge
      if (record.category === 'collaboration' && !newBadges.includes('empathy')) {
        newBadges.push('empathy');
        setBadgeModal(EFFORT_BADGES.empathy);
      }

      // Dedication / Constant badge
      if (updatedLog.length >= 5 && !newBadges.includes('constant')) {
        newBadges.push('constant');
        setBadgeModal(EFFORT_BADGES.constant);
      }

      return {
        ...s,
        telemetryLog: updatedLog,
        unlockedBadges: newBadges
      };
    }));
  };

  const awardBadge = (badgeId: string) => {
    const badge = EFFORT_BADGES[badgeId];
    if (badge && !activeStudent.unlockedBadges.includes(badgeId)) {
      setStudents(prev => prev.map(s => {
        if (s.id !== activeStudent.id) return s;
        return {
          ...s,
          unlockedBadges: [...s.unlockedBadges, badgeId]
        };
      }));
      setBadgeModal(badge);
      soundManager.playSparkle();
    }
  };

  const addStars = (count: number) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== activeStudent.id) return s;
      return {
        ...s,
        starsCount: (s.starsCount || 0) + count
      };
    }));
    soundManager.playChime(659.25);
  };

  const closeBadgeModal = () => {
    setBadgeModal(null);
  };

  const updateTeacherValidation = (agreements: Record<string, boolean>, notes: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== activeStudent.id) return s;
      return {
        ...s,
        teacherValidation: {
          reviewed: true,
          validatedAt: new Date().toISOString(),
          agreements,
          teacherNotes: notes
        }
      };
    }));
  };

  const resetStudentProgress = (studentId: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      return {
        ...s,
        starsCount: 0,
        telemetryLog: [],
        unlockedBadges: [],
        worldVisits: { build: 0, explore: 0, create: 0, help: 0, organize: 0, count: 0 },
        teacherValidation: { reviewed: false, agreements: {}, teacherNotes: '' }
      };
    }));
  };

  return (
    <AppContext.Provider
      value={{
        role,
        view,
        language,
        soundMuted,
        students,
        activeStudent,
        activeGameId,
        activeWorldId,
        badgeModal,
        setRole,
        setView,
        setLanguage,
        toggleSound,
        switchStudent,
        createStudent,
        logGameTelemetry,
        awardBadge,
        addStars,
        closeBadgeModal,
        updateTeacherValidation,
        resetStudentProgress,
        isOnboarding,
        completeOnboarding,
        skipOnboarding,
        openOnboarding
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
