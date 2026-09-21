import { Brand, Course, User, LearningPlan, ReminderSetting, AnalyticsData } from '../types';

export const BRANDS: Brand[] = [
  {
    id: 'lacite',
    name: 'lacite.tj',
    tagline: 'Люксовая парфюмерия и селективная косметика',
    logo: '✨',
    brandColor: '#d97706',
    accentColor: '#fbbf24',
    bgGradient: 'from-amber-950/60 via-slate-900 to-slate-950',
    description: 'Официальный ритейлер легендарных селективных парфюмерных домов и премиального ухода за кожей в Таджикистане.',
    bannerImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'geox',
    name: 'Geox',
    tagline: 'Итальянская технологичная обувь и одежда Respira',
    logo: '👟',
    brandColor: '#0284c7',
    accentColor: '#38bdf8',
    bgGradient: 'from-sky-950/60 via-slate-900 to-slate-950',
    description: 'Инновации итальянского комфорта: запатентованные мембраны Respira, абсолютная водонепроницаемость Amphibiox и амортизация Spherica.',
    bannerImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'yves-rocher',
    name: 'Yves Rocher',
    tagline: 'Экспертная растительная косметика из Бретани',
    logo: '🌿',
    brandColor: '#059669',
    accentColor: '#34d399',
    bgGradient: 'from-emerald-950/60 via-slate-900 to-slate-950',
    description: 'Создатель Растительной Косметики (Botanical Beauty): натуральные формулы, собственные органические поля в Ля Гасийи и эко-ответственность.',
    bannerImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-emp-1',
    name: 'Зарина Рахимова',
    email: 'z.rakhimova@gmgroup.tj',
    role: 'EMPLOYEE',
    storeId: 'store-dushanbe-1',
    storeName: 'Geox Flagship, Dushanbe Mall',
    brandId: 'geox',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    level: 2,
    levelTitle: 'Консультант-Технолог',
    xp: 680,
    xpToNextLevel: 1000,
    streakDays: 5,
    completedCoursesCount: 2,
    certificatesCount: 2,
    lastActiveAt: 'Сегодня, 10:15',
    createdAt: '2026-02-10',
  },
  {
    id: 'user-mgr-1',
    name: 'Фаррух Саидов',
    email: 'f.saidov@gmgroup.tj',
    role: 'STORE_MANAGER',
    storeId: 'store-lacite-1',
    storeName: 'lacite.tj Boutique, Рудаки Плаза',
    brandId: 'lacite',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    level: 4,
    levelTitle: 'Директор филиала',
    xp: 2450,
    xpToNextLevel: 3000,
    streakDays: 14,
    completedCoursesCount: 5,
    certificatesCount: 4,
    lastActiveAt: 'Сегодня, 11:30',
    createdAt: '2025-11-01',
  },
  {
    id: 'user-trainer-1',
    name: 'Камилла Исмоилова',
    email: 'k.ismoilova@gmgroup.tj',
    role: 'TRAINER_ADMIN',
    storeId: 'hq-gmgroup',
    storeName: 'G&M Group Corporate Head Office',
    brandId: 'lacite',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    level: 5,
    levelTitle: 'Ведущий Бизнес-Тренер',
    xp: 4800,
    xpToNextLevel: 5000,
    streakDays: 28,
    completedCoursesCount: 8,
    certificatesCount: 7,
    lastActiveAt: 'Сегодня, 12:00',
    createdAt: '2025-08-15',
  },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-sales-mastery',
    brandId: null, // Universal
    title: 'Техники продаж и золотые стандарты сервиса G&M',
    subtitle: 'Базовый курс по психологии клиента, ненавязчивому контакту и технике допродаж',
    description: 'Корпоративный фундамент для всех консультантов сети G&M Group. Практические алгоритмы установления контакта, работа с барьерами и увеличение среднего чека.',
    category: 'SALES_TECHNIQUES',
    categoryLabel: 'Техники продаж',
    level: 'Базовый',
    estimatedHours: 3.5,
    coverImage: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
    badgeIcon: 'Award',
    isMandatory: true,
    order: 1,
    modulesCount: 2,
    lessonsCount: 5,
    tags: ['Сервис', 'Работа с возражениями', 'Cross-sell', 'Обязательно'],
    modules: [
      {
        id: 'mod-sales-1',
        courseId: 'course-sales-mastery',
        title: 'Модуль 1: Вход в контакт и первое впечатление',
        order: 1,
        description: 'Формирование доверия в первые 5 секунд без банальных скриптов.',
        lessons: [
          {
            id: 'les-s1-1',
            moduleId: 'mod-sales-1',
            courseId: 'course-sales-mastery',
            title: 'Золотые 5 секунд: невербалика и приветствие без давления',
            contentType: 'VIDEO',
            durationMin: 7,
            order: 1,
            summary: 'Изучите технику открытого взгляда, дистанцию комфорта (1.2–1.5 м) и отказ от шаблонных фраз «Вам чем-то помочь?».',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            videoDurationSec: 15,
            textContent: `### Правило первых секунд в ритейле G&M Group

В премиальном ритейле покупатель принимает решение остаться в торговом зале или уйти в течение первых **5–7 секунд**. 

#### 3 критических правила консультанта:
1. **Дистанция комфорта**: Не приближайтесь вплотную. Оптимальное расстояние — 1.2–1.5 метра.
2. **Контакт глаз и улыбка**: Теплый, ненавязчивый взгляд с искренней полуулыбкой до того, как клиент заговорит.
3. **Запретные фразы**: 
   - ❌ *«Вам чем-то помочь?»* — на 90% вызывает рефлекторный ответ: *«Нет, спасибо, я просто смотрю»*.
   - ✅ *«Добрый день! Обратите внимание, сегодня у нас поступила новая коллекция, располагайтесь удобно, если возникнут вопросы — я рядом»*.`,
            infographicItems: [
              { icon: 'Smile', title: 'Открытая поза', description: 'Руки свободны, корпус направлен к гостю без давления.' },
              { icon: 'Eye', title: 'Взгляд 3 секунды', description: 'Мягкий зрительный контакт подтверждает внимание.' },
              { icon: 'Compass', title: 'Дистанция 1.5м', description: 'Предоставьте покупателю личное пространство осмотреться.' },
            ],
            quizData: {
              title: 'Тест: Вход в контакт и первое впечатление',
              passingScorePercent: 80,
              questions: [
                {
                  id: 'q1',
                  question: 'Какая фраза считается категорически неприемлемой при первой встрече клиента в зале?',
                  options: [
                    { id: 'o1', text: '«Добрый день! Рады видеть вас в нашем бутике.»', isCorrect: false },
                    { id: 'o2', text: '«Вам что-то подсказать или помочь?»', isCorrect: true },
                    { id: 'o3', text: '«Здравствуйте! У нас как раз обновилась витрина, чувствуйте себя свободно.»', isCorrect: false },
                    { id: 'o4', text: '«Добрый день! Подскажите, вы ищете подарок или для себя?»', isCorrect: false },
                  ],
                  explanation: 'Фраза «Вам помочь?» формирует ощущение навязчивости и провоцирует автоматический отказ «Я просто смотрю».',
                },
                {
                  id: 'q2',
                  question: 'Какова оптимальная дистанция до клиента в торговом зале в первые секунды визита?',
                  options: [
                    { id: 'o1', text: '0.5 метра, чтобы сразу говорить тихо', isCorrect: false },
                    { id: 'o2', text: '1.2 – 1.5 метра, сохраняя зону личного комфорта', isCorrect: true },
                    { id: 'o3', text: 'Более 5 метров, оставаясь за кассой', isCorrect: false },
                  ],
                  explanation: 'Дистанция 1.2–1.5 метра считается оптимальной социальной дистанцией в премиум-сегменте.',
                },
                {
                  id: 'q3',
                  question: 'Что должен сделать консультант, если клиент ответил: «Спасибо, я просто смотрю»?',
                  options: [
                    { id: 'o1', text: 'Остаться стоять рядом и продолжать наблюдать за его руками', isCorrect: false },
                    { id: 'o2', text: 'Дружелюбно сказать: «Конечно, осматривайтесь, новинки расположены на центральном острове, я буду рядом» и сделать шаг назад', isCorrect: true },
                    { id: 'o3', text: 'Сразу отойти в подсобное помещение', isCorrect: false },
                  ],
                  explanation: 'Консультант легализует право гостя на самостоятельный осмотр и ненавязчиво ориентирует в зале.',
                },
              ],
            },
          },
          {
            id: 'les-s1-2',
            moduleId: 'mod-sales-1',
            courseId: 'course-sales-mastery',
            title: 'Методика открытых вопросов и выявление скрытых потребностей',
            contentType: 'TEXT_INFOGRAPHIC',
            durationMin: 10,
            order: 2,
            summary: 'Как задавать вопросы, чтобы клиент рассказывал о своих привычках, ожиданиях и поводе покупки.',
            textContent: `### Искусство диалога: от монолога к пониманию

Консультант высшего класса говорит **не более 30% времени диалога**, а 70% времени внимательно слушает.

#### Воронка вопросов:
1. **Ситуационные вопросы**: «Для какого повода подбираете образ/аромат?», «Носите ли обычно обувь на каблуке или плоской подошве?»
2. **Проблемные вопросы**: «С какими сложностями сталкивались при выборе ранее?»
3. **Ценностные вопросы**: «Что для вас является ключевым: легкость, статусность или практичность?»`,
            infographicItems: [
              { icon: 'MessageCircle', title: 'Открытые вопросы', description: 'Начинаются с «Что», «Какой», «Как», «Для чего».' },
              { icon: 'Target', title: 'Принцип СПВ', description: 'Свойство (факт) -> Преимущество (плюс) -> Выгода (для клиента).' },
              { icon: 'CheckCircle2', title: 'Активное слушание', description: 'Кивки, перефразирование: «Правильно ли я понимаю, что...»' },
            ],
            quizData: {
              title: 'Тест: Техника открытых вопросов',
              passingScorePercent: 80,
              questions: [
                {
                  id: 'q1',
                  question: 'Какой из следующих вопросов является открытым?',
                  options: [
                    { id: 'o1', text: '«Вам нравится этот крем?»', isCorrect: false },
                    { id: 'o2', text: '«Каким эффектом от ухода вы были бы максимально довольны?»', isCorrect: true },
                    { id: 'o3', text: '«Вы уже покупали Geox раньше?»', isCorrect: false },
                    { id: 'o4', text: '«Будете мерить этот размер?»', isCorrect: false },
                  ],
                  explanation: 'Открытые вопросы требуют развернутого ответа и раскрывают истинные потребности клиента.',
                },
                {
                  id: 'q2',
                  question: 'Что означает формула СПВ в ритейл-презентации?',
                  options: [
                    { id: 'o1', text: 'Скидка - Подарок - Возврат', isCorrect: false },
                    { id: 'o2', text: 'Свойство - Преимущество - Выгода', isCorrect: true },
                    { id: 'o3', text: 'Скорость - Подача - Вежливость', isCorrect: false },
                  ],
                  explanation: 'Свойство продукта переводится в объективное преимущество и субъективную личную выгоду гостя.',
                },
              ],
            },
          },
        ],
      },
      {
        id: 'mod-sales-2',
        courseId: 'course-sales-mastery',
        title: 'Модуль 2: Отработка возражений и Cross-sell',
        order: 2,
        description: 'Преодоление ценового барьера и увеличение UPT (комплексный чек).',
        lessons: [
          {
            id: 'les-s2-1',
            moduleId: 'mod-sales-2',
            courseId: 'course-sales-mastery',
            title: 'Работа с возражением «Это дорого» и «Подумаю»',
            contentType: 'TEXT_INFOGRAPHIC',
            durationMin: 12,
            order: 1,
            summary: 'Алгоритм согласия, мостика и перевода стоимости в ценность долгосрочного использования.',
            textContent: `### Возражение — это запрос на дополнительную информацию

Когда клиент говорит «Дорого», он имеет в виду: «Я пока не понял, почему эта вещь стоит именно столько».

#### 4 шага отработки:
1. **Присоединение**: «Понимаю ваше внимание к стоимости...»
2. **Уточнение**: «Сравниваете с предыдущей покупкой или рассчитывали на определенный бюджет?»
3. **Аргументация ценности**: разложите цену на стоимость дня носки/использования.
4. **Призыв к тесту**: «Давайте просто примерим/нанесем на запястье, чтобы вы почувствовали разницу в качестве.»`,
            infographicItems: [
              { icon: 'ShieldCheck', title: 'Без споров', description: 'Никогда не говорите «Вы не правы» или «Это не дорого».' },
              { icon: 'DollarSign', title: 'Цена за день', description: '100$ за обувь на 2 года = 14 центов в день за здоровье стопы.' },
              { icon: 'Zap', title: 'Мостик согласия', description: '«Именно поэтому мы используем натуральную телячью кожу...»' },
            ],
            quizData: {
              title: 'Тест: Работа с возражениями',
              passingScorePercent: 80,
              questions: [
                {
                  id: 'q1',
                  question: 'С чего начинается правильный ответ на возражение «Это слишком дорого»?',
                  options: [
                    { id: 'o1', text: 'С немедленного предложения скидки 5%', isCorrect: false },
                    { id: 'o2', text: 'С эмоционального присоединения и признания права клиента на вопрос о цене', isCorrect: true },
                    { id: 'o3', text: 'С фразы «Для премиального бренда это обычная цена»', isCorrect: false },
                  ],
                  explanation: 'Присоединение снимает сопротивление и показывает уважение к клиенту.',
                },
                {
                  id: 'q2',
                  question: 'Когда уместно предлагать сопутствующий товар (Cross-sell)?',
                  options: [
                    { id: 'o1', text: 'В самом начале, пока клиент еще не определился с главным товаром', isCorrect: false },
                    { id: 'o2', text: 'После того как клиент подтвердил выбор основного товара («Да, берем эту пару/флакон»)', isCorrect: true },
                    { id: 'o3', text: 'Только на кассе в виде неожиданного сюрприза', isCorrect: false },
                  ],
                  explanation: 'Допродажа предлагается в момент триумфа основного выбора, логично дополняя его ценность.',
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: 'course-lacite-parfum',
    brandId: 'lacite',
    title: 'Парфюмерная экспертиза lacite.tj: Пирамида нот и селектив',
    subtitle: 'Глубокое погружение в нишевую парфюмерию, ольфакторные семейства и ритуал дегустации',
    description: 'Обучение консультантов люкс-бутика lacite.tj. Разбор концентраций от Cologne до Extrait, классификация шлейфов, ноты уда, амбры и техники презентации.',
    category: 'BRAND_BOOK_AND_PRODUCT',
    categoryLabel: 'Продукт lacite.tj',
    level: 'Эксперт',
    estimatedHours: 4.0,
    coverImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    badgeIcon: 'Sparkles',
    isMandatory: true,
    order: 2,
    modulesCount: 2,
    lessonsCount: 4,
    tags: ['Парфюмерия', 'Люкс', 'lacite.tj', 'Селектив'],
    modules: [
      {
        id: 'mod-lacite-1',
        courseId: 'course-lacite-parfum',
        title: 'Модуль 1: Архитектура аромата и ольфакторная пирамида',
        order: 1,
        description: 'Как раскрываются верхние, сердечные и базовые ноты на коже.',
        lessons: [
          {
            id: 'les-l1-1',
            moduleId: 'mod-lacite-1',
            courseId: 'course-lacite-parfum',
            title: 'Ольфакторная пирамида и диффузность нишевых ароматов',
            contentType: 'VIDEO',
            durationMin: 9,
            order: 1,
            summary: 'Разбор 3 этапов раскрытия: Top notes (5-15 мин), Heart notes (2-4 часа), Base notes (до 24 часов).',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            videoDurationSec: 20,
            textContent: `### Пирамида композиции в нишевой парфюмерии

Нишевая парфюмерия, представленная в **lacite.tj**, отличается высокой концентрацией натуральных абсолютов и многоступенчатой эволюцией на коже.

#### Уровни ольфакторной пирамиды:
1. **Верхние ноты (Top Notes)**: Цитрусы (бергамот, юзу), альдегиды, зелень. Звучат первые 10–15 минут.
2. **Ноты сердца (Heart Notes)**: Цветочные (майская роза, жасмин самбак), пряные (кардамон, корица), фруктовые. Звучат от 2 до 5 часов.
3. **Базовые ноты (Base / Drydown)**: Сандал, серая амбра, белый мускус, уд, пачули. Закрепляют композицию и формируют **шлейф (sillage)** на 8–24 часа.`,
            infographicItems: [
              { icon: 'Feather', title: 'Верхние ноты', description: 'Быстро испаряются, создавая первое эмоциональное впечатление.' },
              { icon: 'Heart', title: 'Сердечные ноты', description: 'Ядро концепции парфюмера, пульсирующее на теплой коже.' },
              { icon: 'Layers', title: 'База и шлейф', description: 'Тяжелые смолы и молекулы, создающие индивидуальный шлейф.' },
            ],
            quizData: {
              title: 'Тест: Ольфакторная пирамида lacite.tj',
              passingScorePercent: 80,
              questions: [
                {
                  id: 'q1',
                  question: 'Какие ноты испаряются первыми и слышны в первые 10–15 минут после нанесения?',
                  options: [
                    { id: 'o1', text: 'Базовые ноты (уд, амбра, дубовый мох)', isCorrect: false },
                    { id: 'o2', text: 'Верхние ноты (бергамот, цитрусовые, легкие специи)', isCorrect: true },
                    { id: 'o3', text: 'Сердечные цветочные аккорды', isCorrect: false },
                  ],
                  explanation: 'Верхние ноты состоят из самых легких молекул с высокой скоростью испарения.',
                },
                {
                  id: 'q2',
                  question: 'В чем ключевое отличие концентрации Extrait de Parfum (духи) от Eau de Parfum?',
                  options: [
                    { id: 'o1', text: 'Extrait содержит 20–40% душистых веществ, звучит ближе к телу и держится значительно дольше', isCorrect: true },
                    { id: 'o2', text: 'Extrait содержит больше спирта и быстрее выветривается', isCorrect: false },
                    { id: 'o3', text: 'Разницы нет, это маркетинговое название', isCorrect: false },
                  ],
                  explanation: 'Extrait de Parfum обладает наивысшей концентрацией масел, обеспечивая глубину и рекордную стойкость.',
                },
                {
                  id: 'q3',
                  question: 'Как правильно предложить клиенту протестировать нишевый аромат в бутике lacite.tj?',
                  options: [
                    { id: 'o1', text: 'Распылить прямо в лицо с расстояния 10 см', isCorrect: false },
                    { id: 'o2', text: 'Сначала нанести на качественный бумажный блоттер, дать спирту испариться 5 секунд, и при заинтересованности нанести на пульс запястья', isCorrect: true },
                    { id: 'o3', text: 'Нанести на шерстяное пальто клиента', isCorrect: false },
                  ],
                  explanation: 'Спирт должен осесть за 5 секунд, после чего блоттер подносится на расстояние 5–7 см от носа.',
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: 'course-geox-tech',
    brandId: 'geox',
    title: 'Инновации Geox: Технологии Respira, Amphibiox и Nebula',
    subtitle: 'Уникальные запатентованные мембраны итальянской обуви и верхней одежды',
    description: 'Полный продуктовый гид для консультантов магазинов Geox. Механика дышащей перфорированной подошвы, мембрана без проникновения капель воды и система амортизации.',
    category: 'BRAND_BOOK_AND_PRODUCT',
    categoryLabel: 'Продукт Geox',
    level: 'Продвинутый',
    estimatedHours: 3.0,
    coverImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    badgeIcon: 'Zap',
    isMandatory: true,
    order: 3,
    modulesCount: 2,
    lessonsCount: 4,
    tags: ['Geox', 'Respira', 'Amphibiox', 'Технологии'],
    modules: [
      {
        id: 'mod-geox-1',
        courseId: 'course-geox-tech',
        title: 'Модуль 1: Патент Geox Respira и анатомия подошвы',
        order: 1,
        description: 'Как работает сочетание перфорации и микропористой мембраны.',
        lessons: [
          {
            id: 'les-g1-1',
            moduleId: 'mod-geox-1',
            courseId: 'course-geox-tech',
            title: 'Физика комфорта: перфорированная подошва с дышащей мембраной',
            contentType: 'TEXT_INFOGRAPHIC',
            durationMin: 10,
            order: 1,
            summary: 'Микропоры мембраны в 700 раз больше молекулы пара, но в 20 000 раз меньше капли воды.',
            textContent: `### Революция Geox Respira: обувь, которая дышит

Классическая резиновая подошва задерживает тепло и влагу внутри. Стопа человека выделяет до **100 мл пота в день**.

#### Инженерный секрет патента Geox:
1. **Перфорированная подметка**: отверстия в протекторе подошвы отводят избыточное тепло.
2. **Специальная микропористая мембрана**:
   - Диаметр микропор **в 700 раз больше молекулы водяного пара** (пот свободно выходит наружу).
   - В то же время диаметр пор **в 20 000 раз меньше капли воды** (вода из лужи физически не может проникнуть внутрь).
3. **Результат**: стопа остается сухой, поддерживается идеальная естественная терморегуляция.`,
            infographicItems: [
              { icon: 'Wind', title: 'Отвод пара', description: 'Молекулы пота свободно выводятся через мембрану наружу.' },
              { icon: 'Droplets', title: 'Барьер для воды', description: 'Капли воды не способны преодолеть микропоры мембраны.' },
              { icon: 'Shield', title: 'Защитная прослойка', description: 'Защищает мембрану от механических повреждений камнями.' },
            ],
            quizData: {
              title: 'Тест: Технология Geox Respira',
              passingScorePercent: 80,
              questions: [
                {
                  id: 'q1',
                  question: 'Почему вода из лужи не проникает внутрь подошвы Geox через отверстия перфорации?',
                  options: [
                    { id: 'o1', text: 'Потому что отверстия закрыты плотным полиэтиленом', isCorrect: false },
                    { id: 'o2', text: 'Потому что поры мембраны в 20 000 раз меньше капли воды', isCorrect: true },
                    { id: 'o3', text: 'Отверстия открываются только когда стопа отрывается от земли', isCorrect: false },
                  ],
                  explanation: 'Размер капли воды во много раз превышает диаметр микропор мембраны Geox.',
                },
                {
                  id: 'q2',
                  question: 'Какая технология Geox разработана для максимальной водонепроницаемости в дождь и снег?',
                  options: [
                    { id: 'o1', text: 'Geox Amphibiox', isCorrect: true },
                    { id: 'o2', text: 'Geox Classic Rubber', isCorrect: false },
                    { id: 'o3', text: 'Geox Lite', isCorrect: false },
                  ],
                  explanation: 'Amphibiox обеспечивает полную защиту от влаги не только снизу, но и по всему верху обуви.',
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: 'course-yves-rocher-care',
    brandId: 'yves-rocher',
    title: 'Растительная косметика Yves Rocher: Экспертиза ухода',
    subtitle: 'Формулы Botanical Beauty, экологические стандарты Бретани и диагностика кожи',
    description: 'Продуктовый стандарт для консультантов Yves Rocher. Разбор ключевых гамм: Riche Crème, Elixir Botanique, Hydra Végétal и 5-ступенчатый ритуал ухода.',
    category: 'BRAND_BOOK_AND_PRODUCT',
    categoryLabel: 'Продукт Yves Rocher',
    level: 'Базовый',
    estimatedHours: 3.5,
    coverImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    badgeIcon: 'Leaf',
    isMandatory: true,
    order: 4,
    modulesCount: 2,
    lessonsCount: 4,
    tags: ['Yves Rocher', 'Botanical Beauty', 'Эко-уход', 'Диагностика'],
    modules: [
      {
        id: 'mod-yr-1',
        courseId: 'course-yves-rocher-care',
        title: 'Модуль 1: Философия Растительной Косметики',
        order: 1,
        description: 'Принципы бренда Yves Rocher: от растения к коже.',
        lessons: [
          {
            id: 'les-y1-1',
            moduleId: 'mod-yr-1',
            courseId: 'course-yves-rocher-care',
            title: 'Сердце бренда: Ля Гасийя и стандарты органического земледелия',
            contentType: 'TEXT_INFOGRAPHIC',
            durationMin: 8,
            order: 1,
            summary: '60 гектаров собственных полей в Бретани, сертифицированных по стандарту Ecocert.',
            textContent: `### Уникальная модель исследователя, сборщика и производителя

Yves Rocher контролирует 100% жизненного цикла своих продуктов — от семян ромашки и василька на полях в Ля Гасийи до баночки крема в руках клиента.

#### 5 главных гамм для рекомендации:
1. **Hydra Végétal**: клеточная вода Эдулиса, активирующая запасы влаги на 48 часов.
2. **Elixir Botanique**: настурция и микроводоросль Тетраселмис — мощная защита от оксидативного стресса мегаполиса.
3. **Riche Crème**: культовая формула с ценным маслом 1000 роз для глубокого питания зрелой кожи.
4. **Pure Camomille**: органическая ромашка для мгновенного успокоения чувствительной кожи.`,
            infographicItems: [
              { icon: 'Sun', title: '100% Веган', description: 'Все ключевые формулы не содержат компонентов животного происхождения.' },
              { icon: 'Recycle', title: 'Эко-упаковка', description: 'Флаконы из 100% переработанного пластика, подлежащие вторичной переработке.' },
              { icon: 'HeartHandshake', title: 'Честная цена', description: 'Прямые поставки с завода во Франции без посреднических наценок.' },
            ],
            quizData: {
              title: 'Тест: Экспертиза Yves Rocher',
              passingScorePercent: 80,
              questions: [
                {
                  id: 'q1',
                  question: 'В каком регионе Франции расположены собственные органические поля бренда Yves Rocher?',
                  options: [
                    { id: 'o1', text: 'Прованс', isCorrect: false },
                    { id: 'o2', text: 'Ля Гасийя (Бретань)', isCorrect: true },
                    { id: 'o3', text: 'Бордо', isCorrect: false },
                  ],
                  explanation: 'Родина господина Ива Роше — живописная деревушка Ля Гасийя в Бретани.',
                },
                {
                  id: 'q2',
                  question: 'Каков правильный порядок 5-ступенчатого ежедневного ритуала ухода Yves Rocher?',
                  options: [
                    { id: 'o1', text: 'Крем -> Сыворотка -> Очищение -> SPF -> Тоник', isCorrect: false },
                    { id: 'o2', text: 'Очищение -> Тонизирование -> Сыворотка -> Основной крем -> SPF защита', isCorrect: true },
                    { id: 'o3', text: 'Сыворотка -> Тоник -> Маска -> Очищение', isCorrect: false },
                  ],
                  explanation: 'Сыворотка всегда наносится на предварительно очищенную и тонизированную кожу перед кремом.',
                },
              ],
            },
          },
        ],
      },
    ],
  },
];

export const INITIAL_PLAN: LearningPlan = {
  id: 'plan-geox-intern-1',
  userId: 'user-emp-1',
  title: 'Индивидуальный трек: Стажер Geox — Быстрый старт',
  trackType: 'GEOX_INTERN',
  targetDate: '2026-09-30',
  daysRemaining: 14,
  status: 'ACTIVE',
  totalCoursesCount: 2,
  completedCoursesCount: 1,
  progressPercent: 50,
  goals: [
    {
      id: 'g1',
      courseId: 'course-sales-mastery',
      courseTitle: 'Техники продаж и золотые стандарты сервиса G&M',
      targetDate: '2026-09-20',
      isCompleted: true,
      progressPercent: 100,
    },
    {
      id: 'g2',
      courseId: 'course-geox-tech',
      courseTitle: 'Инновации Geox: Технологии Respira, Amphibiox и Nebula',
      targetDate: '2026-09-30',
      isCompleted: false,
      progressPercent: 25,
    },
  ],
};

export const INITIAL_REMINDERS: ReminderSetting = {
  id: 'rem-emp-1',
  userId: 'user-emp-1',
  daysOfWeek: ['Пн', 'Ср', 'Пт'],
  timeOfDay: '10:00',
  isActive: true,
  pushEnabled: true,
  emailEnabled: false,
};

export const INITIAL_ANALYTICS: AnalyticsData = {
  totalEmployees: 48,
  activeLearnersToday: 32,
  averageCompletionRate: 78,
  averageQuizScore: 89,
  brandStats: [
    {
      brandId: 'lacite',
      brandName: 'lacite.tj',
      employeesCount: 16,
      avgProgress: 84,
      topCourse: 'Парфюмерная экспертиза: Пирамида нот',
    },
    {
      brandId: 'geox',
      brandName: 'Geox',
      employeesCount: 18,
      avgProgress: 76,
      topCourse: 'Инновации Geox: Respira & Amphibiox',
    },
    {
      brandId: 'yves-rocher',
      brandName: 'Yves Rocher',
      employeesCount: 14,
      avgProgress: 72,
      topCourse: 'Растительная косметика: Ритуалы ухода',
    },
  ],
  storeStats: [
    { storeName: 'Geox, Dushanbe Mall', brand: 'Geox', completionRate: 88, activeCount: 6 },
    { storeName: 'lacite.tj, Рудаки Плаза', brand: 'lacite.tj', completionRate: 92, activeCount: 5 },
    { storeName: 'Yves Rocher, ТЦ Сиёма Молл', brand: 'Yves Rocher', completionRate: 74, activeCount: 4 },
    { storeName: 'Geox, Ашан (Asia Mall)', brand: 'Geox', completionRate: 68, activeCount: 5 },
  ],
  employees: [
    {
      id: 'emp-1',
      name: 'Зарина Рахимова',
      role: 'Продавец-консультант',
      brandId: 'geox',
      storeName: 'Geox, Dushanbe Mall',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      coursesCompleted: 2,
      totalAssigned: 3,
      overallProgressPercent: 75,
      avgQuizScore: 92,
      streakDays: 5,
      lastActive: 'Сегодня, 10:15',
      needsAttention: false,
    },
    {
      id: 'emp-2',
      name: 'Алишер Назаров',
      role: 'Стажер',
      brandId: 'geox',
      storeName: 'Geox, Ашан (Asia Mall)',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      coursesCompleted: 0,
      totalAssigned: 2,
      overallProgressPercent: 20,
      avgQuizScore: 65,
      streakDays: 0,
      lastActive: '3 дня назад',
      needsAttention: true,
      weakTopic: 'Патент Respira и физика мембраны (Квиз сдан на 65%)',
    },
    {
      id: 'emp-3',
      name: 'Нигина Холова',
      role: 'Эксперт по парфюмерии',
      brandId: 'lacite',
      storeName: 'lacite.tj, Рудаки Плаза',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      coursesCompleted: 4,
      totalAssigned: 4,
      overallProgressPercent: 100,
      avgQuizScore: 98,
      streakDays: 12,
      lastActive: 'Вчера, 18:40',
      needsAttention: false,
    },
    {
      id: 'emp-4',
      name: 'Мунира Каримова',
      role: 'Консультант-косметолог',
      brandId: 'yves-rocher',
      storeName: 'Yves Rocher, ТЦ Сиёма Молл',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      coursesCompleted: 1,
      totalAssigned: 3,
      overallProgressPercent: 45,
      avgQuizScore: 78,
      streakDays: 2,
      lastActive: 'Сегодня, 09:20',
      needsAttention: true,
      weakTopic: 'Ступени ежедневного ритуала ухода (Квиз сдан на 75%)',
    },
  ],
};
