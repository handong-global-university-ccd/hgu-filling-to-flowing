import type { FieldKey, Work } from "./types";

// TODO: 더미 데이터. 실제 작품이 들어오면 교체하고 이미지 경로를 /media/works/<slug>/... 로 바꿀 것
export const WORKS: Work[] = [
  {
    slug: "generative-future",
    field: "communication",
    title: "제너레이티브 퓨처: 가능성 위의 우리들",
    subtitle: "가능성을 재료로 삼는 태도에 관하여",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    designerSlugs: ["jiwon-kang", "yerin-ahn"],
    thumbnails: ["/placeholder/thumb-01a.svg", "/placeholder/thumb-01b.svg"],
    pages: ["/placeholder/thumb-02a.svg", "/placeholder/thumb-03a.svg", "/placeholder/thumb-04a.svg"],
  },
  {
    slug: "quiet-signal",
    field: "communication",
    title: "조용한 신호",
    subtitle: "일상의 미세한 신호를 수집하는 기록",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    designerSlugs: ["hana-kim"],
    thumbnails: ["/placeholder/thumb-02a.svg", "/placeholder/thumb-02b.svg"],
    pages: ["/placeholder/thumb-03a.svg", "/placeholder/thumb-04a.svg", "/placeholder/thumb-05a.svg"],
  },
  {
    slug: "paper-weather",
    field: "communication",
    title: "종이 날씨",
    subtitle: "날씨를 인쇄물의 질감으로 번역한 실험",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    designerSlugs: ["seoyeon-kim"],
    thumbnails: ["/placeholder/thumb-03a.svg", "/placeholder/thumb-03b.svg"],
    pages: ["/placeholder/thumb-04a.svg", "/placeholder/thumb-05a.svg", "/placeholder/thumb-06a.svg"],
  },
  {
    slug: "letters-unsent",
    field: "communication",
    title: "부치지 못한 편지",
    subtitle: "보내지 못한 말들을 위한 타이포그래피",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    designerSlugs: ["doyun-nam"],
    thumbnails: ["/placeholder/thumb-04a.svg", "/placeholder/thumb-04b.svg"],
    pages: ["/placeholder/thumb-05a.svg", "/placeholder/thumb-06a.svg", "/placeholder/thumb-07a.svg"],
  },
  {
    slug: "second-hand",
    field: "industrial",
    title: "세컨드 핸드",
    subtitle: "오래 쓰기 위한 생활 도구 다시 설계하기",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    designerSlugs: ["eunbi-moon"],
    thumbnails: ["/placeholder/thumb-05a.svg", "/placeholder/thumb-05b.svg"],
    pages: ["/placeholder/thumb-06a.svg", "/placeholder/thumb-07a.svg", "/placeholder/thumb-08a.svg"],
  },
  {
    slug: "fold-and-carry",
    field: "industrial",
    title: "접고 나르다",
    subtitle: "도시 이동을 위한 접이식 운반 구조",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    designerSlugs: ["minseo-byun", "haeun-jang"],
    thumbnails: ["/placeholder/thumb-06a.svg", "/placeholder/thumb-06b.svg"],
    pages: ["/placeholder/thumb-07a.svg", "/placeholder/thumb-08a.svg", "/placeholder/thumb-01a.svg"],
  },
  {
    slug: "warm-grip",
    field: "industrial",
    title: "웜 그립",
    subtitle: "손의 온도를 기억하는 주방 도구",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    designerSlugs: ["jihu-seo"],
    thumbnails: ["/placeholder/thumb-07a.svg", "/placeholder/thumb-07b.svg"],
    pages: ["/placeholder/thumb-08a.svg", "/placeholder/thumb-01a.svg", "/placeholder/thumb-02a.svg"],
  },
  {
    slug: "light-frame",
    field: "industrial",
    title: "라이트 프레임",
    subtitle: "빛을 조절하는 모듈형 조명",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    designerSlugs: ["chaewon-song"],
    thumbnails: ["/placeholder/thumb-08a.svg", "/placeholder/thumb-08b.svg"],
    pages: ["/placeholder/thumb-01a.svg", "/placeholder/thumb-02a.svg", "/placeholder/thumb-03a.svg"],
  },
  {
    slug: "slow-counter",
    field: "service",
    title: "느린 창구",
    subtitle: "기다림을 설계하는 공공 서비스",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    designerSlugs: ["yerin-ahn"],
    thumbnails: ["/placeholder/thumb-01a.svg", "/placeholder/thumb-01b.svg"],
    pages: ["/placeholder/thumb-02a.svg", "/placeholder/thumb-03a.svg", "/placeholder/thumb-04a.svg"],
  },
  {
    slug: "care-route",
    field: "service",
    title: "케어 루트",
    subtitle: "돌봄 이동을 위한 동선 서비스",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    designerSlugs: ["junho-oh"],
    thumbnails: ["/placeholder/thumb-02a.svg", "/placeholder/thumb-02b.svg"],
    pages: ["/placeholder/thumb-03a.svg", "/placeholder/thumb-04a.svg", "/placeholder/thumb-05a.svg"],
  },
  {
    slug: "market-thread",
    field: "service",
    title: "마켓 스레드",
    subtitle: "전통시장 상인을 잇는 연결망",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    designerSlugs: ["ssuyeon-yu", "seoyeon-kim"],
    thumbnails: ["/placeholder/thumb-03a.svg", "/placeholder/thumb-03b.svg"],
    pages: ["/placeholder/thumb-04a.svg", "/placeholder/thumb-05a.svg", "/placeholder/thumb-06a.svg"],
  },
  {
    slug: "open-shelf",
    field: "service",
    title: "오픈 셸프",
    subtitle: "동네 책장 공유 서비스",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    designerSlugs: ["garam-lee"],
    thumbnails: ["/placeholder/thumb-04a.svg", "/placeholder/thumb-04b.svg"],
    pages: ["/placeholder/thumb-05a.svg", "/placeholder/thumb-06a.svg", "/placeholder/thumb-07a.svg"],
  },
  {
    slug: "tide-reader",
    field: "ux",
    title: "타이드 리더",
    subtitle: "조수 데이터를 읽는 인터페이스",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    designerSlugs: ["taemin-lim"],
    thumbnails: ["/placeholder/thumb-05a.svg", "/placeholder/thumb-05b.svg"],
    pages: ["/placeholder/thumb-06a.svg", "/placeholder/thumb-07a.svg", "/placeholder/thumb-08a.svg"],
  },
  {
    slug: "memory-lane",
    field: "ux",
    title: "메모리 레인",
    subtitle: "기억을 되짚는 아카이브 앱",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    designerSlugs: ["haeun-jang"],
    thumbnails: ["/placeholder/thumb-06a.svg", "/placeholder/thumb-06b.svg"],
    pages: ["/placeholder/thumb-07a.svg", "/placeholder/thumb-08a.svg", "/placeholder/thumb-01a.svg"],
  },
  {
    slug: "soft-switch",
    field: "ux",
    title: "소프트 스위치",
    subtitle: "전환을 부드럽게 만드는 인터랙션 연구",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    designerSlugs: ["nayun-jung"],
    thumbnails: ["/placeholder/thumb-07a.svg", "/placeholder/thumb-07b.svg"],
    pages: ["/placeholder/thumb-08a.svg", "/placeholder/thumb-01a.svg", "/placeholder/thumb-02a.svg"],
  },
  {
    slug: "first-step",
    field: "ux",
    title: "퍼스트 스텝",
    subtitle: "처음 사용자를 위한 온보딩 재설계",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    designerSlugs: ["siwoo-choi", "chaewon-song"],
    thumbnails: ["/placeholder/thumb-08a.svg", "/placeholder/thumb-08b.svg"],
    pages: ["/placeholder/thumb-01a.svg", "/placeholder/thumb-02a.svg", "/placeholder/thumb-03a.svg"],
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
