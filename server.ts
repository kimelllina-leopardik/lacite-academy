import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { 
  BRANDS, 
  INITIAL_USERS, 
  INITIAL_COURSES, 
  INITIAL_PLAN, 
  INITIAL_REMINDERS, 
  INITIAL_ANALYTICS 
} from "./src/data/learningData.ts";
import { User, LearningPlan, ReminderSetting, UserProgressRecord, BrandId, UserRole } from "./src/types.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Server-side State Engine
let users: User[] = [...INITIAL_USERS];
let currentUserId = users[0].id; // Zarina Rakhimova (Employee, Geox)
let courses = JSON.parse(JSON.stringify(INITIAL_COURSES));
let userProgress: Record<string, Record<string, UserProgressRecord>> = {
  'user-emp-1': {
    'les-s1-1': {
      lessonId: 'les-s1-1',
      status: 'COMPLETED',
      quizScore: 100,
      lastPositionSec: 15,
      completedAt: '2026-03-01T10:00:00.000Z',
      attemptsCount: 1,
    },
    'les-s1-2': {
      lessonId: 'les-s1-2',
      status: 'COMPLETED',
      quizScore: 100,
      lastPositionSec: 45,
      completedAt: '2026-03-02T11:00:00.000Z',
      attemptsCount: 1,
    },
  },
  'user-mgr-1': {},
  'user-trainer-1': {},
};

let userPlans: Record<string, LearningPlan> = {
  'user-emp-1': { ...INITIAL_PLAN },
};

let userReminders: Record<string, ReminderSetting> = {
  'user-emp-1': { ...INITIAL_REMINDERS },
};

let analytics = JSON.parse(JSON.stringify(INITIAL_ANALYTICS));

// Helper: Calculate lock status and completion percentages for a course
function computeCourseForUser(course: any, userId: string) {
  const userProg = userProgress[userId] || {};
  let totalLessons = 0;
  let completedLessons = 0;
  let previousLessonPassed = true; // First lesson of course is unlocked

  const enrichedModules = course.modules.map((module: any) => {
    let modCompleted = 0;
    const enrichedLessons = module.lessons.map((lesson: any) => {
      totalLessons++;
      const record = userProg[lesson.id];
      const isCompleted = record?.status === 'COMPLETED';
      if (isCompleted) {
        completedLessons++;
        modCompleted++;
      }

      // Business Rule: Next lesson is locked unless previous lesson quiz >= 80%
      const isLocked = !previousLessonPassed;

      // Update previousLessonPassed for subsequent lessons
      // If this lesson is completed with score >= 80% (or completed), next can unlock
      if (!isCompleted || (record.quizScore !== undefined && record.quizScore < 80)) {
        previousLessonPassed = false;
      } else {
        previousLessonPassed = true;
      }

      return {
        ...lesson,
        status: record ? record.status : 'NOT_STARTED',
        userScore: record ? record.quizScore : undefined,
        lastPositionSec: record ? record.lastPositionSec : 0,
        isLocked,
      };
    });

    return {
      ...module,
      lessons: enrichedLessons,
      completedLessonsCount: modCompleted,
      progressPercent: Math.round((modCompleted / Math.max(module.lessons.length, 1)) * 100),
    };
  });

  const progressPercent = Math.round((completedLessons / Math.max(totalLessons, 1)) * 100);
  const status = progressPercent === 100 ? 'COMPLETED' : progressPercent > 0 ? 'IN_PROGRESS' : 'NOT_STARTED';

  return {
    ...course,
    progressPercent,
    status,
    lessonsCount: totalLessons,
    modules: enrichedModules,
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes: Brands
  app.get("/api/brands", (req, res) => {
    res.json(BRANDS);
  });

  // API Routes: Current User & Auth
  app.get("/api/auth/me", (req, res) => {
    const user = users.find((u) => u.id === currentUserId) || users[0];
    res.json(user);
  });

  app.get("/api/auth/users", (req, res) => {
    res.json(users);
  });

  app.post("/api/auth/switch-user", (req, res) => {
    const { userId, role, brandId } = req.body;
    let target = users.find((u) => u.id === userId);

    if (!target && role) {
      target = users.find((u) => u.role === role);
    }

    if (target) {
      if (brandId && ['lacite', 'geox', 'yves-rocher'].includes(brandId)) {
        target.brandId = brandId as BrandId;
      }
      currentUserId = target.id;
      return res.json({ success: true, user: target });
    }

    res.status(404).json({ error: "User not found" });
  });

  app.post("/api/auth/update-profile", (req, res) => {
    const { name, storeName, brandId } = req.body;
    const user = users.find((u) => u.id === currentUserId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (name) user.name = name;
    if (storeName) user.storeName = storeName;
    if (brandId) user.brandId = brandId;

    res.json({ success: true, user });
  });

  // API Routes: Courses
  app.get("/api/courses", (req, res) => {
    const brandFilter = req.query.brand as string | undefined;
    const categoryFilter = req.query.category as string | undefined;

    let result = courses.map((course: any) => computeCourseForUser(course, currentUserId));

    if (brandFilter && brandFilter !== 'all') {
      result = result.filter((c: any) => !c.brandId || c.brandId === brandFilter);
    }

    if (categoryFilter && categoryFilter !== 'all') {
      result = result.filter((c: any) => c.category === categoryFilter);
    }

    res.json(result);
  });

  app.get("/api/courses/:id", (req, res) => {
    const course = courses.find((c: any) => c.id === req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    const computed = computeCourseForUser(course, currentUserId);
    res.json(computed);
  });

  // API Routes: Lessons
  app.get("/api/lessons/:id", (req, res) => {
    let foundLesson: any = null;
    let parentCourse: any = null;

    for (const c of courses) {
      for (const m of c.modules) {
        for (const l of m.lessons) {
          if (l.id === req.params.id) {
            foundLesson = l;
            parentCourse = c;
            break;
          }
        }
        if (foundLesson) break;
      }
      if (foundLesson) break;
    }

    if (!foundLesson) return res.status(404).json({ error: "Lesson not found" });

    // Compute lock status via course
    const computedCourse = computeCourseForUser(parentCourse, currentUserId);
    let computedLesson: any = null;
    for (const m of computedCourse.modules) {
      for (const l of m.lessons) {
        if (l.id === foundLesson.id) {
          computedLesson = l;
          break;
        }
      }
    }

    res.json({ lesson: computedLesson, course: computedCourse });
  });

  // API Routes: Progress Tracking
  app.post("/api/progress/save-position", (req, res) => {
    const { lessonId, positionSec } = req.body;
    if (!lessonId) return res.status(400).json({ error: "lessonId is required" });

    if (!userProgress[currentUserId]) {
      userProgress[currentUserId] = {};
    }

    const existing = userProgress[currentUserId][lessonId] || {
      lessonId,
      status: 'IN_PROGRESS',
      lastPositionSec: 0,
      attemptsCount: 0,
    };

    existing.lastPositionSec = positionSec || 0;
    if (existing.status !== 'COMPLETED') {
      existing.status = 'IN_PROGRESS';
    }

    userProgress[currentUserId][lessonId] = existing;
    res.json({ success: true, progress: existing });
  });

  app.post("/api/progress/submit-quiz", (req, res) => {
    const { lessonId, answers } = req.body;
    // answers is Record<questionId, selectedOptionId>
    if (!lessonId || !answers) {
      return res.status(400).json({ error: "lessonId and answers required" });
    }

    let targetLesson: any = null;
    for (const c of courses) {
      for (const m of c.modules) {
        for (const l of m.lessons) {
          if (l.id === lessonId) {
            targetLesson = l;
            break;
          }
        }
      }
    }

    if (!targetLesson || !targetLesson.quizData) {
      return res.status(404).json({ error: "Quiz not found for this lesson" });
    }

    const questions = targetLesson.quizData.questions;
    let correctCount = 0;
    const results: any[] = [];

    questions.forEach((q: any) => {
      const selectedOptionId = answers[q.id];
      const correctOption = q.options.find((o: any) => o.isCorrect);
      const isCorrect = selectedOptionId === correctOption?.id;
      if (isCorrect) correctCount++;

      results.push({
        questionId: q.id,
        question: q.question,
        selectedOptionId,
        correctOptionId: correctOption?.id,
        isCorrect,
        explanation: q.explanation,
      });
    });

    const scorePercent = Math.round((correctCount / questions.length) * 100);
    const minPass = targetLesson.quizData.passingScorePercent || 80;
    const passed = scorePercent >= minPass;

    if (!userProgress[currentUserId]) {
      userProgress[currentUserId] = {};
    }

    const prev: UserProgressRecord = userProgress[currentUserId][lessonId] || {
      lessonId,
      status: 'IN_PROGRESS',
      lastPositionSec: 0,
      attemptsCount: 0,
    };

    prev.attemptsCount += 1;
    prev.quizScore = scorePercent;

    const user = users.find((u) => u.id === currentUserId);

    if (passed) {
      prev.status = 'COMPLETED';
      prev.completedAt = new Date().toISOString();

      // Award XP to user if first pass
      if (user) {
        user.xp += 150;
        if (user.xp >= user.xpToNextLevel) {
          user.level += 1;
          user.xpToNextLevel += 1000;
        }
      }
    }

    userProgress[currentUserId][lessonId] = prev;

    res.json({
      success: true,
      passed,
      scorePercent,
      minPassScore: minPass,
      correctCount,
      totalQuestions: questions.length,
      results,
      userState: user,
    });
  });

  // API Routes: Learning Plans
  app.get("/api/learning-plan", (req, res) => {
    let plan = userPlans[currentUserId];
    if (!plan) {
      const user = users.find((u) => u.id === currentUserId);
      const brandName = user?.brandId === 'lacite' ? 'lacite.tj' : user?.brandId === 'geox' ? 'Geox' : 'Yves Rocher';
      plan = {
        id: `plan-${currentUserId}`,
        userId: currentUserId,
        title: `Индивидуальный трек: Консультант ${brandName}`,
        trackType: `${user?.brandId?.toUpperCase()}_TRACK`,
        targetDate: '2026-10-15',
        daysRemaining: 28,
        status: 'ACTIVE',
        totalCoursesCount: 2,
        completedCoursesCount: 1,
        progressPercent: 50,
        goals: [
          {
            id: 'g-1',
            courseId: 'course-sales-mastery',
            courseTitle: 'Техники продаж и золотые стандарты сервиса G&M',
            targetDate: '2026-10-01',
            isCompleted: true,
            progressPercent: 100,
          },
          {
            id: 'g-2',
            courseId: user?.brandId === 'lacite' ? 'course-lacite-parfum' : user?.brandId === 'geox' ? 'course-geox-tech' : 'course-yves-rocher-care',
            courseTitle: user?.brandId === 'lacite' ? 'Парфюмерная экспертиза lacite.tj' : user?.brandId === 'geox' ? 'Инновации Geox: Respira & Amphibiox' : 'Растительная косметика Yves Rocher',
            targetDate: '2026-10-15',
            isCompleted: false,
            progressPercent: 30,
          },
        ],
      };
      userPlans[currentUserId] = plan;
    }
    res.json(plan);
  });

  app.post("/api/learning-plan", (req, res) => {
    const { title, trackType, targetDate } = req.body;
    const plan = userPlans[currentUserId] || { ...INITIAL_PLAN, userId: currentUserId };

    if (title) plan.title = title;
    if (trackType) plan.trackType = trackType;
    if (targetDate) plan.targetDate = targetDate;

    userPlans[currentUserId] = plan;
    res.json({ success: true, plan });
  });

  // API Routes: Reminders
  app.get("/api/reminders", (req, res) => {
    let reminder = userReminders[currentUserId];
    if (!reminder) {
      reminder = { ...INITIAL_REMINDERS, userId: currentUserId };
      userReminders[currentUserId] = reminder;
    }
    res.json(reminder);
  });

  app.post("/api/reminders", (req, res) => {
    const { daysOfWeek, timeOfDay, isActive, pushEnabled, emailEnabled } = req.body;
    const current = userReminders[currentUserId] || { ...INITIAL_REMINDERS, userId: currentUserId };

    if (daysOfWeek) current.daysOfWeek = daysOfWeek;
    if (timeOfDay) current.timeOfDay = timeOfDay;
    if (isActive !== undefined) current.isActive = isActive;
    if (pushEnabled !== undefined) current.pushEnabled = pushEnabled;
    if (emailEnabled !== undefined) current.emailEnabled = emailEnabled;

    userReminders[currentUserId] = current;
    res.json({ success: true, reminder: current });
  });

  // API Routes: Trigger Notification Test
  app.post("/api/notifications/test", (req, res) => {
    const { title, body } = req.body;
    res.json({
      success: true,
      deliveredAt: new Date().toISOString(),
      notification: {
        title: title || "G&M Group Academy",
        body: body || "У вас остался 1 обязательный урок по стандартам сервиса на сегодня!",
        icon: "/icon.svg",
      },
    });
  });

  // API Routes: Analytics for Managers and Trainers
  app.get("/api/analytics", (req, res) => {
    res.json(analytics);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`G&M Group Academy server running on http://localhost:${PORT}`);
  });
}

startServer();
