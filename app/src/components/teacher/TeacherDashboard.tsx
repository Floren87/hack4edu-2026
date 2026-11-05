import { localizeText as text, formatDate } from '../../i18n/localize';
import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';
import { generatePedagogicalAssessment } from '../../utils/aiPedagogy';
import { soundManager } from '../../utils/soundEffects';
import { AudioButton } from '../common/AudioButton';
import { executeBrowserPrint, downloadPrintableTeacherReport } from '../../utils/printReport';
import {
  CheckCircle2,
  HelpCircle,
  FileText,
  Lightbulb,
  Compass,
  Brain,
  ShieldCheck,
  Printer,
  Save,
  Clock,
  Layers,
  HeartHandshake,
  Download,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Target
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const {
    activeStudent,
    students,
    switchStudent,
    language,
    updateTeacherValidation, busy
  } = useApp();

  const t = translations[language];

  // Generate assessment report for the active student
  const report = useMemo(() => {
    return generatePedagogicalAssessment(activeStudent, language);
  }, [activeStudent, language]);

  const [teacherAgreements, setTeacherAgreements] = useState<Record<string, boolean>>(() => {
    return activeStudent.teacherValidation?.agreements || {
      str_creativity: true,
      str_logic: true,
      str_resilience: true,
      str_collaboration: true
    };
  });

  const [teacherNotes, setTeacherNotes] = useState<string>(
    activeStudent.teacherValidation?.teacherNotes || ''
  );

  const [isSaved, setIsSaved] = useState(false);
  const [printFeedback, setPrintFeedback] = useState<string | null>(null);
  const [activeTabActivities, setActiveTabActivities] = useState<'all' | 'completed' | 'pending'>('all');

  const handleToggleAgreement = (strengthKey: string, val: boolean) => {
    soundManager.playClick();
    setTeacherAgreements(prev => ({
      ...prev,
      [strengthKey]: val,
    }));
    setIsSaved(false);
  };

  const handleSaveValidation = async () => {
    soundManager.playSparkle();
    try { await updateTeacherValidation(teacherAgreements, teacherNotes); } catch { return; }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handlePrint = () => {
    soundManager.playPop();
    const success = executeBrowserPrint();
    if (!success) {
      // If browser print is restricted by iframe sandbox, automatically download the printable document
      downloadPrintableTeacherReport(activeStudent, report, language);
      setPrintFeedback("Descargando documento imprimible del Panel Profesional...");
      setTimeout(() => setPrintFeedback(null), 3500);
    }
  };

  const handleDownloadReport = () => {
    soundManager.playSparkle();
    downloadPrintableTeacherReport(activeStudent, report, language);
    setPrintFeedback("¡Informe del Panel Profesional descargado listo para imprimir!");
    setTimeout(() => setPrintFeedback(null), 3500);
  };

  const completedCount = report.completedActivities.length;
  const pendingCount = report.pendingActivities.length;

  return (
    <div className="min-w-0 max-w-5xl mx-auto p-4 sm:p-6 space-y-8 print:p-0 print:space-y-4 [overflow-wrap:anywhere]">

      {/* Student Selector Bar & Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-3xl print:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <div className="shrink-0 text-3xl">{activeStudent.avatar}</div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">{' '}{text(language, "Panel Profesional • Expediente Activo")}{' '}</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded-full">
                {completedCount}{' '}{text(language, "de 10 completadas")}{' '}</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white">{activeStudent.nameOrAlias}</h2>
            <span className="text-xs text-slate-400">{' '}{text(language, "Edad:")}{' '}{activeStudent.age || 9} {' '}{text(language, "años • Género:")}{' '} {activeStudent.gender === 'female' ? text(language, "Chica") : activeStudent.gender === 'male' ? text(language, "Chico") : text(language, "Sin especificar")} • {activeStudent.starsCount || 0} ⭐
            </span>
          </div>
        </div>

        <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400">{' '}{text(language, "Cambiar alumno:")}{' '}</span>
          <select
            value={activeStudent.id}
            onChange={(e) => switchStudent(e.target.value)}
            className="min-w-0 max-w-full bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-indigo-500"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.avatar} {s.nameOrAlias} ({s.telemetryLog.length}{' '}{text(language, "sesiones)")}{' '}</option>
            ))}
          </select>

          {/* Direct Print Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md transition active:scale-95 cursor-pointer"
            title={text(language, "Imprimir informe oficial del Panel Profesional")}
          >
            <Printer size={15} />
            <span>{' '}{text(language, "Imprimir Informe")}{' '}</span>
          </button>

          {/* Direct Download Printable HTML/PDF button */}
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition active:scale-95 cursor-pointer"
            title={text(language, "Descargar documento oficial formateado para imprimir")}
          >
            <Download size={14} />
            <span className="hidden sm:inline">{' '}{text(language, "Descargar PDF/HTML")}{' '}</span>
          </button>
        </div>
      </div>

      {printFeedback && (
        <div className="p-3 rounded-2xl bg-indigo-950/80 border border-indigo-500 text-indigo-200 text-xs text-center font-medium animate-in fade-in">
          {text(language, printFeedback)}
        </div>
      )}

      {/* R14 & R15 Ethical Framework Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 p-6 border border-indigo-700/40 shadow-xl space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck size={18} />
            <span>{' '}{text(language, "Marco Ético y Metodológico")}{' '}</span>
          </div>
          <AudioButton textToSpeak={text(language, "Panel Profesional. Evaluación pedagógica sin etiquetas. El informe se alimenta exclusivamente de las actividades reales que el estudiante completa. Las que aún no ha jugado figuran como pendientes de realizar. No existen etiquetas clínicas ni juicios automatizados.")} />
        </div>
        <p className="text-xs text-indigo-200 leading-relaxed">
          <strong>{' '}{text(language, "Sin etiquetas patologizantes:")}{' '}</strong>{' '}{text(language, "no existen puntuaciones clínicas de déficit ni cocientes cerrados.")}{' '}<strong> {' '}{text(language, "Alimentación basada en evidencias reales:")}{' '}</strong>{' '}{text(language, "Solo las actividades realizadas alimentan las observaciones; las actividades no realizadas se declaran explícitamente como «Pendiente de realizar».")}{' '}<strong> {' '}{text(language, "Supervisión humana activa:")}{' '}</strong>{' '}{text(language, "El profesional valida o contrasta cada fortaleza antes del guardado institucional.")}{' '}</p>
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: ACTIVIDADES REALIZADAS VS PENDIENTES DE REALIZAR */}
      {/* ======================================================== */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Layers className="text-indigo-400" size={20} />
              <span>{' '}{text(language, "Registro y Estado de Actividades del Alumno")}{' '}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{' '}{text(language, "El informe se alimenta progresivamente: solo las actividades jugadas muestran evidencias reales; las no ejecutadas permanecen pendientes.")}{' '}</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTabActivities('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                activeTabActivities === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >{' '}{text(language, "Todas (10)")}{' '}</button>
            <button
              onClick={() => setActiveTabActivities('completed')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                activeTabActivities === 'completed'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle size={13} />
              <span>{' '}{text(language, "Realizadas (")}{' '}{completedCount})</span>
            </button>
            <button
              onClick={() => setActiveTabActivities('pending')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                activeTabActivities === 'pending'
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock size={13} />
              <span>{' '}{text(language, "Pendientes (")}{' '}{pendingCount})</span>
            </button>
          </div>
        </div>

        {/* Progress bar of activities */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">{' '}{text(language, "Progreso Global de Actividades del Alumno")}{' '}</span>
            <span className="text-indigo-400">{completedCount} {' '}{text(language, "de 10 completadas (")}{' '}{Math.round((completedCount / 10) * 100)}%)</span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
              style={{ width: `${(completedCount / 10) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              {completedCount}{' '}{text(language, "realizadas (con evidencias registradas)")}{' '}</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              {pendingCount}{' '}{text(language, "pendientes de realizar")}{' '}</span>
          </div>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.allActivities
            .filter(act => {
              if (activeTabActivities === 'completed') return act.status === 'realizada';
              if (activeTabActivities === 'pending') return act.status === 'pendiente';
              return true;
            })
            .map(activity => {
              const isCompleted = activity.status === 'realizada';
              return (
                <div
                  key={activity.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCompleted
                      ? 'bg-slate-950/90 border-emerald-500/40 shadow-sm'
                      : 'bg-slate-950/50 border-slate-800/80 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="text-2xl p-2 rounded-xl bg-slate-900 border border-slate-800">
                        {activity.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black text-white">{activity.name}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isCompleted
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          }`}>
                            {isCompleted ? text(language, "✓ Realizada") : text(language, "⏳ Pendiente de realizar")}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{activity.subtitle}</p>
                      </div>
                    </div>
                  </div>

                  {isCompleted ? (
                    <div className="mt-3 space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
                        <span>{' '}{text(language, "⏱️ Tiempo:")}{' '} {activity.durationSeconds}s</span>
                        <span>{' '}{text(language, "🔄 Intentos:")}{' '} {activity.attemptsCount}</span>
                        <span>{' '}{text(language, "⭐ Acciones clave:")}{' '} {activity.originalMovesCount}</span>
                        <span className="text-emerald-400 font-bold">{' '}{text(language, "Rendimiento:")}{' '} {activity.scorePercent}%</span>
                      </div>
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <strong className="text-[11px] text-slate-300 block mb-1">{' '}{text(language, "Evidencias directas registradas:")}{' '}</strong>
                        <ul className="space-y-1 text-[11px] text-slate-300">
                          {activity.notesObserved?.map((note, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-400 mt-0.5">•</span>
                              <span>{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 p-3 rounded-xl bg-amber-950/20 border border-amber-900/30 text-xs text-amber-200/80">
                      <p className="flex items-center gap-1.5 font-semibold text-amber-300 text-[11px]">
                        <Clock size={13} />
                        <span>{' '}{text(language, "Pendiente de realizar")}{' '}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">{' '}{text(language, "El estudiante aún no ha abierto ni jugado esta actividad. No se muestran inferencias automáticas para garantizar una evaluación objetiva.")}{' '}</p>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 2: PORCENTAJES DE HABILIDADES, INTERESES Y FORTALEZAS */}
      {/* ======================================================== */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <BarChart3 className="text-indigo-400" size={20} />
              <span>{' '}{text(language, "Porcentajes de Habilidades, Intereses y Fortalezas")}{' '}</span>
            </h3>
            <p className="text-xs text-slate-400">{' '}{text(language, "Métricas calculadas directamente de las acciones del estudiante en la plataforma")}{' '}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Card A: Porcentajes de Habilidades (5 competencias) */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Brain className="text-indigo-400" size={17} />
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">{' '}{text(language, "Porcentaje de Habilidades")}{' '}</h4>
                </div>
                <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-700/40 px-2 py-0.5 rounded-full font-bold">{' '}{text(language, "5 Competencias")}{' '}</span>
              </div>

              <div className="space-y-3.5 mt-4">
                {report.skillsPercentages.map((sk) => (
                  <div key={sk.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                        <span>{sk.icon}</span>
                        <span>{sk.name}</span>
                      </span>
                      <span className={`font-black ${
                        sk.status === 'evaluada' ? 'text-indigo-300' : 'text-amber-400 text-[11px]'
                      }`}>
                        {sk.status === 'evaluada' ? `${sk.percentage}%` : text(language, "0% (Pendiente)")}
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          sk.status === 'evaluada'
                            ? 'bg-gradient-to-r from-indigo-500 to-cyan-400'
                            : 'bg-slate-800'
                        }`}
                        style={{ width: `${sk.percentage}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      {sk.evidenceSummary}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">{' '}{text(language, "* Habilidades no jugadas permanecen en 0% con etiqueta «Pendiente».")}{' '}</div>
          </div>

          {/* Card B: Porcentajes de Intereses (6 mundos) */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Compass className="text-amber-400" size={17} />
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">{' '}{text(language, "Porcentaje de Intereses")}{' '}</h4>
                </div>
                <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-700/40 px-2 py-0.5 rounded-full font-bold">{' '}{text(language, "6 Mundos")}{' '}</span>
              </div>

              <div className="space-y-3 mt-4">
                {report.interestsPercentages.map((intr) => (
                  <div key={intr.worldId} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                        <span>{intr.icon}</span>
                        <span>{intr.name.split('(')[0]}</span>
                      </span>
                      <span className={`font-black ${
                        intr.visits > 0 ? 'text-amber-300' : 'text-slate-500 text-[11px]'
                      }`}>
                        {intr.percentage}% ({intr.visits})
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          intr.visits > 0
                            ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                            : 'bg-slate-800'
                        }`}
                        style={{ width: `${intr.percentage}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      {intr.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">{' '}{text(language, "* Refleja las elecciones espontáneas y motivación intrínseca del estudiante.")}{' '}</div>
          </div>

          {/* Card C: Porcentajes de Fortalezas (Consolidación) */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-emerald-400" size={17} />
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">{' '}{text(language, "Porcentaje de Fortalezas")}{' '}</h4>
                </div>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700/40 px-2 py-0.5 rounded-full font-bold">{' '}{text(language, "Consolidación")}{' '}</span>
              </div>

              {/* Overall Consolidation Gauge */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2 mt-3">
                <span className="text-[11px] text-slate-400 uppercase font-bold block">{' '}{text(language, "Índice de Consolidación de Fortalezas")}{' '}</span>
                <div className="text-3xl font-black text-emerald-400">
                  {report.strengthsBreakdown.consolidationPercentage}%
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full transition-all duration-500"
                    style={{ width: `${report.strengthsBreakdown.consolidationPercentage}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 block">{' '}{text(language, "Basado en evidencias verificables sin etiquetas patologizantes")}{' '}</span>
              </div>

              {/* Breakdown Distribution */}
              <div className="space-y-2.5 mt-4 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                    <span>⭐</span>
                    <span>{' '}{text(language, "Fortalezas que destacan:")}{' '}</span>
                  </span>
                  <span className="font-black text-white">
                    {report.strengthsBreakdown.highlightedCount} ({report.strengthsBreakdown.highlightedPct}%)
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-indigo-300 font-semibold flex items-center gap-1.5">
                    <span>✓</span>
                    <span>{' '}{text(language, "Destrezas sólidas:")}{' '}</span>
                  </span>
                  <span className="font-black text-white">
                    {report.strengthsBreakdown.solidCount} ({report.strengthsBreakdown.solidPct}%)
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-amber-300 font-semibold flex items-center gap-1.5">
                    <span>⏳</span>
                    <span>{' '}{text(language, "En observación / pendientes:")}{' '}</span>
                  </span>
                  <span className="font-black text-white">
                    {report.strengthsBreakdown.observingCount} ({report.strengthsBreakdown.observingPct}%)
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">{' '}{text(language, "* El 100% de los descriptores emplean enfoque positivo.")}{' '}</div>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 3: ANÁLISIS PEDAGÓGICO INTEGRAL */}
      {/* ======================================================== */}
      <div className="rounded-3xl bg-slate-900 border border-indigo-700/40 p-6 space-y-5 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Target className="text-indigo-400" size={20} />
            <h3 className="text-base sm:text-lg font-black text-white">
              {report.pedagogicalAnalysis.title}
            </h3>
          </div>
          <span className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-500/40 font-bold px-3 py-1 rounded-full">{' '}{text(language, "Síntesis Institucional")}{' '}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">

          {/* Block 1: Síntesis General */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <h5 className="font-black text-indigo-300 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
              <TrendingUp size={14} />
              <span>{' '}{text(language, "Síntesis Evolutiva del Progreso")}{' '}</span>
            </h5>
            <p className="text-slate-300 leading-relaxed">
              {report.pedagogicalAnalysis.overallSynthesis}
            </p>
          </div>

          {/* Block 2: Correlación Intereses vs Habilidades */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <h5 className="font-black text-amber-300 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
              <Compass size={14} />
              <span>{' '}{text(language, "Correlación entre Intereses y Habilidades")}{' '}</span>
            </h5>
            <p className="text-slate-300 leading-relaxed">
              {report.pedagogicalAnalysis.interestSkillCorrelation}
            </p>
          </div>

          {/* Block 3: Perseverancia y Resolución */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <h5 className="font-black text-emerald-300 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
              <ShieldCheck size={14} />
              <span>{' '}{text(language, "Evaluación de la Perseverancia y Adaptación")}{' '}</span>
            </h5>
            <p className="text-slate-300 leading-relaxed">
              {report.pedagogicalAnalysis.resilienceEvaluation}
            </p>
          </div>

          {/* Block 4: Orientación para Diferenciación */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <h5 className="font-black text-cyan-300 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
              <Lightbulb size={14} />
              <span>{' '}{text(language, "Orientación para la Diferenciación en el Aula")}{' '}</span>
            </h5>
            <p className="text-slate-300 leading-relaxed">
              {report.pedagogicalAnalysis.classroomDifferentiationAdvice}
            </p>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 4: PERFIL DE FORTALEZAS OBSERVADAS Y VALIDACIÓN */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Brain className="text-indigo-400" size={20} />
              <span>{' '}{text(language, "Perfil de Fortalezas Observadas y Validación Profesional")}{' '}</span>
            </h3>
            <p className="text-xs text-slate-400">{' '}{text(language, "Lenguaje positivo: «destaca en...» o «en fase de observación». Cero términos de déficit.")}{' '}</p>
          </div>
        </div>

        <div className="space-y-4">
          {report.strengths.map(strength => {
            const isAgreed = teacherAgreements[strength.id] ?? true;
            return (
              <div
                key={strength.id}
                className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-lg hover:border-indigo-600/50 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-black text-white">{strength.title}</h4>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        strength.levelDescription === 'destaca'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : strength.levelDescription === 'destreza_solida'
                          ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {strength.levelDescription === 'destaca'
                          ? text(language, "⭐ Destaca con brillo propio")
                          : strength.levelDescription === 'destreza_solida'
                          ? text(language, "✓ Destreza sólida observada")
                          : text(language, "⏳ En observación formativa")}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{strength.description}</p>
                  </div>

                  {/* Validation toggle (R15) */}
                  <div className="grid w-full max-w-full grid-cols-2 items-stretch gap-1.5 shrink-0 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 sm:flex sm:w-auto sm:flex-wrap print:hidden">
                    <button
                      onClick={() => handleToggleAgreement(strength.id, true)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        isAgreed
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <CheckCircle2 size={13} />
                      <span>{t.btnValidateMatch}</span>
                    </button>
                    <button
                      onClick={() => handleToggleAgreement(strength.id, false)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        !isAgreed
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <HelpCircle size={13} />
                      <span>{t.btnValidateObserve}</span>
                    </button>
                  </div>
                </div>

                {/* Evidence points (R4) */}
                <div className="space-y-1.5 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                    {t.evidenceCount}
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {strength.evidenceItems.map((ev, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-indigo-400 mt-0.5">•</span>
                        <span>{ev}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Classroom Suggestion */}
                <div className="text-xs text-slate-300 bg-indigo-950/30 p-3 rounded-xl border border-indigo-900/40">
                  <strong className="text-indigo-300 block mb-0.5">{' '}{text(language, "Sugerencia pedagógica asociada:")}{' '}</strong>
                  {strength.classroomSuggestions[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 5: 3 CONCRETE CLASSROOM ACTIONS (R13) */}
      {/* ======================================================== */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Lightbulb className="text-amber-400" size={18} />
            <span>{' '}{text(language, "3 Sugerencias Concretas para Orientar y Personalizar el Aula")}{' '}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">{' '}{text(language, "Estrategias accionables e inclusivas para aplicar desde el primer día sin necesidad de intérprete")}{' '}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {report.classroomRecommendations.map((rec) => (
            <div key={rec.id} className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-800/50 space-y-2 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black text-indigo-300">{rec.headline}</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{rec.actionableDetail}</p>
              </div>
              <div className="pt-2 border-t border-indigo-900/40 text-[10px] text-slate-400">
                {rec.evidenceContext}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 6: NEURODIVERGENT ACCOMMODATIONS */}
      {/* ======================================================== */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-3">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <HeartHandshake className="text-rose-400" size={18} />
          <span>{' '}{text(language, "Ajustes Razonables y Sensoriales Recomendados")}{' '}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
          {report.neurodivergentAccommodations.map((acc, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/70">
              <span className="text-rose-400 font-bold mr-1">✦</span>
              <span>{acc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 7: TEACHER'S NOTES & HUMAN VALIDATION (R15) */}
      {/* ======================================================== */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 print:hidden">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <FileText className="text-emerald-400" size={18} />
            <span>{' '}{text(language, "Validación Humana y Notas del Profesional / Orientador")}{' '}</span>
          </h3>
        </div>

        <textarea
          value={teacherNotes}
          onChange={(e) => {
            setTeacherNotes(e.target.value);
            setIsSaved(false);
          }}
          placeholder={t.teacherNotesPlaceholder}
          rows={3}
          className="w-full rounded-2xl bg-slate-950 border border-slate-700 p-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <span className="text-xs text-slate-400">
            {activeStudent.teacherValidation?.validatedAt
              ? text(language, "Última validación guardada: {0}", [formatDate(language, activeStudent.teacherValidation.validatedAt)])
              : text(language, "Informe en fase de borrador pedagógico")}
          </span>

          <button
            disabled={busy}
            onClick={handleSaveValidation}
            className="py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <Save size={15} />
            <span>{isSaved ? text(language, "¡Validación Guardada!") : text(language, "Guardar y Validar Informe")}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
