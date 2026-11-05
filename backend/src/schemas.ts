import { z } from 'zod';
const id = z.string().regex(/^[a-zA-Z0-9_-]{1,64}$/);
const count = z.number().int().min(0).max(1_000_000);
const language = z.enum(['es', 'en', 'fr', 'ar', 'uk']);
const worlds = z.object({ build: count, explore: count, create: count, help: count, organize: count, count }).strict();
const telemetry = z.object({
  gameId: id, gameType: z.enum(['core_minigame', 'world_activity']),
  category: z.enum(['creativity', 'logic', 'communication', 'collaboration', 'problem_solving']).optional(),
  worldId: z.enum(['build', 'explore', 'create', 'help', 'organize', 'count']).optional(),
  timestamp: z.iso.datetime(), durationSeconds: z.number().min(0).max(86400),
  attemptsCount: count, originalMovesCount: count, successRate: z.number().min(0).max(1),
  perseveranceScore: z.number().min(0).max(1), notesObserved: z.array(z.string().max(500)).max(20),
  metrics: z.record(id, z.union([z.number(), z.string().max(500), z.boolean()])),
}).strict();
export const credentials = z.object({ username: z.string().trim().toLowerCase().regex(/^[a-z0-9_-]{3,32}$/), password: z.string().min(10).max(128) }).strict();
export const passwordInput = z.object({ password: z.string().min(1).max(128) }).strict();
export const newStudent = z.object({
  nameOrAlias: z.string().trim().min(1).max(40), avatar: z.string().min(1).max(32),
  preferredLanguage: language.default('es'), age: z.number().int().min(7).max(14).optional(),
}).strict();
export const progress = z.object({
  version: count, starsCount: count, unlockedLevels: z.record(id, count),
  unlockedBadges: z.array(id).max(20), worldVisits: worlds,
  telemetryLog: z.array(telemetry).max(500),
}).strict();
export const review = z.object({
  version: count, agreements: z.record(id, z.boolean()), teacherNotes: z.string().max(2000),
}).strict();
export const enterChild = z.object({ studentId: z.uuid() }).strict();
export type Profile = z.infer<typeof newStudent> & {
  id: string; createdAt: string; starsCount: number; unlockedLevels: Record<string, number>;
  unlockedBadges: string[]; worldVisits: z.infer<typeof worlds>; telemetryLog: z.infer<typeof telemetry>[];
  teacherValidation: { reviewed: boolean; agreements: Record<string, boolean>; teacherNotes: string; validatedAt?: string };
};
