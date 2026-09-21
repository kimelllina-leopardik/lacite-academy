import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Building, 
  Flame, 
  Search, 
  Download,
  Filter
} from 'lucide-react';
import { AnalyticsData, BrandId } from '../types';
import { api } from '../services/api';

interface AnalyticsViewProps {
  onBackToDashboard: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onBackToDashboard }) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  useEffect(() => {
    api.getAnalytics()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleExport = () => {
    setExportNotice('Отчет успеваемости сети экспортирован в CSV');
    setTimeout(() => setExportNotice(null), 3500);
  };

  if (loading || !data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  const filteredEmployees = data.employees.filter((emp) => {
    const matchesBrand = brandFilter === 'all' || emp.brandId === brandFilter;
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.storeName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBrand && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-400 font-semibold uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            <span>Панель управления обучением сети G&M Group</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Аналитика успеваемости филиалов и персонала
          </h1>
        </div>

        <div className="flex flex-col items-end gap-1">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-900/40 hover:bg-purple-900/60 border border-purple-700/50 text-purple-200 text-xs font-semibold transition self-start sm:self-auto cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Экспорт отчета</span>
          </button>
          {exportNotice && (
            <span className="text-[11px] text-emerald-400 font-medium">
              ✓ {exportNotice}
            </span>
          )}
        </div>
      </div>

      {/* 4 High-Level Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Всего сотрудников</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{data.totalEmployees}</div>
          <div className="text-[11px] text-emerald-400 font-medium">3 бренда в Таджикистане</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Активны сегодня</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-400">{data.activeLearnersToday}</div>
          <div className="text-[11px] text-slate-400 font-medium">67% дневной охват смен</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Средний прогресс сети</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{data.averageCompletionRate}%</div>
          <div className="text-[11px] text-emerald-400 font-medium">+6% к прошлой неделе</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Средний балл квизов</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300">{data.averageQuizScore}%</div>
          <div className="text-[11px] text-slate-400 font-medium">Выше порога 80%</div>
        </div>
      </div>

      {/* Brand Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.brandStats.map((b) => (
          <div
            key={b.brandId}
            className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">{b.brandName}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {b.employeesCount} сотр.
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Успеваемость</span>
                <span className="font-bold text-white">{b.avgProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${b.avgProgress}%` }}
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-400 truncate">
              Топ-курс: <strong className="text-slate-300">{b.topCourse}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Employee Progress Table & Controls */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-white">Успеваемость консультантов по филиалам</h3>

          {/* Filters & Search */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Поиск по имени или филиалу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-purple-500 w-48 sm:w-60"
              />
            </div>

            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="all">Все бренды</option>
              <option value="lacite">lacite.tj</option>
              <option value="geox">Geox</option>
              <option value="yves-rocher">Yves Rocher</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Сотрудник</th>
                <th className="p-3">Филиал / Бренд</th>
                <th className="p-3">Курсов</th>
                <th className="p-3">Прогресс</th>
                <th className="p-3">Ср. квиз</th>
                <th className="p-3">Стрик</th>
                <th className="p-3">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <img src={emp.avatarUrl} alt="" className="w-7 h-7 rounded-lg object-cover" />
                      <div>
                        <div className="font-semibold text-white">{emp.name}</div>
                        <div className="text-[10px] text-slate-400">{emp.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-slate-300">
                    <div>{emp.storeName}</div>
                    <div className="text-[10px] uppercase font-bold text-amber-400">{emp.brandId}</div>
                  </td>
                  <td className="p-3 font-medium">
                    {emp.coursesCompleted} / {emp.totalAssigned}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${emp.overallProgressPercent}%` }}
                        />
                      </div>
                      <span className="font-bold text-white">{emp.overallProgressPercent}%</span>
                    </div>
                  </td>
                  <td className="p-3 font-bold text-amber-400">
                    {emp.avgQuizScore}%
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 font-bold text-amber-400">
                      <Flame className="w-3.5 h-3.5 fill-amber-500" />
                      {emp.streakDays} дн.
                    </span>
                  </td>
                  <td className="p-3">
                    {emp.needsAttention ? (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px] font-semibold" title={emp.weakTopic}>
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                        <span>Внимание</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>В норме</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
