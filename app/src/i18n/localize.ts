import type { Language } from '../types';
import en from './messages/en.json' with { type: 'json' };
import fr from './messages/fr.json' with { type: 'json' };
import ar from './messages/ar.json' with { type: 'json' };
import uk from './messages/uk.json' with { type: 'json' };
import { languages } from './languages';
export { languages, locale, direction, formatDate } from './languages';

type MessageId = keyof typeof en;
type MessageCatalog = Record<MessageId, string>;
const ids = Object.keys(en) as MessageId[];
const es = Object.fromEntries(ids.map(id => [id, id])) as MessageCatalog;
export const messageCatalogs = { es, en, fr, ar, uk } satisfies Record<Language, MessageCatalog>;
const has = (object: object, key: string) => Object.hasOwn(object, key);
const interpolate = (template: string, values: readonly unknown[]) =>
  template.replace(/\{(\d+)\}/g, (placeholder, index) => index in values ? String(values[index]) : placeholder);

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const patterns = languages.flatMap(language => ids.filter(id => /\{\d+\}/.test(id)).map(id => {
  const template = messageCatalogs[language][id];
  const slots = [...template.matchAll(/\{(\d+)\}/g)].map(match => Number(match[1]));
  return {
    id, language, slots,
    weight: template.replace(/\{\d+\}/g, '').length,
    regex: new RegExp('^' + template.split(/\{\d+\}/).map(escapeRegex).join('([\\s\\S]*?)') + '$'),
  };
})).sort((a, b) => b.weight - a.weight);
const reverse = new Map<string, MessageId>();
for (const language of languages) for (const id of ids) reverse.set(messageCatalogs[language][id], id);

// These parameters contain authored catalog labels, never pseudonyms or free text.
// Other parameter values are opaque and are substituted exactly once.
const nestedLabels: Record<string, readonly number[]> = {
  'Asignó propósito creativo: "{0}"': [0],
  'Exploró la paleta "{0}" asociando color con estímulo auditivo relajante.': [0],
  'Organizó libremente {0} objetos según criterio autoelegido ("{1}").': [1],
  '¡Maravilloso! {0} se siente calmado/a y protegido/a.': [0],
};
const criteria: Record<string, string> = { textura: 'Por textura y tacto', color: 'Por color y luz', origen: 'Por origen de la naturaleza' };

function renderedMessage(language: Language, source: string, fromAnyLanguage: boolean): string {
  const exact = fromAnyLanguage ? reverse.get(source) : has(es, source) ? source as MessageId : undefined;
  if (exact) return messageCatalogs[language][exact];
  for (const pattern of patterns) {
    if (!fromAnyLanguage && pattern.language !== 'es') continue;
    const match = source.match(pattern.regex);
    if (!match) continue;
    const values: string[] = [];
    let valid = true;
    pattern.slots.forEach((slot, index) => {
      if (slot in values && values[slot] !== match[index + 1]) valid = false;
      values[slot] = match[index + 1];
    });
    if (!valid) continue;
    for (const index of nestedLabels[pattern.id] ?? []) {
      const value = values[index];
      const id = reverse.get(value) ?? criteria[value];
      if (id && has(es, id)) values[index] = messageCatalogs[language][id as MessageId];
    }
    return interpolate(messageCatalogs[language][pattern.id], values);
  }
  return source;
}

/** Translate authored copy. Spanish wording is its stable message ID. */
export function localizeText(language: Language, source: string, values: readonly unknown[] = []): string {
  if (has(es, source)) return interpolate(messageCatalogs[language][source as MessageId], values);
  return values.length ? interpolate(source, values) : renderedMessage(language, source, false);
}

/** Only for game-generated evidence: recognize saved messages in any supported language. */
export function localizeEvidence(language: Language, source: string): string {
  return renderedMessage(language, source, true);
}
