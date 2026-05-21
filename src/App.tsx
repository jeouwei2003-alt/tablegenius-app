import { useState, useEffect } from 'react';
import { Course, UserPreferences, TimetableRecommendation, SavedTimetable } from './types';
import { UNIVERSITY_COURSES } from './data/courses';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import AcademicInputPage from './components/AcademicInputPage';
import PreferenceFormPage from './components/PreferenceFormPage';
import LoaderProcessingPage from './components/LoaderProcessingPage';
import TimetableGrid from './components/TimetableGrid';
import DetailAnalysisPage from './components/DetailAnalysisPage';
import AlternativesPage from './components/AlternativesPage';
import FinalCheckSavePage from './components/FinalCheckSavePage';

import { Sparkles, Calendar, Save, Bookmark, Compass, Sliders, CheckCircle2, ChevronRight, Lock, Layout, ListChecks } from 'lucide-react';

export default function App() {
  // Page step control state: Step 1 to Step 8
  const [activeStep, setActiveStep] = useState<number>(1);
  const [studentId, setStudentId] = useState<string>('202410294');

  const [preferences, setPreferences] = useState<UserPreferences>({
    grade: 3,
    major: '컴퓨터공학과',
    freeDays: ['금'],
    targetCredits: 18,
    currentCompletedCredits: {
      majorRequired: 24,
      majorElective: 18,
      generalRequired: 12,
      generalElective: 12
    },
    preferredKeywords: ['인공지능', '데이터베이스'],
    scheduleStyle: 'compact'
  });

  const [recommendations, setRecommendations] = useState<TimetableRecommendation[]>([]);
  const [activeOptionId, setActiveOptionId] = useState<string | null>(null);
  const [customCourseMap, setCustomCourseMap] = useState<Record<string, Course[]>>({});
  const [savedTimetables, setSavedTimetables] = useState<SavedTimetable[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isMockResponse, setIsMockResponse] = useState(false);

  // States for Save Name Modal
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveNameInput, setSaveNameInput] = useState('');

  // Define steps titles and subtitles
  const PAGE_STEPS = [
    { id: 1, label: "1. Landing", title: "소개 및 비전", desc: "수료 요건 요강 소개" },
    { id: 2, label: "2. Academic", title: "학적 및 기수강 기입", desc: "학년, 전공, 학번 설정" },
    { id: 3, label: "3. Preferences", title: "수강 선호 조건", desc: "요일 차단 및 목표 학점" },
    { id: 4, label: "4. Solver Loading", title: "AI 오차 검증 구동", desc: "실시간 스케줄러 시뮬레이션" },
    { id: 5, label: "5. Main Result", title: "주간 배치도 그리드", desc: "추천 배치 상세 점검" },
    { id: 6, label: "6. Detail Analysis", title: "AI 사정 분석 리포트", desc: "조학 및 졸업 기여 진단" },
    { id: 7, label: "7. Alternatives", title: "대안 과목 스왑", desc: "수정 보완 및 개별 맞춤" },
    { id: 8, label: "8. Final Check/Save", title: "검수 및 다운로드", desc: "엑셀/이미지 백업" }
  ];

  // 1. Initial Launch: Preload Default Timetable for 3rd Year CSE Student
  useEffect(() => {
    // Attempt local storage load for saved bookmarks
    const localSaved = localStorage.getItem('tablegenius_saved');
    if (localSaved) {
      try {
        setSavedTimetables(JSON.parse(localSaved));
      } catch (err) {
        console.error("Local storage bookmarks load fail", err);
      }
    }

    // Preload programmatically using our backend recommendation api
    const fetchDefault = async () => {
      try {
        const response = await fetch('/api/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(preferences)
        });
        const data = await response.json();
        if (data.success && data.recommendations?.length > 0) {
          setRecommendations(data.recommendations);
          setActiveOptionId(data.recommendations[0].id);
          setIsMockResponse(data.isMock);
        }
      } catch (err) {
        console.error("Preload API mismatch fallback initiated", err);
      }
    };
    fetchDefault();
  }, []);

  // 2. Trigger scheduler generate recommendation background flow during step 4 animation
  const handleGenerateRecommendationsAsync = async () => {
    // Jump straight to Solver Loading page (Step 4)
    setActiveStep(4);
    setIsLoading(true);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });
      const data = await response.json();
      
      if (data.success && data.recommendations?.length > 0) {
        setRecommendations(data.recommendations);
        setActiveOptionId(data.recommendations[0].id);
        setIsMockResponse(data.isMock);
        // Clean out dirty edits maps
        setCustomCourseMap({});
      }
    } catch (err) {
      console.error("API error during timetable refresh:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Navigate directly to step 5 once Step 4 solver completes
  const handleCompleteLoader = () => {
    setActiveStep(5);
  };

  // Select active timetable choice option
  const activeOption = recommendations.find(r => r.id === activeOptionId);

  // Return currently rendered active courses reflecting any custom replacements/additions
  const currentCourses = activeOption
    ? (customCourseMap[activeOption.id] || activeOption.courses)
    : [];

  // Manage individual customizations
  const handleAddCourse = (newCourse: Course) => {
    if (!activeOption) return;
    const currentList = customCourseMap[activeOption.id] || activeOption.courses;
    
    // Prevent duplicate entries
    if (currentList.some(c => c.id === newCourse.id)) return;

    const newList = [...currentList, newCourse];
    setCustomCourseMap({
      ...customCourseMap,
      [activeOption.id]: newList
    });
  };

  const handleRemoveCourse = (courseToRemove: Course) => {
    if (!activeOption) return;
    const currentList = customCourseMap[activeOption.id] || activeOption.courses;
    const newList = currentList.filter(c => c.id !== courseToRemove.id);
    
    setCustomCourseMap({
      ...customCourseMap,
      [activeOption.id]: newList
    });
  };

  // Reset customized courses of the active option back to standard
  const handleResetCustomOption = () => {
    if (!activeOption) return;
    const updatedMap = { ...customCourseMap };
    delete updatedMap[activeOption.id];
    setCustomCourseMap(updatedMap);
  };

  // 4. Save Bookmark Actions
  const handleOpenSaveModal = () => {
    if (!activeOption) return;
    // Default name based on options
    setSaveNameInput(`${activeOption.name.split(':')[0]} - ${preferences.major} ${preferences.grade}학년`);
    setIsSaveModalOpen(true);
  };

  const handleConfirmSave = () => {
    if (!activeOption) return;
    const finalName = saveNameInput.trim() || activeOption.name;
    const totalCredits = currentCourses.reduce((sum, c) => sum + c.credits, 0);

    const savedItem: SavedTimetable = {
      id: `saved-${Date.now()}`,
      name: finalName,
      grade: preferences.grade,
      major: preferences.major,
      courses: currentCourses,
      metrics: {
        totalCredits
      },
      reasoningSummary: activeOption.reasoning.overallSummary,
      createdAt: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
    };

    const updatedList = [savedItem, ...savedTimetables];
    setSavedTimetables(updatedList);
    localStorage.setItem('tablegenius_saved', JSON.stringify(updatedList));
    
    setIsSaveModalOpen(false);
  };

  const handleDeleteSaved = (id: string) => {
    const updated = savedTimetables.filter(item => item.id !== id);
    setSavedTimetables(updated);
    localStorage.setItem('tablegenius_saved', JSON.stringify(updated));
  };

  const handleLoadSaved = (saved: SavedTimetable) => {
    const loadedOptionId = `loaded-${saved.id}`;
    const loadedOption: TimetableRecommendation = {
      id: loadedOptionId,
      name: `불러온 기록: ${saved.name}`,
      courses: saved.courses,
      reasoning: {
        overallSummary: saved.reasoningSummary,
        graduationMatch: "저장된 기록에서 불러온 시간표 데이터셋입니다.",
        scheduleHighlights: ["이전에 저장된 세팅 복원 완료"]
      },
      metrics: {
        totalCredits: saved.metrics.totalCredits,
        majorRequiredCredits: saved.courses.filter(c => c.category === '전공필수').reduce((sum, c) => sum + c.credits, 0),
        majorElectiveCredits: saved.courses.filter(c => c.category === '전공선택').reduce((sum, c) => sum + c.credits, 0),
        generalRequiredCredits: saved.courses.filter(c => c.category === '교양필수').reduce((sum, c) => sum + c.credits, 0),
        generalElectiveCredits: saved.courses.filter(c => c.category === '교양선택').reduce((sum, c) => sum + c.credits, 0),
        hasConflicts: false,
        freeDaysSecured: []
      }
    };

    setRecommendations([loadedOption, ...recommendations.filter(r => !r.id.startsWith('loaded-'))]);
    setActiveOptionId(loadedOptionId);
    setActiveStep(5); // Jump straight to timetable results view page!
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans transition-all">
      <Header onReset={() => setActiveStep(1)} />

      {/* Main Workspace Frame container */}
      <main className="flex-grow max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Highly styled, interactive Vertical Step-Tracker Navigation menu */}
          <div className="lg:col-span-3 lg:sticky lg:top-20 z-20 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Layout className="h-4 w-4 text-indigo-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-800 uppercase tracking-widest font-sans">
                  TableGenius Workspace Mapped
                </span>
              </div>

              {/* Vertical list of 8 steps */}
              <div className="space-y-1">
                {PAGE_STEPS.map((step) => {
                  const isActive = activeStep === step.id;
                  const isDone = activeStep > step.id;

                  return (
                    <button
                      key={step.id}
                      onClick={() => setActiveStep(step.id)}
                      className={`w-full p-2.5 rounded-xl text-left border transition-all flex items-center justify-between gap-2.5 group cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 border-slate-900 text-white shadow font-sans scale-[1.01]'
                          : isDone
                            ? 'bg-emerald-50/40 border-emerald-100 text-emerald-950 hover:bg-emerald-50'
                            : 'bg-white border-transparent text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 max-w-[90%]">
                        {/* Numeric Badge Indicators */}
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold transition-all ${
                          isActive
                            ? 'bg-indigo-500 text-white shadow shadow-indigo-505/30'
                            : isDone
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                        }`}>
                          {isDone ? '✓' : step.id}
                        </div>
                        <div className="truncate">
                          <span className={`text-[11px] font-extrabold block leading-none ${isActive ? 'text-white' : 'text-slate-700'}`}>
                            {step.title}
                          </span>
                          <span className={`text-[9px] mt-0.5 block truncate leading-none ${isActive ? 'text-indigo-200/70' : 'text-slate-400'}`}>
                            {step.desc}
                          </span>
                        </div>
                      </div>

                      <ChevronRight className={`h-3.5 w-3.5 mt-0.5 shrink-0 transition ${isActive ? 'text-indigo-300 translate-x-0.5' : 'text-slate-300 hover:text-slate-500'}`} />
                    </button>
                  );
                })}
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50 block">
                <div className="flex gap-1.5 items-center">
                  <ListChecks className="h-4 w-4 text-indigo-500" />
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-sans">설정 요약</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-2 space-y-1 font-sans">
                  <p>• 학년/전공 : {preferences.grade}학년 / {preferences.major}</p>
                  <p>• 목표 학점 : {preferences.targetCredits}학점</p>
                  <p>• 차단 공강 : {preferences.freeDays.join(', ') || '지정 없음'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Active Page Content View Frame */}
          <div className="lg:col-span-9 bg-slate-50 rounded-3xl min-h-[500px]">
            
            {/* Page 1 (Landing) */}
            {activeStep === 1 && (
              <LandingPage 
                major={preferences.major} 
                onStart={() => setActiveStep(2)} 
              />
            )}

            {/* Page 2 (Input - Academic) */}
            {activeStep === 2 && (
              <AcademicInputPage
                major={preferences.major}
                setMajor={(m) => setPreferences({ ...preferences, major: m })}
                grade={preferences.grade}
                setGrade={(g) => setPreferences({ ...preferences, grade: g })}
                studentId={studentId}
                setStudentId={setStudentId}
                completedCredits={preferences.currentCompletedCredits}
                setCompletedCredits={(credits) => setPreferences({ ...preferences, currentCompletedCredits: credits })}
                onPrev={() => setActiveStep(1)}
                onNext={() => setActiveStep(3)}
              />
            )}

            {/* Page 3 (Input - Preferences) */}
            {activeStep === 3 && (
              <PreferenceFormPage
                grade={preferences.grade}
                major={preferences.major}
                freeDays={preferences.freeDays}
                setFreeDays={(days) => setPreferences({ ...preferences, freeDays: days })}
                targetCredits={preferences.targetCredits}
                setTargetCredits={(sc) => setPreferences({ ...preferences, targetCredits: sc })}
                preferredKeywords={preferences.preferredKeywords}
                setPreferredKeywords={(kws) => setPreferences({ ...preferences, preferredKeywords: kws })}
                scheduleStyle={preferences.scheduleStyle}
                setScheduleStyle={(style) => setPreferences({ ...preferences, scheduleStyle: style })}
                onPrev={() => setActiveStep(2)}
                onGenerate={handleGenerateRecommendationsAsync}
              />
            )}

            {/* Page 4 (Solver Loading Animation) */}
            {activeStep === 4 && (
              <LoaderProcessingPage
                major={preferences.major}
                grade={preferences.grade}
                freeDays={preferences.freeDays}
                targetCredits={preferences.targetCredits}
                scheduleStyle={preferences.scheduleStyle}
                onComplete={handleCompleteLoader}
              />
            )}

            {/* Page 5 (Main Results Timetable) */}
            {activeStep === 5 && (
              <div className="space-y-6">
                
                {/* Header info selector inside page */}
                {recommendations.length > 0 && activeOption && (
                  <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-md flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                      <span className="text-xs font-bold text-slate-400 shrink-0 font-sans uppercase tracking-wider block">선택 추천 옵션:</span>
                      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
                        {recommendations.map((rec) => (
                          <button
                            key={rec.id}
                            type="button"
                            onClick={() => setActiveOptionId(rec.id)}
                            className={`px-3 py-1.5 text-xs font-extrabold whitespace-nowrap rounded-lg transition-all ${
                              activeOptionId === rec.id
                                ? 'bg-slate-800 text-white shadow'
                                : 'text-slate-500 hover:bg-slate-205/50'
                            }`}
                          >
                            {rec.name.split(':')[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold px-3 py-1.5 rounded-xl font-sans shrink-0">
                      합계 {currentCourses.reduce((sum, c) => sum + c.credits, 0)}학점 배치 완료
                    </span>
                  </div>
                )}

                {/* Grid component rendering */}
                {activeOption ? (
                  <TimetableGrid
                    courses={currentCourses}
                    allCourses={UNIVERSITY_COURSES}
                    onAddCourse={handleAddCourse}
                    onRemoveCourse={handleRemoveCourse}
                    isCustomizing={false} // Only view block mode on Step 5
                  />
                ) : (
                  <div className="py-16 text-center italic text-slate-400 bg-white border rounded-2xl">
                    수강 시간표 정보가 비어있습니다. Step 3에서 최적 생성을 가동해주십시오.
                  </div>
                )}

                {/* Step bottom navigations */}
                <div className="pt-4 border-t border-slate-200/80 flex justify-between items-center">
                  <button
                    onClick={() => setActiveStep(3)}
                    className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                  >
                    <span>← 이전 선호 설정 (Step 3로)</span>
                  </button>

                  <button
                    onClick={() => setActiveStep(6)}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 shadow-md"
                  >
                    <span>수강 사정 AI 분석서 보기 (Step 6로) →</span>
                  </button>
                </div>

              </div>
            )}

            {/* Page 6 (AI Detail Analysis) */}
            {activeStep === 6 && activeOption && (
              <DetailAnalysisPage
                option={activeOption}
                preferences={preferences}
                isMock={isMockResponse}
                onPrev={() => setActiveStep(5)}
                onNext={() => setActiveStep(7)}
              />
            )}

            {/* Page 7 (Alternatives & Swap panel) */}
            {activeStep === 7 && (
              <AlternativesPage
                recommendations={recommendations}
                activeOptionId={activeOptionId || ''}
                setActiveOptionId={setActiveOptionId}
                currentCourses={currentCourses}
                allCourses={UNIVERSITY_COURSES}
                onAddCourse={handleAddCourse}
                onRemoveCourse={handleRemoveCourse}
                customCourseMap={customCourseMap}
                onResetCustomOption={handleResetCustomOption}
                onPrev={() => setActiveStep(6)}
                onNext={() => setActiveStep(8)}
              />
            )}

            {/* Page 8 (Final Check/Save to Bookmarks) */}
            {activeStep === 8 && (
              <FinalCheckSavePage
                activeOption={activeOption}
                currentCourses={currentCourses}
                preferences={preferences}
                savedTimetables={savedTimetables}
                onOpenSaveModal={handleOpenSaveModal}
                onDeleteSaved={handleDeleteSaved}
                onLoadSaved={handleLoadSaved}
                onPrev={() => setActiveStep(7)}
              />
            )}

          </div>

        </div>
      </main>

      {/* Save Timetable Name Dialog Modal popup */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-105 shadow-2xl animate-in fade-in zoom-in duration-150">
            <h4 className="text-sm font-sans font-extrabold text-slate-800 mb-2">시간표 북마크 저장</h4>
            <p className="text-[11px] text-slate-400 mb-4 font-sans">현재 구성된 맞춤 시간표에 의미 있는 이름을 붙인 후 보관함에 저장합니다.</p>
            
            <input
              id="save_timetable_name_input"
              type="text"
              placeholder="예: 옵션 1 - 금공강 실현형"
              value={saveNameInput}
              onChange={(e) => setSaveNameInput(e.target.value)}
              className="w-full text-xs px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-slate-50 mb-5 text-slate-800 font-bold"
            />

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setIsSaveModalOpen(false)}
                className="px-4 py-2 text-[11px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                취소
              </button>
              <button
                type="button"
                id="save_confirm_button"
                onClick={handleConfirmSave}
                className="px-5 py-2 text-[11px] font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>저장 완료</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer credits bar */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-slate-500 text-xs mt-12 shrink-0">
        <p className="font-sans">TableGenius © 2026. Designed with college student academic precision.</p>
        <p className="font-mono text-[10px] mt-1 text-slate-600">Full-Stack AI Solver running on secure sandboxed environments.</p>
      </footer>
    </div>
  );
}
