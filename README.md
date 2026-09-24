# FILLING TO FLOWING — 2026 CCD Degree Show

한동대학교 콘텐츠융합디자인학부 2026 졸업전시 웹사이트

- 기간: 2026.11.04 – 11.08 · 한동대학교 제네시스홀
- 디자인: [Figma › 개발 최종](https://www.figma.com/design/QYS6YS5oAMvL2KRLItS10p/?node-id=1696-12737)

## 시작하기

```bash
nvm use            # Node 22
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
```

| 명령                                           | 설명                                           |
| ---------------------------------------------- | ---------------------------------------------- |
| `npm run dev`                                  | 개발 서버                                      |
| `npm run build`                                | 정적 빌드 → `out/`                             |
| `npm start`                                    | `out/` 미리보기                                |
| `npm run check`                                | 타입 + 린트 + 포맷 검사                        |
| `npm run format`                               | Prettier 자동 정렬 (Tailwind 클래스 순서 포함) |
| `npm run encode:video -- <가로> <세로> <이름>` | 에펙 원본 → 웹용 mp4·포스터 (ffmpeg 필요)      |
| `npm run upload:media`                         | `public/media/` → Cloudflare R2 (rclone 필요)  |

## 스택

Next.js 16 (App Router, static export) · React 19 · TypeScript · Tailwind CSS v4 · Motion · GSAP + ScrollTrigger · Lenis · three.js

## 구조

```
src/
├─ app/                    # 라우트
│  ├─ page.tsx             # 인트로 + 홈
│  ├─ works/[slug]/        # 작품 목록 / 상세
│  ├─ designers/[slug]/    # 디자이너 목록 / 프로필
│  ├─ archive/exhibition/  # 아카이브 Behind / Exhibition View
│  ├─ about/
│  └─ globals.css          # 디자인 토큰(@theme)
├─ components/
│  ├─ layout/              # Header(스크롤 축소) · Footer · PageShell
│  ├─ cursor/              # 십자 커서
│  ├─ media/               # ResponsiveVideo (가로/세로 영상 + 포스터)
│  ├─ intro/               # 인트로
│  ├─ home/                # 분야 아코디언 · Marquee
│  ├─ works/               # WorkCard(A↔B 교차) · WorksBrowser(탭·검색)
│  ├─ archive/             # ArchiveCanvas(마우스 팬 + 돋보기 확대)
│  └─ providers/           # Lenis 스무스 스크롤
├─ data/                   # 작품·디자이너 데이터와 타입
├─ hooks/  lib/  fonts/
scripts/
├─ encode-video.sh        # 영상 인코딩
└─ upload-media.sh        # R2 업로드
```

## 에셋 규칙

- 이미지: webp (썸네일 456×326 2장씩 — A/B 교차용)
- 작품 PDF → 페이지별 webp 로 변환해서 `work.pages` 에 등록
- 배경 영상: **글자 없는 버전**, 가로 1920×1080 + 세로 1080×1920, 각 5MB 안팎 + 첫 프레임 포스터
- 원본 영상은 `media-src/`(git 제외)에 두고 `npm run encode:video` 로 변환
- **영상·사진은 레포에 커밋하지 않는다.** `public/media/` 는 git 에서 제외되고 R2 로 올라간다
- **R2 로 갈 파일은 전부 `public/media/` 아래에 둔다.** 그 외 경로(`/placeholder/` 등)는 레포에 그대로 남는다
- 이 규칙은 `.gitignore` · `scripts/upload-media.sh` · `src/lib/asset.ts` 세 곳이 한 세트다

```
public/media/            ← git 제외, R2 로 업로드
├─ intro/                배경 영상 (bg-landscape.mp4 · bg-portrait.mp4 · *.webp)
├─ works/<slug>/          작품 썸네일 A/B · 상세 페이지 이미지
├─ designers/<slug>/      프로필 사진
└─ archive/behind/        비하인드 사진

public/brand/            ← git 에 커밋 (후원사·학부 로고 등 고정 이미지)
public/placeholder/      ← git 에 커밋 (더미 이미지)
src/fonts/               ← git 에 커밋 (woff2)
```

데이터 파일에는 `/media/` 부터 시작하는 경로를 적는다.

```ts
thumbnails: ["/media/works/generative-future/thumb-a.webp", "..."];
```

## 배포

사이트와 미디어를 따로 올린다.

|                      | 어디로           | 언제                                  |
| -------------------- | ---------------- | ------------------------------------- |
| 사이트 (HTML·JS·CSS) | Cloudflare Pages | `main` 에 push → 자동 빌드·배포       |
| 영상·사진            | Cloudflare R2    | `npm run upload:media` 로 직접 업로드 |

`main` 에 push 하면 프로덕션이 갱신되고, PR 을 올리면 그 브랜치 전용 프리뷰 URL 이 자동으로 생긴다.
미디어는 git 에 들어가지 않으므로 push 해도 올라가지 않는다 — 파일을 받을 때마다 따로 업로드할 것.

### Cloudflare Pages 설정 (최초 1회)

1. 대시보드 → Workers & Pages → Create → Pages → Connect to Git
2. `handong-global-university-ccd/hgu-filling-to-flowing` 선택
3. 빌드 설정
   - Build command: `npm run build`
   - Build output directory: `out`
   - Node 버전은 `.nvmrc`(22) 를 자동으로 따른다
4. Settings → Environment variables 에 `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ASSET_URL` 등록
   (Production / Preview 양쪽 모두)

### R2 설정 (최초 1회)

1. 대시보드 → R2 → Create bucket → `hgu-degree-2026`
2. 버킷 → Settings → Public access → **Connect Custom Domain** 으로 `cdn.<도메인>` 연결
   - `*.r2.dev` 주소는 캐시되지 않고 요청 제한이 있어 운영에 쓰지 않는다
3. Caching → Cache Rules 에서 해당 호스트에 **Cache Everything** 규칙 추가
   (기본값은 일부 확장자만 캐시한다)
4. R2 → Manage API tokens 에서 토큰 발급 → `rclone config` 에 등록
   (자세한 절차는 `scripts/upload-media.sh` 주석 참고)
5. `.env.local` 의 `NEXT_PUBLIC_ASSET_URL` 에 `https://cdn.<도메인>` 입력

### 도메인

아직 미정. 정해지기 전까지는 Pages 기본 주소(`<project>.pages.dev`)를 쓰고,
`NEXT_PUBLIC_ASSET_URL` 은 비워 둔다 (비어 있으면 `public/` 을 그대로 사용).

> 2024년 전시 사이트(`hguccd2024.co.kr`)는 도메인이 만료되어 접속이 불가능하다.
> 도메인을 정할 때 **갱신 주체와 유지 기간**을 함께 정해 둘 것.
