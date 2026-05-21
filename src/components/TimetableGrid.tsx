import { useState, useMemo } from 'react';
import { Course, TimeSlot } from '../types';
import { Clock, Info, Check, AlertTriangle, Plus, Trash2 } from 'lucide-react';

interface TimetableGridProps {
  courses: Course[];
  allCourses: Course[];
  onAddCourse?: (course: Course) => void;
  onRemoveCourse?: (course: Course) => void;
  isCustomizing: boolean;
}

// Convert "HH:MM" string to minutes from start of day
function timeToMinutes(timeStr: string): number {
  const [hh, mm] = timeStr.split(':').map(Number);
  return hh * 60 + mm;
}

const START_OF_DAY_MINS = 9 * 60; // 09:00 AM
const END_OF_DAY_MINS = 18 * 60;  // 06:00 PM
const TOTAL_DAY_DURATION = END_OF_DAY_MINS - START_OF_DAY_MINS; // 540 minutes

export default function TimetableGrid({
  courses,
  allCourses,
  onAddCourse,
  onRemoveCourse,
  isCustomizing
}: TimetableGridProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('모두');

  const days: ('월' | '화' | '수' | '목' | '금')[] = ['월', '화', '수', '목', '금'];
  const gridHours = [9, 10, 11, 12, 13, 14, 15, 16, 17];

  // Detect and catalog conflicting time slots
  const conflicts = useMemo(() => {
    const list: { courseA: Course; courseB: Course; day: string; slotStr: string }[] = [];
    for (let i = 0; i < courses.length; i++) {
      for (let j = i + 1; j < courses.length; j++) {
        const cA = courses[i];
        const cB = courses[j];
        for (const sA of cA.timeSlots) {
          for (const sB of cB.timeSlots) {
            if (sA.day === sB.day) {
              const startA = timeToMinutes(sA.startTime);
              const endA = timeToMinutes(sA.endTime);
              const startB = timeToMinutes(sB.startTime);
              const endB = timeToMinutes(sB.endTime);
              
              if (Math.max(startA, startB) < Math.min(endA, endB)) {
                // overlap!
                list.push({
                  courseA: cA,
                  courseB: cB,
                  day: sA.day,
                  slotStr: `${sA.startTime}~${sA.endTime}와 ${sB.startTime}~${sB.endTime}`
                });
              }
            }
          }
        }
      }
    }
    return list;
  }, [courses]);

  // Styling maps based on Category
  const getCategoryStyles = (category: Course['category']) => {
    switch (category) {
      case '전공필수':
        return {
          bg: 'bg-indigo-50 hover:bg-indigo-100',
          border: 'border-indigo-300 border-l-4 border-l-indigo-600',
          text: 'text-indigo-900',
          badge: 'bg-indigo-600 text-white',
          accent: 'indigo'
        };
      case '전공선택':
        return {
          bg: 'bg-teal-50 hover:bg-teal-100',
          border: 'border-teal-200 border-l-4 border-l-teal-500',
          text: 'text-teal-900',
          badge: 'bg-teal-600 text-white',
          accent: 'teal'
        };
      case '교양필수':
        return {
          bg: 'bg-amber-50 hover:bg-amber-100',
          border: 'border-amber-300 border-l-4 border-l-amber-500',
          text: 'text-amber-900',
          badge: 'bg-amber-600 text-white',
          accent: 'amber'
        };
      case '교양선택':
        return {
          bg: 'bg-emerald-50 hover:bg-emerald-100',
          border: 'border-emerald-200 border-l-4 border-l-emerald-500',
          text: 'text-emerald-900',
          badge: 'bg-emerald-600 text-white',
          accent: 'emerald'
        };
    }
  };

  // Filter the full catalog for customization search
  const filteredCatalog = useMemo(() => {
    return allCourses.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.professor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.major.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = filterCategory === '모두' || c.category === filterCategory;
      const isAlreadyAdded = courses.some(added => added.id === c.id);
      return matchSearch && matchCategory && !isAlreadyAdded;
    });
  }, [allCourses, searchQuery, filterCategory, courses]);

  return (
    <div className="space-y-6">
      {/* Conflicts Indicator Toast */}
      {conflicts.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex gap-3 text-rose-800 animate-pulse shadow-sm">
          <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">시간표 중복(Conflict) 발생 알림</h4>
            <ul className="text-xs list-disc pl-4 space-y-1 mt-1 text-rose-700 font-semibold">
              {conflicts.map((conf, index) => (
                <li key={index}>
                  [{conf.day}요일] <strong>{conf.courseA.name}</strong> ↔ <strong>{conf.courseB.name}</strong> ({conf.slotStr}) 수업 시간이 겹칩니다!
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Main Grid and Customizer Layout */}
      <div className={`grid grid-cols-1 ${isCustomizing ? 'lg:grid-cols-12' : ''} gap-6`}>
        
        {/* Timetable Visualizer Grid */}
        <div className={`bg-white rounded-2xl border border-slate-100 shadow-lg p-5 ${isCustomizing ? 'lg:col-span-8' : 'w-full'}`}>
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
            <h3 className="font-sans font-bold text-slate-800 text-md flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>주간 강의 배치도</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">09:00 - 18:00</span>
          </div>

          <div className="relative border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/40">
            {/* Grid Coordinates column and days rows */}
            <div className="grid grid-cols-6 border-b border-slate-200 bg-slate-100/70 text-center py-2.5">
              <div className="text-xs font-semibold text-slate-400 font-mono flex items-center justify-center">시간 / 교시</div>
              {days.map(d => (
                <div key={d} className="text-xs font-bold text-slate-700 font-sans">{d}요일</div>
              ))}
            </div>

            {/* Timetable Grid Slots Canvas */}
            <div className="relative flex min-h-[500px]">
              
              {/* Hour vertical coordinate lines */}
              <div className="w-[16.666%] border-r border-slate-200/80 flex flex-col justify-between shrink-0 bg-slate-50/50">
                {gridHours.map((h, i) => (
                  <div key={h} className="h-[55px] border-b border-slate-200/40 last:border-0 pl-2 pr-1 pt-1.5 flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 font-mono">{String(h).padStart(2, '0')}:00</span>
                    <span className="text-[8px] bg-slate-200/40 text-slate-500 font-bold px-1 py-0.5 rounded scale-90 origin-left mt-0.5 w-max">
                      {(h - 8)}교시
                    </span>
                  </div>
                ))}
              </div>

              {/* Day container columns */}
              <div className="flex-grow grid grid-cols-5 relative">
                {days.map((day, dIdx) => {
                  const dayCourses = courses.filter(c => c.timeSlots.some(s => s.day === day));
                  const isLastDay = dIdx === days.length - 1;

                  return (
                    <div 
                      key={day} 
                      className={`relative h-full flex flex-col justify-between ${isLastDay ? '' : 'border-r border-slate-200/75'}`}
                    >
                      {/* Grid background lines for alignment */}
                      {gridHours.map(h => (
                        <div key={h} className="h-[55px] border-b border-slate-200/30 last:border-0" />
                      ))}

                      {/* Course item absolute cards */}
                      {dayCourses.map(course => {
                        const style = getCategoryStyles(course.category);
                        const slot = course.timeSlots.find(s => s.day === day)!;
                        
                        // Compute positions
                        const startMin = timeToMinutes(slot.startTime);
                        const endMin = timeToMinutes(slot.endTime);
                        
                        const topPct = ((startMin - START_OF_DAY_MINS) / TOTAL_DAY_DURATION) * 100;
                        const heightPct = ((endMin - startMin) / TOTAL_DAY_DURATION) * 100;

                        // Check if this course has a conflict with another active course
                        const hasConflict = conflicts.some(conf => conf.courseA.id === course.id || conf.courseB.id === course.id);

                        return (
                          <div
                            key={`${course.id}-${day}`}
                            id={`course_card_${course.id}`}
                            onClick={() => setSelectedCourse(course)}
                            className={`absolute w-[94%] left-[3%] rounded-lg p-2 ${style.bg} ${style.border} ${style.text} shadow-sm cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md z-10 flex flex-col justify-between select-none overflow-hidden`}
                            style={{
                              top: `${topPct}%`,
                              height: `${heightPct}%`,
                            }}
                          >
                            <div className="flex-grow">
                              <div className="flex justify-between items-start gap-1">
                                <span className={`text-[8px] font-extrabold px-1 py-0.5 rounded ${style.badge} tracking-wide shrink-0 scale-90`}>
                                  {course.category}
                                </span>
                                {hasConflict && (
                                  <AlertTriangle className="h-3.5 w-3.5 text-rose-500 fill-rose-50 animate-bounce cursor-help" />
                                )}
                              </div>
                              <h4 className="text-[10px] sm:text-xs font-bold leading-tight tracking-tight mt-1 truncate">
                                {course.name}
                              </h4>
                              <p className="text-[9px] text-slate-500 truncate leading-snug">
                                {course.professor}
                              </p>
                            </div>
                            <div className="flex justify-between items-center border-t border-slate-200/40 pt-1 mt-1 text-[8px] font-medium text-slate-400">
                              <span>{slot.startTime}~{slot.endTime}</span>
                              <span className="font-extrabold text-slate-500">{course.credits}학점</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>

        {/* Dynamic Catalog Panel for Customize / Replacement */}
        {isCustomizing && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-5 lg:col-span-4 flex flex-col max-h-[580px]">
            <div className="pb-3 border-b border-slate-100 mb-3 shrink-0">
              <h3 className="font-sans font-bold text-slate-800 text-sm flex items-center justify-between">
                <span>과목 추가 및 커스텀 조율</span>
                <span className="bg-amber-50 text-amber-700 text-[10px] px-2 py-0.5 rounded-full border border-amber-100 font-sans font-semibold">
                  Custom Mode
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">시간표에 새로운 과목을 직접 더하거나 조밀하게 교체하세요.</p>
            </div>

            {/* Inputs & Filter selectors */}
            <div className="space-y-2 mb-3 shrink-0">
              <input
                id="catalog_search_query"
                type="text"
                placeholder="과목명, 교수명, 전공 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
              />
              <div className="flex gap-1 overflow-x-auto pb-1">
                {['모두', '전공필수', '전공선택', '교양필수', '교양선택'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] whitespace-nowrap font-bold border transition ${
                      filterCategory === cat
                        ? 'bg-slate-800 border-slate-800 text-white shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable list items */}
            <div className="flex-grow overflow-y-auto space-y-2.5 pr-1">
              {filteredCatalog.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-400 italic bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  매칭되는 과목이 없거나<br />이미 시간표에 추가되었습니다.
                </div>
              ) : (
                filteredCatalog.map(item => {
                  const itemStyle = getCategoryStyles(item.category);
                  return (
                    <div 
                      key={item.id} 
                      className="p-3 border border-slate-100 rounded-xl bg-slate-50/40 hover:bg-slate-50 transition flex justify-between items-center gap-2"
                    >
                      <div className="max-w-[75%]">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded ${itemStyle.badge}`}>
                            {item.category}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 font-mono">{item.code}</span>
                          <span className="text-[10px] text-indigo-600 bg-indigo-50/50 font-bold px-1 py-0.2 rounded font-sans">
                            {item.major}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold font-sans text-slate-800 mt-1 truncate">{item.name}</h4>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>{item.professor}</span>
                          <span>|</span>
                          <span className="font-semibold text-slate-500 font-mono">{item.credits}학점</span>
                        </div>
                        <div className="text-[9px] text-slate-500 mt-1 bg-slate-100/50 p-1.5 rounded border border-slate-200/50 font-mono">
                          {item.timeSlots.map(s => `${s.day}(${s.startTime}~${s.endTime})`).join(", ")}
                        </div>
                      </div>
                      <button
                        id={`add_btn_${item.id}`}
                        onClick={() => onAddCourse && onAddCourse(item)}
                        className="bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white p-2 rounded-xl transition duration-200 border border-indigo-100"
                        title="시간표에 추가"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}
      </div>

      {/* Course Detail Slide-Over / Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden border border-slate-100 shadow-2xl animate-in fade-in zoom-in duration-150">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-5 text-white flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-indigo-500 font-extrabold uppercase px-2 py-0.5 rounded">
                    {selectedCourse.category}
                  </span>
                  <span className="text-xs font-mono text-indigo-200">{selectedCourse.code}</span>
                </div>
                <h3 className="font-sans font-extrabold text-lg mt-1 text-white">{selectedCourse.name}</h3>
                <p className="text-xs text-indigo-200/70 mt-1">{selectedCourse.major} • {selectedCourse.grade}학년 추천</p>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-indigo-200/60 hover:text-white text-xl font-bold bg-white/10 h-7 w-7 rounded-lg flex items-center justify-center"
              >
                ×
              </button>
            </div>

            {/* Details */}
            <div className="p-6 space-y-4">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">담당 교수</span>
                <p className="text-sm font-semibold text-slate-800">{selectedCourse.professor}</p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">강의 핵심 설명</span>
                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {selectedCourse.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">이수 학점</span>
                  <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full inline-block border border-indigo-100">
                    {selectedCourse.credits} 학점
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">선수 과목</span>
                  <p className="text-sm text-slate-600">
                    {selectedCourse.prerequisite ? (
                      <span className="text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full text-xs font-bold inline-block">
                        {selectedCourse.prerequisite} 이수 권장
                      </span>
                    ) : '없음'}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">지정 시간 및 요일</span>
                <div className="flex gap-1 flex-wrap mt-1">
                  {selectedCourse.timeSlots.map((slot, i) => (
                    <span key={i} className="bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-indigo-500" />
                      {slot.day}요일 {slot.startTime}~{slot.endTime} ({(slot.startPeriod)}교시)
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions footer */}
            <div className="bg-slate-50 px-6 py-4 flex gap-2 justify-end border-t border-slate-100">
              {isCustomizing && onRemoveCourse ? (
                <button
                  type="button"
                  id={`remove_btn_${selectedCourse.id}`}
                  onClick={() => {
                    onRemoveCourse(selectedCourse);
                    setSelectedCourse(null);
                  }}
                  className="bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition duration-150 border border-rose-100 flex items-center Gap-1.5"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>시간표에서 삭제</span>
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
