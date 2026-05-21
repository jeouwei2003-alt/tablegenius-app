import { useState, FormEvent, useEffect } from 'react';
import { Sliders, Calendar, BookOpen, Search, ArrowLeft, ArrowRight, Sparkles, Tag, Check, X, ShieldAlert } from 'lucide-react';
import { UserPreferences } from '../types';

interface PreferenceFormPageProps {
  grade: number;
  major: string;
  freeDays: string[];
  setFreeDays: (days: string[]) => void;
  targetCredits: number;
  setTargetCredits: (c: number) => void;
  preferredKeywords: string[];
  setPreferredKeywords: (k: string[]) => void;
  scheduleStyle: 'balanced' | 'morning' | 'afternoon' | 'compact';
  setScheduleStyle: (s: 'balanced' | 'morning' | 'afternoon' | 'compact') => void;
  onGenerate: () => void;
  onPrev: () => void;
}

const COMMON_KEYWORD_SUGGESTIONS = [
  '인공지능', '데이터베이스', '웹개발', '네트워크', '보안', '클라우드',
  '마케팅', '재무', '미디어', '글쓰기', '예술', '디자인', '기후변화', '특허'
];

export default function PreferenceFormPage({
  grade,
  major,
  freeDays,
  setFreeDays,
  targetCredits,
  setTargetCredits,
  preferredKeywords,
  setPreferredKeywords,
  scheduleStyle,
  setScheduleStyle,
  onGenerate,
  onPrev
}: PreferenceFormPageProps) {
  const [keywordInput, setKeywordInput] = useState('');
  const [alertCreditsRange, setAlertCreditsRange] = useState(false);

  // Auto warn if credits are outside typical boundaries
  const handleCreditsChange = (val: number) => {
    setTargetCredits(val);
    if (val < 15 || val > 21) {
      setAlertCreditsRange(true);
    } else {
      setAlertCreditsRange(false);
    }
  };

  // Toggle free days
  const handleToggleDay = (day: string) => {
    let nextDays = [...freeDays];
    if (nextDays.includes(day)) {
      nextDays = nextDays.filter(d => d !== day);
    } else {
      nextDays.push(day);
    }
    setFreeDays(nextDays);
  };

  // Add a preference keyword
  const handleAddKeyword = (kw: string) => {
    const trimmed = kw.trim();
    if (trimmed && !preferredKeywords.includes(trimmed)) {
      setPreferredKeywords([...preferredKeywords, trimmed]);
    }
    setKeywordInput('');
  };

  // Remove a preference keyword
  const handleRemoveKeyword = (kw: string) => {
    setPreferredKeywords(preferredKeywords.filter(k => k !== kw));
  };

  const dayOptions = ['월', '화', '수', '목', '금'];

  return (
    <div className="space-y-6 animate-in fade-in duration-200" id="preference_form_page_view">
      
      {/* Page Title header */}
      <div className="bg-gradient-to-r from-indigo-50 to-slate-50 border border-slate-100 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div className="space-y-1">
          <span className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-widest bg-indigo-50 border border-indigo-100 px-2 rounded-full leading-none">
            Step 3 / 8
          </span>
          <h2 className="text-slate-800 font-extrabold text-xl tracking-tight leading-snug">수강 선호 조건 최적 세부 설정</h2>
          <p className="text-xs text-slate-400">
            시간 배분의 유형과 차단하고 싶은 공강 일정, 이번 기수의 조율 학점량을 정독 배치하세요.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 text-white rounded-xl py-2 px-3.5 text-xs font-mono font-bold">
          <Sliders className="h-4 w-4 text-indigo-400" />
          <span>Active Simulation Preferences</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left column: Days & Credits */}
        <div className="space-y-6">

          {/* Free Day Options */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-sans font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-600" />
              <span>희망하는 완벽 차단 공강일 (안전 격리)</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              선택한 요일에는 어떠한 강의도 배치되지 않게 알고리즘이 탐색 필터링을 가미합니다. (중복 지정 가능)
            </p>

            <div className="grid grid-cols-5 gap-2 pt-2">
              {dayOptions.map(day => {
                const isActive = freeDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleToggleDay(day)}
                    className={`py-3.5 rounded-xl text-xs font-extrabold flex flex-col items-center justify-center border transition-all ${
                      isActive
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/15'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <span className="text-sm">{day}요일</span>
                    <span className={`text-[9px] mt-1 uppercase font-mono ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {isActive ? 'Blocking' : 'Pass'}
                    </span>
                  </button>
                );
              })}
            </div>
            {freeDays.length > 2 && (
              <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1.5 bg-rose-50 border border-rose-100 p-2 rounded-lg">
                <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                <span>주 3일 이상 완전 공강 지정 시, 과도한 선택지 제한으로 충돌이나 공강 부정이 생길 확률이 증가합니다.</span>
              </p>
            )}
          </div>

          {/* Target Credits Slider */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-5 sm:p-6 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-sans font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-indigo-600" />
                <span>이번 학기 수강 신청 목표 학점</span>
              </h3>
              <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-extrabold font-mono px-3 py-1 rounded-xl">
                {targetCredits} 학점
              </span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              신청을 성사시킬 타겟 목표치입니다. 과목 조합(2~3학점 배분)에 따라 미세 오차가 있을 수 있습니다.
            </p>

            <div className="pt-2">
              <input
                type="range"
                min="12"
                max="21"
                step="3"
                value={targetCredits}
                onChange={(e) => handleCreditsChange(Number(e.target.value))}
                className="w-full accent-indigo-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 font-extrabold mt-2 px-1">
                <span>12학점 (부담 최소)</span>
                <span>15학점 (라이트)</span>
                <span>18학점 (CSE 기본)</span>
                <span>21학점 (열정 최다)</span>
              </div>
            </div>

            {alertCreditsRange && (
              <div className="text-[10px] text-amber-600 font-medium flex items-center gap-1 mt-2">
                <span>⚠️ 소속 학번 및 학칙에 따라 15~18학점 범위가 통상 밸런스에 기여도가 높습니다.</span>
              </div>
            )}
          </div>

        </div>

        {/* Right column: Styles & Custom Keyword Tags */}
        <div className="space-y-6">

          {/* Schedule style options */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-5 sm:p-6 space-y-3">
            <h3 className="text-sm font-sans font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600 animate-pulse" />
              <span>선호 시간표 분할 배열 성향(스타일)</span>
            </h3>
            <p className="text-xs text-slate-400 mb-2">
              시간표 요일 매핑 시 적용될 AI 슬라이서 패널 가중치를 지정합니다.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { key: 'balanced', title: '균형 분산 설계', memo: '오전/오후 골고루' },
                { key: 'morning', title: '오전 밀집형', memo: '09:00 수강 비중 극대화' },
                { key: 'afternoon', title: '오후 집중형', memo: '오전 꿀잠 및 스터디' },
                { key: 'compact', title: '알짜 밀착형', memo: '우주공강 철저 파쇄' }
              ].map(style => {
                const isActive = scheduleStyle === style.key;
                return (
                  <div
                    key={style.key}
                    onClick={() => setScheduleStyle(style.key as any)}
                    className={`p-3 rounded-xl border cursor-pointer select-none transition flex flex-col justify-between ${
                      isActive
                        ? 'bg-indigo-50/50 border-indigo-400 text-indigo-900 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold font-sans">{style.title}</span>
                      <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isActive ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 text-transparent'
                      }`}>
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 text-left mt-2">{style.memo}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Preferred Keywords Search Tag adding */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-5 sm:p-6 space-y-3">
            <h3 className="text-sm font-sans font-bold text-slate-800 flex items-center gap-2">
              <Tag className="h-4 w-4 text-indigo-600" />
              <span>개인 선호 학술 키워드 검색 적용</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              키워드를 함유한 전공/연구 교양 강의를 1분위 우선순위 자격으로 편입합니다. (엔터 전송 가능)
            </p>

            <form 
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                handleAddKeyword(keywordInput);
              }}
              className="flex gap-2 pt-2"
            >
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  placeholder="예: 인공지능, 클라우드, 마케팅 등"
                  className="w-full text-xs font-sans rounded-xl border border-slate-200 bg-slate-50 p-3 pl-9 outline-none focus:border-indigo-500 focus:bg-white transition"
                />
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
              <button
                type="submit"
                className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition"
              >
                추가
              </button>
            </form>

            {/* Keyword tag inventory list */}
            {preferredKeywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {preferredKeywords.map(kw => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 animate-in zoom-in-95"
                  >
                    <span className="font-sans">#{kw}</span>
                    <X
                      className="h-3 w-3 text-indigo-400 hover:text-indigo-600 cursor-pointer"
                      onClick={() => handleRemoveKeyword(kw)}
                    />
                  </span>
                ))}
              </div>
            )}

            {/* Common default suggestion capsules */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">가장 인기있는 추천 태그:</span>
              <div className="flex flex-wrap gap-1">
                {COMMON_KEYWORD_SUGGESTIONS.slice(0, 8).map(sug => {
                  const isSelect = preferredKeywords.includes(sug);
                  return (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => handleAddKeyword(sug)}
                      disabled={isSelect}
                      className={`text-[9px] font-bold px-2 py-1 rounded-lg border transition ${
                        isSelect
                          ? 'bg-slate-100 text-slate-350 border-slate-150'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      +{sug}
                    </button>
                  );
                })}
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
          <span>이전 학적 설정 (Step 2로)</span>
        </button>

        <button
          onClick={onGenerate}
          id="btn_core_generate"
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 hover:scale-[1.01] active:scale-[0.99] text-white font-extrabold text-xs rounded-xl transition shadow-lg shadow-indigo-600/20 flex items-center gap-1.5"
        >
          <span>AI 최적 오차 융합 생성하기 (Step 4로)</span>
          <ArrowRight className="h-4 w-4 text-yellow-300 animate-bounce" />
        </button>
      </div>

    </div>
  );
}
