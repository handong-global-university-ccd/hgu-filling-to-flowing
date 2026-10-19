/** Figma 홈 (2698:15669) 의 문구. 배열은 Figma 시안의 줄바꿈 그대로다 */

/**
 * 상단 키비주얼 — 받은 원본(hero.jpg, 2223×564)을 다시 압축하지 않고 그대로 쓴다. R2 로 올린다.
 * 화면 표시 폭이 1872 라 레티나에서 선명하려면 가로 3744px(2배) 원본이 필요하다.
 */
export const HOME_HERO = "/media/home/hero.jpg";

/**
 * 로고타입 등장 — 전시 소개(RevealLines)와 같은 값으로 한 줄씩: 1.4s power3.out, 줄 간격 0.12s.
 * FILLING → TO FLOWING → 말씀 첫 줄 → 둘째 줄이 한 흐름으로 이어진다 (HomeTitle · page.tsx)
 */
export const TITLE_REVEAL = { duration: 1.4, stagger: 0.12, rows: 2 } as const;
export const VERSE_DELAY = TITLE_REVEAL.rows * TITLE_REVEAL.stagger;

/** 로고타입 아래 말씀 */
export const HOME_VERSE = [
  "채우심으로 말미암아 그에게 하나님의 영을 채워주어,",
  "지혜와 총명과 지식과 온갖 기술을 갖추게 하겠다. (출 31:3)",
] as const;

/** 왼쪽 아래 전시 정보 — 시안 문구 그대로 (SITE.period·place 와 표기가 다르다) */
export const HOME_INFO = [
  { label: "Date", value: "2026.11.04 - 11.08" },
  { label: "Time", value: "09:00 AM - 07:00 PM" },
  { label: "Venue", value: "한동대학교 제네시스랩" },
] as const;

export const HOME_TITLE = "2026 한동대학교 | 콘텐츠융합디자인학부 졸업작품전";

export const HOME_INTRO = [
  "‘FILLING TO FLOWING’은 이처럼 하나님의 채우심이 우리 안에 머무르지 않고,",
  "지혜와 기술과 창조적 표현을 통해 세상으로 흘러나온다는 의미를 담고 있습니다.",
  "하나님께로부터 채움을 받은 기술자들이 하나님의 영감을 통해 성막을 건축하였듯이,",
  "이번 전시는 하나님께 받은 영감과 재능이 디자인이라는 언어를 통해 어떻게 나타나고",
  "흘러가는지를 보여줍니다. 우리가 받은 채우심이 곧 창조적 흐름으로 이어지고,",
  "그 흐름이 이곳을 찾는 이들에게 새로운 영감이 되기를 기대합니다.",
] as const;

/**
 * 모바일 홈 (2624:5445) 문구 — 배열은 시안 줄바꿈 그대로. 가운데 정렬 12/20
 */
export const HOME_MOBILE = {
  /** 세로 키비주얼 — 시안 그대로 좌우 반전해서 저장 (hero-mobile.webp, 1000×1328). R2 로 올린다 */
  hero: "/media/home/hero-mobile.webp",
  credit: ["2026", "Handong Global University", "Contents Convergence Design", "Degree Show"],
  date: ["2026. 11. 04", "- 11. 08"],
  verse: [
    "출애굽기 31:3",
    "채우심으로 말미암아 그에게 하나님의 영을 채워주어,",
    "지혜와 총명과 지식과 온갖 기술을 갖추게 하겠다.",
  ],
  intro: [
    "‘FILLING TO FLOWING’은 이처럼 하나님의 채우심이",
    "우리 안에 머무르지 않고, 지혜와 기술과 창조적 표현을 통해",
    "세상으로 흘러나온다는 의미를 담고 있습니다.",
    "하나님께로부터 채움을 받은 기술자들이 하나님의 영감을 통해 성막을",
    "건축하였듯이, 이번 전시는 하나님께 받은 영감과 재능이 디자인이라는",
    "언어를 통해 어떻게 나타나고 흘러가는지를 보여줍니다.",
    "\u00a0",
    "우리가 받은 채우심이 곧 창조적 흐름으로 이어지고,",
    "그 흐름이 이곳을 찾는 이들에게 새로운 영감이 되기를 기대합니다.",
  ],
} as const;
