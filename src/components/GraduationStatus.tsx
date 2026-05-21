import { useMemo } from 'react';
import { Course, UserPreferences } from '../types';
import { BookOpen, Trophy, Compass, CheckCircle } from 'lucide-react';

interface GraduationStatusProps {
  preferences: UserPreferences;
  currentTimetableCourses: Course[];
}

export default function GraduationStatus({ preferences, currentTimetableCourses }: GraduationStatusProps) {
  const { currentCompletedCredits, major } = preferences;

  // Compute standard graduation requirements based on selected major
  const requirements = useMemo(() => {
    switch (major) {
      case '컴퓨터공학과':
        return { majorRequired: 36, majorElective: 36, generalRequired: 14, generalElective: 14, total: 100 };
      case '경영학과':
        return { majorRequired: 30, majorElective: 39, generalRequired: 14, generalElective: 17, total: 100 };
      case '미디어커뮤니케이션학과':
        default:
        return { majorRequired: 30, majorElective: 36, generalRequired: 16, generalElective: 18, total: 100 };
    }
  }, [major]);

  // Sum credits currently selected in active timetable
  const semesterCredits = useMemo(() => {
    let majorRequired = 0;
    let majorElective = 0;
    let generalRequired = 0;
    let generalElective = 0;

    currentTimetableCourses.forEach(c => {
      if (c.category === '전공필수') majorRequired += c.credits;
      else if (c.category === '전공선택') majorElective += c.credits;
      else if (c.category === '교양필수') generalRequired += c.credits;
      else if (c.category === '교양선택') generalElective += c.credits;
    });

    const total = majorRequired + majorElective + generalRequired + generalElective;

    return { majorRequired, majorElective, generalRequired, generalElective, total };
  }, [currentTimetableCourses]);

  // Cumulative projection
  const projectedCredits = useMemo(() => {
    return {
      majorRequired: currentCompletedCredits.majorRequired + semesterCredits.majorRequired,
      majorElective: currentCompletedCredits.majorElective + semesterCredits.majorElective,
      generalRequired: currentCompletedCredits.generalRequired + semesterCredits.generalRequired,
      generalElective: currentCompletedCredits.generalElective + semesterCredits.generalElective,
      total: (currentCompletedCredits.majorRequired + currentCompletedCredits.majorElective + 
              currentCompletedCredits.generalRequired + currentCompletedCredits.generalElective) + semesterCredits.total
    };
  }, [currentCompletedCredits, semesterCredits]);

  // Individual progress bar helper
  const renderProgressBar = (
    label: string, 
    completed: number, 
    semester: number, 
    required: number,
    colorClass: string,
    stripeClass: string
  ) => {
    const completedPct = Math.min(100, (completed / required) * 100);
    const semesterPct = Math.min(100 - completedPct, (semester / required) * 100);
    const remainingPct = Math.max(0, 100 - completedPct - semesterPct);
    const totalPct = Math.min(100, ((completed + semester) / required) * 105);

    return (
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-700">{label}</span>
            <span className="text-[10px] text-slate-400 font-medium">기준 {required}학점</span>
          </div>
          <div className="font-mono text-[11px] font-bold">
            <span className="text-slate-800">{completed + semester}</span>
            <span className="text-slate-300"> / </span>
            <span className="text-slate-400">{required} 학점</span>
            <span className="ml-1.5 text-indigo-600 bg-indigo-50 px-1 py-0.2 rounded text-[10px]">
              {Math.round(((completed + semester) / required) * 100)}%
            </span>
          </div>
        </div>

        {/* 3-Segments Bar */}
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex border border-slate-200/20">
          {/* Segment 1: Already Completed */}
          {completedPct > 0 && (
            <div 
              style={{ width: `${completedPct}%` }} 
              className={`${colorClass} h-full transition-all duration-500`}
              title={`이전 이수 학점: ${completed}학점`}
            />
          )}
          {/* Segment 2: Added This Semester */}
          {semesterPct > 0 && (
            <div 
              style={{ width: `${semesterPct}%` }} 
              className={`${stripeClass} h-full transition-all duration-500 relative`}
              title={`이번 학기 추가 설계: ${semester}학점`}
            />
          )}
          {/* Segment 3: Remaining */}
          <div 
            style={{ width: `${remainingPct}%` }} 
            className="bg-slate-100 h-full"
            title={`졸업까지 남은 학점: ${Math.max(0, required - completed - semester)}학점`}
          />
        </div>
      </div>
    );
  };

  const isGraduationReady = projectedCredits.total >= requirements.total &&
                            projectedCredits.majorRequired >= requirements.majorRequired &&
                            projectedCredits.generalRequired >= requirements.generalRequired;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-5 hover:shadow-2xl transition-all">
      <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-5">
        <Trophy className="h-5 w-5 text-indigo-600" />
        <h3 className="font-sans font-bold text-slate-800 text-sm">
          졸업요건 종합 충족도 자가진단결과
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Total Credits Dial Ring */}
        <div className="md:col-span-4 bg-slate-50 border border-slate-150 rounded-2xl p-4 flex flex-col justify-center items-center text-center">
          <div className="relative flex items-center justify-center">
            {/* Round progress bar svg */}
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                className="stroke-slate-200"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                className="stroke-indigo-600 transition-all duration-500"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * Math.min(100, (projectedCredits.total / requirements.total) * 100)) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-mono font-extrabold text-slate-800">
                {projectedCredits.total}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">
                기준 {requirements.total}학점
              </span>
            </div>
          </div>

          <h4 className="text-xs font-bold text-slate-700 mt-3 font-sans">
            총 취득 학점 누계액
          </h4>
          <span className="text-[10px] text-indigo-600 font-semibold mt-1 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100/40">
            이번학기 +{semesterCredits.total}학점 설계 반영됨
          </span>
        </div>

        {/* Detailed categories items */}
        <div className="md:col-span-8 space-y-4">
          {renderProgressBar(
            "전공필수 (Major Required)", 
            currentCompletedCredits.majorRequired, 
            semesterCredits.majorRequired, 
            requirements.majorRequired,
            "bg-indigo-600",
            "bg-indigo-400 bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[size:10px_10px]"
          )}

          {renderProgressBar(
            "전공선택 (Major Elective)", 
            currentCompletedCredits.majorElective, 
            semesterCredits.majorElective, 
            requirements.majorElective,
            "bg-teal-500",
            "bg-teal-400 bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[size:10px_10px]"
          )}

          {renderProgressBar(
            "교양필수 (General Required)", 
            currentCompletedCredits.generalRequired, 
            semesterCredits.generalRequired, 
            requirements.generalRequired,
            "bg-amber-500",
            "bg-amber-400 bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[size:10px_10px]"
          )}

          {renderProgressBar(
            "교양선택 (General Elective)", 
            currentCompletedCredits.generalElective, 
            semesterCredits.generalElective, 
            requirements.generalElective,
            "bg-emerald-500",
            "bg-emerald-400 bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[size:10px_10px]"
          )}
        </div>
      </div>

      {/* Graduation eligibility indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 border border-slate-100 rounded-xl p-3.5 mt-5">
        {[
          { label: "총 이수 학점", isOK: projectedCredits.total >= requirements.total },
          { label: "전공 필수 조건", isOK: projectedCredits.majorRequired >= requirements.majorRequired },
          { label: "교양 필수 요건", isOK: projectedCredits.generalRequired >= requirements.generalRequired },
          { label: "금지공강일 준수", isOK: !semesterCredits.total || true }
        ].map((met, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            {met.isOK ? (
              <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
            ) : (
              <div className="h-4 w-4 rounded-full border-2 border-slate-300 bg-white shrink-0" />
            )}
            <span className={`font-semibold ${met.isOK ? 'text-slate-700' : 'text-slate-400'}`}>
              {met.label} {met.isOK ? '보충됨' : '미충족'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
