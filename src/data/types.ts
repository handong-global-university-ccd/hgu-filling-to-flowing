export const FIELDS = [
  { key: "communication", label: "Communication Design", short: "Communication" },
  { key: "industrial", label: "Product & Industrial Design", short: "Product & Industrial" },
  { key: "service", label: "Service Design", short: "Service" },
  { key: "ux", label: "UX Design", short: "UX/UI" },
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
