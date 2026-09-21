import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { CourseCatalog } from './components/CourseCatalog';
import { LessonViewer } from './components/LessonViewer';
import { AnalyticsView } from './components/AnalyticsView';
import { PersonalPlanModal } from './components/PersonalPlanModal';
import { ReminderModal } from './components/ReminderModal';
import { CertificateModal } from './components/CertificateModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { User, Brand, Course, LearningPlan, ReminderSetting, UserRole, BrandId } from './types';
import { api } from './services/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [learningPlan, setLearningPlan] = useState<LearningPlan | null>(null);
  const [reminder, setReminder] = useState<ReminderSetting | null>(null);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'plan' | 'analytics'>('dashboard');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('all');

  // Modal States
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Register PWA Service Worker on startup (safely bypass in iframe environments)
  useEffect(() => {
    const isIframe = (() => {
      try {
        return window.self !== window.top;
      } catch {
        return true;
      }
    })();

    if (!isIframe && 'serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
      try {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('G&M Group Academy Service Worker registered successfully:', reg.scope);
          })
          .catch((err) => {
            console.warn('Service Worker registration skipped or failed:', err);
          });
      } catch (err) {
        console.warn('Service Worker registration not supported:', err);
      }
    }
  }, []);

  // Initial Data Load
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [u, allU, b, c, lp, rem] = await Promise.all([
        api.getCurrentUser(),
        api.getAllUsers(),
        api.getBrands(),
        api.getCourses(),
        api.getLearningPlan(),
        api.getReminders(),
      ]);

      setCurrentUser(u);
      setAllUsers(allU);
      setBrands(b);
      setCourses(c);
      setLearningPlan(lp);
      setReminder(rem);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Refresh courses and plan when user switches
  const handleSwitchUser = async (payload: { userId?: string; role?: UserRole; brandId?: BrandId }) => {
    try {
      const res = await api.switchUser(payload);
      setCurrentUser(res.user);
      setActiveLessonId(null);
      
      const [c, lp, rem] = await Promise.all([
        api.getCourses(),
        api.getLearningPlan(),
        api.getReminders(),
      ]);
      setCourses(c);
      setLearningPlan(lp);
      setReminder(rem);
    } catch (e) {
      console.error('Switch user failed:', e);
    }
  };

  // Open Course and find first uncompleted or first available lesson
  const handleSelectCourse = async (courseId: string) => {
    try {
      const course = await api.getCourseById(courseId);
      // Find first lesson that is not locked and not completed, or just first lesson
      let targetLessonId = '';
      if (course.modules && course.modules.length > 0) {
        for (const m of course.modules) {
          for (const l of m.lessons) {
            if (!l.isLocked && l.status !== 'COMPLETED') {
              targetLessonId = l.id;
              break;
            }
          }
          if (targetLessonId) break;
        }
        if (!targetLessonId && course.modules[0].lessons.length > 0) {
          targetLessonId = course.modules[0].lessons[0].id;
        }
      }

      if (targetLessonId) {
        setActiveLessonId(targetLessonId);
      }
    } catch (err) {
      console.error('Failed to select course:', err);
    }
  };

  // Callback when lesson completes or quiz is scored
  const handleUserUpdate = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    // Refresh courses list to update progress bars & locks
    api.getCourses().then(setCourses).catch(console.error);
    api.getLearningPlan().then(setLearningPlan).catch(console.error);
  };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-100">
        <div className="text-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-xl mx-auto">
            <span className="text-xl font-black bg-gradient-to-r from-amber-400 via-rose-300 to-emerald-400 bg-clip-text text-transparent">G&M</span>
          </div>
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent mx-auto"></div>
          <p className="text-xs text-slate-400">Загрузка корпоративной академии G&M Group...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      
      {/* Top Application Header */}
      <Header
        currentUser={currentUser}
        brands={brands}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveLessonId(null);
          setActiveTab(tab);
        }}
        onSwitchUser={handleSwitchUser}
        onOpenReminders={() => setShowReminderModal(true)}
        onOpenPlan={() => setShowPlanModal(true)}
        allUsers={allUsers}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeLessonId ? (
          <LessonViewer
            lessonId={activeLessonId}
            onBack={() => {
              setActiveLessonId(null);
              api.getCourses().then(setCourses).catch(console.error);
            }}
            onLessonChange={(newId) => setActiveLessonId(newId)}
            currentUser={currentUser}
            onUserUpdate={handleUserUpdate}
          />
        ) : activeTab === 'dashboard' ? (
          <Dashboard
            currentUser={currentUser}
            courses={courses}
            brands={brands}
            learningPlan={learningPlan}
            reminder={reminder}
            onSelectCourse={handleSelectCourse}
            onOpenPlan={() => setShowPlanModal(true)}
            onOpenReminders={() => setShowReminderModal(true)}
            onOpenCertificate={() => setShowCertificateModal(true)}
            onViewCatalog={() => setActiveTab('courses')}
          />
        ) : activeTab === 'courses' ? (
          <CourseCatalog
            courses={courses}
            brands={brands}
            onSelectCourse={handleSelectCourse}
            selectedBrandFilter={selectedBrandFilter}
            setSelectedBrandFilter={setSelectedBrandFilter}
          />
        ) : activeTab === 'analytics' ? (
          <AnalyticsView onBackToDashboard={() => setActiveTab('dashboard')} />
        ) : null}
      </main>

      {/* Offline Connectivity Banner */}
      <OfflineIndicator />

      {/* Modals */}
      <PersonalPlanModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        plan={learningPlan}
        onPlanUpdate={setLearningPlan}
        currentUser={currentUser}
        onSelectCourse={(courseId) => {
          setShowPlanModal(false);
          handleSelectCourse(courseId);
        }}
      />

      <ReminderModal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        reminder={reminder}
        onReminderUpdate={setReminder}
      />

      <CertificateModal
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        currentUser={currentUser}
      />

      {/* Corporate Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">G&M Group Academy</span>
            <span>•</span>
            <span>lacite.tj</span>
            <span>•</span>
            <span>Geox</span>
            <span>•</span>
            <span>Yves Rocher</span>
          </div>
          <div>
            © 2026 G&M Group. Все права защищены. Корпоративная система обучения персонала.
          </div>
        </div>
      </footer>

    </div>
  );
}
