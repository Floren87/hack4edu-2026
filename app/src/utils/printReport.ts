import type { ComprehensiveAssessmentReport, Language, StudentProfile } from '../types';
import { localizeText } from '../i18n/localize';
import { getChildComments, type ChildComment } from './childComments';

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
  childComments: ChildComment[] = [],
): string {
  const en = language === 'en';
  const label = (es: string, english: string) => en ? english : es;
  const text = (value: string) => escapeHtml(localizeText(language, value));
  const list = (items: string[]) => `<ul>${items.map(item => `<li>${text(item)}</li>`).join('')}</ul>`;
  const section = (title: string, body: string) => `<section><h2>${escapeHtml(title)}</h2>${body}</section>`;
  const title = audience === 'teacher'
    ? label('Informe profesional', 'Professional Report')
    : label('Resumen para la familia', 'Family Summary');
  const activityList = report.allActivities.map(activity => `<article>
    <h3>${escapeHtml(activity.icon)} ${text(activity.name)}</h3>
    <p>${text(activity.subtitle)}</p>
    <strong>${activity.status === 'realizada' ? label('Realizada', 'Completed') : label('Pendiente', 'Pending')}</strong>
    ${activity.status === 'realizada'
      ? `<p>${escapeHtml(activity.durationSeconds)}s · ${escapeHtml(activity.attemptsCount)} ${label('intentos', 'attempts')}</p>${list(activity.notesObserved ?? [])}`
      : ''}</article>`).join('');
  const status = { destaca: label('Fortaleza observada', 'Observed strength'), destreza_solida: label('Destreza observada', 'Developing skill'), en_observacion: label('En observación', 'Under observation') };
  const strengths = report.strengths.map(strength => `<article><h3>${text(strength.title)}</h3>
    <p>${status[strength.levelDescription]}</p><p>${text(strength.description)}</p>
    ${list(strength.evidenceItems)}
    ${list(audience === 'teacher' ? strength.classroomSuggestions : strength.familyHomeTips)}</article>`).join('');
  const commentsSection = childComments.length === 0 ? '' : section(label('En palabras del niño o la niña', 'In the child\'s own words'),
    childComments.map(comment => `<article><p>${escapeHtml(comment.pieces.join(' '))}${comment.purpose ? ` · ${escapeHtml(comment.purpose)}` : ''}</p>
      ${comment.text ? `<p dir="auto"><em>«${escapeHtml(comment.text)}»</em></p>` : ''}
      ${comment.emojis.length ? `<p>${escapeHtml(comment.emojis.join(' '))}</p>` : ''}</article>`).join('')
    + `<p>${label('Tal como lo escribió, sin traducir ni puntuar.', 'As written by the child, not translated or scored.')}</p>`);
  let body: string;
  if (audience === 'teacher') {
    const analysis = report.pedagogicalAnalysis;
    const breakdown = report.strengthsBreakdown;
    body = section(label('Actividades y evidencias', 'Activities and Evidence'), activityList)
      + commentsSection
      + section(label('Habilidades e intereses', 'Skills and Interests'),
        list(report.skillsPercentages.map(skill => `${skill.name}: ${skill.status === 'evaluada' ? skill.percentage + '%' : label('Pendiente', 'Pending')}`))
        + list(report.interestsPercentages.map(interest => `${interest.name}: ${interest.visits} ${label('visitas', 'visits')} (${interest.percentage}%)`)))
      + section(label('Resumen de fortalezas', 'Strengths Overview'), list([
        `${label('Consolidación', 'Consolidation')}: ${breakdown.consolidationPercentage}%`,
        `${label('Fortalezas destacadas', 'Highlighted strengths')}: ${breakdown.highlightedCount} (${breakdown.highlightedPct}%)`,
        `${label('Destrezas sólidas', 'Developing skills')}: ${breakdown.solidCount} (${breakdown.solidPct}%)`,
        `${label('En observación', 'Under observation')}: ${breakdown.observingCount} (${breakdown.observingPct}%)`,
      ]))
      + section(analysis.title, [analysis.overallSynthesis, analysis.interestSkillCorrelation, analysis.resilienceEvaluation,
        analysis.activitiesProgressSummary, analysis.classroomDifferentiationAdvice].map(item => `<p>${text(item)}</p>`).join(''))
      + section(label('Fortalezas y observaciones', 'Strengths and Observations'), strengths)
      + section(label('Sugerencias para el aula', 'Classroom Suggestions'), report.classroomRecommendations.map(rec =>
        `<article><h3>${text(rec.headline)}</h3><p>${text(rec.actionableDetail)}</p><p>${text(rec.evidenceContext)}</p></article>`).join(''))
      + section(label('Apoyos recomendados', 'Suggested Supports'), list(report.neurodivergentAccommodations))
      + section(label('Revisión del profesional', 'Professional Review'),
        `<p>${student.teacherValidation.reviewed ? label('Revisado', 'Reviewed') : label('Borrador', 'Draft')}</p>
        <p>${escapeHtml(student.teacherValidation.teacherNotes)}</p>
        ${list(Object.entries(student.teacherValidation.agreements).map(([id, agrees]) =>
          `${report.strengths.find(strength => strength.id === id)?.title ?? id}: ${agrees ? label('Coincide', 'Matches observation') : label('En observación', 'Under observation')}`))}`);
  } else {
    body = `<p>${text(report.familyLetter.greeting)}</p><p>${text(report.familyLetter.positiveSummary)}</p>`
      + commentsSection
      + section(label('Fortalezas observadas', 'Observed Strengths'), strengths)
      + section(label('Intereses', 'Interests'), list(report.primaryInterests.map(interest => interest.name)))
      + section(label('Ideas para casa', 'Ideas for Home'), list(report.familyLetter.homeActivities))
      + `<p>${text(report.familyLetter.closing)}</p>`;
  }
  return `<!doctype html><html lang="${en ? 'en' : 'es'}"><head><meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title>
    <style>@page{size:A4;margin:18mm}body{font-family:system-ui,sans-serif;color:#172033;max-width:850px;margin:auto;padding:24px;line-height:1.5}
    header{border-bottom:2px solid #4f46e5}h1{font-size:24px}h2{font-size:18px;color:#3730a3}h3{font-size:15px}
    article{border:1px solid #dbe1ea;padding:12px;margin:10px 0;border-radius:8px;break-inside:avoid}
    p,li{font-size:13px}footer{border-top:1px solid #dbe1ea;margin-top:20px;font-size:11px} @media print{button{display:none}body{padding:0}}</style>
    </head><body><button onclick="window.print()">${label('Imprimir / Guardar PDF', 'Print / Save PDF')}</button>
    <header><h1>${label('Talento sin Fronteras', 'Talent Without Borders')} · ${title}</h1>
    <p>${escapeHtml(student.avatar)} ${escapeHtml(student.nameOrAlias)} · ${new Date(report.generatedAt).toLocaleDateString(en ? 'en-GB' : 'es-ES')}</p>
    <p>${label('Edad', 'Age')}: ${escapeHtml(student.age ?? '—')} · ${label('Estrellas', 'Stars')}: ${escapeHtml(student.starsCount)} ⭐ · ${label('Insignias', 'Badges')}: ${escapeHtml(student.unlockedBadges.length)}</p>
    <p>${report.completedActivities.length} / ${report.allActivities.length} ${label('actividades completadas', 'activities completed')} · ${report.totalSessionsAnalyzed} ${label('sesiones', 'sessions')}</p></header>
    ${body}<footer>${label('Observaciones del juego; no constituye un diagnóstico. El profesional decide.', 'Observations from play; this is not a diagnosis. The professional decides.')}</footer></body></html>`;
}

function downloadReport(student: StudentProfile, report: ComprehensiveAssessmentReport, language: Language, audience: 'teacher' | 'family') {
  const url = URL.createObjectURL(new Blob([printableReportHtml(student, report, language, audience, getChildComments(student.id))], { type: 'text/html;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${audience === 'teacher' ? 'Professional_Report' : 'Family_Summary'}_${student.id.replace(/[^a-zA-Z0-9_-]/g, '_')}.html`;
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
