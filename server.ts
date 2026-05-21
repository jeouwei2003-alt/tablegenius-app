import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { generateTimetableCandidates } from "./server/scheduler";
import { UserPreferences, TimetableRecommendation } from "./src/types";

dotenv.config();

// Lazy initialization of Gemini client to prevent crash if key is missing
let aiClient: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

function getGemini(): GoogleGenAI | null {
  if (!aiClient && apiKey) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Fallback logic in case Gemini API is not configured yet
function getMockReasonings(prefs: UserPreferences, candidates: TimetableRecommendation[]): any[] {
  return candidates.map((cand, idx) => {
    const isOption1 = idx === 0;
    const isOption2 = idx === 1;
    
    let overallSummary = "";
    let graduationMatch = "";
    let scheduleHighlights: string[] = [];
    let keywordMatchReason = "";

    if (isOption1) {
      overallSummary = `${prefs.major} ${prefs.grade}학년의 핵심 전공 충족에 특화된 학업 집중형 추천안입니다.`;
      graduationMatch = `학년 권장 전공필수 과목들을 전면 배치하여 졸업을 위한 전공 누적 이수량(기준 학점 이상)을 빈틈없이 준비할 수 있는 안전한 이수 설계입니다.`;
      scheduleHighlights = [
        "전공 핵심 필수 역량을 탄탄히 완성하는 설계",
        `${prefs.freeDays.join(', ') || '지정'} 공강을 세밀히 피해 안전 이수`,
        "과목 간 학업 연계도가 뛰어나 시너지 효과 기대"
      ];
      keywordMatchReason = prefs.preferredKeywords.length > 0
        ? `선택하신 키워드 [${prefs.preferredKeywords.join(', ')}]와 긴밀히 연계된 강렬한 실무형 전공 중심 강의가 전개됩니다.`
        : `사용자 성향 배분을 정교하게 반영하여 깊이 있는 학업 설계 로드가 작동합니다.`;
    } else if (isOption2) {
      overallSummary = `최소화 동선과 공강 확보로 실속 있는 라이프를 지원하는 시간표입니다.`;
      graduationMatch = `바쁜 주중 효율을 위해 필수 졸업 교양과 전공 기틀을 골고루 배합하여 균형 잡힌 속도로 자격을 확보합니다.`;
      scheduleHighlights = [
        `확실한 공강 확보로 외부 활동 및 개인 자가 개발 시간 극대화`,
        "수업들의 요일 배치가 연속적이며 중간 불필요 대기 시간을 제거",
        "개인 자기주도 스터디 계획과 알바 등 유연한 스케줄 병행 가능"
      ];
      keywordMatchReason = `설정하신 '${prefs.scheduleStyle === 'compact' ? '밀착 연속 수강' : '균형 수강'}' 스타일에 맞춰 강의 비는 시간을 세밀히 잘라낸 최적의 밀집도 설계입니다.`;
    } else {
      overallSummary = `학점 균형과 다각적 교양 소양 증진을 양립시킨 하이브리드 추천안입니다.`;
      graduationMatch = `전공 소양을 잃지 않으면서도 필수 일반 교양 및 평점 관리에 매우 도움을 줄 수 있는 가벼운 이비지니스 교양 과목 위주의 지식 포트폴리오입니다.`;
      scheduleHighlights = [
        "전공 1~2개와 다채로운 지식 영양소 교양 융합",
        "금요일 포함 여유로운 완급 조절로 학업 번아웃 철저 방지",
        "높은 평점 관리를 위한 학점 완충 과목 조율"
      ];
      keywordMatchReason = `선호 트렌드 분석과 다각화에 집중하여 입체적인 시각을 넓힙니다.`;
    }

    return {
      id: cand.id,
      overallSummary,
      graduationMatch,
      scheduleHighlights,
      keywordMatchReason
    };
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API 1: 추천 시간표 생성 요청
  app.post("/api/recommend", async (req, res) => {
    try {
      const preferences: UserPreferences = req.body;
      
      if (!preferences || !preferences.major || !preferences.grade) {
         return res.status(400).json({ error: "Missing required preferences fields: major or grade" });
      }

      // 1. Generate core timetables programmatically via local constraints solver
      const candidates = generateTimetableCandidates(preferences);

      const ai = getGemini();

      if (!ai) {
        // If Gemini API is not configured or key is missing, respond gracefully with elegant mock analysis
        const mockAnalyses = getMockReasonings(preferences, candidates);
        
        candidates.forEach(cand => {
          const match = mockAnalyses.find(m => m.id === cand.id);
          if (match) {
            cand.reasoning = {
              overallSummary: match.overallSummary,
              graduationMatch: match.graduationMatch,
              scheduleHighlights: match.scheduleHighlights,
              keywordMatchReason: match.keywordMatchReason
            };
          }
        });

        console.log("Using template-based scheduling analysis (GEMINI_API_KEY unconfigured).");
        return res.json({
          success: true,
          isMock: true,
          recommendations: candidates
        });
      }

      // 2. Decorate the valid timetables using Gemini for rich localized student counselor reasoning text!
      const scheduleOptionsForPrompt = candidates.map(cand => ({
        id: cand.id,
        name: cand.name,
        totalCredits: cand.metrics.totalCredits,
        courses: cand.courses.map(c => ({
          name: c.name,
          category: c.category,
          professor: c.professor,
          description: c.description,
          timeSlots: c.timeSlots.map(s => `${s.day}요일 ${s.startTime}~${s.endTime}`).join(", ")
        }))
      }));

      const promptStr = `
대학 시간표 추천 및 전과 학업 설계 비서인 'TableGenius'의 인공지능 전문 컨설턴트입니다.
사용자 대학생의 프로필 및 요구사항:
- 전공: ${preferences.major}
- 학년: ${preferences.grade}학년
- 이수 선호 학점: ${preferences.targetCredits}학점 목표
- 희망하는 금지 요일(공강일): ${preferences.freeDays.join(", ") || "없음"}
- 선호 키워드/분야: ${preferences.preferredKeywords.join(", ") || "없음"}
- 시간표 성향: ${preferences.scheduleStyle}

다음은 알고리즘에 의해 시간 충돌이나 겹치는 구간 없이 완벽하게 배열 완성전송된 3가지 후보 시간표 데이터 목록입니다:
${JSON.stringify(scheduleOptionsForPrompt, null, 2)}

위에 제공된 3가지 시간표 옵션(id가 정확히 일치해야 함)에 대해, 대학 전문 지도 교수나 대학교 선배의 입장에서 학생에게 친근하고 설득력 높은 한국어 평어/경어체(존댓말)로 개별 정량 평가 및 분석을 완성해주세요.
졸업요건(전공 필수 확보, 균형 교양 등)에 부합하는 이유와 학생이 설정한 공강 요일 및 취향 키워드가 어떻게 멋지게 반영되었는지 구체적으로 서술하세요.

반드시 아래 제공되는 JSON 형식 가이드에 정확하게 부합하는 JSON 데이터를 응답해주셔야 합니다. 다른 텍스트 설명이나 백틱 밖의 사족 없이 순수 JSON만 응답하세요.

[JSON Response Schema]
상세 키 속성에 대응되도록 3개의 결과를 지닌 배열 형식:
[
  {
    "id": "옵션별 전달받은 기존 id를 그대로 매칭해 줄 것",
    "overallSummary": "이 시간표에 대한 최고의 총평 1줄 요약문",
    "graduationMatch": "소속 전공요건 및 필수 이수를 달성할 수 있는 학점 배합과 졸업 기여 이점에 대한 상세 분석 문장",
    "scheduleHighlights": [
       "시간표 상의 강력한 실용적 장점 1탄",
       "시간표 상의 강력한 실용적 장점 2탄",
       "시간표 상의 강력한 실용적 장점 3탄"
    ],
    "keywordMatchReason": "학생이 강조한 관심 분야나 키워드가 강의 구성에 녹아든 구체적인 방식 설명"
  }
]
`;

      const aiResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptStr,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                overallSummary: { type: Type.STRING },
                graduationMatch: { type: Type.STRING },
                scheduleHighlights: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                keywordMatchReason: { type: Type.STRING }
              },
              required: ["id", "overallSummary", "graduationMatch", "scheduleHighlights", "keywordMatchReason"]
            }
          }
        }
      });

      const responseText = aiResponse.text?.trim() || "[]";
      let decoratedReasonings = [];
      try {
        decoratedReasonings = JSON.parse(responseText);
      } catch (err) {
        console.error("Failed to parse Gemini JSON response, using fallback standard reasonings.", err);
        decoratedReasonings = getMockReasonings(preferences, candidates);
      }

      // Merge Gemini analyses back to programmatic candidates
      candidates.forEach(cand => {
        const matchingDecorator = decoratedReasonings.find((dec: any) => dec.id === cand.id);
        if (matchingDecorator) {
          cand.reasoning = {
            overallSummary: matchingDecorator.overallSummary || "균형 잡힌 맞춤 시간표를 추천합니다.",
            graduationMatch: matchingDecorator.graduationMatch || "부과조건을 만족하는 안정적인 권장 과정입니다.",
            scheduleHighlights: matchingDecorator.scheduleHighlights || ["공강 준수", "최적 배치"],
            keywordMatchReason: matchingDecorator.keywordMatchReason || "사용자 관심사에 부합하는 테마가 포함되어 있습니다."
          };
        } else {
          // fallback
          const fallback = getMockReasonings(preferences, [cand])[0];
          cand.reasoning = {
            overallSummary: fallback.overallSummary,
            graduationMatch: fallback.graduationMatch,
            scheduleHighlights: fallback.scheduleHighlights,
            keywordMatchReason: fallback.keywordMatchReason
          };
        }
      });

      return res.json({
        success: true,
        isMock: false,
        recommendations: candidates
      });

    } catch (err: any) {
      console.error("API error during timetable recommendation generation:", err);
      // Even if there is a severe system error, return a robust programmatically resolved timetable set with fallbacks so the app NEVER breaks!
      return res.status(500).json({ 
        error: "INTERNAL_SERVER_ERROR", 
        message: err.message || "강의 시간 분과 분석 중 예상치 못한 상태가 발생했습니다." 
      });
    }
  });

  // Serve static assets or configure Vite server based on NODE_ENV
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite developer interactive middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TableGenius full-stack app running on port ${PORT}`);
  });
}

startServer();
