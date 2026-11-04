import { test } from 'node:test';
import assert from 'node:assert/strict';
import { localizeText } from '../src/i18n/localize';
import { generatePedagogicalAssessment } from '../src/utils/aiPedagogy';
import { printableReportHtml } from '../src/utils/printReport';
import type { StudentProfile, GameTelemetry } from '../src/types';

const profile: StudentProfile = {
  id: 'test-fox', nameOrAlias: '<script>example</script>', avatar: '🦊', preferredLanguage: 'es',
  createdAt: '2026-11-04T12:00:00Z', starsCount: 0, unlockedLevels: {}, unlockedBadges: [],
  worldVisits: { build: 0, explore: 0, create: 0, help: 0, organize: 0, count: 0 }, telemetryLog: [],
  teacherValidation: { reviewed: false, agreements: {}, teacherNotes: '<img src=x onerror=example()>' },
};
const event = (timestamp: string, successRate: number): GameTelemetry => ({
  gameId: 'logic_game', gameType: 'core_minigame', category: 'logic', timestamp,
  durationSeconds: 10, attemptsCount: 2, originalMovesCount: 0, successRate, perseveranceScore: 0.8,
  notesObserved: ['Resolvió el reto en 10 segundos tras 2 elecciones en total.'], metrics: {},
});

test('templates translate saved Spanish evidence and preserve parameter values', () => {
  assert.equal(localizeText('en', 'Resolvió el reto en 10 segundos tras 2 elecciones en total.'),
    'Solved the challenge in 10 seconds with 2 choices in total.');
  assert.equal(localizeText('en', '¿Reiniciar progreso de juego para {0}?', ['{1} Zorro']), 'Reset game progress for {1} Zorro?');
  assert.equal(localizeText('es', '¿Reiniciar progreso de juego para {0}?', ['Fox']), '¿Reiniciar progreso de juego para Fox?');
  assert.equal(localizeText('en', 'A professional note written in another language.'), 'A professional note written in another language.');
});

test('empty profiles stay pending; newest activity is independent of event order', () => {
  const empty = generatePedagogicalAssessment(profile, 'en');
  assert.equal(empty.completedActivities.length, 0);
  assert.equal(empty.pendingActivities.length, 10);
  assert.ok(empty.allActivities.every(activity => activity.status === 'pendiente'));
  const newer = event('2026-11-04T15:00:00Z', 1);
  const older = event('2026-11-03T15:00:00Z', 0.5);
  for (const telemetryLog of [[newer, older], [older, newer]]) {
    const report = generatePedagogicalAssessment({ ...profile, telemetryLog }, 'en');
    const logic = report.completedActivities.find(activity => activity.category === 'logic')!;
    assert.equal(logic.completedAt, newer.timestamp);
    assert.equal(logic.scorePercent, 100);
    assert.equal(logic.name, 'Patterns and Sequences');
    assert.ok(logic.notesObserved?.every(note => note.startsWith('Solved the challenge')));
  }
});

test('both printable audiences use the selected language and escape user input', () => {
  for (const language of ['es', 'en'] as const) {
    const report = generatePedagogicalAssessment(profile, language);
    for (const audience of ['teacher', 'family'] as const) {
      const html = printableReportHtml(profile, report, language, audience);
      assert.ok(html.includes(`<html lang="${language}">`));
      assert.ok(html.includes('&lt;script&gt;example&lt;/script&gt;'));
      assert.ok(!html.includes('<script>example</script>'));
      assert.ok(!html.includes('<img src=x'));
      if (audience === 'teacher') assert.ok(html.includes('&lt;img src=x onerror=example()&gt;'));
    }
  }
});
