import { useState, useEffect, FormEvent } from 'react';
import { UserPreferences } from '../types';
import { Sparkles, Calendar, BookOpen, Clock, RefreshCw, Layers } from 'lucide-react';

interface PreferenceFormProps {
  onSubmit: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

export default function PreferenceForm({ onSubmit, isLoading }: PreferenceFormProps) {
  const [major, setMajor] = useState<string>('컴퓨터공학과');
  const [grade, setGrade] = useState<number>(3);
  const [targetCredits, setTargetCredits] = useState<number>(18);
  const [freeDays, setFreeDays] = useState<string[]>(['금']); // Friday off by default
  const [scheduleStyle, setScheduleStyle] = useState<'balanced' | 'morning' | 'afternoon' | 'compact'>('compact');
  const [currentKeyword, setCurrentKeyword] = useState<string>('');
  const [preferredKeywords, setPreferredKeywords] = useState<string[]>(['인공지능', '데이터베이스']);

  // Completion credits tracker states
  const [majorRequired, setMajorRequired] = useState<number>(24);
  const [majorElective, setMajorElective] = useState<number>(18);
  const [generalRequired, setGeneralRequired] = useState<number>(12);
  const [generalElective, setGeneralElective] = useState<number>(10);

  // Automatically update credit completion metrics with plausible defaults based on grade & major
  useEffect(() => {
    if (grade === 1) {
      setMajorRequired(3);
      setMajorElective(0);
      setGeneralRequired(4);
      setGeneralElective(3);
      setPreferredKeywords(major === '컴퓨터공학과' ? ['프로그래밍', '컴퓨터'] : major === '경영학과' ? ['경영', '경제'] : ['미디어', '글쓰기']);
    } else if (grade === 2) {
      setMajorRequired(12);
      setMajorElective(6);
      setGeneralRequired(8);
      setGeneralElective(9);
      setPreferredKeywords(major === '컴퓨터공학과' ? ['Java', '알고리즘'] : major === '경영학과' ? ['마케팅', '회계'] : ['콘텐츠', '디자인']);
    } else if (grade === 3) {
      setMajorRequired(24);
      setMajorElective(15);
      setGeneralRequired(12);
      setGeneralElective(12);
      setPreferredKeywords(major === '컴퓨터공학과' ? ['인공지능', '데이터베이스'] : major === '경영학과' ? ['재무', '데이터'] : ['스토리텔링', '광고']);
    } else {
      setMajorRequired(33);
      setMajorElective(27);
      setGeneralRequired(14);
      setGeneralElective(15);
      setPreferredKeywords(major === '컴퓨터공학과' ? ['클라우드', '프로젝트'] : major === '경영학과' ? ['전략', '혁신'] : ['스토리텔링', '캠페인']);
    }
  }, [grade, major]);

  const toggleFreeDay = (day: string) => {
    if (freeDays.includes(day)) {
      setFreeDays(freeDays.filter(d => d !== day));
    } else {
      // Limit to max 2 free days to keep schedule solvable
      if (freeDays.length >= 2) return;
      setFreeDays([...freeDays, day]);
    }
  };

  const handleAddKeyword = (e: FormEvent) => {
    e.preventDefault();
    const clean = currentKeyword.trim();
    if (clean && !preferredKeywords.includes(clean)) {
      setPreferredKeywords([...preferredKeywords, clean]);
      setCurrentKeyword('');
    }
  };

  const removeKeyword = (kw: string) => {
    setPreferredKeywords(preferredKeywords.filter(k => k !== kw));
  };

  const handleFormSubmit = () => {
    const prefs: UserPreferences = {
      grade,
      major,
      freeDays,
      targetCredits,
      currentCompletedCredits: {
        majorRequired,
        majorElective,
        generalRequired,
        generalElective
      },
      preferredKeywords,
      scheduleStyle
    };
    onSubmit(prefs);
  };

  const dayNames = ['월', '화', '수', '목', '금'];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden p-6 hover:shadow-2xl transition-all">
      <div className="flex items-center gap-2 pb-5 border-b border-slate-100 mb-6Shared">
        <Layers className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-sans font-bold text-slate-800">
          시간표 맞춤형 프로필 설정
        </h2>
      </div>

      <div className="space-y-6">
        {/* 1. 소속 전공 / 학년 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              학과 / 전공 선택
            </label>
            <select
              id="major_select"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full text-sm rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
            >
              <option value="컴퓨터공학과">컴퓨터공학과 (CSE)</option>
              <option value="경영학과">경영학과 (BUS)</option>
              <option value="미디어커뮤니케이션학과">미디어커뮤니케이션학과 (MED)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              재학 학년
            </label>
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100/80 rounded-xl">
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
        </div>

        {/* 2. 선호 공강 요일 선택 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              희망 공강 요일 (최대 2일)
            </label>
            <span className="text-[11px] text-indigo-600 font-medium">
              선택한 요일의 강의는 제외됩니다
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {dayNames.map((day) => {
              const isSelected = freeDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  id={`day_btn_${day}`}
                  onClick={() => toggleFreeDay(day)}
                  className={`py-3.5 rounded-xl border font-sans font-bold text-sm flex flex-col items-center justify-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-extrabold shadow-sm ring-2 ring-indigo-500/10'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span>{day}</span>
                  <div className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-indigo-600 animate-pulse' : 'bg-transparent'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. 이번 학기 이수 목표 학점 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              이번 학기 목표 이수 학점
            </label>
            <span className="text-sm font-mono font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
              {targetCredits} 학점
            </span>
          </div>
          <input
            id="target_credits_slider"
            type="range"
            min={12}
            max={21}
            step={3}
            value={targetCredits}
            onChange={(e) => setTargetCredits(Number(e.target.value))}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-1 mt-1">
            <span>12학점 (수업량 경감)</span>
            <span>15학점</span>
            <span>18학점 (일반 권장)</span>
            <span>21학점 (최대 이수)</span>
          </div>
        </div>

        {/* 4. 시간표 성향 / 스타일 */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            시간표 설계 레이아웃 스타일
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'compact', label: '우주공강 방지', desc: '강의 간 비는 시간 최소화', icon: Clock },
              { id: 'balanced', label: '요일 균형형', desc: '주중 고르게 한두개씩 배치', icon: Calendar },
              { id: 'morning', label: '오전 집중', desc: '이른 수료 후 오후 개인 용무', icon: Sparkles },
              { id: 'afternoon', label: '오후 느긋형', desc: '오전의 꿀잠 건강 챙기기', icon: RefreshCw }
            ].map((style) => {
              const Icon = style.icon;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setScheduleStyle(style.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                    scheduleStyle === style.id
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50/50 hover:border-slate-300'
                  }`}
                >
                  <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${scheduleStyle === style.id ? 'text-indigo-200' : 'text-indigo-600'}`} />
                  <div>
                    <span className="text-xs font-bold block">{style.label}</span>
                    <span className={`text-[10px] ${scheduleStyle === style.id ? 'text-indigo-100/80' : 'text-slate-400'}`}>
                      {style.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. 완료 이수 학점 자가점검 입력 (졸업 요건 계산기 연동) */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-3">
            기 완료 이수 학점 자가점검 (졸업기여 분석용)
          </span>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block mb-1">전공필수 (누적)</span>
              <div className="flex items-center gap-1.5">
                <button 
                  type="button" 
                  onClick={() => setMajorRequired(Math.max(0, majorRequired - 3))}
                  className="bg-white border border-slate-200 hover:border-slate-300 h-6 w-6 rounded flex items-center justify-center text-xs text-slate-500 font-bold"
                >
                  -
                </button>
                <span className="text-xs font-mono font-extrabold text-slate-700 w-6 text-center">{majorRequired}</span>
                <button 
                  type="button" 
                  onClick={() => setMajorRequired(majorRequired + 3)}
                  className="bg-white border border-slate-200 hover:border-slate-300 h-6 w-6 rounded flex items-center justify-center text-xs text-slate-500 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-bold block mb-1">전공선택 (누적)</span>
              <div className="flex items-center gap-1.5">
                <button 
                  type="button" 
                  onClick={() => setMajorElective(Math.max(0, majorElective - 3))}
                  className="bg-white border border-slate-200 hover:border-slate-300 h-6 w-6 rounded flex items-center justify-center text-xs text-slate-500 font-bold"
                >
                  -
                </button>
                <span className="text-xs font-mono font-extrabold text-slate-700 w-6 text-center">{majorElective}</span>
                <button 
                  type="button" 
                  onClick={() => setMajorElective(majorElective + 3)}
                  className="bg-white border border-slate-200 hover:border-slate-300 h-6 w-6 rounded flex items-center justify-center text-xs text-slate-500 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-bold block mb-1">교양필수 (누적)</span>
              <div className="flex items-center gap-1.5">
                <button 
                  type="button" 
                  onClick={() => setGeneralRequired(Math.max(0, generalRequired - 2))}
                  className="bg-white border border-slate-200 hover:border-slate-300 h-6 w-6 rounded flex items-center justify-center text-xs text-slate-500 font-bold"
                >
                  -
                </button>
                <span className="text-xs font-mono font-extrabold text-slate-700 w-6 text-center">{generalRequired}</span>
                <button 
                  type="button" 
                  onClick={() => setGeneralRequired(generalRequired + 2)}
                  className="bg-white border border-slate-200 hover:border-slate-300 h-6 w-6 rounded flex items-center justify-center text-xs text-slate-500 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-bold block mb-1">교양선택 (누적)</span>
              <div className="flex items-center gap-1.5">
                <button 
                  type="button" 
                  onClick={() => setGeneralElective(Math.max(0, generalElective - 3))}
                  className="bg-white border border-slate-200 hover:border-slate-300 h-6 w-6 rounded flex items-center justify-center text-xs text-slate-500 font-bold"
                >
                  -
                </button>
                <span className="text-xs font-mono font-extrabold text-slate-700 w-6 text-center">{generalElective}</span>
                <button 
                  type="button" 
                  onClick={() => setGeneralElective(generalElective + 3)}
                  className="bg-white border border-slate-200 hover:border-slate-300 h-6 w-6 rounded flex items-center justify-center text-xs text-slate-500 font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 6. 선호 관심 키워드 및 관심사 */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            선호 주제 / 관심 키워드
          </label>
          <form onSubmit={handleAddKeyword} className="flex gap-2 mb-2">
            <input
              id="keyword_input"
              type="text"
              placeholder="예: 알고리즘, 마케팅, AI, 디자인"
              value={currentKeyword}
              onChange={(e) => setCurrentKeyword(e.target.value)}
              className="px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none flex-grow bg-slate-50/50"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition"
            >
              추가
            </button>
          </form>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto py-1">
            {preferredKeywords.length === 0 ? (
              <span className="text-xs text-slate-400 italic">추가된 키워드가 없습니다.</span>
            ) : (
              preferredKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100"
                >
                  <span>{kw}</span>
                  <button
                    type="button"
                    onClick={() => removeKeyword(kw)}
                    className="text-indigo-400 hover:text-indigo-600 focus:outline-none text-[11px] px-0.5 font-sans"
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* 7. 최적의 생성 버튼 */}
        <button
          type="button"
          id="generate_timetable_button"
          onClick={handleFormSubmit}
          disabled={isLoading}
          className={`w-full py-4 rounded-xl font-sans font-extrabold text-sm text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 ${
            isLoading
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.01] hover:shadow-indigo-500/20 active:scale-95'
          }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>TableGenius가 수강 설계 도출 중...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-yellow-300 fill-yellow-300" />
              <span>추천 시간표 생성하기 (Generate)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
