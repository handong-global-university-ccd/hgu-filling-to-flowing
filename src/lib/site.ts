export const SITE = {
  title: "FILLING TO FLOWING",
  fullTitle: "2026 한동대학교 콘텐츠융합디자인학부 졸업작품전",
  subtitle: "2026 Degree Show",
  period: "2026.11.04(수) - 11.08(일), 10:00 - 18:00",
  periodShort: { start: "2026. 11. 04", end: "11. 08" },
  place: "경상북도 포항시 북구 흥해읍 558 한동대학교 제네시스홀",
  org: ["Handong", "Global University", "CCD"],
  verse: {
    ref: "출애굽기 31:3",
    text: "채우심으로 말미암아 그에게 하나님의 영을 채워주어, 지혜와 총명과 지식과 온갖 기술을 갖추게 하겠다.",
  },
  contact: {
    email: "CCD@handong.ac.kr",
    instagram: "",
    behance: "",
  },
} as const;

export const NAV = [
  { href: "/about", label: "About" },
  { href: "/works", label: "Works" },
  { href: "/designers", label: "Designers" },
  { href: "/archive", label: "Archive" },
] as const;

/** Figma 원본 위치 — 구현할 때 해당 node를 열어서 확인 */
export const FIGMA = {
  fileKey: "QYS6YS5oAMvL2KRLItS10p",
  nodes: {
    intro: "1807:14129",
    home: "1807:14128",
    works: "1807:14578",
    workDetail: "1807:14520",
    designers: "1807:15014",
    designerDetail: "1807:15093",
    archiveBehind: "1807:15770",
    archiveExhibition: "1807:16563",
    about: "1807:15663",
    header: "1893:2320",
    footer: "1871:3934",
    color: "1900:14361",
    typography: "1900:14210",
  },
} as const;
