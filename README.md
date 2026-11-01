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
| `npm run pull:drive`                           | 구글 드라이브 프로필·팀 사진 → `public/media/` |
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

|                      | 어디로                           | 언제                                      |
| -------------------- | -------------------------------- | ----------------------------------------- |
| 사이트 (HTML·JS·CSS) | Cloudflare Pages                 | `main` 에 push → 자동 빌드·배포           |
| 영상·사진 원본       | Cloudflare R2 (비공개 창고)      | `npm run upload:media` 로 직접 업로드     |
| 영상·사진 서빙       | Cloudflare Pages (사이트와 같이) | 빌드 때 R2 → `public/media/` 로 자동 복사 |

```
upload:media          빌드 (build:pages)                    방문자
public/media ──→ R2 ──→ pull:media → next build → out/ ──→ Pages ──→ ccd.handong.edu
                 (API 키로만 접근, 공개 주소 없음)
```

- `main` 에 push 하면 프로덕션이 갱신되고, PR 을 올리면 그 브랜치 전용 프리뷰 URL 이 생긴다
- 미디어는 git 에 들어가지 않는다. 파일을 바꾸면 **`upload:media` 후 push(또는 Pages 에서 Retry deployment)** 해야 사이트에 반영된다
- 미디어 파일은 1개당 **25MB 이하** (Pages 한도). 넘으면 `upload:media` 와 빌드가 둘 다 멈춘다 → `encode:video` 로 다시 인코딩
- R2 에 학교 도메인을 붙이지 않는 이유: R2·Workers 커스텀 도메인은 도메인(handong.edu) 전체가 Cloudflare 에 있어야 한다. Pages 는 CNAME 만으로 연결된다

### R2 설정 (최초 1회)

1. 대시보드 → R2 → Create bucket → `hgu-degree-2026`
2. 버킷 → Settings → Public access 의 **r2.dev 주소는 꺼둔다** (Pages 가 서빙하므로 공개할 필요 없음)
3. R2 → Manage API tokens 에서 토큰 2개 발급
   - **업로드용** (Object Read & Write, 이 버킷만) → 내 컴퓨터 `rclone config` 에 등록 (`scripts/upload-media.sh` 주석 참고)
   - **빌드용** (Object Read only, 이 버킷만) → 아래 Pages 환경변수에 등록

### Pages 설정 (최초 1회)

1. 대시보드 → Workers & Pages → Create → **Pages** → Connect to Git
2. `handong-global-university-ccd/hgu-filling-to-flowing` 선택
3. 빌드 설정
   - Project name: `hgu-filling-to-flowing` → 기본 주소가 `hgu-filling-to-flowing.pages.dev` 가 된다
   - Production branch: `main`
   - Framework preset: `None`
   - Build command: `npm run build:pages`
   - Build output directory: `out`
   - Node 버전은 `.nvmrc`(22) 를 자동으로 따른다
4. Environment variables — **Production·Preview 둘 다**, 첫 배포 전에 등록 (없으면 빌드가 일부러 실패한다)

   | 이름                   | 값                              | 종류   |
   | ---------------------- | ------------------------------- | ------ |
   | `NEXT_PUBLIC_SITE_URL` | `https://ccd.handong.edu`       | Text   |
   | `R2_ACCOUNT_ID`        | Cloudflare 계정 ID              | Text   |
   | `R2_BUCKET`            | `hgu-degree-2026`               | Text   |
   | `R2_ACCESS_KEY_ID`     | 빌드용 토큰의 Access Key ID     | Secret |
   | `R2_SECRET_ACCESS_KEY` | 빌드용 토큰의 Secret Access Key | Secret |

   `NEXT_PUBLIC_ASSET_URL` 은 등록하지 않는다.

`wrangler.jsonc` 는 예전 Workers 배포용이다. `pages_build_output_dir` 가 없어서 Pages 빌드는 이 파일을 쓰지 않는다.
Workers 프로젝트를 삭제한 뒤에 지워도 된다.

### 구글 드라이브 사진

디자인팀이 드라이브 `프로필 to 개발자` 폴더에 올린 사진을 받아 웹용 webp 로 줄이고 slug 에 맞춰 넣는다.

1. (최초 1회) `rclone config` → 새 리모트 `gdrive`, storage `drive`, scope `2`(읽기 전용), 브라우저 로그인
2. `npm run pull:drive` — 받기 → 변환 → `src/data/media-manifest.json` 갱신 (manifest 는 커밋한다)
3. 결과에 나온 "건너뜀"·"사진 없음" 목록 확인 → `npm run upload:media`

드라이브 파일명 규칙 ('2026 졸업전시 웹사이트 정보 취합' 시트의 이름·팀명 그대로)

| 드라이브                     | 들어가는 곳                                             |
| ---------------------------- | ------------------------------------------------------- |
| `개인사진/<이름>.jpg`        | `public/media/designers/<slug>/profile.webp`            |
| `개인사진/<이름>_<팀명>.jpg` | 동명이인 구분 (예: `김시은_쩜오`, `김지민_섭이스`)      |
| `팀사진/<팀명>.jpg`          | `public/media/works/<slug>/photo.webp` (팀의 작품 전부) |

원본은 `media-src/drive/` 에 남는다 (git 제외). 사진을 바꾸면 다시 `pull:drive` → `upload:media`.
manifest 주소 끝에 내용 해시(`?v=`)가 붙어서, 같은 파일명으로 바꿔도 캐시된 옛 사진이 보이지 않는다.

### 도메인 — `ccd.handong.edu`

학교 정보인프라팀이 학교 DNS 에 CNAME 을 걸어 준다 (`ccd.handong.edu` → `hgu-filling-to-flowing.pages.dev`).
**순서를 지킬 것** — CNAME 이 먼저 걸리면 522 에러가 난다.

1. Pages 프로젝트 → Custom domains → Set up a domain → `ccd.handong.edu` 입력 (상태: 대기)
2. 도메인 신청서의 링크 주소 칸: `hgu-filling-to-flowing.pages.dev` (`https://`·끝의 `/` 없이)
3. 정보인프라팀이 CNAME 등록 → Pages 가 확인 후 SSL 인증서를 자동 발급 (학교 `*.handong.edu` 인증서 불필요)
   - handong.edu 에는 CAA 레코드가 없어서 발급이 막히지 않는다 (2026-10 확인)
4. 상태가 Active 가 되면 `https://ccd.handong.edu` 접속 확인

> 2024년 전시 사이트(`hguccd2024.co.kr`)는 도메인이 만료되어 접속이 불가능하다.
> 학교 도메인은 만료 걱정이 없지만, 전시가 끝난 뒤 **사이트 유지 기간**은 학부와 정해 둘 것.
