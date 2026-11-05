import React, { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown, Globe2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ui } from '../../i18n/account';
import { soundManager } from '../../utils/soundEffects';
import type { Language } from '../../types';
import { LANGUAGES } from '../../i18n/languages';

interface Props {
  variant?: 'menu' | 'inline';
  value?: Language;
  onChange?: (language: Language) => void;
  disabled?: boolean;
}

// Shared visual control for the UI language and the student's preferred language.
// A controlled value changes the form only; it never switches the whole UI.
export function LanguagePicker({ variant = 'menu', value, onChange, disabled = false }: Props) {
  const { language, setLanguage } = useApp();
  const selected = value ?? language;
  const label = ui(language).language;
  const current = LANGUAGES.find(item => item.id === selected)!;
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    root.current?.querySelector<HTMLButtonElement>('[role="menuitemradio"][aria-checked="true"]')?.focus();
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [open]);

  const choose = (next: Language) => {
    soundManager.playPop();
    (onChange ?? setLanguage)(next);
    setOpen(false);
    if (variant === 'menu') trigger.current?.focus();
  };

  if (variant === 'inline') {
    return (
      <div role="group" aria-label={label} className="inline-flex max-w-full flex-wrap items-center gap-1 rounded-2xl border border-slate-800 bg-slate-900 p-1">
        {LANGUAGES.map(item => (
          <button
            key={item.id} type="button" disabled={disabled}
            aria-label={item.name} aria-pressed={selected === item.id}
            title={item.name} onClick={() => choose(item.id)}
            className={`flex min-h-9 items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 ${selected === item.id
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <span className="uppercase">{item.id}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={root} className="relative shrink-0" onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
    }}>
      <button
        ref={trigger} type="button" disabled={disabled}
        aria-label={`${label}: ${current.name}`} aria-haspopup="menu" aria-expanded={open}
        aria-controls={open ? menuId : undefined} onClick={() => setOpen(!open)}
        onKeyDown={event => { if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setOpen(true); } }}
        className={`flex h-9 items-center gap-1.5 rounded-xl border bg-slate-900 px-2.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 ${open ? 'border-indigo-500 text-indigo-200' : 'border-slate-800 text-slate-300 hover:border-slate-600'}`}
      >
        <Globe2 size={14} className="text-indigo-400" /><span className="uppercase">{selected}</span><ChevronDown size={12} />
      </button>
      {open && (
        <div
          id={menuId} role="menu" aria-label={label}
          className="absolute end-0 z-50 mt-2 w-44 rounded-2xl border border-slate-700 bg-slate-900 p-1.5 shadow-2xl"
          onKeyDown={event => {
            const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]'));
            const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
            if (event.key === 'Escape') { event.preventDefault(); setOpen(false); trigger.current?.focus(); }
            if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
              event.preventDefault();
              const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1
                : (index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
              buttons[next]?.focus();
            }
          }}
        >
          {LANGUAGES.map(item => (
            <button
              key={item.id} type="button" role="menuitemradio" aria-checked={selected === item.id}
              onClick={() => choose(item.id)}
              className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-start text-xs transition focus-visible:outline-2 focus-visible:outline-indigo-400 ${selected === item.id
                ? 'bg-indigo-600/20 font-bold text-indigo-200' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              <span><span aria-hidden="true">{item.flag}</span> {item.name}</span>
              {selected === item.id && <Check size={13} className="text-amber-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
