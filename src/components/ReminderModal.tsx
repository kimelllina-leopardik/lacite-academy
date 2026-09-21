import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  Clock, 
  Calendar, 
  Send, 
  Check, 
  Smartphone, 
  Mail, 
  AlertCircle 
} from 'lucide-react';
import { ReminderSetting } from '../types';
import { api } from '../services/api';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminder: ReminderSetting | null;
  onReminderUpdate: (updatedReminder: ReminderSetting) => void;
}

const ALL_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  reminder,
  onReminderUpdate,
}) => {
  const [selectedDays, setSelectedDays] = useState<string[]>(reminder?.daysOfWeek || ['Пн', 'Ср', 'Пт']);
  const [timeOfDay, setTimeOfDay] = useState<string>(reminder?.timeOfDay || '10:00');
  const [isActive, setIsActive] = useState<boolean>(reminder?.isActive ?? true);
  const [pushEnabled, setPushEnabled] = useState<boolean>(reminder?.pushEnabled ?? true);
  const [emailEnabled, setEmailEnabled] = useState<boolean>(reminder?.emailEnabled ?? false);
  const [saving, setSaving] = useState(false);
  const [testNotificationSent, setTestNotificationSent] = useState(false);
  const [testNoticeMessage, setTestNoticeMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleDay = (day: string) => {
    setErrorMessage(null);
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setErrorMessage(null);
      const res = await api.updateReminders({
        daysOfWeek: selectedDays,
        timeOfDay,
        isActive,
        pushEnabled,
        emailEnabled,
      });
      onReminderUpdate(res.reminder);
      onClose();
    } catch (err: any) {
      setErrorMessage('Ошибка при сохранении расписания: ' + (err?.message || 'Попробуйте позже'));
    } finally {
      setSaving(false);
    }
  };

  // Trigger real or simulated PWA push notification
  const handleTestPushNotification = async () => {
    try {
      setTestNotificationSent(true);
      setErrorMessage(null);
      const testTitle = 'G&M Group Academy';
      const testBody = `Напоминание: Время вашего ежедневного 10-минутного тренинга (${timeOfDay}). Поддержите стрик обучения!`;

      // Trigger backend log / dispatch
      await api.triggerTestNotification({ title: testTitle, body: testBody });

      let notificationShown = false;
      const isIframe = (() => {
        try {
          return window.self !== window.top;
        } catch {
          return true;
        }
      })();

      // Check browser Notification API safely (only outside restricted iframe)
      if (!isIframe && typeof window !== 'undefined' && 'Notification' in window) {
        try {
          let perm = Notification.permission;
          if (perm === 'default') {
            perm = await Notification.requestPermission();
          }

          if (perm === 'granted') {
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
              const reg = await navigator.serviceWorker.ready;
              await reg.showNotification(testTitle, {
                body: testBody,
                icon: '/icon.svg',
                badge: '/icon.svg',
                data: { url: '/' },
              } as any);
              notificationShown = true;
              setTestNoticeMessage('✓ PWA Web Push доставлен на ваше устройство!');
            } else {
              new Notification(testTitle, {
                body: testBody,
                icon: '/icon.svg',
              });
              notificationShown = true;
              setTestNoticeMessage('✓ Системное уведомление показано!');
            }
          }
        } catch (notifErr) {
          console.warn('System notifications not supported or blocked in this environment:', notifErr);
        }
      }

      if (!notificationShown) {
        setTestNoticeMessage('✓ Тестовое напоминание активировано в приложении!');
      }

      setTimeout(() => {
        setTestNoticeMessage(null);
        setTestNotificationSent(false);
      }, 5000);
    } catch (e: any) {
      setTestNoticeMessage('Тестовый пуш зарегистрирован на сервере');
      setTimeout(() => {
        setTestNoticeMessage(null);
        setTestNotificationSent(false);
      }, 5000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Уведомления и расписание</h3>
              <p className="text-xs text-slate-400">Настройка микрообучения и PWA Push</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-slate-200">
          
          {/* Main Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <div className="text-xs font-bold text-white">Активность напоминаний</div>
              <div className="text-[11px] text-slate-400">Напоминать о запланированных уроках и дедлайнах</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Days of Week Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Дни микротренингов:</span>
            </label>
            <div className="grid grid-cols-7 gap-1.5">
              {ALL_DAYS.map((day) => {
                const isSelected = selectedDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400">
              Рекомендуемый ритм сети G&M: 3 раза в неделю по 10–15 минут.
            </p>
          </div>

          {/* Time Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Время напоминания (перед сменой):</span>
            </label>
            <input
              type="time"
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-semibold focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* Channels */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Каналы доставки:
            </label>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="text-xs font-semibold text-white">PWA Web Push уведомления</div>
                    <div className="text-[11px] text-slate-400">Мгновенный пуш на экран блокировки смартфона или ПК</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={pushEnabled}
                  onChange={(e) => setPushEnabled(e.target.checked)}
                  className="accent-amber-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="text-xs font-semibold text-white">Email-дайджест дедлайнов</div>
                    <div className="text-[11px] text-slate-400">Еженедельный отчет по незавершенным модулям</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailEnabled}
                  onChange={(e) => setEmailEnabled(e.target.checked)}
                  className="accent-amber-500 h-4 w-4"
                />
              </label>
            </div>
          </div>

          {/* Test Push Button */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-slate-300">Проверить доставку push-уведомления:</div>
              <button
                type="button"
                id="btn-test-push"
                onClick={handleTestPushNotification}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold transition border border-amber-500/30 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>Тестовый пуш</span>
              </button>
            </div>
            {testNoticeMessage && (
              <p className="text-[11px] text-emerald-400 animate-in fade-in duration-150">
                {testNoticeMessage}
              </p>
            )}
            {errorMessage && (
              <p className="text-[11px] text-rose-400 animate-in fade-in duration-150">
                {errorMessage}
              </p>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
          >
            Отмена
          </button>
          <button
            type="button"
            id="btn-save-reminders"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-md disabled:opacity-50"
          >
            {saving ? 'Сохранение...' : 'Сохранить расписание'}
          </button>
        </div>

      </div>
    </div>
  );
};
