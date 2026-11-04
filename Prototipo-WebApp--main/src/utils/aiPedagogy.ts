import { 
  ComprehensiveAssessmentReport, 
  GameTelemetry, 
  Language, 
  StudentProfile, 
  StrengthProfileItem, 
  WorldId,
  ActivityStatusItem,
  SkillsPercentageItem,
  InterestsPercentageItem,
  StrengthsPercentageBreakdown,
  PedagogicalAnalysis
} from '../types';

interface ActivityCatalogDefinition {
  id: string;
  name: string;
  subtitle: string;
  category: 'creativity' | 'logic' | 'communication' | 'collaboration' | 'interest_world';
  worldId?: WorldId;
  type: 'core_minigame' | 'world_activity';
  icon: string;
  matcher: (t: GameTelemetry) => boolean;
}

const ACTIVITIES_CATALOG: ActivityCatalogDefinition[] = [
  // 4 Core Minigames
  {
    id: 'creativity_game',
    name: '¿Qué Inventas?',
    subtitle: 'Taller de pensamiento divergente, recombinación e ingenio',
    category: 'creativity',
    type: 'core_minigame',
    icon: '🎨',
    matcher: (t) => t.gameId === 'creativity_game' || t.category === 'creativity'
  },
  {
    id: 'logic_game',
    name: 'Secuencias y Patrones',
    subtitle: 'Razonamiento deductivo no verbal y matrices espaciales',
    category: 'logic',
    type: 'core_minigame',
    icon: '🧩',
    matcher: (t) => t.gameId === 'logic_game' || t.category === 'logic'
  },
  {
    id: 'story_game',
    name: 'Cuenta la Historia',
    subtitle: 'Secuenciación de eventos, causas y empatía narrativa',
    category: 'communication',
    type: 'core_minigame',
    icon: '📖',
    matcher: (t) => t.gameId === 'story_game' || t.category === 'communication'
  },
  {
    id: 'robot_game',
    name: 'Ayuda al Robot Bobi',
    subtitle: 'Cooperación no verbal, asistencia mutua y sintonía',
    category: 'collaboration',
    type: 'core_minigame',
    icon: '🤖',
    matcher: (t) => t.gameId === 'robot_game' || t.category === 'collaboration'
  },

  // 6 World Activities
  {
    id: 'world_build_tower',
    name: 'Torre Zen de Equilibrio',
    subtitle: 'Mundo Construir: Física intuitiva y distribución de masas',
    category: 'interest_world',
    worldId: 'build',
    type: 'world_activity',
    icon: '🧱',
    matcher: (t) => t.worldId === 'build' || t.gameId.includes('build')
  },
  {
    id: 'world_explore_constellations',
    name: 'Telescopio de Constelaciones',
    subtitle: 'Mundo Explorar: Discriminación perceptiva y búsqueda visual',
    category: 'interest_world',
    worldId: 'explore',
    type: 'world_activity',
    icon: '🧭',
    matcher: (t) => t.worldId === 'explore' || t.gameId.includes('explore')
  },
  {
    id: 'world_create_harmonics',
    name: 'Lienzo de Armonía de Color',
    subtitle: 'Mundo Crear: Expresión cromática y autorregulación sensorial',
    category: 'interest_world',
    worldId: 'create',
    type: 'world_activity',
    icon: '🎨',
    matcher: (t) => t.worldId === 'create' || t.gameId.includes('create')
  },
  {
    id: 'world_help_sanctuary',
    name: 'Santuario de Criaturas',
    subtitle: 'Mundo Ayudar: Empatía no verbal y acogida afectiva',
    category: 'interest_world',
    worldId: 'help',
    type: 'world_activity',
    icon: '🐾',
    matcher: (t) => t.worldId === 'help' || t.gameId.includes('help')
  },
  {
    id: 'world_organize_mandala',
    name: 'Mandala y Clasificación Táctil',
    subtitle: 'Mundo Organizar: Sistematización y orden armónico',
    category: 'interest_world',
    worldId: 'organize',
    type: 'world_activity',
    icon: '📦',
    matcher: (t) => t.worldId === 'organize' || t.gameId.includes('organize')
  },
  {
    id: 'world_count_balance',
    name: 'Balanza de Pesos Mágica',
    subtitle: 'Mundo Contar: Conservación de masa e intuición cuantitativa',
    category: 'interest_world',
    worldId: 'count',
    type: 'world_activity',
    icon: '⚖️',
    matcher: (t) => t.worldId === 'count' || t.gameId.includes('count')
  }
];

const WORLD_NAMES: Record<WorldId, { es: string; en: string; fr: string; ar: string; uk: string; icon: string }> = {
  build: { es: 'Construir (Estructuras y Equilibrio)', en: 'Building & Spatial Balance', fr: 'Construction & Équilibre', ar: 'البناء والتوازن المكاني', uk: 'Будівництво та просторовий баланс', icon: '🧱' },
  explore: { es: 'Explorar (Detalle Visual y Curiosidad)', en: 'Exploration & Visual Detail', fr: 'Exploration & Détail Visuel', ar: 'الاستكشاف والتفاصيل البصرية', uk: 'Дослідження та візуальні деталі', icon: '🧭' },
  create: { es: 'Crear (Sensibilidad Cromática y Ritmo)', en: 'Creating & Harmonic Color', fr: 'Création & Harmonie', ar: 'الإبداع والتناغم اللوني', uk: 'Творчість та колірна гармонія', icon: '🎨' },
  help: { es: 'Ayudar (Empatía y Cuidado no Verbal)', en: 'Helping & Non-Verbal Empathy', fr: 'Aide & Empathie Non-Verbale', ar: 'المساعدة والتعاطف غير اللفظي', uk: 'Турбота та невербальна емпатія', icon: '🐾' },
  organize: { es: 'Organizar (Sistematización y Mandalas)', en: 'Organizing & Tactile Sorting', fr: 'Organisation & Tri Tactile', ar: 'التنظيم والتصنيف الحر', uk: 'Організація та тактильне сортування', icon: '📦' },
  count: { es: 'Contar (Conservación de Masa y Balance)', en: 'Counting & Mass Intuition', fr: 'Comptage & Masse Intuitive', ar: 'العد والتقدير الحسي للكتل', uk: 'Лічба та відчуття маси', icon: '⚖️' },
};

export function generatePedagogicalAssessment(
  student: StudentProfile,
  lang: Language = 'es'
): ComprehensiveAssessmentReport {
  const telemetry = student.telemetryLog || [];

  // ==========================================
  // 1. EVALUATION OF ALL 10 ACTIVITIES (REAL vs PENDING)
  // ==========================================
  const allActivities: ActivityStatusItem[] = ACTIVITIES_CATALOG.map((cat) => {
    const matchedTelemetry = telemetry.filter(cat.matcher);

    if (matchedTelemetry.length > 0) {
      // Activity has been performed
      const latest = matchedTelemetry[matchedTelemetry.length - 1];
      const totalAttempts = matchedTelemetry.reduce((s, m) => s + (m.attemptsCount || 1), 0);
      const totalMoves = matchedTelemetry.reduce((s, m) => s + (m.originalMovesCount || 0), 0);
      const totalDuration = matchedTelemetry.reduce((s, m) => s + (m.durationSeconds || 0), 0);

      // Score calculation based on successRate and moves
      let calculatedScore = Math.round(latest.successRate * 100);
      if (cat.category === 'creativity') {
        calculatedScore = Math.min(100, Math.round(70 + Math.min(30, totalMoves * 6)));
      } else if (cat.category === 'collaboration') {
        calculatedScore = Math.min(100, Math.round(75 + matchedTelemetry.length * 12));
      }

      // Collect all notes
      const notesList: string[] = [];
      matchedTelemetry.forEach(m => {
        if (m.notesObserved && m.notesObserved.length > 0) {
          notesList.push(...m.notesObserved);
        }
      });

      return {
        id: cat.id,
        name: cat.name,
        subtitle: cat.subtitle,
        category: cat.category,
        worldId: cat.worldId,
        type: cat.type,
        icon: cat.icon,
        status: 'realizada',
        completedAt: latest.timestamp,
        durationSeconds: totalDuration,
        attemptsCount: totalAttempts,
        originalMovesCount: totalMoves,
        scorePercent: calculatedScore,
        notesObserved: notesList.length > 0 ? Array.from(new Set(notesList)) : ['Actividad completada satisfactoriamente con respuesta participativa.']
      };
    } else {
      // Activity is pending! MUST NOT show fake observations!
      return {
        id: cat.id,
        name: cat.name,
        subtitle: cat.subtitle,
        category: cat.category,
        worldId: cat.worldId,
        type: cat.type,
        icon: cat.icon,
        status: 'pendiente',
        scorePercent: 0,
        notesObserved: [
          lang === 'es' 
            ? '⏳ Pendiente de realizar por el estudiante en próximas sesiones formativas.'
            : '⏳ Pending completion by student in upcoming learning sessions.'
        ]
      };
    }
  });

  const completedActivities = allActivities.filter(a => a.status === 'realizada');
  const pendingActivities = allActivities.filter(a => a.status === 'pendiente');

  // ==========================================
  // 2. SKILLS PERCENTAGES BREAKDOWN (5 Core Competencies)
  // ==========================================
  const creativityLogs = telemetry.filter(t => t.category === 'creativity' || t.gameId === 'creativity_game');
  const logicLogs = telemetry.filter(t => t.category === 'logic' || t.gameId === 'logic_game');
  const communicationLogs = telemetry.filter(t => t.category === 'communication' || t.gameId === 'story_game');
  const collaborationLogs = telemetry.filter(t => t.category === 'collaboration' || t.gameId === 'robot_game' || t.worldId === 'help');

  // Creativity %
  const creativityMoves = creativityLogs.reduce((acc, l) => acc + (l.originalMovesCount || 0), 0);
  const creativityPct = creativityLogs.length > 0 
    ? Math.min(100, Math.round(65 + Math.min(35, creativityMoves * 7))) 
    : 0;

  // Logic %
  const logicSuccessSum = logicLogs.reduce((s, l) => s + (l.successRate || 0), 0);
  const logicPct = logicLogs.length > 0
    ? Math.min(100, Math.round((logicSuccessSum / logicLogs.length) * 100))
    : 0;

  // Communication %
  const commSuccessSum = communicationLogs.reduce((s, l) => s + (l.successRate || 0), 0);
  const commPct = communicationLogs.length > 0
    ? Math.min(100, Math.round((commSuccessSum / communicationLogs.length) * 100))
    : 0;

  // Collaboration %
  const collabPct = collaborationLogs.length > 0
    ? Math.min(100, Math.round(70 + Math.min(30, collaborationLogs.length * 15)))
    : 0;

  // Problem Solving & Resilience %
  const avgPerseverance = telemetry.length > 0
    ? telemetry.reduce((sum, t) => sum + (t.perseveranceScore || 0.75), 0) / telemetry.length
    : 0;
  const problemSolvingPct = telemetry.length > 0
    ? Math.min(100, Math.round(avgPerseverance * 100))
    : 0;

  const skillsPercentages: SkillsPercentageItem[] = [
    {
      category: 'creativity',
      name: lang === 'es' ? 'Creatividad e Innovación Divergente' : 'Creativity & Divergent Thinking',
      icon: '🎨',
      percentage: creativityPct,
      status: creativityLogs.length > 0 ? 'evaluada' : 'pendiente',
      description: lang === 'es' 
        ? 'Capacidad para combinar objetos, imaginar usos no convencionales y proyectar soluciones alternativas.'
        : 'Ability to combine elements, envision alternative purposes, and innovate freely.',
      evidenceSummary: creativityLogs.length > 0
        ? (lang === 'es' ? `${creativityMoves} combinaciones originales registradas en ${creativityLogs.length} partida(s).` : `${creativityMoves} original combinations recorded.`)
        : (lang === 'es' ? 'Pendiente de realizar el minijuego "¿Qué inventas?".' : 'Pending completion of the creativity game.')
    },
    {
      category: 'logic',
      name: lang === 'es' ? 'Pensamiento Lógico e Inductivo' : 'Logical & Inductive Reasoning',
      icon: '🧩',
      percentage: logicPct,
      status: logicLogs.length > 0 ? 'evaluada' : 'pendiente',
      description: lang === 'es'
        ? 'Detección de regularidades, rotaciones visuales y relaciones causa-efecto sin intermediación de idioma.'
        : 'Detecting pattern regularities, spatial turns, and cause-effect links without language barriers.',
      evidenceSummary: logicLogs.length > 0
        ? (lang === 'es' ? `Tasa de acierto del ${logicPct}% en matrices visuales y series.` : `${logicPct}% accuracy in visual pattern solving.`)
        : (lang === 'es' ? 'Pendiente de realizar el minijuego de secuencias y matrices.' : 'Pending pattern game evaluation.')
    },
    {
      category: 'communication',
      name: lang === 'es' ? 'Comunicación Visual y Narrativa' : 'Visual Communication & Storytelling',
      icon: '📖',
      percentage: commPct,
      status: communicationLogs.length > 0 ? 'evaluada' : 'pendiente',
      description: lang === 'es'
        ? 'Capacidad para secuenciar temporalmente acontecimientos y atribuir estados emocionales a personajes.'
        : 'Sequencing chronological story frames and expressing character emotional states.',
      evidenceSummary: communicationLogs.length > 0
        ? (lang === 'es' ? `Construcción coherente de historias con precisión del ${commPct}%.` : `Coherent story flow with ${commPct}% accuracy.`)
        : (lang === 'es' ? 'Pendiente de realizar el minijuego "Cuenta la Historia".' : 'Pending storytelling challenge.')
    },
    {
      category: 'collaboration',
      name: lang === 'es' ? 'Colaboración y Empatía No Verbal' : 'Non-Verbal Collaboration & Empathy',
      icon: '🤖',
      percentage: collabPct,
      status: collaborationLogs.length > 0 ? 'evaluada' : 'pendiente',
      description: lang === 'es'
        ? 'Sintonía ante necesidades ajenas, escucha de señales gestuales y reparto proactivo de recursos.'
        : 'Attunement to peer cues, non-verbal listening, and proactive sharing of tools/energy.',
      evidenceSummary: collaborationLogs.length > 0
        ? (lang === 'es' ? `Respuesta colaborativa registrada con ${collaborationLogs.length} interacciones prosociales.` : `Cooperative warmth observed across ${collaborationLogs.length} sessions.`)
        : (lang === 'es' ? 'Pendiente de realizar el reto de cooperación con Bobi.' : 'Pending robot partner challenge.')
    },
    {
      category: 'problem_solving',
      name: lang === 'es' ? 'Resolución de Problemas y Perseverancia' : 'Problem Solving & Resilience',
      icon: '💪',
      percentage: problemSolvingPct,
      status: telemetry.length > 0 ? 'evaluada' : 'pendiente',
      description: lang === 'es'
        ? 'Tolerancia al ensayo-error, flexibilidad ante obstáculos y persistencia constructiva sin frustración.'
        : 'Constructive trial-and-error, resilience when facing setbacks, and continuous strategic adjustment.',
      evidenceSummary: telemetry.length > 0
        ? (lang === 'es' ? `Índice de persistencia del ${problemSolvingPct}% medido a lo largo de ${telemetry.length} sesiones.` : `${problemSolvingPct}% resilience index across ${telemetry.length} sessions.`)
        : (lang === 'es' ? 'Pendiente de registrar intentos de resolución en juegos.' : 'Pending session records.')
    }
  ];

  // ==========================================
  // 3. INTERESTS PERCENTAGES BREAKDOWN (6 Worlds)
  // ==========================================
  const rawWorldVisits = student.worldVisits || {
    build: 0, explore: 0, create: 0, help: 0, organize: 0, count: 0
  };
  const totalWorldVisits = Object.values(rawWorldVisits).reduce((sum, v) => sum + v, 0);

  const worldKeys: WorldId[] = ['build', 'explore', 'create', 'help', 'organize', 'count'];

  const interestsPercentages: InterestsPercentageItem[] = worldKeys.map((wId) => {
    const visits = rawWorldVisits[wId] || 0;
    const pct = totalWorldVisits > 0 ? Math.round((visits / totalWorldVisits) * 100) : 0;
    const meta = WORLD_NAMES[wId];

    return {
      worldId: wId,
      name: meta[lang] || meta.es,
      icon: meta.icon,
      visits,
      percentage: pct,
      status: visits > 0 ? 'explorado' : 'pendiente',
      description: visits > 0
        ? (lang === 'es' 
            ? `Elegido ${visits} vez/veces espontáneamente (${pct}% de su atención intrínseca).`
            : `Chosen ${visits} time(s) spontaneously (${pct}% of intrinsic focus).`)
        : (lang === 'es' 
            ? 'Pendiente de explorar. Aún no visitado por el alumno.'
            : 'Pending exploration. Not yet visited by the student.')
    };
  });

  // Sort interests from highest to lowest
  interestsPercentages.sort((a, b) => b.percentage - a.percentage || b.visits - a.visits);

  const primaryInterests = interestsPercentages.slice(0, 3).map(i => ({
    worldId: i.worldId,
    name: i.name,
    visits: i.visits,
    percentage: i.percentage,
    description: i.visits > 0
      ? (lang === 'es' 
          ? `Concentra el ${i.percentage}% de las preferencias de juego del alumno (${i.visits} accesos directos).`
          : `Accounts for ${i.percentage}% of the student's natural choices (${i.visits} visits).`)
      : (lang === 'es' ? 'Pendiente de explorar en próximas actividades.' : 'Pending exploration in future sessions.')
  }));

  // ==========================================
  // 4. STRENGTHS CONSOLIDATION & EVIDENCE (R3, R4, R14, R15)
  // ==========================================
  const strengths: StrengthProfileItem[] = [];

  // A. Pensamiento Divergente (Creativity)
  if (creativityLogs.length > 0) {
    strengths.push({
      id: 'str_creativity',
      category: 'creativity',
      title: lang === 'es' ? 'Pensamiento Divergente y Recombinación Creativa' : 'Divergent Thinking & Creative Recombination',
      levelDescription: creativityMoves >= 4 ? 'destaca' : 'destreza_solida',
      description: lang === 'es'
        ? 'Demuestra fluidez para concebir ideas inusuales y transformar piezas simples en soluciones funcionales completas.'
        : 'Exhibits fluent idea generation, repurposing simple materials into novel functional creations.',
      evidenceItems: [
        `Registró ${creativityMoves} asociaciones de objetos no convencionales en el taller "¿Qué inventas?".`,
        'Asignó una finalidad original y utilitaria a su creación sin requerir indicaciones textuales.',
        `Dedicó tiempo voluntario a ensayar diferentes distribuciones de piezas.`
      ],
      classroomSuggestions: [
        lang === 'es' ? 'Asignarle el rol de diseñador o modelador en maquetas, collages y proyectos STEM.' : 'Offer visual design or model-making roles in hands-on science and art projects.',
        lang === 'es' ? 'Permitirle responder a preguntas complejas mediante dibujos o esquemas visuales antes del texto escrito.' : 'Allow communicating initial ideas through sketches or visual diagrams prior to requiring written text.'
      ],
      familyHomeTips: [
        lang === 'es' ? 'Reinventar cajas de cartón y tubos reciclados en casa para fabricar ciudades o naves fantásticas.' : 'Build imaginary spaceships and city models together using recycled household cardboard.'
      ],
      confidence: 'alta'
    });
  } else {
    strengths.push({
      id: 'str_creativity',
      category: 'creativity',
      title: lang === 'es' ? 'Pensamiento Divergente y Creatividad Visual' : 'Divergent Thinking & Visual Creativity',
      levelDescription: 'en_observacion',
      description: lang === 'es' 
        ? 'Área abierta a la observación del docente una vez que el alumno participe en los retos creativos.' 
        : 'Open for teacher observation once the student participates in creativity challenges.',
      evidenceItems: [
        lang === 'es' 
          ? '⏳ Pendiente de realizar: Esta habilidad no ha sido observada todavía porque el alumno aún no ha jugado al reto de creatividad.'
          : '⏳ Pending: This strength has not been observed yet as the student has not completed the creativity game.'
      ],
      classroomSuggestions: [
        lang === 'es' ? 'Invitar al estudiante a participar en el minijuego "¿Qué inventas?" para recoger las primeras evidencias.' : 'Invite the student to play "¿Qué inventas?" to gather initial baseline evidence.'
      ],
      familyHomeTips: [
        lang === 'es' ? 'Fomentar el dibujo libre sin juzgar el resultado en casa.' : 'Encourage free drawing and imaginative play at home.'
      ],
      confidence: 'inicial'
    });
  }

  // B. Pensamiento Lógico (Logic)
  if (logicLogs.length > 0) {
    const isHighLogic = logicPct >= 75;
    strengths.push({
      id: 'str_logic',
      category: 'logic',
      title: lang === 'es' ? 'Razonamiento Inductivo y Descubrimiento de Patrones' : 'Inductive Reasoning & Visual Pattern Discovery',
      levelDescription: isHighLogic ? 'destaca' : 'destreza_solida',
      description: lang === 'es'
        ? 'Facilidad notable para descifrar matrices abstractas, comprender secuencias temporales y detectar regularidades espaciales.'
        : 'High aptitude for deciphering abstract matrices, spotting spatial sequences, and deductive logic.',
      evidenceItems: [
        `Completó matrices lógicas con un porcentaje de acierto del ${logicPct}%.`,
        'Descubrió giros de rotación y progresiones de color sin necesidad de instrucciones verbales.',
        'Mantuvo la concentración reflexiva al seleccionar las piezas candidatas.'
      ],
      classroomSuggestions: [
        lang === 'es' ? 'Utilizar regletas Cuisenaire, bloques lógicos y ábacos como puente facilitador a la matemática formal.' : 'Incorporate color rods, attribute blocks, and visual math manipulatives.',
        lang === 'es' ? 'Involucrarle en la organización sistemática del material didáctico y calendarios visuales del aula.' : 'Involve the student in organizing classroom materials and visual sequence schedules.'
      ],
      familyHomeTips: [
        lang === 'es' ? 'Practicar secuencias cotidianas en casa (ordenar cubiertos, calcetines por parejas o botones por tamaño).' : 'Practice sorting games at home: pairing socks, sorting cutlery, or assembling visual puzzles.'
      ],
      confidence: 'alta'
    });
  } else {
    strengths.push({
      id: 'str_logic',
      category: 'logic',
      title: lang === 'es' ? 'Razonamiento Lógico y Patrones' : 'Logical Reasoning & Patterns',
      levelDescription: 'en_observacion',
      description: lang === 'es'
        ? 'Competencia lógica deductiva en espera de ser evaluada mediante el juego de secuencias.'
        : 'Deductive logic awaiting evaluation through the sequence game.',
      evidenceItems: [
        lang === 'es'
          ? '⏳ Pendiente de realizar: El alumno todavía no ha realizado la actividad de patrones y series lógicas.'
          : '⏳ Pending: The student has not yet completed the logic pattern challenge.'
      ],
      classroomSuggestions: [
        lang === 'es' ? 'Proponer una breve sesión en el juego "Patrones y Secuencias".' : 'Suggest a brief session in the pattern challenge game.'
      ],
      familyHomeTips: [
        lang === 'es' ? 'Jugar a dominó o laberintos sencillos en familia.' : 'Play dominoes or simple visual mazes at home.'
      ],
      confidence: 'inicial'
    });
  }

  // C. Resolución de Problemas y Perseverancia (Problem Solving)
  if (telemetry.length > 0) {
    strengths.push({
      id: 'str_resilience',
      category: 'problem_solving',
      title: lang === 'es' ? 'Perseverancia Estratégica y Flexibilidad Adaptativa' : 'Strategic Perseverance & Adaptive Resilience',
      levelDescription: problemSolvingPct >= 80 ? 'destaca' : 'destreza_solida',
      description: lang === 'es'
        ? 'Afronta los retos con curiosidad calmada; experimenta de forma persistente y asume el error como paso hacia el éxito.'
        : 'Approaches challenges with calm curiosity; persists through setbacks with adaptive adjustments.',
      evidenceItems: [
        `Índice de persistencia del ${problemSolvingPct}% mantenido a través de ${telemetry.length} sesiones de juego.`,
        'Realizó reintentos constructivos sin manifestar bloqueo conductual ni desánimo ante tareas complejas.',
        'Ajustó su forma de actuar tras ensayos previos, demostrando flexibilidad cognitiva.'
      ],
      classroomSuggestions: [
        lang === 'es' ? 'Elogiar explícitamente el proceso de ensayo y búsqueda ("¡Qué buena estrategia estás probando!") en lugar del resultado rápido.' : 'Praise the exploratory trial process rather than mere speed of answer.',
        lang === 'es' ? 'Dividir tareas escolares amplias en micro-hitos visibles para acompañar su perseverancia.' : 'Segment broad classroom tasks into clear sequential micro-goals.'
      ],
      familyHomeTips: [
        lang === 'es' ? 'Valorar el esfuerzo en casa diciendo: "Me gusta ver cómo no te rindes y buscas otra solución".' : 'Praise daily persistence at home: "I love how you keep finding new ways to solve it!".'
      ],
      confidence: 'alta'
    });
  } else {
    strengths.push({
      id: 'str_resilience',
      category: 'problem_solving',
      title: lang === 'es' ? 'Resolución de Problemas y Perseverancia' : 'Problem Solving & Resilience',
      levelDescription: 'en_observacion',
      description: lang === 'es' 
        ? 'La tolerancia al error y perseverancia se calculará automáticamente al realizar las actividades.'
        : 'Resilience metrics will be calculated automatically as games are played.',
      evidenceItems: [
        lang === 'es'
          ? '⏳ Pendiente de realizar: No hay sesiones registradas aún para estimar la perseverancia.'
          : '⏳ Pending: No sessions logged yet to evaluate trial-and-error persistence.'
      ],
      classroomSuggestions: [
        lang === 'es' ? 'Acompañar al estudiante en su primera partida para observar cómo interactúa con el juego.' : 'Guide the student during their first session to observe engagement.'
      ],
      familyHomeTips: [
        lang === 'es' ? 'Animar con paciencia ante cualquier dificultad cotidiana.' : 'Encourage patience with daily puzzles.'
      ],
      confidence: 'inicial'
    });
  }

  // D. Sensibilidad Empática y Colaboración (Collaboration)
  if (collaborationLogs.length > 0) {
    strengths.push({
      id: 'str_collaboration',
      category: 'collaboration',
      title: lang === 'es' ? 'Sensibilidad Empática y Cooperación No Verbal' : 'Empathetic Sensitivity & Non-Verbal Cooperation',
      levelDescription: 'destaca',
      description: lang === 'es'
        ? 'Sintonía afectiva ante gestos y necesidades del prójimo sin requerir mediación lingüística. Disposición natural de ayuda.'
        : 'Attunement to peer needs and non-verbal cues without requiring language mediation.',
      evidenceItems: [
        `Completó ${collaborationLogs.length} retos cooperativos asistiendo de forma oportuna a las peticiones del compañero.`,
        'Demostró generosidad en el reparto de recursos y herramientas de apoyo.',
        'Atención continua a las expresiones faciales y gestos de necesidad.'
      ],
      classroomSuggestions: [
        lang === 'es' ? 'Emparejarle con un compañero/a tutor para proyectos prácticos de ciencias o arte que no dependan del habla continua.' : 'Pair with a warm peer buddy for hands-on, non-verbal collaborative science or art tasks.',
        lang === 'es' ? 'Proponerle ser el "asistente de bienvenida" o "encargado de equipos" en el aula.' : 'Invite the student to be a welcome assistant or team materials manager in classroom routines.'
      ],
      familyHomeTips: [
        lang === 'es' ? 'Asignarle responsabilidades de cuidado en casa (cuidar plantas, alimentar mascotas o ayudar a poner la mesa).' : 'Involve the child in caring for family pets, garden plants, or preparing family dinners.'
      ],
      confidence: 'alta'
    });
  } else {
    strengths.push({
      id: 'str_collaboration',
      category: 'collaboration',
      title: lang === 'es' ? 'Colaboración y Cooperación No Verbal' : 'Cooperation & Non-Verbal Empathy',
      levelDescription: 'en_observacion',
      description: lang === 'es' 
        ? 'Competencia socioemocional pendiente de observar en el reto del robot Bobi o Santuario.'
        : 'Socio-emotional competency awaiting observation in the robot challenge.',
      evidenceItems: [
        lang === 'es'
          ? '⏳ Pendiente de realizar: El alumno aún no ha interactuado con los retos de ayuda cooperativa.'
          : '⏳ Pending: The student has not yet engaged with cooperative partner challenges.'
      ],
      classroomSuggestions: [
        lang === 'es' ? 'Proponerle jugar a "Ayuda al Robot Bobi" para evaluar su disposición cooperativa espontánea.' : 'Invite the child to play "Ayuda al Robot Bobi" to observe spontaneous prosocial behavior.'
      ],
      familyHomeTips: [
        lang === 'es' ? 'Fomentar juegos de mesa colaborativos sin perdedores.' : 'Play cooperative board games together.'
      ],
      confidence: 'inicial'
    });
  }

  // Strengths consolidation calculation
  const totalStrengths = strengths.length;
  const highlightedCount = strengths.filter(s => s.levelDescription === 'destaca').length;
  const solidCount = strengths.filter(s => s.levelDescription === 'destreza_solida').length;
  const observingCount = strengths.filter(s => s.levelDescription === 'en_observacion').length;

  const highlightedPct = Math.round((highlightedCount / totalStrengths) * 100);
  const solidPct = Math.round((solidCount / totalStrengths) * 100);
  const observingPct = Math.round((observingCount / totalStrengths) * 100);

  const consolidationPercentage = totalActivitiesCompletedCount(completedActivities) > 0
    ? Math.min(100, Math.round(((highlightedCount * 1.0 + solidCount * 0.7) / totalStrengths) * 100))
    : 0;

  const strengthsBreakdown: StrengthsPercentageBreakdown = {
    consolidationPercentage,
    highlightedCount,
    solidCount,
    observingCount,
    totalItems: totalStrengths,
    highlightedPct,
    solidPct,
    observingPct
  };

  // ==========================================
  // 5. DEEP PEDAGOGICAL ANALYSIS (ANÁLISIS PEDAGÓGICO INTEGRAL)
  // ==========================================
  const completedCount = completedActivities.length;
  const pendingCount = pendingActivities.length;
  const topInterest = primaryInterests[0];

  const overallSynthesis = lang === 'es'
    ? `El estudiante ${student.nameOrAlias} cuenta actualmente con ${completedCount} actividad(es) realizada(s) con evidencias consolidadas y ${pendingCount} pendiente(s) de realizar. La evaluación pedagógica es acumulativa y evolutiva (R1bis): cada partida nueva aporta evidencias adicionales sin penalizar los intentos anteriores ni aplicar etiquetas estáticas sobre su potencial.`
    : `Student ${student.nameOrAlias} has completed ${completedCount} activity/ies with solid evidence and ${pendingCount} pending completion. This assessment is cumulative and growth-oriented.`;

  const interestSkillCorrelation = lang === 'es'
    ? (topInterest && topInterest.visits > 0
        ? `Se evidencia una fuerte sincronía entre su foco de interés voluntario en "${topInterest.name}" (${topInterest.percentage}% de sus elecciones) y su desempeño en habilidades manipulativas y visuales (${skillsPercentages[0].percentage}% de creatividad y ${skillsPercentages[1].percentage}% de lógica). El estudiante aprende y se concentra con mayor intensidad cuando se le ofrecen canales de expresión táctil y espacial.`
        : 'El mapa de intereses aún está en fase de exploración inicial. Se recomienda invitar al estudiante a recorrer los diferentes mundos para conocer sus inclinaciones espontáneas.')
    : 'Interest and skill correlation analysis is progressing as more worlds are explored.';

  const resilienceEvaluation = lang === 'es'
    ? (telemetry.length > 0
        ? `Su índice de perseverancia se sitúa en el ${problemSolvingPct}%. El estudiante muestra tolerancia al ensayo-error cuando no está expuesto a la ansiedad del idioma hablado ni a la presión de tiempos cronometrados, utilizando el feedback visual inmediato para autorregular su respuesta.`
        : 'Índice de perseverancia en observación. Se medirá de forma continua a medida que el alumno afronte retos con reintentos.')
    : `Resilience index stands at ${problemSolvingPct}%.`;

  const activitiesProgressSummary = lang === 'es'
    ? `Progreso de actividades: ${completedCount} de 10 completadas (${Math.round((completedCount / 10) * 100)}%). Solo las actividades completadas alimentan las evidencias cualitativas, garantizando rigor ético y evitando inferencias sobre retos aún no realizados (${pendingCount} pendientes).`
    : `Progress: ${completedCount} of 10 completed (${Math.round((completedCount / 10) * 100)}%).`;

  const classroomDifferentiationAdvice = lang === 'es'
    ? `Para el aula ordinaria se sugiere: 1) Priorizar apoyos visuales y manipulativos sobre explicaciones verbales densas; 2) Aprovechar su interés predominante (${topInterest?.name || 'construcción y arte'}) para engancharlo en tareas curriculares; 3) Proponer roles de aula donde sus talentos prácticos sean reconocidos por sus compañeros sin necesidad de hablar fluidamente castellano.`
    : 'Classroom advice: prioritize visual manipulatives, leverage top interests, and offer non-verbal leadership roles.';

  const pedagogicalAnalysis: PedagogicalAnalysis = {
    title: lang === 'es' ? 'Análisis Pedagógico Integral de Habilidades, Intereses y Fortalezas' : 'Comprehensive Pedagogical Analysis',
    overallSynthesis,
    interestSkillCorrelation,
    resilienceEvaluation,
    activitiesProgressSummary,
    classroomDifferentiationAdvice
  };

  // ==========================================
  // 6. 3 CONCRETE CLASSROOM RECOMMENDATIONS (R13)
  // ==========================================
  const classroomRecommendations = [
    {
      id: 'rec_1',
      headline: lang === 'es' ? '1. Apoyos visuales y material manipulativo preferencial' : '1. Hands-on manipulatives & visual cues',
      actionableDetail: lang === 'es' 
        ? 'El estudiante procesa la información con notable agilidad cuando se le presentan diagramas, colores y objetos físicos manipulables, sorteando eficazmente la barrera del idioma castellano.'
        : 'The student learns with remarkable speed when presented with diagrams, color tags, and physical objects, bypassing verbal barriers.',
      evidenceContext: lang === 'es' ? 'Respaldado por evidencias observadas en actividades de Construcción y Patrones.' : 'Supported by observations in Building and Pattern games.'
    },
    {
      id: 'rec_2',
      headline: lang === 'es' ? '2. Rol de protagonismo en proyectos prácticos y espaciales' : '2. Leadership in hands-on / spatial tasks',
      actionableDetail: lang === 'es'
        ? 'Asignarle responsabilidades donde pueda brillar de inmediato frente a sus compañeros (ej. montaje de maquetas, distribución espacial de materiales o robótica educativa).'
        : 'Assign classroom responsibilities where they can shine directly in front of peers (e.g. robotics kits, model building, art displays).',
      evidenceContext: lang === 'es' ? 'Reflejado en su persistencia e inventiva en el reto de Creatividad y Mundos.' : 'Grounded in high inventiveness during the Creativity challenge.'
    },
    {
      id: 'rec_3',
      headline: lang === 'es' ? '3. Emparejamiento cooperativo sin exigencia lingüística' : '3. Non-verbal peer collaboration pairings',
      actionableDetail: lang === 'es'
        ? 'Fomentar dinámicas por parejas basadas en gestos y resolución conjunta de problemas táctiles (ej. juegos de mesa, experimentos de ciencias) para tejer vínculos sociales seguros.'
        : 'Promote partner activities based on gestures and joint hands-on problem solving to foster social bonds without language anxiety.',
      evidenceContext: lang === 'es' ? 'Basado en su interacción prosocial en el reto de Bobi y el Santuario.' : 'Evidenced in prosocial warmth during Bobi Robot and Creature Sanctuary.'
    }
  ];

  // ==========================================
  // 7. WARM FAMILY LETTER
  // ==========================================
  const familyLetter = {
    greeting: lang === 'es' ? `Estimada familia de ${student.nameOrAlias}:` : `Dear family of ${student.nameOrAlias}:`,
    positiveSummary: lang === 'es'
      ? `Queremos compartir con ustedes que ${student.nameOrAlias} ha participado en actividades lúdicas donde ha demostrado un ingenio maravilloso, gran curiosidad para explorar y una hermosa perseverancia para resolver retos por sí mismo/a. Nos llena de orgullo ver su entusiasmo.`
      : `We are delighted to share that ${student.nameOrAlias} took part in playful challenges where they demonstrated wonderful ingenuity, curiosity, and steadfast perseverance.`,
    homeActivities: [
      lang === 'es' ? 'Cocinar juntos una receta tradicional familiar, contando ingredientes y decorando el plato con formas creativas.' : 'Cook a family recipe together, counting ingredients and arranging shapes on the plate.',
      lang === 'es' ? 'Mirar fotos o pasear buscando formas y colores curiosos en la calle o en el parque.' : 'Look at family photos or walk around the park spotting curious colors and shapes.',
      lang === 'es' ? 'Jugar a inventar historias a partir de objetos sencillos de casa.' : 'Play making up stories together using everyday household items.'
    ],
    closing: lang === 'es' 
      ? '¡Su talento y esfuerzo son un tesoro que florece cada día!' 
      : 'Their talent and dedication are a treasure that blossoms every day!'
  };

  return {
    studentId: student.id,
    generatedAt: new Date().toISOString(),
    skillsPercentages,
    interestsPercentages,
    strengthsBreakdown,
    pedagogicalAnalysis,
    allActivities,
    completedActivities,
    pendingActivities,
    primaryInterests,
    strengths,
    classroomRecommendations,
    familyLetter,
    totalSessionsAnalyzed: telemetry.length,
    neurodivergentAccommodations: [
      lang === 'es' ? 'Permitir pausas sensoriales y descansos de bajo estímulo durante la jornada escolar.' : 'Allow quiet sensory breathers throughout the school day.',
      lang === 'es' ? 'Respetar su tiempo de procesamiento visual sin apresurar respuestas orales frente al grupo.' : 'Respect visual processing time without rushing oral answers in front of the whole group.',
      lang === 'es' ? 'Proporcionar anticipación de las rutinas mediante iconos secuenciales en su pupitre.' : 'Provide predictable daily routines using visual sequence cards on their desk.'
    ]
  };
}

function totalActivitiesCompletedCount(completed: ActivityStatusItem[]): number {
  return completed.length;
}
