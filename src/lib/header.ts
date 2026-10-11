/**
 * 헤더 높이(px). 헤더가 fixed 라 본문(PageShell)이 같은 값만큼 내려와야 해서 한곳에 둔다.
 *
 * 데스크톱은 Figma 헤더 컴포넌트(1893:2320 / 1893:2360) 그대로,
 * 모바일(< 768px)은 Figma Mobile Grid(2365:20239) 기준 — 좌우 16, 로고 120 폭.
 *   단순 헤더   : 위 16 + 로고 38 + 아래 10                    = 64
 *   필터 헤더   : 위 16 + 로고 38 + 20 + 탭 26 + 16 + 검색 30 + 아래 20 = 166 → 펼침
 *                 위 16 + 탭 26 + 16 + 검색 30 + 아래 20               = 108 → 접힘
 *   아카이브    : 위 16 + 로고 38 + 20 + 탭 26 + 아래 20               = 120 → 펼침
 *                 위 16 + 탭 26 + 아래 20                              = 62  → 접힘
 */
export const HEADER_H = {
  desktop: { expanded: 176, collapsed: 74 },
  mobile: {
    simple: 64,
    filters: { expanded: 166, collapsed: 108 },
    archive: { expanded: 120, collapsed: 62 },
  },
} as const;

/** Tailwind md 브레이크포인트와 같은 값 */
export const MOBILE_QUERY = "(max-width: 767px)";
