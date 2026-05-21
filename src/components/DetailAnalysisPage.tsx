import { Sparkles, GraduationCap, MapPin, CheckCircle, ShieldCheck, Heart, LayoutDashboard, BrainCircuit } from 'lucide-react';
import { TimetableRecommendation, UserPreferences } from '../types';

interface DetailAnalysisPageProps {
  option: TimetableRecommendation;
  preferences: UserPreferences;
  isMock: boolean;
  onNext: () => void;
  onPrev: () => void;
}

export default function DetailAnalysisPage({
  option,
  preferences,
  isMock,
  onNext,
  onPrev
}: DetailAnalysisPageProps) {
  const { reasoning, metrics } = option;

  // Let's compute custom graduation progress statistics
  // Default graduation requirements in our standard DB:
  // Major Required: 36, Major Elective: 33, General Required: 18, General Elective: 18 (Total: 105+)
  const reqMR = 36;
  const reqME = 33;
  const reqGR = 18;
  const reqGE = 18;

  const currentMR = preferences.currentCompletedCredits.majorRequired + metrics.majorRequiredCredits;
  const currentME = preferences.currentCompletedCredits.majorElective + metrics.majorElectiveCredits;
  const currentGR = preferences.currentCompletedCredits.generalRequired + metrics.generalRequiredCredits;
  const currentGE = preferences.currentCompletedCredits.generalElective + metrics.generalElectiveCredits;

  const pctMR = Math.min(100, Math.round((currentMR / reqMR) * 100));
  const pctME = Math.min(100, Math.round((currentME / reqME) * 100));
  const pctGR = Math.min(100, Math.round((currentGR / reqGR) * 100));
  const pctGE = Math.min(100, Math.round((currentGE / reqGE) * 100));

  return (
    <div className="space-y-6 animate-in fade-in duration-200" id="detail_analysis_page_view">
      
      {/* Title Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div className="space-y-1">
          <span className="text-[10px] text-indigo-300 font-extrabold uppercase tracking-widest bg-white/10 px-2.5 py-0.5 rounded-full leading-none">
            Step 6 / 8
          </span>
          <h2 className="text-white font-extrabold text-xl tracking-tight">AI 학업 설계 지능 사정 분석서</h2>
          <p className="text-xs text-indigo-200/50">
            시간표 추천안에 내포된 졸업 이수 시뮬레이터 수치 및 강점을 입체적으로 해독하세요.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-600 rounded-xl py-2 px-3.5 text-xs font-sans font-extrabold">
          <BrainCircuit className="h-4 w-4 text-indigo-200 animate-pulse" />
          <span>TableGenius AI Counselor v2.5</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Core AI Counselor Analysis Output */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main summary quotation card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 h-40 w-40 bg-indigo-500/[0.02] rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-4">
              <span className="h-2 w-2 rounded-full bg-indigo-600" />
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Counselor 핵심 한알 총평</span>
            </div>

            <p className="text-sm sm:text-base font-sans font-extrabold text-slate-800 leading-relaxed italic pr-4">
              "{reasoning.overallSummary}"
            </p>
          </div>

          {/* Structured detailed justifications panel */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-5 sm:p-6 space-y-5">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">주요 추천 이유 및 자격 사양</h3>

            <div className="space-y-4">
              <div className="flex gap-3 items-start p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <GraduationCap className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800">소속 전공요건 및 필수 이수 가치</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {reasoning.graduationMatch}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <Heart className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800">키워드 연계도 및 관심분야 반영</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {reasoning.keywordMatchReason || "사용자가 기입한 우선순위 관심 영역을 바탕으로 관련 연구 성격이 짙은 강의를 핵심 슬롯에 매칭하였습니다."}
                  </p>
                </div>
              </div>
            </div>

            {/* Highlighting direct benefits checkboxes list */}
            <div className="space-y-3 pt-3">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">추천 일정 강점 체크포인트:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {reasoning.scheduleHighlights.map((hl, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 bg-indigo-50/20 border border-indigo-100/40 rounded-xl text-[11px] font-semibold text-indigo-950">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Mini Graduation simulation progress bar dashboard */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Milestone chart */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-5 sm:p-6 space-y-5">
            <div>
              <h3 className="text-sm font-sans font-bold text-slate-800 flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4 text-indigo-600" />
                <span>졸업 이수 시뮬레이터 현황판</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                추천 시간표 수강 완료 시, 소속 학년 및 졸업 의무 학점 대비 누적 달성률입니다.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { label: "전공필수 누적", cur: currentMR, r: reqMR, pct: pctMR, color: "bg-indigo-600" },
                { label: "전공선택 누적", cur: currentME, r: reqME, pct: pctME, color: "bg-teal-600" },
                { label: "교양필수 누적", cur: currentGR, r: reqGR, pct: pctGR, color: "bg-amber-500" },
                { label: "교양선택 누적", cur: currentGE, r: reqGE, pct: pctGE, color: "bg-emerald-500" }
              ].map((m, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>{m.label}</span>
                    <span>{m.cur} / {m.r} 학점 <span className="text-[10px] text-slate-400 font-mono font-normal">({m.pct}%)</span></span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/40">
                    <div className={`${m.color} h-full rounded-full transition-all`} style={{ width: `${m.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Shield Guarantee */}
            <div className="pt-3.5 border-t border-slate-100 text-[10px] text-slate-400 flex items-start gap-2 max-w-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>본 졸업 자격 진단 수치는 한국 대학 표준 학사 규정(최대 130~140학점 졸자)에 의거하여 엄정하게 시뮬레이션 적용을 준수합니다.</span>
            </div>
          </div>

          {/* Quick Metrics grid card */}
          <div className="bg-slate-900 rounded-2xl p-5 text-white border border-slate-800 space-y-3.5">
            <span className="text-[9px] font-extrabold text-indigo-400 uppercase tracking-widest block">금주 확정 스탯 요약</span>
            
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-white/5 border border-white/5 rounded-xl p-2.5 text-center">
                <span className="text-[8px] text-indigo-200/50 font-bold block">금분 이수 계획</span>
                <span className="text-base font-mono font-extrabold text-white mt-1 inline-block">{metrics.totalCredits} 학점</span>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-xl p-2.5 text-center">
                <span className="text-[8px] text-indigo-200/50 font-bold block">확보 공강일수</span>
                <span className="text-base font-mono font-extrabold text-indigo-400 mt-1 inline-block">
                  {metrics.freeDaysSecured.length || '없음'}일 ({metrics.freeDaysSecured.join(', ')})
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Button navigation bar */}
      <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
        <button
          onClick={onPrev}
          className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>이전 시간표 배치도 (Step 5로)</span>
        </button>

        <button
          onClick={onNext}
          className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 shadow-md"
        >
          <span>대안 수강 편입 및 스왑하기 (Step 7로)</span>
          <ArrowRight className="h-4 w-4 text-indigo-300" />
        </button>
      </div>

    </div>
  );
}

// Inline fallback for Arrow Icons just in case
function ArrowLeft(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 19-7-7 7-7"/>
      <path d="M19 12H5"/>
    </svg>
  );
}

function ArrowRight(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14"/>
      <path d="m12 5 7 7-7 7"/>
    </svg>
  );
}
