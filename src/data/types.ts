export const FIELDS = [
  {
    key: "communication",
    label: "Communication Design",
    short: "Communication",
    /** Figma 1696:16987 분야 소개 */
    intro:
      "메시지와 정보를 쉽고 효과적으로 전달하는 디자인입니다. 포스터, 책, 영상, 광고, 브랜드 등 다양한 시각 매체를 활용해 사람들이 정보를 쉽고 명확하게 인지하도록 소통하는 방법을 디자인합니다.",
  },
  {
    key: "industrial",
    label: "Product & Industrial Design",
    short: "Product & Industrial",
    /** Figma 1696:16987 분야 소개 */
    intro:
      "제품의 쓰임과 구조를 바탕으로 알맞은 형태를 만들어가는 디자인입니다. 제품의 사용성, 크기, 소재, 구조와 생산 방식까지 함께 고려해 편리하고 아름다우며 실제로 만들 수 있는 제품을 설계합니다.",
  },
  {
    key: "service",
    label: "Service Design",
    short: "Service",
    /** Figma 1696:16987 분야 소개 */
    intro:
      "사람들의 숨은 필요를 발견해 새로운 서비스를 만드는 디자인입니다. 서비스의 사용자와 제공자의 입장을 함께 살펴 문제를 발견하고, 아직 해결되지 않은 문제를 찾아 새로운 서비스 방식을 기획하고 설계합니다.",
  },
  {
    key: "ux",
    label: "UX Design",
    short: "UX/UI",
    /** Figma 1696:16987 분야 소개 */
    intro:
      "제품 또는 서비스 사용 경험에서 발생하는 문제를 해결하고 더 나은 경험으로 설계하는 디자인입니다. 사용자가 불편함 없이 제품과 서비스를 이용할 수 있도록 화면의 구성과 다양한 환경의 구조를 설계하여 직관적이고 명확한 사용 경험을 만듭니다.",
  },
] as const;

export type FieldKey = (typeof FIELDS)[number]["key"];

export type Work = {
  slug: string;
  field: FieldKey;
  title: string; // 한글 타이틀
  subtitle?: string;
  description: string;
  designerSlugs: string[];
  /** 호버 시 A↔B 교차 */
  thumbnails: [string, string];
  teamPhoto?: string;
  /** PDF를 페이지별 webp로 변환한 경로들 */
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
