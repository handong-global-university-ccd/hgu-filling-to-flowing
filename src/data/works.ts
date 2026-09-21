import type { FieldKey, Work } from "./types";

// TODO: 실제 데이터로 교체 (디자이너 전달 스프레드시트 → JSON 변환 권장)
export const WORKS: Work[] = [
  {
    slug: "generative-future",
    field: "communication",
    title: "제너레이티브 퓨처: 가능성 위의 우리들",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다.",
    designerSlugs: ["minseo-byun"],
    thumbnails: ["/placeholder/thumb-a.svg", "/placeholder/thumb-b.svg"],
    pages: [],
  },
];

const byTitle = (a: Work, b: Work) => a.title.localeCompare(b.title, "ko");

/** Works 목록: 타이틀 가나다순 */
export const getWorks = (field?: FieldKey) => WORKS.filter((w) => !field || w.field === field).sort(byTitle);

export const getWork = (slug: string) => WORKS.find((w) => w.slug === slug);

/** 상세 하단 Others: 같은 분야에서 현재 작품 다음 순서부터 이어서 */
export function getOtherWorks(slug: string) {
  const current = getWork(slug);
  if (!current) return [];
  const list = getWorks(current.field);
  const i = list.findIndex((w) => w.slug === slug);
  return [...list.slice(i + 1), ...list.slice(0, i)];
}
