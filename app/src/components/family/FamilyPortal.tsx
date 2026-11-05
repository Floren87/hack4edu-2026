import { localizeText as text } from '../../i18n/localize';
import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';
import { generatePedagogicalAssessment } from '../../utils/aiPedagogy';
import { AudioButton } from '../common/AudioButton';
import { ChildCommentsCard } from '../common/ChildCommentsCard';
import { executeBrowserPrint, downloadPrintableFamilyReport } from '../../utils/printReport';
import { soundManager } from '../../utils/soundEffects';
import { Heart, Compass, Home, Smile, BookOpen, Star, Printer, Download, GraduationCap } from 'lucide-react';

export const FamilyPortal: React.FC = () => {
  const { activeStudent, language, setLanguage, setRole } = useApp();
  const t = translations[language];

  const report = useMemo(() => {
    return generatePedagogicalAssessment(activeStudent, language);
  }, [activeStudent, language]);

  const [printFeedback, setPrintFeedback] = useState<string | null>(null);

  const handlePrintFamily = () => {
    soundManager.playPop();
    const success = executeBrowserPrint();
    if (!success) {
      downloadPrintableFamilyReport(activeStudent, report, language);
      setPrintFeedback("Descargando resumen para la familia...");
      setTimeout(() => setPrintFeedback(null), 3500);
    }
  };

  const handleDownloadFamily = () => {
    soundManager.playSparkle();
    downloadPrintableFamilyReport(activeStudent, report, language);
    setPrintFeedback("¡Resumen familiar descargado listo para imprimir!");
    setTimeout(() => setPrintFeedback(null), 3500);
  };

  return (
    <div className="min-w-0 max-w-4xl mx-auto p-4 sm:p-6 space-y-6 [overflow-wrap:anywhere]">
      
      {/* Action Toolbar for Family & Teacher switch */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-3xl print:hidden">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 text-2xl">{activeStudent.avatar}</span>
          <div className="min-w-0">
            <span className="text-xs font-bold text-white block">{activeStudent.nameOrAlias}</span>
            <span className="text-[10px] text-slate-400">{' '}{text(language, "Resumen adaptado para familias")}{' '}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Print Button */}
          <button
            onClick={handlePrintFamily}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white shadow-md transition active:scale-95 cursor-pointer"
            title={text(language, "Imprimir resumen familiar")}
          >
            <Printer size={15} />
            <span>{' '}{text(language, "Imprimir Resumen Familiar")}{' '}</span>
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownloadFamily}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition active:scale-95 cursor-pointer"
            title={text(language, "Descargar resumen formateado")}
          >
            <Download size={14} />
            <span className="hidden sm:inline">{' '}{text(language, "Descargar PDF/HTML")}{' '}</span>
          </button>

          {/* Shortcut to Panel Profesional */}
          <button
            onClick={() => setRole('teacher')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-xs font-semibold text-indigo-200 border border-indigo-500/40 transition active:scale-95 cursor-pointer"
            title={text(language, "Ir al Panel Profesional institucional")}
          >
            <GraduationCap size={15} className="text-indigo-400" />
            <span>{' '}{text(language, "Panel Profesional")}{' '}</span>
          </button>
        </div>
      </div>

      {printFeedback && (
        <div className="p-3 rounded-2xl bg-rose-950/80 border border-rose-500 text-rose-200 text-xs text-center font-medium animate-in fade-in">
          {text(language, printFeedback)}
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 p-6 sm:p-8 border border-rose-800/40 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-2 text-rose-300 text-xs font-bold uppercase tracking-wider">
              <Heart size={16} />
              <span>{t.familyPortalTitle}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{' '}{text(language, "Celebrando los talentos de")}{' '}{activeStudent.nameOrAlias}
            </h1>
            <p className="text-xs sm:text-sm text-rose-100/90 max-w-xl">
              {t.familyPortalSubtitle}{' '}{text(language, ". Este espacio está diseñado para que la familia conozca sus fortalezas y descubran ideas divertidas para compartir en casa.")}{' '}</p>
          </div>

          <div className="flex items-center gap-2">
            <AudioButton 
              textToSpeak={`${report.familyLetter.greeting} ${report.familyLetter.positiveSummary} ${report.familyLetter.closing}`}
              size="lg"
            />
          </div>
        </div>
      </div>

      {/* Reassurance Notice (No Deficits / No Labels) */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-center gap-3">
        <Smile size={20} className="text-amber-400 shrink-0" />
        <span>{t.noLabelsNotice}</span>
      </div>

      {/* Main Family Letter */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <span className="min-w-0 text-sm font-black text-amber-300">
            {report.familyLetter.greeting}
          </span>
          <div className="flex shrink-0 items-center gap-1.5 text-xs text-amber-400 font-bold bg-amber-400/10 px-3 py-1 rounded-full">
            <Star size={14} className="fill-amber-400" />
            <span>{activeStudent.starsCount || 0} {' '}{text(language, "Estrellas Ganadas")}{' '}</span>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
          {report.familyLetter.positiveSummary}
        </p>

        {/* Highlights of What Child Loves & Does Best */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 space-y-2">
            <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <Compass size={14} />
              <span>{' '}{text(language, "Lo que más le divierte explorar:")}{' '}</span>
            </span>
            <ul className="text-xs text-slate-300 space-y-1">
              {report.primaryInterests.slice(0, 2).map((item, i) => (
                <li key={i}>• {item.name}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 space-y-2">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <Heart size={14} />
              <span>{' '}{text(language, "Fortaleza que le hace único/a:")}{' '}</span>
            </span>
            <p className="text-xs text-slate-300">
              {report.strengths[0]?.title || text(language, "Gran inventiva y perseverancia al probar nuevas ideas.")}
            </p>
          </div>
        </div>

        {/* Home Activities Ideas */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-rose-300">
            <Home size={18} />
            <h3 className="text-sm font-bold uppercase tracking-wider">{t.familyHomeTipsTitle}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {report.familyLetter.homeActivities.map((act, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 text-xs text-slate-300 leading-relaxed flex flex-col justify-between">
                <div>
                  <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-300 font-bold flex items-center justify-center text-[11px] mb-2">
                    {idx + 1}
                  </span>
                  <span>{act}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ChildCommentsCard studentId={activeStudent.id} language={language} />

        {/* Closing Warm Message */}
        <div className="pt-4 text-center border-t border-slate-800">
          <p className="text-sm font-bold text-amber-300">
            {report.familyLetter.closing}
          </p>
        </div>
      </div>

    </div>
  );
};
