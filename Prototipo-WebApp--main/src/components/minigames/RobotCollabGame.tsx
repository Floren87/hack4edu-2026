import { localizeText as text } from '../../i18n/localize';
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';
import { soundManager } from '../../utils/soundEffects';
import { AudioButton } from '../common/AudioButton';
import { ArrowLeft, Check, HeartHandshake, BatteryCharging, Wrench, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export const RobotCollabGame: React.FC = () => {
  const { language, setView, logGameTelemetry, addStars } = useApp();
  const t = translations[language];

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [bobiEnergy, setBobiEnergy] = useState(25);
  const [bobiMood, setBobiMood] = useState<'tired' | 'curious' | 'nervous' | 'happy'>('tired');
  const [feedbackMsg, setFeedbackMsg] = useState(text('es', "Bobi tiene poca energía y camina lento. ¡Comparte baterías de luz!"));
  const [startTime] = useState(Date.now());
  const [coopActionsCount, setCoopActionsCount] = useState(0);

  // Step 1: Share batteries
  const handleShareEnergy = () => {
    soundManager.playSparkle();
    setBobiEnergy(prev => {
      const next = prev + 35;
      if (next >= 90) {
        setBobiMood('curious');
        setFeedbackMsg(text('es', "¡Bobi recuperó su luz! Ahora necesita reparar un engranaje flojo."));
        setTimeout(() => setStep(2), 1000);
      }
      return next;
    });
    setCoopActionsCount(prev => prev + 1);
  };

  // Step 2: Hand tool
  const handleSelectTool = (isCorrectTool: boolean) => {
    setCoopActionsCount(prev => prev + 1);
    if (isCorrectTool) {
      soundManager.playSparkle();
      setBobiMood('nervous');
      setFeedbackMsg(text('es', "¡Buen trabajo en equipo! Pero salieron chispas y Bobi se asustó. Dale calma con un abrazo o choque de manos."));
      setTimeout(() => setStep(3), 1000);
    } else {
      soundManager.playPop();
      setFeedbackMsg(text('es', "Bobi mira esa herramienta con curiosidad pero necesita apretar tuercas con la llave."));
    }
  };

  // Step 3: Reassure / High five
  const handleReassureBobi = () => {
    soundManager.playSparkle();
    setBobiMood('happy');
    setCoopActionsCount(prev => prev + 1);
    setFeedbackMsg(text('es', "¡Bobi sonríe feliz y su nave vuelve a encenderse gracias a ti!"));
    
    const duration = Math.round((Date.now() - startTime) / 1000);
    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch {}

    logGameTelemetry({
      gameId: 'robot_game',
      gameType: 'core_minigame',
      category: 'collaboration',
      durationSeconds: duration,
      attemptsCount: 1,
      originalMovesCount: coopActionsCount + 1,
      successRate: 1,
      perseveranceScore: 0.95,
      notesObserved: [
        text(language, "Completó los 3 hitos de ayuda cooperativa con el robot Bobi."),
        text(language, "Atendió a las necesidades energéticas, instrumentales y socioemocionales de su compañero."),
        text(language, "Demostró empatía ante gestos de nerviosismo y sintonía prosocial.")
      ],
      metrics: {
        cooperativeSteps: 3,
        totalActions: coopActionsCount + 1,
        timeSec: duration
      }
    });

    addStars(3);
    setTimeout(() => setStep(4), 1200);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setView('child_hub')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
        >
          <ArrowLeft size={16} />
          <span className="text-xs font-semibold">{t.backToHub}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">{' '}{text(language, "🤝 Minijuego 4: Colaboración")}{' '}</span>
          <AudioButton textToSpeak={`${t.gameRobotTitle}. ${text(language, feedbackMsg)}`} />
        </div>
      </div>

      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-5 border border-emerald-800/40 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <span>{t.gameRobotTitle}</span>
              <HeartHandshake className="text-emerald-400" size={20} />
            </h1>
            <p className="text-sm text-emerald-200/80 mt-1">
              {t.gameRobotInstructions}
            </p>
          </div>
        </div>
      </div>

      {/* Main Interaction Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Robot Bobi Visual Area */}
        <div className="md:col-span-2 rounded-3xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col items-center justify-center space-y-4 shadow-xl min-h-[360px] relative overflow-hidden">
          
          {/* Energy Bar */}
          <div className="w-full max-w-xs bg-slate-950 p-2 rounded-2xl border border-slate-800 flex items-center gap-3">
            <BatteryCharging size={20} className={bobiEnergy > 50 ? 'text-emerald-400' : 'text-amber-400 animate-pulse'} />
            <div className="flex-1 bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, bobiEnergy)}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-300">{Math.min(100, bobiEnergy)}%</span>
          </div>

          {/* Bobi Character Illustration */}
          <div className="relative py-4">
            <div className={`w-36 h-36 rounded-3xl border-4 flex flex-col items-center justify-center transition-all duration-300 ${
              bobiMood === 'tired' 
                ? 'bg-slate-800/80 border-slate-600 scale-95' 
                : bobiMood === 'nervous'
                ? 'bg-amber-950/40 border-amber-500 animate-bounce'
                : 'bg-emerald-950/40 border-emerald-400 scale-105 shadow-xl shadow-emerald-500/20'
            }`}>
              {/* Robot Face */}
              <div className="text-6xl mb-1">
                {bobiMood === 'tired' && '🤖'}
                {bobiMood === 'curious' && '🤖'}
                {bobiMood === 'nervous' && '🤖'}
                {bobiMood === 'happy' && '🤖'}
              </div>
              <div className="flex items-center gap-1.5">
                {bobiMood === 'tired' && <span className="text-xs font-bold text-slate-400">{' '}{text(language, "💤 Necesito energía...")}{' '}</span>}
                {bobiMood === 'curious' && <span className="text-xs font-bold text-cyan-300">{' '}{text(language, "⚙️ ¿Apretamos la tuerca?")}{' '}</span>}
                {bobiMood === 'nervous' && <span className="text-xs font-bold text-amber-300">{' '}{text(language, "⚡ ¡Chispas!")}{' '}</span>}
                {bobiMood === 'happy' && <span className="text-xs font-bold text-emerald-300">{' '}{text(language, "✨ ¡Gracias, amigo!")}{' '}</span>}
              </div>
            </div>
          </div>

          {/* Feedback dialog */}
          <div className="w-full max-w-md p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
            <p className="text-xs font-medium text-emerald-200">
              {feedbackMsg}
            </p>
          </div>

        </div>

        {/* Action Controls for child */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{' '}{text(language, "Misión de Cooperación:")}{' '}</span>

            {/* Step 1 Actions */}
            {step === 1 && (
              <div className="space-y-3">
                <p className="text-xs text-slate-300">{' '}{text(language, "Toca las orbes de energía para compartirlas con Bobi:")}{' '}</p>
                <button
                  onClick={handleShareEnergy}
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                >
                  <span className="text-lg">⚡</span>
                  <span>{' '}{text(language, "Compartir Batería Solar (+35%)")}{' '}</span>
                </button>
              </div>
            )}

            {/* Step 2 Actions */}
            {step === 2 && (
              <div className="space-y-2">
                <p className="text-xs text-slate-300">{' '}{text(language, "¿Qué herramienta le entregas a Bobi para reparar la tuerca?")}{' '}</p>
                <div className="grid grid-cols-1 gap-2 pt-1">
                  <button
                    onClick={() => handleSelectTool(true)}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-emerald-600/30 border border-slate-700 hover:border-emerald-500 text-left flex items-center gap-3 transition"
                  >
                    <Wrench size={20} className="text-emerald-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">{' '}{text(language, "Llave inglesa de ajuste")}{' '}</span>
                      <span className="text-[10px] text-slate-400">{' '}{text(language, "Para tuercas y tornillos")}{' '}</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleSelectTool(false)}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left flex items-center gap-3 transition opacity-80"
                  >
                    <span className="text-xl">🖌️</span>
                    <div>
                      <span className="text-xs font-bold text-slate-300 block">{' '}{text(language, "Pincel de acuarelas")}{' '}</span>
                      <span className="text-[10px] text-slate-400">{' '}{text(language, "Para pintar cuadros")}{' '}</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleSelectTool(false)}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left flex items-center gap-3 transition opacity-80"
                  >
                    <span className="text-xl">💧</span>
                    <div>
                      <span className="text-xs font-bold text-slate-300 block">{' '}{text(language, "Vaso de agua")}{' '}</span>
                      <span className="text-[10px] text-slate-400">{' '}{text(language, "Podría oxidar el motor")}{' '}</span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 Actions */}
            {step === 3 && (
              <div className="space-y-3">
                <p className="text-xs text-slate-300">{' '}{text(language, "Bobi está asustado por las chispas. ¿Cómo le transmites calma?")}{' '}</p>
                <button
                  onClick={handleReassureBobi}
                  className="w-full py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 transition-all active:scale-95"
                >
                  <Heart size={16} />
                  <span>{' '}{text(language, "Darle una caricia protectora y chocar la mano 🤝")}{' '}</span>
                </button>
              </div>
            )}

            {/* Step 4: Finished */}
            {step === 4 && (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/60 text-center space-y-3">
                <span className="text-3xl">🚀</span>
                <p className="text-xs font-bold text-emerald-200">{' '}{text(language, "¡Misión completada! Has demostrado una excelente empatía no verbal y colaboración.")}{' '}</p>
                <button
                  onClick={() => setView('child_hub')}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                >{' '}{text(language, "Volver a la Zona de Juegos")}{' '}</button>
              </div>
            )}

          </div>

          <div className="text-[11px] text-slate-500 text-center border-t border-slate-800 pt-3">{' '}{text(language, "Se mide la respuesta afectiva y cooperación sin barrera lingüística.")}{' '}</div>
        </div>

      </div>

    </div>
  );
};
