import { User, Brand, Course, Lesson, LearningPlan, ReminderSetting, AnalyticsData, UserRole, BrandId } from '../types';

const API_BASE = '/api';

export const api = {
  // Brands
  async getBrands(): Promise<Brand[]> {
    const res = await fetch(`${API_BASE}/brands`);
    if (!res.ok) throw new Error('Failed to fetch brands');
    return res.json();
  },

  // Auth / Current User
  async getCurrentUser(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`);
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },

  async getAllUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/auth/users`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  async switchUser(payload: { userId?: string; role?: UserRole; brandId?: BrandId }): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`${API_BASE}/auth/switch-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to switch user');
    return res.json();
  },

  async updateProfile(payload: { name?: string; storeName?: string; brandId?: BrandId }): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`${API_BASE}/auth/update-profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  // Courses
  async getCourses(filters?: { brand?: string; category?: string }): Promise<Course[]> {
    const params = new URLSearchParams();
    if (filters?.brand) params.set('brand', filters.brand);
    if (filters?.category) params.set('category', filters.category);

    const url = `${API_BASE}/courses?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch courses');
    return res.json();
  },

  async getCourseById(id: string): Promise<Course> {
    const res = await fetch(`${API_BASE}/courses/${id}`);
    if (!res.ok) throw new Error('Failed to fetch course');
    return res.json();
  },

  // Lessons
  async getLessonById(id: string): Promise<{ lesson: Lesson; course: Course }> {
    const res = await fetch(`${API_BASE}/lessons/${id}`);
    if (!res.ok) throw new Error('Failed to fetch lesson');
    return res.json();
  },

  // Progress
  async savePosition(lessonId: string, positionSec: number) {
    const res = await fetch(`${API_BASE}/progress/save-position`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId, positionSec }),
    });
    if (!res.ok) throw new Error('Failed to save position');
    return res.json();
  },

  async submitQuiz(lessonId: string, answers: Record<string, string>) {
    const res = await fetch(`${API_BASE}/progress/submit-quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId, answers }),
    });
    if (!res.ok) throw new Error('Failed to submit quiz');
    return res.json();
  },

  // Learning Plan
  async getLearningPlan(): Promise<LearningPlan> {
    const res = await fetch(`${API_BASE}/learning-plan`);
    if (!res.ok) throw new Error('Failed to fetch learning plan');
    return res.json();
  },

  async updateLearningPlan(payload: { title?: string; trackType?: string; targetDate?: string }): Promise<{ success: boolean; plan: LearningPlan }> {
    const res = await fetch(`${API_BASE}/learning-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update plan');
    return res.json();
  },

  // Reminders
  async getReminders(): Promise<ReminderSetting> {
    const res = await fetch(`${API_BASE}/reminders`);
    if (!res.ok) throw new Error('Failed to fetch reminders');
    return res.json();
  },

  async updateReminders(payload: Partial<ReminderSetting>): Promise<{ success: boolean; reminder: ReminderSetting }> {
    const res = await fetch(`${API_BASE}/reminders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update reminders');
    return res.json();
  },

  // Trigger test notification
  async triggerTestNotification(payload: { title?: string; body?: string }) {
    const res = await fetch(`${API_BASE}/notifications/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to trigger notification');
    return res.json();
  },

  // Analytics
  async getAnalytics(): Promise<AnalyticsData> {
    const res = await fetch(`${API_BASE}/analytics`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },
};
