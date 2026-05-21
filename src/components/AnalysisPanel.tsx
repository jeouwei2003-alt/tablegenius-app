import { TimetableRecommendation } from '../types';
import { Sparkles, GraduationCap, Calendar, CheckSquare, Heart } from 'lucide-react';

interface AnalysisPanelProps {
  option: TimetableRecommendation;
  isMock: boolean;
}

export default function AnalysisPanel({ option, isMock }: AnalysisPanelProps) {
  const { reasoning, metrics } = option;

  return (
    <div className="bg-gradient-to-br from-indigo-50/50 via-white to-slate-50/50 border border-indigo-100 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300">
      
      {/* Visual background ambient bubble */}
      <div className="absolute right-0 top-0 h-40 w-40 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-indigo-100/60 mb-5 relative shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-600 animate-pulse" />
          <h3 className="font-sans font-extrabold text-slate-800 text-sm">
            AI 수강설계 및 배치 분석 리포트
          </h3>
        </div>
        {isMock && (
          <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-400 font-bold px-2 py-0.5 rounded-full" title="설정에서 API Key를 입력하면 라이브 AI 분석으로 구동됩니다.">
            Template-Based Engine
          </span>
        )}
      </div>

      <div className="space-y-6">
        {/* Quote: General Summary */}
        <div className="border-l-4 border-l-indigo-600 pl-4 py-1.5">
          <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider mb-0.5">핵심 총평</p>
          <span className="text-sm font-sans font-extrabold text-slate-800 leading-relaxed block">
            "{reasoning.overallSummary}"
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          
          {/* Box 1: Graduation Match Analysis */}
          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow transition">
            <div className="flex items-center gap-2 text-indigo-600 mb-2.5">
              <GraduationCap className="h-4 w-4" />
              <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wide">
                졸업 자격 및 요건 정합성 분석
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {reasoning.graduationMatch}
            </p>
          </div>

          {/* Box 2: Favorite Keywords Reflection */}
          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow transition">
            <div className="flex items-center gap-2 text-indigo-600 mb-2.5">
              <Heart className="h-4 w-4" />
              <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wide">
                선호 분야 및 추천 이유
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {reasoning.keywordMatchReason || "사용자의 선호 키워드와 관심 학문을 반영하여 핵심 실무 능력을 증대할 수 있는 권장 강의들을 체계적으로 연결하고 최적 조율하였습니다."}
            </p>
          </div>

        </div>

        {/* Highlights List Checklist */}
        <div className="bg-indigo-50/30 border border-indigo-100/50 rounded-xl p-4.5">
          <div className="flex items-center gap-2 text-indigo-950 mb-3.5">
            <Calendar className="h-4 w-4 text-indigo-600" />
            <h4 className="text-xs font-extrabold uppercase tracking-wide">
              수강 일정 및 리얼 라이프 조율 강점
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {reasoning.scheduleHighlights.map((highlight, index) => (
              <div 
                key={index}
                className="bg-white p-3 rounded-xl border border-indigo-100/40 flex items-start gap-2 text-xs hover:border-indigo-200 transition"
              >
                <CheckSquare className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-slate-700 font-semibold leading-relaxed">
                  {highlight}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Footer bar indicator */}
        <div className="flex items-center gap-2 flex-wrap text-[10px] text-slate-400 border-t border-slate-100/80 pt-4 font-semibold">
          <span>이수 옵션 정보 :</span>
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">합계 {metrics.totalCredits}학점</span>
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">확보 공강 : {metrics.freeDaysSecured.join(', ') || '없음'}</span>
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">전필 {metrics.majorRequiredCredits}학점</span>
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">전선 {metrics.majorElectiveCredits}학점</span>
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">교필 {metrics.generalRequiredCredits}학점</span>
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">교선 {metrics.generalElectiveCredits}학점</span>
        </div>

      </div>
    </div>
  );
}
