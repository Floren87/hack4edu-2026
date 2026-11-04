export type Language = 'es' | 'en' | 'fr' | 'ar' | 'uk';

export type UserRole = 'child' | 'teacher' | 'family';

export type SkillCategory = 
  | 'creativity' 
  | 'logic' 
  | 'communication' 
  | 'collaboration' 
  | 'problem_solving';

export type WorldId = 
  | 'build' 
  | 'explore' 
  | 'create' 
  | 'help' 
  | 'organize' 
  | 'count';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'effort' | 'exploration' | 'resilience' | 'creativity' | 'empathy';
}

export interface GameTelemetry {
  gameId: string;
  gameType: 'core_minigame' | 'world_activity';
  category?: SkillCategory;
  worldId?: WorldId;
  timestamp: string;
  durationSeconds: number;
  attemptsCount: number;
  originalMovesCount: number;
  successRate: number; // 0 to 1
  perseveranceScore: number; // Based on retries without giving up
  notesObserved: string[];
  metrics: Record<string, number | string | boolean>;
}

export interface StudentProfile {
  id: string;
  nameOrAlias: string;
  avatar: string;
  gender?: 'male' | 'female' | 'other';
  preferredLanguage: Language;
  createdAt: string;
  age?: number;
  starsCount: number;
  unlockedLevels: Record<string, number>;
  unlockedBadges: string[];
  worldVisits: Record<WorldId, number>; // Tracks natural interest
  telemetryLog: GameTelemetry[];
  teacherValidation: {
    reviewed: boolean;
    validatedAt?: string;
    teacherNotes?: string;
    agreements: Record<string, boolean>; // strengthKey -> matches classroom observation
  };
}

export interface StrengthProfileItem {
  id: string;
  category: SkillCategory;
  title: string;
  levelDescription: 'destaca' | 'destreza_solida' | 'en_observacion';
  description: string;
  evidenceItems: string[];
  classroomSuggestions: string[];
  familyHomeTips: string[];
  confidence: 'alta' | 'moderada' | 'inicial';
}

export interface ActivityStatusItem {
  id: string;
  name: string;
  subtitle: string;
  category: SkillCategory | 'interest_world';
  worldId?: WorldId;
  type: 'core_minigame' | 'world_activity';
  icon: string;
  status: 'realizada' | 'pendiente';
  completedAt?: string;
  durationSeconds?: number;
  attemptsCount?: number;
  originalMovesCount?: number;
  scorePercent?: number; // 0 to 100%
  notesObserved?: string[];
}

export interface SkillsPercentageItem {
  category: SkillCategory;
  name: string;
  icon: string;
  percentage: number; // 0 to 100%
  status: 'evaluada' | 'pendiente';
  description: string;
  evidenceSummary: string;
}

export interface InterestsPercentageItem {
  worldId: WorldId;
  name: string;
  icon: string;
  visits: number;
  percentage: number; // 0 to 100%
  status: 'explorado' | 'pendiente';
  description: string;
}

export interface StrengthsPercentageBreakdown {
  consolidationPercentage: number; // 0 to 100%
  highlightedCount: number; // 'destaca'
  solidCount: number; // 'destreza_solida'
  observingCount: number; // 'en_observacion'
  totalItems: number;
  highlightedPct: number;
  solidPct: number;
  observingPct: number;
}

export interface PedagogicalAnalysis {
  title: string;
  overallSynthesis: string;
  interestSkillCorrelation: string;
  resilienceEvaluation: string;
  activitiesProgressSummary: string;
  classroomDifferentiationAdvice: string;
}

export interface ComprehensiveAssessmentReport {
  studentId: string;
  generatedAt: string;
  skillsPercentages: SkillsPercentageItem[];
  interestsPercentages: InterestsPercentageItem[];
  strengthsBreakdown: StrengthsPercentageBreakdown;
  pedagogicalAnalysis: PedagogicalAnalysis;
  allActivities: ActivityStatusItem[];
  completedActivities: ActivityStatusItem[];
  pendingActivities: ActivityStatusItem[];
  primaryInterests: { worldId: WorldId; name: string; visits: number; percentage: number; description: string }[];
  strengths: StrengthProfileItem[];
  classroomRecommendations: {
    id: string;
    headline: string;
    actionableDetail: string;
    evidenceContext: string;
  }[];
  familyLetter: {
    greeting: string;
    positiveSummary: string;
    homeActivities: string[];
    closing: string;
  };
  totalSessionsAnalyzed: number;
  neurodivergentAccommodations: string[];
}
