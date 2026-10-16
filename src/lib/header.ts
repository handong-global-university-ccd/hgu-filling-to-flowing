/**
 * 헤더 높이(px). 헤더가 fixed 라 본문(PageShell)이 같은 값만큼 내려와야 해서 한곳에 둔다.
 *
 * 데스크톱은 Figma 헤더 컴포넌트(1893:2320 / 1893:2360) 그대로,
 * 모바일(< 768px)은 Figma 모바일 시안(2499:4632 / 2499:4351) 기준 — 좌우 16, 로고 109×34, Menu 14/22.
 *   (아래 계산의 로고 38 은 여유분 포함 값 — 둘째 줄은 mt-auto 로 아래에 붙는다)
 *   단순 헤더   : 위 16 + 로고 38 + 아래 10                    = 64
 *   필터 헤더   : (2403:3553) 위 16 + 로고 34 + 33 + All 26 + 2 + 분야 26 + 아래 4 = 141 → 펼침
 *                 위 16 + All 26 + 2 + 분야 26 + 아래 4                         = 74  → 접힘
 *                 검색창은 돋보기를 누르면 로고 자리에 열린다
 *   아카이브    : 위 16 + 로고 38 + 20 + 탭 26 + 아래 20               = 120 → 펼침
 *                 위 16 + 탭 26 + 아래 20                              = 62  → 접힘
 */
export const HEADER_H = {
  desktop: { expanded: 176, collapsed: 74 },
  mobile: {
    simple: 64,
    filters: { expanded: 141, collapsed: 74 },
    archive: { expanded: 120, collapsed: 62 },
  },
} as const;

/** Tailwind md 브레이크포인트와 같은 값 */
export const MOBILE_QUERY = "(max-width: 767px)";
