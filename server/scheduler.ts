import { Course, TimetableRecommendation, UserPreferences, TimeSlot } from '../src/types';
import { UNIVERSITY_COURSES } from '../src/data/courses';

// Helper to check if two time slots overlap
function doSlotsOverlap(slot1: TimeSlot, slot2: TimeSlot): boolean {
  if (slot1.day !== slot2.day) return false;
  // Overlap if max(start1, start2) <= min(end1, end2)
  return Math.max(slot1.startPeriod, slot2.startPeriod) <= Math.min(slot1.endPeriod, slot2.endPeriod);
}

// Helper to check if a course overlaps with any courses already in the timetable
function hasOverlapConflict(course: Course, currentTimetable: Course[]): boolean {
  for (const tCourse of currentTimetable) {
    for (const slot1 of course.timeSlots) {
      for (const slot2 of tCourse.timeSlots) {
        if (doSlotsOverlap(slot1, slot2)) {
          return true;
        }
      }
    }
  }
  return false;
}

// Custom algorithm to produce a list of timetables
export function generateTimetableCandidates(prefs: UserPreferences): TimetableRecommendation[] {
  const { grade, major, freeDays, targetCredits, scheduleStyle } = prefs;

  // Filter courses that:
  // 1. Belong to the requested major OR are "공통"
  // 2. Fits the student's grade (allow grade, grade - 1, or grade + 1 for electives. For grade 1: only 1 and general)
  // 3. Do not have any time slot on preferred freeDays
  const candidates = UNIVERSITY_COURSES.filter(course => {
    // 1. Major match
    const isMajorMatch = course.major === major;
    const isGeneral = course.major === "공통";
    if (!isMajorMatch && !isGeneral) return false;

    // 2. Grade validation
    // Major Required is strict to the grade (or adjacent for flexibility)
    if (course.category === '전공필수') {
      if (course.grade !== grade) return false;
    } else {
      // General can be taken anytime, Major elective usually user grade or lower
      if (course.major !== "공통" && course.grade > grade) return false;
    }

    // 3. Free days filter
    for (const slot of course.timeSlots) {
      if (freeDays.includes(slot.day)) {
        return false;
      }
    }

    return true;
  });

  // Sort candidates based on priority & scheduleStyle
  // We want to weigh required majors since they are crucial for graduation
  const scoreCourse = (course: Course): number => {
    let score = 0;
    
    // Core categories weight
    if (course.category === '전공필수') score += 100;
    if (course.category === '교양필수') score += 80;
    if (course.category === '전공선택') score += 50;
    if (course.category === '교양선택') score += 30;

    // Direct grade match
    if (course.grade === grade) score += 20;

    // Schedule preference matching
    course.timeSlots.forEach(slot => {
      // morning preference (Period 1 to 3, i.e. 09:00 - 13:15)
      if (scheduleStyle === 'morning' && slot.startPeriod <= 3) {
        score += 15;
      }
      // afternoon preference (Period 4+ onwards, i.e. 13:30 onwards)
      if (scheduleStyle === 'afternoon' && slot.startPeriod >= 4) {
        score += 15;
      }
    });

    // Keyword match (Major descriptions or keywords match preferences)
    const normalizedPrefKeywords = prefs.preferredKeywords.map(k => k.trim().toLowerCase());
    normalizedPrefKeywords.forEach(kw => {
      if (kw && (course.name.toLowerCase().includes(kw) || course.description.toLowerCase().includes(kw))) {
        score += 30;
      }
    });

    return score;
  };

  const sortedCandidates = [...candidates].sort((a, b) => scoreCourse(b) - scoreCourse(a));

  // We want to generate 3 distinct options (Major Focus, Balanced/Compact, General/Fulfillment)
  const options: TimetableRecommendation[] = [];

  // Strategy 1: 전공 집중형 (Major Intensive Focus)
  // Strictly fills major courses first
  const buildIntensiveShed = (): Course[] => {
    const timetable: Course[] = [];
    let credits = 0;
    
    // First, try to add major required/elective matching current grade
    const majorCourses = sortedCandidates.filter(c => c.major === major);
    const generalCourses = sortedCandidates.filter(c => c.major === "공통");

    for (const course of majorCourses) {
      if (credits + course.credits <= targetCredits + 1) {
        if (!hasOverlapConflict(course, timetable)) {
          timetable.push(course);
          credits += course.credits;
        }
      }
    }

    // Top up with general courses
    for (const course of generalCourses) {
      if (credits + course.credits <= targetCredits) {
        if (!hasOverlapConflict(course, timetable)) {
          timetable.push(course);
          credits += course.credits;
        }
      }
    }

    return timetable;
  };

  // Strategy 2: 공강 극대화 및 우주공강 방지 (Time Optimized & Compact / Free-day Focus)
  // Avoids scattered schedules, groups classes sequentially
  const buildCompactShed = (): Course[] => {
    const timetable: Course[] = [];
    let credits = 0;

    // Focus on grade match, required majors, and compacting slots
    // Let's iterate and try to keep as many days completely blank as possible.
    // Ensure we satisfy General Required first too.
    const priorityCourses = sortedCandidates.filter(c => c.category === '전공필수' || c.category === '교양필수');
    const optionalCourses = sortedCandidates.filter(c => c.category !== '전공필수' && c.category !== '교양필수');

    for (const course of priorityCourses) {
      if (credits + course.credits <= targetCredits) {
        if (!hasOverlapConflict(course, timetable)) {
          timetable.push(course);
          credits += course.credits;
        }
      }
    }

    for (const course of optionalCourses) {
      if (credits + course.credits <= targetCredits) {
        if (!hasOverlapConflict(course, timetable)) {
          // If compact requested, prefer courses on days we already have classes OR keep empty days empty
          const daysWithClasses = timetable.flatMap(tc => tc.timeSlots.map(s => s.day));
          const courseDays = course.timeSlots.map(s => s.day);
          
          const hasDayOverlap = courseDays.some(d => daysWithClasses.includes(d));
          
          if (scheduleStyle === 'compact') {
            // Prefer scheduling classes on same days
            if (hasDayOverlap || timetable.length === 0) {
              timetable.push(course);
              credits += course.credits;
            }
          } else {
            timetable.push(course);
            credits += course.credits;
          }
        }
      }
    }

    // If still far from target, try any remaining courses that fit
    for (const course of sortedCandidates) {
      if (credits + course.credits <= targetCredits) {
        if (!hasOverlapConflict(course, timetable)) {
          timetable.push(course);
          credits += course.credits;
        }
      }
    }

    return timetable;
  };

  // Strategy 3: 학업-교양 균형형 (Balanced General & Humanities Exploration)
  // Mixes major and general courses, explores diverse fields (e.g., environment, history)
  const buildBalancedShed = (): Course[] => {
    const timetable: Course[] = [];
    let credits = 0;

    // Pick 1-2 major required, 1-2 major electives, and fill rest with general education
    const majorReq = sortedCandidates.filter(c => c.major === major && c.category === '전공필수');
    const majorEle = sortedCandidates.filter(c => c.major === major && c.category === '전공선택');
    const generalReq = sortedCandidates.filter(c => c.major === "공통" && c.category === '교양필수');
    const generalEle = sortedCandidates.filter(c => c.major === "공통" && c.category === '교양선택');

    // 1. Core Major Required
    if (majorReq[0] && credits + majorReq[0].credits <= targetCredits) {
      timetable.push(majorReq[0]);
      credits += majorReq[0].credits;
    }

    // 2. Core General Required
    if (generalReq[0] && !hasOverlapConflict(generalReq[0], timetable) && credits + generalReq[0].credits <= targetCredits) {
      timetable.push(generalReq[0]);
      credits += generalReq[0].credits;
    }

    // 3. Major Elective
    for (const course of majorEle) {
      if (!hasOverlapConflict(course, timetable) && credits + course.credits <= targetCredits) {
        timetable.push(course);
        credits += course.credits;
        break; // just 1 or 2
      }
    }

    // 4. Fill with General Electives
    for (const course of generalEle) {
      if (!hasOverlapConflict(course, timetable) && credits + course.credits <= targetCredits) {
        timetable.push(course);
        credits += course.credits;
      }
    }

    // 5. Fill remaining
    for (const course of sortedCandidates) {
      if (!hasOverlapConflict(course, timetable) && credits + course.credits <= targetCredits) {
        timetable.push(course);
        credits += course.credits;
      }
    }

    return timetable;
  };

  const listSchedules = [
    { name: "옵션 1: 전공 학업 집중형 시간표", courses: buildIntensiveShed() },
    { name: "옵션 2: 공강 최적화 & 밀착형 시간표", courses: buildCompactShed() },
    { name: "옵션 3: 학업-교양 균형형 시간표", courses: buildBalancedShed() }
  ];

  listSchedules.forEach((sch, idx) => {
    const totalCredits = sch.courses.reduce((sum, c) => sum + c.credits, 0);
    const majorReq = sch.courses.filter(c => c.category === '전공필수').reduce((sum, c) => sum + c.credits, 0);
    const majorEle = sch.courses.filter(c => c.category === '전공선택').reduce((sum, c) => sum + c.credits, 0);
    const genReq = sch.courses.filter(c => c.category === '교양필수').reduce((sum, c) => sum + c.credits, 0);
    const genEle = sch.courses.filter(c => c.category === '교양선택').reduce((sum, c) => sum + c.credits, 0);
    
    // Check which week days are completely free
    const scheduledDays = sch.courses.flatMap(c => c.timeSlots.map(s => s.day));
    const allDays: ('월' | '화' | '수' | '목' | '금')[] = ['월', '화', '수', '목', '금'];
    const freeDaysSecured = allDays.filter(d => !scheduledDays.includes(d));

    options.push({
      id: `option-${idx + 1}-${Date.now()}`,
      name: sch.name,
      courses: sch.courses,
      reasoning: {
        overallSummary: "시간표 분석 로드 중...",
        graduationMatch: "졸업성취도 계산 중...",
        scheduleHighlights: ["지정 공강 요일 반영", "과목 간 연계 고려"]
      },
      metrics: {
        totalCredits,
        majorRequiredCredits: majorReq,
        majorElectiveCredits: majorEle,
        generalRequiredCredits: genReq,
        generalElectiveCredits: genEle,
        hasConflicts: false,
        freeDaysSecured
      }
    });
  });

  return options;
}
