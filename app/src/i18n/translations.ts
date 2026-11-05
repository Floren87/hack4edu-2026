import { Language } from '../types';

export interface Translations {
  appName: string;
  tagline: string;
  roleChild: string;
  roleTeacher: string;
  roleFamily: string;
  listenAudio: string;
  stopAudio: string;
  stars: string;
  badges: string;
  level: string;
  backToHub: string;
  congratulations: string;
  greatJob: string;
  tryAgain: string;
  continueBtn: string;
  finishBtn: string;
  nextLevel: string;
  
  // Navigation
  navGames: string;
  navWorlds: string;
  navPassport: string;
  navTeacher: string;
  navFamily: string;
  switchStudent: string;
  
  // 4 Minigames
  gameCreativityTitle: string;
  gameCreativitySubtitle: string;
  gameCreativityInstructions: string;
  gameCreativityPrompt: string;
  gameCreativityFinish: string;

  gameLogicTitle: string;
  gameLogicSubtitle: string;
  gameLogicInstructions: string;
  gameLogicSuccess: string;

  gameStoryTitle: string;
  gameStorySubtitle: string;
  gameStoryInstructions: string;
  gameStoryComplete: string;

  gameRobotTitle: string;
  gameRobotSubtitle: string;
  gameRobotInstructions: string;
  gameRobotThanks: string;

  // 6 Worlds
  worldsMapTitle: string;
  worldsMapSubtitle: string;
  worldBuildTitle: string;
  worldBuildDesc: string;
  worldExploreTitle: string;
  worldExploreDesc: string;
  worldCreateTitle: string;
  worldCreateDesc: string;
  worldHelpTitle: string;
  worldHelpDesc: string;
  worldOrganizeTitle: string;
  worldOrganizeDesc: string;
  worldCountTitle: string;
  worldCountDesc: string;

  // Badges
  badgePerseveranceName: string;
  badgePerseveranceDesc: string;
  badgeExplorerName: string;
  badgeExplorerDesc: string;
  badgeConstantName: string;
  badgeConstantDesc: string;
  badgeCreativeName: string;
  badgeCreativeDesc: string;
  badgeEmpathyName: string;
  badgeEmpathyDesc: string;

  // Teacher & Family
  teacherPanelTitle: string;
  teacherPanelSubtitle: string;
  teacherValidationNotice: string;
  btnValidateMatch: string;
  btnValidateObserve: string;
  teacherNotesPlaceholder: string;
  exportReport: string;
  familyPortalTitle: string;
  familyPortalSubtitle: string;
  familyHomeTipsTitle: string;
  noLabelsNotice: string;
  evidenceCount: string;
}

export const translations: Record<Language, Translations> = {
  es: {
    appName: "Talento sin Fronteras",
    tagline: "Descubriendo habilidades y fortalezas sin barreras de idioma",
    roleChild: "Zona de Juegos",
    roleTeacher: "Panel Profesional",
    roleFamily: "Espacio Familiar",
    listenAudio: "Escuchar voz",
    stopAudio: "Detener voz",
    stars: "Estrellas",
    badges: "Insignias de Esfuerzo",
    level: "Nivel",
    backToHub: "Volver",
    congratulations: "¡Fantástico esfuerzo!",
    greatJob: "¡Gran descubrimiento! Cada intento te hace más fuerte.",
    tryAgain: "Prueba otra idea",
    continueBtn: "Continuar",
    finishBtn: "Completar reto",
    nextLevel: "Siguiente reto",

    navGames: "4 Retos Clave",
    navWorlds: "Mapa de Mundos",
    navPassport: "Mi Pasaporte",
    navTeacher: "Panel Profesional",
    navFamily: "Espacio Familiar",
    switchStudent: "Cambiar Perfil",

    gameCreativityTitle: "¿Qué Inventas?",
    gameCreativitySubtitle: "Creatividad y pensamiento divergente",
    gameCreativityInstructions: "Mira estos objetos curiosos. Combínalos para inventar algo nuevo: una herramienta espacial, un medio de transporte o un amigo mágico. ¡Aquí no hay respuestas incorrectas!",
    gameCreativityPrompt: "¿Qué has inventado? Elige para qué sirve tu creación:",
    gameCreativityFinish: "Guardar mi invento",

    gameLogicTitle: "Secuencias y Patrones",
    gameLogicSubtitle: "Pensamiento lógico y deductivo",
    gameLogicInstructions: "Descubre el misterio de la secuencia. Observa formas, giros y colores. Elige la pieza mágica que completa la serie.",
    gameLogicSuccess: "¡Has descubierto la regla oculta!",

    gameStoryTitle: "Cuenta la Historia",
    gameStorySubtitle: "Comunicación y empatía narrativa",
    gameStoryInstructions: "Ordena las imágenes en el orden que tenga sentido para ti y elige las emociones del personaje en cada momento.",
    gameStoryComplete: "¡Una historia maravillosa y llena de detalles!",

    gameRobotTitle: "Ayuda al Robot Bobi",
    gameRobotSubtitle: "Colaboración y resolución conjunta",
    gameRobotInstructions: "El pequeño robot Bobi necesita tu ayuda para reparar su nave. Observa sus gestos, comparte baterías y pásale la herramienta correcta cuando la necesite.",
    gameRobotThanks: "¡Bobi está muy agradecido por tu compañerismo!",

    worldsMapTitle: "Elige tu Aventura",
    worldsMapSubtitle: "Explora los mundos que más despierten tu curiosidad",
    worldBuildTitle: "Mundo Construir",
    worldBuildDesc: "Equilibrio táctil y física intuitiva con piezas orgánicas.",
    worldExploreTitle: "Mundo Explorar",
    worldExploreDesc: "Buscador de constelaciones ocultas y detalles visuales.",
    worldCreateTitle: "Mundo Crear",
    worldCreateDesc: "Sinfonía sensorial de ondas de color y sonidos relajantes.",
    worldHelpTitle: "Mundo Ayudar",
    worldHelpDesc: "Refugio para cuidar y comprender a criaturas expresivas.",
    worldOrganizeTitle: "Mundo Organizar",
    worldOrganizeDesc: "Clasificación libre de gemas y texturas sin reglas rígidas.",
    worldCountTitle: "Mundo Contar",
    worldCountDesc: "Balanza mágica y estimación visual de masas y cristales.",

    badgePerseveranceName: "💪 Perseverante",
    badgePerseveranceDesc: "No te rindes cuando algo es difícil y pruebas nuevas formas.",
    badgeExplorerName: "🧭 Gran Explorador",
    badgeExplorerDesc: "Visitas nuevos mundos con curiosidad abierta.",
    badgeConstantName: "📅 Constante",
    badgeConstantDesc: "Vuelves a practicar para descubrir más secretos.",
    badgeCreativeName: "🎨 Pensador Original",
    badgeCreativeDesc: "Encuentras combinaciones únicas y sorprendentes.",
    badgeEmpathyName: "🤝 Compañero Solidario",
    badgeEmpathyDesc: "Prestas atención a las necesidades de los demás.",

    teacherPanelTitle: "Evaluación Pedagógica sin Etiquetas",
    teacherPanelSubtitle: "Perfil basado en evidencias de juego para orientar el aula",
    teacherValidationNotice: "La IA ofrece sugerencias preliminares. Por favor valida si coinciden con tu observación directa en el aula.",
    btnValidateMatch: "Coincide con el aula",
    btnValidateObserve: "Aún no observado / Discrepa",
    teacherNotesPlaceholder: "Añadir observaciones cualitativas del docente...",
    exportReport: "Exportar Informe (Imprimir / PDF)",
    familyPortalTitle: "Informe Amigable para la Familia",
    familyPortalSubtitle: "Celebrando lo que tu hijo/a sabe hacer y cómo piensa",
    familyHomeTipsTitle: "Ideas divertidas para compartir en casa:",
    noLabelsNotice: "Este informe NO contiene diagnósticos clínicos ni puntuaciones numéricas. Se enfoca en talentos reales observados.",
    evidenceCount: "Evidencias registradas:"
  },
  en: {
    appName: "Talent Without Borders",
    tagline: "Discovering skills, interests, and strengths beyond language barriers",
    roleChild: "Play Zone",
    roleTeacher: "Professional Dashboard",
    roleFamily: "Family Portal",
    listenAudio: "Read aloud",
    stopAudio: "Stop audio",
    stars: "Stars",
    badges: "Effort Badges",
    level: "Level",
    backToHub: "Back",
    congratulations: "Fantastic effort!",
    greatJob: "Great discovery! Every try makes your brain stronger.",
    tryAgain: "Try another idea",
    continueBtn: "Continue",
    finishBtn: "Complete challenge",
    nextLevel: "Next challenge",

    navGames: "4 Core Games",
    navWorlds: "Worlds Map",
    navPassport: "My Passport",
    navTeacher: "Educator / Counselor",
    navFamily: "Families",
    switchStudent: "Switch Profile",

    gameCreativityTitle: "What Do You Invent?",
    gameCreativitySubtitle: "Creativity & divergent thinking",
    gameCreativityInstructions: "Look at these unique objects. Mix and match them to create a new invention: a space tool, a vehicle, or a helpful friend. There are no wrong answers!",
    gameCreativityPrompt: "What did you invent? Pick its main power:",
    gameCreativityFinish: "Save my invention",

    gameLogicTitle: "Patterns & Sequences",
    gameLogicSubtitle: "Visual logic & deductive thinking",
    gameLogicInstructions: "Solve the secret pattern. Look at rotations, colors, and shapes. Choose the piece that completes the sequence.",
    gameLogicSuccess: "You uncovered the hidden rule!",

    gameStoryTitle: "Tell the Story",
    gameStorySubtitle: "Narrative communication & social insight",
    gameStoryInstructions: "Put the picture cards in the order that makes sense to you and pick the character's emotions for each moment.",
    gameStoryComplete: "A wonderful story with rich details!",

    gameRobotTitle: "Help Robot Bobi",
    gameRobotSubtitle: "Collaboration & cooperative problem solving",
    gameRobotInstructions: "Little robot Bobi needs your help to repair the spaceship. Notice Bobi's gestures, share batteries, and hand over the right tool.",
    gameRobotThanks: "Bobi is super grateful for your teamwork!",

    worldsMapTitle: "Choose Your Adventure",
    worldsMapSubtitle: "Travel to the worlds that spark your curiosity",
    worldBuildTitle: "Building World",
    worldBuildDesc: "Tactile balance and intuitive physics with organic shapes.",
    worldExploreTitle: "Exploring World",
    worldExploreDesc: "Hidden constellation finder and fine visual details.",
    worldCreateTitle: "Creating World",
    worldCreateDesc: "Sensory symphony of colorful ripples and gentle chimes.",
    worldHelpTitle: "Helping World",
    worldHelpDesc: "A safe haven to care for expressive little creatures.",
    worldOrganizeTitle: "Organizing World",
    worldOrganizeDesc: "Open-ended tactile sorting without rigid single answers.",
    worldCountTitle: "Counting World",
    worldCountDesc: "Magic scale balance and visual mass comparisons.",

    badgePerseveranceName: "💪 Persevering",
    badgePerseveranceDesc: "You don't give up when it's tricky; you try new ideas.",
    badgeExplorerName: "🧭 Great Explorer",
    badgeExplorerDesc: "Curiously exploring different worlds and activities.",
    badgeConstantName: "📅 Dedicated",
    badgeConstantDesc: "Practicing and unlocking deeper secrets over time.",
    badgeCreativeName: "🎨 Original Thinker",
    badgeCreativeDesc: "Combining elements in surprising and original ways.",
    badgeEmpathyName: "🤝 Helpful Friend",
    badgeEmpathyDesc: "Attentive to the feelings and needs of others.",

    teacherPanelTitle: "Label-Free Pedagogical Assessment",
    teacherPanelSubtitle: "Evidence-based strength profile to guide classroom learning",
    teacherValidationNotice: "AI suggestions are advisory. Validate against direct classroom observations before finalizing.",
    btnValidateMatch: "Matches classroom behavior",
    btnValidateObserve: "Not yet observed / Differs",
    teacherNotesPlaceholder: "Add educator qualitative observations...",
    exportReport: "Export Report (Print / PDF)",
    familyPortalTitle: "Family-Friendly Summary",
    familyPortalSubtitle: "Celebrating what your child knows and how they think",
    familyHomeTipsTitle: "Fun, positive ideas for home:",
    noLabelsNotice: "This profile has zero clinical labels or deficit rankings. It celebrates verified strengths.",
    evidenceCount: "Recorded evidence points:"
  },
  fr: {
    appName: "Talent Sans Frontières",
    tagline: "Révéler les compétences et forces sans barrières linguistiques",
    roleChild: "Espace Jeux",
    roleTeacher: "Espace Professionnel",
    roleFamily: "Espace Famille",
    listenAudio: "Écouter la voix",
    stopAudio: "Arrêter l'audio",
    stars: "Étoiles",
    badges: "Badges d'Effort",
    level: "Niveau",
    backToHub: "Retour",
    congratulations: "Bravo pour ton bel effort !",
    greatJob: "Superbe découverte ! Chaque essai développe tes capacités.",
    tryAgain: "Essaye une autre idée",
    continueBtn: "Continuer",
    finishBtn: "Terminer le défi",
    nextLevel: "Défi suivant",

    navGames: "4 Mini-jeux",
    navWorlds: "Carte des Mondes",
    navPassport: "Mon Passeport",
    navTeacher: "Enseignant / Psy",
    navFamily: "Familles",
    switchStudent: "Changer de profil",

    gameCreativityTitle: "Qu'inventes-tu ?",
    gameCreativitySubtitle: "Créativité et pensée divergente",
    gameCreativityInstructions: "Regarde ces objets curieux. Associe-les pour inventer un nouvel objet : un outil spatial, un transport ou un ami magique. Il n'y a pas de mauvaise réponse !",
    gameCreativityPrompt: "Qu'as-tu inventé ? Choisis son pouvoir :",
    gameCreativityFinish: "Sauvegarder mon invention",

    gameLogicTitle: "Formes et Motifs",
    gameLogicSubtitle: "Logique visuelle et déduction",
    gameLogicInstructions: "Résous le mystère de la série. Observe les couleurs, rotations et formes. Choisis la bonne pièce manquante.",
    gameLogicSuccess: "Tu as découvert la règle cachée !",

    gameStoryTitle: "Raconte l'Histoire",
    gameStorySubtitle: "Communication et empathie narrative",
    gameStoryInstructions: "Ordonne les cartes d'images selon ton imagination et choisis les émotions du personnage.",
    gameStoryComplete: "Une magnifique histoire riche en détails !",

    gameRobotTitle: "Aide le Robot Bobi",
    gameRobotSubtitle: "Collaboration et entraide",
    gameRobotInstructions: "Bobi a besoin de toi pour réparer son vaisseau. Observe ses gestes, partage l'énergie et tends-lui le bon outil.",
    gameRobotThanks: "Bobi te remercie chaleureusement pour ton aide !",

    worldsMapTitle: "Choisis ton Monde",
    worldsMapSubtitle: "Voyage vers les activités qui t'intéressent le plus",
    worldBuildTitle: "Monde Construire",
    worldBuildDesc: "Équilibre tactile et physique intuitive.",
    worldExploreTitle: "Monde Explorer",
    worldExploreDesc: "Recherche de constellations et détails visuels.",
    worldCreateTitle: "Monde Créer",
    worldCreateDesc: "Symphonie sensorielle d'ondes colorées et de sons doux.",
    worldHelpTitle: "Monde Aider",
    worldHelpDesc: "Refuge pour prendre soin de gentilles créatures.",
    worldOrganizeTitle: "Monde Organiser",
    worldOrganizeDesc: "Tri libre et mandalas tactiles sans contraintes.",
    worldCountTitle: "Monde Compter",
    worldCountDesc: "Balance magique et intuition des quantités.",

    badgePerseveranceName: "💪 Persévérant",
    badgePerseveranceDesc: "Tu n'abandonnes jamais face à la difficulté.",
    badgeExplorerName: "🧭 Grand Explorateur",
    badgeExplorerDesc: "Tu explores différents univers avec curiosité.",
    badgeConstantName: "📅 Régulier",
    badgeConstantDesc: "Tu reviens pour perfectionner tes compétences.",
    badgeCreativeName: "🎨 Esprit Original",
    badgeCreativeDesc: "Tu inventes des combinaisons uniques et novatrices.",
    badgeEmpathyName: "🤝 Ami Bienveillant",
    badgeEmpathyDesc: "Attentif aux besoins et aux émotions des autres.",

    teacherPanelTitle: "Évaluation Pédagogique Positive",
    teacherPanelSubtitle: "Profil de forces et suggestions concrètes pour la classe",
    teacherValidationNotice: "L'IA suggère des pistes. Validez chaque élément en fonction de votre observation.",
    btnValidateMatch: "Conforme à l'observation",
    btnValidateObserve: "Non encore observé / Différent",
    teacherNotesPlaceholder: "Ajouter des notes qualitatives...",
    exportReport: "Exporter le bilan (Imprimer / PDF)",
    familyPortalTitle: "Bilan pour la Famille",
    familyPortalSubtitle: "Ce que votre enfant sait faire et réussit",
    familyHomeTipsTitle: "Idées positives à partager à la maison :",
    noLabelsNotice: "Ce document ne contient aucune étiquette clinique ni classement numérique.",
    evidenceCount: "Faits observables enregistrés :"
  },
  ar: {
    appName: "موهبة بلا حدود",
    tagline: "اكتشاف المهارات والقدرات والاهتمامات دون حواجز لغوية",
    roleChild: "منطقة الألعاب",
    roleTeacher: "لوحة المعلم والمرشد",
    roleFamily: "مساحة العائلة",
    listenAudio: "استمع بالصوت",
    stopAudio: "إيقاف الصوت",
    stars: "النجوم",
    badges: "أوسمة المثابرة",
    level: "المستوى",
    backToHub: "العودة",
    congratulations: "جهد رائع ومميز!",
    greatJob: "اكتشاف ممتاز! كل محاولة تنمي قدراتك وتجعلك أقوى.",
    tryAgain: "جرّب فكرة أخرى",
    continueBtn: "متابعة",
    finishBtn: "إنهاء التحدي",
    nextLevel: "التحدي التالي",

    navGames: "4 ألعاب رئيسية",
    navWorlds: "خريطة العوالم",
    navPassport: "جوازي الخاص",
    navTeacher: "المعلم / المرشد",
    navFamily: "العائلة",
    switchStudent: "تغيير الملف",

    gameCreativityTitle: "ماذا تبتكر؟",
    gameCreativitySubtitle: "الإبداع والتفكير المرن غير التقليدي",
    gameCreativityInstructions: "شاهد هذه الأدوات المميزة. اجمع بينها لابتكار شيء جديد: أداة فضائية أو مركبة عجيبة أو صديق آلي. لا توجد إجابات خاطئة!",
    gameCreativityPrompt: "ماذا ابتكرت؟ اختر الفائدة الرئيسية لابتكارك:",
    gameCreativityFinish: "حفظ ابتكاري",

    gameLogicTitle: "الأنماط والتسلسل",
    gameLogicSubtitle: "التفكير المنطقي والاستدلال البصري",
    gameLogicInstructions: "اكتشف سر النمط المخفي. تأمل الأشكال والألوان والاتجاهات. اختر القطعة التي تكمل السلسلة.",
    gameLogicSuccess: "لقد اكتشفت القاعدة بنجاح!",

    gameStoryTitle: "اروي القصة",
    gameStorySubtitle: "التواصل البصري والتعبير العاطفي",
    gameStoryInstructions: "رتب بطاقات الصور بالترتيب الذي تراه مناسباً وحدد مشاعر الشخصية في كل موقف.",
    gameStoryComplete: "قصة ممتازة وتفاصيل رائعة!",

    gameRobotTitle: "ساعد الروبوت بوبي",
    gameRobotSubtitle: "التعاون وحل المشكلات التشاركي",
    gameRobotInstructions: "يحتاج بوبي إلى مساعدتك لإصلاح مركبته. راقب إشاراته، وشاركه الطاقة، وناوله الأداة المناسبة.",
    gameRobotThanks: "بوبي ممتن جداً لمساعدتك الرائعة!",

    worldsMapTitle: "اختر مغامرتك",
    worldsMapSubtitle: "انطلق إلى العوالم التي تثير فضلك واهتمامك",
    worldBuildTitle: "عالم البناء",
    worldBuildDesc: "توازن حسي وفيزياء تفاعلية بواسطة أشكال هندسية.",
    worldExploreTitle: "عالم الاستكشاف",
    worldExploreDesc: "العثور على الكوكبات النجمية والرموز الخفية.",
    worldCreateTitle: "عالم الإبداع",
    worldCreateDesc: "تناغم حسي بصري من الألوان والنغمات المهدئة.",
    worldHelpTitle: "عالم المساعدة",
    worldHelpDesc: "مأوى لرعاية كائنات لطيفة وفهم مشاعرها غير اللفظية.",
    worldOrganizeTitle: "عالم التنظيم",
    worldOrganizeDesc: "تصنيف حر للأشكال والألوان بدون قواعد مقيدة.",
    worldCountTitle: "عالم العد والقياس",
    worldCountDesc: "ميزان سحري لتقدير ومقارنة الكتل والبلورات.",

    badgePerseveranceName: "💪 مثابر وقوي",
    badgePerseveranceDesc: "تحاول وتجرب مسارات جديدة ولا تستسلم.",
    badgeExplorerName: "🧭 مستكشف مبدع",
    badgeExplorerDesc: "تستكشف بحماس عوالم وأنشطة متنوعة.",
    badgeConstantName: "📅 مواظب ومجتهد",
    badgeConstantDesc: "تعود للتمرن وتفتح أسراراً جديدة.",
    badgeCreativeName: "🎨 مفكر أصيل",
    badgeCreativeDesc: "تبتكر أفكاراً وتجميعات مميزة ومدهشة.",
    badgeEmpathyName: "🤝 صديق متعاون",
    badgeEmpathyDesc: "تهتم بمشاعر الآخرين وتقدم العون بلطف.",

    teacherPanelTitle: "التقييم التربوي الإيجابي بلا تصنيفات",
    teacherPanelSubtitle: "ملف مبني على شواهد اللعب لتوجيه التعلم داخل الصف",
    teacherValidationNotice: "يقترح الذكاء الاصطناعي ملاحظات استشارية. يرجى تأكيد ما يطابق مشاهداتكم المباشرة.",
    btnValidateMatch: "يطابق المشاهدة في الصف",
    btnValidateObserve: "قيد الملاحظة / لم يُرَ بعد",
    teacherNotesPlaceholder: "إضافة ملاحظات نوعية من المعلم...",
    exportReport: "تصدير التقرير (طباعة / PDF)",
    familyPortalTitle: "ملخص ميسر للعائلة",
    familyPortalSubtitle: "الاحتفاء بما يجيده طفلك وطريقته الجميلة في التفكير",
    familyHomeTipsTitle: "أنشطة مقترحة وممتعة للمنزل:",
    noLabelsNotice: "هذا الملف خالٍ تماماً من التصنيفات الطبية أو الدرجات المقارنة.",
    evidenceCount: "الشواهد المسجلة:"
  },
  uk: {
    appName: "Талант без кордонів",
    tagline: "Розкриваємо здібності та сильні сторони без мовних бар'єрів",
    roleChild: "Ігрова зона",
    roleTeacher: "Панель фахівця",
    roleFamily: "Простір родини",
    listenAudio: "Прослухати голос",
    stopAudio: "Зупинити аудіо",
    stars: "Зірки",
    badges: "Значки зусиль",
    level: "Рівень",
    backToHub: "Назад",
    congratulations: "Чудові зусилля!",
    greatJob: "Чудове відкриття! Кожна спроба робить тебе впевненішим.",
    tryAgain: "Спробуй ще одну ідею",
    continueBtn: "Продовжити",
    finishBtn: "Завершити виклик",
    nextLevel: "Наступний рівень",

    navGames: "4 Головні гри",
    navWorlds: "Карта світів",
    navPassport: "Мій паспорт",
    navTeacher: "Педагог / Психолог",
    navFamily: "Родина",
    switchStudent: "Змінити профіль",

    gameCreativityTitle: "Що ти винайдеш?",
    gameCreativitySubtitle: "Креативність та гнучке мислення",
    gameCreativityInstructions: "Поглянь на ці дивовижні предмети. З'єднай їх, щоб винайти космічний інструмент або чарівного друга. Неправильних відповідей немає!",
    gameCreativityPrompt: "Що ти винайшов? Обери головну суперсилу:",
    gameCreativityFinish: "Зберегти винахід",

    gameLogicTitle: "Послідовності та візерунки",
    gameLogicSubtitle: "Логіка та просторове мислення",
    gameLogicInstructions: "Розгадай таємницю послідовності. Спостерігай за формами й обертанням. Обери чарівну деталь.",
    gameLogicSuccess: "Ти розгадав приховане правило!",

    gameStoryTitle: "Розкажи історію",
    gameStorySubtitle: "Спілкування та емоційна уява",
    gameStoryInstructions: "Розклади картки у послідовності, яка має для тебе сенс, та обери емоції героя.",
    gameStoryComplete: "Чудова та виразна історія!",

    gameRobotTitle: "Допоможи роботу Бобі",
    gameRobotSubtitle: "Співпраця та взаємодопомога",
    gameRobotInstructions: "Маленькому роботу Бобі потрібна допомога в ремонті. Звертай увагу на його жести, ділися енергією та подавай інструменти.",
    gameRobotThanks: "Бобі щиро вдячний за твою допомогу!",

    worldsMapTitle: "Обери свою пригоду",
    worldsMapSubtitle: "Подорожуй світами, які викликають твою цікавість",
    worldBuildTitle: "Світ Будівництва",
    worldBuildDesc: "Тактильний баланс та фізика органічних блоків.",
    worldExploreTitle: "Світ Досліджень",
    worldExploreDesc: "Пошук прихованих сузір'їв та дрібних деталей.",
    worldCreateTitle: "Світ Творчості",
    worldCreateDesc: "Сенсорна гармонія кольорових хвиль та спокійних звуків.",
    worldHelpTitle: "Світ Турботи",
    worldHelpDesc: "Притулок для допомоги щирим істотам.",
    worldOrganizeTitle: "Світ Організації",
    worldOrganizeDesc: "Вільне сортування самоцвітів без суворих рамок.",
    worldCountTitle: "Світ Лічби",
    worldCountDesc: "Чарівні ваги та інтуїтивне відчуття кількості.",

    badgePerseveranceName: "💪 Наполегливий",
    badgePerseveranceDesc: "Не здаєшся перед труднощами і шукаєш нові шляхи.",
    badgeExplorerName: "🧭 Великий дослідник",
    badgeExplorerDesc: "З цікавістю подорожуєш різними світами.",
    badgeConstantName: "📅 Відданий",
    badgeConstantDesc: "Повертаєшся тренуватися та відкривати нові секрети.",
    badgeCreativeName: "🎨 Оригінальний мислитель",
    badgeCreativeDesc: "Знаходиш унікальні комбінації та дивуєш ідеями.",
    badgeEmpathyName: "🤝 Чуйний друг",
    badgeEmpathyDesc: "Уважний до почуттів і потреб інших.",

    teacherPanelTitle: "Позитивна педагогічна оцінка без ярликів",
    teacherPanelSubtitle: "Профіль сильних сторін для організації навчання в класі",
    teacherValidationNotice: "ШІ пропонує орієнтири. Будь ласка, перевірте відповідність вашим спостереженням у класі.",
    btnValidateMatch: "Відповідає спостереженням у класі",
    btnValidateObserve: "Ще спостерігається / Відрізняється",
    teacherNotesPlaceholder: "Додати якісні спостереження педагога...",
    exportReport: "Експортувати звіт (Друк / PDF)",
    familyPortalTitle: "Звіт для родини",
    familyPortalSubtitle: "Святкуємо те, що дитина вміє і як міркує",
    familyHomeTipsTitle: "Цікаві ідеї для спільних занять удома:",
    noLabelsNotice: "У цьому документі немає медичних діагнозів чи порівняльних балів. Лише виявлені таланти.",
    evidenceCount: "Зафіксовані спостереження:"
  }
};
