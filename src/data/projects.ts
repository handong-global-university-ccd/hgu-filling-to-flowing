import type { FieldKey, Work } from "./types";

/**
 * Works 왼쪽 칸 — 분야 안의 전시(프로젝트) 목록. Figma Works (2564:9040 외 10개)
 *
 * 분야마다 팀 작품과 개인 작품이 서로 다른 전시로 나뉜다. 작품이 어느 전시에 속하는지는
 * Work.teamName 유무로 정한다 (team: true → 팀 작품, false → 개인 작품, undefined → 분야 전체).
 * 분야 안 순서는 Figma 왼쪽 칸 순서 그대로다.
 *
 * intro 는 문단 배열이고, 문단 안의 \n 은 Figma 시안의 줄바꿈이다 (데스크톱에서만 살린다).
 */
export type WorkProject = {
  key: string;
  field: FieldKey;
  /** 왼쪽 칸 이름 */
  label: string;
  team?: boolean;
  /** 본문 맨 위 전시 제목 */
  title?: string;
  advisor: string;
  intro: string[];
};

export const WORK_PROJECTS: WorkProject[] = [
  {
    key: "new-connection",
    field: "ax-product",
    label: "New Connection",
    team: true,
    title: "기업과 대학이 함께 빚어내는 미래",
    advisor: "최인욱",
    intro: [
      "새로운 미래는 하나의 시선만으로 완성되지 않는다.\n산업이 축적해온 기술과 경험, 그리고 익숙한 것을 새롭게 바라보는 대학의 시선이 만날 때 새로운 가능성이 시작된다.",
      "New Connection은 기업과 대학이 함께한 Collaborations를 통해 기술과 디자인, 산업과 교육이 만들어내는 새로운 시너지를 보여준다.\n서로 다른 전문 영역을 가진 세 개의 기업과 제품디자인을 공부하는 학생들이 팀을 이루어, 각 기업이 가진 기술과 경험을 새로운 관점에서 바라보고 이를 새로운 제품과 서비스로 발전시켰다.\n기업이 가진 현실의 기술과 산업적 경험 위에 학생들의 관찰과 상상, 실험적인 디자인이 더해지고, 서로 다른 생각은 대화와 협업을 통해 하나의 결과로 구체화된다. 이 과정에서 기술은 새로운 아이디어를 만나고, 디자인은 현실과 연결되며, 서로 다른 전문성은 이전에 없던 가능성을 만들어낸다.\n기업과 대학, 기술과 디자인, 경험과 상상이 서로 연결되며 각자의 영역을 넘어 함께 미래를 만들어가는 새로운 관계에 대한 이야기가 비로소 시작되는 것이다.\n사람들이 만나고, 생각이 연결되고, 그 관계 속에서 우리가 경험하지 않았던 새로운 미래가 만들어진다.",
    ],
  },
  {
    key: "new-domestic",
    field: "ax-product",
    label: "New Domestic",
    team: false,
    title: "AI와 함께사는 새로운 가정생활",
    advisor: "최인욱",
    intro: [
      "AI와 함께 살아가는 순간, 우리의 가정은 어떻게 달라질까?\n인공지능은 더 이상 화면 속에 갇혀있지 않다. 우리가 잠에서 깨어나는 순간부터 씻고, 자신을 가꾸고, 반려동물을 돌보고, 요리를 하고, 다시 잠드는 순간까지.\nAI는 점차 생활 깊숙이 들어와 우리의 행동과 습관을 이해하고, 필요한 순간에 먼저 반응하는 존재가 되어가고 있다.\n이제 우리는 바야흐로 AI와 같은 공간에서 생활하는 이전에 없었던 새로운 시대를 마주하고 있는 것이다.",
      "이번 전시는 16명의 디자이너가 각자의 시선으로 AI가 우리의 가장 사적인 공간인 ‘집’에 들어왔을 때 변화하게 될 생활의 모습을 제안한다. 몸과 마음의 건강을 살피고,\n반려동물을 돌보고, 휴식과 수면을 돕는 다양한 AI 제품들은 더 편리한 기능만을 이야기하지 않는다. 우리는 AI가 우리의 행동을 이해하고, 감정을 읽으며, 때로는\n먼저 필요한 것을 제안하는 존재가 되었을 때 인간과 제품의 관계가 어떻게 변화할지 질문한다. 기술은 점점 보이지 않게 되고, 이전에 겪어보지 못했던 새로운 경험이\n일상이 된다. AI와 인간이 함께 만들어가는 새로운 생활 풍경이 비로소 펼쳐지기 시작하는 것이다.",
    ],
  },
  // TODO: 커뮤니케이션 전시 제목·소개글 — 시안이 아직 "0000" / "글없음" 자리표시
  {
    key: "personal-project",
    field: "communication",
    label: "Personal Project",
    team: false,
    advisor: "이진구",
    intro: [],
  },
  {
    key: "local-innovation",
    field: "communication",
    label: "Local Innovation",
    team: true,
    advisor: "이진구",
    intro: [],
  },
  // TODO: 서비스 소개글 — 시안이 아직 "글없음" 자리표시
  {
    key: "service-design",
    field: "service",
    label: "Service Design",
    title: "무제",
    advisor: "이중섭, 이재선",
    intro: [],
  },
  // TODO: AIDV 소개글 — 시안에는 AX 소개글이 임시로 들어가 있다
  {
    key: "ai-defined-vehicle",
    field: "ux-product",
    label: "AI-Defined Vehicle",
    team: true,
    title: "AI-Defined Vehicle 기반 모빌리티 UX",
    advisor: "이은종",
    intro: [],
  },
  {
    key: "life-up-design",
    field: "ux-product",
    label: "Life Up Design",
    team: false,
    title: "디자인으로 확장하는 삶의 새로운 가능성",
    advisor: "이정훈",
    intro: [
      "이번 전시의 12개 디자인 컨셉은 일상의 불편함과 생활 속 해결 과제, 특정한 사람이나 활동에 따르는 어려움에서 출발한다.\n익숙하다는 이유로 지나쳤거나 당연하게 받아들였던 경험을 들여다보고, 그 경험을 대하는 다른 관점의 발견을 통해 혁신할 수 있는 새로운 접근을 모색한다.\n디자인 작업의 관점에서 삶은 연속된 경험의 흐름이다. 하나의 목표를 달성하는 과정에는 여러 행동과 상황, 사물과 사람이 연결되어 있다.\n우리는 그 목표에 이르기 위해 필요한 삶의 구간을 살펴보고, 경험의 흐름을 새롭게 구성하는 서비스 컨셉을 제안한다.\n그리고 이를 실현하는 제품과 앱 등 다양한 요소를 서로의 관계와 맥락을 고려하며 통합적으로 구체화한다.",
      "‘Life up Design’이 제안하는 것은 새로운 서비스와 제품과 함께 달라질 삶의 모습이다.\n사람을 향한 관심과 삶에 대한 탐구를 통해, 디자인이 만들어 갈 변화의 가능성을 보여 주고자 한다.",
    ],
  },
  {
    key: "ux-space-design",
    field: "ux-space",
    label: "UX Space Design",
    title: "리더스 타운 UX:SPACE",
    advisor: "손성찬",
    intro: [
      "리더스타운 UX: SPACE 프로젝트는 천마지 리더스타운을 대상으로, 건축과 공간을 단순한 물리적 환경이 아닌 ‘사용자의 경험이 만들어지는 하나의 브랜드’로 바라보는 UX 기반 공간 브랜딩 프로젝트이다. 학생들은 공간을 사용하는 사람의 일상과 행동, 관계의 방식을 살펴보고, 그 안에서 필요한 경험과 새로운 가능성을 발견한다.",
      "주거 공간에서 시작해 라운지, 산책로, 커뮤니티 공간, 다양한 공유 공간에 이르기까지 사람들이 자연스럽게 만나고 머물며 때로는 연결되고 때로는 혼자 있을 수 있는 경험을 공간으로 구체화한다. 공간의 기능과 동선뿐 아니라 빛, 재료, 가구, 사인, 그래픽, 서비스와 운영 방식까지 하나의 사용자 경험으로 연결하여 리더스타운만의 공간 정체성을 만들어간다.\n이 과정에서 공간은 단순히 ‘보이는 디자인’에서 그치지 않고 사람의 행동을 유도하고 관계를 만들어내는 경험의 플랫폼이 된다. 학생들은 사용자의 시선에서 공간을 다시 해석하고, 작은 행동과 감정의 변화가 공간의 구성과 분위기로 이어지는 과정을 실험한다.",
    ],
  },
];

export const getProjects = (field: FieldKey) => WORK_PROJECTS.filter((p) => p.field === field);

export const inProject = (work: Work, project: WorkProject) =>
  work.field === project.field && (project.team === undefined || Boolean(work.teamName) === project.team);
