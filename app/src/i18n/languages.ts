import type { Language } from '../types';

// Native language names are intentionally unchanged by the selected UI language.
export const LANGUAGES: { id: Language; name: string; flag: string }[] = [
  { id: 'es', name: 'Español', flag: '🇪🇸' },
  { id: 'en', name: 'English', flag: '🇬🇧' },
  { id: 'fr', name: 'Français', flag: '🇫🇷' },
  { id: 'ar', name: 'العربية', flag: '🇸🇦' },
  { id: 'uk', name: 'Українська', flag: '🇺🇦' },
];
export const languages = LANGUAGES.map(language => language.id);
export const locale: Record<Language, string> = { es: 'es-ES', en: 'en-GB', fr: 'fr-FR', ar: 'ar', uk: 'uk-UA' };
export const direction = (language: Language) => language === 'ar' ? 'rtl' : 'ltr';
export const formatDate = (language: Language, value: string) => new Date(value).toLocaleDateString(locale[language]);
