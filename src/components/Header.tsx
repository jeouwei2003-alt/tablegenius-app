import { GraduationCap, Sparkles, BookOpen } from 'lucide-react';

interface HeaderProps {
  onReset?: () => void;
}

export default function Header({ onReset }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-900/40 text-white shadow-lg sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand Identity */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={onReset}
          >
            <div className="bg-indigo-600 p-2.5 rounded-xl text-white group-hover:bg-indigo-500 shadow-md group-hover:shadow-indigo-500/25 transition-all">
              <GraduationCap className="h-6 w-6 transform group-hover:rotate-6 transition-all" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-extrabold tracking-tight text-xl bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-100">
                  TableGenius
                </span>
                <span className="bg-indigo-500/20 text-indigo-300 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-mono border border-indigo-500/30">
                  v2.5 AI
                </span>
              </div>
              <p className="text-xs text-indigo-200/60 font-sans tracking-wide">
                맞춤형 대학 시간표 설계 & 생성형 AI 추천 시스템
              </p>
            </div>
          </div>

          {/* Academic Term Info Badge */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-300">
              <BookOpen className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-mono">2026학년도 2학기 수강신청 대비</span>
            </div>

            <div className="flex items-center gap-1.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-yellow-400" />
              <span>Full-Stack AI Engine</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
