import { ComprehensiveAssessmentReport, StudentProfile } from '../types';

export function executeBrowserPrint(): boolean {
  try {
    if (typeof window !== 'undefined') {
      window.focus();
      // Brief timeout to ensure focus is active in iframe
      setTimeout(() => {
        window.print();
      }, 50);
      return true;
    }
  } catch (err) {
    console.warn('Browser print failed or was blocked by iframe:', err);
  }
  return false;
}

export function downloadPrintableTeacherReport(student: StudentProfile, report: ComprehensiveAssessmentReport) {
  const completedCount = report.completedActivities.length;
  const pendingCount = report.pendingActivities.length;

  const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Informe Panel Profesional - ${student.nameOrAlias} - Talento sin Fronteras</title>
  <style>
    @page { size: A4; margin: 18mm; }
    body {
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      line-height: 1.5;
      padding: 24px;
      max-width: 820px;
      margin: 0 auto;
      background: #ffffff;
    }
    .header {
      border-bottom: 2px solid #4f46e5;
      padding-bottom: 12px;
      margin-bottom: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .title {
      font-size: 22px;
      font-weight: 800;
      color: #1e1b4b;
      margin: 0;
    }
    .subtitle {
      font-size: 13px;
      color: #64748b;
      margin-top: 3px;
    }
    .badge-positive {
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      display: inline-block;
    }
    .badge-pending {
      background: #fffbeb;
      color: #92400e;
      border: 1px solid #fde68a;
      padding: 3px 8px;
      border-radius: 9999px;
      font-size: 10px;
      font-weight: 700;
    }
    .badge-done {
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
      padding: 3px 8px;
      border-radius: 9999px;
      font-size: 10px;
      font-weight: 700;
    }
    .student-info {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px;
      margin-bottom: 20px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      font-size: 12px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 800;
      color: #312e81;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      margin-top: 22px;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .card {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 12px;
      margin-bottom: 10px;
      page-break-inside: avoid;
      background: #ffffff;
    }
    .card-title {
      font-size: 13px;
      font-weight: 700;
      color: #1e293b;
    }
    .card-desc {
      font-size: 12px;
      color: #475569;
      margin: 4px 0 6px 0;
    }
    .evidence-list {
      margin: 4px 0;
      padding-left: 18px;
      font-size: 11.5px;
      color: #334155;
    }
    .suggestion-box {
      background: #eff6ff;
      border-left: 3px solid #3b82f6;
      padding: 6px 10px;
      font-size: 11.5px;
      color: #1e40af;
      margin-top: 6px;
      border-radius: 0 6px 6px 0;
    }
    .percentage-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 12px;
    }
    .percentage-card {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 10px;
      background: #f8fafc;
      font-size: 11.5px;
    }
    .percentage-bar-bg {
      background: #e2e8f0;
      border-radius: 9999px;
      height: 6px;
      overflow: hidden;
      margin-top: 4px;
      margin-bottom: 4px;
    }
    .percentage-bar-fill {
      height: 100%;
      background: #4f46e5;
    }
    .analysis-box {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      padding: 14px;
      margin-bottom: 16px;
      font-size: 12px;
      line-height: 1.6;
    }
    .footer-stamp {
      margin-top: 36px;
      border-top: 1px solid #cbd5e1;
      padding-top: 14px;
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #64748b;
    }
    .signature-line {
      margin-top: 36px;
      border-top: 1px dashed #94a3b8;
      width: 220px;
      text-align: center;
      padding-top: 4px;
      font-size: 11px;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 16px; text-align: right;">
    <button onclick="window.print()" style="background:#4f46e5;color:white;border:none;padding:8px 16px;border-radius:8px;cursor:pointer;font-weight:bold;font-size:12px;">
      🖨️ Imprimir / Guardar como PDF
    </button>
  </div>

  <div class="header">
    <div>
      <h1 class="title">Talento sin Fronteras</h1>
      <div class="subtitle">Informe Oficial del Panel Profesional • Orientación y Aprendizaje Personalizado</div>
    </div>
    <div class="badge-positive">Evaluación sin Etiquetas (R14-R15)</div>
  </div>

  <div class="student-info">
    <div><strong>Estudiante / Alias:</strong> ${student.avatar} ${student.nameOrAlias}</div>
    <div><strong>Edad / Género:</strong> ${student.age || 9} años • ${student.gender === 'female' ? 'Chica' : student.gender === 'male' ? 'Chico' : 'Sin especificar'}</div>
    <div><strong>Fecha de emisión:</strong> ${new Date(report.generatedAt).toLocaleDateString()}</div>
    <div><strong>Actividades completadas:</strong> ${completedCount} de 10 (${Math.round((completedCount / 10) * 100)}%)</div>
    <div><strong>Estrellas de esfuerzo:</strong> ${student.starsCount || 0} ⭐</div>
    <div><strong>Total sesiones de juego:</strong> ${report.totalSessionsAnalyzed}</div>
  </div>

  <!-- SECCIÓN: ESTADO DE ACTIVIDADES (REALIZADAS VS PENDIENTES) -->
  <div class="section-title">1. Estado y Registro de Actividades del Alumno</div>
  <div style="font-size:12px;color:#475569;margin-bottom:8px;">
    Solo las actividades completadas contienen observaciones directas. Las actividades no realizadas figuran explícitamente como «Pendiente de realizar».
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
    <div style="border:1px solid #a7f3d0;border-radius:10px;padding:10px;background:#f0fdf4;">
      <strong style="color:#065f46;font-size:12px;">✓ Actividades Realizadas (${completedCount})</strong>
      <div style="font-size:11px;color:#1e293b;margin-top:6px;">
        ${report.completedActivities.length > 0 ? report.completedActivities.map(a => `
          <div style="margin-bottom:6px;border-bottom:1px solid #dcfce7;padding-bottom:4px;">
            <strong>${a.icon} ${a.name}</strong> • ${a.scorePercent}% • <em>${a.durationSeconds}s (${a.attemptsCount} intentos)</em>
            <ul style="margin:2px 0 0 16px;color:#334155;">
              ${a.notesObserved?.map(n => `<li>${n}</li>`).join('') || ''}
            </ul>
          </div>
        `).join('') : '<div style="color:#64748b;font-style:italic;">Ninguna actividad realizada aún.</div>'}
      </div>
    </div>

    <div style="border:1px solid #fde68a;border-radius:10px;padding:10px;background:#fffbeb;">
      <strong style="color:#92400e;font-size:12px;">⏳ Actividades Pendientes de Realizar (${pendingCount})</strong>
      <div style="font-size:11px;color:#1e293b;margin-top:6px;">
        ${report.pendingActivities.length > 0 ? report.pendingActivities.map(a => `
          <div style="margin-bottom:5px;">
            <span class="badge-pending">Pendiente</span> <strong>${a.icon} ${a.name}</strong>
            <span style="color:#64748b;">— ${a.subtitle}</span>
          </div>
        `).join('') : '<div style="color:#065f46;">¡Todas las actividades han sido completadas!</div>'}
      </div>
    </div>
  </div>

  <!-- SECCIÓN: PORCENTAJES DE HABILIDADES, INTERESES Y FORTALEZAS -->
  <div class="section-title">2. Métricas y Porcentajes de Habilidades, Intereses y Fortalezas</div>
  <div class="percentage-grid">
    
    <!-- Habilidades -->
    <div class="percentage-card">
      <strong style="color:#312e81;">Porcentajes de Habilidades</strong>
      <div style="margin-top:6px;">
        ${report.skillsPercentages.map(sk => `
          <div style="margin-bottom:5px;">
            <div style="display:flex;justify-content:space-between;font-size:11px;">
              <span>${sk.icon} ${sk.name}</span>
              <strong>${sk.status === 'evaluada' ? `${sk.percentage}%` : '0% (Pendiente)'}</strong>
            </div>
            <div class="percentage-bar-bg">
              <div class="percentage-bar-fill" style="width:${sk.percentage}%;"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Intereses -->
    <div class="percentage-card">
      <strong style="color:#b45309;">Porcentajes de Intereses (Mundos)</strong>
      <div style="margin-top:6px;">
        ${report.interestsPercentages.map(i => `
          <div style="margin-bottom:5px;">
            <div style="display:flex;justify-content:space-between;font-size:11px;">
              <span>${i.icon} ${i.name.split('(')[0]}</span>
              <strong>${i.percentage}% (${i.visits})</strong>
            </div>
            <div class="percentage-bar-bg">
              <div class="percentage-bar-fill" style="background:#f59e0b;width:${i.percentage}%;"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Fortalezas -->
    <div class="percentage-card">
      <strong style="color:#047857;">Consolidación de Fortalezas</strong>
      <div style="text-align:center;margin:8px 0;">
        <div style="font-size:24px;font-weight:900;color:#059669;">
          ${report.strengthsBreakdown.consolidationPercentage}%
        </div>
        <div style="font-size:10px;color:#64748b;">Índice Global de Consolidación</div>
      </div>
      <div style="font-size:10.5px;color:#334155;border-top:1px solid #e2e8f0;padding-top:6px;">
        <div>⭐ Destaca: <strong>${report.strengthsBreakdown.highlightedCount} (${report.strengthsBreakdown.highlightedPct}%)</strong></div>
        <div style="margin-top:3px;">✓ Destreza sólida: <strong>${report.strengthsBreakdown.solidCount} (${report.strengthsBreakdown.solidPct}%)</strong></div>
        <div style="margin-top:3px;">⏳ En observación: <strong>${report.strengthsBreakdown.observingCount} (${report.strengthsBreakdown.observingPct}%)</strong></div>
      </div>
    </div>

  </div>

  <!-- SECCIÓN: ANÁLISIS PEDAGÓGICO INTEGRAL -->
  <div class="section-title">3. ${report.pedagogicalAnalysis.title}</div>
  <div class="analysis-box">
    <div style="margin-bottom:8px;">
      <strong style="color:#312e81;">Síntesis Evolutiva del Alumno:</strong>
      <p style="margin:2px 0 0 0;">${report.pedagogicalAnalysis.overallSynthesis}</p>
    </div>
    <div style="margin-bottom:8px;">
      <strong style="color:#b45309;">Correlación Intereses - Habilidades:</strong>
      <p style="margin:2px 0 0 0;">${report.pedagogicalAnalysis.interestSkillCorrelation}</p>
    </div>
    <div style="margin-bottom:8px;">
      <strong style="color:#047857;">Perseverancia y Resolución de Problemas:</strong>
      <p style="margin:2px 0 0 0;">${report.pedagogicalAnalysis.resilienceEvaluation}</p>
    </div>
    <div>
      <strong style="color:#0e7490;">Orientación para la Diferenciación en el Aula:</strong>
      <p style="margin:2px 0 0 0;">${report.pedagogicalAnalysis.classroomDifferentiationAdvice}</p>
    </div>
  </div>

  <!-- SECCIÓN: FORTALEZAS OBSERVADAS -->
  <div class="section-title">4. Perfil de Fortalezas Observadas y Evidencias de Juego</div>
  ${report.strengths.map(s => `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span class="card-title">${s.title}</span>
        <span class="${s.levelDescription === 'destaca' ? 'badge-positive' : s.levelDescription === 'destreza_solida' ? 'badge-positive' : 'badge-pending'}">
          ${s.levelDescription === 'destaca' ? '⭐ Destaca' : s.levelDescription === 'destreza_solida' ? '✓ Destreza Sólida' : '⏳ En Observación'}
        </span>
      </div>
      <p class="card-desc">${s.description}</p>
      <strong>Evidencias registradas:</strong>
      <ul class="evidence-list">
        ${s.evidenceItems.map(ev => `<li>${ev}</li>`).join('')}
      </ul>
      <div class="suggestion-box">
        <strong>Sugerencia para el aula:</strong> ${s.classroomSuggestions[0]}
      </div>
    </div>
  `).join('')}

  <!-- SECCIÓN: RECOMENDACIONES DE AULA -->
  <div class="section-title">5. 3 Recomendaciones Pedagógicas para el Aula (R13)</div>
  ${report.classroomRecommendations.map(rec => `
    <div class="card" style="background:#fafafa;">
      <strong>${rec.headline}</strong>
      <p style="font-size:12px;margin:4px 0;">${rec.actionableDetail}</p>
      <div style="font-size:11px;color:#64748b;">${rec.evidenceContext}</div>
    </div>
  `).join('')}

  <!-- SECCIÓN: AJUSTES NEURODIVERGENTES -->
  <div class="section-title">6. Ajustes Sensoriales y Razonables Recomendados</div>
  <ul class="evidence-list">
    ${report.neurodivergentAccommodations.map(a => `<li>${a}</li>`).join('')}
  </ul>

  ${student.teacherValidation?.teacherNotes ? `
    <div class="section-title">7. Observaciones Cualitativas del Profesional / Orientador</div>
    <div class="card" style="background:#fefce8;border-color:#fef08a;">
      <p style="font-size:12px;margin:0;">${student.teacherValidation.teacherNotes}</p>
    </div>
  ` : ''}

  <div class="footer-stamp">
    <div>
      <div>Talento sin Fronteras • Panel Profesional</div>
      <div style="font-size:10px;margin-top:2px;">Documento cualitativo libre de puntuaciones de CI o términos de déficit. Cumplimiento Reto 20 (R1-R15).</div>
    </div>
    <div class="signature-line">
      Firma del Profesional / Orientador
    </div>
  </div>
</body>
</html>`;

  // Create downloadable file
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Informe_Panel_Profesional_${student.nameOrAlias.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadPrintableFamilyReport(student: StudentProfile, report: ComprehensiveAssessmentReport) {
  const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Resumen para la Familia - ${student.nameOrAlias} - Talento sin Fronteras</title>
  <style>
    @page { size: A4; margin: 20mm; }
    body {
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      line-height: 1.6;
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      border-bottom: 2px solid #e11d48;
      padding-bottom: 12px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .title {
      font-size: 22px;
      font-weight: 800;
      color: #881337;
      margin: 0;
    }
    .badge {
      background: #ffe4e6;
      color: #9f1239;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: bold;
    }
    .letter-box {
      background: #fff1f2;
      border: 1px solid #fecdd3;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 24px;
      font-size: 14px;
    }
    .greeting {
      font-weight: 800;
      font-size: 16px;
      color: #9f1239;
      margin-bottom: 8px;
    }
    .activity-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 14px;
    }
    .activity-card {
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      padding: 12px;
      background: #f8fafc;
      font-size: 12px;
    }
    .closing {
      font-weight: 700;
      color: #9f1239;
      text-align: center;
      margin-top: 24px;
      font-size: 15px;
    }
    @media print {
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 16px; text-align: right;">
    <button onclick="window.print()" style="background:#e11d48;color:white;border:none;padding:8px 16px;border-radius:8px;cursor:pointer;font-weight:bold;">
      🖨️ Imprimir / Guardar Resumen Familiar (PDF)
    </button>
  </div>

  <div class="header">
    <div>
      <h1 class="title">Talento sin Fronteras</h1>
      <div style="font-size:13px;color:#64748b;">Celebrando los talentos de ${student.nameOrAlias}</div>
    </div>
    <div class="badge">Espacio Familiar</div>
  </div>

  <div class="letter-box">
    <div class="greeting">${report.familyLetter.greeting}</div>
    <p>${report.familyLetter.positiveSummary}</p>
  </div>

  <div style="margin-top:20px;">
    <h3 style="font-size:15px;font-weight:700;color:#881337;margin-bottom:8px;">
      Lo que más le gusta y sus fortalezas:
    </h3>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:14px;font-size:13px;">
      <div>⭐ <strong>Intereses principales:</strong> ${report.primaryInterests.map(i => i.name).join(', ')}</div>
      <div style="margin-top:6px;">❤️ <strong>Fortaleza destacada:</strong> ${report.strengths[0]?.title || 'Gran curiosidad y creatividad'}</div>
      <div style="margin-top:6px;">🏅 <strong>Estrellas de esfuerzo:</strong> ${student.starsCount || 0} estrellas conseguidas en sus sesiones</div>
    </div>
  </div>

  <div style="margin-top:24px;">
    <h3 style="font-size:15px;font-weight:700;color:#881337;margin-bottom:8px;">
      3 Ideas divertidas para hacer juntos en casa:
    </h3>
    <div class="activity-grid">
      ${report.familyLetter.homeActivities.map((act, i) => `
        <div class="activity-card">
          <div style="font-weight:bold;color:#e11d48;margin-bottom:4px;">Idea ${i + 1}</div>
          <div>${act}</div>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="closing">
    ${report.familyLetter.closing}
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Resumen_Familiar_${student.nameOrAlias.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
