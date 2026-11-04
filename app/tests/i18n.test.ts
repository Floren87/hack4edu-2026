import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { accountCatalogs } from '../src/i18n/account';
import { translations } from '../src/i18n/translations';
import { languages, messageCatalogs, localizeText, localizeEvidence } from '../src/i18n/localize';
import { generatePedagogicalAssessment } from '../src/utils/aiPedagogy';
import type { StudentProfile, ComprehensiveAssessmentReport, GameTelemetry } from '../src/types';

const parameters = (message: string) => [...message.matchAll(/\{\d+\}/g)].map(match => match[0]).sort();

test('all three namespaces have exactly the same keys, nonempty messages and valid parameters in five languages', () => {
  for (const catalog of [messageCatalogs, accountCatalogs, translations]) {
    const spanish = catalog.es as Record<string, string>;
    for (const language of languages) {
      const target = catalog[language] as Record<string, string>;
      assert.deepEqual(Object.keys(target).sort(), Object.keys(spanish).sort(), language);
      for (const [id, source] of Object.entries(spanish)) {
        assert.ok(target[id]?.trim(), `${language}: ${id}`);
        assert.deepEqual(parameters(target[id]), parameters(source), `${language}: ${id}`);
        // Long copy accidentally copied from Spanish is a regression, not a fallback.
        if (language !== 'es' && source.length > 20) assert.notEqual(target[id], source, `${language}: ${id}`);
      }
    }
  }
  for (const language of languages) assert.equal(messageCatalogs[language]['Talento sin Fronteras'], translations[language].appName);
});

test('literal message calls in components and report generators must exist in the shared catalog', () => {
  const root = fileURLToPath(new URL('../src/', import.meta.url));
  const literals = String.raw`("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')`;
  const calls = new RegExp(String.raw`\b(?:text|localizeText)\(\s*(?:language|lang|['"]es['"])\s*,\s*${literals}|\blabel\(\s*${literals}`, 'g');
  const decode = (literal: string) => literal[0] === '"' ? JSON.parse(literal) :
    literal.slice(1, -1).replace(/\\(['"\\])/g, '$1').replace(/\\n/g, '\n');
  let checked = 0;
  function scan(directory: string) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) { if (entry.name !== 'i18n') scan(file); continue; }
      if (!/\.tsx?$/.test(file)) continue;
      const source = fs.readFileSync(file, 'utf8');
      for (const match of source.matchAll(calls)) {
        const id = decode(match[1] ?? match[2]);
        const line = source.slice(0, match.index).split('\n').length;
        assert.ok(Object.hasOwn(messageCatalogs.es, id), `${file}:${line} — ${id}`);
        checked++;
      }
    }
  }
  scan(root);
  assert.ok(checked > 400, 'The source audit must cover the game, report and UI calls.');
});

test('every dynamic catalog message renders parameters once in every language', () => {
  for (const [id] of Object.entries(messageCatalogs.es).filter(([id]) => parameters(id).length)) {
    const values = ['{1} Alias original', '27', '4', '63'];
    for (const language of languages) {
      const expected = (messageCatalogs[language] as Record<string, string>)[id]
        .replace(/\{(\d+)\}/g, (_, index) => values[Number(index)]);
      assert.equal(localizeText(language, id, values), expected);
    }
  }
});

test('saved authored evidence translates across every pair of supported languages', () => {
  const evidence = [
    ['Resolvió el reto en {0} segundos tras {1} elecciones en total.', [31, 7]],
    ['Realizó {0} ajustes de masa en {1}s.', [6, 42]],
    ['Descubrió {0} de 4 constelaciones celestes ocultas.', [3]],
    ['Completó los 3 hitos de ayuda cooperativa con el robot Bobi.', []],
  ] as const;
  for (const [id, values] of evidence) for (const from of languages) for (const to of languages) {
    const saved = localizeText(from, id, values);
    assert.equal(localizeEvidence(to, saved), localizeText(to, id, values), `${from} → ${to}: ${id}`);
  }
});

test('nested authored labels translate, while opaque values and unknown notes do not', () => {
  const palette = 'Exploró la paleta "{0}" asociando color con estímulo auditivo relajante.';
  const purpose = 'Asignó propósito creativo: "{0}"';
  const sorting = 'Organizó libremente {0} objetos según criterio autoelegido ("{1}").';
  const creature = '¡Maravilloso! {0} se siente calmado/a y protegido/a.';
  for (const from of languages) for (const to of languages) {
    for (const [template, name] of [[palette, 'Aurora Mágica'], [purpose, '🚀 Transporte volador o espacial'], [creature, 'Pip, el polluelo cósmico']]) {
      const saved = localizeText(from, template, [localizeText(from, name)]);
      assert.equal(localizeEvidence(to, saved), localizeText(to, template, [localizeText(to, name)]));
    }
    assert.equal(localizeEvidence(to, localizeText(from, sorting, [6, 'textura'])),
      localizeText(to, sorting, [6, localizeText(to, 'Por textura y tacto')]));
    assert.equal(localizeEvidence(to, 'Free observation outside authored catalogs.'), 'Free observation outside authored catalogs.');
    assert.equal(localizeText(to, 'Estimada familia de {0}:', ['Creatividad']),
      (messageCatalogs[to] as Record<string, string>)['Estimada familia de {0}:'].replace('{0}', 'Creatividad'));
  }
});

const profile: StudentProfile = {
  id: 'i18n-demo', nameOrAlias: 'Demo Alias', avatar: '🦊', preferredLanguage: 'es',
  createdAt: '2026-11-04T12:00:00Z', starsCount: 0, unlockedLevels: {}, unlockedBadges: [],
  worldVisits: { build: 0, explore: 0, create: 0, help: 0, organize: 0, count: 0 }, telemetryLog: [],
  teacherValidation: { reviewed: false, agreements: {}, teacherNotes: '' },
};
function reportCopy(report: ComprehensiveAssessmentReport): string[] {
  return [
    ...report.allActivities.flatMap(a => [a.name, a.subtitle, ...(a.notesObserved ?? [])]),
    ...report.skillsPercentages.flatMap(s => [s.name, s.description, s.evidenceSummary]),
    ...report.interestsPercentages.flatMap(i => [i.name, i.description]),
    ...report.primaryInterests.flatMap(i => [i.name, i.description]),
    ...report.strengths.flatMap(s => [s.title, s.description, ...s.evidenceItems, ...s.classroomSuggestions, ...s.familyHomeTips]),
    ...Object.values(report.pedagogicalAnalysis),
    ...report.classroomRecommendations.flatMap(r => [r.headline, r.actionableDetail, r.evidenceContext]),
    report.familyLetter.greeting, report.familyLetter.positiveSummary, report.familyLetter.closing,
    ...report.familyLetter.homeActivities, ...report.neurodivergentAccommodations,
  ];
}
test('pending and completed reports translate every authored field without changing metrics or identifiers', () => {
  const games = [
    ['creativity_game', 'creativity'], ['logic_game', 'logic'], ['story_game', 'communication'], ['robot_game', 'collaboration'],
    ['world_build_tower', 'build'], ['world_explore_constellations', 'explore'], ['world_create_harmonics', 'create'],
    ['world_help_sanctuary', 'help'], ['world_organize_mandala', 'organize'], ['world_count_balance', 'count'],
  ];
  const events = games.map(([gameId, category], index) => ({
    gameId, gameType: index < 4 ? 'core_minigame' : 'world_activity',
    ...(index < 4 ? { category } : { worldId: category }), timestamp: '2026-11-04T15:00:00Z',
    durationSeconds: 31, attemptsCount: 7, originalMovesCount: 4, successRate: 1, perseveranceScore: .9,
    notesObserved: [localizeText('en', 'Resolvió el reto en {0} segundos tras {1} elecciones en total.', [31, 7])], metrics: {},
  })) as GameTelemetry[];
  for (const telemetryLog of [[], events]) {
    const student = { ...profile, telemetryLog, worldVisits: Object.fromEntries(Object.keys(profile.worldVisits).map(k => [k, telemetryLog.length ? 1 : 0])) as StudentProfile['worldVisits'] };
    const spanish = generatePedagogicalAssessment(student, 'es');
    const spanishCopy = reportCopy(spanish);
    for (const language of languages) {
      const report = generatePedagogicalAssessment(student, language);
      assert.deepEqual(report.strengthsBreakdown, spanish.strengthsBreakdown);
      assert.deepEqual(report.allActivities.map(a => [a.id, a.status, a.scorePercent]), spanish.allActivities.map(a => [a.id, a.status, a.scorePercent]));
      const copy = reportCopy(report);
      assert.equal(copy.length, spanishCopy.length);
      copy.forEach((value, index) => {
        assert.ok(value?.trim(), `${language}, field ${index}`);
        assert.ok(!/\{\d+\}/.test(value), `${language}: ${value}`);
        if (language !== 'es') assert.notEqual(value, spanishCopy[index], `${language}, field ${index}: ${value}`);
      });
    }
  }
});
