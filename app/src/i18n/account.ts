import type { Language } from '../types';
import es from './account/es.json' with { type: 'json' };
import en from './account/en.json' with { type: 'json' };
import fr from './account/fr.json' with { type: 'json' };
import ar from './account/ar.json' with { type: 'json' };
import uk from './account/uk.json' with { type: 'json' };

type AccountMessages = Record<keyof typeof es, string>;
// Named keys make missing translations a compile error, without positional fallbacks.
export const accountCatalogs = { es, en, fr, ar, uk } satisfies Record<Language, AccountMessages>;
export const ui = (language: Language): AccountMessages => accountCatalogs[language];

export function errorText(code: string, language: Language) {
  const t = ui(language);
  return ({
    INVALID_CREDENTIALS: t.credentials,
    USERNAME_UNAVAILABLE: t.unavailable,
    INVALID_INPUT: t.invalid,
    RATE_LIMITED: t.rate,
    VERSION_CONFLICT: t.conflict,
    PENDING: t.leave,
  } as Record<string, string>)[code] ?? t.error;
}
