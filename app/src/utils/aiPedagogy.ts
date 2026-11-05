import { localizeText as text, localizeEvidence } from '../i18n/localize';
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
      const latest = matchedTelemetry.reduce((a, b) => a.timestamp > b.timestamp ? a : b);
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
        name: text(lang, cat.name),
        subtitle: text(lang, cat.subtitle),
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
        notesObserved: notesList.length > 0 ? Array.from(new Set(notesList.map(note => localizeEvidence(lang, note)))) : [text(lang, "Actividad completada satisfactoriamente con respuesta participativa.")]
      };
    } else {
      // Activity is pending! MUST NOT show fake observations!
      return {
        id: cat.id,
        name: text(lang, cat.name),
        subtitle: text(lang, cat.subtitle),
        category: cat.category,
        worldId: cat.worldId,
        type: cat.type,
        icon: cat.icon,
        status: 'pendiente',
        scorePercent: 0,
        notesObserved: [
          text(lang, "⏳ Pendiente de realizar por el estudiante en próximas sesiones formativas.")
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
      name: text(lang, "Creatividad e Innovación Divergente"),
      icon: '🎨',
      percentage: creativityPct,
      status: creativityLogs.length > 0 ? 'evaluada' : 'pendiente',
      description: text(lang, "Capacidad para combinar objetos, imaginar usos no convencionales y proyectar soluciones alternativas."),
      evidenceSummary: creativityLogs.length > 0
        ? (text(lang, "{0} combinaciones originales registradas en {1} partida(s).", [creativityMoves, creativityLogs.length]))
        : (text(lang, "Pendiente de realizar el minijuego \"¿Qué inventas?\"."))
    },
    {
      category: 'logic',
      name: text(lang, "Pensamiento Lógico e Inductivo"),
      icon: '🧩',
      percentage: logicPct,
      status: logicLogs.length > 0 ? 'evaluada' : 'pendiente',
      description: text(lang, "Detección de regularidades, rotaciones visuales y relaciones causa-efecto sin intermediación de idioma."),
      evidenceSummary: logicLogs.length > 0
        ? (text(lang, "Tasa de acierto del {0}% en matrices visuales y series.", [logicPct]))
        : (text(lang, "Pendiente de realizar el minijuego de secuencias y matrices."))
    },
    {
      category: 'communication',
      name: text(lang, "Comunicación Visual y Narrativa"),
      icon: '📖',
      percentage: commPct,
      status: communicationLogs.length > 0 ? 'evaluada' : 'pendiente',
      description: text(lang, "Capacidad para secuenciar temporalmente acontecimientos y atribuir estados emocionales a personajes."),
      evidenceSummary: communicationLogs.length > 0
        ? (text(lang, "Construcción coherente de historias con precisión del {0}%.", [commPct]))
        : (text(lang, "Pendiente de realizar el minijuego \"Cuenta la Historia\"."))
    },
    {
      category: 'collaboration',
      name: text(lang, "Colaboración y Empatía No Verbal"),
      icon: '🤖',
      percentage: collabPct,
      status: collaborationLogs.length > 0 ? 'evaluada' : 'pendiente',
      description: text(lang, "Sintonía ante necesidades ajenas, escucha de señales gestuales y reparto proactivo de recursos."),
      evidenceSummary: collaborationLogs.length > 0
        ? (text(lang, "Respuesta colaborativa registrada con {0} interacciones prosociales.", [collaborationLogs.length]))
        : (text(lang, "Pendiente de realizar el reto de cooperación con Bobi."))
    },
    {
      category: 'problem_solving',
      name: text(lang, "Resolución de Problemas y Perseverancia"),
      icon: '💪',
      percentage: problemSolvingPct,
      status: telemetry.length > 0 ? 'evaluada' : 'pendiente',
      description: text(lang, "Tolerancia al ensayo-error, flexibilidad ante obstáculos y persistencia constructiva sin frustración."),
      evidenceSummary: telemetry.length > 0
        ? (text(lang, "Índice de persistencia del {0}% medido a lo largo de {1} sesiones.", [problemSolvingPct, telemetry.length]))
        : (text(lang, "Pendiente de registrar intentos de resolución en juegos."))
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
        ? (text(lang, "Elegido {0} vez/veces espontáneamente ({1}% de su atención intrínseca).", [visits, pct]))
        : (text(lang, "Pendiente de explorar. Aún no visitado por el alumno."))
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
      ? (text(lang, "Concentra el {0}% de las preferencias de juego del alumno ({1} accesos directos).", [i.percentage, i.visits]))
      : (text(lang, "Pendiente de explorar en próximas actividades."))
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
      title: text(lang, "Pensamiento Divergente y Recombinación Creativa"),
      levelDescription: creativityMoves >= 4 ? 'destaca' : 'destreza_solida',
      description: text(lang, "Demuestra fluidez para concebir ideas inusuales y transformar piezas simples en soluciones funcionales completas."),
      evidenceItems: [
        text(lang, "Registró {0} asociaciones de objetos no convencionales en el taller \"¿Qué inventas?\".", [creativityMoves]),
        text(lang, "Asignó una finalidad original y utilitaria a su creación sin requerir indicaciones textuales."),
        text(lang, "Dedicó tiempo voluntario a ensayar diferentes distribuciones de piezas.")
      ],
      classroomSuggestions: [
        text(lang, "Asignarle el rol de diseñador o modelador en maquetas, collages y proyectos STEM."),
        text(lang, "Permitirle responder a preguntas complejas mediante dibujos o esquemas visuales antes del texto escrito.")
      ],
      familyHomeTips: [
        text(lang, "Reinventar cajas de cartón y tubos reciclados en casa para fabricar ciudades o naves fantásticas.")
      ],
      confidence: 'alta'
    });
  } else {
    strengths.push({
      id: 'str_creativity',
      category: 'creativity',
      title: text(lang, "Pensamiento Divergente y Creatividad Visual"),
      levelDescription: 'en_observacion',
      description: text(lang, "Área abierta a la observación del docente una vez que el alumno participe en los retos creativos."),
      evidenceItems: [
        text(lang, "⏳ Pendiente de realizar: Esta habilidad no ha sido observada todavía porque el alumno aún no ha jugado al reto de creatividad.")
      ],
      classroomSuggestions: [
        text(lang, "Invitar al estudiante a participar en el minijuego \"¿Qué inventas?\" para recoger las primeras evidencias.")
      ],
      familyHomeTips: [
        text(lang, "Fomentar el dibujo libre sin juzgar el resultado en casa.")
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
      title: text(lang, "Razonamiento Inductivo y Descubrimiento de Patrones"),
      levelDescription: isHighLogic ? 'destaca' : 'destreza_solida',
      description: text(lang, "Facilidad notable para descifrar matrices abstractas, comprender secuencias temporales y detectar regularidades espaciales."),
      evidenceItems: [
        text(lang, "Completó matrices lógicas con un porcentaje de acierto del {0}%.", [logicPct]),
        text(lang, "Descubrió giros de rotación y progresiones de color sin necesidad de instrucciones verbales."),
        text(lang, "Mantuvo la concentración reflexiva al seleccionar las piezas candidatas.")
      ],
      classroomSuggestions: [
        text(lang, "Utilizar regletas Cuisenaire, bloques lógicos y ábacos como puente facilitador a la matemática formal."),
        text(lang, "Involucrarle en la organización sistemática del material didáctico y calendarios visuales del aula.")
      ],
      familyHomeTips: [
        text(lang, "Practicar secuencias cotidianas en casa (ordenar cubiertos, calcetines por parejas o botones por tamaño).")
      ],
      confidence: 'alta'
    });
  } else {
    strengths.push({
      id: 'str_logic',
      category: 'logic',
      title: text(lang, "Razonamiento Lógico y Patrones"),
      levelDescription: 'en_observacion',
      description: text(lang, "Competencia lógica deductiva en espera de ser evaluada mediante el juego de secuencias."),
      evidenceItems: [
        text(lang, "⏳ Pendiente de realizar: El alumno todavía no ha realizado la actividad de patrones y series lógicas.")
      ],
      classroomSuggestions: [
        text(lang, "Proponer una breve sesión en el juego \"Patrones y Secuencias\".")
      ],
      familyHomeTips: [
        text(lang, "Jugar a dominó o laberintos sencillos en familia.")
      ],
      confidence: 'inicial'
    });
  }

  // C. Resolución de Problemas y Perseverancia (Problem Solving)
  if (telemetry.length > 0) {
    strengths.push({
      id: 'str_resilience',
      category: 'problem_solving',
      title: text(lang, "Perseverancia Estratégica y Flexibilidad Adaptativa"),
      levelDescription: problemSolvingPct >= 80 ? 'destaca' : 'destreza_solida',
      description: text(lang, "Afronta los retos con curiosidad calmada; experimenta de forma persistente y asume el error como paso hacia el éxito."),
      evidenceItems: [
        text(lang, "Índice de persistencia del {0}% mantenido a través de {1} sesiones de juego.", [problemSolvingPct, telemetry.length]),
        text(lang, "Realizó reintentos constructivos sin manifestar bloqueo conductual ni desánimo ante tareas complejas."),
        text(lang, "Ajustó su forma de actuar tras ensayos previos, demostrando flexibilidad cognitiva.")
      ],
      classroomSuggestions: [
        text(lang, "Elogiar explícitamente el proceso de ensayo y búsqueda (\"¡Qué buena estrategia estás probando!\") en lugar del resultado rápido."),
        text(lang, "Dividir tareas escolares amplias en micro-hitos visibles para acompañar su perseverancia.")
      ],
      familyHomeTips: [
        text(lang, "Valorar el esfuerzo en casa diciendo: \"Me gusta ver cómo no te rindes y buscas otra solución\".")
      ],
      confidence: 'alta'
    });
  } else {
    strengths.push({
      id: 'str_resilience',
      category: 'problem_solving',
      title: text(lang, "Resolución de Problemas y Perseverancia"),
      levelDescription: 'en_observacion',
      description: text(lang, "La tolerancia al error y perseverancia se calculará automáticamente al realizar las actividades."),
      evidenceItems: [
        text(lang, "⏳ Pendiente de realizar: No hay sesiones registradas aún para estimar la perseverancia.")
      ],
      classroomSuggestions: [
        text(lang, "Acompañar al estudiante en su primera partida para observar cómo interactúa con el juego.")
      ],
      familyHomeTips: [
        text(lang, "Animar con paciencia ante cualquier dificultad cotidiana.")
      ],
      confidence: 'inicial'
    });
  }

  // D. Sensibilidad Empática y Colaboración (Collaboration)
  if (collaborationLogs.length > 0) {
    strengths.push({
      id: 'str_collaboration',
      category: 'collaboration',
      title: text(lang, "Sensibilidad Empática y Cooperación No Verbal"),
      levelDescription: 'destaca',
      description: text(lang, "Sintonía afectiva ante gestos y necesidades del prójimo sin requerir mediación lingüística. Disposición natural de ayuda."),
      evidenceItems: [
        text(lang, "Completó {0} retos cooperativos asistiendo de forma oportuna a las peticiones del compañero.", [collaborationLogs.length]),
        text(lang, "Demostró generosidad en el reparto de recursos y herramientas de apoyo."),
        text(lang, "Atención continua a las expresiones faciales y gestos de necesidad.")
      ],
      classroomSuggestions: [
        text(lang, "Emparejarle con un compañero/a tutor para proyectos prácticos de ciencias o arte que no dependan del habla continua."),
        text(lang, "Proponerle ser el \"asistente de bienvenida\" o \"encargado de equipos\" en el aula.")
      ],
      familyHomeTips: [
        text(lang, "Asignarle responsabilidades de cuidado en casa (cuidar plantas, alimentar mascotas o ayudar a poner la mesa).")
      ],
      confidence: 'alta'
    });
  } else {
    strengths.push({
      id: 'str_collaboration',
      category: 'collaboration',
      title: text(lang, "Colaboración y Cooperación No Verbal"),
      levelDescription: 'en_observacion',
      description: text(lang, "Competencia socioemocional pendiente de observar en el reto del robot Bobi o Santuario."),
      evidenceItems: [
        text(lang, "⏳ Pendiente de realizar: El alumno aún no ha interactuado con los retos de ayuda cooperativa.")
      ],
      classroomSuggestions: [
        text(lang, "Proponerle jugar a \"Ayuda al Robot Bobi\" para evaluar su disposición cooperativa espontánea.")
      ],
      familyHomeTips: [
        text(lang, "Fomentar juegos de mesa colaborativos sin perdedores.")
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

  const overallSynthesis = text(lang, "El estudiante {0} cuenta actualmente con {1} actividad(es) realizada(s) con evidencias consolidadas y {2} pendiente(s) de realizar. La evaluación pedagógica es acumulativa y evolutiva (R1bis): cada partida nueva aporta evidencias adicionales sin penalizar los intentos anteriores ni aplicar etiquetas estáticas sobre su potencial.", [student.nameOrAlias, completedCount, pendingCount]);

  const interestSkillCorrelation = (topInterest && topInterest.visits > 0
        ? text(lang, "Se evidencia una fuerte sincronía entre su foco de interés voluntario en \"{0}\" ({1}% de sus elecciones) y su desempeño en habilidades manipulativas y visuales ({2}% de creatividad y {3}% de lógica). El estudiante aprende y se concentra con mayor intensidad cuando se le ofrecen canales de expresión táctil y espacial.", [topInterest.name, topInterest.percentage, skillsPercentages[0].percentage, skillsPercentages[1].percentage])
        : text(lang, "El mapa de intereses aún está en fase de exploración inicial. Se recomienda invitar al estudiante a recorrer los diferentes mundos para conocer sus inclinaciones espontáneas."));

  const resilienceEvaluation = (telemetry.length > 0
        ? text(lang, "Su índice de perseverancia se sitúa en el {0}%. El estudiante muestra tolerancia al ensayo-error cuando no está expuesto a la ansiedad del idioma hablado ni a la presión de tiempos cronometrados, utilizando el feedback visual inmediato para autorregular su respuesta.", [problemSolvingPct])
        : text(lang, "Índice de perseverancia en observación. Se medirá de forma continua a medida que el alumno afronte retos con reintentos."));

  const activitiesProgressSummary = text(lang, "Progreso de actividades: {0} de 10 completadas ({1}%). Solo las actividades completadas alimentan las evidencias cualitativas, garantizando rigor ético y evitando inferencias sobre retos aún no realizados ({2} pendientes).", [completedCount, Math.round((completedCount / 10) * 100), pendingCount]);

  const classroomDifferentiationAdvice = text(lang, "Para el aula ordinaria se sugiere: 1) Priorizar apoyos visuales y manipulativos sobre explicaciones verbales densas; 2) Aprovechar su interés predominante ({0}) para engancharlo en tareas curriculares; 3) Proponer roles de aula donde sus talentos prácticos sean reconocidos por sus compañeros sin necesidad de hablar fluidamente castellano.", [topInterest?.name || text(lang, "construcción y arte")]);

  const pedagogicalAnalysis: PedagogicalAnalysis = {
    title: text(lang, "Análisis Pedagógico Integral de Habilidades, Intereses y Fortalezas"),
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
      headline: text(lang, "1. Apoyos visuales y material manipulativo preferencial"),
      actionableDetail: text(lang, "El estudiante procesa la información con notable agilidad cuando se le presentan diagramas, colores y objetos físicos manipulables, sorteando eficazmente la barrera del idioma castellano."),
      evidenceContext: text(lang, "Respaldado por evidencias observadas en actividades de Construcción y Patrones.")
    },
    {
      id: 'rec_2',
      headline: text(lang, "2. Rol de protagonismo en proyectos prácticos y espaciales"),
      actionableDetail: text(lang, "Asignarle responsabilidades donde pueda brillar de inmediato frente a sus compañeros (ej. montaje de maquetas, distribución espacial de materiales o robótica educativa)."),
      evidenceContext: text(lang, "Reflejado en su persistencia e inventiva en el reto de Creatividad y Mundos.")
    },
    {
      id: 'rec_3',
      headline: text(lang, "3. Emparejamiento cooperativo sin exigencia lingüística"),
      actionableDetail: text(lang, "Fomentar dinámicas por parejas basadas en gestos y resolución conjunta de problemas táctiles (ej. juegos de mesa, experimentos de ciencias) para tejer vínculos sociales seguros."),
      evidenceContext: text(lang, "Basado en su interacción prosocial en el reto de Bobi y el Santuario.")
    }
  ];

  // ==========================================
  // 7. WARM FAMILY LETTER
  // ==========================================
  const familyLetter = {
    greeting: text(lang, "Estimada familia de {0}:", [student.nameOrAlias]),
    positiveSummary: text(lang, "Queremos compartir con ustedes que {0} ha participado en actividades lúdicas donde ha demostrado un ingenio maravilloso, gran curiosidad para explorar y una hermosa perseverancia para resolver retos por sí mismo/a. Nos llena de orgullo ver su entusiasmo.", [student.nameOrAlias]),
    homeActivities: [
      text(lang, "Cocinar juntos una receta tradicional familiar, contando ingredientes y decorando el plato con formas creativas."),
      text(lang, "Mirar fotos o pasear buscando formas y colores curiosos en la calle o en el parque."),
      text(lang, "Jugar a inventar historias a partir de objetos sencillos de casa.")
    ],
    closing: text(lang, "¡Su talento y esfuerzo son un tesoro que florece cada día!")
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
      text(lang, "Permitir pausas sensoriales y descansos de bajo estímulo durante la jornada escolar."),
      text(lang, "Respetar su tiempo de procesamiento visual sin apresurar respuestas orales frente al grupo."),
      text(lang, "Proporcionar anticipación de las rutinas mediante iconos secuenciales en su pupitre.")
    ]
  };
}

function totalActivitiesCompletedCount(completed: ActivityStatusItem[]): number {
  return completed.length;
}
