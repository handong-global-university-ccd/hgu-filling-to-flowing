/**
 * 분야 5개 — Figma 홈화면 썸네일 (2573:21293) 순서.
 * intro 의 줄바꿈(\n)은 Figma 시안의 줄바꿈 그대로다 (화면에서 whitespace-pre-line 으로 살린다).
 */
export const FIELDS = [
  {
    key: "ax-product",
    label: "AX Product Design",
    intro:
      "기술의 발달로 인해 우리 일상과 사회 가운데 많은 변화가 있습니다. 기술이 개인과 사회에 전달되는 중요 수단으로서 제품 시스템이 \n근 미래사회에 어떤 역할을 해야 할 지 예측하고 제시합니다.",
  },
  {
    key: "communication",
    label: "Communication Design",
    intro:
      "포스터, 책, 영상, 광고, 브랜드 등 다양한 시각 매체를 활용해 \n사람들이 정보를 쉽고 명확하게 인지하도록 소통하는 방법을 디자인합니다.",
  },
  {
    key: "service",
    label: "Service Design",
    intro:
      "서비스의 사용자와 제공자의 입장을 살펴 문제를 발견하고, \n아직 해결되지 않은 문제를 찾아 새로운 서비스 방식을 기획하고 설계합니다.",
  },
  {
    key: "ux-product",
    label: "UX Product Design",
    intro:
      "사용자의 행동과 맥락을 바탕으로 제품과 서비스에서 새로운 \n경험의 가능성을 발견하고, 이를 구체적인 사용 경험으로 설계합니다. \n기능과 정보 구조, 인터랙션을 체계적으로 구성하여 \n사용자와 제품·서비스가 관계 맺는 새로운 방식을 제안합니다.",
  },
  {
    key: "ux-space",
    label: "UX Space Design",
    intro:
      "사람과 공간의 관계를 이해해 새로운 사용자 경험을 발견하고, \n브랜드의 가치와 이야기가 공간 속 행동과 경험으로 이어지도록 공간의 흐름과 기능, 분위기를 기획하고 디자인합니다.",
  },
] as const;

export type FieldKey = (typeof FIELDS)[number]["key"];

/**
 * 홈 분야 아코디언의 소개 문구 — 시안(2625:5896) 줄바꿈 그대로, 한 줄씩.
 * 데스크톱 아코디언(FieldAccordion)·모바일 목록(FieldListMobile) 이 같이 쓴다.
 * 데스크톱 칸은 폭이 좁아서 FIELDS.intro(두 줄)를 그대로 쓰면 아무 데서나 줄이 꺾인다
 */
export const FIELD_INTRO_LINES: Record<FieldKey, string[]> = {
  "ax-product": [
    "기술의 발달로 인해 우리 일상과 사회 가운데 많은 변화가 있습니다.",
    "기술이 개인과 사회에 전달되는 중요 수단으로서 제품 시스템이",
    "근 미래사회에 어떤 역할을 해야 할 지 예측하고 제시합니다.",
  ],
  communication: [
    "포스터, 책, 영상, 광고, 브랜드 등 다양한 시각 매체를 활용해",
    "사람들이 정보를 쉽고 명확하게 인지하도록",
    "소통하는 방법을 디자인합니다.",
  ],
  service: [
    "서비스의 사용자와 제공자의 입장을 살펴 문제를 발견하고,",
    "아직 해결되지 않은 문제를 찾아",
    "새로운 서비스 방식을 기획하고 설계합니다.",
  ],
  "ux-product": [
    "사용자의 행동과 맥락을 바탕으로 제품과 서비스에서 새로운",
    "경험의 가능성을 발견합니다. 기능과 정보 구조, 인터랙션을 체계적으로",
    "구성하여 사용자와 제품·서비스가 관계 맺는 새로운 방식을 제안합니다.",
  ],
  "ux-space": [
    "사람과 공간의 관계를 이해해 새로운 사용자 경험을 발견하고,",
    "브랜드의 가치와 이야기가 공간 속 행동과 경험으로 이어지도록",
    "공간의 흐름과 기능, 분위기를 기획하고 디자인합니다.",
  ],
};

/**
 * 전공 2개 — Designers 탭 (Figma 1807:14949 "All / Product Design / Visual Design").
 * 시트의 시각·제품 탭 구분을 따른다 — 커뮤니케이션·서비스는 시각, AX·UX Product·UX Space 는 제품.
 */
export const MAJORS = [
  { key: "product", label: "Product Design", fields: ["ax-product", "ux-product", "ux-space"] },
  { key: "visual", label: "Visual Design", fields: ["communication", "service"] },
] as const satisfies readonly { key: string; label: string; fields: readonly FieldKey[] }[];

export type MajorKey = (typeof MAJORS)[number]["key"];

/** 분야 탭(Works) 또는 전공 탭(Designers) 에서 고른 값 */
export type FilterKey = FieldKey | MajorKey | "all";

export const isFieldKey = (v: string): v is FieldKey => FIELDS.some((f) => f.key === v);

/** 분야 목록이 고른 탭(분야·전공·All)에 들어가는지 */
export function matchesFilter(fieldKeys: readonly FieldKey[], key: FilterKey) {
  if (key === "all") return true;
  const major = MAJORS.find((m) => m.key === key);
  if (major) return fieldKeys.some((f) => (major.fields as readonly FieldKey[]).includes(f));
  return fieldKeys.includes(key as FieldKey);
}

export type Work = {
  slug: string;
  field: FieldKey;
  title: string; // 한글 타이틀 (상세 좌측 제목)
  /** Works 목록 카드의 작품명 — 시트 'work 메인 페이지' 열. 없으면 title */
  cardTitle?: string;
  subtitle?: string;
  description: string;
  /** 팀 작품의 팀 이름. 개인 작품은 없음 (Figma 2243:14655~) */
  teamName?: string;
  designerSlugs: string[];
  /** 호버 시 A↔B 교차 */
  thumbnails: [string, string];
  /** 상세 좌측 타이틀 위 작품 사진 (338×225). 없으면 thumbnails[0] 을 쓴다 */
  photo?: string;
  /** 상세 오른쪽 작업물 — 드라이브 '작품파일' 폴더의 번호 순서 (scripts/pull-works.mjs) */
  pages: WorkPage[];
};

export type WorkPage =
  | { type: "image"; src: string; width: number; height: number }
  | { type: "video"; src: string; poster: string; width: number; height: number }
  | { type: "youtube"; id: string }
  | { type: "link"; href: string };

export type Designer = {
  slug: string;
  nameKo: string;
  nameEn: string;
  fields: FieldKey[];
  email?: string;
  /** 인스타그램·링크드인·비핸스·포트폴리오 등 (시트 최대 5개). label 은 화면에 보이는 글자 */
  links?: { label: string; href: string }[];
  profile: string; // 컬러 프로필
  profileMono?: string; // 흑백 리스트용 (없으면 CSS grayscale)
  workSlugs: string[];
};
