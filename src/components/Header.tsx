import React, { useState } from 'react';
import { 
  Award, 
  Flame, 
  UserCheck, 
  ChevronDown, 
  Check, 
  BarChart3, 
  BookOpen, 
  Calendar, 
  Bell, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { User, Brand, UserRole, BrandId } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentUser: User;
  brands: Brand[];
  activeTab: 'dashboard' | 'courses' | 'plan' | 'analytics';
  setActiveTab: (tab: 'dashboard' | 'courses' | 'plan' | 'analytics') => void;
  onSwitchUser: (payload: { userId?: string; role?: UserRole; brandId?: BrandId }) => void;
  onOpenReminders: () => void;
  onOpenPlan: () => void;
  allUsers: User[];
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  brands,
  activeTab,
  setActiveTab,
  onSwitchUser,
  onOpenReminders,
  onOpenPlan,
  allUsers,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showBrandMenu, setShowBrandMenu] = useState(false);

  const activeBrand = brands.find((b) => b.id === currentUser.brandId) || brands[0];

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'EMPLOYEE':
        return 'Сотрудник (Консультант)';
      case 'STORE_MANAGER':
        return 'Директор магазина';
      case 'TRAINER_ADMIN':
        return 'Бизнес-тренер / Admin';
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'EMPLOYEE':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'STORE_MANAGER':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'TRAINER_ADMIN':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-md group-hover:border-amber-500/50 transition">
                <span className="text-base font-black tracking-tighter bg-gradient-to-r from-amber-400 via-rose-300 to-emerald-400 bg-clip-text text-transparent">G&M</span>
                <span className="absolute -bottom-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-slate-950"></span>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold tracking-tight text-white">G&M Group</span>
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Academy</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate max-w-[200px]">Корпоративное обучение</p>
              </div>
            </button>

            {/* Active Brand Switcher Pill */}
            <div className="relative ml-1 sm:ml-2">
              <button
                id="btn-brand-selector"
                onClick={() => setShowBrandMenu(!showBrandMenu)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 hover:border-slate-600 text-xs text-slate-200 transition"
              >
                <span className="text-sm">{activeBrand?.logo}</span>
                <span className="font-semibold hidden md:inline">{activeBrand?.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showBrandMenu && (
                <div className="absolute top-full mt-1.5 left-0 w-52 rounded-xl bg-slate-900 border border-slate-700 p-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Портфель брендов G&M
                  </div>
                  {brands.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        onSwitchUser({ brandId: b.id });
                        setShowBrandMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition ${
                        b.id === currentUser.brandId 
                          ? 'bg-amber-500/10 text-amber-300 font-semibold' 
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{b.logo}</span>
                        <span>{b.name}</span>
                      </div>
                      {b.id === currentUser.brandId && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              id="nav-tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'dashboard'
                  ? 'bg-slate-800 text-amber-400 shadow-inner'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Мое обучение</span>
            </button>
            <button
              id="nav-tab-courses"
              onClick={() => setActiveTab('courses')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'courses'
                  ? 'bg-slate-800 text-amber-400 shadow-inner'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Каталог курсов</span>
            </button>
            <button
              id="nav-tab-plan"
              onClick={onOpenPlan}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white transition"
            >
              <Calendar className="w-4 h-4" />
              <span>Индивидуальный план</span>
            </button>
            <button
              id="nav-tab-reminders"
              onClick={onOpenReminders}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white transition"
            >
              <Bell className="w-4 h-4" />
              <span>Напоминания</span>
            </button>
            {(currentUser.role === 'STORE_MANAGER' || currentUser.role === 'TRAINER_ADMIN') && (
              <button
                id="nav-tab-analytics"
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeTab === 'analytics'
                    ? 'bg-purple-950/50 text-purple-300 border border-purple-800/60'
                    : 'text-purple-400 hover:bg-purple-950/30'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Аналитика сети</span>
              </button>
            )}
          </nav>

          {/* Right Section: Stats, PWA Install & User Role Profile Switcher */}
          <div className="flex items-center gap-2.5">
            {/* Streak & XP Widget */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center gap-1 text-amber-400 text-xs font-bold" title="Дни непрерывного обучения (Стрик)">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
                <span>{currentUser.streakDays} дн.</span>
              </div>
              <div className="h-3 w-px bg-slate-700"></div>
              <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold" title="Очки опыта (XP)">
                <Award className="w-3.5 h-3.5" />
                <span>{currentUser.xp} XP</span>
              </div>
            </div>

            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Fast Role / User Profile Switcher */}
            <div className="relative">
              <button
                id="btn-user-role-menu"
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 p-1 pl-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 transition"
              >
                <div className="text-right hidden md:block">
                  <div className="text-xs font-semibold text-white leading-tight">{currentUser.name}</div>
                  <div className={`text-[10px] font-medium px-1.5 py-0.2 inline-block rounded-full border ${getRoleBadgeColor(currentUser.role)}`}>
                    {currentUser.role === 'EMPLOYEE' ? 'Сотрудник' : currentUser.role === 'STORE_MANAGER' ? 'Директор' : 'Тренер'}
                  </div>
                </div>
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-600"
                />
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-700 p-2 shadow-2xl z-50 text-slate-100">
                  <div className="p-2 border-b border-slate-800">
                    <div className="text-xs font-bold text-white">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-400">{currentUser.storeName}</div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-slate-300">
                      <span>Уровень: <strong>{currentUser.level} ({currentUser.levelTitle})</strong></span>
                      <span className="text-amber-400 font-bold">{currentUser.xp} / {currentUser.xpToNextLevel} XP</span>
                    </div>
                  </div>

                  <div className="pt-2 px-2 pb-1 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Переключить тестовую роль:
                  </div>

                  <div className="space-y-1">
                    {allUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          onSwitchUser({ userId: u.id });
                          setShowRoleMenu(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition ${
                          u.id === currentUser.id
                            ? 'bg-amber-500/15 border border-amber-500/30 text-amber-200'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={u.avatarUrl} className="w-7 h-7 rounded-lg object-cover" alt="" />
                          <div>
                            <div className="font-semibold">{u.name}</div>
                            <div className="text-[10px] text-slate-400">{getRoleLabel(u.role)}</div>
                          </div>
                        </div>
                        {u.id === currentUser.id && <Check className="w-4 h-4 text-amber-400" />}
                      </button>
                    ))}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between gap-2 px-1">
                    <button
                      onClick={() => {
                        onOpenReminders();
                        setShowRoleMenu(false);
                      }}
                      className="w-full text-center text-[11px] font-medium py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                    >
                      Расписание
                    </button>
                    <button
                      onClick={() => {
                        onOpenPlan();
                        setShowRoleMenu(false);
                      }}
                      className="w-full text-center text-[11px] font-medium py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                    >
                      Мой план
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Mobile Navigation Strip */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-800/60 no-scrollbar">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
              activeTab === 'dashboard' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400'
            }`}
          >
            Мое обучение
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
              activeTab === 'courses' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400'
            }`}
          >
            Каталог курсов
          </button>
          <button
            onClick={onOpenPlan}
            className="px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium text-slate-400"
          >
            План и дедлайны
          </button>
          <button
            onClick={onOpenReminders}
            className="px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium text-slate-400"
          >
            Напоминания
          </button>
          {(currentUser.role === 'STORE_MANAGER' || currentUser.role === 'TRAINER_ADMIN') && (
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
                activeTab === 'analytics' ? 'bg-purple-900/40 text-purple-300' : 'text-purple-400'
              }`}
            >
              Аналитика сети
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
