import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speechManager } from '../../utils/speech';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';

interface AudioButtonProps {
  textToSpeak: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  ariaLabel?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  textToSpeak,
  size = 'md',
  className = '',
  ariaLabel
}) => {
  const { language } = useApp();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const t = translations[language];

  useEffect(() => {
    const unsubscribe = speechManager.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => unsubscribe();
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      speechManager.stop();
    } else {
      speechManager.speak(textToSpeak, language);
    }
  };

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base'
  }[size];

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22
  }[size];

  return (
    <button
      onClick={handleClick}
      aria-label={ariaLabel || (isSpeaking ? t.stopAudio : t.listenAudio)}
      title={isSpeaking ? t.stopAudio : t.listenAudio}
      className={`inline-flex items-center justify-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 active:scale-95 shadow-sm ${
        isSpeaking
          ? 'bg-amber-400 text-slate-900 animate-pulse ring-2 ring-amber-300'
          : 'bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-400/30'
      } ${sizeClasses} ${className}`}
    >
      {isSpeaking ? (
        <VolumeX size={iconSizes} className="animate-spin-once" />
      ) : (
        <Volume2 size={iconSizes} />
      )}
    </button>
  );
};
