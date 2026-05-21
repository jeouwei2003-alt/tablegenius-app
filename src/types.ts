export interface TimeSlot {
  day: '월' | '화' | '수' | '목' | '금';
  startPeriod: number; // 1 to 9 (e.g., 1 = 09:00, 2 = 10:00, etc.)
  endPeriod: number;   // inclusive
  startTime: string;   // e.g., "09:00"
  endTime: string;     // e.g., "10:30" or "12:00"
}

export type CourseCategory = '전공필수' | '전공선택' | '교양필수' | '교양선택';

export interface Course {
  id: string;
  code: string;
  name: string;
  major: string; // e.g., "컴퓨터공학과", "경영학과", "미디어커뮤니케이션학과", "공통"
  category: CourseCategory;
  grade: number; // 1, 2, 3, 4
  credits: number; // 2, 3
  timeSlots: TimeSlot[];
  professor: string;
  description: string;
  prerequisite?: string;
}

export interface UserPreferences {
  grade: number; // 1, 2, 3, 4
  major: string; // "컴퓨터공학과", "경영학과", "미디어커뮤니케이션학과"
  freeDays: string[]; // ['월', '수', '금'] etc.
  targetCredits: number; // e.g., 15, 18, 21
  currentCompletedCredits: {
    majorRequired: number;
    majorElective: number;
    generalRequired: number;
    generalElective: number;
  };
  preferredKeywords: string[]; // ['인공지능', '마케팅', '디자인' 등]
  scheduleStyle: 'balanced' | 'morning' | 'afternoon' | 'compact'; // compact = 우주공강 방지, balanced = 고른 분포
}

export interface TimetableRecommendation {
  id: string;
  name: string; // e.g., "옵션 1: 금요일 공강형 균형 시간표"
  courses: Course[];
  reasoning: {
    overallSummary: string;
    graduationMatch: string; // 졸업 요건 만족도 설명
    scheduleHighlights: string[]; // 시간표 특징 요약 (e.g., "금요일 전체 공강 확보", "오전 시간 활용 극대화")
    keywordMatchReason?: string; // 키워드 선호 반영 설명
  };
  metrics: {
    totalCredits: number;
    majorRequiredCredits: number;
    majorElectiveCredits: number;
    generalRequiredCredits: number;
    generalElectiveCredits: number;
    hasConflicts: boolean;
    freeDaysSecured: string[];
  };
}

export interface SavedTimetable {
  id: string;
  name: string;
  grade: number;
  major: string;
  courses: Course[];
  metrics: {
    totalCredits: number;
  };
  reasoningSummary: string;
  createdAt: string;
}
