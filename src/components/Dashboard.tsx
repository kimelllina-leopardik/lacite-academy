import React from 'react';
import { 
  Award, 
  Flame, 
  Sparkles, 
  Clock, 
  Target, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  Bell, 
  Play, 
  BookOpen, 
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { User, Course, Brand, LearningPlan, ReminderSetting } from '../types';

interface DashboardProps {
  currentUser: User;
  courses: Course[];
  brands: Brand[];
  learningPlan: LearningPlan | null;
  reminder: ReminderSetting | null;
  onSelectCourse: (courseId: string) => void;
  onOpenPlan: () => void;
  onOpenReminders: () => void;
  onOpenCertificate: () => void;
  onViewCatalog: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  courses,
  brands,
  learningPlan,
  reminder,
  onSelectCourse,
  onOpenPlan,
  onOpenReminders,
  onOpenCertificate,
  onViewCatalog,
}) => {
  const activeBrand = brands.find((b) => b.id === currentUser.brandId) || brands[0];

  // Active courses in progress
  const inProgressCourses = courses.filter(
    (c) => (c.progressPercent || 0) > 0 && c.status !== 'COMPLETED'
  );

  // Recommended courses for user's assigned brand
  const brandCourses = courses.filter(
    (c) => c.brandId === currentUser.brandId || !c.brandId
  );

  const completedCourses = courses.filter((c) => c.status === 'COMPLETED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Hero Welcome Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-r ${activeBrand?.bgGradient || 'from-slate-900 to-slate-950'} border border-slate-800 shadow-2xl relative overflow-hidden`}>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none hidden md:block">
          <img
            src={activeBrand?.bannerImage}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs font-semibold text-slate-200">
            <span>{activeBrand?.logo}</span>
            <span>{activeBrand?.name}</span>
            <span className="text-slate-500">•</span>
            <span className="text-amber-400">{currentUser.storeName}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            С возвращением, {currentUser.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Сегодня по графику: 10 минут микрообучения стандартам сервиса и продуктовым линейкам. Завершите урок, чтобы удержать стрик в <strong>{currentUser.streakDays} дней</strong>!
          </p>
        </div>
      </div>

      {/* 4 Stat Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Level & XP */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Уровень знаний</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 font-bold text-xs">
              {currentUser.level}
            </span>
          </div>
          <div>
            <div className="text-sm font-bold text-white truncate">{currentUser.levelTitle}</div>
            <div className="text-[11px] text-amber-400 font-semibold mt-0.5">
              {currentUser.xp} / {currentUser.xpToNextLevel} XP
            </div>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all"
              style={{ width: `${(currentUser.xp / currentUser.xpToNextLevel) * 100}%` }}
            />
          </div>
        </div>

        {/* Streak */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Стрик обучения</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            {currentUser.streakDays} <span className="text-xs font-bold text-slate-400">дней подряд</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-medium">
            Рекорд филиала: 14 дней
          </div>
        </div>

        {/* Completed Courses */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Курсов завершено</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {completedCourses.length} <span className="text-xs font-bold text-slate-400">из {courses.length}</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Все базовые модули сданы
          </div>
        </div>

        {/* Certificates */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Сертификаты</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-black text-purple-300">
              {currentUser.certificatesCount}
            </div>
            <button
              onClick={onOpenCertificate}
              className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition underline cursor-pointer"
            >
              Смотреть
            </button>
          </div>
          <div className="text-[11px] text-purple-300/80">
            Квалификация подтверждена
          </div>
        </div>

      </div>

      {/* Grid: Personal Learning Plan (Left) + Reminder Schedule Widget (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Personal Learning Plan Card (2 cols) */}
        {learningPlan && (
          <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Персональный план обучения</h3>
              </div>
              <button
                onClick={onOpenPlan}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold transition cursor-pointer"
              >
                Изменить трек →
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  Активный трек
                </span>
                <h4 className="text-sm font-bold text-white mt-1.5">{learningPlan.title}</h4>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Дедлайн: <strong>{learningPlan.targetDate}</strong></span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Осталось: <strong className="text-amber-400">{learningPlan.daysRemaining} дней</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <div className="text-right">
                  <div className="text-xs text-slate-400">Выполнение</div>
                  <div className="text-lg font-black text-amber-400">{learningPlan.progressPercent}%</div>
                </div>
              </div>
            </div>

            {/* Goals Checklist in Plan */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400">Обязательные этапы трека:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {learningPlan.goals.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => onSelectCourse(g.courseId)}
                    className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-2 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {g.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                      )}
                      <span className="text-xs text-slate-200 truncate font-medium">{g.courseTitle}</span>
                    </div>
                    <span className="text-[11px] font-bold text-amber-400 shrink-0">{g.progressPercent}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reminder & Notification Schedule Card (1 col) */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Расписание занятий</h3>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                reminder?.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
              }`}>
                {reminder?.isActive ? 'Активно' : 'Выключено'}
              </span>
            </div>

            <div className="mt-4 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
              <div className="text-xs text-slate-400">График микротренингов:</div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {reminder?.daysOfWeek.map((d) => (
                  <span key={d} className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-xs">
                    {d}
                  </span>
                ))}
                <span className="text-xs text-white font-semibold ml-1">в {reminder?.timeOfDay}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                PWA Web Push уведомления приходят за 15 минут до начала смены.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenReminders}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Настроить напоминания</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Section: Courses In Progress (if any) */}
      {inProgressCourses.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Play className="w-4 h-4 text-amber-400" />
              <span>Продолжить обучение</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgressCourses.map((c) => (
              <div
                key={c.id}
                onClick={() => onSelectCourse(c.id)}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 shadow-lg cursor-pointer transition space-y-3 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      {c.categoryLabel}
                    </span>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition line-clamp-1 mt-0.5">
                      {c.title}
                    </h3>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                    <Play className="w-4 h-4 fill-amber-400 ml-0.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Пройдено</span>
                    <span className="font-bold text-white">{c.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all"
                      style={{ width: `${c.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section: Recommended for Current Brand */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Рекомендовано для {activeBrand?.name}</span>
            </h2>
            <p className="text-xs text-slate-400">Ключевые стандарты обслуживания и продуктовые линейки</p>
          </div>
          <button
            onClick={onViewCatalog}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold transition cursor-pointer"
          >
            Весь каталог ({courses.length}) →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {brandCourses.slice(0, 3).map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectCourse(c.id)}
              className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 overflow-hidden cursor-pointer transition flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="relative h-36 w-full overflow-hidden bg-slate-950">
                  <img
                    src={c.coverImage}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-3 text-[11px] font-semibold text-amber-300 bg-slate-900/80 px-2 py-0.5 rounded">
                    {c.level}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition line-clamp-2">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {c.subtitle}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <div className="flex items-center justify-between text-xs font-semibold text-amber-400 pt-2 border-t border-slate-800/80">
                  <span>{c.status === 'COMPLETED' ? 'Пройден' : (c.progressPercent || 0) > 0 ? `${c.progressPercent}% готово` : 'Начать'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
