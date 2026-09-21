// TypeScript definitions for G&M Group Corporate Academy

export type UserRole = 'EMPLOYEE' | 'STORE_MANAGER' | 'TRAINER_ADMIN';

export type BrandId = 'lacite' | 'geox' | 'yves-rocher';

export type CourseCategory = 
  | 'SALES_TECHNIQUES' 
  | 'BRAND_BOOK_AND_PRODUCT' 
  | 'SERVICE_STANDARDS' 
  | 'STORE_MANAGEMENT';

export type ContentType = 'VIDEO' | 'TEXT_INFOGRAPHIC' | 'QUIZ';

export type ProgressStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export type PlanStatus = 'ACTIVE' | 'COMPLETED' | 'OVERDUE';

export interface Brand {
  id: BrandId;
  name: string;
  tagline: string;
  logo: string;
  brandColor: string;
  accentColor: string;
  bgGradient: string;
  description: string;
  bannerImage: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  storeId: string;
  storeName: string;
  brandId: BrandId;
  avatarUrl: string;
  level: number;
  levelTitle: string;
  xp: number;
  xpToNextLevel: number;
  streakDays: number;
  completedCoursesCount: number;
  certificatesCount: number;
  lastActiveAt: string;
  createdAt: string;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  explanation: string;
  tip?: string;
}

export interface QuizData {
  title: string;
  passingScorePercent: number; // usually 80
  questions: QuizQuestion[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  contentType: ContentType;
  durationMin: number;
  order: number;
  summary: string;
  videoUrl?: string;
  videoDurationSec?: number;
  textContent?: string;
  infographicItems?: {
    icon: string;
    title: string;
    description: string;
    tag?: string;
  }[];
  quizData?: QuizData;
  isLocked?: boolean;
  status?: ProgressStatus;
  userScore?: number;
  lastPositionSec?: number;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  order: number;
  description?: string;
  lessons: Lesson[];
  completedLessonsCount?: number;
  progressPercent?: number;
}

export interface Course {
  id: string;
  brandId?: BrandId | null; // null for universal courses (e.g. Sales)
  title: string;
  subtitle: string;
  description: string;
  category: CourseCategory;
  categoryLabel: string;
  level: 'Базовый' | 'Продвинутый' | 'Эксперт';
  estimatedHours: number;
  coverImage: string;
  badgeIcon: string;
  isMandatory: boolean;
  order: number;
  modulesCount: number;
  lessonsCount: number;
  progressPercent?: number;
  status?: ProgressStatus;
  modules?: Module[];
  tags: string[];
}

export interface UserProgressRecord {
  lessonId: string;
  status: ProgressStatus;
  quizScore?: number;
  lastPositionSec: number;
  completedAt?: string;
  attemptsCount: number;
}

export interface LearningPlanGoal {
  id: string;
  courseId: string;
  courseTitle: string;
  targetDate: string;
  isCompleted: boolean;
  progressPercent: number;
}

export interface LearningPlan {
  id: string;
  userId: string;
  title: string;
  trackType: string;
  targetDate: string;
  daysRemaining: number;
  status: PlanStatus;
  totalCoursesCount: number;
  completedCoursesCount: number;
  progressPercent: number;
  goals: LearningPlanGoal[];
}

export interface ReminderSetting {
  id: string;
  userId: string;
  daysOfWeek: string[]; // ['Пн', 'Ср', 'Пт']
  timeOfDay: string; // '10:00'
  isActive: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
}

export interface EmployeeProgressSummary {
  id: string;
  name: string;
  role: string;
  brandId: BrandId;
  storeName: string;
  avatarUrl: string;
  coursesCompleted: number;
  totalAssigned: number;
  overallProgressPercent: number;
  avgQuizScore: number;
  streakDays: number;
  lastActive: string;
  needsAttention: boolean;
  weakTopic?: string;
}

export interface AnalyticsData {
  totalEmployees: number;
  activeLearnersToday: number;
  averageCompletionRate: number;
  averageQuizScore: number;
  brandStats: {
    brandId: BrandId;
    brandName: string;
    employeesCount: number;
    avgProgress: number;
    topCourse: string;
  }[];
  storeStats: {
    storeName: string;
    brand: string;
    completionRate: number;
    activeCount: number;
  }[];
  employees: EmployeeProgressSummary[];
}
