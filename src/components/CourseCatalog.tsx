import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  Lock, 
  ArrowRight,
  Filter,
  Award
} from 'lucide-react';
import { Course, Brand, CourseCategory, BrandId } from '../types';

interface CourseCatalogProps {
  courses: Course[];
  brands: Brand[];
  onSelectCourse: (courseId: string) => void;
  selectedBrandFilter: string;
  setSelectedBrandFilter: (brand: string) => void;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  courses,
  brands,
  onSelectCourse,
  selectedBrandFilter,
  setSelectedBrandFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredCourses = courses.filter((c) => {
    const matchesBrand =
      selectedBrandFilter === 'all' ||
      (!c.brandId && selectedBrandFilter === 'all') ||
      c.brandId === selectedBrandFilter;

    const matchesCategory =
      selectedCategory === 'all' || c.category === selectedCategory;

    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesBrand && matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Каталог обучающих программ G&M Group
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Техники продаж, золотые стандарты сервиса и продуктовые бренд-буки
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        {/* Brand Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedBrandFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedBrandFilter === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            Все бренды сети
          </button>
          {brands.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBrandFilter(b.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedBrandFilter === b.id
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span>{b.logo}</span>
              <span>{b.name}</span>
            </button>
          ))}
        </div>

        {/* Category Filter & Search Box */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Все категории
            </button>
            <button
              onClick={() => setSelectedCategory('SALES_TECHNIQUES')}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === 'SALES_TECHNIQUES'
                  ? 'bg-slate-800 text-amber-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Техники продаж
            </button>
            <button
              onClick={() => setSelectedCategory('BRAND_BOOK_AND_PRODUCT')}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === 'BRAND_BOOK_AND_PRODUCT'
                  ? 'bg-slate-800 text-amber-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Продуктовые бренд-буки
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Поиск по курсам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((c) => {
          const brandObj = brands.find((b) => b.id === c.brandId);
          const isCompleted = c.status === 'COMPLETED';

          return (
            <div
              key={c.id}
              className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 shadow-xl overflow-hidden flex flex-col justify-between transition group"
            >
              <div>
                {/* Cover Banner */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                  <img
                    src={c.coverImage}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Brand Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] font-semibold text-white">
                    {brandObj ? (
                      <>
                        <span>{brandObj.logo}</span>
                        <span>{brandObj.name}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>Все бренды G&M</span>
                      </>
                    )}
                  </div>

                  {/* Level & Hours */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-slate-900/90 text-amber-300 font-medium">
                      {c.level}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3 h-3" />
                      {c.estimatedHours} ч.
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition line-clamp-2">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {c.subtitle || c.description}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Прогресс курса</span>
                      <span className="font-bold text-white">{c.progressPercent || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all"
                        style={{ width: `${c.progressPercent || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {c.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 text-[10px] font-medium border border-slate-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => onSelectCourse(c.id)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                    isCompleted
                      ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/50'
                      : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Пройден • Повторить</span>
                    </>
                  ) : (
                    <>
                      <span>{(c.progressPercent || 0) > 0 ? 'Продолжить обучение' : 'Начать обучение'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
