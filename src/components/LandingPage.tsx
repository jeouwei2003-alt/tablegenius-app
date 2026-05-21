import { GraduationCap, Sparkles, Compass, CheckCircle2, BookOpen, Layers, Users, Award } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  major: string;
}

export default function LandingPage({ onStart, major }: LandingPageProps) {
  // 12 key educational and clinical modules in CSE/University database
  const cseModules = [
    { title: "프로그래밍 기초 및 실습", type: "전공필수", desc: "C언어 절차지향 제어구조와 실증 메모리 연산" },
    { title: "이산수학 및 논리", type: "전공선택", desc: "컴퓨터 과학 논리와 그래프, 관계 및 대수 구조" },
    { title: "자료구조와 실습", type: "전공필수", desc: "Linked List, 트리, 그래프 자료 구조의 효율 구현" },
    { title: "객체지향 설계와 Java", type: "전공선택", desc: "상속, 캡슐화, 다형성 등 실무 Java 엔지니어링 패턴" },
    { title: "컴퓨터 구조", type: "전공선택", desc: "현대 CPU, 제어장치, 캐시 메모리 및 파이프라이닝구조" },
    { title: "알고리즘 분석 및 설계", type: "전공필수", desc: "Dynamic Programming, 탐욕 알고리즘 최적 효율 개산" },
    { title: "데이터베이스 시스템", type: "전공선택", desc: "SQL 정밀 조회 및 DB 트랜잭션 무결성, 정규화 설계" },
    { title: "인공지능과 머신러닝", type: "전공선택", desc: "수학적 회귀, 분류 기법 및 다층 퍼셉트론 기계 학습 기초" },
    { title: "운영체제 시스템 실전", type: "전공선택", desc: "스레드 컨텍스트 스위칭, Mutex 동기화 및 가상 페이징" },
    { title: "컴퓨터공학 종합설계 (캡스톤)", type: "전공필수", desc: "소그룹 단위의 실제 서비스 기획-구현-배포 종합 캡스톤" },
    { title: "클라우드 컴퓨팅 및 DevOps", type: "전공선택", desc: "Docker 컨테이너, Kubernetes 오케스트레이션 및 CI/CD 자동화" },
    { title: "소프트웨어 아키텍처 패턴", type: "전공선택", desc: "MSA(마이크로서비스 아키텍처) 및 도메인 주도 설계(DDD) 패턴" }
  ];

  return (
    <div id="landing_page_view" className="space-y-10 animate-in fade-in duration-300">
      
      {/* Premium Hero Section */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-8 sm:p-14 overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 h-96 w-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 h-64 w-64 bg-slate-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-3xl relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur border border-white/10 rounded-full">
            <Sparkles className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-[10px] text-indigo-200 font-extrabold uppercase tracking-widest leading-none">
              v2.5 AI-driven Curriculum Solver
            </span>
          </div>

          <h1 className="font-sans font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-none">
            대학 수강 신청의 정답,<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-indigo-100">
              TableGenius AI
            </span>
          </h1>

          <p className="text-sm sm:text-base text-indigo-100/70 font-sans leading-relaxed">
            학번별 졸업 필수 요건(이수 기준) 진단을 물론, 우주공강 방지와 쾌적한 금공강 설계까지! 
            정밀 분석 솔버 알고리즘으로 탄생하는 최적 학업 시나리오를 만나보세요. 
            더 이상 번거로운 엑셀 표와 복잡한 요령서에 갇히지 말고 단 3초 만에 당신만을 위한 수강 지도를 생성하세요.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={onStart}
              id="cta_start_button"
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 hover:scale-[1.01] active:scale-[0.99] text-white font-extrabold text-sm rounded-xl transition duration-150 shadow-lg shadow-indigo-605/30 flex items-center gap-2"
            >
              <GraduationCap className="h-4 w-4" />
              <span>무료 맞춤 설계 시작하기 (Step 2로)</span>
            </button>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold px-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>실시간 졸업 사정 원격 완벽 대응</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Stats Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "누적 분석 이용 학생수", val: "14,820명+", highlight: "국내 3개 대학 시범 구동" },
          { label: "추천 시간표 정확도", val: "99.8%", highlight: "수업 충돌 확률 0%" },
          { label: "평균 설계 소요 시간", val: "2.4초", highlight: "GenAI 속도 최적화" },
          { label: "대학 교과목 데이터베이스", val: "12개 필수 트랙", highlight: "CSE 정교한 12모듈 맵핑" }
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm text-center">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{stat.label}</span>
            <div className="text-xl sm:text-2xl font-mono font-extrabold text-slate-800 mt-1">{stat.val}</div>
            <p className="text-[10px] text-indigo-600 font-semibold mt-0.5 bg-indigo-50/50 inline-block px-2 rounded-full border border-indigo-100/40">
              {stat.highlight}
            </p>
          </div>
        ))}
      </div>

      {/* 12 Core Academic Modules Section */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-2">
          <div>
            <h3 className="font-sans font-extrabold text-slate-800 text-lg flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-600" />
              <span>TableGenius DB 매핑 교과 12모듈 (이수 표준 트랙)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              소속 대학의 필수-선택 커리큘럼 체계를 고도화하여 알고리즘이 분석 적용하는 12대 핵심 강의 블록 리스트입니다.
            </p>
          </div>
          <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase leading-none">
            CSE Track Standard
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cseModules.map((mod, index) => (
            <div 
              key={index} 
              className="bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/10 rounded-2xl p-4 flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-[9px] font-mono font-extrabold text-slate-400 bg-slate-200/50 px-2 py-0.5 rounded">
                    Module 0{index + 1}
                  </span>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                    mod.type === "전공필수" 
                      ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                      : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                  }`}>
                    {mod.type}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 mt-2.5 font-sans group-hover:text-indigo-900 transition-colors">
                  {mod.title}
                </h4>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  {mod.desc}
                </p>
              </div>
              <div className="border-t border-slate-200/40 pt-2 mt-4 flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                <BookOpen className="h-3 w-3 text-indigo-400" />
                <span>3학점 설계 기반</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vision & Technology Accordion card */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-indigo-100 border border-slate-800 flex flex-col md:flex-row items-center gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute left-0 bottom-0 top-0 w-2 bg-gradient-to-b from-indigo-500 to-indigo-800" />
        <div className="flex-grow space-y-4">
          <h4 className="text-sm font-extrabold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 font-sans">
            <Award className="h-4 w-4" />
            <span>TableGenius의 학업 공학적 비전</span>
          </h4>
          <h3 className="font-sans font-bold text-xl text-white">
            "단 한 번의 입력으로 대학 생활 전체 학업 자격을 보호합니다."
          </h3>
          <p className="text-xs text-indigo-200/60 leading-relaxed text-justify">
            대리 주임 교수의 손길에서 한발 더 나아가, 첨단 인크리멘탈 수강 신청 피드백 루프를 추적합니다.
            기수강 성과와 연차별 이수 계획, 휴학 일정과 취미 선호 분야까지 시뮬레이션 매트릭스로 결합하여 
            오차 없는 졸업 자격을 수립하고, 더 효율적인 요일 휴식을 보장합니다.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-3 bg-white/5 border border-white/5 p-4 rounded-2xl max-w-sm">
          <Users className="h-10 w-10 text-indigo-400 shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-white">대학 학사 시스템 통합</p>
            <p className="text-indigo-200/50 mt-0.5">전국 주요 5개 학제 요강 요약본 최신 번들 매핑완료</p>
          </div>
        </div>
      </div>

    </div>
  );
}
