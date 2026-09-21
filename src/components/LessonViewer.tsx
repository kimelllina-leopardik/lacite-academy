import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  CheckCircle2, 
  Lock, 
  HelpCircle, 
  RotateCcw, 
  Award, 
  Clock, 
  ChevronRight, 
  Sparkles, 
  AlertCircle,
  FileText,
  Video as VideoIcon,
  Smile,
  Eye,
  Compass,
  MessageCircle,
  Target,
  ShieldCheck,
  DollarSign,
  Zap,
  Feather,
  Heart,
  Layers,
  Wind,
  Droplets,
  Shield,
  Sun,
  Recycle,
  HeartHandshake
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lesson, Course, User } from '../types';
import { api } from '../services/api';

interface LessonViewerProps {
  lessonId: string;
  onBack: () => void;
  onLessonChange: (newLessonId: string) => void;
  currentUser: User;
  onUserUpdate: (updatedUser: User) => void;
}

const ICON_MAP: Record<string, any> = {
  Smile, Eye, Compass, MessageCircle, Target, CheckCircle2, ShieldCheck,
  DollarSign, Zap, Feather, Heart, Layers, Wind, Droplets, Shield,
  Sun, Recycle, HeartHandshake
};

export const LessonViewer: React.FC<LessonViewerProps> = ({
  lessonId,
  onBack,
  onLessonChange,
  currentUser,
  onUserUpdate,
}) => {
  const [lessonData, setLessonData] = useState<{ lesson: Lesson; course: Course } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Video State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [savedPositionNotice, setSavedPositionNotice] = useState(false);

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizValidationWarning, setQuizValidationWarning] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<{
    passed: boolean;
    scorePercent: number;
    minPassScore: number;
    correctCount: number;
    totalQuestions: number;
    results: any[];
  } | null>(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  // Active View Tab inside lesson: 'content' | 'quiz'
  const [activeTab, setActiveTab] = useState<'content' | 'quiz'>('content');

  const fetchLesson = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getLessonById(lessonId);
      setLessonData(data);

      // Restore saved video / reading position
      if (data.lesson.lastPositionSec && data.lesson.lastPositionSec > 2) {
        setSavedPositionNotice(true);
        setTimeout(() => setSavedPositionNotice(false), 5000);
      }

      // If quiz was already completed previously with a score
      if (data.lesson.status === 'COMPLETED' && data.lesson.userScore !== undefined) {
        setQuizSubmitted(true);
        setQuizResult({
          passed: data.lesson.userScore >= 80,
          scorePercent: data.lesson.userScore,
          minPassScore: 80,
          correctCount: Math.round((data.lesson.userScore / 100) * (data.lesson.quizData?.questions.length || 1)),
          totalQuestions: data.lesson.quizData?.questions.length || 1,
          results: [],
        });
      } else {
        setQuizSubmitted(false);
        setQuizResult(null);
        setSelectedAnswers({});
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки урока');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  // Handle saved video position restoration
  useEffect(() => {
    if (videoRef.current && lessonData?.lesson.lastPositionSec) {
      videoRef.current.currentTime = lessonData.lesson.lastPositionSec;
      setVideoCurrentTime(lessonData.lesson.lastPositionSec);
    }
  }, [lessonData]);

  // Periodic position auto-save
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = Math.floor(videoRef.current.currentTime);
      setVideoCurrentTime(current);
      // Auto save position every 5 seconds
      if (current > 0 && current % 5 === 0) {
        api.savePosition(lessonId, current).catch(console.error);
      }
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        api.savePosition(lessonId, Math.floor(videoRef.current.currentTime)).catch(console.error);
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch((err) => {
              console.warn('Playback prevented or unsupported in current context:', err);
              setIsPlaying(false);
            });
        }
      }
    }
  };

  // Handle Quiz Submission
  const handleSubmitQuiz = async () => {
    if (!lessonData?.lesson.quizData) return;
    const questions = lessonData.lesson.quizData.questions;

    // Check if all questions are answered
    const unanswered = questions.some((q) => !selectedAnswers[q.id]);
    if (unanswered) {
      setQuizValidationWarning('Пожалуйста, ответьте на все вопросы теста перед завершением.');
      return;
    }

    try {
      setSubmittingQuiz(true);
      setQuizValidationWarning(null);
      const res = await api.submitQuiz(lessonId, selectedAnswers);
      setQuizResult(res);
      setQuizSubmitted(true);

      if (res.passed) {
        // Confetti explosion
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#38bdf8', '#fbbf24']
        });

        if (res.userState) {
          onUserUpdate(res.userState);
        }
      }
    } catch (err: any) {
      setQuizValidationWarning('Ошибка при отправке теста: ' + (err?.message || 'Попробуйте снова'));
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizResult(null);
    setQuizValidationWarning(null);
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mx-auto"></div>
          <p className="text-sm text-slate-400">Загрузка материалов урока G&M Academy...</p>
        </div>
      </div>
    );
  }

  if (error || !lessonData) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 rounded-2xl bg-slate-900 border border-rose-900/50 text-center">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">Не удалось открыть урок</h3>
        <p className="text-sm text-slate-400 mt-1">{error || 'Урок не найден'}</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium"
        >
          Вернуться к курсу
        </button>
      </div>
    );
  }

  const { lesson, course } = lessonData;

  // Flatten all lessons in the course to find prev and next
  const allLessons: Lesson[] = [];
  course.modules?.forEach((m) => {
    m.lessons.forEach((l) => allLessons.push(l));
  });

  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            id="btn-back-to-course"
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Вернуться к списку курсов"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="truncate max-w-[200px]">{course.title}</span>
              <span>/</span>
              <span className="text-amber-400 font-medium">Урок {lesson.order}</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">{lesson.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {lesson.status === 'COMPLETED' ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Урок успешно пройден</span>
              {lesson.userScore !== undefined && (
                <span className="ml-1 bg-emerald-500/20 px-1.5 py-0.5 rounded text-[11px]">{lesson.userScore}%</span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>{lesson.durationMin} мин • В процессе</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Viewer (Left) + Course Navigation Sidebar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Lesson Content, Video & Quiz (span 2) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Tab Bar: Materials vs Interactive Test */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900/90 border border-slate-800 w-fit">
            <button
              id="tab-lesson-content"
              onClick={() => setActiveTab('content')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'content'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {lesson.contentType === 'VIDEO' ? <VideoIcon className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
              <span>Обучающий материал</span>
            </button>
            {lesson.quizData && (
              <button
                id="tab-lesson-quiz"
                onClick={() => setActiveTab('quiz')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'quiz'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Тест / Квиз (Мин. 80%)</span>
                {quizResult?.passed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            )}
          </div>

          {/* Notice for restored session position */}
          {savedPositionNotice && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Прогресс возобновлен с сохраненной позиции: {lesson.lastPositionSec} сек.</span>
            </div>
          )}

          {activeTab === 'content' ? (
            <div className="space-y-6">
              {/* Video Player if ContentType is VIDEO */}
              {lesson.contentType === 'VIDEO' && (
                <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl group">
                  <video
                    ref={videoRef}
                    src={lesson.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={() => {
                      if (videoRef.current) setVideoDuration(videoRef.current.duration);
                    }}
                    className="w-full aspect-video object-cover"
                    playsInline
                  />
                  
                  {/* Custom Modern Video Overlay Controls */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 transition-opacity opacity-90 sm:opacity-0 sm:group-hover:opacity-100">
                    <div className="flex items-center gap-3 text-white">
                      <button
                        onClick={togglePlay}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition"
                      >
                        {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
                      </button>

                      {/* Progress Bar */}
                      <div className="flex-1 space-y-1">
                        <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-amber-500 h-full rounded-full transition-all"
                            style={{ width: `${(videoCurrentTime / (videoDuration || 1)) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-300">
                          <span>{Math.floor(videoCurrentTime)}s / {Math.floor(videoDuration || lesson.videoDurationSec || 60)}s</span>
                          <span className="text-amber-400 text-[10px]">Позиция сохраняется авто</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Lesson Summary Callout */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Цель урока</h4>
                  <p className="text-sm text-slate-300 mt-1 leading-relaxed">{lesson.summary}</p>
                </div>
              </div>

              {/* Infographics Grid */}
              {lesson.infographicItems && lesson.infographicItems.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Ключевые стандарты и алгоритмы</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {lesson.infographicItems.map((item, idx) => {
                      const IconComponent = ICON_MAP[item.icon] || Sparkles;
                      return (
                        <div 
                          key={idx}
                          className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 mb-2.5">
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Structured Markdown / Text Materials */}
              {lesson.textContent && (
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: lesson.textContent
                        .replace(/### (.*)/g, '<h3 class="text-base font-bold text-white mb-2">$1</h3>')
                        .replace(/#### (.*)/g, '<h4 class="text-sm font-semibold text-amber-400 mt-3 mb-1.5">$1</h4>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                        .replace(/\n\n/g, '<br/>')
                    }} 
                  />
                </div>
              )}

              {/* Proceed to Quiz Action CTA */}
              {lesson.quizData && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">Готовы подтвердить знания?</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Пройдите проверочный тест (требуется от 80%), чтобы разблокировать следующий урок.
                    </p>
                  </div>
                  <button
                    id="btn-start-quiz"
                    onClick={() => setActiveTab('quiz')}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 text-xs font-bold transition shadow-lg shrink-0 cursor-pointer"
                  >
                    Перейти к квизу
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Tab */
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white">{lesson.quizData?.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Проходной барьер: <strong className="text-amber-400">80%</strong> правильных ответов
                  </p>
                </div>
                {quizResult && (
                  <div className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                    quizResult.passed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    Результат: {quizResult.scorePercent}% ({quizResult.correctCount}/{quizResult.totalQuestions})
                  </div>
                )}
              </div>

              {/* Quiz Result Banner */}
              {quizSubmitted && quizResult && (
                <div className={`p-4 rounded-xl border ${
                  quizResult.passed 
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' 
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                }`}>
                  <div className="flex items-start gap-3">
                    {quizResult.passed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm">
                        {quizResult.passed ? 'Поздравляем! Тест успешно пройден!' : 'Барьер в 80% не достигнут'}
                      </h4>
                      <p className="text-xs opacity-90 leading-relaxed">
                        {quizResult.passed
                          ? `Вы набрали ${quizResult.scorePercent}%. Вам начислено +150 XP! Следующий урок в программе теперь разблокирован.`
                          : `Ваш результат: ${quizResult.scorePercent}%. По регламенту G&M Group для перехода к следующему уроку необходимо минимум 80%. Повторите материал и пройдите тест снова.`}
                      </p>
                      {!quizResult.passed && (
                        <button
                          onClick={handleRetakeQuiz}
                          className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/30 hover:bg-rose-500/40 text-white text-xs font-semibold transition"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Попробовать снова</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Questions List */}
              <div className="space-y-6">
                {lesson.quizData?.questions.map((q, qIndex) => {
                  const selected = selectedAnswers[q.id];
                  const qResult = quizResult?.results?.find((r) => r.questionId === q.id);

                  return (
                    <div 
                      key={q.id}
                      className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-400">
                          {qIndex + 1}
                        </span>
                        <h4 className="text-sm font-semibold text-white leading-relaxed">{q.question}</h4>
                      </div>

                      {/* Options */}
                      <div className="space-y-2 pl-8">
                        {q.options.map((opt) => {
                          const isSelected = selected === opt.id;
                          const isCorrect = opt.isCorrect;
                          let optionStyle = 'border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700';

                          if (quizSubmitted) {
                            if (isCorrect) {
                              optionStyle = 'border-emerald-500/50 bg-emerald-950/30 text-emerald-200';
                            } else if (isSelected && !isCorrect) {
                              optionStyle = 'border-rose-500/50 bg-rose-950/30 text-rose-200';
                            }
                          } else if (isSelected) {
                            optionStyle = 'border-amber-500 bg-amber-500/15 text-amber-200 font-medium';
                          }

                          return (
                            <label
                              key={opt.id}
                              className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition ${optionStyle}`}
                            >
                              <input
                                type="radio"
                                name={`question-${q.id}`}
                                value={opt.id}
                                disabled={quizSubmitted && quizResult?.passed}
                                checked={isSelected}
                                onChange={() => {
                                  if (quizSubmitted && quizResult?.passed) return;
                                  setSelectedAnswers((prev) => ({ ...prev, [q.id]: opt.id }));
                                }}
                                className="accent-amber-500"
                              />
                              <span className="flex-1">{opt.text}</span>
                              {quizSubmitted && isCorrect && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              )}
                            </label>
                          );
                        })}
                      </div>

                      {/* Explanation box after submission */}
                      {quizSubmitted && (
                        <div className="mt-2 ml-8 p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                          <strong className="text-amber-400">Пояснение методиста: </strong>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit Button */}
              {(!quizSubmitted || !quizResult?.passed) && (
                <div className="pt-2 flex flex-col sm:flex-row items-end sm:items-center justify-between gap-2">
                  {quizValidationWarning ? (
                    <span className="text-xs text-rose-400 font-medium animate-in fade-in">
                      {quizValidationWarning}
                    </span>
                  ) : <div />}
                  <button
                    id="btn-submit-quiz-answers"
                    onClick={handleSubmitQuiz}
                    disabled={submittingQuiz}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 font-bold text-xs shadow-lg transition cursor-pointer disabled:opacity-50"
                  >
                    {submittingQuiz ? 'Проверка ответов...' : 'Отправить ответы на проверку'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Bottom Prev / Next Navigation Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {prevLesson ? (
              <button
                onClick={() => onLessonChange(prevLesson.id)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-medium text-slate-300 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Предыдущий:</span>
                <span className="truncate max-w-[150px]">{prevLesson.title}</span>
              </button>
            ) : <div />}

            {nextLesson ? (
              nextLesson.isLocked ? (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-500 cursor-not-allowed">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Следующий заблокирован (сдайте тест)</span>
                </div>
              ) : (
                <button
                  id="btn-next-lesson"
                  onClick={() => onLessonChange(nextLesson.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-md"
                >
                  <span className="hidden sm:inline">Следующий:</span>
                  <span className="truncate max-w-[150px]">{nextLesson.title}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )
            ) : (
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-md"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Завершить курс</span>
              </button>
            )}
          </div>

        </div>

        {/* Right Column: Course Navigation Sidebar */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Содержание курса</h3>
            <h4 className="text-sm font-bold text-white mb-2">{course.title}</h4>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all"
                style={{ width: `${course.progressPercent || 0}%` }}
              />
            </div>

            {/* Modules and Lessons List */}
            <div className="space-y-4">
              {course.modules?.map((m) => (
                <div key={m.id} className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {m.title}
                  </div>
                  <div className="space-y-1">
                    {m.lessons.map((l) => {
                      const isCurrent = l.id === lesson.id;
                      const isCompleted = l.status === 'COMPLETED';
                      const isLocked = l.isLocked;

                      return (
                        <button
                          key={l.id}
                          disabled={isLocked}
                          onClick={() => onLessonChange(l.id)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition ${
                            isCurrent
                              ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold'
                              : isLocked
                              ? 'opacity-50 cursor-not-allowed text-slate-500'
                              : 'hover:bg-slate-800/80 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {isCompleted ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : isLocked ? (
                              <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                            )}
                            <span className="truncate">{l.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 ml-2 shrink-0">{l.durationMin}м</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
