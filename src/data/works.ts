import type { FieldKey, Work } from "./types";
import media from "./media-manifest.json" with { type: "json" };

// 팀·참여자: '2026 졸업전시 웹사이트 정보 취합' 시트(시각·제품 탭) 기준.
// 시트 트랙 → 분야: AX Product → ax-product, Communication → communication, Service → service,
//                   UX Product → ux-product, UX Space → ux-space
// TODO: 작품명·소제목·소개글이 아직 미작성 — title 은 임시로 팀 이름(개인은 디자이너 이름).
//       이미지는 드라이브 '디그리 웹사이트' 더미(public/placeholder/dummy). pages 는 아직 SVG.
//       실제 작품이 들어오면 /media/works/<slug>/... 로 바꿀 것
const RAW_WORKS: Work[] = [
  {
    slug: "communication-01",
    field: "communication",
    title: "고재현",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    designerSlugs: ["jaehyeon-ko"],
    thumbnails: ["/placeholder/dummy/works/work-1.webp", "/placeholder/dummy/works/work-2.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-02a.svg", "/placeholder/thumb-03a.svg", "/placeholder/thumb-04a.svg"],
  },
  {
    slug: "communication-02",
    field: "communication",
    title: "유니콘",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "유니콘",
    designerSlugs: ["min-kim", "huiwon-kim", "seohyeon-jeon", "jueun-choi"],
    thumbnails: ["/placeholder/dummy/works/work-2.webp", "/placeholder/dummy/works/work-3.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-03a.svg", "/placeholder/thumb-04a.svg", "/placeholder/thumb-05a.svg"],
  },
  {
    slug: "communication-03",
    field: "communication",
    title: "쩜오",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "쩜오",
    designerSlugs: ["sieun-kim", "chanmi-park", "jiu-park", "yechan-lee"],
    thumbnails: ["/placeholder/dummy/works/work-3.webp", "/placeholder/dummy/works/work-4.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-04a.svg", "/placeholder/thumb-05a.svg", "/placeholder/thumb-06a.svg"],
  },
  {
    slug: "communication-04",
    field: "communication",
    title: "이응부자",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "이응부자",
    designerSlugs: ["sieun-kim-2", "yuna-kim", "hyewon-lee", "goeun-yoon"],
    thumbnails: ["/placeholder/dummy/works/work-4.webp", "/placeholder/dummy/works/work-1.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-05a.svg", "/placeholder/thumb-06a.svg", "/placeholder/thumb-07a.svg"],
  },
  {
    slug: "communication-05",
    field: "communication",
    title: "온감",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "온감",
    designerSlugs: ["jimin-kim-2", "jihyeon-ham", "huiwon-jang", "juhyeon-park"],
    thumbnails: ["/placeholder/dummy/works/work-1.webp", "/placeholder/dummy/works/work-2.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-06a.svg", "/placeholder/thumb-07a.svg", "/placeholder/thumb-08a.svg"],
  },
  {
    slug: "communication-06",
    field: "communication",
    title: "디와와",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "디와와",
    designerSlugs: ["seou-park", "hyeonsu-hwang", "seoeun-chae", "jisu-lee"],
    thumbnails: ["/placeholder/dummy/works/work-2.webp", "/placeholder/dummy/works/work-3.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-07a.svg", "/placeholder/thumb-08a.svg", "/placeholder/thumb-01a.svg"],
  },
  {
    slug: "communication-07",
    field: "communication",
    title: "디어",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "디어",
    designerSlugs: ["yein-ahn", "yewon-bang", "junhui-lee", "seohan-park", "sihyeon-park"],
    thumbnails: ["/placeholder/dummy/works/work-3.webp", "/placeholder/dummy/works/work-4.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-08a.svg", "/placeholder/thumb-01a.svg", "/placeholder/thumb-02a.svg"],
  },
  {
    slug: "communication-08",
    field: "communication",
    title: "ALLDP",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "ALLDP",
    designerSlugs: ["juhui-song", "gyusang-hwang", "seungjin-lee", "jina-lee"],
    thumbnails: ["/placeholder/dummy/works/work-4.webp", "/placeholder/dummy/works/work-1.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-01a.svg", "/placeholder/thumb-02a.svg", "/placeholder/thumb-03a.svg"],
  },
  {
    slug: "communication-09",
    field: "communication",
    title: "딛",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "딛",
    designerSlugs: ["gang-kim", "hyeonjin-kim", "eunhye-lee", "jiin-lim"],
    thumbnails: ["/placeholder/dummy/works/work-1.webp", "/placeholder/dummy/works/work-2.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-02a.svg", "/placeholder/thumb-03a.svg", "/placeholder/thumb-04a.svg"],
  },
  {
    slug: "communication-10",
    field: "communication",
    title: "섭이스",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "섭이스",
    designerSlugs: ["jimin-kim", "minhui-jang", "hanbin-lee", "huiwon-oh"],
    thumbnails: ["/placeholder/dummy/works/work-2.webp", "/placeholder/dummy/works/work-3.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-03a.svg", "/placeholder/thumb-04a.svg", "/placeholder/thumb-05a.svg"],
  },
  {
    slug: "communication-11",
    field: "communication",
    title: "SUPLY",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "SUPLY",
    designerSlugs: ["jaehyeon-ko", "yehui-kim", "hayeon-song", "saehui-lee"],
    thumbnails: ["/placeholder/dummy/works/work-3.webp", "/placeholder/dummy/works/work-4.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-04a.svg", "/placeholder/thumb-05a.svg", "/placeholder/thumb-06a.svg"],
  },
  {
    slug: "communication-12",
    field: "communication",
    title: "케샤!",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "케샤!",
    designerSlugs: ["jueun-jung", "haebin-lee", "yunha-choi", "yein-lee"],
    thumbnails: ["/placeholder/dummy/works/work-4.webp", "/placeholder/dummy/works/work-1.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-05a.svg", "/placeholder/thumb-06a.svg", "/placeholder/thumb-07a.svg"],
  },
  {
    slug: "communication-13",
    field: "communication",
    title: "오감자",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "오감자",
    designerSlugs: ["usang-song", "seohyeon-cho", "dagyeong-lee", "haram-lee", "yerim-park"],
    thumbnails: ["/placeholder/dummy/works/work-1.webp", "/placeholder/dummy/works/work-2.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-06a.svg", "/placeholder/thumb-07a.svg", "/placeholder/thumb-08a.svg"],
  },
  {
    slug: "service-01",
    field: "service",
    title: "유니콘",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "유니콘",
    designerSlugs: ["min-kim", "huiwon-kim", "seohyeon-jeon", "jueun-choi"],
    thumbnails: ["/placeholder/dummy/works/work-2.webp", "/placeholder/dummy/works/work-3.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-07a.svg", "/placeholder/thumb-08a.svg", "/placeholder/thumb-01a.svg"],
  },
  {
    slug: "service-02",
    field: "service",
    title: "쩜오",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "쩜오",
    designerSlugs: ["sieun-kim", "chanmi-park", "jiu-park", "yechan-lee"],
    thumbnails: ["/placeholder/dummy/works/work-3.webp", "/placeholder/dummy/works/work-4.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-08a.svg", "/placeholder/thumb-01a.svg", "/placeholder/thumb-02a.svg"],
  },
  {
    slug: "service-03",
    field: "service",
    title: "이응부자",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "이응부자",
    designerSlugs: ["sieun-kim-2", "yuna-kim", "hyewon-lee", "goeun-yoon"],
    thumbnails: ["/placeholder/dummy/works/work-4.webp", "/placeholder/dummy/works/work-1.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-01a.svg", "/placeholder/thumb-02a.svg", "/placeholder/thumb-03a.svg"],
  },
  {
    slug: "service-04",
    field: "service",
    title: "온감",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "온감",
    designerSlugs: ["jimin-kim-2", "jihyeon-ham", "huiwon-jang", "juhyeon-park"],
    thumbnails: ["/placeholder/dummy/works/work-1.webp", "/placeholder/dummy/works/work-2.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-02a.svg", "/placeholder/thumb-03a.svg", "/placeholder/thumb-04a.svg"],
  },
  {
    slug: "service-05",
    field: "service",
    title: "디와와",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "디와와",
    designerSlugs: ["seou-park", "hyeonsu-hwang", "seoeun-chae", "jisu-lee"],
    thumbnails: ["/placeholder/dummy/works/work-2.webp", "/placeholder/dummy/works/work-3.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-03a.svg", "/placeholder/thumb-04a.svg", "/placeholder/thumb-05a.svg"],
  },
  {
    slug: "service-06",
    field: "service",
    title: "디어",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "디어",
    designerSlugs: ["yein-ahn", "yewon-bang", "junhui-lee", "seohan-park", "sihyeon-park"],
    thumbnails: ["/placeholder/dummy/works/work-3.webp", "/placeholder/dummy/works/work-4.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-04a.svg", "/placeholder/thumb-05a.svg", "/placeholder/thumb-06a.svg"],
  },
  {
    slug: "service-07",
    field: "service",
    title: "ALLDP",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "ALLDP",
    designerSlugs: ["juhui-song", "gyusang-hwang", "seungjin-lee", "jina-lee"],
    thumbnails: ["/placeholder/dummy/works/work-4.webp", "/placeholder/dummy/works/work-1.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-05a.svg", "/placeholder/thumb-06a.svg", "/placeholder/thumb-07a.svg"],
  },
  {
    slug: "service-08",
    field: "service",
    title: "딛",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "딛",
    designerSlugs: ["gang-kim", "hyeonjin-kim", "eunhye-lee", "jiin-lim"],
    thumbnails: ["/placeholder/dummy/works/work-1.webp", "/placeholder/dummy/works/work-2.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-06a.svg", "/placeholder/thumb-07a.svg", "/placeholder/thumb-08a.svg"],
  },
  {
    slug: "service-09",
    field: "service",
    title: "섭이스",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "섭이스",
    designerSlugs: ["jimin-kim", "minhui-jang", "hanbin-lee", "huiwon-oh"],
    thumbnails: ["/placeholder/dummy/works/work-2.webp", "/placeholder/dummy/works/work-3.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-07a.svg", "/placeholder/thumb-08a.svg", "/placeholder/thumb-01a.svg"],
  },
  {
    slug: "service-10",
    field: "service",
    title: "SUPLY",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "SUPLY",
    designerSlugs: ["jaehyeon-ko", "yehui-kim", "hayeon-song", "saehui-lee"],
    thumbnails: ["/placeholder/dummy/works/work-3.webp", "/placeholder/dummy/works/work-4.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-08a.svg", "/placeholder/thumb-01a.svg", "/placeholder/thumb-02a.svg"],
  },
  {
    slug: "service-11",
    field: "service",
    title: "케샤!",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "케샤!",
    designerSlugs: ["jueun-jung", "haebin-lee", "yunha-choi", "yein-lee"],
    thumbnails: ["/placeholder/dummy/works/work-4.webp", "/placeholder/dummy/works/work-1.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-01a.svg", "/placeholder/thumb-02a.svg", "/placeholder/thumb-03a.svg"],
  },
  {
    slug: "service-12",
    field: "service",
    title: "오감자",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "오감자",
    designerSlugs: ["usang-song", "seohyeon-cho", "dagyeong-lee", "haram-lee", "yerim-park"],
    thumbnails: ["/placeholder/dummy/works/work-1.webp", "/placeholder/dummy/works/work-2.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-02a.svg", "/placeholder/thumb-03a.svg", "/placeholder/thumb-04a.svg"],
  },
  {
    slug: "industrial-01",
    field: "ax-product",
    title: "TETÉ",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "TETÉ",
    designerSlugs: ["sinyeong-kong"],
    thumbnails: ["/placeholder/dummy/works/work-2.webp", "/placeholder/dummy/works/work-3.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-03a.svg", "/placeholder/thumb-04a.svg", "/placeholder/thumb-05a.svg"],
  },
  {
    slug: "industrial-02",
    field: "ax-product",
    title: "빵꾸떵꾸",
    subtitle: "빵꾸떵꾸",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "빵꾸떵꾸",
    designerSlugs: ["sojeong-kim", "juhyeon-bang"],
    thumbnails: ["/placeholder/dummy/works/work-3.webp", "/placeholder/dummy/works/work-4.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-04a.svg", "/placeholder/thumb-05a.svg", "/placeholder/thumb-06a.svg"],
  },
  {
    slug: "industrial-03",
    field: "ax-product",
    title: "ReadyCook",
    subtitle: "ReadyCook",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "ReadyCook",
    designerSlugs: ["yeongchae-kim", "yebin-park"],
    thumbnails: ["/placeholder/dummy/works/work-4.webp", "/placeholder/dummy/works/work-1.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-05a.svg", "/placeholder/thumb-06a.svg", "/placeholder/thumb-07a.svg"],
  },
  {
    slug: "industrial-04",
    field: "ax-product",
    title: "SK한동닉스",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "SK한동닉스",
    designerSlugs: ["yebin-kim", "jeonghun-song"],
    thumbnails: ["/placeholder/dummy/works/work-1.webp", "/placeholder/dummy/works/work-2.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-06a.svg", "/placeholder/thumb-07a.svg", "/placeholder/thumb-08a.svg"],
  },
  {
    slug: "industrial-05",
    field: "ax-product",
    title: "Tic:OFF",
    subtitle: "Tic:OFF",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "Tic:OFF",
    designerSlugs: ["chaeeun-kim", "seohyeon-lee"],
    thumbnails: ["/placeholder/dummy/works/work-2.webp", "/placeholder/dummy/works/work-3.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-07a.svg", "/placeholder/thumb-08a.svg", "/placeholder/thumb-01a.svg"],
  },
  {
    slug: "industrial-06",
    field: "ax-product",
    title: "Packook",
    subtitle: "Packook",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "Packook",
    designerSlugs: ["seyun-park", "hyeyeon-yoo"],
    thumbnails: ["/placeholder/dummy/works/work-3.webp", "/placeholder/dummy/works/work-4.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-08a.svg", "/placeholder/thumb-01a.svg", "/placeholder/thumb-02a.svg"],
  },
  {
    slug: "industrial-07",
    field: "ax-product",
    title: "CHAYOO",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "CHAYOO",
    designerSlugs: ["suyeon-cha", "haram-yoo"],
    thumbnails: ["/placeholder/dummy/works/work-4.webp", "/placeholder/dummy/works/work-1.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-01a.svg", "/placeholder/thumb-02a.svg", "/placeholder/thumb-03a.svg"],
  },
  {
    slug: "industrial-08",
    field: "ax-product",
    title: "CoCare",
    subtitle: "CoCare",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "CoCare",
    designerSlugs: ["hagyeong-kim-2", "yunseo-lee", "jiwon-jang"],
    thumbnails: ["/placeholder/dummy/works/work-1.webp", "/placeholder/dummy/works/work-2.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-02a.svg", "/placeholder/thumb-03a.svg", "/placeholder/thumb-04a.svg"],
  },
  {
    slug: "industrial-09",
    field: "ax-product",
    title: "공신영",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    designerSlugs: ["sinyeong-kong"],
    thumbnails: ["/placeholder/dummy/works/work-2.webp", "/placeholder/dummy/works/work-3.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-03a.svg", "/placeholder/thumb-04a.svg", "/placeholder/thumb-05a.svg"],
  },
  {
    slug: "ux-01",
    field: "ux-product",
    title: "Forky",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "Forky",
    designerSlugs: ["eunjin-kim", "jongbin-yoo", "juhui-lee", "damin-park"],
    thumbnails: ["/placeholder/dummy/works/work-3.webp", "/placeholder/dummy/works/work-4.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-04a.svg", "/placeholder/thumb-05a.svg", "/placeholder/thumb-06a.svg"],
  },
  {
    slug: "ux-02",
    field: "ux-product",
    title: "F4",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "F4",
    designerSlugs: ["juyeon-jung", "yehan-jung", "minseo-byun", "juhyang-lee"],
    thumbnails: ["/placeholder/dummy/works/work-4.webp", "/placeholder/dummy/works/work-1.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-05a.svg", "/placeholder/thumb-06a.svg", "/placeholder/thumb-07a.svg"],
  },
  {
    slug: "ux-03",
    field: "ux-product",
    title: "J House",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "J House",
    designerSlugs: ["suwon-choi", "yewon-han", "yeongeun-choi"],
    thumbnails: ["/placeholder/dummy/works/work-1.webp", "/placeholder/dummy/works/work-2.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-06a.svg", "/placeholder/thumb-07a.svg", "/placeholder/thumb-08a.svg"],
  },
  {
    slug: "ux-04",
    field: "ux-product",
    title: "한",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "한",
    designerSlugs: ["yeongchan-han"],
    thumbnails: ["/placeholder/dummy/works/work-2.webp", "/placeholder/dummy/works/work-3.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-07a.svg", "/placeholder/thumb-08a.svg", "/placeholder/thumb-01a.svg"],
  },
  {
    slug: "ux-05",
    field: "ux-product",
    title: "푸딩그리",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "푸딩그리",
    designerSlugs: ["hyeonho-lim", "sarang-kim", "daeun-park", "seongeun-jung"],
    thumbnails: ["/placeholder/dummy/works/work-3.webp", "/placeholder/dummy/works/work-4.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-08a.svg", "/placeholder/thumb-01a.svg", "/placeholder/thumb-02a.svg"],
  },
  {
    slug: "ux-06",
    field: "ux-product",
    title: "FiveGuys",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "FiveGuys",
    designerSlugs: ["noeun-ki", "hagyeong-kim", "chaewon-kim", "jaeeun-jung", "jinhui-lee"],
    thumbnails: ["/placeholder/dummy/works/work-4.webp", "/placeholder/dummy/works/work-1.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-01a.svg", "/placeholder/thumb-02a.svg", "/placeholder/thumb-03a.svg"],
  },
  {
    slug: "ux-07",
    field: "ux-product",
    title: "김은진",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    designerSlugs: ["eunjin-kim"],
    thumbnails: ["/placeholder/dummy/works/work-1.webp", "/placeholder/dummy/works/work-2.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-02a.svg", "/placeholder/thumb-03a.svg", "/placeholder/thumb-04a.svg"],
  },
  {
    slug: "ux-08",
    field: "ux-space",
    title: "OB",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "OB",
    designerSlugs: ["noeun-ki", "juyeon-jung", "sarang-kim"],
    thumbnails: ["/placeholder/dummy/works/work-2.webp", "/placeholder/dummy/works/work-3.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-03a.svg", "/placeholder/thumb-04a.svg", "/placeholder/thumb-05a.svg"],
  },
  {
    slug: "ux-09",
    field: "ux-space",
    title: "동그리",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "동그리",
    designerSlugs: ["suwon-choi", "seongeun-jung", "yeongeun-choi"],
    thumbnails: ["/placeholder/dummy/works/work-3.webp", "/placeholder/dummy/works/work-4.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-04a.svg", "/placeholder/thumb-05a.svg", "/placeholder/thumb-06a.svg"],
  },
  {
    slug: "ux-10",
    field: "ux-space",
    title: "공3즈",
    subtitle: "서브 타이틀",
    description:
      "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
    teamName: "공3즈",
    designerSlugs: ["hagyeong-kim", "juhyang-lee", "yewon-han"],
    thumbnails: ["/placeholder/dummy/works/work-4.webp", "/placeholder/dummy/works/work-1.webp"],
    photo: "/placeholder/dummy/works/team-photo.webp",
    pages: ["/placeholder/thumb-05a.svg", "/placeholder/thumb-06a.svg", "/placeholder/thumb-07a.svg"],
  },
];

/**
 * 구글 드라이브에서 받아 R2 로 올린 팀 사진(작품 상세 타이틀 위)이 있으면 그걸 쓴다.
 * media-manifest.json 은 `npm run pull:drive` 가 public/media 를 훑어 다시 쓴다 — 손으로 고치지 말 것.
 */
const MEDIA_WORKS = (media as { works: Record<string, string> }).works;
export const WORKS: Work[] = RAW_WORKS.map((x) => ({ ...x, photo: MEDIA_WORKS[x.slug] ?? x.photo }));

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
