import { SavedTimetable } from '../types';
import { Bookmark, Calendar, Trash2, ExternalLink } from 'lucide-react';

interface SavedTimetablesListProps {
  savedList: SavedTimetable[];
  onLoad: (saved: SavedTimetable) => void;
  onDelete: (id: string) => void;
  selectedId?: string;
}

export default function SavedTimetablesList({
  savedList,
  onLoad,
  onDelete,
  selectedId
}: SavedTimetablesListProps) {
  if (savedList.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow p-6 text-center text-slate-400 italic">
        <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-xl border-dashed max-w-sm mx-auto">
          <Bookmark className="h-6 w-6 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-semibold">저장된 시간표가 없습니다.</p>
          <p className="text-[10px] text-slate-400 mt-1">상단의 시간표 생성 후 우측 상단의 "저장하기"를 누르면 여기에 등록됩니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {savedList.map((item) => {
        const isCurrentActive = selectedId === item.id;
        return (
          <div
            key={item.id}
            className={`border rounded-2xl p-4 transition-all flex flex-col justify-between hover:shadow-lg ${
              isCurrentActive
                ? 'bg-indigo-50/50 border-indigo-400 shadow'
                : 'bg-white border-slate-100'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  {item.createdAt}
                </span>
                <span className="text-[10px] text-indigo-600 bg-indigo-50 font-bold px-2 py-0.5 rounded-full">
                  {item.major} • {item.grade}학년
                </span>
              </div>
              <h4 className="text-sm font-sans font-extrabold text-slate-800 tracking-tight leading-tight">
                {item.name}
              </h4>
              <p className="text-xs text-slate-400 mt-1 truncate">
                {item.courses.map(c => c.name).join(', ')}
              </p>
              <div className="text-[11px] font-semibold text-slate-500 mt-3 flex items-center justify-between">
                <span>신청 이수량 :</span>
                <span className="font-mono text-indigo-600 font-extrabold bg-indigo-50/40 px-2 py-0.5 rounded">
                  {item.metrics.totalCredits} 학점 이수
                </span>
              </div>
            </div>

            <div className="flex gap-2 border-t border-slate-100 pt-3 mt-4">
              <button
                type="button"
                id={`load_btn_${item.id}`}
                onClick={() => onLoad(item)}
                className="flex-grow bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition"
              >
                <ExternalLink className="h-3 w-3" />
                <span>시간표 불러오기</span>
              </button>
              <button
                type="button"
                id={`delete_btn_${item.id}`}
                onClick={() => onDelete(item.id)}
                className="text-slate-400 border border-slate-100 hover:bg-rose-50 hover:border-rose-100 hover:text-rose-600 p-2 rounded-lg transition"
                title="시간표 삭제"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
