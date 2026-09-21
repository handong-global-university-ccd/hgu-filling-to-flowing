import type { Designer } from "./types";

// TODO: 실제 데이터로 교체
export const DESIGNERS: Designer[] = [
  {
    slug: "minseo-byun",
    nameKo: "변민서",
    nameEn: "Minseo Byun",
    fields: ["communication"],
    email: "example@handong.ac.kr",
    profile: "/placeholder/profile.svg",
    workSlugs: ["generative-future"],
  },
];

/** Designers 목록: 이름 가나다순 */
export const getDesigners = () => [...DESIGNERS].sort((a, b) => a.nameKo.localeCompare(b.nameKo, "ko"));

export const getDesigner = (slug: string) => DESIGNERS.find((d) => d.slug === slug);
