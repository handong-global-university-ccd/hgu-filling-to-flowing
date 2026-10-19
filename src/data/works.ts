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
 * 개인 작품 — 시트 '시각'·'제품' 탭의 개인 명단 순서. 팀 작품과 분야는 같고 teamName 이 없어서
 * Works 왼쪽 칸의 개인 전시(Communication → Personal Project, AX → New Domestic, UX Product → Life Up Design)로 들어간다 (data/projects.ts).
 * TODO: 작품명·소제목·소개글이 시트에 아직 대부분 미작성 — 비어 있으면 title 은 임시로 디자이너 이름
 */
/** 시트에 작성된 개인 작품 내용 — 작품명(카드), 작품 제목·소제목·소개글(상세). designer slug 기준 */
const SHEET: Record<string, Partial<Pick<Work, "cardTitle" | "title" | "subtitle" | "description">>> = {
  "eunhye-lee": {
    cardTitle: "초로담: 부모님의 삶을 기록하는 디자인 에이전시",
    title: "초로담",
    subtitle: "Archive · Biography · Memoir",
    description:
      "초로담은 단순한 선물이 아닌 부모의 삶을 기록하고 보존하는 새로운 문화를 만든다.\n시간이 지나도 사라지지 않는 가족의 기억 아카이브를 제공하는 디자인 에이전시이다.",
  },
};

type Individual = { field: FieldKey; slug: string; designer: string; name: string } & (typeof SHEET)[string];

const INDIVIDUAL: Individual[] = [
  // 김시은·김지민 동명이인은 학번 → 팀으로 구분 (22100133 쩜오 sieun-kim / 22100134 이응부자 sieun-kim-2,
  // 22200184 섭이스 jimin-kim / 22100191 온감 jimin-kim-2). communication-02~13 은 팀 작품이라 01 다음은 14 부터
  ...(
    [
      ["jaehyeon-ko", "고재현"],
      ["gang-kim", "김강"],
      ["min-kim", "김민"],
      ["sieun-kim", "김시은"],
      ["sieun-kim-2", "김시은"],
      ["yehui-kim", "김예희"],
      ["yuna-kim", "김윤아"],
      ["jimin-kim", "김지민"],
      ["jimin-kim-2", "김지민"],
      ["hyeonjin-kim", "김현진"],
      ["huiwon-kim", "김희원"],
      ["seou-park", "박서우"],
      ["seohan-park", "박서한"],
      ["sihyeon-park", "박시현"],
      ["yerim-park", "박예림"],
      ["juhyeon-park", "박주현"],
      ["jiu-park", "박지우"],
      ["chanmi-park", "박찬미"],
      ["yewon-bang", "방예원"],
      ["usang-song", "송우상"],
      ["juhui-song", "송주희"],
      ["hayeon-song", "송하연"],
      ["yein-ahn", "안예인"],
      ["huiwon-oh", "오희원"],
      ["goeun-yoon", "윤고은"],
      ["dagyeong-lee", "이다경"],
      ["saehui-lee", "이새희"],
      ["seungjin-lee", "이승진"],
      ["yein-lee", "이예인"],
      ["yechan-lee", "이예찬"],
      ["eunhye-lee", "이은혜"],
      ["junhui-lee", "이준희"],
      ["jisu-lee", "이지수"],
      ["jina-lee", "이진아"],
      ["haram-lee", "이하람"],
      ["hanbin-lee", "이한빈"],
      ["haebin-lee", "이해빈"],
      ["hyewon-lee", "이혜원"],
      ["jiin-lim", "임지인"],
      ["minhui-jang", "장민희"],
      ["huiwon-jang", "장희원"],
      ["seohyeon-jeon", "전서현"],
      ["jueun-jung", "정주은"],
      ["seohyeon-cho", "조서현"],
      ["seoeun-chae", "채서은"],
      ["yunha-choi", "최윤하"],
      ["jueun-choi", "최주은"],
      ["jihyeon-ham", "함지현"],
      ["gyusang-hwang", "황규상"],
      ["hyeonsu-hwang", "황현수"],
    ] as const
  ).map(([designer, name], i) => ({
    field: "communication" as const,
    slug: i === 0 ? "communication-01" : `communication-${13 + i}`,
    designer,
    name,
    ...SHEET[designer],
  })),
  ...(
    [
      ["sinyeong-kong", "공신영"],
      ["sojeong-kim", "김소정"],
      ["yeongchae-kim", "김영채"],
      ["yebin-kim", "김예빈"],
      ["chaeeun-kim", "김채은"],
      ["hagyeong-kim-2", "김하경"],
      ["seyun-park", "박세윤"],
      ["yebin-park", "박예빈"],
      ["juhyeon-bang", "방주현"],
      ["jeonghun-song", "송정훈"],
      ["haram-yoo", "유하람"],
      ["hyeyeon-yoo", "유혜연"],
      ["seohyeon-lee", "이서현"],
      ["yunseo-lee", "이윤서"],
      ["jiwon-jang", "장지원"],
      ["suyeon-cha", "차수연"],
    ] as const
  ).map(([designer, name], i) => ({
    field: "ax-product" as const,
    slug: `industrial-${String(9 + i).padStart(2, "0")}`,
    designer,
    name,
  })),
  // ux-08~10 은 UX Space 팀 작품이 쓰고 있어서 ux-07 다음은 ux-11 부터
  ...(
    [
      ["eunjin-kim", "김은진"],
      ["jongbin-yoo", "유종빈"],
      ["juhui-lee", "이주희"],
      ["damin-park", "박다민"],
      ["yehan-jung", "정예한"],
      ["minseo-byun", "변민서"],
      ["yeongchan-han", "한영찬"],
      ["hyeonho-lim", "임현호"],
      ["daeun-park", "박다은"],
      ["chaewon-kim", "김채원"],
      ["jaeeun-jung", "정재은"],
      ["jinhui-lee", "이진희"],
    ] as const
  ).map(([designer, name], i) => ({
    field: "ux-product" as const,
    slug: i === 0 ? "ux-07" : `ux-${10 + i}`,
    designer,
    name,
  })),
];

const DUMMY = (n: number) => `/placeholder/dummy/works/work-${(n % 4) + 1}.webp`;
const DUMMY_PAGE = (n: number) => `/placeholder/thumb-0${(n % 8) + 1}a.svg`;

const INDIVIDUAL_WORKS: Work[] = INDIVIDUAL.map((x, i) => ({
  slug: x.slug,
  field: x.field,
  cardTitle: x.cardTitle,
  title: x.title ?? x.name,
  subtitle: x.subtitle ?? "서브 타이틀",
  description:
    x.description ??
    "본 작품은 일상 속에서 무심코 지나치는 감정과 장면을 새로운 시선으로 재해석한 프로젝트입니다. (더미 데이터 — 실제 작품 소개로 교체 예정)",
  designerSlugs: [x.designer],
  thumbnails: [DUMMY(i + 1), DUMMY(i + 2)],
  pages: [DUMMY_PAGE(i + 2), DUMMY_PAGE(i + 3), DUMMY_PAGE(i + 4)],
}));

/**
 * 구글 드라이브에서 받아 R2 로 올린 팀 사진(작품 상세 타이틀 위)이 있으면 그걸 쓴다.
 * media-manifest.json 은 `npm run pull:drive` 가 public/media 를 훑어 다시 쓴다 — 손으로 고치지 말 것.
 */
const MEDIA_WORKS = (media as { works: Record<string, string> }).works;
export const WORKS: Work[] = [...RAW_WORKS, ...INDIVIDUAL_WORKS].map((x) => ({
  ...x,
  photo: MEDIA_WORKS[x.slug] ?? x.photo,
}));

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
