import type { ComprehensiveAssessmentReport, Language, StudentProfile } from '../types';
import { localizeText, formatDate, direction } from '../i18n/localize';
import { getChildComments, type ChildComment } from './childComments';
import { loadReportLogo } from './brand';

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
  pdf?: { library: string; fileName: string },
  logoDataUrl?: string,
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
  const commentsSection = childComments.length === 0 ? '' : section(label('En palabras del niño o la niña'),
    childComments.map(comment => `<article><p>${escapeHtml(comment.pieces.join(' '))}${comment.purpose ? ` · ${escapeHtml(comment.purpose)}` : ''}</p>
      ${comment.text ? `<p dir="auto"><em>«${escapeHtml(comment.text)}»</em></p>` : ''}
      ${comment.emojis.length ? `<p>${escapeHtml(comment.emojis.join(' '))}</p>` : ''}</article>`).join('')
    + `<p>${escapeHtml(label('Tal como lo escribió, sin traducir ni puntuar.'))}</p>`);
  let body: string;
  if (audience === 'teacher') {
    const analysis = report.pedagogicalAnalysis;
    const breakdown = report.strengthsBreakdown;
    body = section(label("Actividades y evidencias"), activityList)
      + commentsSection
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
      + commentsSection
      + section(label("Fortalezas observadas"), strengths)
      + section(label("Intereses"), list(report.primaryInterests.map(interest => interest.name)))
      + section(label("Ideas para casa"), list(report.familyLetter.homeActivities))
      + `<p>${text(report.familyLetter.closing)}</p>`;
  }
  // Barra de acciones: fuera del papel al imprimir (@media print) y fuera del PDF (data-html2canvas-ignore).
  const printIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v7H6z"/></svg>';
  const saveIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0-5-5m5 5 5-5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>';
  const toolbar = `<nav class="actions" data-html2canvas-ignore="true" aria-label="${escapeHtml(title)}">
    <span class="brand">KoraMAP</span>
    <span class="buttons">
      <button type="button" class="btn ghost" onclick="window.print()">${printIcon}<span>${escapeHtml(label("Imprimir"))}</span></button>
      <button type="button" class="btn primary" id="save-pdf" onclick="savePdf(this)">${saveIcon}<span>${escapeHtml(label("Guardar PDF"))}</span></button>
    </span></nav>`;
  // El PDF se genera aquí mismo, sin conexión. Sin la librería (p. ej. en las pruebas), se usa la impresión del navegador.
  const pdfScript = pdf ? `<script>${pdf.library.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--')}</script>
    <script>function savePdf(button){
      if(!window.html2pdf){window.print();return;}
      var text=button.querySelector('span'),idle=text.textContent;button.disabled=true;text.textContent=${JSON.stringify(label("Generando PDF…"))};
      var done=function(){button.disabled=false;text.textContent=idle;};
      window.html2pdf().set({margin:[12,12,14,12],filename:${JSON.stringify(pdf.fileName)},image:{type:'jpeg',quality:0.96},
        html2canvas:{scale:2,backgroundColor:'#ffffff'},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'},
        pagebreak:{mode:['css','legacy'],avoid:['article','h2','li']}}).from(document.getElementById('report')).save().then(done,function(){done();window.print();});
    }</script>` : `<script>function savePdf(){window.print();}</script>`;
  return `<!doctype html><html lang="${language}" dir="${direction(language)}"><head><meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title>
    <style>@page{size:A4;margin:18mm}*{box-sizing:border-box}
    body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:#172033;margin:0;background:#eef1f8;line-height:1.5}
    main{max-width:850px;margin:24px auto 48px;padding:32px 36px;background:#fff;border-radius:20px;box-shadow:0 1px 2px rgba(15,23,42,.06),0 12px 40px -12px rgba(49,46,129,.18)}
    header{border-bottom:2px solid #4f46e5}h1{font-size:24px}h2{font-size:18px;color:#3730a3}h3{font-size:15px}
    article{border:1px solid #dbe1ea;padding:12px;margin:10px 0;border-radius:8px;break-inside:avoid}
    p,li{font-size:13px}ul{list-style:none;margin:6px 0;padding:0 18px}li{position:relative;margin:2px 0}
    li::before{content:'';position:absolute;top:.62em;left:-12px;width:5px;height:5px;border-radius:50%;background:#6366f1}
    [dir=rtl] li::before{left:auto;right:-12px}footer{border-top:1px solid #dbe1ea;margin-top:20px;font-size:11px}
    .actions{position:sticky;top:0;z-index:10;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;
      padding:12px max(16px,calc((100% - 850px)/2));background:rgba(2,6,23,.92);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
      border-bottom:1px solid rgba(99,102,241,.35);box-shadow:0 8px 24px -12px rgba(2,6,23,.6)}
    .brand{display:inline-flex;align-items:center;gap:10px;font-weight:900;letter-spacing:-.01em;font-size:15px;
      background:linear-gradient(90deg,#fff,#c7d2fe);-webkit-background-clip:text;background-clip:text;color:transparent}
    .buttons{display:inline-flex;gap:10px;flex-wrap:wrap}
    .btn{display:inline-flex;align-items:center;gap:8px;min-height:42px;padding:0 18px;border-radius:14px;font:inherit;font-size:14px;font-weight:800;
      cursor:pointer;transition:transform .15s ease,box-shadow .15s ease,background .15s ease,border-color .15s ease}
    .btn svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
    .btn:focus-visible{outline:2px solid #fbbf24;outline-offset:3px}
    .btn:hover{transform:translateY(-1px)}.btn:active{transform:translateY(0)}
    .btn:disabled{opacity:.7;cursor:progress;transform:none}
    .ghost{color:#e0e7ff;background:rgba(30,41,59,.9);border:1px solid rgba(99,102,241,.45)}
    .ghost:hover{border-color:#818cf8;background:#1e293b;box-shadow:0 6px 18px -8px rgba(99,102,241,.6)}
    .primary{color:#fff;border:0;background:linear-gradient(90deg,#6366f1,#9333ea);box-shadow:0 8px 22px -8px rgba(147,51,234,.75)}
    .primary:hover{box-shadow:0 12px 28px -8px rgba(147,51,234,.9)}
    @media (max-width:560px){main{margin:12px;padding:22px 18px;border-radius:16px}.btn{flex:1;justify-content:center}.buttons{width:100%}}
    @media print{.actions{display:none}body{background:#fff}main{margin:0;padding:0;box-shadow:none;border-radius:0;max-width:none}}</style>
    </head><body>${toolbar}<main id="report">
    <header>${logoDataUrl?.match(/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/) ? `<img src="${logoDataUrl}" alt="KoraMAP" width="96" height="105" style="object-fit:contain;border-radius:12px">` : ''}<h1>${label("KoraMAP")} · ${title}</h1>
    <p>${escapeHtml(student.avatar)} <bdi>${escapeHtml(student.nameOrAlias)}</bdi> · <bdi>${formatDate(language, report.generatedAt)}</bdi></p>
    <p>${label("Edad")}: ${escapeHtml(student.age ?? '—')} · ${label("Estrellas")}: ${escapeHtml(student.starsCount)} ⭐ · ${label("Insignias")}: ${escapeHtml(student.unlockedBadges.length)}</p>
    <p>${report.completedActivities.length} / ${report.allActivities.length} ${label("actividades completadas")} · ${report.totalSessionsAnalyzed} ${label("sesiones")}</p></header>
    ${body}<footer>${label("Observaciones del juego; no constituye un diagnóstico. El profesional decide.")}</footer></main>${pdfScript}</body></html>`;
}

function reportFileName(student: StudentProfile, language: Language, audience: 'teacher' | 'family') {
  const prefix = localizeText(language, audience === 'teacher' ? 'Informe profesional' : 'Resumen para la familia').replace(/[^\p{L}\p{N}_-]+/gu, '_');
  return `${prefix}_${student.id.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
}

async function downloadReport(student: StudentProfile, report: ComprehensiveAssessmentReport, language: Language, audience: 'teacher' | 'family') {
  const name = reportFileName(student, language, audience);
  // El HTML exportado incluye su motor PDF y el logo. Esto no habilita modo offline en la app.
  let library: string | undefined;
  try { library = (await import('html2pdf.js/dist/html2pdf.bundle.min.js?raw')).default; } catch { library = undefined; }
  const html = printableReportHtml(student, report, language, audience, getChildComments(student.id),
    library ? { library, fileName: `${name}.pdf` } : undefined, await loadReportLogo());
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${name}.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadPrintableTeacherReport(student: StudentProfile, report: ComprehensiveAssessmentReport, language: Language = 'es') {
  void downloadReport(student, report, language, 'teacher');
}

export function downloadPrintableFamilyReport(student: StudentProfile, report: ComprehensiveAssessmentReport, language: Language = 'es') {
  void downloadReport(student, report, language, 'family');
}
