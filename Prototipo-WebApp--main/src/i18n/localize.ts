import english from './english.json';
import type { Language } from '../types';

// Spanish message IDs retain the wording of the original prototype. Only
// authored messages are translated; user aliases and professional notes stay intact.
const messages: Record<string, string> = english;
const templates = Object.entries(messages)
  .filter(([source]) => /\{\d+\}/.test(source))
  .map(([source, target]) => ({
    target,
    pattern: new RegExp('^' + source.split(/\{\d+\}/)
      .map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('([\\s\\S]*?)') + '$'),
  }));

export function localizeText(language: Language, source: string, values: unknown[] = []): string {
  let result = language === 'en' ? messages[source] ?? source : source;
  // Older local telemetry stores the rendered Spanish message, rather than its
  // template. Translate recognized authored templates when viewing that evidence.
  if (language === 'en' && !values.length && !messages[source]) {
    for (const { pattern, target } of templates) {
      const match = source.match(pattern);
      if (match) {
        result = target.replace(/\{(\d+)\}/g, (_, i) => match[Number(i) + 1] ?? '');
        break;
      }
    }
  }
  return values.length
    ? result.replace(/\{(\d+)\}/g, (_, i) => String(values[Number(i)] ?? ''))
    : result;
}

// Use only for authored catalogs/reports, never for stored student profiles.
export function localizeData<T>(value: T, language: Language): T {
  if (language !== 'en') return value;
  if (typeof value === 'string') return localizeText(language, value) as T;
  if (Array.isArray(value)) return value.map(item => localizeData(item, language)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localizeData(item, language)])) as T;
  }
  return value;
}
