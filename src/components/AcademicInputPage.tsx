import { useState, useEffect, useMemo } from 'react';
import { BookOpen, User, ArrowRight, ArrowLeft, Check, Award, AlertCircle, Info } from 'lucide-react';

interface AcademicInputPageProps {
  major: string;
  setMajor: (m: string) => void;
  grade: number;
  setGrade: (g: number) => void;
  studentId: string;
  setStudentId: (s: string) => void;
  completedCredits: {
    majorRequired: number;
    majorElective: number;
    generalRequired: number;
    generalElective: number;
  };
  setCompletedCredits: (credits: {
    majorRequired: number;
    majorElective: number;
    generalRequired: number;
    generalElective: number;
  }) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function AcademicInputPage({
  major,
  setMajor,
  grade,
  setGrade,
  studentId,
  setStudentId,
  completedCredits,
  setCompletedCredits,
  onNext,
  onPrev
}: AcademicInputPageProps) {
  const [pulseLive, setPulseLive] = useState(false);

  // Trigger feedback pulse animation when CompletedCredits changes
  useEffect(() => {
    setPulseLive(true);
    const timer = setTimeout(() => setPulseLive(false), 500);
    return () => clearTimeout(timer);
  }, [completedCredits, major, grade, studentId]);

  // Comprehensive historical lower-semester courses database
  const previousCoursesCatalog = useMemo(() => {
    return [
      // CSE Year 1 & 2
      { id: "pre-cs101", code: "CSE1001", name: "프로그래밍 기초 및 실습", major: "컴퓨터공학과", category: "전공필수", credits: 3, semesterGrade: 1 },
      { id: "pre-cs102", code: "CSE1002", name: "이산수학 및 논리", major: "컴퓨터공학과", category: "전공선택", credits: 3, semesterGrade: 1 },
      { id: "pre-cs201", code: "CSE2001", name: "자료구조와 실습", major: "컴퓨터공학과", category: "전공필수", credits: 3, semesterGrade: 2 },
      { id: "pre-cs202", code: "CSE2002", name: "객체지향 설계와 Java", major: "컴퓨터공학과", category: "전공선택", credits: 3, semesterGrade: 2 },
      { id: "pre-cs203", code: "CSE2003", name: "컴퓨터 구조", major: "컴퓨터공학과", category: "전공선택", credits: 3, semesterGrade: 2 },

      // BUS Year 1 & 2
      { id: "pre-bus101", code: "BUS1001", name: "경영학원론 및 트렌드", major: "경영학과", category: "전공필수", credits: 3, semesterGrade: 1 },
      { id: "pre-bus102", code: "BUS1002", name: "경제학개론", major: "경영학과", category: "전공선택", credits: 3, semesterGrade: 1 },
      { id: "pre-bus201", code: "BUS2001", name: "마케팅원론", major: "경영학과", category: "전공필수", credits: 3, semesterGrade: 2 },
      { id: "pre-bus202", code: "BUS2002", name: "재무회계의 이해", major: "경영학과", category: "전공필수", credits: 3, semesterGrade: 2 },
      { id: "pre-bus203", code: "BUS2003", name: "조직행동론", major: "경영학과", category: "전공선택", credits: 3, semesterGrade: 2 },

      // MED Year 1 & 2
      { id: "pre-med101", code: "MED1001", name: "디지털 미디어와 사회", major: "미디어커뮤니케이션학과", category: "전공필수", credits: 3, semesterGrade: 1 },
      { id: "pre-med102", code: "MED1002", name: "매스커뮤니케이션 효과 이론", major: "미디어커뮤니케이션학과", category: "전공선택", credits: 3, semesterGrade: 1 },
      { id: "pre-med201", code: "MED2001", name: "저널리즘의 이해와 글쓰기", major: "미디어커뮤니케이션학과", category: "전공필수", credits: 3, semesterGrade: 2 },
      { id: "pre-med202", code: "MED2002", name: "비디오 콘텐츠 크리에이션", major: "미디어커뮤니케이션학과", category: "전공선택", credits: 3, semesterGrade: 2 },

      // Common GE Year 1 & 2
      { id: "pre-gen101", code: "GEN1001", name: "대학 영어 및 학술적 글쓰기", major: "공통", category: "교양필수", credits: 2, semesterGrade: 1 },
      { id: "pre-gen102", code: "GEN1002", name: "논해석적 비판적 사고와 질문", major: "공통", category: "교양필수", credits: 2, semesterGrade: 1 },
      { id: "pre-gen201", code: "GEN2001", name: "세계 문명사 속의 예술 기행", major: "공통", category: "교양선택", credits: 3, semesterGrade: 2 },
      { id: "pre-gen202", code: "GEN2002", name: "현대 기술과 지식재산권 특허", major: "공통", category: "교양선택", credits: 3, semesterGrade: 2 }
    ];
  }, []);

  // Filter historical courses by matching selected major as well as GE
  // Only show past courses (e.g., courses of grade < current grade)
  const applicableHistoricalCourses = useMemo(() => {
    return previousCoursesCatalog.filter(c => {
      const matchMajor = c.major === major || c.major === "공통";
      const matchGrade = c.semesterGrade < grade;
      return matchMajor && matchGrade;
    });
  }, [previousCoursesCatalog, major, grade]);

  // Keep track of which historical course IDs are selected
  const [checkedCourseIds, setCheckedCourseIds] = useState<string[]>([]);

  // Toggle checklist courses and compute the totals instantly
  const handleToggleCourse = (id: string) => {
    let nextChecked = [...checkedCourseIds];
    if (nextChecked.includes(id)) {
      nextChecked = nextChecked.filter(x => x !== id);
    } else {
      nextChecked.push(id);
    }
    setCheckedCourseIds(nextChecked);

    // Sum up based on selected courses
    let majorRequired = 0;
    let majorElective = 0;
    let generalRequired = 0;
    let generalElective = 0;

    nextChecked.forEach(cid => {
      const target = previousCoursesCatalog.find(p => p.id === cid);
      if (target) {
        if (target.category === "전공필수") majorRequired += target.credits;
        else if (target.category === "전공선택") majorElective += target.credits;
        else if (target.category === "교양필수") generalRequired += target.credits;
        else if (target.category === "교양선택") generalElective += target.credits;
      }
    });

    // Plus add an additional default buffer of elective/general credits to simulate true progress for 3rd and 4th grade students who took courses not in standard 1st-2nd list.
    if (grade >= 3) {
      majorRequired += 12;
      majorElective += 9;
      generalRequired += 6;
      generalElective += 6;
    } else if (grade === 2) {
      generalRequired += 4;
      generalElective += 3;
    }

    setCompletedCredits({
      majorRequired,
      majorElective,
      generalRequired,
      generalElective
    });
  };

  // Pre-load logic: Automatically tick the historical courses when entering or changing grade/major
  useEffect(() => {
    const defaultTicks = applicableHistoricalCourses.map(c => c.id);
    setCheckedCourseIds(defaultTicks);

    let majorRequired = 0;
    let majorElective = 0;
    let generalRequired = 0;
    let generalElective = 0;

    defaultTicks.forEach(cid => {
      const target = previousCoursesCatalog.find(p => p.id === cid);
      if (target) {
        if (target.category === "전공필수") majorRequired += target.credits;
        else if (target.category === "전공선택") majorElective += target.credits;
        else if (target.category === "교양필수") generalRequired += target.credits;
        else if (target.category === "교양선택") generalElective += target.credits;
      }
    });

    if (grade >= 3) {
      majorRequired += 12;
      majorElective += 9;
      generalRequired += 6;
      generalElective += 6;
    } else if (grade === 2) {
      generalRequired += 4;
      generalElective += 3;
    }

    setCompletedCredits({
      majorRequired,
      majorElective,
      generalRequired,
      generalElective
    });
  }, [major, grade]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200" id="academic_input_page_view">
      
      {/* Dynamic State Feedback floating indicator panel */}
      <div className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 ${
        pulseLive 
          ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/10 scale-[1.01]' 
          : 'bg-slate-800 border-slate-700 text-slate-100 shadow-md'
      }`}>
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <div className="text-xs">
            <span className="font-extrabold uppercase tracking-widest block opacity-70">실시간 피드백 동기화 상태:</span>
            <span className="font-sans font-bold text-sm">
              {studentId ? `[학번: ${studentId}]` : '[학번 전송요망]'} {major} {grade}학년 기수강 연계 점검 중
            </span>
          </div>
        </div>
        <span className={`text-[10px] font-mono uppercase bg-white/10 px-2 py-0.5 rounded border border-white/10 font-bold transition-all ${pulseLive ? 'bg-white text-indigo-700 animate-bounce' : 'text-slate-300'}`}>
          {pulseLive ? 'Syncing...' : 'Live'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Academic Profile Form card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-5 sm:p-6 lg:col-span-4 space-y-5">
          <h3 className="text-sm font-sans font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="h-4 w-4 text-indigo-600" />
            <span>기본 소속 및 학적 지정</span>
          </h3>

          {/* Department Option */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">학과 / 전공 구분</label>
            <select
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-700 font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
            >
              <option value="컴퓨터공학과">컴퓨터공학과 (CSE)</option>
              <option value="경영학과">경영학과 (BUS)</option>
              <option value="미디어커뮤니케이션학과">미디어커뮤니케이션학과 (MED)</option>
            </select>
          </div>

          {/* Year/Grade Option */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">재학 학년</label>
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100/70 rounded-xl">
              {[1, 2, 3, 4].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrade(g)}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    grade === g
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-600 hover:bg-slate-200/50'
                  }`}
                >
                  {g}학년
                </button>
              ))}
            </div>
          </div>

          {/* Student ID (학번) Input */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">학번 / 사정 수험번호기입</label>
            <input
              type="text"
              id="student_id_input"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="예: 202410294"
              className="w-full text-xs font-mono font-bold rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition shadow-sm"
            />
            <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
              <Info className="h-3 w-3 shrink-0" />
              <span>학번을 기반으로 다년도 졸업 요강을 자동 해석합니다.</span>
            </p>
          </div>

        </div>

        {/* Dynamic Completed Courses checklist card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-5 sm:p-6 lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-100 pb-3 gap-2">
            <div>
              <h3 className="text-sm font-sans font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-indigo-600" />
                <span>지난 학기까지의 기수강(완료) 과목 자가 체크단</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                현역 저학년에 이수한 과목들을 체크해주시면, 졸업 요건 누적 상태에 즉시 계산 합산 반영됩니다!
              </p>
            </div>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full inline-block">
              실시간 연계 연동
            </span>
          </div>

          {applicableHistoricalCourses.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400 italic bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-2">
              <AlertCircle className="h-5 w-5 text-slate-300 mx-auto" />
              <p>현재 설정인 1학년의 경우,<br />완료한 이전 전공 학기가 존재하지 않으므로 바로 다음 단계로 진입하십시오.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
              {applicableHistoricalCourses.map(course => {
                const isChecked = checkedCourseIds.includes(course.id);
                return (
                  <div
                    key={course.id}
                    onClick={() => handleToggleCourse(course.id)}
                    className={`p-3 rounded-xl border cursor-pointer select-none transition flex justify-between items-center gap-3 ${
                      isChecked
                        ? 'bg-indigo-50/50 border-indigo-300 text-indigo-900 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] font-mono text-slate-400 font-bold bg-slate-100 px-1 py-0.2 rounded">
                          {course.code}
                        </span>
                        <span className={`text-[8px] font-extrabold px-1 py-0.2 rounded ${
                          course.category === '전공필수' ? 'bg-indigo-600 text-white' : 
                          course.category === '전공선택' ? 'bg-teal-600 text-white' : 'bg-slate-500 text-white'
                        }`}>
                          {course.category}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold mt-1 tracking-tight truncate max-w-[170px]">{course.name}</h4>
                      <p className="text-[9px] text-slate-400 mt-0.5">{course.semesterGrade}학년 이수 권장 • {course.credits}학점</p>
                    </div>

                    <div className={`h-5 w-5 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                      isChecked 
                        ? 'bg-indigo-600 border-indigo-600 text-white rotate-0 scale-100' 
                        : 'bg-white border-slate-300 text-transparent scale-90'
                    }`}>
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Cumulative pre-completed credits status monitor summary */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 block relative">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">실시간 누계 기수강 성적 기록부 진단</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {[
                { label: "전필 누적", val: completedCredits.majorRequired, color: "text-indigo-600" },
                { label: "전선 누적", val: completedCredits.majorElective, color: "text-teal-600" },
                { label: "교필 누적", val: completedCredits.generalRequired, color: "text-amber-600" },
                { label: "교선 누적", val: completedCredits.generalElective, color: "text-emerald-600" }
              ].map((c, i) => (
                <div key={i} className="bg-white border border-slate-150 rounded-lg p-2.5">
                  <span className="text-[9px] text-slate-400 font-bold block">{c.label}</span>
                  <span className={`text-[13px] font-mono font-extrabold ${c.color} mt-0.5 inline-block`}>
                    {c.val} <span className="text-[10px] text-slate-400">학점</span>
                  </span>
                </div>
              ))}
            </div>
            {grade >= 3 && (
              <p className="text-[9px] text-slate-400 text-center mt-2.5 italic">
                * 3~4학년 학과 졸업 사정 시 최적 도출을 위해 나머지 미등록 기수강 과목(평균 33학점 상당) 보정치가 자동 합산 계산되어 있습니다.
              </p>
            )}
          </div>

        </div>

      </div>

      {/* Button navigation bar footer */}
      <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
        <button
          onClick={onPrev}
          className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>이전 소개 (Landing)</span>
        </button>

        <button
          onClick={onNext}
          className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 shadow-md"
        >
          <span>시간표 선호도 설정하기 (Step 3로)</span>
          <ArrowRight className="h-4 w-4 text-indigo-300" />
        </button>
      </div>

    </div>
  );
}
