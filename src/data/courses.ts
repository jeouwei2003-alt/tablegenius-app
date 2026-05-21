import { Course } from '../types';

export const UNIVERSITY_COURSES: Course[] = [
  // ==========================================
  // 컴퓨터공학과 (Computer Science & Engineering)
  // ==========================================
  {
    id: "cs-101",
    code: "CSE1001",
    name: "프로그래밍 기초 및 실습",
    major: "컴퓨터공학과",
    category: "전공필수",
    grade: 1,
    credits: 3,
    professor: "김민재 교수",
    description: "C언어를 활용하여 컴퓨터 프로그래밍의 기초 개념을 학습하고 실전에 적용할 수 있는 알고리즘 설계 능력을 배양합니다.",
    timeSlots: [
      { day: "월", startPeriod: 1, endPeriod: 1, startTime: "09:00", endTime: "10:15" },
      { day: "수", startPeriod: 1, endPeriod: 1, startTime: "09:00", endTime: "10:15" }
    ]
  },
  {
    id: "cs-102",
    code: "CSE1002",
    name: "이산수학 및 논리",
    major: "컴퓨터공학과",
    category: "전공선택",
    grade: 1,
    credits: 3,
    professor: "이지은 교수",
    description: "컴퓨터 과학의 기초가 되는 집합, 관계, 함수, 그래프 이론 및 명제 논리를 정립하여 문제 해결 능력을 키웁니다.",
    timeSlots: [
      { day: "화", startPeriod: 2, endPeriod: 2, startTime: "10:30", endTime: "11:45" },
      { day: "목", startPeriod: 2, endPeriod: 2, startTime: "10:30", endTime: "11:45" }
    ]
  },
  {
    id: "cs-201",
    code: "CSE2001",
    name: "자료구조와 실습",
    major: "컴퓨터공학과",
    category: "전공필수",
    grade: 2,
    credits: 3,
    professor: "박동근 교수",
    description: "배열, 연결 리스트, 스택, 큐, 트리, 그래프 등 다양한 데이터 구조를 구현하고 공간 및 시간 알고리즘 복잡도를 명확히 파악합니다.",
    prerequisite: "프로그래밍 기초 및 실습",
    timeSlots: [
      { day: "월", startPeriod: 2, endPeriod: 2, startTime: "10:30", endTime: "11:45" },
      { day: "수", startPeriod: 2, endPeriod: 2, startTime: "10:30", endTime: "11:45" }
    ]
  },
  {
    id: "cs-202",
    code: "CSE2002",
    name: "객체지향 설계와 Java",
    major: "컴퓨터공학과",
    category: "전공선택",
    grade: 2,
    credits: 3,
    professor: "한상우 교수",
    description: "클래스, 상속, 포인터 대신의 참조 모델, 다형성 등 객체지향 패러다임의 핵심 원리를 Java 언어를 통해 깊이있게 습득합니다.",
    timeSlots: [
      { day: "화", startPeriod: 4, endPeriod: 4, startTime: "13:30", endTime: "14:45" },
      { day: "목", startPeriod: 4, endPeriod: 4, startTime: "13:30", endTime: "14:45" }
    ]
  },
  {
    id: "cs-203",
    code: "CSE2003",
    name: "컴퓨터 구조",
    major: "컴퓨터공학과",
    category: "전공선택",
    grade: 2,
    credits: 3,
    professor: "장성호 교수",
    description: "중앙처리장치(CPU), 제어장치, 레지스터, 캐시 메모리 및 가상 메모리로 대표되는 현대 컴퓨터 부속 장치들의 기본 연계 방식과 데이터 흐름을 이론 학습합니다.",
    timeSlots: [
      { day: "월", startPeriod: 4, endPeriod: 4, startTime: "13:30", endTime: "14:45" },
      { day: "수", startPeriod: 4, endPeriod: 4, startTime: "13:30", endTime: "14:45" }
    ]
  },
  {
    id: "cs-301",
    code: "CSE3001",
    name: "알고리즘 분석 및 설계",
    major: "컴퓨터공학과",
    category: "전공필수",
    grade: 3,
    credits: 3,
    professor: "최성진 교수",
    description: "분할정복, 탐욕법, 동적 계획법 등 현대적인 알고리즘 패턴을 정독 분석하고 최적화 기댓값과 연산 효율성을 탐구합니다.",
    prerequisite: "자료구조와 실습",
    timeSlots: [
      { day: "화", startPeriod: 1, endPeriod: 1, startTime: "09:00", endTime: "10:15" },
      { day: "목", startPeriod: 1, endPeriod: 1, startTime: "09:00", endTime: "10:15" }
    ]
  },
  {
    id: "cs-302",
    code: "CSE3002",
    name: "데이터베이스 시스템",
    major: "컴퓨터공학과",
    category: "전공선택",
    grade: 3,
    credits: 3,
    professor: "정수진 교수",
    description: "관계형 데이터베이스 모델 구조 및 SQL 질의어 설계와 실습을 비롯하여, 인덱싱 최적화, 트랜잭션 무결성, 정규화 이론을 포괄적으로 고찰합니다.",
    timeSlots: [
      { day: "월", startPeriod: 3, endPeriod: 3, startTime: "12:00", endTime: "13:15" },
      { day: "수", startPeriod: 3, endPeriod: 3, startTime: "12:00", endTime: "13:15" }
    ]
  },
  {
    id: "cs-303",
    code: "CSE3003",
    name: "인공지능과 머신러닝",
    major: "컴퓨터공학과",
    category: "전공선택",
    grade: 3,
    credits: 3,
    professor: "AI 전임교수단",
    description: "지도학습, 비지도학습, 선형 회귀, 의사결정 트리 및 기본 신경망 레이어 모델의 수학적 근거와 Python 라이브러리 연계 개발 구조를 확립합니다.",
    timeSlots: [
      { day: "화", startPeriod: 3, endPeriod: 3, startTime: "12:00", endTime: "13:15" },
      { day: "목", startPeriod: 3, endPeriod: 3, startTime: "12:00", endTime: "13:15" }
    ]
  },
  {
    id: "cs-304",
    code: "CSE3004",
    name: "운영체제 시스템 실전",
    major: "컴퓨터공학과",
    category: "전공선택",
    grade: 3,
    credits: 3,
    professor: "박동근 교수",
    description: "프로세스와 스레드 컨텍스트 스위칭, 동기화 록킹(Mutex/Semaphore), 데드락 회피, 메모리 페이징 및 가상 파일 시스템 메커니즘을 상세히 다룹니다.",
    timeSlots: [
      { day: "금", startPeriod: 1, endPeriod: 2, startTime: "09:00", endTime: "12:00" }
    ]
  },
  {
    id: "cs-401",
    code: "CSE4001",
    name: "컴퓨터공학 종합설계 (캡스톤)",
    major: "컴퓨터공학과",
    category: "전공필수",
    grade: 4,
    credits: 3,
    professor: "최성진 교수",
    description: "재학 기간에 함양한 공학 지식을 바탕으로 제품 기획, 아키텍처 설계, 구현, 검증에 이르는 종합 프로젝트 프로덕트를 소그룹 단위로 제작합니다.",
    timeSlots: [
      { day: "화", startPeriod: 5, endPeriod: 5, startTime: "15:00", endTime: "16:15" },
      { day: "목", startPeriod: 5, endPeriod: 5, startTime: "15:00", endTime: "16:15" }
    ]
  },
  {
    id: "cs-402",
    code: "CSE4002",
    name: "클라우드 컴퓨팅 및 DevOps",
    major: "컴퓨터공학과",
    category: "전공선택",
    grade: 4,
    credits: 3,
    professor: "윤호중 교수",
    description: "AWS/GCP, Docker 컨테이너 가상화, Kubernetes 엔진 오케스트레이션 및 CI/CD 파이프라인 자동화 아키텍처 패러다임을 설계합니다.",
    timeSlots: [
      { day: "월", startPeriod: 5, endPeriod: 5, startTime: "15:00", endTime: "16:15" },
      { day: "수", startPeriod: 5, endPeriod: 5, startTime: "15:00", endTime: "16:15" }
    ]
  },
  {
    id: "cs-403",
    code: "CSE4003",
    name: "소프트웨어 아키텍처 패턴",
    major: "컴퓨터공학과",
    category: "전공선택",
    grade: 4,
    credits: 3,
    professor: "이지은 교수",
    description: "MSA(마이크로서비스 아키텍처), DDD, 이벤트 소싱 이론을 탐구하고 고가용성 대규모 트래픽 분산 처리를 위한 설계 전법을 트레이닝합니다.",
    timeSlots: [
      { day: "금", startPeriod: 3, endPeriod: 4, startTime: "12:00", endTime: "15:00" }
    ]
  },

  // ==========================================
  // 경영학과 (Business Administration)
  // ==========================================
  {
    id: "bus-101",
    code: "BUS1001",
    name: "경영학원론 및 트렌드",
    major: "경영학과",
    category: "전공필수",
    grade: 1,
    credits: 3,
    professor: "정성민 교수",
    description: "현대 기업 경영의 4대 기능인 계획, 조직, 지휘, 통제를 근간으로 전방위 기업 환경과 ESG 글로벌 스탠다드를 리뷰합니다.",
    timeSlots: [
      { day: "화", startPeriod: 1, endPeriod: 1, startTime: "09:00", endTime: "10:15" },
      { day: "목", startPeriod: 1, endPeriod: 1, startTime: "09:00", endTime: "10:15" }
    ]
  },
  {
    id: "bus-102",
    code: "BUS1002",
    name: "경제학개론",
    major: "경영학과",
    category: "전공선택",
    grade: 1,
    credits: 3,
    professor: "오형준 교수",
    description: "미시경제학과 거시경제학의 기초 작동 원리를 수치화 및 그래프로 학습하고 시장 독과점, 물가 불안과 실업, 통화 정책을 검토합니다.",
    timeSlots: [
      { day: "월", startPeriod: 2, endPeriod: 2, startTime: "10:30", endTime: "11:45" },
      { day: "수", startPeriod: 2, endPeriod: 2, startTime: "10:30", endTime: "11:45" }
    ]
  },
  {
    id: "bus-201",
    code: "BUS2001",
    name: "마케팅원론",
    major: "경영학과",
    category: "전공필수",
    grade: 2,
    credits: 3,
    professor: "임소현 교수",
    description: "STP(시장세분화, 타겟 분석, 포지셔닝) 및 4P 믹스를 바탕으로 디지털 마케팅 터치포인트, 고객여정지도를 직접 기획하고 워크숍 활동을 수행합니다.",
    timeSlots: [
      { day: "화", startPeriod: 3, endPeriod: 3, startTime: "12:00", endTime: "13:15" },
      { day: "목", startPeriod: 3, endPeriod: 3, startTime: "12:00", endTime: "13:15" }
    ]
  },
  {
    id: "bus-202",
    code: "BUS2002",
    name: "재무회계의 이해",
    major: "경영학과",
    category: "전공필수",
    grade: 2,
    credits: 3,
    professor: "서태수 교수",
    description: "복식부기의 원리, 재무상태표 및 손익계산서 시트를 계상하고 읽는 정량 회계 분석 기법을 터득합니다.",
    timeSlots: [
      { day: "월", startPeriod: 4, endPeriod: 4, startTime: "13:30", endTime: "14:45" },
      { day: "수", startPeriod: 4, endPeriod: 4, startTime: "13:30", endTime: "14:45" }
    ]
  },
  {
    id: "bus-203",
    code: "BUS2003",
    name: "조직행동론",
    major: "경영학과",
    category: "전공선택",
    grade: 2,
    credits: 3,
    professor: "정성민 교수",
    description: "조직 내 개인 및 소집단의 행동 양태, 동기부여 기법, 리더십 스타일과 상호작용 의사결정 프로세스를 심도있게 진술합니다.",
    timeSlots: [
      { day: "화", startPeriod: 2, endPeriod: 2, startTime: "10:30", endTime: "11:45" },
      { day: "목", startPeriod: 2, endPeriod: 2, startTime: "10:30", endTime: "11:45" }
    ]
  },
  {
    id: "bus-301",
    code: "BUS3001",
    name: "재무관리",
    major: "경영학과",
    category: "전공필수",
    grade: 3,
    credits: 3,
    professor: "송지훈 교수",
    description: "화폐의 시간가치(TVM), 미래 현금흐름 할인법(DCF), 주식 및 채권의 가치평가 및 최적 자본구조 구축 전략을 실증 분석합니다.",
    prerequisite: "재무회계의 이해",
    timeSlots: [
      { day: "월", startPeriod: 1, endPeriod: 1, startTime: "09:00", endTime: "10:15" },
      { day: "수", startPeriod: 1, endPeriod: 1, startTime: "09:00", endTime: "10:15" }
    ]
  },
  {
    id: "bus-302",
    code: "BUS3002",
    name: "비즈니스 데이터 애널리틱스",
    major: "경영학과",
    category: "전공선택",
    grade: 3,
    credits: 3,
    professor: "김진호 교수",
    description: "경영 성과 및 고객 코호트 데이터를 데이터 통계 프로그램(Python, R 등)을 통해 처리하고 예측 마케팅 액션을 입안합니다.",
    timeSlots: [
      { day: "화", startPeriod: 4, endPeriod: 4, startTime: "13:30", endTime: "14:45" },
      { day: "목", startPeriod: 4, endPeriod: 4, startTime: "13:30", endTime: "14:45" }
    ]
  },
  {
    id: "bus-303",
    code: "BUS3003",
    name: "생산운영관리",
    major: "경영학과",
    category: "전공선택",
    grade: 3,
    credits: 3,
    professor: "윤창근 교수",
    description: "제조업 및 서비스 산업의 공급망 관리(SCM), 재고 관리 통제, 린(Lean) 프로세스 관리 및 품질 관리를 정량 공정화합니다.",
    timeSlots: [
      { day: "금", startPeriod: 1, endPeriod: 2, startTime: "09:00", endTime: "12:00" }
    ]
  },
  {
    id: "bus-401",
    code: "BUS4001",
    name: "경영전략과 글로벌 기업가정신",
    major: "경영학과",
    category: "전공필수",
    grade: 4,
    credits: 3,
    professor: "서태수 교수",
    description: "SWOT 분석, Porter 5 Forces, 차별화 및 원가우위 전략을 정합하고 기업 구조조정과 실제 인수합병(M&A) 케이스를 스터디합니다.",
    timeSlots: [
      { day: "화", startPeriod: 5, endPeriod: 5, startTime: "15:00", endTime: "16:15" },
      { day: "목", startPeriod: 5, endPeriod: 5, startTime: "15:00", endTime: "16:15" }
    ]
  },
  {
    id: "bus-402",
    code: "BUS4002",
    name: "인공지능과 비즈니스 혁신",
    major: "경영학과",
    category: "전공선택",
    grade: 4,
    credits: 3,
    professor: "김진호 교수",
    description: "생성형 AI 발전과 테크 플랫폼 생태계의 비즈니스 연계를 학습하고, AI 에어전트를 활용한 신사업 포트폴리오를 발굴합니다.",
    timeSlots: [
      { day: "월", startPeriod: 5, endPeriod: 5, startTime: "15:00", endTime: "16:15" },
      { day: "수", startPeriod: 5, endPeriod: 5, startTime: "15:00", endTime: "16:15" }
    ]
  },

  // ==========================================
  // 미디어커뮤니케이션학과 (Media & Communication)
  // ==========================================
  {
    id: "med-101",
    code: "MED1001",
    name: "디지털 미디어와 사회",
    major: "미디어커뮤니케이션학과",
    category: "전공필수",
    grade: 1,
    credits: 3,
    professor: "설현우 교수",
    description: "미디어 역사와 더불어 알고리즘 필터버블, 프레이밍 효과, 플랫폼 노동 등 다각적 사회적 현상들을 비판적으로 고찰합니다.",
    timeSlots: [
      { day: "월", startPeriod: 1, endPeriod: 1, startTime: "09:00", endTime: "10:15" },
      { day: "수", startPeriod: 1, endPeriod: 1, startTime: "09:00", endTime: "10:15" }
    ]
  },
  {
    id: "med-102",
    code: "MED1002",
    name: "매스커뮤니케이션 효과 이론",
    major: "미디어커뮤니케이션학과",
    category: "전공선택",
    grade: 1,
    credits: 3,
    professor: "고민서 교수",
    description: "탄환 이론, 의제설정 효과, 점화 효과, 배양이론 등 오랜 기간 축적된 핵심 미디어 수용 효과 이론의 근간을 정제 학습합니다.",
    timeSlots: [
      { day: "화", startPeriod: 3, endPeriod: 3, startTime: "12:00", endTime: "13:15" },
      { day: "목", startPeriod: 3, endPeriod: 3, startTime: "12:00", endTime: "13:15" }
    ]
  },
  {
    id: "med-201",
    code: "MED2001",
    name: "저널리즘의 이해와 글쓰기",
    major: "미디어커뮤니케이션학과",
    category: "전공필수",
    grade: 2,
    credits: 3,
    professor: "송경문 교수",
    description: "뉴스 가치 판별법, 취재 기법 및 스트레이트 기사 배치 작성을 실습하고 저널리즘 윤리와 팩트체크 기법을 터득합니다.",
    timeSlots: [
      { day: "화", startPeriod: 2, endPeriod: 2, startTime: "10:30", endTime: "11:45" },
      { day: "목", startPeriod: 2, endPeriod: 2, startTime: "10:30", endTime: "11:45" }
    ]
  },
  {
    id: "med-202",
    code: "MED2002",
    name: "비디오 콘텐츠 크리에이션",
    major: "미디어커뮤니케이션학과",
    category: "전공선택",
    grade: 2,
    credits: 3,
    professor: "유재욱 교수",
    description: "카메라 앵글 및 조명, 영상 편집 툴(Premiere 등) 실습 과정을 통해 기획안 구성부터 숏폼 연출 포트폴리오를 현업 방식으로 제작합니다.",
    timeSlots: [
      { day: "월", startPeriod: 4, endPeriod: 4, startTime: "13:30", endTime: "14:45" },
      { day: "수", startPeriod: 4, endPeriod: 4, startTime: "13:30", endTime: "14:45" }
    ]
  },
  {
    id: "med-301",
    code: "MED3001",
    name: "뉴미디어 스토리텔링 기획",
    major: "미디어커뮤니케이션학과",
    category: "전공필수",
    grade: 3,
    credits: 3,
    professor: "이현주 교수",
    description: "인터랙티브 웹 다큐멘터리, 트랜스미디어, 메타버스 가상 공간 포토폴리오 등 미디어가 덧씌워진 다변화된 환경에 맞는 시나리오와 기획을 입안합니다.",
    timeSlots: [
      { day: "화", startPeriod: 4, endPeriod: 4, startTime: "13:30", endTime: "14:45" },
      { day: "목", startPeriod: 4, endPeriod: 4, startTime: "13:30", endTime: "14:45" }
    ]
  },
  {
    id: "med-302",
    code: "MED3002",
    name: "광고PR 커뮤니케이션 전략",
    major: "미디어커뮤니케이션학과",
    category: "전공선택",
    grade: 3,
    credits: 3,
    professor: "고민서 교수",
    description: "ATL/BTL 통합 마케팅 커뮤니케이션(IMC), 모바일 바이럴 PR 전략 및 가짜 뉴스 이슈 위기관리 콤비네이션을 케이스 중심 학습합니다.",
    timeSlots: [
      { day: "월", startPeriod: 2, endPeriod: 2, startTime: "10:30", endTime: "11:45" },
      { day: "수", startPeriod: 2, endPeriod: 2, startTime: "10:30", endTime: "11:45" }
    ]
  },
  {
    id: "med-303",
    code: "MED3003",
    name: "방송 미디어 산업 컨설팅",
    major: "미디어커뮤니케이션학과",
    category: "전공선택",
    grade: 3,
    credits: 3,
    professor: "설현우 교수",
    description: "OTT 시장 변화, 넷플릭스 수입 모델 분석, 다중 채널 네트워크(MCN) 산업 흐름 및 지식재산권(IP) 확장 트렌드를 해독합니다.",
    timeSlots: [
      { day: "금", startPeriod: 1, endPeriod: 2, startTime: "09:00", endTime: "12:00" }
    ]
  },
  {
    id: "med-401",
    code: "MED4001",
    name: "미디어 프로젝트 기획 (종합설계)",
    major: "미디어커뮤니케이션학과",
    category: "전공필수",
    grade: 4,
    credits: 3,
    professor: "이현주 교수",
    description: "한 학기 동안 미디어를 기반으로 다큐멘터리 제작, 미디어 캠페인 런칭, 또는 혁신 모바일 저널 제작팀 활동 중 택일하여 고도화된 졸업작을 제작합니다.",
    timeSlots: [
      { day: "화", startPeriod: 5, endPeriod: 5, startTime: "15:00", endTime: "16:15" },
      { day: "목", startPeriod: 5, endPeriod: 5, startTime: "15:00", endTime: "16:15" }
    ]
  },

  // ==========================================
  // 고정 교양 과목 (General Education - Liberal Arts & Basics)
  // ==========================================
  {
    id: "gen-101",
    code: "GEN1001",
    name: "대학 영어 및 학술적 글쓰기",
    major: "공통",
    category: "교양필수",
    grade: 1,
    credits: 2,
    professor: "Elizabeth Smith 교수",
    description: "영문 에세이 구조 논증 설계법, 아카데믹 표현법과 정확한 학술 논증 발표법을 반복 트레이닝합니다.",
    timeSlots: [
      { day: "월", startPeriod: 3, endPeriod: 3, startTime: "12:00", endTime: "13:15" },
      { day: "수", startPeriod: 3, endPeriod: 3, startTime: "12:00", endTime: "13:15" }
    ]
  },
  {
    id: "gen-102",
    code: "GEN1002",
    name: "논해석적 비판적 사고와 질문",
    major: "공통",
    category: "교양필수",
    grade: 1,
    credits: 2,
    professor: "안치원 교수",
    description: "논리와 오류의 판정법, 인류 역사 유물의 텍스트 독해를 바탕으로 사유를 심층 증명하는 글을 씁니다.",
    timeSlots: [
      { day: "화", startPeriod: 5, endPeriod: 5, startTime: "15:00", endTime: "16:15" },
      { day: "목", startPeriod: 5, endPeriod: 5, startTime: "15:00", endTime: "16:15" }
    ]
  },
  {
    id: "gen-103",
    code: "GEN1003",
    name: "대학생을 위한 공학수학 기초",
    major: "공통",
    category: "교양선택",
    grade: 1,
    credits: 3,
    professor: "백경민 교수",
    description: "행렬 이론, 벡터 공간, 기초 미분방정식을 컴퓨터 응용 실습과 함께 익혀 기초 논리를 다집니다.",
    timeSlots: [
      { day: "금", startPeriod: 2, endPeriod: 3, startTime: "10:30", endTime: "13:30" }
    ]
  },
  {
    id: "gen-201",
    code: "GEN2001",
    name: "세계 문명사 속의 예술 기행",
    major: "공통",
    category: "교양선택",
    grade: 2,
    credits: 3,
    professor: "정해인 교수",
    description: "그리스 로마 시대부터 현대 초현실주의 예술 화풍까지의 세계 문명사 흐름 속에서 다변화된 시각 문화를 조명합니다.",
    timeSlots: [
      { day: "금", startPeriod: 1, endPeriod: 2, startTime: "09:00", endTime: "12:00" }
    ]
  },
  {
    id: "gen-202",
    code: "GEN2002",
    name: "현대 기술과 지식재산권 특허",
    major: "공통",
    category: "교양선택",
    grade: 2,
    credits: 3,
    professor: "백경민 교수",
    description: "특허 빅데이터 분석 기법과 법률(컴퓨터, 미디어, 특허 가치 평가 등)적 지식을 종합적으로 연구하여 기획서 특허출원안을 입안합니다.",
    timeSlots: [
      { day: "화", startPeriod: 1, endPeriod: 1, startTime: "09:00", endTime: "10:15" },
      { day: "목", startPeriod: 1, endPeriod: 1, startTime: "09:00", endTime: "10:15" }
    ]
  },
  {
    id: "gen-301",
    code: "GEN3001",
    name: "디지털 헬스케어와 미래 의학",
    major: "공통",
    category: "교양선택",
    grade: 3,
    credits: 3,
    professor: "황정호 교수",
    description: "스마트 웨어러블 디바이스, 의료 인공지능, 빅데이터, 유전체 해독을 통해 변화되는 초근접 일상 의료 패러다임을 통섭적으로 논합니다.",
    timeSlots: [
      { day: "월", startPeriod: 3, endPeriod: 3, startTime: "12:00", endTime: "13:15" },
      { day: "수", startPeriod: 3, endPeriod: 3, startTime: "12:00", endTime: "13:15" }
    ]
  },
  {
    id: "gen-302",
    code: "GEN3002",
    name: "환경 생태학과 기후위기 미래대응",
    major: "공통",
    category: "교양선택",
    grade: 3,
    credits: 3,
    professor: "장성만 교수",
    description: "지구 온난화와 생물 다양성 고갈 등 복합 재해적 기후 문제를 데이터로 학습하고, 이를 극복할 기술 혁신 방향을 토론합니다.",
    timeSlots: [
      { day: "화", startPeriod: 4, endPeriod: 4, startTime: "13:30", endTime: "14:45" },
      { day: "목", startPeriod: 4, endPeriod: 4, startTime: "13:30", endTime: "14:45" }
    ]
  }
];
