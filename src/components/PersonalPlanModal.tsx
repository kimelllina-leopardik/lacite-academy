import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Target, 
  Sparkles, 
  Award,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { LearningPlan, User } from '../types';
import { api } from '../services/api';

interface PersonalPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: LearningPlan | null;
  onPlanUpdate: (updatedPlan: LearningPlan) => void;
  currentUser: User;
  onSelectCourse: (courseId: string) => void;
}

const PRESET_TRACKS = [
  {
    type: 'GEOX_INTERN',
    title: 'Индивидуальный трек: Стажер Geox — Быстрый старт (14 дней)',
    brand: 'Geox',
    durationDays: 14,
    description: 'Обязательный вводный курс для консультантов Geox: техники продаж, перфорированная подошва Respira и мембрана Amphibiox.',
  },
  {
    type: 'LACITE_PARFUM_EXPERT',
    title: 'Индивидуальный трек: Эксперт по парфюмерии lacite.tj (30 дней)',
    brand: 'lacite.tj',
    durationDays: 30,
    description: 'Глубокое изучение нишевых парфюмерных брендов, ольфакторных семейств, нот уда, амбры и стандартов люксового сервиса.',
  },
  {
    type: 'YVES_ROCHER_ADVISOR',
    title: 'Индивидуальный трек: Консультант Растительной Косметики Yves Rocher (21 день)',
    brand: 'Yves Rocher',
    durationDays: 21,
    description: 'Освоение ритуалов Botanical Beauty, диагностика кожи в зале, гаммы Riche Crème, Elixir Botanique и эко-принципы Бретани.',
  },
  {
    type: 'STORE_LEADER',
    title: 'Лидерская программа: Управляющий магазином G&M (45 дней)',
    brand: 'G&M Group',
    durationDays: 45,
    description: 'Операционное управление бутиком, стандарты кассовой дисциплины, мерчандайзинг, обучение и наставничество стажеров.',
  },
];

export const PersonalPlanModal: React.FC<PersonalPlanModalProps> = ({
  isOpen,
  onClose,
  plan,
  onPlanUpdate,
  currentUser,
  onSelectCourse,
}) => {
  const [selectedTrack, setSelectedTrack] = useState(plan?.trackType || 'GEOX_INTERN');
  const [targetDate, setTargetDate] = useState(plan?.targetDate || '2026-10-15');
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  if (!isOpen || !plan) return null;

  const handleSaveTrack = async (track: typeof PRESET_TRACKS[0]) => {
    try {
      setSaving(true);
      setStatusMessage(null);
      const calculatedDate = new Date();
      calculatedDate.setDate(calculatedDate.getDate() + track.durationDays);
      const dateStr = calculatedDate.toISOString().split('T')[0];

      const res = await api.updateLearningPlan({
        title: track.title,
        trackType: track.type,
        targetDate: dateStr,
      });

      onPlanUpdate(res.plan);
      setStatusMessage({ type: 'success', text: `Трек "${track.brand}" успешно назначен!` });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Ошибка обновления плана: ' + (err?.message || 'Не удалось обновить') });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Персональный план обучения</h3>
              <p className="text-xs text-slate-400">Индивидуальный трек сотрудника и таймлайн дедлайнов</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto no-scrollbar">
          
          {/* Current Active Plan Overview Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-slate-800/80 to-slate-900 border border-amber-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                  Текущий активный трек
                </span>
                <h4 className="text-sm font-bold text-white mt-1.5">{plan.title}</h4>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Дедлайн: <strong>{plan.targetDate}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Осталось: <strong className="text-amber-400">{plan.daysRemaining} дней</strong></span>
                  </div>
                </div>
              </div>

              {/* Circular / Pill progress */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between">
                <div className="text-xs text-slate-400">Выполнено</div>
                <div className="text-xl font-black text-amber-400">{plan.progressPercent}%</div>
              </div>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${plan.progressPercent}%` }}
              />
            </div>

            {statusMessage && (
              <div
                className={`mt-3 p-2.5 rounded-lg text-xs font-semibold ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {statusMessage.text}
              </div>
            )}
          </div>

          {/* Timeline of Goals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <span>Таймлайн обязательных этапов:</span>
            </h4>

            <div className="space-y-2.5">
              {plan.goals.map((goal, idx) => (
                <div
                  key={goal.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition ${
                    goal.isCompleted
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 shrink-0 font-bold text-xs">
                      {goal.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{goal.courseTitle}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Дедлайн этапа: {goal.targetDate}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">{goal.progressPercent}%</span>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectCourse(goal.courseId);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
                    >
                      К курсу
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preset Tracks Switcher */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Сменить или сгенерировать новую индивидуальную траекторию:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRESET_TRACKS.map((t) => (
                <button
                  key={t.type}
                  onClick={() => handleSaveTrack(t)}
                  disabled={saving}
                  className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                    plan.trackType === t.type
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-semibold'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white">{t.brand}</span>
                    <span className="text-[10px] text-amber-400 font-medium">{t.durationDays} дн.</span>
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {t.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
          >
            Закрыть
          </button>
        </div>

      </div>
    </div>
  );
};
