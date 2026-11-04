import type { ComprehensiveAssessmentReport, Language, StudentProfile } from '../types';
import { localizeText, formatDate, direction } from '../i18n/localize';

// Escape all dynamic content, including aliases and the professional's notes.
const escapeHtml = (value: unknown): string => String(value ?? '').replace(/[&<>"']/g,
  char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);

export function executeBrowserPrint(): boolean {
  try {
    window.focus();
    window.print();
    return true;
  } catch {
    return false;
  }
}

export function printableReportHtml(
  student: StudentProfile,
  report: ComprehensiveAssessmentReport,
  language: Language,
  audience: 'teacher' | 'family',
): string {
  const label = (source: string) => localizeText(language, source);
  const text = escapeHtml; // Report fields are already localized; aliases and notes are opaque.
  const list = (items: string[]) => `<ul>${items.map(item => `<li>${text(item)}</li>`).join('')}</ul>`;
  const section = (title: string, body: string) => `<section><h2>${escapeHtml(title)}</h2>${body}</section>`;
  const title = audience === 'teacher'
    ? label("Informe profesional")
    : label("Resumen para la familia");
  const activityList = report.allActivities.map(activity => `<article>
    <h3>${escapeHtml(activity.icon)} ${text(activity.name)}</h3>
    <p>${text(activity.subtitle)}</p>
    <strong>${activity.status === 'realizada' ? label("Realizada") : label("Pendiente")}</strong>
    ${activity.status === 'realizada'
      ? `<p>${escapeHtml(activity.durationSeconds)}s · ${escapeHtml(activity.attemptsCount)} ${label("intentos")}</p>${list(activity.notesObserved ?? [])}`
      : ''}</article>`).join('');
  const status = { destaca: label("Fortaleza observada"), destreza_solida: label("Destreza observada"), en_observacion: label("En observación") };
  const strengths = report.strengths.map(strength => `<article><h3>${text(strength.title)}</h3>
    <p>${status[strength.levelDescription]}</p><p>${text(strength.description)}</p>
    ${list(strength.evidenceItems)}
    ${list(audience === 'teacher' ? strength.classroomSuggestions : strength.familyHomeTips)}</article>`).join('');
  let body: string;
  if (audience === 'teacher') {
    const analysis = report.pedagogicalAnalysis;
    const breakdown = report.strengthsBreakdown;
    body = section(label("Actividades y evidencias"), activityList)
      + section(label("Habilidades e intereses"),
        list(report.skillsPercentages.map(skill => `${skill.name}: ${skill.status === 'evaluada' ? skill.percentage + '%' : label("Pendiente")}`))
        + list(report.interestsPercentages.map(interest => `${interest.name}: ${interest.visits} ${label("visitas")} (${interest.percentage}%)`)))
      + section(label("Resumen de fortalezas"), list([
        `${label("Consolidación")}: ${breakdown.consolidationPercentage}%`,
        `${label("Fortalezas destacadas")}: ${breakdown.highlightedCount} (${breakdown.highlightedPct}%)`,
        `${label("Destrezas sólidas")}: ${breakdown.solidCount} (${breakdown.solidPct}%)`,
        `${label("En observación")}: ${breakdown.observingCount} (${breakdown.observingPct}%)`,
      ]))
      + section(analysis.title, [analysis.overallSynthesis, analysis.interestSkillCorrelation, analysis.resilienceEvaluation,
        analysis.activitiesProgressSummary, analysis.classroomDifferentiationAdvice].map(item => `<p>${text(item)}</p>`).join(''))
      + section(label("Fortalezas y observaciones"), strengths)
      + section(label("Sugerencias para el aula"), report.classroomRecommendations.map(rec =>
        `<article><h3>${text(rec.headline)}</h3><p>${text(rec.actionableDetail)}</p><p>${text(rec.evidenceContext)}</p></article>`).join(''))
      + section(label("Apoyos recomendados"), list(report.neurodivergentAccommodations))
      + section(label("Revisión del profesional"),
        `<p>${student.teacherValidation.reviewed ? label("Revisado") : label("Borrador")}</p>
        <p>${escapeHtml(student.teacherValidation.teacherNotes)}</p>
        ${list(Object.entries(student.teacherValidation.agreements).map(([id, agrees]) =>
          `${report.strengths.find(strength => strength.id === id)?.title ?? id}: ${agrees ? label("Coincide") : label("En observación")}`))}`);
  } else {
    body = `<p>${text(report.familyLetter.greeting)}</p><p>${text(report.familyLetter.positiveSummary)}</p>`
      + section(label("Fortalezas observadas"), strengths)
      + section(label("Intereses"), list(report.primaryInterests.map(interest => interest.name)))
      + section(label("Ideas para casa"), list(report.familyLetter.homeActivities))
      + `<p>${text(report.familyLetter.closing)}</p>`;
  }
  return `<!doctype html><html lang="${language}" dir="${direction(language)}"><head><meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title>
    <style>@page{size:A4;margin:18mm}body{font-family:system-ui,sans-serif;color:#172033;max-width:850px;margin:auto;padding:24px;line-height:1.5}
    header{border-bottom:2px solid #4f46e5}h1{font-size:24px}h2{font-size:18px;color:#3730a3}h3{font-size:15px}
    article{border:1px solid #dbe1ea;padding:12px;margin:10px 0;border-radius:8px;break-inside:avoid}
    p,li{font-size:13px}footer{border-top:1px solid #dbe1ea;margin-top:20px;font-size:11px} @media print{button{display:none}body{padding:0}}</style>
    </head><body><button onclick="window.print()">${label("Imprimir / Guardar PDF")}</button>
    <header><h1>${label("Talento sin Fronteras")} · ${title}</h1>
    <p>${escapeHtml(student.avatar)} ${escapeHtml(student.nameOrAlias)} · ${formatDate(language, report.generatedAt)}</p>
    <p>${label("Edad")}: ${escapeHtml(student.age ?? '—')} · ${label("Estrellas")}: ${escapeHtml(student.starsCount)} ⭐ · ${label("Insignias")}: ${escapeHtml(student.unlockedBadges.length)}</p>
    <p>${report.completedActivities.length} / ${report.allActivities.length} ${label("actividades completadas")} · ${report.totalSessionsAnalyzed} ${label("sesiones")}</p></header>
    ${body}<footer>${label("Observaciones del juego; no constituye un diagnóstico. El profesional decide.")}</footer></body></html>`;
}

function downloadReport(student: StudentProfile, report: ComprehensiveAssessmentReport, language: Language, audience: 'teacher' | 'family') {
  const url = URL.createObjectURL(new Blob([printableReportHtml(student, report, language, audience)], { type: 'text/html;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  const title = localizeText(language, audience === 'teacher' ? 'Informe profesional' : 'Resumen para la familia');
  const prefix = title.replace(/[^\p{L}\p{N}_-]+/gu, '_');
  link.download = `${prefix}_${student.id.replace(/[^a-zA-Z0-9_-]/g, '_')}.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadPrintableTeacherReport(student: StudentProfile, report: ComprehensiveAssessmentReport, language: Language = 'es') {
  downloadReport(student, report, language, 'teacher');
}

export function downloadPrintableFamilyReport(student: StudentProfile, report: ComprehensiveAssessmentReport, language: Language = 'es') {
  downloadReport(student, report, language, 'family');
}
