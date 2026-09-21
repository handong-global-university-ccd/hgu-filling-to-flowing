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
scripts/encode-video.sh
```

## 에셋 규칙

- 이미지: webp (썸네일 456×326 2장씩 — A/B 교차용)
- 작품 PDF → 페이지별 webp 로 변환해서 `work.pages` 에 등록
- 배경 영상: **글자 없는 버전**, 가로 1920×1080 + 세로 1080×1920, 각 5MB 안팎 + 첫 프레임 포스터
- 원본 영상은 `media-src/`(git 제외)에 두고 `npm run encode:video` 로 변환

## 배포

`main` 에 push 하면 GitHub Actions 가 빌드 후 S3 업로드 + CloudFront 무효화.
Secrets: `AWS_ACCESS_KEY_ID` `AWS_SECRET_ACCESS_KEY` `AWS_S3_BUCKET` `AWS_CLOUDFRONT_ID`
Variables: `NEXT_PUBLIC_SITE_URL` `NEXT_PUBLIC_ASSET_URL`
