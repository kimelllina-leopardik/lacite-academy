import React, { useState } from 'react';
import { X, Award, CheckCircle2, Download, Printer } from 'lucide-react';
import { User } from '../types';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  courseTitle?: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  courseTitle = 'Техники продаж и золотые стандарты сервиса G&M Group',
}) => {
  const [printNotice, setPrintNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      setPrintNotice('Печать во встроенном окне недоступна. Откройте приложение в отдельной вкладке.');
      setTimeout(() => setPrintNotice(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-amber-500/40 shadow-2xl overflow-hidden my-6">
        
        {/* Top Controls */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
            <Award className="w-4 h-4" />
            <span>Официальный сертификат G&M Group Corporate Academy</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Canvas */}
        <div className="p-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-center relative overflow-hidden border-8 border-slate-900 m-4 rounded-xl shadow-inner">
          {/* Subtle Decorative Borders */}
          <div className="absolute inset-2 border border-amber-500/30 rounded-lg pointer-events-none" />
          <div className="absolute inset-4 border border-amber-500/15 rounded-lg pointer-events-none" />

          {/* Seal / Logo */}
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-widest">
              G&M GROUP • RETAIL EXCELLENCE
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white uppercase">
              СЕРТИФИКАТ
            </h2>
            <p className="text-xs uppercase tracking-widest text-slate-400">
              О прохождении квалификационной программы обучения
            </p>

            <div className="py-3">
              <span className="text-xs text-slate-400 block mb-1">Настоящим подтверждается, что</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 border-b-2 border-amber-500/40 pb-1 inline-block">
                {currentUser.name}
              </span>
            </div>

            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              успешно освоил(а) корпоративную программу и подтвердил(а) стандарты обслуживания сети:
            </p>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 max-w-lg mx-auto">
              <div className="text-sm font-bold text-white">{courseTitle}</div>
              <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
                Итоговый балл тестирования: 96% • Квалификация подтверждена
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-left text-[11px] text-slate-400 max-w-md mx-auto border-t border-slate-800">
              <div>
                <div className="text-white font-bold">Бизнес-тренер G&M:</div>
                <div>Камилла Исмоилова</div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">Дата выдачи:</div>
                <div>2026-03-05</div>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 tracking-wider">
              ID Сертификата: GM-ACAD-2026-{currentUser.id.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <div className="text-xs text-slate-400">
              Сохраняется в профиле навсегда
            </div>
            {printNotice && (
              <div className="text-[11px] text-amber-400">
                {printNotice}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Печать</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-md"
            >
              Готово
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
