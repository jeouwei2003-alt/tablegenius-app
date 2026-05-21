import { useState, useMemo } from 'react';
import { Layers, Search, Plus, Trash2, ShieldAlert, SlidersHorizontal, ArrowLeft, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';
import { Course, TimetableRecommendation } from '../types';

interface AlternativesPageProps {
  recommendations: TimetableRecommendation[];
  activeOptionId: string;
  setActiveOptionId: (id: string) => void;
  currentCourses: Course[];
  allCourses: Course[];
  onAddCourse: (c: Course) => void;
  onRemoveCourse: (c: Course) => void;
  customCourseMap: Record<string, Course[]>;
  onResetCustomOption: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function AlternativesPage({
  recommendations,
  activeOptionId,
  setActiveOptionId,
  currentCourses,
  allCourses,
  onAddCourse,
  onRemoveCourse,
  customCourseMap,
  onResetCustomOption,
  onNext,
  onPrev
}: AlternativesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('모두');
  const [isCustomizing, setIsCustomizing] = useState(true);

  // Styling category badges
  const getCategoryTheme = (category: Course['category']) => {
    switch (category) {
      case '전공필수': return { bg: 'bg-indigo-50 border-indigo-200 text-indigo-700', badge: 'bg-indigo-600 text-white' };
      case '전공선택': return { bg: 'bg-teal-50 border-teal-200 text-teal-700', badge: 'bg-teal-600 text-white' };
      case '교양필수': return { bg: 'bg-amber-50 border-amber-200 text-amber-700', badge: 'bg-amber-600 text-white' };
      case '교양선택': return { bg: 'bg-emerald-50 border-emerald-200 text-emerald-700', badge: 'bg-emerald-600 text-white' };
    }
  };

  // Filter full academic syllabus for manual addition
  const filteredCatalog = useMemo(() => {
    return allCourses.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.professor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.major.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = filterCategory === '모두' || c.category === filterCategory;
      const isAlreadyAdded = currentCourses.some(added => added.id === c.id);
      return matchSearch && matchCategory && !isAlreadyAdded;
    });
  }, [allCourses, searchQuery, filterCategory, currentCourses]);

  // Detected timetable slots duplicates/conflicts internally
  const timeToMinutes = (timeStr: string): number => {
    const [hh, mm] = timeStr.split(':').map(Number);
    return hh * 60 + mm;
  };

  const conflictsList = useMemo(() => {
    const list: string[] = [];
    for (let i = 0; i < currentCourses.length; i++) {
      for (let j = i + 1; j < currentCourses.length; j++) {
        const cA = currentCourses[i];
        const cB = currentCourses[j];
        for (const sA of cA.timeSlots) {
          for (const sB of cB.timeSlots) {
            if (sA.day === sB.day) {
              const startA = timeToMinutes(sA.startTime);
              const endA = timeToMinutes(sA.endTime);
              const startB = timeToMinutes(sB.startTime);
              const endB = timeToMinutes(sB.endTime);
              if (Math.max(startA, startB) < Math.min(endA, endB)) {
                list.push(`[${sA.day}요일] ${cA.name} ↔ ${cB.name}겹침 (${sA.startTime}~${sA.endTime})`);
              }
            }
          }
        }
      }
    }
    return list;
  }, [currentCourses]);

  const activeOption = recommendations.find(r => r.id === activeOptionId);
  const isDirty = activeOption ? !!customCourseMap[activeOption.id] : false;

  return (
    <div className="space-y-6 animate-in fade-in duration-200" id="alternatives_page_view">
      
      {/* Title Header */}
      <div className="bg-gradient-to-r from-teal-50 to-indigo-50 border border-slate-100 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div className="space-y-1">
          <span className="text-[10px] text-teal-700 font-extrabold uppercase tracking-widest bg-teal-50 border border-teal-100 px-2.5 py-0.5 rounded-full leading-none">
            Step 7 / 8
          </span>
          <h2 className="text-slate-800 font-extrabold text-xl tracking-tight leading-none mt-1">대안 추천 선택 및 과목 커스텀 조율</h2>
          <p className="text-xs text-slate-400">
            총 3가지 옵션의 시간표 탭을 자유로이 클릭 정렬하고, 원하지 않는 시간의 과목은 교체/편입시킬 수 있습니다.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-850 text-white bg-slate-800 rounded-xl py-2 px-3.5 text-xs font-mono font-bold">
          <Layers className="h-4 w-4 text-teal-400" />
          <span>Interactive Comparative Option Matrix</span>
        </div>
      </div>

      {/* 3 Option Tab Switchers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map(rec => {
          const isActive = activeOptionId === rec.id;
          const totalCredits = (customCourseMap[rec.id] || rec.courses).reduce((s, c) => s + c.credits, 0);
          return (
            <div
              key={rec.id}
              onClick={() => setActiveOptionId(rec.id)}
              className={`p-4 rounded-2xl border cursor-pointer select-none transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/15 scale-[1.01]'
                  : 'bg-white border-slate-100 hover:border-slate-200 text-slate-700 shadow-sm'
              }`}
            >
              <div>
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${isActive ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {rec.name.split(':')[0]}
                  </span>
                  <span className="text-xs font-mono font-bold">{totalCredits}학점</span>
                </div>
                <h4 className="text-xs font-extrabold mt-3 font-sans truncate leading-tight">
                  {rec.name.split(':').slice(1).join(':').trim() || "맞춤 추천 배치"}
                </h4>
                <p className={`text-[10px] mt-1 line-clamp-2 leading-relaxed ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {rec.reasoning.overallSummary}
                </p>
              </div>
              <div className="border-t border-white/10 mt-3 pt-2 text-[9px] font-bold">
                확보 공강일 : {rec.metrics.freeDaysSecured.join(', ') || '없음'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Core Swapping Layout Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: List of currently selected lectures in the ACTIVE schedule */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-5 sm:p-6 lg:col-span-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-sans font-bold text-slate-800">선택된 ({activeOption?.name.split(':')[0]}) 현재 편입 과목</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">휴지통 버튼을 눌러 스케줄 표에서 과목을 격하/삭제하세요.</p>
            </div>
            {isDirty && (
              <button
                onClick={onResetCustomOption}
                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/60 px-2.5 py-1 rounded-lg font-bold"
              >
                교안 초기화
              </button>
            )}
          </div>

          {/* Conflicts alert inside step */}
          {conflictsList.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-[11px] text-rose-800 flex gap-2 animate-pulse">
              <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">과목 배치 시간대 충돌이 검출되었습니다:</span>
                <ul className="list-disc pl-3 text-[10px] mt-1 space-y-0.5">
                  {conflictsList.map((err, i) => <li key={i}>{err}</li>)}
                </ul>
              </div>
            </div>
          )}

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {currentCourses.map(course => {
              const theme = getCategoryTheme(course.category);
              return (
                <div key={course.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center gap-3">
                  <div className="max-w-[80%]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded ${theme.badge}`}>
                        {course.category}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 font-bold">{course.code}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-850 mt-1 truncate">{course.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{course.professor} • {course.credits}학점 • {course.timeSlots.map(s => `${s.day}(${s.startTime}~${s.endTime})`).join(", ")}</p>
                  </div>
                  <button
                    onClick={() => onRemoveCourse(course)}
                    className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl border border-red-100 transition duration-150"
                    title="과목 제외"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Search & Add new courses to this schedule */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-5 sm:p-6 lg:col-span-6 space-y-4 flex flex-col max-h-[500px]">
          <div className="border-b border-slate-100 pb-3 shrink-0">
            <h3 className="text-sm font-sans font-bold text-slate-800">교과 종합 수강 데이터베이스 검색</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">전체 학년 교안 중 관심 있는 과목의 '+' 버튼을 눌러 스케줄에 결합하세요.</p>
          </div>

          <div className="space-y-2 shrink-0">
            <div className="relative">
              <input
                type="text"
                placeholder="교과목명, 담당 교수명, 학과 검색..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 bg-slate-50 p-2.5 pl-8 text-slate-700 outline-none focus:border-indigo-500"
              />
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-3.5" />
            </div>

            <div className="flex gap-1 overflow-x-auto pb-1">
              {['모두', '전공필수', '전공선택', '교양필수', '교양선택'].map(c => (
                <button
                  key={c}
                  onClick={() => setFilterCategory(c)}
                  className={`px-2.5 py-1 text-[9px] font-bold rounded-lg border whitespace-nowrap transition ${
                    filterCategory === c
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-grow overflow-y-auto space-y-2 pr-1">
            {filteredCatalog.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-400 bg-slate-50 border border-dashed rounded-xl italic">
                검색 조건에 맞는 미등록 과목이 존재하지 않습니다.
              </div>
            ) : (
              filteredCatalog.map(co => {
                const subT = getCategoryTheme(co.category);
                return (
                  <div key={co.id} className="p-2.5 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-150 flex justify-between items-center gap-2">
                    <div className="max-w-[80%]">
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded ${subT.badge}`}>
                          {co.category}
                        </span>
                        <span className="text-[9px] text-indigo-600 bg-indigo-50 px-1 py-0.2 rounded font-sans font-bold">
                          {co.major}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold font-sans text-slate-800 mt-1 truncate">{co.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{co.professor} • {co.credits}학점 • {co.timeSlots.map(s => `${s.day}(${s.startTime}~${s.endTime})`).join(", ")}</p>
                    </div>
                    <button
                      onClick={() => onAddCourse(co)}
                      className="p-2 bg-indigo-55 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-600 border border-indigo-100 rounded-xl transition duration-150"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Navigation actions bar */}
      <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
        <button
          onClick={onPrev}
          className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>이전 AI 사정 리포트 (Step 6로)</span>
        </button>

        <button
          onClick={onNext}
          className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 shadow-md animate-bounce"
        >
          <span>최종 검증 및 완수하기 (Step 8로)</span>
          <ArrowRight className="h-4 w-4 text-indigo-300" />
        </button>
      </div>

    </div>
  );
}
