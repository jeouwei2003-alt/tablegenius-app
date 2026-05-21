import { useState } from 'react';
import { Save, Bookmark, ShieldCheck, Download, FileSpreadsheet, ImageIcon, CheckCircle, RefreshCw, Trash2, Calendar } from 'lucide-react';
import { Course, TimetableRecommendation, SavedTimetable, UserPreferences } from '../types';

interface FinalCheckSavePageProps {
  activeOption: TimetableRecommendation | undefined;
  currentCourses: Course[];
  preferences: UserPreferences;
  savedTimetables: SavedTimetable[];
  onOpenSaveModal: () => void;
  onDeleteSaved: (id: string) => void;
  onLoadSaved: (saved: SavedTimetable) => void;
  onPrev: () => void;
}

export default function FinalCheckSavePage({
  activeOption,
  currentCourses,
  preferences,
  savedTimetables,
  onOpenSaveModal,
  onDeleteSaved,
  onLoadSaved,
  onPrev
}: FinalCheckSavePageProps) {
  const [exportingType, setExportingType] = useState<'excel' | 'image' | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const structuredCredits = currentCourses.reduce((sum, c) => sum + c.credits, 0);
  const isMatch = structuredCredits === preferences.targetCredits;

  // Mocking export simulation
  const handleSimulateExport = (type: 'excel' | 'image') => {
    setExportingType(type);
    setSuccessMessage(null);

    setTimeout(() => {
      setExportingType(null);
      const filename = type === 'excel' 
        ? `${preferences.major}_${preferences.grade}학년_시간표.xlsx`
        : `${preferences.major}_${preferences.grade}학년_시간표.png`;
      setSuccessMessage(`✓ 성공: ${filename} 파일의 정밀 변환 인코딩과 생성이 완료되어 다운로드를 시작했습니다!`);
      
      // Clear alert banner after 4 seconds
      setTimeout(() => setSuccessMessage(null), 4500);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200" id="final_check_save_page_view">
      
      {/* Page Title Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div className="space-y-1">
          <span className="text-[10px] text-emerald-300 font-extrabold uppercase tracking-widest bg-white/10 px-2.5 py-0.5 rounded-full leading-none">
            Step 8 / 8
          </span>
          <h2 className="text-white font-extrabold text-xl tracking-tight leading-none mt-1">최종 검수 및 시간표 다운로드/저장</h2>
          <p className="text-xs text-indigo-200/50">
            목표 학점 대조 검수를 완료하고, 실물 엑셀 규격이나 이미지 포맷으로 최종 완성본을 영구 백업하십시오.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-600 rounded-xl py-2 px-3.5 text-xs font-sans font-extrabold shrink-0">
          <ShieldCheck className="h-4 w-4 text-emerald-300" />
          <span>TableGenius Security & Export</span>
        </div>
      </div>

      {/* Interactive alert status */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-800 text-xs font-bold leading-relaxed shadow-sm animate-in zoom-in-95 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Goals vs structured alignment comparison card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-5 sm:p-6 lg:col-span-4 space-y-5">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">학점 총량 정성대조 검수</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs text-slate-600 font-bold">
              <span>설정 목표 수량</span>
              <span className="font-mono text-sm text-slate-800">{preferences.targetCredits} 학점</span>
            </div>
            
            <div className="flex justify-between items-center text-xs text-slate-600 font-bold">
              <span>현재 구성 수량</span>
              <span className={`font-mono text-sm font-extrabold ${isMatch ? 'text-emerald-600' : 'text-amber-600'}`}>
                {structuredCredits} 학점
              </span>
            </div>

            {/* Dial comparison block */}
            <div className={`p-4 rounded-xl border text-center ${
              isMatch 
                ? 'bg-emerald-50/50 border-emerald-150 text-emerald-950' 
                : 'bg-amber-50/50 border-amber-150 text-amber-950'
            }`}>
              <span className="text-[10px] font-extrabold uppercase tracking-wider block mb-1">매칭 달성 상태</span>
              <div className="text-lg font-extrabold">
                {isMatch ? "정합성 성사 (Goal Match!)" : "목표 불일치 (과목 부족/초과)"}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {isMatch 
                  ? "정확하게 타겟 학점을 충족하며 무결점 배치가 이뤄졌습니다." 
                  : `설정한 학점(${preferences.targetCredits}학점)과 현재 과목(${structuredCredits}학점)이 다른 상태입니다. 7단계로 이동해 미세 과목을 더 장착할 수 있습니다.`}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenSaveModal}
            id="btn_archive_save"
            className="w-full py-3 bg-indigo-65 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl transition shadow flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>온라인 북마크 장착 저장하기</span>
          </button>
        </div>

        {/* Middle/Right: Download simulator panel + Save Bookmarks list inline */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Mock Document exporting cards */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-5 sm:p-6 space-y-4">
            <div>
              <h3 className="text-sm font-sans font-bold text-slate-800">소속 대학 공식 수강 대조 규격 파일 다운로드</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">서버 측 가상 엑셀 및 비디오 렌더러 기반 정밀 내보내기 도구 모음입니다.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Excel Exponent Card */}
              <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center">
                    <FileSpreadsheet className="h-7 w-7 text-emerald-600" />
                    <span className="bg-emerald-50 text-emerald-700 text-[8px] font-extrabold px-1.5 py-0.2 rounded border border-emerald-100">
                      Format Check PASS
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mt-3">Excel 계상 규격 매트릭스</h4>
                  <p className="text-[10px] text-slate-450 text-slate-400 mt-1">소재 대학 학사 정보 포털 수강신청 다중 업로드 양식에 부합하는 정규 엑셀 파일 기입본 도출</p>
                </div>
                <button
                  onClick={() => handleSimulateExport('excel')}
                  disabled={exportingType !== null}
                  className="w-full py-2 bg-white hover:bg-emerald-600 hover:text-white border border-emerald-200 text-emerald-700 text-xs font-extrabold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {exportingType === 'excel' ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>컴파일 빌드 중...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-3.5 w-3.5" />
                      <span>Excel 다운로드 시뮬레이션</span>
                    </>
                  )}
                </button>
              </div>

              {/* PNG Image Exponent Card */}
              <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center">
                    <ImageIcon className="h-7 w-7 text-indigo-600" />
                    <span className="bg-indigo-50 text-indigo-700 text-[8px] font-extrabold px-1.5 py-0.2 rounded border border-indigo-100">
                      Standard Quality
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mt-3">눈안정성 테마 시간표 이미지</h4>
                  <p className="text-[10px] text-slate-400 mt-1">스마트폰 잠금화면이나 태블릿 아카이브 보관에 최적화된 고화질 고대비 PNG 시간표 캡처 이미지 추출</p>
                </div>
                <button
                  onClick={() => handleSimulateExport('image')}
                  disabled={exportingType !== null}
                  className="w-full py-2 bg-white hover:bg-indigo-600 hover:text-white border border-indigo-200 text-indigo-700 text-xs font-extrabold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {exportingType === 'image' ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>시간표 스크린샷 합성 중...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-3.5 w-3.5" />
                      <span>PNG 이미지 다운로드 시뮬레이션</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>

          {/* Bookmarks shelving list */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-sans font-bold text-slate-800 flex items-center gap-2">
              <Bookmark className="h-4.5 w-4.5 text-indigo-600 shrink-0" />
              <span>TableGenius 북마크 아카이브</span>
            </h3>

            {savedTimetables.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 italic bg-slate-50 border border-dashed rounded-xl">
                등록된 저장 시간표 기록이 비어있습니다. 왼쪽의 '온라인 북마크 장착 저장하기'를 클릭해보세요!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1">
                {savedTimetables.map(item => (
                  <div key={item.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl hover:border-slate-300 transition flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] font-mono text-slate-400 bg-slate-150 px-1 rounded font-bold">SAVED</span>
                        <span className="text-[9px] text-indigo-600 font-extrabold font-sans">{item.major} • {item.grade}학년</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-850 mt-1 truncate max-w-[150px]">{item.name}</h4>
                      <div className="text-[10px] text-slate-450 text-slate-400 mt-1 flex items-center gap-1">
                        <Calendar className="h-3 w-3 shrink-0" />
                        <span>시간표 과목 수: {item.courses.length}개 ({item.metrics.totalCredits}학점)</span>
                      </div>
                    </div>

                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => onLoadSaved(item)}
                        className="px-2 py-1 bg-white hover:bg-slate-800 hover:text-white border border-slate-200 text-slate-600 text-[10px] font-bold rounded-md transition"
                      >
                        로드
                      </button>
                      <button
                        onClick={() => onDeleteSaved(item.id)}
                        className="p-1 text-red-500 hover:bg-rose-50 hover:text-red-700 border border-transparent rounded transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
          <span>이전 과목 스왑 교정 (Step 7로)</span>
        </button>

        <div className="text-xs font-bold text-emerald-600 flex items-center gap-1 px-3">
          <ShieldCheck className="h-4 w-4 text-emerald-500 animate-pulse" />
          <span>TableGenius 설계가 완벽히 완수되었습니다.</span>
        </div>
      </div>

    </div>
  );
}

function ArrowLeft(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 19-7-7 7-7"/>
      <path d="M19 12H5"/>
    </svg>
  );
}
