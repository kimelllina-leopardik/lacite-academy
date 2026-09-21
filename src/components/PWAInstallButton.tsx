import React, { useState } from 'react';
import { Download, Smartphone, X, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [simulatedInstall, setSimulatedInstall] = useState(false);

  if (isInstalled) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
        <Check className="w-3.5 h-3.5" />
        <span>PWA установлена</span>
      </div>
    );
  }

  // Chromium / Desktop / Android flow
  if (isInstallable) {
    return (
      <button
        id="btn-install-pwa"
        onClick={install}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3.5 py-1.5 text-xs font-semibold text-slate-950 shadow-md hover:from-amber-400 hover:to-amber-500 transition-all cursor-pointer"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Установить PWA</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          id="btn-install-ios"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700/80 transition"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          <span>Установить на iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  Установка G&M Academy на iPhone
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-400">1</span>
                  <p>Нажмите кнопку <strong>«Поделиться»</strong> (значок со стрелкой) в нижней панели Safari.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-400">2</span>
                  <p>Прокрутите вниз меню и выберите <strong>«На экран Домой»</strong> (Add to Home Screen).</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-400">3</span>
                  <p>Нажмите <strong>«Добавить»</strong> в правом верхнем углу для быстрого доступа оффлайн.</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-400 transition"
              >
                Понятно
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback test button for standard desktop browsers
  return (
    <button
      id="btn-pwa-info"
      onClick={() => {
        setSimulatedInstall(true);
        setTimeout(() => setSimulatedInstall(false), 4000);
      }}
      className="flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
      title="PWA готова к установке на поддерживаемых устройствах"
    >
      <Download className="w-3.5 h-3.5 text-amber-400" />
      <span>{simulatedInstall ? '✓ Готово к работе на моб. устройствах' : 'PWA Ready'}</span>
    </button>
  );
};
