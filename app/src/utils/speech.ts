import { Language } from '../types';

const LANG_CODE_MAP: Record<Language, string[]> = {
  es: ['es-ES', 'es-MX', 'es-US', 'es'],
  en: ['en-US', 'en-GB', 'en-CA', 'en'],
  fr: ['fr-FR', 'fr-CA', 'fr'],
  ar: ['ar-SA', 'ar-EG', 'ar'],
  uk: ['uk-UA', 'uk']
};

class SpeechManager {
  private isSpeaking: boolean = false;
  private listeners: Set<(speaking: boolean) => void> = new Set();

  subscribe(listener: (speaking: boolean) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn(this.isSpeaking));
  }

  speak(text: string, lang: Language) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    // Cancel current utterance
    window.speechSynthesis.cancel();

    if (!text || text.trim() === '') {
      this.isSpeaking = false;
      this.notify();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // slightly slower for better clarity with children & migrants
    utterance.pitch = 1.05; // warm, approachable tone

    // Find best voice match
    const voices = window.speechSynthesis.getVoices();
    const candidatePrefixes = LANG_CODE_MAP[lang] || ['en'];

    let matchedVoice = null;
    for (const prefix of candidatePrefixes) {
      matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith(prefix.toLowerCase()));
      if (matchedVoice) break;
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
      utterance.lang = matchedVoice.lang;
    } else {
      utterance.lang = candidatePrefixes[0];
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.notify();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.notify();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.notify();
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch {
      this.isSpeaking = false;
      this.notify();
    }
  }

  stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.notify();
  }

  getIsSpeaking() {
    return this.isSpeaking;
  }
}

export const speechManager = new SpeechManager();
