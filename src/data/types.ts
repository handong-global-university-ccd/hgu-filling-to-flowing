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

export type Work = {
  slug: string;
  field: FieldKey;
  title: string; // 한글 타이틀
  subtitle?: string;
  description: string;
  /** 팀 작품의 팀 이름. 개인 작품은 없음 (Figma 2243:14655~) */
  teamName?: string;
  designerSlugs: string[];
  /** 호버 시 A↔B 교차 */
  thumbnails: [string, string];
  /** 상세 좌측 타이틀 위 작품 사진 (338×225). 없으면 thumbnails[0] 을 쓴다 */
  photo?: string;
  /** 상세 우측 설명 이미지 — PDF를 페이지별 webp로 변환한 경로들 */
  pages: string[];
};

export type Designer = {
  slug: string;
  nameKo: string;
  nameEn: string;
  fields: FieldKey[];
  email?: string;
  instagram?: string;
  profile: string; // 컬러 프로필
  profileMono?: string; // 흑백 리스트용 (없으면 CSS grayscale)
  workSlugs: string[];
};
