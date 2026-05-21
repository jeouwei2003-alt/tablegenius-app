import { useState, useEffect } from 'react';
import { Cpu, Terminal, CheckCircle, Database, Sparkles, Wand2, RefreshCw } from 'lucide-react';

interface LoaderProcessingPageProps {
  major: string;
  grade: number;
  freeDays: string[];
  targetCredits: number;
  scheduleStyle: string;
  onComplete: () => void;
}

export default function LoaderProcessingPage({
  major,
  grade,
  freeDays,
  targetCredits,
  scheduleStyle,
  onComplete
}: LoaderProcessingPageProps) {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const steps = [
    { text: "데이터베이스 연결: 교과과정 대용량 CSV 파싱 및 구조 초기화...", delay: 350 },
    { text: "2026 수강 규정 요람 해독: 학번 기준 졸업 요건 준수 요령 적용...", delay: 400 },
    { text: `기수강 잔여이수 점검: 소속 학부 전공 교과 이력 사정 완료...`, delay: 500 },
    { text: `공강 제약 조건 적용: [${freeDays.join(', ') || '없음'}] 필터링 차단 매핑...`, delay: 600 },
    { text: `배치 성향 가중치 보정: 슬라이서 스타일 [${scheduleStyle}] 정렬 파라미터 셋업...`, delay: 450 },
    { text: `전공/교양 학점 매칭: 요구 수치 [${targetCredits} 학점] 탐색 조합 공식 확립...`, delay: 500 },
    { text: "백엔드 이산 대수 Constraints Solver 가동: 총 38,420개 배열 탐색 중...", delay: 700 },
    { text: "학업 충돌 완벽 파쇄: 겹치는 교안 시간 슬롯 완벽 배제 완료...", delay: 600 },
    { text: "Gemini 3.5 Flash 연격: 대화형 추천 근거 및 장단점 분석 데이터 로딩...", delay: 800 },
    { text: "완벽 매핑 종료: 실시간 대학 시간표 후보안 최종 빌드 성공!", delay: 400 }
  ];

  // Progressive simulation logic
  useEffect(() => {
    let currentStep = 0;
    setLogs([steps[0].text]);

    const runLogs = () => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        setActiveStepIndex(currentStep);
        setLogs(prev => [...prev, steps[currentStep].text]);
        // Update progress bar percentage proportionally
        setProgress(Math.floor((currentStep / (steps.length - 1)) * 100));
        
        setTimeout(runLogs, steps[currentStep].delay);
      } else {
        setProgress(100);
      }
    };

    const timer = setTimeout(runLogs, steps[0].delay);
    return () => clearTimeout(timer);
  }, []);

  // Automatic redirect callback when reaches 100
  useEffect(() => {
    if (progress === 100) {
      const redirectId = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(redirectId);
    }
  }, [progress, onComplete]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300" id="loader_processing_view">
      
      {/* Title & Status Block */}
      <div className="text-center space-y-2 py-4">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 animate-spin mb-2">
          <RefreshCw className="h-6 w-6 stroke-[2.5]" />
        </div>
        <h2 className="font-sans font-extrabold text-2xl text-slate-800 tracking-tight">AI 최적 시간표 오차 검정 및 솔버 작동 중</h2>
        <p className="text-xs text-slate-400">
          TableGenius 지능형 AI 가 중복 마이그레이션이 배제된 3가지 대안 시나리오를 자동 가공하고 있습니다.
        </p>
      </div>

      {/* High-fidelity Gauge & Interactive Progress Slider Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-6 space-y-4">
        <div className="flex justify-between items-center text-xs font-bold text-slate-500">
          <span className="flex items-center gap-1.5 font-sans">
            <Cpu className="h-4 w-4 text-indigo-500 animate-pulse" />
            <span>분석 진행도: {progress}%</span>
          </span>
          <span className="font-mono text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100">
            {progress < 100 ? 'SOLVING PATH PATTERNS' : 'SOLVED PERFECTLY'}
          </span>
        </div>

        {/* Custom Premium progress track bar */}
        <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden border border-slate-200/50 p-[2px]">
          <div 
            className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 h-full rounded-full transition-all duration-300 ease-out shadow-inner"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-[10px] font-bold text-slate-400 pt-1">
          <div className={activeStepIndex >= 0 ? "text-indigo-600" : ""}>① 자격 파싱</div>
          <div className={activeStepIndex >= 3 ? "text-indigo-600" : ""}>② 공강 제약 해독</div>
          <div className={activeStepIndex >= 6 ? "text-indigo-600" : ""}>③ 조합 산술</div>
          <div className={activeStepIndex >= 9 ? "text-indigo-600" : ""}>④ 최종 매핑</div>
        </div>
      </div>

      {/* Cyberpunk Terminal Real-time Simulation Console */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl p-5 font-mono text-xs text-indigo-200/90 space-y-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-48 w-48 bg-indigo-500/[0.02] rounded-full blur-2xl pointer-events-none" />
        <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-indigo-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TableGenius Engine Logs</span>
          </div>
          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        <div className="space-y-2 max-h-[220px] overflow-y-auto font-mono text-[11px] leading-relaxed pr-1 scroller">
          {logs.map((log, index) => {
            const isLast = index === logs.length - 1;
            return (
              <div 
                key={index} 
                className={`flex gap-2 items-start animate-in fade-in slide-in-from-bottom-2 duration-150 ${
                  isLast ? 'text-indigo-300 font-extrabold' : 'text-indigo-200/60'
                }`}
              >
                <span className="text-[10px] text-slate-500 select-none">[{index + 1}]</span>
                <span className="shrink-0">{isLast && progress < 100 ? '▶' : '✔'}</span>
                <span>{log}</span>
              </div>
            );
          })}
        </div>

        <div className="border-t border-slate-800 pt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[10px] text-slate-500">
          <span>학과: {major} • {grade}학년 • {targetCredits}학점 설계 기준</span>
          <span className="flex items-center gap-1">
            <Database className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
            <span>CS Standard Framework Sandbox v2.5 initialized</span>
          </span>
        </div>
      </div>

      {/* Button to let them bypass any slow animations immediately once completed */}
      {progress === 100 && (
        <div className="text-center animate-in zoom-in-95 duration-200">
          <button
            onClick={onComplete}
            id="btn_skip_loading"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl transition duration-150 shadow-lg shadow-emerald-600/30 inline-flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle className="h-4 w-4" />
            <span>최종 완성 시간표 보러 가기 (Step 5로)</span>
          </button>
        </div>
      )}

    </div>
  );
}
