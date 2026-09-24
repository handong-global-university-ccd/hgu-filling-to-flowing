@AGENTS.md

# 2026 CCD Degree Show — FILLING TO FLOWING

한동대학교 콘텐츠융합디자인학부 2026 졸업전시 웹사이트.

## 스택

- Next.js 16 (App Router, `output: "export"` 정적 사이트) + React 19 + TypeScript
- Tailwind CSS v4 — 토큰은 `src/app/globals.css`의 `@theme` 에만 정의
- Motion(`motion/react`) — 등장·호버·레이아웃·페이지 전환
- GSAP + ScrollTrigger(`@/lib/gsap` 에서 import) + Lenis — 스크롤 연동, 마우스 추적
- three.js — 인트로 Liquid Distortion 전환 (WebGL)

## 디자인 원본

- Figma: https://www.figma.com/design/QYS6YS5oAMvL2KRLItS10p/?node-id=1696-12737 (페이지 "개발 최종")
- 화면별 node id 는 `src/lib/site.ts` 의 `FIGMA.nodes`
- 기준 해상도 1920×1080, 마진 24 / 거터 16, 12컬럼(`page-grid` 유틸)
- 폰트: 영문 Plus Jakarta Sans, 한글 Pretendard (한글 블록에는 `font-kr`)

## 규칙

- 색·폰트 크기는 하드코딩하지 말고 토큰 클래스 사용 (`text-fg-tertiary`, `text-body-sm`, `bg-bg-inverse` …)
- 이미지·영상 경로는 항상 `asset()` 으로 감싸기
- 영상·사진은 `public/media/` 에 두고 **커밋하지 않는다** (R2 로 업로드)
- R2 로 갈 파일은 전부 `public/media/` 아래. 데이터에도 `/media/...` 로 적는다
  (`works/<slug>/`, `designers/<slug>/`, `archive/behind/`, `intro/`)
- 이 규칙은 `.gitignore` · `scripts/upload-media.sh` · `src/lib/asset.ts` 세 곳이 한 세트다
- 로고·아이콘 등 **UI 이미지는 `public/media/` 에 넣지 않는다** (git 제외 대상이라 사라진다).
  로고타입·아이콘은 인라인 SVG 컴포넌트로, 후원사 로고 같은 고정 이미지는 `public/brand/` 에 둔다
- 배경 영상에 글자를 넣지 않는다. 영상은 `ResponsiveVideo`(가로/세로 + 포스터), 글자는 HTML
- 모든 모션은 `prefers-reduced-motion` 을 존중 (Motion `useReducedMotion`, GSAP 은 matchMedia 체크)
- 커스텀 커서·호버 전용 인터랙션은 마우스 기기(`useHasFinePointer`)에서만
- 호버로만 열리는 UI는 `onFocus` 도 같이 달아서 키보드로 접근 가능하게
- 동적 라우트는 `generateStaticParams` + `dynamicParams = false`
- `page.tsx` 에서는 default export 외 컴포넌트를 export 하지 않는다 (components/ 로 분리)
- 주석에 "변경 없음", "수정됨" 같은 대화형 메모를 남기지 않는다
- 커밋 전 `npm run check`

## 배포

- 사이트: Cloudflare Workers 정적 에셋 — `main` push 시 자동 빌드(`npm run build` → `out/`) 후 `npx wrangler deploy`
- 배포 설정은 `wrangler.jsonc`. 이 파일을 지우면 Cloudflare 가 OpenNext 자동 변환을 걸어 빌드가 깨진다
- 미디어: Cloudflare R2 — `npm run upload:media` 로 직접 업로드 (git 에 들어가지 않음)
- 최초 세팅 절차는 README 의 "배포" 참고

## 남은 작업 (TODO 검색)

- 인트로 → 홈 WebGL Liquid Distortion 전환 (`components/intro/`)
- 홈 전시 정보 스크롤 opacity, 분야 썸네일 랜덤 순서
- Designers 스크롤 단계 활성화 + 탭/검색
- Works 상세 Others 마키(호버 시 정지 + 제목 오버레이)
- 로고타입 SVG, Footer 서브비주얼, OG 이미지
- 모바일 레이아웃 (시안 없음 — 디자인팀과 협의 필요)
